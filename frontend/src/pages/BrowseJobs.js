import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  MapPin,
  Clock,
  ShieldCheck,
  Filter,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import { API } from "../App";

const JOB_CATEGORIES = [
  "All",
  "Cleaning",
  "Delivery",
  "Beauty",
  "Tutoring",
  "Cooking",
  "Caregiving",
];

const BrowseJobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Fetch Open Jobs
  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API}/jobs?status=open`);
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs =
    categoryFilter === "all"
      ? jobs
      : jobs.filter(
          (job) =>
            job.category?.toLowerCase() ===
            categoryFilter.toLowerCase()
        );

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <Navbar />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
            Find Your Next Gig
          </h1>

          <p className="text-muted-foreground">
            All jobs include ₹2 safety protection
          </p>
        </div>

        {/* FILTER */}
        <div className="mb-6 flex items-center gap-4">
          <Filter className="h-5 w-5 text-muted-foreground" />

          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>

            <SelectContent>
              {JOB_CATEGORIES.map((cat) => (
                <SelectItem
                  key={cat}
                  value={cat.toLowerCase()}
                >
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* JOB GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length === 0 ? (
            <EmptyState />
          ) : (
            filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onView={() =>
                  navigate(`/worker/jobs/${job.id}`)  // ✅ CORRECT ROUTE
                }
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseJobs;


/* ================= COMPONENTS ================= */

const JobCard = ({ job, onView }) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow border w-full">
      {/* Safety Badge */}
      <div className="flex items-center gap-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full mb-4 w-fit">
        <ShieldCheck className="h-3 w-3" />
        Safety Protected
      </div>

      {/* Title */}
      <h3 className="text-lg sm:text-xl font-semibold mb-2">
        {job.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4">
        {job.description}
      </p>

      {/* Info */}
      <div className="space-y-2 mb-4">
        <InfoRow icon={<MapPin className="h-4 w-4" />}>
          {job.location}
        </InfoRow>

        <InfoRow icon={<Clock className="h-4 w-4" />}>
          {job.duration || "Not Mentioned"}
        </InfoRow>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div>
          {/* ✅ USE payment NOT pay */}
          <div className="text-xl sm:text-2xl font-bold text-[#0F766E]">
            ₹{job.payment || 0}
          </div>
          <div className="text-xs text-muted-foreground">
            + ₹2 safety fee
          </div>
        </div>

        <Button className="btn-primary" onClick={onView}>
          View Details
        </Button>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, children }) => (
  <div className="flex items-center gap-2 text-sm text-muted-foreground">
    {icon}
    {children}
  </div>
);

const EmptyState = () => (
  <div className="col-span-full text-center py-12">
    <p className="text-muted-foreground">
      No jobs available in this category
    </p>
  </div>
);
