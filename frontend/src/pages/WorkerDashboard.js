import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Briefcase, ShieldCheck, IndianRupee, AlertCircle, TrendingUp, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import Navbar from '../components/Navbar';
import { UserContext, API } from '../App';
import { toast } from 'sonner';
import { Toaster } from '../components/ui/sonner';

const WorkerDashboard = () => {
  const { user } = useContext(UserContext);
  const [jobs, setJobs] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [stats, setStats] = useState({ active: 0, completed: 0, earnings: 0 });

  useEffect(() => {
  const fetchData = async () => {
    // your code
  };

  fetchData();
}, []);


  const fetchData = async () => {
    try {
      const [jobsRes, policiesRes] = await Promise.all([
        axios.get(`${API}/jobs/worker/${user.id}`),
        axios.get(`${API}/safety/policies/${user.id}`)
      ]);
      
      setJobs(jobsRes.data);
      setPolicies(policiesRes.data);
      
      const active = jobsRes.data.filter(j => j.status === 'assigned').length;
      const completed = jobsRes.data.filter(j => j.status === 'completed').length;
      const earnings = jobsRes.data
        .filter(j => j.status === 'completed')
        .reduce((sum, j) => sum + j.pay, 0);
      
      setStats({ active, completed, earnings });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <Navbar />
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-2" data-testid="dashboard-heading">
            Welcome back, {user.name}!
          </h1>
          <p className="text-muted-foreground">Your protected workspace</p>
        </div>

        {/* Bento Grid Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Stats Cards */}
          <div className="card-job" data-testid="active-jobs-stat">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-8 w-8 text-[#EA580C]" />
              <span className="text-3xl font-bold text-[#1C1917]">{stats.active}</span>
            </div>
            <p className="text-sm font-semibold text-[#1C1917]">Active Jobs</p>
            <p className="text-xs text-muted-foreground">In progress</p>
          </div>

          <div className="card-job" data-testid="completed-jobs-stat">
            <div className="flex items-center justify-between mb-2">
              <Briefcase className="h-8 w-8 text-[#15803D]" />
              <span className="text-3xl font-bold text-[#1C1917]">{stats.completed}</span>
            </div>
            <p className="text-sm font-semibold text-[#1C1917]">Completed</p>
            <p className="text-xs text-muted-foreground">Jobs done</p>
          </div>

          <div className="card-job" data-testid="earnings-stat">
            <div className="flex items-center justify-between mb-2">
              <IndianRupee className="h-8 w-8 text-[#0F766E]" />
              <span className="text-3xl font-bold text-[#1C1917]">₹{stats.earnings}</span>
            </div>
            <p className="text-sm font-semibold text-[#1C1917]">Total Earnings</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </div>

          <div className="card-job" data-testid="policies-stat">
            <div className="flex items-center justify-between mb-2">
              <ShieldCheck className="h-8 w-8 text-[#EA580C]" />
              <span className="text-3xl font-bold text-[#1C1917]">{policies.length}</span>
            </div>
            <p className="text-sm font-semibold text-[#1C1917]">Safety Policies</p>
            <p className="text-xs text-muted-foreground">Active coverage</p>
          </div>

          {/* Active Jobs Feed - Takes 2 columns, 2 rows */}
          <div className="md:col-span-3 lg:col-span-2 md:row-span-2 bg-white rounded-xl p-6 border border-stone-100" data-testid="active-jobs-section">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1C1917]">Your Jobs</h2>
              <Link to="/worker/jobs" data-testid="browse-jobs-button">
                <Button className="btn-secondary" size="sm">Browse Jobs</Button>
              </Link>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {jobs.length === 0 ? (
                <div className="text-center py-12" data-testid="no-jobs-message">
                  <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No jobs yet</p>
                  <Link to="/worker/jobs">
                    <Button className="btn-primary">Find Your First Job</Button>
                  </Link>
                </div>
              ) : (
                jobs.map((job) => (
                  <div key={job.id} className="border border-stone-200 rounded-lg p-4 hover:border-orange-200 transition-colors" data-testid={`job-card-${job.id}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-[#1C1917]">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.category}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        job.status === 'assigned' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-lg font-bold text-[#0F766E]">₹{job.pay}</span>
                      <Link to={`/worker/job/${job.id}`}>
                        <Button size="sm" variant="outline">View Details</Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Safety Status */}
          <div className="md:col-span-3 lg:col-span-2 safety-card-gradient rounded-xl p-6" data-testid="safety-status-card">
            <div className="flex items-start gap-4">
              <div className="bg-teal-100 p-3 rounded-full">
                <ShieldCheck className="h-8 w-8 text-[#0F766E]" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#0F766E] mb-2">You're Protected</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {policies.length} active safety {policies.length === 1 ? 'policy' : 'policies'} covering your current jobs
                </p>
                <Link to="/worker/safety" data-testid="view-policies-button">
                  <Button variant="outline" size="sm" className="border-[#0F766E] text-[#0F766E] hover:bg-[#0F766E]/5">
                    View All Policies
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card-job" data-testid="quick-actions">
            <h3 className="font-bold text-[#1C1917] mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/worker/jobs" data-testid="find-jobs-link">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <Briefcase className="h-4 w-4" />
                  Find Jobs
                </Button>
              </Link>
              <Link to="/worker/safety" data-testid="safety-link">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Safety Center
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating SOS Button - Always Visible */}
        <Link 
          to="/worker/sos" 
          data-testid="floating-sos-button"
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 9999
          }}
          className="sm:bottom-8 sm:right-8"
        >
          <button className="bg-[#DC2626] text-white h-14 w-14 sm:h-16 sm:w-16 rounded-full flex items-center justify-center sos-pulse shadow-2xl hover:scale-105 transition-transform" aria-label="Emergency SOS">
            <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default WorkerDashboard;