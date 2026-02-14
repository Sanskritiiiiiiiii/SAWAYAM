import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import {
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  PlusCircle,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Toaster } from "../components/ui/sonner";

import { UserContext, API } from "../App";

const EmployerDashboard = () => {
  const { user } = useContext(UserContext);

  const [jobs, setJobs] = useState([]);

  const [stats, setStats] = useState({
    open: 0,
    assigned: 0,
    completed: 0,
  });

  // Helper: Calculate Job Stats
  const calculateStats = (jobList) => {
    setStats({
      open: jobList.filter((j) => j.status === "open").length,
      assigned: jobList.filter((j) => j.status === "assigned").length,
      completed: jobList.filter((j) => j.status === "completed").length,
    });
  };

  // Fetch Employer Jobs
  const fetchEmployerJobs = async () => {
    try {
      const response = await axios.get(
        `${API}/jobs/employer/${user.id}`
      );

      setJobs(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error("Error fetching employer jobs:", error);
    }
  };

  // Load jobs when dashboard opens
  useEffect(() => {
    if (!user) return;
    fetchEmployerJobs();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <Navbar />
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-2"
              data-testid="employer-dashboard-heading"
            >
              Welcome, {user.name}
            </h1>

            <p className="text-muted-foreground">
              Manage your posted jobs
            </p>
          </div>

          <Link to="/employer/post-job">
            <Button className="btn-primary gap-2">
              <PlusCircle className="h-5 w-5" />
              Post New Job
            </Button>
          </Link>
        </div>

        {/* ================= STATS GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<Briefcase className="h-8 w-8 text-[#EA580C]" />}
            label="Open Jobs"
            value={stats.open}
            subtext="Awaiting workers"
          />

          <StatCard
            icon={<Clock className="h-8 w-8 text-[#F59E0B]" />}
            label="In Progress"
            value={stats.assigned}
            subtext="Workers assigned"
          />

          <StatCard
            icon={<CheckCircle2 className="h-8 w-8 text-[#15803D]" />}
            label="Completed"
            value={stats.completed}
            subtext="Jobs finished"
          />
        </div>

        {/* ================= JOB LIST ================= */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#1C1917] mb-6">
            Your Posted Jobs
          </h2>

          {jobs.length === 0 ? (
            <EmptyJobs />
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;

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
  const getStatusStyle = () => {
    if (job.status === "open") return "bg-blue-100 text-blue-700";
    if (job.status === "assigned") return "bg-orange-100 text-orange-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <div className="border border-stone-200 rounded-lg p-4 hover:border-orange-200 transition-colors">
      <div className="flex items-start justify-between">
        {/* Left Side */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-[#1C1917] text-lg">
              {job.title}
            </h3>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle()}`}
            >
              {job.status}
            </span>
          </div>

          <p className="text-sm text-muted-foreground mb-2">
            {job.category} • {job.location}
          </p>

          {/* Assigned Worker */}
          {job.worker_name && (
            <div className="flex items-center gap-2 mt-2 text-sm">
              <Users className="h-4 w-4 text-[#0F766E]" />
              <span className="text-[#0F766E] font-medium">
                Assigned to: {job.worker_name}
              </span>
            </div>
          )}
        </div>

        {/* Right Side */}
        <div className="text-right">
          <div className="text-2xl font-bold text-[#0F766E]">
            ₹{job.payment}

          </div>
          <div className="text-xs text-muted-foreground">
            + ₹2 safety
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyJobs = () => (
  <div className="text-center py-12">
    <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
    <p className="text-muted-foreground mb-4">No jobs posted yet</p>

    <Link to="/employer/post-job">
      <Button className="btn-primary">Post Your First Job</Button>
    </Link>
  </div>
);
