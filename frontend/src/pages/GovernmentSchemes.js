import React, { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import { API } from "../App";

const GovernmentSchemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch schemes from backend
  const fetchSchemes = async () => {
    try {
      const response = await axios.get(`${API}/schemes`);
      setSchemes(response.data);
    } catch (error) {
      console.error("Error fetching schemes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load schemes once page mounts
  useEffect(() => {
    fetchSchemes();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* ================= HEADER ================= */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Government Schemes for Women Workers
          </h1>

          <p className="text-muted-foreground">
            Explore financial support, training programs, and welfare schemes.
          </p>
        </div>

        {/* ================= CONTENT ================= */}
        {loading ? (
          <LoadingState />
        ) : schemes.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GovernmentSchemes;

const LoadingState = () => (
  <p className="text-center text-gray-500">Loading schemes...</p>
);

const EmptyState = () => (
  <p className="text-center text-gray-500">
    No schemes found in database.
  </p>
);

const SchemeCard = ({ scheme }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border">
      {/* Title */}
      <h2 className="text-xl font-bold mb-2">{scheme.title}</h2>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3">
        {scheme.description}
      </p>

      {/* Details */}
      <SchemeDetail label="Category" value={scheme.category} />
      <SchemeDetail label="Eligibility" value={scheme.eligibility} />
      <SchemeDetail label="Benefits" value={scheme.benefits} />
      <SchemeDetail label="How to Apply" value={scheme.how_to_apply} />

      {/* External Link */}
      {scheme.external_link && (
        <a
          href={scheme.external_link}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-4 text-orange-600 font-semibold hover:underline"
        >
          Apply Here →
        </a>
      )}
    </div>
  );
};

const SchemeDetail = ({ label, value }) => (
  <p className="text-sm mt-2">
    <span className="font-semibold">{label}:</span> {value}
  </p>
);
