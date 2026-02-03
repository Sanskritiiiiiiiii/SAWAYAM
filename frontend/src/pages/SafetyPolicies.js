import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import {
  ShieldCheck,
  IndianRupee,
  Calendar,
  CheckCircle2,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { UserContext, API } from "../App";

import { format } from "date-fns";

const SafetyPolicies = () => {
  const { user } = useContext(UserContext);

  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Policies from Backend
  const fetchPolicies = async () => {
    try {
      const response = await axios.get(
        `${API}/safety/policies/${user.id}`
      );
      setPolicies(response.data);
    } catch (error) {
      console.error("Error fetching policies:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load policies once user is available
  useEffect(() => {
    if (!user) return;
    fetchPolicies();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ================= HEADER ================= */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-2">
            Your Safety Policies
          </h1>
          <p className="text-muted-foreground">
            All your active and past safety coverage
          </p>
        </div>

        {/* ================= CONTENT ================= */}
        {loading ? (
          <LoadingState />
        ) : policies.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {policies.map((policy) => (
              <PolicyCard key={policy.id} policy={policy} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SafetyPolicies;

// Reusable Components
const LoadingState = () => (
  <div className="text-center py-12">
    <p className="text-muted-foreground">Loading...</p>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12">
    <ShieldCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
    <p className="text-muted-foreground">
      No safety policies yet. Accept a job to activate coverage!
    </p>
  </div>
);

const PolicyCard = ({ policy }) => {
  const isActive = policy.status === "active";

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* -------- Policy Header -------- */}
      <div className="safety-card-gradient p-6">
        <div className="flex items-start justify-between mb-4">
          {/* Title + ID */}
          <div className="flex items-center gap-3">
            <div className="bg-teal-100 p-2 rounded-full">
              <ShieldCheck className="h-6 w-6 text-[#0F766E]" />
            </div>

            <div>
              <h3 className="font-bold text-[#1C1917]">
                {policy.job_title}
              </h3>
              <p className="text-xs text-muted-foreground">
                Policy ID: {policy.id.slice(0, 8)}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isActive
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {policy.status}
          </span>
        </div>

        {/* Activation Date */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          Activated:{" "}
          {format(new Date(policy.activated_at), "MMM dd, yyyy")}
        </div>
      </div>

      {/* -------- Coverage Details -------- */}
      <div className="p-6">
        {/* Fee Paid */}
        <div className="flex items-center gap-2 mb-4">
          <IndianRupee className="h-5 w-5 text-[#0F766E]" />
          <span className="font-bold text-[#0F766E]">
            Fee Paid: ₹{policy.fee_paid}
          </span>
        </div>

        {/* Coverage Section */}
        <h4 className="text-sm font-semibold text-[#1C1917] mb-3">
          Coverage Included:
        </h4>

        <CoverageList coverage={policy.coverage} />
      </div>
    </div>
  );
};

const CoverageList = ({ coverage }) => {
  const entries = Object.entries(coverage || {});

  if (entries.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Coverage details not available.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map(([key, value]) => (
        <div key={key} className="flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />

          <div className="text-sm">
            <span className="font-medium text-[#1C1917] capitalize">
              {key}:
            </span>{" "}
            <span className="text-muted-foreground">{value}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
