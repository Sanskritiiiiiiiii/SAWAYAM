from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

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
# Dummy Databases
# ---------------------------
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
        "created_at": datetime.now().isoformat()
    },
    {
        "id": "SCH002",
        "title": "Mahila Shakti Kendra",
        "description": "Women empowerment centers providing support services and guidance.",
        "benefits": "Skill training, employment linkage, counseling, legal aid support.",
        "eligibility": "All women, especially from rural and vulnerable backgrounds.",
        "category": "Welfare",
        "external_link": "https://wcd.nic.in/",
        "created_at": datetime.now().isoformat()
    },
    {
        "id": "SCH003",
        "title": "PM SVANidhi - Street Vendor Loan",
        "description": "Affordable working capital loan for street vendors to restart businesses.",
        "benefits": "Initial loan ₹10,000, can increase up to ₹50,000 with repayment.",
        "eligibility": "Street vendors, hawkers, small workers with vending certificate.",
        "category": "Loan",
        "external_link": "https://pmsvanidhi.mohua.gov.in/",
        "created_at": datetime.now().isoformat()
    },
    {
        "id": "SCH004",
        "title": "Skill India - PMKVY",
        "description": "Free skill development training programs for women to boost employment.",
        "benefits": "Certified training, placement assistance, reward up to ₹8,000.",
        "eligibility": "Women seeking employment or self-employment opportunities.",
        "category": "Training",
        "external_link": "https://www.pmkvyofficial.org/",
        "created_at": datetime.now().isoformat()
    },
    {
        "id": "SCH005",
        "title": "Ayushman Bharat - Health Insurance",
        "description": "Free health insurance coverage up to ₹5 lakh per family.",
        "benefits": "Cashless treatment at empaneled hospitals across India.",
        "eligibility": "Poor and vulnerable families based on SECC data.",
        "category": "Healthcare",
        "external_link": "https://pmjay.gov.in/",
        "created_at": datetime.now().isoformat()
    }
]


# ---------------------------
# Models
# ---------------------------
class RegisterRequest(BaseModel):
    name: str
    email: str
    phone: str
    role: str

    # Phase 2 Add-ons
    skills: List[str] = []
    verifications: Dict[str, bool] = {
        "phone_verified": False,
        "id_verified": False,
        "reference_verified": False
    }


class LoginRequest(BaseModel):
    email: str
    role: str


class SOSRequest(BaseModel):
    user_email: Optional[str] = None
    location: Optional[str] = None
    emergency_type: Optional[str] = None


# Skill Update Model
class UpdateSkills(BaseModel):
    skills: List[str]


# Verification Update Model
class UpdateVerification(BaseModel):
    verification_type: str
    status: bool


# Rating Models
class RatingCreate(BaseModel):
    job_id: str
    rater_email: str
    ratee_email: str
    rating: int
    review: Optional[str] = None


# Scheme Model
class Scheme(BaseModel):
    id: str
    name: str
    category: str
    state: str
    eligibility: str
    link: str


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
# WORKER SKILLS & VERIFICATION
# ---------------------------
@app.patch("/api/workers/{worker_email}/skills")
def update_worker_skills(worker_email: str, update: UpdateSkills):

    for user in users_db:
        if user["email"] == worker_email and user["role"] == "worker":
            user["skills"] = update.skills
            return {"message": "Skills updated", "skills": user["skills"]}

    raise HTTPException(status_code=404, detail="Worker not found")


@app.patch("/api/workers/{worker_email}/verification")
def update_worker_verification(worker_email: str, update: UpdateVerification):

    for user in users_db:
        if user["email"] == worker_email and user["role"] == "worker":

            user["verifications"][update.verification_type] = update.status

            return {
                "message": "Verification updated",
                "verifications": user["verifications"]
            }

    raise HTTPException(status_code=404, detail="Worker not found")


# ---------------------------
# RATINGS ROUTES
# ---------------------------
@app.post("/api/ratings")
def create_rating(rating_data: RatingCreate):

    rating_entry = rating_data.dict()
    rating_entry["created_at"] = datetime.now().isoformat()
    ratings_db.append(rating_entry)

    return {"message": "Rating submitted successfully", "rating": rating_entry}


@app.get("/api/ratings/user/{user_email}")
def get_user_ratings(user_email: str):

    user_ratings = [r for r in ratings_db if r["ratee_email"] == user_email]
    return user_ratings


@app.get("/api/ratings/job/{job_id}")
def check_job_rated(job_id: str, user_email: str):

    for r in ratings_db:
        if r["job_id"] == job_id and r["rater_email"] == user_email:
            return {"rated": True}

    return {"rated": False}


# ---------------------------
# GOVERNMENT SCHEMES ROUTES
# ---------------------------
@app.get("/api/schemes")
def get_schemes(category: Optional[str] = None, state: Optional[str] = None):

    results = schemes_db

    if category:
        results = [s for s in results if s["category"].lower() == category.lower()]

    if state:
        results = [s for s in results if s["state"].lower() == state.lower()]

    return results


@app.get("/api/schemes/{scheme_id}")
def get_scheme(scheme_id: str):

    for scheme in schemes_db:
        if scheme["id"] == scheme_id:
            return scheme

    raise HTTPException(status_code=404, detail="Scheme not found")


# ---------------------------
# IMPACT STATS ROUTE
# ---------------------------
@app.get("/api/stats/impact")
def impact_stats():
    return {
        "total_workers": len(users_db),
        "total_jobs": 45,
        "sos_alerts": 8,
        "policies": 15
    }


# ---------------------------
# JOBS DATABASE
# ---------------------------
jobs_db = [
    {
        "id": "1",
        "title": "House Cleaning",
        "location": "Delhi",
        "pay": 500,
        "category": "Cleaning",
        "duration": "3 hours",

        "status": "open",   # ✅ ADD THIS

        "verified": True,
    },
    {
        "id": "2",
        "title": "Babysitting Job",
        "location": "Mumbai",
        "pay": 800,
        "category": "Care",
        "duration": "5 hours",

        "status": "open",   # ✅ ADD THIS

        "verified": True,
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
