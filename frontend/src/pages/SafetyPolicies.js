import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  ShieldCheck,
  Calendar,
  IndianRupee,
  CheckCircle2,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { UserContext, API } from "../App";
import { Toaster } from "../components/ui/sonner";

const SafetyPolicies = () => {
  const { user } = useContext(UserContext);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPolicies = async () => {
    try {
      const res = await axios.get(
        `${API}/safety/policies?worker_email=${user.email}`
      );
      setPolicies(res.data);
    } catch (err) {
      console.error("Failed to load policies", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchPolicies();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <Navbar />
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1C1917]">
            Your Safety Policies
          </h1>
          <p className="text-muted-foreground">
            All your active and past safety coverage
          </p>
        </div>

        {/* EMPTY STATE */}
        {!loading && policies.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <ShieldCheck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No safety policies yet. Accept a job to activate coverage!</p>
          </div>
        )}

        {/* POLICIES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {policies.map((policy) => (
            <div
              key={policy._id || policy.job_id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-stone-100"
            >
              {/* TOP STRIP */}
              <div className="flex items-center justify-between p-5 bg-teal-50 border-l-4 border-teal-600">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <ShieldCheck className="h-6 w-6 text-green-600" />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-[#1C1917]">
                      Safety Coverage Active
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Policy ID: {policy.job_id.slice(0, 8)}
                    </p>
                  </div>
                </div>

                <span className="px-4 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                  Active
                </span>
              </div>

              {/* BODY */}
              <div className="p-6 space-y-4">
                {/* DATE */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Activated on{" "}
                  {new Date(policy.activated_at).toLocaleDateString()}
                </div>

                {/* FEE */}
                <div className="flex items-center gap-2 text-lg font-semibold text-[#0F766E]">
                  <IndianRupee className="h-5 w-5" />
                  Fee Paid: ₹2
                </div>

                {/* COVERAGE */}
                <div>
                  <p className="font-semibold mb-2">Coverage Included:</p>
                  <ul className="space-y-2">
                    {[
                      "Medical: Up to ₹50,000",
                      "Legal: Free consultation + ₹25,000 support",
                      "Accident: Up to ₹1,00,000",
                      "Harassment: 24/7 hotline + legal aid",
                    ].map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SafetyPolicies;
