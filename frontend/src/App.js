import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "@/App.css";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";

import WorkerDashboard from "./pages/WorkerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";

import BrowseJobs from "./pages/BrowseJobs";
import JobDetails from "./pages/JobDetails";

import SafetyPolicies from "./pages/SafetyPolicies";
import SOSPage from "./pages/SOSPage";

import ImpactPage from "./pages/ImpactPage";
import PostJob from "./pages/PostJob";
import GovernmentSchemes from "./pages/GovernmentSchemes";

// Backend API Base URL
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Global User Context
export const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);

  // Load user session from localStorage when app starts
  useEffect(() => {
    const savedUser = localStorage.getItem("swayam_user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Login handler
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("swayam_user", JSON.stringify(userData));
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    localStorage.removeItem("swayam_user");
  };

  // Simple role-based route protection
  const ProtectedRoute = ({ role, children }) => {
    if (!user || user.role !== role) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/about" element={<ImpactPage />} />
            <Route path="/schemes" element={<GovernmentSchemes />} />

            {/* Worker Routes */}
            <Route
              path="/worker/dashboard"
              element={
                <ProtectedRoute role="worker">
                  <WorkerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/worker/jobs"
              element={
                <ProtectedRoute role="worker">
                  <BrowseJobs />
                </ProtectedRoute>
              }
            />

            <Route
              path="/worker/job/:id"
              element={
                <ProtectedRoute role="worker">
                  <JobDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/worker/safety"
              element={
                <ProtectedRoute role="worker">
                  <SafetyPolicies />
                </ProtectedRoute>
              }
            />

            <Route
              path="/worker/sos"
              element={
                <ProtectedRoute role="worker">
                  <SOSPage />
                </ProtectedRoute>
              }
            />

            {/* Employer Routes */}
            <Route
              path="/employer/dashboard"
              element={
                <ProtectedRoute role="employer">
                  <EmployerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/employer/post-job"
              element={
                <ProtectedRoute role="employer">
                  <PostJob />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    </UserContext.Provider>
  );
}

export default App;
