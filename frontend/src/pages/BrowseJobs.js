import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, IndianRupee, Clock, ShieldCheck, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import Navbar from '../components/Navbar';
import { UserContext, API } from '../App';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const BrowseJobs = () => {
  const { user } = useContext(UserContext);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const navigate = useNavigate();

  const categories = ['All', 'Cleaning', 'Delivery', 'Beauty', 'Tutoring', 'Cooking', 'Caregiving'];

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (categoryFilter === 'all') {
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(jobs.filter(job => job.category.toLowerCase() === categoryFilter.toLowerCase()));
    }
  }, [categoryFilter, jobs]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API}/jobs?status=open`);
      setJobs(response.data);
      setFilteredJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-2" data-testid="browse-jobs-heading">
            Find Your Next Gig
          </h1>
          <p className="text-muted-foreground">All jobs include ₹2 safety protection</p>
        </div>

        {/* Filter */}
        <div className="mb-6 flex items-center gap-4">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48" data-testid="category-filter">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat.toLowerCase()} data-testid={`filter-${cat.toLowerCase()}`}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length === 0 ? (
            <div className="col-span-full text-center py-12" data-testid="no-jobs-message">
              <p className="text-muted-foreground">No jobs available in this category</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="card-job" data-testid={`job-card-${job.id}`}>
                {/* Safety Badge */}
                <div className="badge-safety mb-4">
                  <ShieldCheck className="h-3 w-3" />
                  Safety Protected
                </div>

                <h3 className="text-xl font-semibold text-[#1C1917] mb-2">{job.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{job.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {job.duration}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                  <div>
                    <div className="text-2xl font-bold text-[#0F766E]">₹{job.pay}</div>
                    <div className="text-xs text-muted-foreground">+ ₹2 safety fee</div>
                  </div>
                  <Button 
                    className="btn-primary"
                    onClick={() => navigate(`/worker/job/${job.id}`)}
                    data-testid={`apply-button-${job.id}`}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseJobs;