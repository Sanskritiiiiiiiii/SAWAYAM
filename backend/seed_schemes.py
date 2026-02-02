import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from datetime import datetime, timezone
import uuid

load_dotenv()

mongo_url = os.environ['MONGO_URL']
db_name = os.environ['DB_NAME']

async def seed_schemes():
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print("Seeding government schemes...")
    
    schemes = [
        {
            "id": str(uuid.uuid4()),
            "title": "PM SVANidhi - Street Vendor Loan",
            "description": "Affordable working capital loan for street vendors to restart their businesses post-COVID.",
            "category": "Loan",
            "eligibility": "Street vendors, hawkers, and similar workers with vending certificate",
            "benefits": "Initial loan of ₹10,000 with low interest rate. Can be increased to ₹20,000 and ₹50,000 on timely repayment",
            "how_to_apply": "Apply online through PM SVANidhi portal or visit nearest Common Service Centre (CSC)",
            "external_link": "https://pmsvanidhi.mohua.gov.in",
            "state": "All India",
            "icon": "banknote",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Mudra Loan for Women Entrepreneurs",
            "description": "Loan scheme for women starting small businesses - no collateral required",
            "category": "Loan",
            "eligibility": "Women entrepreneurs, self-employed, small business owners",
            "benefits": "Loans up to ₹10 lakh without collateral. Three categories: Shishu (up to ₹50K), Kishore (₹50K-₹5L), Tarun (₹5L-₹10L)",
            "how_to_apply": "Apply through any bank or NBFC. Visit Mudra portal for details",
            "external_link": "https://www.mudra.org.in",
            "state": "All India",
            "icon": "wallet",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "National Urban Livelihoods Mission",
            "description": "Skill development and employment support for urban poor women",
            "category": "Training",
            "eligibility": "Women from urban poor households",
            "benefits": "Free skill training, placement assistance, self-employment support, interest subsidy on loans",
            "how_to_apply": "Contact nearest Urban Local Body or State Urban Livelihoods Mission office",
            "external_link": "https://nulm.gov.in",
            "state": "All India",
            "icon": "graduation-cap",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Stand Up India Scheme",
            "description": "Bank loans for SC/ST and women entrepreneurs",
            "category": "Loan",
            "eligibility": "Women entrepreneurs for setting up greenfield enterprises",
            "benefits": "Loans between ₹10 lakh to ₹1 crore for new ventures",
            "how_to_apply": "Apply through designated bank branches",
            "external_link": "https://www.standupmitra.in",
            "state": "All India",
            "icon": "trending-up",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Pradhan Mantri Matru Vandana Yojana",
            "description": "Maternity benefit scheme for pregnant and lactating women",
            "category": "Welfare",
            "eligibility": "Pregnant women and lactating mothers for first living child",
            "benefits": "Cash benefit of ₹5,000 in three installments",
            "how_to_apply": "Register at nearest Anganwadi Centre or Health facility",
            "external_link": "https://wcd.nic.in/schemes/pradhan-mantri-matru-vandana-yojana",
            "state": "All India",
            "icon": "heart",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Skill India - PMKVY",
            "description": "Free skill development training for women",
            "category": "Training",
            "eligibility": "Women seeking employment or self-employment",
            "benefits": "Free training in various trades, certification, average monetary reward of ₹8,000 per candidate",
            "how_to_apply": "Enroll through PMKVY training centers or Skill India portal",
            "external_link": "https://www.pmkvyofficial.org",
            "state": "All India",
            "icon": "award",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Mahila Shakti Kendra",
            "description": "Women empowerment centers providing support services",
            "category": "Welfare",
            "eligibility": "All women, especially from rural areas",
            "benefits": "Access to information, skill training, employment linkage, legal aid, counseling",
            "how_to_apply": "Visit nearest Mahila Shakti Kendra or District Mission Management Unit",
            "external_link": "https://wcd.nic.in",
            "state": "All India",
            "icon": "users",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Ayushman Bharat - Health Insurance",
            "description": "Free health insurance coverage up to ₹5 lakh",
            "category": "Healthcare",
            "eligibility": "Poor and vulnerable families (based on SECC data)",
            "benefits": "Cashless treatment at empaneled hospitals, covers secondary and tertiary care",
            "how_to_apply": "Check eligibility at nearest Health & Wellness Centre or Ayushman Bharat Kiosk",
            "external_link": "https://pmjay.gov.in",
            "state": "All India",
            "icon": "heart-pulse",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.schemes.delete_many({})
    await db.schemes.insert_many(schemes)
    
    print(f"✅ Seeded {len(schemes)} government schemes successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_schemes())
