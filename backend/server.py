from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.responses import JSONResponse
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

# Import auth utilities
from auth import (
    hash_password, 
    verify_password, 
    create_access_token,
    get_current_user,
    get_current_admin,
    get_current_worker,
    get_current_employer
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ============ CENTRALIZED ERROR HANDLING ============

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": exc.status_code,
                "message": exc.detail
            }
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "code": 500,
                "message": "Internal server error"
            }
        }
    )

# ============ MODELS ============

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    password: str  # Hashed password
    role: Literal["worker", "employer", "admin"] = "worker"
    verified: bool = False
    rating: float = 0.0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    skills: List[str] = []
    verifications: dict = {
        "phone_verified": False,
        "id_verified": False,
        "reference_verified": False
    }
    total_ratings: int = 0
    average_rating: float = 0.0

class UserResponse(BaseModel):
    """User response without password"""
    id: str
    name: str
    email: str
    phone: str
    role: str
    verified: bool
    rating: float
    created_at: datetime
    skills: List[str] = []
    verifications: dict = {}
    total_ratings: int = 0
    average_rating: float = 0.0

class UserCreate(BaseModel):
    name: str
    email: str
    phone: str
    password: str
    role: Literal["worker", "employer"] = "worker"

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

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


# ===== NEW MODELS FOR PHASE 2 =====

class Rating(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    job_id: str
    job_title: str
    rater_id: str
    rater_name: str
    rater_role: Literal["worker", "employer"]
    ratee_id: str
    ratee_name: str
    ratee_role: Literal["worker", "employer"]
    rating: int = Field(ge=1, le=5)
    review: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class RatingCreate(BaseModel):
    job_id: str
    job_title: str
    rater_id: str
    rater_name: str
    rater_role: Literal["worker", "employer"]
    ratee_id: str
    ratee_name: str
    ratee_role: Literal["worker", "employer"]
    rating: int = Field(ge=1, le=5)
    review: Optional[str] = None

class Scheme(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    category: str
    eligibility: str
    benefits: str
    how_to_apply: str
    external_link: Optional[str] = None
    state: Optional[str] = None
    icon: str = "shield"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UpdateSkills(BaseModel):
    skills: List[str]

class UpdateVerification(BaseModel):
    verification_type: Literal["phone_verified", "id_verified", "reference_verified"]
    status: bool

# ============ API ENDPOINTS ============

@api_router.get("/")
async def root():
    return {"message": "SWAYAM API - Smart Work Assurance for Women"}

# ===== AUTH =====
@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    # Check if user already exists
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_password = hash_password(user_data.password)
    
    # Create user with hashed password
    user_dict = user_data.model_dump()
    user_dict['password'] = hashed_password
    user = User(**user_dict)
    
    doc = user.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.users.insert_one(doc)
    
    # Create access token
    access_token = create_access_token(
        data={
            "sub": user.id,
            "email": user.email,
            "role": user.role,
            "name": user.name
        }
    )
    
    # Return token with user info (without password)
    user_response = UserResponse(**{k: v for k, v in user.model_dump().items() if k != 'password'})
    
    return TokenResponse(
        access_token=access_token,
        user=user_response
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(login_data: LoginRequest):
    # Find user by email
    user = await db.users.find_one({"email": login_data.email}, {"_id": 0})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Verify password
    if not verify_password(login_data.password, user['password']):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Convert datetime if needed
    if isinstance(user['created_at'], str):
        user['created_at'] = datetime.fromisoformat(user['created_at'])
    
    # Create access token
    access_token = create_access_token(
        data={
            "sub": user['id'],
            "email": user['email'],
            "role": user['role'],
            "name": user['name']
        }
    )
    
    # Return token with user info (without password)
    user_obj = User(**user)
    user_response = UserResponse(**{k: v for k, v in user_obj.model_dump().items() if k != 'password'})
    
    return TokenResponse(
        access_token=access_token,
        user=user_response
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current logged-in user info"""
    user = await db.users.find_one({"id": current_user["id"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if isinstance(user['created_at'], str):
        user['created_at'] = datetime.fromisoformat(user['created_at'])
    
    user_obj = User(**user)
    return UserResponse(**{k: v for k, v in user_obj.model_dump().items() if k != 'password'})

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
async def create_job(job_data: JobCreate, current_user: dict = Depends(get_current_employer)):
    """Create new job - Employer only"""
    job = Job(**job_data.model_dump())
    doc = job.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.jobs.insert_one(doc)
    return job

@api_router.post("/jobs/{job_id}/apply")
async def apply_job(job_id: str, apply_data: JobApply, current_user: dict = Depends(get_current_worker)):
    """Apply for job - Worker only"""
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


# ===== ADMIN ONLY ENDPOINTS =====
@api_router.get("/admin/users", response_model=List[UserResponse])
async def get_all_users(current_user: dict = Depends(get_current_admin)):
    """Get all users - Admin only"""
    users = await db.users.find({}, {"_id": 0}).to_list(1000)
    result = []
    for user in users:
        if isinstance(user['created_at'], str):
            user['created_at'] = datetime.fromisoformat(user['created_at'])
        user_obj = User(**user)
        result.append(UserResponse(**{k: v for k, v in user_obj.model_dump().items() if k != 'password'}))
    return result

@api_router.delete("/admin/users/{user_id}")
async def delete_user(user_id: str, current_user: dict = Depends(get_current_admin)):
    """Delete user - Admin only"""
    result = await db.users.delete_one({"id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

@api_router.patch("/admin/users/{user_id}/verify")
async def verify_user(user_id: str, current_user: dict = Depends(get_current_admin)):
    """Verify user - Admin only"""
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": {"verified": True}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User verified successfully"}

@api_router.get("/admin/stats")
async def get_admin_stats(current_user: dict = Depends(get_current_admin)):
    """Get detailed admin statistics"""
    total_users = await db.users.count_documents({})
    total_workers = await db.users.count_documents({"role": "worker"})
    total_employers = await db.users.count_documents({"role": "employer"})
    total_jobs = await db.jobs.count_documents({})
    active_jobs = await db.jobs.count_documents({"status": "assigned"})
    completed_jobs = await db.jobs.count_documents({"status": "completed"})
    total_policies = await db.safety_policies.count_documents({})
    total_sos = await db.sos_alerts.count_documents({})
    
    return {
        "users": {
            "total": total_users,
            "workers": total_workers,
            "employers": total_employers
        },
        "jobs": {
            "total": total_jobs,
            "active": active_jobs,
            "completed": completed_jobs
        },
        "safety": {
            "policies_activated": total_policies,
            "sos_alerts": total_sos
        }
    }


# ===== SKILLS & VERIFICATION (PHASE 2) =====
@api_router.patch("/workers/{worker_id}/skills")
async def update_worker_skills(worker_id: str, update: UpdateSkills):
    result = await db.users.update_one(
        {"id": worker_id, "role": "worker"},
        {"$set": {"skills": update.skills}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Worker not found")
    return {"message": "Skills updated successfully"}

@api_router.patch("/workers/{worker_id}/verification")
async def update_verification(worker_id: str, update: UpdateVerification):
    result = await db.users.update_one(
        {"id": worker_id, "role": "worker"},
        {"$set": {f"verifications.{update.verification_type}": update.status}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Worker not found")
    return {"message": "Verification updated successfully"}

# ===== RATINGS (PHASE 2) =====
@api_router.post("/ratings", response_model=Rating)
async def create_rating(rating_data: RatingCreate):
    rating = Rating(**rating_data.model_dump())
    doc = rating.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.ratings.insert_one(doc)
    
    ratings_cursor = db.ratings.find({"ratee_id": rating_data.ratee_id}, {"_id": 0, "rating": 1})
    ratings = await ratings_cursor.to_list(1000)
    
    if ratings:
        total_rating = sum(r['rating'] for r in ratings)
        avg_rating = round(total_rating / len(ratings), 1)
        
        await db.users.update_one(
            {"id": rating_data.ratee_id},
            {"$set": {
                "average_rating": avg_rating,
                "total_ratings": len(ratings)
            }}
        )
    
    return rating

@api_router.get("/ratings/user/{user_id}", response_model=List[Rating])
async def get_user_ratings(user_id: str):
    ratings = await db.ratings.find({"ratee_id": user_id}, {"_id": 0}).to_list(1000)
    for rating in ratings:
        if isinstance(rating['created_at'], str):
            rating['created_at'] = datetime.fromisoformat(rating['created_at'])
    return ratings

@api_router.get("/ratings/job/{job_id}")
async def check_job_rated(job_id: str, user_id: str):
    rating = await db.ratings.find_one({
        "job_id": job_id,
        "rater_id": user_id
    }, {"_id": 0})
    return {"rated": rating is not None}

# ===== GOVERNMENT SCHEMES (PHASE 2) =====
@api_router.get("/schemes", response_model=List[Scheme])
async def get_schemes(category: Optional[str] = None, state: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    if state:
        query["state"] = state
    
    schemes = await db.schemes.find(query, {"_id": 0}).to_list(1000)
    for scheme in schemes:
        if isinstance(scheme['created_at'], str):
            scheme['created_at'] = datetime.fromisoformat(scheme['created_at'])
    return schemes

@api_router.get("/schemes/{scheme_id}", response_model=Scheme)
async def get_scheme(scheme_id: str):
    scheme = await db.schemes.find_one({"id": scheme_id}, {"_id": 0})
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    
    if isinstance(scheme['created_at'], str):
        scheme['created_at'] = datetime.fromisoformat(scheme['created_at'])
    return Scheme(**scheme)

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