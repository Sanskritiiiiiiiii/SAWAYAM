import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Briefcase, Users, CheckCircle2, Clock, PlusCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import Navbar from '../components/Navbar';
import { UserContext, API } from '../App';
import { Toaster } from '../components/ui/sonner';

const EmployerDashboard = () => {
  const { user } = useContext(UserContext);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ open: 0, assigned: 0, completed: 0 });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API}/jobs/employer/${user.id}`);
      setJobs(response.data);
      
      const open = response.data.filter(j => j.status === 'open').length;
      const assigned = response.data.filter(j => j.status === 'assigned').length;
      const completed = response.data.filter(j => j.status === 'completed').length;
      
      setStats({ open, assigned, completed });
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <Navbar />
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-2" data-testid="employer-dashboard-heading">
              Welcome, {user.name}
            </h1>
            <p className="text-muted-foreground">Manage your posted jobs</p>
          </div>
          <Link to="/employer/post-job" data-testid="post-job-link">
            <Button className="btn-primary gap-2">
              <PlusCircle className="h-5 w-5" />
              Post New Job
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-job" data-testid="open-jobs-stat">
            <div className="flex items-center justify-between mb-2">
              <Briefcase className="h-8 w-8 text-[#EA580C]" />
              <span className="text-3xl font-bold text-[#1C1917]">{stats.open}</span>
            </div>
            <p className="text-sm font-semibold text-[#1C1917]">Open Jobs</p>
            <p className="text-xs text-muted-foreground">Awaiting workers</p>
          </div>

          <div className="card-job" data-testid="assigned-jobs-stat">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-8 w-8 text-[#F59E0B]" />
              <span className="text-3xl font-bold text-[#1C1917]">{stats.assigned}</span>
            </div>
            <p className="text-sm font-semibold text-[#1C1917]">In Progress</p>
            <p className="text-xs text-muted-foreground">Workers assigned</p>
          </div>

          <div className="card-job" data-testid="completed-jobs-stat">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="h-8 w-8 text-[#15803D]" />
              <span className="text-3xl font-bold text-[#1C1917]">{stats.completed}</span>
            </div>
            <p className="text-sm font-semibold text-[#1C1917]">Completed</p>
            <p className="text-xs text-muted-foreground">Jobs finished</p>
          </div>
        </div>

        {/* Jobs List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#1C1917] mb-6">Your Posted Jobs</h2>

          {jobs.length === 0 ? (
            <div className="text-center py-12" data-testid="no-jobs-message">
              <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No jobs posted yet</p>
              <Link to="/employer/post-job">
                <Button className="btn-primary">Post Your First Job</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="border border-stone-200 rounded-lg p-4 hover:border-orange-200 transition-colors" data-testid={`job-card-${job.id}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-[#1C1917] text-lg">{job.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          job.status === 'open' ? 'bg-blue-100 text-blue-700' :
                          job.status === 'assigned' ? 'bg-orange-100 text-orange-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{job.category} • {job.location}</p>
                      
                      {job.worker_name && (
                        <div className="flex items-center gap-2 mt-2 text-sm">
                          <Users className="h-4 w-4 text-[#0F766E]" />
                          <span className="text-[#0F766E] font-medium">Assigned to: {job.worker_name}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#0F766E]">₹{job.pay}</div>
                      <div className="text-xs text-muted-foreground">+ ₹2 safety</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;