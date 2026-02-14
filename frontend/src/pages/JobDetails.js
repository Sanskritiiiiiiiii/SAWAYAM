import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  MapPin,
  Clock,
  User,
  ShieldCheck,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Toaster } from "../components/ui/sonner";

import { UserContext, API } from "../App";
import { toast } from "sonner";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`${API}/jobs/${id}`);
      setJob(response.data);
    } catch (error) {
      toast.error("Job not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const getErrorMessage = (error) => {
    const detail = error.response?.data?.detail;
    if (!detail) return "Something went wrong.";
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) return detail[0]?.msg;
    return "Request failed.";
  };

  const handleApply = async () => {
    if (!user?.email) {
      toast.error("Please login first!");
      return;
    }

    setApplying(true);

    try {
      await axios.post(`${API}/jobs/${id}/apply`, {
        worker_name: user.name,
        worker_email: user.email,
      });

      toast.success("Job accepted successfully!");
      setTimeout(() => navigate("/worker/dashboard"), 2000);

    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <PageWrapper>Loading...</PageWrapper>;
  if (!job) return <PageWrapper>Job not found</PageWrapper>;

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <Navbar />
      <Toaster position="top-right" />

      <div className="w-full max-w-3xl mx-auto px-4 py-6">

        <div className="bg-white rounded-xl shadow p-5">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">

            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
                {job.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {job.category}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-2xl sm:text-3xl font-bold text-[#0F766E]">
                ₹{job.payment}
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <p className="text-sm text-muted-foreground mb-4">
            {job.description}
          </p>

          {/* DETAILS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">

            <DetailCard
              icon={<MapPin className="h-4 w-4 text-orange-500" />}
              label="Location"
              value={job.location}
            />

            <DetailCard
              icon={<Clock className="h-4 w-4 text-orange-500" />}
              label="Duration"
              value={job.duration}
            />

            <DetailCard
              icon={<User className="h-4 w-4 text-orange-500" />}
              label="Employer"
              value={job.employer_name}
            />

            <DetailCard
              icon={<ShieldCheck className="h-4 w-4 text-green-600" />}
              label="Risk Level"
              value={job.risk_level || "Medium"}
            />

            <DetailCard
              icon={<ShieldCheck className="h-4 w-4 text-green-600" />}
              label="Trust Required"
              value={`${job.min_trust_score || 40}+`}
            />
          </div>

          {/* APPLY BUTTON */}
          {job.status === "open" ? (
            <Button
              className="w-full h-12 text-base"
              onClick={handleApply}
              disabled={applying}
            >
              {applying ? "Processing..." : "Accept Job"}
            </Button>
          ) : (
            <div className="text-center py-3 bg-stone-100 rounded-lg">
              <p className="text-sm text-muted-foreground">
                This job is no longer available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;

const PageWrapper = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center">
    {children}
  </div>
);

const DetailCard = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-lg">
    {icon}
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  </div>
);
