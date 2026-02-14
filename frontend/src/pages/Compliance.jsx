import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { UserContext, API } from "../App";

const Compliance = () => {
  const { user } = useContext(UserContext);

  const [stats, setStats] = useState({
    completed_jobs: 0,
    total_jobs: 0,
    in_progress: 0,
    earnings: 0,
  });

  const fetchCompliance = async () => {
    try {
      const res = await axios.get(`${API}/dashboard/${user.email}`);
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchCompliance();
  }, [user]);

  // ---------------- TRUST SCORE ENGINE ----------------
  const trustScore =
    stats.completed_jobs === 0
      ? 40
      : Math.min(100, 40 + stats.completed_jobs * 10);

  const completionRate =
    stats.total_jobs === 0
      ? 0
      : Math.round((stats.completed_jobs / stats.total_jobs) * 100);

  const reliability =
    completionRate > 80 ? "High"
    : completionRate > 50 ? "Moderate"
    : "Low";

  const experience =
    stats.completed_jobs > 20 ? "Expert"
    : stats.completed_jobs > 10 ? "Intermediate"
    : "Beginner";

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <Navbar />

      <div className="w-full max-w-6xl mx-auto px-4 py-8">

        <h1 className="text-2xl sm:text-3xl font-bold mb-6">
          Worker Trust & Performance
        </h1>

        {/* TRUST SCORE */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <p className="text-sm text-muted-foreground mb-1">
            Platform Trust Score
          </p>
          <p className="text-4xl font-bold text-green-600">
            {trustScore}/100
          </p>

          <div className="w-full bg-gray-200 h-3 rounded-full mt-3">
            <div
              className="bg-green-500 h-3 rounded-full"
              style={{ width: `${trustScore}%` }}
            />
          </div>
        </div>

        {/* PROFESSIONAL METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          <Metric label="Completed Jobs" value={stats.completed_jobs} />
          <Metric label="Total Jobs" value={stats.total_jobs} />
          <Metric label="Active Jobs" value={stats.in_progress} />
          <Metric label="Completion Rate" value={`${completionRate}%`} />
          <Metric label="Reliability" value={reliability} />
          <Metric label="Experience Level" value={experience} />

        </div>

      </div>
    </div>
  );
};

export default Compliance;

const Metric = ({ label, value }) => (
  <div className="bg-white rounded-xl shadow p-5">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);
