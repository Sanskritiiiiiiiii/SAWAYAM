from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from typing import Optional, List, Dict
from datetime import datetime

app = FastAPI()


# Allow frontend to call backend APIs
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------
# In-memory dummy storage
# -----------------------
users_db = []
ratings_db = []

schemes_db = [
    {
        "id": "SCH001",
        "title": "Mudra Loan for Women Entrepreneurs",
        "description": "Loan scheme for women starting small businesses with no collateral required.",
        "benefits": "Loans up to ₹10 lakh under Shishu, Kishore, and Tarun categories.",
        "eligibility": "Women entrepreneurs, self-employed, small business owners.",
        "category": "Loan",
        "external_link": "https://www.mudra.org.in/",
        "created_at": datetime.now().isoformat(),
    },
    {
        "id": "SCH002",
        "title": "Mahila Shakti Kendra",
        "description": "Women empowerment centers providing support services and guidance.",
        "benefits": "Skill training, employment linkage, counseling, legal aid support.",
        "eligibility": "All women, especially from rural and vulnerable backgrounds.",
        "category": "Welfare",
        "external_link": "https://wcd.nic.in/",
        "created_at": datetime.now().isoformat(),
    },
]


jobs_db = [
    {
        "id": "1",
        "title": "House Cleaning",
        "location": "Delhi",
        "pay": 500,
        "category": "Cleaning",
        "duration": "3 hours",
        "status": "open",
        "verified": True,
    },
    {
        "id": "2",
        "title": "Babysitting Job",
        "location": "Mumbai",
        "pay": 800,
        "category": "Caregiving",
        "duration": "5 hours",
        "status": "open",
        "verified": True,
    },
]


# -----------------------
# Request Models
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


class RatingCreate(BaseModel):
    job_id: str
    rater_email: str
    ratee_email: str
    rating: int
    review: Optional[str] = None


# -----------------------
# Root Check
# -----------------------
@app.get("/")
def root():
    return {"message": "SWAYAM Backend Running Successfully"}


# -----------------------
# Auth APIs
# -----------------------
@app.post("/api/auth/register")
def register(user: RegisterRequest):
    if any(u["email"] == user.email for u in users_db):
        raise HTTPException(status_code=400, detail="User already exists")

    users_db.append(user.dict())
    return user.dict()


@app.post("/api/auth/login")
def login(data: LoginRequest):
    for u in users_db:
        if u["email"] == data.email and u["role"] == data.role:
            return u

    raise HTTPException(status_code=404, detail="Account not found")


# -----------------------
# Worker Profile Updates
# -----------------------
@app.patch("/api/workers/{worker_email}/skills")
def update_worker_skills(worker_email: str, update: Dict[str, List[str]]):
    for u in users_db:
        if u["email"] == worker_email and u["role"] == "worker":
            u["skills"] = update["skills"]
            return {"message": "Skills updated", "skills": u["skills"]}

    raise HTTPException(status_code=404, detail="Worker not found")


@app.patch("/api/workers/{worker_email}/verification")
def update_worker_verification(worker_email: str, update: Dict[str, bool]):
    for u in users_db:
        if u["email"] == worker_email and u["role"] == "worker":
            key = update["verification_type"]
            u["verifications"][key] = update["status"]

            return {
                "message": "Verification updated",
                "verifications": u["verifications"],
            }

    raise HTTPException(status_code=404, detail="Worker not found")


# -----------------------
# Ratings APIs
# -----------------------
@app.post("/api/ratings")
def create_rating(rating_data: RatingCreate):
    entry = rating_data.dict()
    entry["created_at"] = datetime.now().isoformat()

    ratings_db.append(entry)
    return {"message": "Rating submitted successfully", "rating": entry}


@app.get("/api/ratings/user/{user_email}")
def get_user_ratings(user_email: str):
    return [r for r in ratings_db if r["ratee_email"] == user_email]


@app.get("/api/ratings/job/{job_id}")
def check_job_rated(job_id: str, user_email: str):
    rated = any(
        r["job_id"] == job_id and r["rater_email"] == user_email
        for r in ratings_db
    )
    return {"rated": rated}


# -----------------------
# Government Schemes APIs
# -----------------------
@app.get("/api/schemes")
def get_schemes(category: Optional[str] = None):
    if not category:
        return schemes_db

    return [
        s for s in schemes_db
        if s["category"].lower() == category.lower()
    ]


@app.get("/api/schemes/{scheme_id}")
def get_scheme(scheme_id: str):
    for scheme in schemes_db:
        if scheme["id"] == scheme_id:
            return scheme

    raise HTTPException(status_code=404, detail="Scheme not found")


# -----------------------
# Impact Stats API
# -----------------------
@app.get("/api/stats/impact")
def impact_stats():
    return {
        "total_workers": len(users_db),
        "total_jobs": len(jobs_db),
        "policies_activated": 15,
        "sos_responded": 8,
    }


# -----------------------
# Jobs APIs
# -----------------------
@app.get("/api/jobs")
def get_jobs():
    return jobs_db


@app.get("/api/jobs/{job_id}")
def get_job(job_id: str):
    for job in jobs_db:
        if job["id"] == job_id:
            return job

    raise HTTPException(status_code=404, detail="Job not found")
