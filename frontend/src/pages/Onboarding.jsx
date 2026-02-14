import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext, API } from "../App";
import { Button } from "../components/ui/button";

const CARD_HEIGHT = "min-h-[560px]";

const Onboarding = () => {
  const { user, setOnboardingStep } = useContext(UserContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);

  const [workMode, setWorkMode] = useState(null);
  const [resume, setResume] = useState(null);
  const [experience, setExperience] = useState("");

  const [verifications, setVerifications] = useState({
    phone_verified: false,
    id_verified: false,
    safety_agreement: false,
  });

  // -----------------------
  // FETCH STATUS
  // -----------------------
  useEffect(() => {
    if (!user?.email) return;

    axios
      .get(`${API}/onboarding/status`, {
        params: { email: user.email },
      })
      .then((res) => {
        setStep(res.data.onboarding_step || 1);
        setWorkMode(res.data.work_mode || null);
        setVerifications(
          res.data.verifications || {
            phone_verified: false,
            id_verified: false,
            safety_agreement: false,
          }
        );
      })
      .finally(() => setLoading(false));
  }, [user]);

  // -----------------------
  // NEXT
  // -----------------------
  const goNext = async () => {
    try {
      if (step === 3 && !workMode) {
        return alert("Please select a work mode");
      }

      if (step === 3) {
        await axios.post(`${API}/onboarding/work-mode`, {
          email: user.email,
          work_mode: workMode,
        });
      }

      if (step === 4) {
        const allVerified =
          verifications.phone_verified &&
          verifications.id_verified &&
          verifications.safety_agreement;

        if (!allVerified) {
          return alert("Complete all verifications");
        }

        await axios.post(`${API}/onboarding/verify`, {
          email: user.email,
          verifications,
        });
      }

      const next = step + 1;

      await axios.post(`${API}/onboarding/step`, {
        email: user.email,
        step: next,
      });

      setStep(next);

      if (next >= 5) {
        setOnboardingStep(5);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
    }
  };

  // -----------------------
  // BACK
  // -----------------------
  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // -----------------------
  // VERIFY
  // -----------------------
  const verifyField = (key) => {
    setVerifications((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  // -----------------------
  // CONTENT
  // -----------------------
  const renderContent = () => {
    switch (step) {
      // ---------------- STEP 1 ----------------
      case 1:
        return (
          <div className="text-center space-y-6">
            <h2 className="text-4xl font-bold text-gray-800">
              Welcome 👋
            </h2>

            <p className="text-gray-500 text-lg">
              Let’s complete your profile in just a few quick steps.
            </p>
          </div>
        );

      // ---------------- STEP 2 ----------------
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Personal Details</h2>

            <div className="bg-stone-50 rounded-2xl p-5 space-y-2">
              <p><span className="font-semibold">Name:</span> {user.name}</p>
              <p><span className="font-semibold">Email:</span> {user.email}</p>
              <p><span className="font-semibold">Role:</span> {user.role}</p>
            </div>

            <div>
              <label className="block font-medium mb-2">
                Resume (PDF / PPT)
              </label>

              <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-orange-300 rounded-2xl cursor-pointer hover:bg-orange-50 transition">
                <span className="text-gray-600">
                  {resume ? resume.name : "📄 Click to upload resume"}
                </span>
                <input
                  type="file"
                  accept=".pdf,.ppt,.pptx"
                  className="hidden"
                  onChange={(e) => setResume(e.target.files[0])}
                />
              </label>
            </div>

            <div>
              <label className="block font-medium mb-2">
                Experience (optional)
              </label>
              <textarea
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
                rows={3}
                placeholder="Brief work experience..."
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>
          </div>
        );

      // ---------------- STEP 3 ----------------
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Select Work Mode</h2>

            {["static", "dynamic"].map((mode) => (
              <div
                key={mode}
                onClick={() => setWorkMode(mode)}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition ${
                  workMode === mode
                    ? "border-orange-500 bg-orange-50 shadow-md"
                    : "border-stone-200 hover:border-orange-300"
                }`}
              >
                <h3 className="text-lg font-semibold">
                  {mode === "static" ? "🏠 Static" : "🚗 Dynamic"}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  {mode === "static"
                    ? "Work from fixed location"
                    : "Travel-based jobs"}
                </p>
              </div>
            ))}
          </div>
        );

      // ---------------- STEP 4 ----------------
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Verification</h2>

            {[
              ["phone_verified", "Phone OTP"],
              ["id_verified", "Government ID"],
              ["safety_agreement", "Safety Agreement"],
            ].map(([key, label]) => (
              <div
                key={key}
                className="border rounded-xl p-4 flex justify-between items-center"
              >
                <span>{label}</span>

                {verifications[key] ? (
                  <span className="text-green-600 font-medium">
                    ✓ Verified
                  </span>
                ) : (
                  <Button size="sm" onClick={() => verifyField(key)}>
                    Verify
                  </Button>
                )}
              </div>
            ))}
          </div>
        );

      // ---------------- STEP 5 ----------------
      case 5:
        return (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">All Set 🎉</h2>
            <p className="text-gray-500">
              Your onboarding is complete.
            </p>

            <Button
              className="w-full"
              onClick={() =>
                navigate(
                  user.role === "worker"
                    ? "/worker/dashboard"
                    : "/employer/dashboard",
                  { replace: true }
                )
              }
            >
              Go to Dashboard
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-6">
      <div
        className={`w-full max-w-xl bg-white rounded-3xl shadow-2xl p-10 transition-all duration-300 ${CARD_HEIGHT}`}
      >
        <p className="text-sm text-gray-500 mb-2">
          Step {step} of 5
        </p>

        <div className="w-full bg-stone-200 h-2 rounded-full mb-8 overflow-hidden">
          <div
            className="bg-orange-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        <div className="mb-8">{renderContent()}</div>

        {step < 5 && (
          <div className="flex gap-4">
            {step > 1 && (
              <Button variant="outline" onClick={goBack}>
                ← Back
              </Button>
            )}
            <Button className="flex-1" onClick={goNext}>
              Continue →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
