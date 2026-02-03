from fastapi import FastAPI, APIRouter, HTTPException
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.encoders import jsonable_encoder

from dotenv import load_dotenv
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Literal
from datetime import datetime, timezone
import uuid
import os
import logging


# Load environment variables
BASE_DIR = Path(__file__).parent
load_dotenv(BASE_DIR / ".env")

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]


app = FastAPI()
router = APIRouter(prefix="/api")


# Default safety coverage (₹2 model)
DEFAULT_COVERAGE = {
    "Medical Emergency": "Up to ₹50,000",
    "Legal Aid": "Free consultation + ₹25,000 support",
    "Accident Protection": "Up to ₹1,00,000",
    "Harassment Support": "24/7 hotline + legal help"
}


# -------------------- Models --------------------

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str
    name: str
    email: str
    phone: str
    role: Literal["worker", "employer"]
    verified: bool = True
    created_at: datetime


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

    id: str
    title: str
    category: str
    description: str
    location: str
    pay: float
    duration: str

    employer_id: str
    employer_name: str

    status: str = "open"
    worker_id: Optional[str] = None
    worker_name: Optional[str] = None

    safety_fee: float = 2.0
    created_at: datetime


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
    coverage: dict = Field(default_factory=lambda: DEFAULT_COVERAGE)

    activated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "active"


class SOSCreate(BaseModel):
    worker_id: str
    worker_name: str
    location: str
    emergency_type: str


class SOSAlert(SOSCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "triggered"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Scheme(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str
    title: str
    description: str
    category: str
    eligibility: str
    benefits: str
    how_to_apply: str
    external_link: Optional[str] = None
    created_at: datetime


# -------------------- Routes --------------------

@router.get("/")
async def home():
    return {"message": "SWAYAM Backend Running ✅"}


# Auth routes
@router.post("/auth/register", response_model=User)
async def register(user_data: UserCreate):

    existing = await db.users.find_one(
        {"email": user_data.email, "role": user_data.role},
        {"_id": 0}
    )

    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    user = {
        "id": str(uuid.uuid4()),
        **user_data.model_dump(),
        "verified": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    await db.users.insert_one(user)
    user["created_at"] = datetime.fromisoformat(user["created_at"])

    return User(**user)


@router.post("/auth/login", response_model=User)
async def login(login_data: LoginRequest):

    user = await db.users.find_one(
        {"email": login_data.email, "role": login_data.role},
        {"_id": 0}
    )

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user["created_at"] = datetime.fromisoformat(user["created_at"])
    return User(**user)


# Jobs routes
@router.get("/jobs", response_model=List[Job])
async def browse_jobs():
    jobs = await db.jobs.find({"status": "open"}, {"_id": 0}).to_list(1000)

    for job in jobs:
        job["created_at"] = datetime.fromisoformat(job["created_at"])

    return jobs


# ✅ Job Details Route (FIXED)
@router.get("/jobs/{job_id}", response_model=Job)
async def get_job(job_id: str):

    job = await db.jobs.find_one({"id": job_id}, {"_id": 0})

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if isinstance(job.get("created_at"), str):
        job["created_at"] = datetime.fromisoformat(job["created_at"])

    return Job(**job)


@router.post("/jobs", response_model=Job)
async def post_job(job_data: JobCreate):

    job = {
        "id": str(uuid.uuid4()),
        **job_data.model_dump(),
        "status": "open",
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    await db.jobs.insert_one(job)
    job["created_at"] = datetime.fromisoformat(job["created_at"])

    return Job(**job)


# ✅ Worker Accepted Jobs Route (FIXED)
@router.get("/jobs/worker/{worker_id}", response_model=List[Job])
async def get_worker_jobs(worker_id: str):

    jobs = await db.jobs.find(
        {"worker_id": worker_id},
        {"_id": 0}
    ).to_list(1000)

    for job in jobs:
        if isinstance(job.get("created_at"), str):
            job["created_at"] = datetime.fromisoformat(job["created_at"])

    return jobs


@router.post("/jobs/{job_id}/apply")
async def apply_job(job_id: str, apply_data: JobApply):

    job = await db.jobs.find_one({"id": job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job["status"] != "open":
        raise HTTPException(status_code=400, detail="Job already assigned")

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
        job_title=job["title"],
        worker_id=apply_data.worker_id,
        worker_name=apply_data.worker_name
    )

    doc = policy.model_dump()
    doc["activated_at"] = doc["activated_at"].isoformat()

    await db.safety_policies.insert_one(doc)

    return {"message": "Job accepted successfully", "policy_id": policy.id}


# Safety policies
@router.get("/safety/policies/{worker_id}")
async def get_policies(worker_id: str):

    policies = await db.safety_policies.find(
        {"worker_id": worker_id},
        {"_id": 0}
    ).to_list(1000)

    return jsonable_encoder(policies)


# SOS alerts
@router.post("/sos/trigger", response_model=SOSAlert)
async def trigger_sos(data: SOSCreate):

    alert = SOSAlert(**data.model_dump())
    doc = alert.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()

    await db.sos_alerts.insert_one(doc)
    return alert


# Schemes
@router.get("/schemes", response_model=List[Scheme])
async def schemes():
    schemes = await db.schemes.find({}, {"_id": 0}).to_list(1000)

    for s in schemes:
        if isinstance(s["created_at"], str):
            s["created_at"] = datetime.fromisoformat(s["created_at"])

    return schemes


# Impact stats
@router.get("/stats/impact")
async def impact():

    return {
        "total_workers": await db.users.count_documents({"role": "worker"}),
        "total_employers": await db.users.count_documents({"role": "employer"}),
        "total_jobs": await db.jobs.count_documents({}),
        "policies_activated": await db.safety_policies.count_documents({}),
        "sos_responded": await db.sos_alerts.count_documents({})
    }


# -------------------- App Config --------------------

app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)


@app.on_event("shutdown")
async def shutdown():
    client.close()
