import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import {
  Briefcase,
  ShieldCheck,
  IndianRupee,
  AlertCircle,
  Clock,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Toaster } from "../components/ui/sonner";

import { UserContext, API } from "../App";

const WorkerDashboard = () => {
  const { user } = useContext(UserContext);

  const [jobs, setJobs] = useState([]);
  const [policies, setPolicies] = useState([]);

  const [stats, setStats] = useState({
    active: 0,
    completed: 0,
    earnings: 0,
  });

  // -----------------------------
  // Helper: Calculate Dashboard Stats
  // -----------------------------
  const calculateStats = (jobList) => {
    const activeJobs = jobList.filter(
      (job) => job.status === "assigned"
    ).length;

    const completedJobs = jobList.filter(
      (job) => job.status === "completed"
    ).length;

    const totalEarnings = jobList
      .filter((job) => job.status === "completed")
      .reduce((sum, job) => sum + job.pay, 0);

    setStats({
      active: activeJobs,
      completed: completedJobs,
      earnings: totalEarnings,
    });
  };

  // -----------------------------
  // Fetch Jobs + Safety Policies
  // -----------------------------
  const fetchDashboardData = async () => {
    try {
      const [jobsRes, policiesRes] = await Promise.all([
        axios.get(`${API}/jobs/worker/${user.id}`),
        axios.get(`${API}/safety/policies/${user.id}`),
      ]);

      setJobs(jobsRes.data);
      setPolicies(policiesRes.data);

      calculateStats(jobsRes.data);
    } catch (error) {
      console.error("Dashboard data fetch failed:", error);
    }
  };

  // Load dashboard data when user is available
  useEffect(() => {
    if (!user) return;
    fetchDashboardData();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <Navbar />
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ================= HEADER ================= */}
        <div className="mb-8">
          <h1
            className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-2"
            data-testid="dashboard-heading"
          >
            Welcome back, {user.name}!
          </h1>
          <p className="text-muted-foreground">
            Your protected workspace
          </p>
        </div>

        {/* ================= DASHBOARD GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* -------- Stats Cards -------- */}
          <StatCard
            icon={<Clock className="h-8 w-8 text-[#EA580C]" />}
            label="Active Jobs"
            value={stats.active}
            subtext="In progress"
          />

          <StatCard
            icon={<Briefcase className="h-8 w-8 text-[#15803D]" />}
            label="Completed"
            value={stats.completed}
            subtext="Jobs done"
          />

          <StatCard
            icon={<IndianRupee className="h-8 w-8 text-[#0F766E]" />}
            label="Total Earnings"
            value={`₹${stats.earnings}`}
            subtext="This month"
          />

          <StatCard
            icon={<ShieldCheck className="h-8 w-8 text-[#EA580C]" />}
            label="Safety Policies"
            value={policies.length}
            subtext="Active coverage"
          />

          {/* -------- Jobs Feed Section -------- */}
          <div className="md:col-span-3 lg:col-span-2 md:row-span-2 bg-white rounded-xl p-6 border border-stone-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1C1917]">
                Your Jobs
              </h2>

              <Link to="/worker/jobs">
                <Button className="btn-secondary" size="sm">
                  Browse Jobs
                </Button>
              </Link>
            </div>

            {/* Jobs List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {jobs.length === 0 ? (
                <EmptyJobs />
              ) : (
                jobs.map((job) => <JobCard key={job.id} job={job} />)
              )}
            </div>
          </div>

          {/* -------- Safety Status -------- */}
          <div className="md:col-span-3 lg:col-span-2 safety-card-gradient rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="bg-teal-100 p-3 rounded-full">
                <ShieldCheck className="h-8 w-8 text-[#0F766E]" />
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#0F766E] mb-2">
                  You're Protected
                </h3>

                <p className="text-sm text-muted-foreground mb-4">
                  {policies.length} active safety{" "}
                  {policies.length === 1 ? "policy" : "policies"} covering your
                  current jobs
                </p>

                <Link to="/worker/safety">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#0F766E] text-[#0F766E] hover:bg-[#0F766E]/5"
                  >
                    View All Policies
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* -------- Quick Actions -------- */}
          <div className="card-job">
            <h3 className="font-bold text-[#1C1917] mb-4">
              Quick Actions
            </h3>

            <div className="space-y-3">
              <QuickLink
                to="/worker/jobs"
                icon={<Briefcase className="h-4 w-4" />}
                text="Find Jobs"
              />

              <QuickLink
                to="/worker/safety"
                icon={<ShieldCheck className="h-4 w-4" />}
                text="Safety Center"
              />
            </div>
          </div>
        </div>

        {/* ================= FLOATING SOS BUTTON ================= */}
        <Link
          to="/worker/sos"
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[9999]"
        >
          <button
            className="bg-[#DC2626] text-white h-14 w-14 sm:h-16 sm:w-16 rounded-full flex items-center justify-center sos-pulse shadow-2xl hover:scale-105 transition-transform"
            aria-label="Emergency SOS"
          >
            <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default WorkerDashboard;

//
// =====================================================
// Small Reusable Components (Human Style)
// =====================================================
//

const StatCard = ({ icon, label, value, subtext }) => {
  return (
    <div className="card-job">
      <div className="flex items-center justify-between mb-2">
        {icon}
        <span className="text-3xl font-bold text-[#1C1917]">{value}</span>
      </div>
      <p className="text-sm font-semibold text-[#1C1917]">{label}</p>
      <p className="text-xs text-muted-foreground">{subtext}</p>
    </div>
  );
};

const JobCard = ({ job }) => {
  const statusStyle =
    job.status === "assigned"
      ? "bg-orange-100 text-orange-700"
      : "bg-green-100 text-green-700";

  return (
    <div className="border border-stone-200 rounded-lg p-4 hover:border-orange-200 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-[#1C1917]">{job.title}</h3>
          <p className="text-sm text-muted-foreground">{job.category}</p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle}`}
        >
          {job.status}
        </span>
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className="text-lg font-bold text-[#0F766E]">
          ₹{job.pay}
        </span>

        <Link to={`/worker/job/${job.id}`}>
          <Button size="sm" variant="outline">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

const EmptyJobs = () => (
  <div className="text-center py-12">
    <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
    <p className="text-muted-foreground mb-4">No jobs yet</p>

    <Link to="/worker/jobs">
      <Button className="btn-primary">Find Your First Job</Button>
    </Link>
  </div>
);

const QuickLink = ({ to, icon, text }) => (
  <Link to={to}>
    <Button
      variant="outline"
      size="sm"
      className="w-full justify-start gap-2"
    >
      {icon}
      {text}
    </Button>
  </Link>
);
