import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from datetime import datetime, timezone
import uuid

load_dotenv()

mongo_url = os.environ['MONGO_URL']
db_name = os.environ['DB_NAME']

async def seed_database():
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print("Clearing existing data...")
    await db.users.delete_many({})
    await db.jobs.delete_many({})
    await db.safety_policies.delete_many({})
    await db.sos_alerts.delete_many({})
    
    print("Seeding users...")
    workers = [
        {
            "id": str(uuid.uuid4()),
            "name": "Priya Sharma",
            "email": "priya@worker.com",
            "phone": "+91-9876543210",
            "role": "worker",
            "verified": True,
            "rating": 4.8,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Anjali Devi",
            "email": "anjali@worker.com",
            "phone": "+91-9876543211",
            "role": "worker",
            "verified": True,
            "rating": 4.9,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Lakshmi Reddy",
            "email": "lakshmi@worker.com",
            "phone": "+91-9876543212",
            "role": "worker",
            "verified": True,
            "rating": 4.7,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
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
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Meera Patel",
            "email": "meera@employer.com",
            "phone": "+91-9876543221",
            "role": "employer",
            "verified": True,
            "rating": 4.8,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.users.insert_many(workers + employers)
    
    print("Seeding jobs...")
    jobs = [
        {
            "id": str(uuid.uuid4()),
            "title": "House Cleaning Service",
            "category": "Cleaning",
            "description": "Need professional cleaning for 2BHK apartment. Kitchen, bathrooms, and living areas.",
            "location": "Koramangala, Bangalore",
            "pay": 600.0,
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
            "title": "Food Delivery Partner",
            "category": "Delivery",
            "description": "Deliver food orders in Indiranagar area. Own vehicle required.",
            "location": "Indiranagar, Bangalore",
            "pay": 400.0,
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
            "title": "Beauty Services at Home",
            "category": "Beauty",
            "description": "Bridal makeup and hairstyling for wedding function.",
            "location": "Whitefield, Bangalore",
            "pay": 2500.0,
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
            "title": "Math Tutoring for Class 10",
            "category": "Tutoring",
            "description": "Need experienced tutor for CBSE Class 10 Mathematics preparation.",
            "location": "HSR Layout, Bangalore",
            "pay": 800.0,
            "duration": "2 hours daily",
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
            "title": "Home Cooking Service",
            "category": "Cooking",
            "description": "Cook traditional North Indian meals for family of 4.",
            "location": "Jayanagar, Bangalore",
            "pay": 1000.0,
            "duration": "2 hours",
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
            "title": "Elderly Care Support",
            "category": "Caregiving",
            "description": "Companion and basic care for elderly person. Light duties only.",
            "location": "Malleswaram, Bangalore",
            "pay": 700.0,
            "duration": "6 hours",
            "employer_id": employers[1]["id"],
            "employer_name": employers[1]["name"],
            "status": "open",
            "worker_id": None,
            "worker_name": None,
            "safety_fee": 2.0,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.jobs.insert_many(jobs)
    
    print(f"Database seeded successfully!")
    print(f"- {len(workers)} workers created")
    print(f"- {len(employers)} employers created")
    print(f"- {len(jobs)} jobs created")
    print("\nSample login credentials:")
    print("Worker: priya@worker.com")
    print("Employer: rajesh@employer.com")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
