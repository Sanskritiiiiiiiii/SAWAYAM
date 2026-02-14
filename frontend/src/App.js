import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "@/App.css";
import axios from "axios";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import WorkerDashboard from "./pages/WorkerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import BrowseJobs from "./pages/BrowseJobs";
import JobDetails from "./pages/JobDetails";
import Compliance from "./pages/Compliance.jsx";
import SOSPage from "./pages/SOSPage";
import ImpactPage from "./pages/ImpactPage";
import PostJob from "./pages/PostJob";
import GovernmentSchemes from "./pages/GovernmentSchemes";
import AdminDashboard from "./pages/AdminDashboard";
import Onboarding from "./pages/Onboarding";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// -----------------------
// Axios interceptor
// -----------------------
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("swayam_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -----------------------
// User Context
// -----------------------
export const UserContext = React.createContext();

function App() {
  const [user, setUser] = useState(null);
  const [onboardingStep, setOnboardingStep] = useState(null);

  // -----------------------
  // Load user on refresh
  // -----------------------
  useEffect(() => {
    const savedUser = localStorage.getItem("swayam_user");
    if (!savedUser || savedUser === "undefined") return;

    try {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);

      axios
        .get(`${API}/onboarding/status`, {
          params: { email: parsedUser.email },
        })
        .then((res) => {
          setOnboardingStep(res.data.onboarding_step);
        });
    } catch {
      localStorage.removeItem("swayam_user");
    }
  }, []);

  // -----------------------
  // Login
  // -----------------------
  const login = async (userData) => {
    setUser(userData);
    localStorage.setItem("swayam_user", JSON.stringify(userData));

    const res = await axios.get(`${API}/onboarding/status`, {
      params: { email: userData.email },
    });
    setOnboardingStep(res.data.onboarding_step);
  };

  // -----------------------
  // Logout
  // -----------------------
  const logout = () => {
    setUser(null);
    setOnboardingStep(null);
    localStorage.clear();
  };

  // -----------------------
  // Guard (FIXED)
  // -----------------------
  const requireOnboardingComplete = (component) => {

  if (onboardingStep === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (onboardingStep < 5) {
    return <Navigate to="/onboarding" replace />;
  }

  return component;
};


  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        onboardingStep,
        setOnboardingStep, // 🔥 IMPORTANT
      }}
    >
      <BrowserRouter>
        <Routes>
  {/* Public */}
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/about" element={<ImpactPage />} />
  <Route path="/schemes" element={<GovernmentSchemes />} />

  {/* Onboarding */}
  <Route
    path="/onboarding"
    element={user ? <Onboarding /> : <Navigate to="/login" />}
  />

  {/* ================= WORKER ROUTES ================= */}

  <Route
    path="/worker/dashboard"
    element={
      user?.role === "worker"
        ? requireOnboardingComplete(<WorkerDashboard />)
        : <Navigate to="/login" />
    }
  />

  <Route
    path="/worker/jobs"
    element={
      user?.role === "worker"
        ? requireOnboardingComplete(<BrowseJobs />)
        : <Navigate to="/login" />
    }
  />

  <Route
    path="/worker/safety"
    element={
      user?.role === "worker"
        ? requireOnboardingComplete(<Compliance />)
        : <Navigate to="/login" />
    }
  />

  <Route
    path="/worker/sos"
    element={
      user?.role === "worker"
        ? requireOnboardingComplete(<SOSPage />)
        : <Navigate to="/login" />
    }
  />

  <Route
    path="/worker/jobs/:id"
    element={
      user?.role === "worker"
        ? requireOnboardingComplete(<JobDetails />)
        : <Navigate to="/login" />
    }
  />

  {/* ================= EMPLOYER ROUTES ================= */}

  <Route
    path="/employer/dashboard"
    element={
      user?.role === "employer"
        ? requireOnboardingComplete(<EmployerDashboard />)
        : <Navigate to="/login" />
    }
  />

  <Route
    path="/employer/post-job"
    element={
      user?.role === "employer"
        ? requireOnboardingComplete(<PostJob />)
        : <Navigate to="/login" />
    }
  />

  {/* ================= ADMIN ROUTES ================= */}

  <Route
    path="/admin/dashboard"
    element={
      user?.role === "admin"
        ? requireOnboardingComplete(<AdminDashboard />)
        : <Navigate to="/login" />
    }
  />

  {/* Catch All */}
  <Route path="*" element={<Navigate to="/" />} />
</Routes>

      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
