import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import '@/App.css';
import axios from 'axios';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import WorkerDashboard from './pages/WorkerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import BrowseJobs from './pages/BrowseJobs';
import JobDetails from './pages/JobDetails';
import SafetyPolicies from './pages/SafetyPolicies';
import SOSPage from './pages/SOSPage';
import ImpactPage from './pages/ImpactPage';
import PostJob from './pages/PostJob';
import GovernmentSchemes from './pages/GovernmentSchemes';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const UserContext = React.createContext();

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('swayam_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('swayam_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('swayam_user');
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/worker/dashboard" element={user?.role === 'worker' ? <WorkerDashboard /> : <Navigate to="/login" />} />
            <Route path="/worker/jobs" element={user?.role === 'worker' ? <BrowseJobs /> : <Navigate to="/login" />} />
            <Route path="/worker/job/:id" element={user?.role === 'worker' ? <JobDetails /> : <Navigate to="/login" />} />
            <Route path="/worker/safety" element={user?.role === 'worker' ? <SafetyPolicies /> : <Navigate to="/login" />} />
            <Route path="/worker/sos" element={user?.role === 'worker' ? <SOSPage /> : <Navigate to="/login" />} />
            <Route path="/employer/dashboard" element={user?.role === 'employer' ? <EmployerDashboard /> : <Navigate to="/login" />} />
            <Route path="/employer/post-job" element={user?.role === 'employer' ? <PostJob /> : <Navigate to="/login" />} />
            <Route path="/about" element={<ImpactPage />} />
            <Route path="/schemes" element={<GovernmentSchemes />} />
          </Routes>
        </BrowserRouter>
      </div>
    </UserContext.Provider>
  );
}

export default App;