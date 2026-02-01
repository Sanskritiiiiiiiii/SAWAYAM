from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

# ---------------------------
# CORS FIX
# ---------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# Dummy Database
# ---------------------------
users_db = []

# ---------------------------
# Models
# ---------------------------
class RegisterRequest(BaseModel):
    name: str
    email: str
    phone: str
    role: str


class LoginRequest(BaseModel):
    email: str
    role: str


class SOSRequest(BaseModel):
    user_email: Optional[str] = None
    location: Optional[str] = None
    emergency_type: Optional[str] = None


# ---------------------------
# Root Route
# ---------------------------
@app.get("/")
def root():
    return {"message": "SWAYAM Backend Running Successfully"}


# ---------------------------
# AUTH ROUTES
# ---------------------------
@app.post("/api/auth/register")
def register(user: RegisterRequest):

    for u in users_db:
        if u["email"] == user.email:
            raise HTTPException(status_code=400, detail="User already exists")

    users_db.append(user.dict())
    return user.dict()


@app.post("/api/auth/login")
def login(data: LoginRequest):

    for u in users_db:
        if u["email"] == data.email and u["role"] == data.role:
            return u

    raise HTTPException(status_code=404, detail="Account not found")


# ---------------------------
# IMPACT STATS ROUTE
# ---------------------------
@app.get("/api/stats/impact")
def impact_stats():
    return {
        "total_workers": 120,
        "total_jobs": 45,
        "sos_alerts": 8,
        "policies": 15
    }


# ---------------------------
# SOS ROUTE
# ---------------------------
@app.post("/api/sos/trigger")
def trigger_sos(data: SOSRequest):

    if not data.user_email:
        raise HTTPException(status_code=400, detail="User email required")

    return {
        "message": "SOS Alert Triggered Successfully",
        "status": "sent",
        "user": data.user_email,
        "location": data.location,
        "emergency_type": data.emergency_type
    }


# ---------------------------
# JOBS DATABASE
# ---------------------------
jobs_db = [
    {
        "id": "1",
        "title": "House Cleaning",
        "location": "Delhi",
        "pay": "₹500/day",
        "category": "Cleaning",
        "verified": True,
    },
    {
        "id": "2",
        "title": "Babysitting Job",
        "location": "Mumbai",
        "pay": "₹800/day",
        "category": "Care",
        "verified": True,
    },
    {
        "id": "3",
        "title": "Delivery Helper",
        "location": "Bangalore",
        "pay": "₹600/day",
        "category": "Delivery",
        "verified": False,
    },
]

# ---------------------------
# JOBS ROUTES
# ---------------------------
@app.get("/api/jobs")
def get_jobs():
    return jobs_db


@app.get("/api/jobs/{job_id}")
def get_job(job_id: str):

    for job in jobs_db:
        if job["id"] == job_id:
            return job

    raise HTTPException(status_code=404, detail="Job not found")


policies_db = [
    {
        "id": "POL001",
        "worker_email": "sanskritipal27@gmail.com",
        "job_title": "Food Delivery Partner",
        "activated_at": "2026-02-01",
        "fee_paid": 2,
        "status": "active",
        "coverage": {
            "medical": "Up to ₹50,000",
            "legal": "Free consultation + ₹25,000 support",
            "accident": "Up to ₹1,00,000",
            "harassment": "24/7 hotline + legal aid"
        }
    },
    {
        "id": "POL002",
        "worker_email": "sanskritipal27@gmail.com",
        "job_title": "Elderly Care Support",
        "activated_at": "2026-02-01",
        "fee_paid": 2,
        "status": "active",
        "coverage": {
            "medical": "Up to ₹50,000",
            "legal": "Free consultation + ₹25,000 support",
            "accident": "Up to ₹1,00,000",
            "harassment": "24/7 hotline + legal aid"
        }
    }
]



# ---------------------------
# SAFETY POLICIES ROUTES
# ---------------------------
@app.get("/api/safety/policies")
def get_all_policies():
    return policies_db


@app.get("/api/safety/policies/{email}")
def get_worker_policies(email: str):

    if email == "undefined":
        raise HTTPException(status_code=400, detail="Email not provided")

    worker_policies = [p for p in policies_db if p["worker_email"] == email]

    return worker_policies
