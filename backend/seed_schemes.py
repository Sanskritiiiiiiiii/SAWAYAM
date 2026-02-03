import asyncio
import os
import uuid
from datetime import datetime, timezone

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME")


async def seed_schemes():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    print("\nAdding government schemes into database...\n")

    schemes = [
        {
            "id": str(uuid.uuid4()),
            "title": "PM SVANidhi - Street Vendor Loan",
            "description": "Working capital loan support for street vendors.",
            "category": "Loan",
            "eligibility": "Street vendors and small hawkers",
            "benefits": "Loan starting from ₹10,000, can increase with repayment",
            "how_to_apply": "Apply online through PM SVANidhi portal or CSC centers",
            "external_link": "https://pmsvanidhi.mohua.gov.in",
            "state": "All India",
            "icon": "banknote",
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Mudra Loan for Women Entrepreneurs",
            "description": "Collateral-free loans for women starting small businesses.",
            "category": "Loan",
            "eligibility": "Women entrepreneurs and self-employed workers",
            "benefits": "Loans up to ₹10 lakh under Mudra categories",
            "how_to_apply": "Apply through banks or NBFCs",
            "external_link": "https://www.mudra.org.in",
            "state": "All India",
            "icon": "wallet",
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "title": "National Urban Livelihoods Mission (NULM)",
            "description": "Skill development and job support for urban poor women.",
            "category": "Training",
            "eligibility": "Women from low-income urban households",
            "benefits": "Free training + placement/self-employment support",
            "how_to_apply": "Contact nearest Urban Livelihood Mission office",
            "external_link": "https://nulm.gov.in",
            "state": "All India",
            "icon": "graduation-cap",
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Stand Up India Scheme",
            "description": "Loan support for women entrepreneurs starting new ventures.",
            "category": "Loan",
            "eligibility": "Women setting up greenfield enterprises",
            "benefits": "Loans between ₹10 lakh and ₹1 crore",
            "how_to_apply": "Apply via designated bank branches",
            "external_link": "https://www.standupmitra.in",
            "state": "All India",
            "icon": "trending-up",
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Pradhan Mantri Matru Vandana Yojana",
            "description": "Maternity benefit support for pregnant women.",
            "category": "Welfare",
            "eligibility": "Pregnant and lactating mothers (first child)",
            "benefits": "Cash benefit of ₹5,000 in installments",
            "how_to_apply": "Register at Anganwadi or health facility",
            "external_link": "https://wcd.nic.in",
            "state": "All India",
            "icon": "heart",
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Skill India - PMKVY",
            "description": "Free certified skill training for women.",
            "category": "Training",
            "eligibility": "Women looking for employment or self-employment",
            "benefits": "Training + certification + placement help",
            "how_to_apply": "Enroll through PMKVY training centers",
            "external_link": "https://www.pmkvyofficial.org",
            "state": "All India",
            "icon": "award",
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Mahila Shakti Kendra",
            "description": "Support centers for women empowerment and guidance.",
            "category": "Welfare",
            "eligibility": "All women (focus on rural and vulnerable groups)",
            "benefits": "Training, counseling, legal aid and job linkage",
            "how_to_apply": "Visit nearest Mahila Shakti Kendra office",
            "external_link": "https://wcd.nic.in",
            "state": "All India",
            "icon": "users",
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Ayushman Bharat - PMJAY",
            "description": "Health insurance scheme for vulnerable families.",
            "category": "Healthcare",
            "eligibility": "Eligible families under SECC data",
            "benefits": "Cashless treatment up to ₹5 lakh",
            "how_to_apply": "Check eligibility at PMJAY centers or hospitals",
            "external_link": "https://pmjay.gov.in",
            "state": "All India",
            "icon": "heart-pulse",
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
    ]

    # Reset schemes collection
    await db.schemes.delete_many({})
    await db.schemes.insert_many(schemes)

    print(f"Done. Inserted {len(schemes)} schemes.\n")
    client.close()


if __name__ == "__main__":
    asyncio.run(seed_schemes())
