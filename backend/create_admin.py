import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from datetime import datetime, timezone
import uuid
import sys
sys.path.append('/app/backend')
from auth import hash_password

load_dotenv()

mongo_url = os.environ['MONGO_URL']
db_name = os.environ['DB_NAME']

async def create_admin():
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Check if admin already exists
    existing_admin = await db.users.find_one({"email": "admin@swayam.com"}, {"_id": 0})
    
    if existing_admin:
        print("⚠️  Admin user already exists")
        print(f"Email: admin@swayam.com")
        return
    
    # Create admin user
    admin_user = {
        "id": str(uuid.uuid4()),
        "name": "SWAYAM Admin",
        "email": "admin@swayam.com",
        "phone": "+91-9999999999",
        "password": hash_password("admin123"),  # Default password
        "role": "admin",
        "verified": True,
        "rating": 5.0,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "skills": [],
        "verifications": {
            "phone_verified": True,
            "id_verified": True,
            "reference_verified": True
        },
        "total_ratings": 0,
        "average_rating": 0.0
    }
    
    await db.users.insert_one(admin_user)
    
    print("✅ Admin user created successfully!")
    print("")
    print("=" * 50)
    print("ADMIN LOGIN CREDENTIALS")
    print("=" * 50)
    print("Email: admin@swayam.com")
    print("Password: admin123")
    print("")
    print("⚠️  IMPORTANT: Change the password after first login!")
    print("=" * 50)
    
    client.close()

if __name__ == "__main__":
    asyncio.run(create_admin())
