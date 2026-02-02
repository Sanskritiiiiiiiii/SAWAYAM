import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapPin, Clock, ShieldCheck, User, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import Navbar from "../components/Navbar";
import { UserContext, API } from "../App";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [policyId, setPolicyId] = useState(null);

  // ✅ Fetch Job (ONLY ONE)
  useEffect(() => {
    const fetchJob = async () => {
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

    fetchJob();
  }, [id]);

  // ✅ Apply Job (Correct + Safe)
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

      // ✅ Success
      setPolicyId(response.data.policy_id);
      setShowPolicyModal(true);

      toast.success(response.data.message || "Job accepted successfully ✅");

      setTimeout(() => {
        navigate("/worker/dashboard");
      }, 3000);
    } catch (error) {
      console.error("Error applying:", error);

      let message = "Failed to apply";

      // ✅ Handle FastAPI errors safely
      if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === "string") {
          message = error.response.data.detail;
        } else if (Array.isArray(error.response.data.detail)) {
          message =
            error.response.data.detail[0]?.msg || "Validation error occurred";
        }
      }

      toast.error(message);
    } finally {
      setApplying(false);
    }
  };

  // ✅ Loading UI
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFBF7]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // ✅ Job Not Found UI
  if (!job) {
    return (
      <div className="min-h-screen bg-[#FFFBF7]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Job not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <Navbar />
      <Toaster position="top-right" />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
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

          {/* Description */}
          <p className="text-muted-foreground mb-6">{job.description}</p>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Location */}
            <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-lg">
              <MapPin className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-semibold">{job.location}</p>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-lg">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="font-semibold">{job.duration}</p>
              </div>
            </div>

            {/* Employer */}
            <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-lg">
              <User className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-xs text-muted-foreground">Employer</p>
                <p className="font-semibold">{job.employer_name}</p>
              </div>
            </div>

            {/* Safety Fee */}
            <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-xs text-muted-foreground">Safety Fee</p>
                <p className="font-semibold text-green-600">
                  ₹2 (auto-deducted)
                </p>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          {job.status === "open" ? (
            <Button
              className="btn-primary w-full text-lg h-14"
              onClick={handleApply}
              disabled={applying}
            >
              {applying ? "Processing..." : "Accept Job & Activate Safety"}
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

      {/* Policy Modal */}
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
