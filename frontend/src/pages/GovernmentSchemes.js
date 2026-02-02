import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { API } from "../App";

const GovernmentSchemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch schemes from backend
  const fetchSchemes = async () => {
    try {
      const res = await axios.get(`${API}/schemes`);

      console.log("Schemes Loaded:", res.data);

      setSchemes(res.data);
    } catch (err) {
      console.error("Error fetching schemes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-4">
          Government Schemes for Women Workers
        </h1>

        <p className="text-muted-foreground mb-8">
          Explore financial support, training programs, and welfare schemes.
        </p>

        {/* ✅ Loading */}
        {loading ? (
          <p className="text-center text-gray-500">Loading schemes...</p>
        ) : schemes.length === 0 ? (
          <p className="text-center text-gray-500">
            No schemes found in database.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schemes.map((scheme) => (
              <div
                key={scheme.id}
                className="bg-white shadow-lg rounded-xl p-6 border"
              >
                <h2 className="text-xl font-bold mb-2">{scheme.title}</h2>

                <p className="text-sm text-gray-600 mb-3">
                  {scheme.description}
                </p>

                <p className="text-sm">
                  <b>Category:</b> {scheme.category}
                </p>

                <p className="text-sm mt-2">
                  <b>Eligibility:</b> {scheme.eligibility}
                </p>

                <p className="text-sm mt-2">
                  <b>Benefits:</b> {scheme.benefits}
                </p>

                <p className="text-sm mt-2">
                  <b>How to Apply:</b> {scheme.how_to_apply}
                </p>

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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GovernmentSchemes;
