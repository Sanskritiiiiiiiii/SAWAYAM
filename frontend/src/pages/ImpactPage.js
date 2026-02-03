import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  ShieldCheck,
  Users,
  Briefcase,
  Heart,
  TrendingUp,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { API } from "../App";

// Future Vision Content (kept outside like real projects)
const FUTURE_PLANS = [
  {
    title: "Government Partnership",
    description:
      "Integration with state welfare schemes and women safety initiatives",
  },
  {
    title: "NGO Collaboration",
    description:
      "Working with women empowerment organizations for wider reach",
  },
  {
    title: "Pan-India Expansion",
    description:
      "Scaling to every city and village, protecting millions of women workers",
  },
];

const ImpactPage = () => {
  const [stats, setStats] = useState({
    total_workers: 0,
    total_jobs: 0,
    policies_activated: 0,
    sos_responded: 0,
  });

  // Fetch Impact Stats
  const fetchImpactStats = async () => {
    try {
      const response = await axios.get(`${API}/stats/impact`);
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching impact stats:", error);
    }
  };

  useEffect(() => {
    fetchImpactStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <Navbar />

      {/* ================= HERO ================= */}
      <HeroSection />

      {/* ================= IMPACT STATS ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Our Impact"
            subtitle="Real numbers, real change"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard
              icon={<Users className="h-10 w-10 text-[#EA580C]" />}
              value={`${stats.total_workers}+`}
              title="Women Protected"
              subtitle="Active workers on platform"
              bg="bg-orange-50"
            />

            <StatCard
              icon={<Briefcase className="h-10 w-10 text-[#0F766E]" />}
              value={`${stats.total_jobs}+`}
              title="Safe Jobs Created"
              subtitle="Verified opportunities"
              bg="bg-teal-50"
            />

            <StatCard
              icon={<ShieldCheck className="h-10 w-10 text-[#15803D]" />}
              value={`${stats.policies_activated}+`}
              title="Policies Activated"
              subtitle="Active safety coverage"
              bg="bg-green-50"
            />

            <StatCard
              icon={<Heart className="h-10 w-10 text-[#DC2626]" />}
              value={`${stats.sos_responded}+`}
              title="SOS Responded"
              subtitle="Emergency cases handled"
              bg="bg-red-50"
            />
          </div>
        </div>
      </section>

      {/* ================= MISSION ================= */}
      <MissionSection />

      {/* ================= FUTURE VISION ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Future Scalability"
            subtitle="Building for tomorrow"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FUTURE_PLANS.map((plan, idx) => (
              <FutureCard key={idx} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
};

export default ImpactPage;

const SectionTitle = ({ title, subtitle }) => (
  <div className="text-center mb-12">
    <h2 className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-4">
      {title}
    </h2>
    <p className="text-lg text-muted-foreground">{subtitle}</p>
  </div>
);

const StatCard = ({ icon, value, title, subtitle, bg }) => (
  <div className="card-job text-center">
    <div className={`${bg} p-4 rounded-full w-fit mx-auto mb-4`}>
      {icon}
    </div>

    <div className="text-4xl font-bold text-[#1C1917] mb-2">
      {value}
    </div>

    <p className="text-sm font-semibold text-[#1C1917]">{title}</p>
    <p className="text-xs text-muted-foreground">{subtitle}</p>
  </div>
);

// ---------------- HERO SECTION ----------------
const HeroSection = () => (
  <section className="hero-gradient py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <ShieldCheck className="h-12 w-12 text-[#EA580C] mx-auto mb-6" />

      <h1 className="text-4xl md:text-5xl font-extrabold text-[#1C1917] mb-6">
        Creating Safe Workspaces <br />
        <span className="text-[#EA580C]">for Women Everywhere</span>
      </h1>

      <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
        SWAYAM is transforming the gig economy by making safety accessible and
        affordable for every woman worker in India.
      </p>
    </div>
  </section>
);

// ---------------- MISSION SECTION ----------------
const MissionSection = () => (
  <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-teal-50">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <img
          src="https://images.unsplash.com/photo-1637176594832-97454dc84edf?crop=entropy&cs=srgb&fm=jpg&q=85"
          alt="Diverse Indian women standing together"
          className="rounded-2xl shadow-xl"
        />

        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-6">
            Our Mission
          </h2>

          <p className="text-lg text-muted-foreground mb-6">
            To create a gig economy where every woman can work with confidence,
            dignity, and complete safety protection.
          </p>

          <p className="text-muted-foreground mb-4">
            We believe safety shouldn't be a luxury. That’s why we’ve made it
            automatic, affordable, and accessible through our innovative ₹2
            safety fee model.
          </p>

          <p className="text-muted-foreground">
            Every job on SWAYAM comes with built-in protection — medical
            coverage, legal aid, accident insurance, and 24/7 emergency support.
          </p>
        </div>
      </div>
    </div>
  </section>
);

// ---------------- FUTURE CARD ----------------
const FutureCard = ({ plan }) => (
  <div className="card-job">
    <div className="bg-orange-50 p-3 rounded-full w-fit mb-4">
      <TrendingUp className="h-8 w-8 text-[#EA580C]" />
    </div>

    <h3 className="text-xl font-semibold text-[#1C1917] mb-2">
      {plan.title}
    </h3>

    <p className="text-muted-foreground">{plan.description}</p>
  </div>
);

// ---------------- FOOTER ----------------
const Footer = () => (
  <footer className="bg-[#1C1917] text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <ShieldCheck className="h-6 w-6 text-[#EA580C]" />
        <span className="text-xl font-bold">SWAYAM</span>
      </div>

      <p className="text-gray-400 text-sm">
        Smart Work Assurance for Women
      </p>

      <p className="text-gray-500 text-xs mt-4">
        © 2025 SWAYAM. Empowering women gig workers across India.
      </p>
    </div>
  </footer>
);
