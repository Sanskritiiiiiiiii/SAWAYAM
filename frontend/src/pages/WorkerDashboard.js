import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import {
  Briefcase,
  IndianRupee,
  AlertCircle,
  Clock,
  TrendingUp,
  Activity,
  ShieldCheck,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import Navbar from "../components/Navbar";
import { Toaster } from "../components/ui/sonner";
import { UserContext, API } from "../App";

const WorkerDashboard = () => {
  const { user } = useContext(UserContext);

  const [stats, setStats] = useState(null);
  const [weeklyJobs, setWeeklyJobs] = useState([]);
  const [trustScore, setTrustScore] = useState(0);

  // -----------------------------
  // FETCH DASHBOARD DATA
  // -----------------------------
  const fetchDashboardStats = async () => {
    try {
      const res = await axios.get(`${API}/dashboard/${user.email}`);
      setStats(res.data);
    } catch (err) {
      console.error("Stats fetch failed:", err);
    }
  };

  const fetchWeeklyJobs = async () => {
    try {
      const res = await axios.get(`${API}/weekly-jobs/${user.email}`);
      setWeeklyJobs(res.data);
    } catch (err) {
      console.error("Weekly jobs fetch failed:", err);
    }
  };

  const fetchTrustScore = async () => {
    try {
      const res = await axios.get(`${API}/trust-score/${user.email}`);
      setTrustScore(res.data.trust_score);
    } catch (err) {
      console.error("Trust score fetch failed:", err);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchDashboardStats();
    fetchWeeklyJobs();
    fetchTrustScore();
  }, [user]);

  const getReliability = () => {
    if (trustScore >= 80) return "High";
    if (trustScore >= 60) return "Medium";
    return "Low";
  };

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <Navbar />
      <Toaster position="top-right" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">
            Welcome back, {user?.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Your reliability determines job access
          </p>
        </div>

        {/* TRUST SCORE */}
        <div className="bg-white rounded-xl p-5 shadow border mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                Trust Score
              </p>
              <p className="text-3xl font-bold text-[#0F766E]">
                {trustScore} / 100
              </p>
              <p className="text-sm">
                Reliability: {getReliability()}
              </p>
            </div>
            <ShieldCheck className="h-10 w-10 text-green-600" />
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <StatCard icon={<Clock />} label="Active Jobs" value={stats?.in_progress || 0} />
          <StatCard icon={<Briefcase />} label="Completed" value={stats?.completed_jobs || 0} />
          <StatCard icon={<IndianRupee />} label="Earnings" value={`₹${stats?.earnings || 0}`} />
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          <Card title="Weekly Job Completion" icon={<Activity />}>
            <div className="w-full h-[260px] sm:h-[320px] lg:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyJobs}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="jobs" fill="#EA580C" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Performance Trend" icon={<TrendingUp />}>
            <div className="w-full h-[260px] sm:h-[320px] lg:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyJobs}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="jobs" stroke="#0F766E" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

        </div>

        {/* SOS BUTTON */}
        <Link to="/worker/sos" className="fixed bottom-5 right-5">
          <button className="bg-red-600 text-white h-12 w-12 rounded-full flex items-center justify-center shadow-xl">
            <AlertCircle />
          </button>
        </Link>

      </div>
    </div>
  );
};

export default WorkerDashboard;


/* ================= COMPONENTS ================= */

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white rounded-xl p-4 shadow border flex justify-between items-center w-full">
    <div>
      <p className="text-xs sm:text-sm text-muted-foreground">{label}</p>
      <p className="text-lg sm:text-xl font-bold">{value}</p>
    </div>
    <div className="text-orange-600">{icon}</div>
  </div>
);

const Card = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl p-4 shadow border w-full">
    <div className="flex items-center gap-2 mb-3 font-semibold text-sm sm:text-base">
      {icon}
      {title}
    </div>
    {children}
  </div>
);
