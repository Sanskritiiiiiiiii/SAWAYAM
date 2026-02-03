import asyncio
import os
import uuid
from datetime import datetime, timezone

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME")


async def seed_database():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    print("\nResetting database collections...\n")

    # Clear old data
    await db.users.delete_many({})
    await db.jobs.delete_many({})
    await db.safety_policies.delete_many({})
    await db.sos_alerts.delete_many({})

    # ---------------- USERS ---------------- #

    workers = [
        {
            "id": str(uuid.uuid4()),
            "name": "Priya Sharma",
            "email": "priya@worker.com",
            "phone": "+91-9876543210",
            "role": "worker",
            "verified": True,
            "rating": 4.8,
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Anjali Devi",
            "email": "anjali@worker.com",
            "phone": "+91-9876543211",
            "role": "worker",
            "verified": True,
            "rating": 4.9,
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Lakshmi Reddy",
            "email": "lakshmi@worker.com",
            "phone": "+91-9876543212",
            "role": "worker",
            "verified": True,
            "rating": 4.7,
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
    ]

    employers = [
        {
            "id": str(uuid.uuid4()),
            "name": "Rajesh Kumar",
            "email": "rajesh@employer.com",
            "phone": "+91-9876543220",
            "role": "employer",
            "verified": True,
            "rating": 4.6,
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Meera Patel",
            "email": "meera@employer.com",
            "phone": "+91-9876543221",
            "role": "employer",
            "verified": True,
            "rating": 4.8,
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
    ]

    await db.users.insert_many(workers + employers)

    # ---------------- JOBS ---------------- #

    jobs = [
        {
            "id": str(uuid.uuid4()),
            "title": "House Cleaning Service",
            "category": "Cleaning",
            "description": "Need cleaning for a 2BHK apartment (kitchen + bathrooms).",
            "location": "Koramangala, Bangalore",
            "pay": 600.0,
            "duration": "3 hours",
            "employer_id": employers[0]["id"],
            "employer_name": employers[0]["name"],
            "status": "open",
            "worker_id": None,
            "worker_name": None,
            "safety_fee": 2.0,
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Food Delivery Partner",
            "category": "Delivery",
            "description": "Deliver food orders nearby. Own vehicle required.",
            "location": "Indiranagar, Bangalore",
            "pay": 400.0,
            "duration": "4 hours",
            "employer_id": employers[1]["id"],
            "employer_name": employers[1]["name"],
            "status": "open",
            "worker_id": None,
            "worker_name": None,
            "safety_fee": 2.0,
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Beauty Services at Home",
            "category": "Beauty",
            "description": "Bridal makeup + hairstyling for a function.",
            "location": "Whitefield, Bangalore",
            "pay": 2500.0,
            "duration": "5 hours",
            "employer_id": employers[0]["id"],
            "employer_name": employers[0]["name"],
            "status": "open",
            "worker_id": None,
            "worker_name": None,
            "safety_fee": 2.0,
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Math Tutor (Class 10)",
            "category": "Tutoring",
            "description": "Need tutor for CBSE Class 10 maths prep.",
            "location": "HSR Layout, Bangalore",
            "pay": 800.0,
            "duration": "2 hours daily",
            "employer_id": employers[1]["id"],
            "employer_name": employers[1]["name"],
            "status": "open",
            "worker_id": None,
            "worker_name": None,
            "safety_fee": 2.0,
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Home Cooking Service",
            "category": "Cooking",
            "description": "Cook North Indian meals for family of 4.",
            "location": "Jayanagar, Bangalore",
            "pay": 1000.0,
            "duration": "2 hours",
            "employer_id": employers[0]["id"],
            "employer_name": employers[0]["name"],
            "status": "open",
            "worker_id": None,
            "worker_name": None,
            "safety_fee": 2.0,
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Elderly Care Support",
            "category": "Caregiving",
            "description": "Companion care + light support for elderly person.",
            "location": "Malleswaram, Bangalore",
            "pay": 700.0,
            "duration": "6 hours",
            "employer_id": employers[1]["id"],
            "employer_name": employers[1]["name"],
            "status": "open",
            "worker_id": None,
            "worker_name": None,
            "safety_fee": 2.0,
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
                {
            "id": str(uuid.uuid4()),
            "title": "Grocery Delivery Partner",
            "category": "Delivery",
            "description": "Deliver groceries within 3km radius. Flexible timings.",
            "location": "JP Nagar, Bangalore",
            "pay": 500.0,
            "duration": "3 hours",
            "employer_id": employers[0]["id"],
            "employer_name": employers[0]["name"],
            "status": "open",
            "worker_id": None,
            "worker_name": None,
            "safety_fee": 2.0,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Home Deep Cleaning Service",
            "category": "Cleaning",
            "description": "Need deep cleaning for kitchen and bathrooms.",
            "location": "BTM Layout, Bangalore",
            "pay": 900.0,
            "duration": "4 hours",
            "employer_id": employers[1]["id"],
            "employer_name": employers[1]["name"],
            "status": "open",
            "worker_id": None,
            "worker_name": None,
            "safety_fee": 2.0,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Part-Time Babysitting",
            "category": "Caregiving",
            "description": "Looking for babysitter for a 2-year-old child in evenings.",
            "location": "Marathahalli, Bangalore",
            "pay": 700.0,
            "duration": "3 hours",
            "employer_id": employers[0]["id"],
            "employer_name": employers[0]["name"],
            "status": "open",
            "worker_id": None,
            "worker_name": None,
            "safety_fee": 2.0,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Mehendi Artist for Function",
            "category": "Beauty",
            "description": "Need mehendi artist for small family event.",
            "location": "Electronic City, Bangalore",
            "pay": 1500.0,
            "duration": "2 hours",
            "employer_id": employers[1]["id"],
            "employer_name": employers[1]["name"],
            "status": "open",
            "worker_id": None,
            "worker_name": None,
            "safety_fee": 2.0,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Cooking Assistance for Party",
            "category": "Cooking",
            "description": "Need cooking assistant for weekend house party preparation.",
            "location": "Jayanagar, Bangalore",
            "pay": 1200.0,
            "duration": "5 hours",
            "employer_id": employers[0]["id"],
            "employer_name": employers[0]["name"],
            "status": "open",
            "worker_id": None,
            "worker_name": None,
            "safety_fee": 2.0,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Tailoring & Alteration Work",
            "category": "Tailoring",
            "description": "Need blouse stitching and minor alterations.",
            "location": "Malleshwaram, Bangalore",
            "pay": 600.0,
            "duration": "2 days",
            "employer_id": employers[1]["id"],
            "employer_name": employers[1]["name"],
            "status": "open",
            "worker_id": None,
            "worker_name": None,
            "safety_fee": 2.0,
            "created_at": datetime.now(timezone.utc).isoformat()
        },

    ]

    await db.jobs.insert_many(jobs)

    print("Database ready.")
    print(f"Users: {len(workers)} workers, {len(employers)} employers")
    print(f"Jobs added: {len(jobs)}\n")

    client.close()


if __name__ == "__main__":
    asyncio.run(seed_database())
