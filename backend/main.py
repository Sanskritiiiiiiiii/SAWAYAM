from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import jwt
from database import users_collection, jobs_collection

app = FastAPI()

SECRET_KEY = "SWAYAM_SUPER_SECRET_KEY"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(p, hp):
    return pwd_context.verify(p, hp)

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- MODELS ----------------
class RegisterRequest(BaseModel):
    name: str
    email: str
    phone: str
    role: str
    password: str
    skills: List[str] = []

class LoginRequest(BaseModel):
    email: str
    password: str

class OnboardingStepRequest(BaseModel):
    email: str
    step: int

class WorkModeRequest(BaseModel):
    email: str
    work_mode: str

class VerificationRequest(BaseModel):
    email: str
    verifications: Dict[str, bool]

class ApplyJobRequest(BaseModel):
    worker_email: str
    worker_name: str

class SOSRequest(BaseModel):
    emergency_type: str
    location: Optional[str] = None

# ---------------- ROOT ----------------
@app.get("/")
def root():
    return {"message": "SWAYAM Backend Running Successfully"}

# ---------------- AUTH ----------------
@app.post("/api/auth/register")
def register(user: RegisterRequest):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="User already exists")

    users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "role": user.role,
        "password": hash_password(user.password),
        "onboarding_step": 1,
        "is_verified": False,
        "work_mode": None,
        "verifications": {
            "phone_verified": False,
            "id_verified": False,
            "safety_agreement": False,
        },
        "trust_metrics": {
            "completed_jobs": 0,
            "safety_score": 100,
            "rating": 5.0,
        },
        "created_at": datetime.now().isoformat(),
    })

    return {"message": "User registered successfully"}

@app.post("/api/auth/login")
def login(data: LoginRequest):
    user = users_collection.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(
        {"sub": user["email"], "role": user["role"]},
        timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return {
        "access_token": token,
        "user": {
            "email": user["email"],
            "name": user["name"],
            "role": user["role"],
        }
    }

# ---------------- ONBOARDING ----------------
@app.get("/api/onboarding/status")
def onboarding_status(email: str):
    user = users_collection.find_one(
        {"email": email},
        {"_id": 0,"onboarding_step": 1,"work_mode": 1,"verifications": 1,"is_verified": 1}
    )
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# ---------------- TRUST SCORE ----------------
@app.get("/api/trust-score/{worker_email}")
def get_trust_score(worker_email: str):

    user = users_collection.find_one({"email": worker_email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    metrics = user.get("trust_metrics", {})
    completed = metrics.get("completed_jobs", 0)
    rating = metrics.get("rating", 5.0)
    safety_score = metrics.get("safety_score", 100)

    trust_score = min(
        100,
        int(40 + completed*5 + rating*5 + safety_score*0.2)
    )

    return {"trust_score": trust_score}

# ---------------- JOBS ----------------
@app.get("/api/jobs")
def get_jobs(status: Optional[str] = None):
    query = {"status": status} if status else {}
    return list(jobs_collection.find(query, {"_id": 0}))

@app.get("/api/jobs/{job_id}")
def get_single_job(job_id: str):
    job = jobs_collection.find_one({"id": job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

# ---------------- APPLY JOB WITH TRUST CHECK ----------------
@app.post("/api/jobs/{job_id}/apply")
def apply_job(job_id: str, data: ApplyJobRequest):

    job = jobs_collection.find_one({"id": job_id})
    if not job or job.get("status") != "open":
        raise HTTPException(status_code=400, detail="Job unavailable")

    user = users_collection.find_one({"email": data.worker_email})
    if not user:
        raise HTTPException(status_code=404, detail="Worker not found")

    metrics = user.get("trust_metrics", {})
    completed = metrics.get("completed_jobs", 0)
    rating = metrics.get("rating", 5.0)
    safety_score = metrics.get("safety_score", 100)

    trust_score = min(
        100,
        int(40 + completed*5 + rating*5 + safety_score*0.2)
    )

    required = job.get("min_trust_score", 40)

    if trust_score < required:
        raise HTTPException(
            status_code=403,
            detail=f"Trust Score {trust_score} required {required}"
        )

    jobs_collection.update_one(
        {"id": job_id},
        {"$set": {
            "status": "assigned",
            "assigned_to": data.worker_email,
            "assigned_at": datetime.now().isoformat(),
        }},
    )

    return {"message": "Job accepted successfully"}

# ---------------- SOS ----------------
@app.post("/api/sos/trigger")
def trigger_sos(data: SOSRequest):
    return {"message": "SOS triggered successfully"}

# ---------------- DASHBOARD ----------------
@app.get("/api/dashboard/{worker_email}")
def get_worker_dashboard(worker_email: str):

    total_jobs = jobs_collection.count_documents({"assigned_to": worker_email})
    completed_jobs = jobs_collection.count_documents({"assigned_to": worker_email,"status": "completed"})
    in_progress = jobs_collection.count_documents({"assigned_to": worker_email,"status": {"$in": ["assigned","in_progress"]}})

    earnings_pipeline = [
        {"$match":{"assigned_to": worker_email,"status": "completed"}},
        {"$group":{"_id": None,"total": {"$sum": "$payment"}}}
    ]
    earnings_data = list(jobs_collection.aggregate(earnings_pipeline))
    total_earnings = earnings_data[0]["total"] if earnings_data else 0

    return {
        "total_jobs": total_jobs,
        "completed_jobs": completed_jobs,
        "in_progress": in_progress,
        "earnings": total_earnings
    }

# ---------------- WEEKLY JOB ANALYTICS ----------------
@app.get("/api/weekly-jobs/{worker_email}")
def get_weekly_jobs(worker_email: str):

    pipeline = [
        {"$match":{"assigned_to": worker_email,"status": "completed"}},
        {"$group":{
            "_id":{"$dayOfWeek":{"$toDate": "$assigned_at"}},
            "count":{"$sum": 1}
        }}
    ]

    raw_data = list(jobs_collection.aggregate(pipeline))

    week_map = {1:"Sun",2:"Mon",3:"Tue",4:"Wed",5:"Thu",6:"Fri",7:"Sat"}
    formatted=[]

    for i in range(1,8):
        day=next((x for x in raw_data if x["_id"]==i),None)
        formatted.append({"day":week_map[i],"jobs":day["count"] if day else 0})

    return formatted
