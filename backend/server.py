from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Literal
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ============ MODELS ============

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    role: Literal["worker", "employer"]
    verified: bool = False
    rating: float = 0.0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    name: str
    email: str
    phone: str
    role: Literal["worker", "employer"]

class LoginRequest(BaseModel):
    email: str
    role: Literal["worker", "employer"]

class Job(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    category: str
    description: str
    location: str
    pay: float
    duration: str
    employer_id: str
    employer_name: str
    status: Literal["open", "assigned", "completed"] = "open"
    worker_id: Optional[str] = None
    worker_name: Optional[str] = None
    safety_fee: float = 2.0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class JobCreate(BaseModel):
    title: str
    category: str
    description: str
    location: str
    pay: float
    duration: str
    employer_id: str
    employer_name: str

class JobApply(BaseModel):
    worker_id: str
    worker_name: str

class SafetyPolicy(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    job_id: str
    job_title: str
    worker_id: str
    worker_name: str
    fee_paid: float = 2.0
    coverage: dict = {
        "medical": "Up to ₹50,000",
        "legal": "Free consultation + ₹25,000 support",
        "accident": "Up to ₹1,00,000",
        "harassment": "24/7 hotline + legal aid"
    }
    activated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: Literal["active", "expired", "used"] = "active"

class SafetyPolicyCreate(BaseModel):
    job_id: str
    job_title: str
    worker_id: str
    worker_name: str

class SOSAlert(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    worker_id: str
    worker_name: str
    job_id: Optional[str] = None
    location: str
    emergency_type: str
    status: Literal["triggered", "responded", "resolved"] = "triggered"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SOSCreate(BaseModel):
    worker_id: str
    worker_name: str
    job_id: Optional[str] = None
    location: str
    emergency_type: str

class ImpactStats(BaseModel):
    total_workers: int
    total_jobs: int
    policies_activated: int
    sos_responded: int

# ============ API ENDPOINTS ============

@api_router.get("/")
async def root():
    return {"message": "SWAYAM API - Smart Work Assurance for Women"}

# ===== AUTH =====
@api_router.post("/auth/register", response_model=User)
async def register(user_data: UserCreate):
    existing = await db.users.find_one({"email": user_data.email, "role": user_data.role}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    
    user = User(**user_data.model_dump())
    doc = user.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.users.insert_one(doc)
    return user

@api_router.post("/auth/login", response_model=User)
async def login(login_data: LoginRequest):
    user = await db.users.find_one({"email": login_data.email, "role": login_data.role}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if isinstance(user['created_at'], str):
        user['created_at'] = datetime.fromisoformat(user['created_at'])
    return User(**user)

# ===== JOBS =====
@api_router.get("/jobs", response_model=List[Job])
async def get_jobs(status: Optional[str] = None, category: Optional[str] = None):
    query = {}
    if status:
        query["status"] = status
    if category:
        query["category"] = category
    
    jobs = await db.jobs.find(query, {"_id": 0}).to_list(1000)
    for job in jobs:
        if isinstance(job['created_at'], str):
            job['created_at'] = datetime.fromisoformat(job['created_at'])
    return jobs

@api_router.get("/jobs/{job_id}", response_model=Job)
async def get_job(job_id: str):
    job = await db.jobs.find_one({"id": job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if isinstance(job['created_at'], str):
        job['created_at'] = datetime.fromisoformat(job['created_at'])
    return Job(**job)

@api_router.post("/jobs", response_model=Job)
async def create_job(job_data: JobCreate):
    job = Job(**job_data.model_dump())
    doc = job.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.jobs.insert_one(doc)
    return job

@api_router.post("/jobs/{job_id}/apply")
async def apply_job(job_id: str, apply_data: JobApply):
    job = await db.jobs.find_one({"id": job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job['status'] != "open":
        raise HTTPException(status_code=400, detail="Job is not available")
    
    await db.jobs.update_one(
        {"id": job_id},
        {"$set": {
            "status": "assigned",
            "worker_id": apply_data.worker_id,
            "worker_name": apply_data.worker_name
        }}
    )
    
    policy = SafetyPolicy(
        job_id=job_id,
        job_title=job['title'],
        worker_id=apply_data.worker_id,
        worker_name=apply_data.worker_name
    )
    policy_doc = policy.model_dump()
    policy_doc['activated_at'] = policy_doc['activated_at'].isoformat()
    await db.safety_policies.insert_one(policy_doc)
    
    return {"message": "Job applied successfully", "policy_id": policy.id}

@api_router.get("/jobs/worker/{worker_id}", response_model=List[Job])
async def get_worker_jobs(worker_id: str):
    jobs = await db.jobs.find({"worker_id": worker_id}, {"_id": 0}).to_list(1000)
    for job in jobs:
        if isinstance(job['created_at'], str):
            job['created_at'] = datetime.fromisoformat(job['created_at'])
    return jobs

@api_router.get("/jobs/employer/{employer_id}", response_model=List[Job])
async def get_employer_jobs(employer_id: str):
    jobs = await db.jobs.find({"employer_id": employer_id}, {"_id": 0}).to_list(1000)
    for job in jobs:
        if isinstance(job['created_at'], str):
            job['created_at'] = datetime.fromisoformat(job['created_at'])
    return jobs

# ===== WORKERS =====
@api_router.get("/workers", response_model=List[User])
async def get_workers():
    workers = await db.users.find({"role": "worker"}, {"_id": 0}).to_list(1000)
    for worker in workers:
        if isinstance(worker['created_at'], str):
            worker['created_at'] = datetime.fromisoformat(worker['created_at'])
    return workers

@api_router.get("/workers/{worker_id}", response_model=User)
async def get_worker(worker_id: str):
    worker = await db.users.find_one({"id": worker_id, "role": "worker"}, {"_id": 0})
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    if isinstance(worker['created_at'], str):
        worker['created_at'] = datetime.fromisoformat(worker['created_at'])
    return User(**worker)

# ===== SAFETY POLICIES =====
@api_router.get("/safety/policies/{worker_id}", response_model=List[SafetyPolicy])
async def get_worker_policies(worker_id: str):
    policies = await db.safety_policies.find({"worker_id": worker_id}, {"_id": 0}).to_list(1000)
    for policy in policies:
        if isinstance(policy['activated_at'], str):
            policy['activated_at'] = datetime.fromisoformat(policy['activated_at'])
    return policies

@api_router.get("/safety/policy/{policy_id}", response_model=SafetyPolicy)
async def get_policy(policy_id: str):
    policy = await db.safety_policies.find_one({"id": policy_id}, {"_id": 0})
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    
    if isinstance(policy['activated_at'], str):
        policy['activated_at'] = datetime.fromisoformat(policy['activated_at'])
    return SafetyPolicy(**policy)

# ===== SOS =====
@api_router.post("/sos/trigger", response_model=SOSAlert)
async def trigger_sos(sos_data: SOSCreate):
    sos = SOSAlert(**sos_data.model_dump())
    doc = sos.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.sos_alerts.insert_one(doc)
    return sos

@api_router.get("/sos/alerts/{worker_id}", response_model=List[SOSAlert])
async def get_worker_alerts(worker_id: str):
    alerts = await db.sos_alerts.find({"worker_id": worker_id}, {"_id": 0}).to_list(1000)
    for alert in alerts:
        if isinstance(alert['created_at'], str):
            alert['created_at'] = datetime.fromisoformat(alert['created_at'])
    return alerts

# ===== STATS =====
@api_router.get("/stats/impact", response_model=ImpactStats)
async def get_impact_stats():
    total_workers = await db.users.count_documents({"role": "worker"})
    total_jobs = await db.jobs.count_documents({})
    policies_activated = await db.safety_policies.count_documents({})
    sos_responded = await db.sos_alerts.count_documents({"status": {"$in": ["responded", "resolved"]}})
    
    return ImpactStats(
        total_workers=total_workers,
        total_jobs=total_jobs,
        policies_activated=policies_activated,
        sos_responded=sos_responded
    )

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()