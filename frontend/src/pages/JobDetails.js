import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  MapPin,
  Clock,
  ShieldCheck,
  User,
  CheckCircle2,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Toaster } from "../components/ui/sonner";

import { UserContext, API } from "../App";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [applying, setApplying] = useState(false);

  // Modal state (Safety Policy)
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [policyId, setPolicyId] = useState(null);

  // -----------------------------
  // Fetch Job Details
  // -----------------------------
  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`${API}/jobs/${id}`);
      setJob(response.data);
    } catch (error) {
      console.error("Error fetching job:", error);
      toast.error("Job not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  // -----------------------------
  // Extract readable error message
  // -----------------------------
  const getErrorMessage = (error) => {
    const detail = error.response?.data?.detail;

    if (!detail) return "Something went wrong. Please try again.";

    if (typeof detail === "string") return detail;

    if (Array.isArray(detail)) {
      return detail[0]?.msg || "Validation error occurred.";
    }

    return "Request failed.";
  };

  // -----------------------------
  // Apply for Job
  // -----------------------------
  const handleApply = async () => {
    if (!user?.id) {
      toast.error("Please login first!");
      return;
    }

    setApplying(true);

    try {
      const response = await axios.post(`${API}/jobs/${id}/apply`, {
        worker_id: user.id,
        worker_name: user.name,
      });

      // Show policy activation modal
      setPolicyId(response.data.policy_id);
      setShowPolicyModal(true);

      toast.success(
        response.data.message || "Job accepted successfully!"
      );

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/worker/dashboard");
      }, 3000);
    } catch (error) {
      console.error("Error applying for job:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setApplying(false);
    }
  };

  // -----------------------------
  // Loading / Empty States
  // -----------------------------
  if (loading) {
    return (
      <PageWrapper>
        <p className="text-muted-foreground">Loading...</p>
      </PageWrapper>
    );
  }

  if (!job) {
    return (
      <PageWrapper>
        <p className="text-muted-foreground">Job not found</p>
      </PageWrapper>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <Navbar />
      <Toaster position="top-right" />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* ================= HEADER ================= */}
          <div className="flex justify-between mb-6">
            <div>
              <div className="badge-safety mb-3">
                <ShieldCheck className="h-3 w-3" />
                Safety Protected Job
              </div>

              <h1 className="text-3xl font-bold">{job.title}</h1>
              <p className="text-muted-foreground">{job.category}</p>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold text-[#0F766E]">
                ₹{job.pay}
              </div>
              <div className="text-sm text-muted-foreground">
                + ₹2 safety fee
              </div>
            </div>
          </div>

          {/* ================= DESCRIPTION ================= */}
          <p className="text-muted-foreground mb-6">
            {job.description}
          </p>

          {/* ================= DETAILS ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <DetailCard
              icon={<MapPin className="h-5 w-5 text-orange-500" />}
              label="Location"
              value={job.location}
            />

            <DetailCard
              icon={<Clock className="h-5 w-5 text-orange-500" />}
              label="Duration"
              value={job.duration}
            />

            <DetailCard
              icon={<User className="h-5 w-5 text-orange-500" />}
              label="Employer"
              value={job.employer_name}
            />

            <DetailCard
              icon={<ShieldCheck className="h-5 w-5 text-green-600" />}
              label="Safety Fee"
              value="₹2 (auto-deducted)"
              highlight
            />
          </div>

          {/* ================= APPLY BUTTON ================= */}
          {job.status === "open" ? (
            <Button
              className="btn-primary w-full text-lg h-14"
              onClick={handleApply}
              disabled={applying}
            >
              {applying
                ? "Processing..."
                : "Accept Job & Activate Safety"}
            </Button>
          ) : (
            <div className="text-center py-4 bg-stone-100 rounded-lg">
              <p className="text-muted-foreground">
                This job is no longer available
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ================= POLICY MODAL ================= */}
      <Dialog open={showPolicyModal} onOpenChange={setShowPolicyModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>

            <DialogTitle className="text-center text-2xl">
              Safety Policy Activated!
            </DialogTitle>

            <DialogDescription className="text-center">
              Policy ID: {policyId}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobDetails;

//
// =====================================================
// Small Reusable Components (Human Style)
// =====================================================
//

const PageWrapper = ({ children }) => (
  <div className="min-h-screen bg-[#FFFBF7]">
    <Navbar />
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      {children}
    </div>
  </div>
);

const DetailCard = ({ icon, label, value, highlight }) => (
  <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-lg">
    {icon}

    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={`font-semibold ${
          highlight ? "text-green-600" : ""
        }`}
      >
        {value}
      </p>
    </div>
  </div>
);
