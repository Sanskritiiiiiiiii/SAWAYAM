import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Briefcase } from "lucide-react";
import { toast } from "sonner";

import Navbar from "../components/Navbar";
import { Toaster } from "../components/ui/sonner";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import { UserContext, API } from "../App";

/* Categories (kept outside like real projects) */
const JOB_CATEGORIES = [
  "Cleaning",
  "Delivery",
  "Beauty",
  "Tutoring",
  "Cooking",
  "Caregiving",
];

const PostJob = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    pay: "",
    duration: "",
  });

  // Helper: Update Form Fields
  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Submit Job Posting
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(`${API}/jobs`, {
        ...formData,
        pay: parseFloat(formData.pay),
        employer_id: user.id,
        employer_name: user.name,
      });

      toast.success("Job posted successfully!");

      setTimeout(() => {
        navigate("/employer/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error posting job:", error);
      toast.error("Failed to post job. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <Navbar />
      <Toaster position="top-right" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* ================= HEADER ================= */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-100 p-3 rounded-full">
              <Briefcase className="h-6 w-6 text-[#EA580C]" />
            </div>

            <h1 className="text-2xl font-bold text-[#1C1917]">
              Post a New Job
            </h1>
          </div>

          {/* ================= FORM ================= */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <FormField label="Job Title *">
              <Input
                type="text"
                placeholder="e.g., House Cleaning Service"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                required
                className="h-12 bg-stone-50"
              />
            </FormField>

            {/* Category */}
            <FormField label="Category *">
              <Select
                value={formData.category}
                onValueChange={(value) => updateField("category", value)}
              >
                <SelectTrigger className="h-12 bg-stone-50">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent>
                  {JOB_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            {/* Description */}
            <FormField label="Description *">
              <Textarea
                placeholder="Describe the job requirements and expectations..."
                value={formData.description}
                onChange={(e) =>
                  updateField("description", e.target.value)
                }
                required
                className="min-h-24 bg-stone-50"
              />
            </FormField>

            {/* Location + Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Location *">
                <Input
                  type="text"
                  placeholder="e.g., Koramangala, Bangalore"
                  value={formData.location}
                  onChange={(e) =>
                    updateField("location", e.target.value)
                  }
                  required
                  className="h-12 bg-stone-50"
                />
              </FormField>

              <FormField label="Duration *">
                <Input
                  type="text"
                  placeholder="e.g., 2 hours, 1 day"
                  value={formData.duration}
                  onChange={(e) =>
                    updateField("duration", e.target.value)
                  }
                  required
                  className="h-12 bg-stone-50"
                />
              </FormField>
            </div>

            {/* Payment */}
            <FormField label="Payment (₹) *">
              <Input
                type="number"
                placeholder="e.g., 500"
                value={formData.pay}
                onChange={(e) => updateField("pay", e.target.value)}
                required
                min="1"
                className="h-12 bg-stone-50"
              />

              <p className="text-xs text-muted-foreground mt-1">
                Note: ₹2 safety fee will be automatically added
              </p>
            </FormField>

            {/* Safety Info */}
            <div className="safety-card-gradient rounded-lg p-4">
              <p className="text-sm font-semibold text-[#0F766E] mb-1">
                Safety Fee Included
              </p>
              <p className="text-xs text-muted-foreground">
                Every job on SWAYAM includes a ₹2 safety fee that provides
                workers with medical coverage, legal aid, and emergency support.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="btn-primary w-full text-lg h-14"
              disabled={submitting}
            >
              {submitting ? "Posting..." : "Post Job"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;


const FormField = ({ label, children }) => (
  <div>
    <Label className="mb-1 block">{label}</Label>
    {children}
  </div>
);
