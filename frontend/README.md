# SWAYAM - Smart Work Assurance for Women

> **Empowering women gig workers with instant safety protection**

## 🎯 The Problem

Women gig workers in India (maids, delivery partners, beauty workers, freelancers, domestic helpers) face serious challenges:

- ⚠️ Unsafe work environments and harassment
- 🚨 No instant legal/medical support
- ❌ Lack of trust and verification in gig jobs
- 🚫 No insurance or protection per job
- 💸 Low confidence and financial insecurity

## 🚀 The Solution: SWAYAM

### Unique Innovation: ₹2 Safety Fee

For every job accepted, SWAYAM deducts a tiny **₹2 Safety Fee** that instantly activates a **Smart Safety Policy** valid only for that job duration.

This provides:
- 🏥 Emergency medical coverage (up to ₹50,000)
- ⚖️ Instant legal aid (₹25,000 support)
- 🚑 Accident/damage protection (up to ₹1,00,000)
- 📞 24/7 harassment support hotline
- 🚨 Real-time SOS support

## ✨ Features

### For Workers
- 📊 **Dashboard**: Track active jobs, earnings, and safety policies
- 🔍 **Browse Jobs**: Find verified gigs with safety badges
- 🛡️ **Auto Safety**: Every job automatically activates protection
- 🚨 **SOS System**: Instant emergency response with one tap
- 💰 **Earnings**: Track completed jobs and payments

### For Employers
- 📝 **Post Jobs**: Easy job posting with built-in safety
- ✅ **Verified Workers**: Hire from trusted, verified workers
- 📈 **Job Management**: Track open, assigned, and completed jobs
- 🤝 **Ethical Hiring**: Contribute to worker safety automatically

### Safety Features
- 🔴 **Floating SOS Button**: Always accessible on worker pages
- 📱 **Mobile-First Design**: Fully responsive for on-the-go workers
- 📦 **Policy Dashboard**: View all active and past safety coverage
- 📄 **Detailed Coverage**: Clear breakdown of what's protected

## 📱 Technology Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **MongoDB**: NoSQL database for flexible data storage
- **Motor**: Async MongoDB driver for FastAPI
- **Pydantic**: Data validation and settings management

### Frontend
- **React 19**: Modern UI library with hooks
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/UI**: Beautiful, accessible component library
- **Axios**: HTTP client for API requests
- **Sonner**: Toast notifications

### Design System
- **Colors**: Saffron Blaze (#EA580C) + Teal Shield (#0F766E)
- **Fonts**: Manrope (headings) + Public Sans (body)
- **Theme**: Warm, empowering, women-centric

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB

Make sure MongoDB is running locally or you have a MongoDB Atlas connection in `.env`.

### Installation

```bash
# Clone the repository
git clone https://github.com/Sanskritiiiiiiiii/SAWAYAM.git
cd SAWAYAM

# Install backend dependencies
cd backend
py -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

# Install frontend dependencies
cd ../frontend
yarn install

# Seed database with sample data
cd ../backend
python seed_data.py
```

### Running the Application

```bash
# Start backend (from /app/backend)
uvicorn server:app --reload --port 8000

# Start frontend (from /app/frontend)
yarn start
```

Access the application at `http://localhost:3000`

## 👥 Demo Accounts

### Workers
- **Email**: priya@worker.com
- **Email**: anjali@worker.com
- **Email**: lakshmi@worker.com

### Employers
- **Email**: rajesh@employer.com
- **Email**: meera@employer.com

This project uses prototype login (email + role only) for hackathon demo purposes.


## 📋 API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Jobs
- `GET /api/jobs` - List all jobs (with filters)
- `GET /api/jobs/{job_id}` - Get job details
- `POST /api/jobs` - Create new job (employer)
- `POST /api/jobs/{job_id}/apply` - Apply for job (worker)
- `GET /api/jobs/worker/{worker_id}` - Get worker's jobs

### Safety Policies
- `GET /api/safety/policies/{worker_id}` - Get worker's safety policies

### SOS Emergency
- `POST /api/sos/trigger` - Trigger SOS alert

### Stats
- `GET /api/stats/impact` - Get platform impact statistics

## 🌐 Project Structure

```
swayam/
├── backend/
│ ├── server.py
│ ├── seed_data.py
│ ├── seed_schemes.py
│ ├── requirements.txt
│ └── .env
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── App.js
│ │ └── index.js
│ ├── package.json
│ └── .env
│
└── README.md

```
## 📊 Impact Metrics

The platform tracks and displays:
- 👥 Total women workers protected
- 💼 Total safe jobs created
- 🔰 Safety policies activated
- 🚑 SOS emergencies responded to

## 🔮 Future Improvements

- Real payment integration
- SMS-based SOS alerts
- GPS live tracking
- Worker rating system
- Multi-language support

