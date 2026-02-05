from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

from database import (
    users_collection,
    jobs_collection,
    schemes_collection,
    policies_collection,
)

app = FastAPI()

# -----------------------
# CORS
# -----------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------
# Models
# -----------------------
class RegisterRequest(BaseModel):
    name: str
    email: str
    phone: str
    role: str
    skills: List[str] = []
    verifications: Dict[str, bool] = {
        "phone_verified": False,
        "id_verified": False,
        "reference_verified": False,
    }

class LoginRequest(BaseModel):
    email: str
    role: str

class ApplyJobRequest(BaseModel):
    worker_email: str
    worker_name: str

class SOSRequest(BaseModel):
    emergency_type: str
    location: Optional[str] = None

# -----------------------
# Root
# -----------------------
@app.get("/")
def root():
    return {"message": "SWAYAM Backend Running Successfully"}

# -----------------------
# Auth
# -----------------------
@app.post("/api/auth/register")
def register(user: RegisterRequest):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="User already exists")

    users_collection.insert_one(user.dict())
    return user.dict()

@app.post("/api/auth/login")
def login(data: LoginRequest):
    user = users_collection.find_one(
        {"email": data.email, "role": data.role},
        {"_id": 0},
    )
    if not user:
        raise HTTPException(status_code=404, detail="Account not found")
    return user

# -----------------------
# Jobs
# -----------------------
@app.get("/api/jobs")
def get_jobs(status: Optional[str] = None):
    query = {}
    if status:
        query["status"] = status
    return list(jobs_collection.find(query, {"_id": 0}))

@app.get("/api/jobs/{job_id}")
def get_job(job_id: str):
    job = jobs_collection.find_one({"id": job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

# ✅ THIS IS THE FIXED ENDPOINT
@app.post("/api/jobs/{job_id}/apply")
def apply_job(job_id: str, data: ApplyJobRequest):
    worker = users_collection.find_one({
        "email": data.worker_email,
        "role": "worker",
    })

    if not worker:
        raise HTTPException(status_code=401, detail="Worker not found")

    job = jobs_collection.find_one({"id": job_id})

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.get("status") != "open":
        raise HTTPException(status_code=400, detail="Job already taken")

    # Assign job
    jobs_collection.update_one(
        {"id": job_id},
        {
            "$set": {
                "status": "assigned",
                "assigned_to": data.worker_email,
                "assigned_at": datetime.now().isoformat(),
            }
        },
    )

    # Activate safety policy
    policy_id = f"POL-{job_id[-6:]}"
    policies_collection.insert_one({
        "policy_id": policy_id,
        "job_id": job_id,
        "worker_email": data.worker_email,
        "status": "active",
        "activated_at": datetime.now().isoformat(),
    })

    return {
        "message": "Job accepted successfully",
        "policy_id": policy_id,
    }

# -----------------------
# Dashboard
# -----------------------
@app.get("/api/dashboard")
def get_dashboard(worker_email: Optional[str] = None):
    if not worker_email:
        return {
            "activeJobs": 0,
            "completedJobs": 0,
            "earnings": 0,
            "safetyPolicies": 0,
        }

    active_jobs = jobs_collection.count_documents({
        "assigned_to": worker_email,
        "status": "assigned",
    })

    completed_jobs = jobs_collection.count_documents({
        "assigned_to": worker_email,
        "status": "completed",
    })

    policies = policies_collection.count_documents({
        "worker_email": worker_email
    })

    return {
        "activeJobs": active_jobs,
        "completedJobs": completed_jobs,
        "earnings": 0,
        "safetyPolicies": policies,
    }

# -----------------------
# Safety
# -----------------------
@app.get("/api/safety/policies")
def get_safety_policies(worker_email: Optional[str] = None):
    query = {}
    if worker_email:
        query["worker_email"] = worker_email
    return list(policies_collection.find(query, {"_id": 0}))

@app.post("/api/sos/trigger")
def trigger_sos(data: SOSRequest):
    return {
        "message": "SOS triggered successfully",
        "hotline": "1800-SWAYAM-911",
        "details": {
            "type": data.emergency_type,
            "location": data.location,
            "time": datetime.now().isoformat(),
        },
    }

# -----------------------
# Schemes
# -----------------------
@app.get("/api/schemes")
def get_schemes(category: Optional[str] = None):
    query = {}
    if category:
        query["category"] = {"$regex": f"^{category}$", "$options": "i"}
    return list(schemes_collection.find(query, {"_id": 0}))

@app.get("/api/schemes/{scheme_id}")
def get_scheme(scheme_id: str):
    scheme = schemes_collection.find_one({"id": scheme_id}, {"_id": 0})
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return scheme
