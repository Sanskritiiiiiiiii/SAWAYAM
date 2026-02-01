import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, IndianRupee, Clock, ShieldCheck, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import Navbar from '../components/Navbar';
import { UserContext, API } from '../App';
import { toast } from 'sonner';
import { Toaster } from '../components/ui/sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [policyId, setPolicyId] = useState(null);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await axios.get(`${API}/jobs/${id}`);
      setJob(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Job not found');
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      const response = await axios.post(`${API}/jobs/${id}/apply`, {
        worker_id: user.id,
        worker_name: user.name
      });
      
      setPolicyId(response.data.policy_id);
      setShowPolicyModal(true);
      toast.success('Job accepted! Safety policy activated.');
      
      setTimeout(() => {
        navigate('/worker/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Error applying:', error);
      toast.error(error.response?.data?.detail || 'Failed to apply');
    }
    setApplying(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFBF7]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#FFFBF7]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Job not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <Navbar />
      <Toaster position="top-right" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8" data-testid="job-details-card">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="badge-safety mb-3" data-testid="safety-badge">
                <ShieldCheck className="h-3 w-3" />
                Safety Protected Job
              </div>
              <h1 className="text-3xl font-bold text-[#1C1917] mb-2" data-testid="job-title">{job.title}</h1>
              <p className="text-lg text-muted-foreground" data-testid="job-category">{job.category}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-[#0F766E]" data-testid="job-pay">₹{job.pay}</div>
              <div className="text-sm text-muted-foreground">+ ₹2 safety fee</div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6 mb-8">
            <div>
              <h3 className="font-semibold text-[#1C1917] mb-2">Description</h3>
              <p className="text-muted-foreground" data-testid="job-description">{job.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-lg">
                <MapPin className="h-5 w-5 text-[#EA580C]" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-semibold text-[#1C1917]" data-testid="job-location">{job.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-lg">
                <Clock className="h-5 w-5 text-[#EA580C]" />
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-semibold text-[#1C1917]" data-testid="job-duration">{job.duration}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-lg">
                <User className="h-5 w-5 text-[#EA580C]" />
                <div>
                  <p className="text-xs text-muted-foreground">Employer</p>
                  <p className="font-semibold text-[#1C1917]" data-testid="employer-name">{job.employer_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-lg">
                <ShieldCheck className="h-5 w-5 text-[#0F766E]" />
                <div>
                  <p className="text-xs text-muted-foreground">Safety Fee</p>
                  <p className="font-semibold text-[#0F766E]">₹2 (auto-deducted)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Coverage */}
          <div className="safety-card-gradient rounded-xl p-6 mb-8" data-testid="coverage-card">
            <h3 className="text-lg font-bold text-[#0F766E] mb-4">What's Covered (₹2 Safety Fee)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { label: 'Medical Emergency', value: 'Up to ₹50,000' },
                { label: 'Legal Aid', value: 'Free consultation + ₹25,000' },
                { label: 'Accident Protection', value: 'Up to ₹1,00,000' },
                { label: 'Harassment Support', value: '24/7 hotline + legal aid' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2" data-testid={`coverage-item-${idx}`}>
                  <CheckCircle2 className="h-5 w-5 text-[#0F766E] mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#1C1917] text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          {job.status === 'open' ? (
            <Button 
              className="btn-primary w-full text-lg h-14"
              onClick={handleApply}
              disabled={applying}
              data-testid="apply-job-button"
            >
              {applying ? 'Processing...' : 'Accept Job & Activate Safety'}
            </Button>
          ) : (
            <div className="text-center py-4 bg-stone-100 rounded-lg">
              <p className="text-muted-foreground">This job is no longer available</p>
            </div>
          )}
        </div>
      </div>

      {/* Safety Policy Activated Modal */}
      <Dialog open={showPolicyModal} onOpenChange={setShowPolicyModal}>
        <DialogContent className="sm:max-w-md" data-testid="policy-activated-modal">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">Safety Policy Activated!</DialogTitle>
            <DialogDescription className="text-center">
              Your ₹2 safety fee has been deducted and your policy is now active for this job.
            </DialogDescription>
          </DialogHeader>
          <div className="safety-card-gradient rounded-lg p-4 mt-4">
            <p className="text-sm font-semibold text-[#0F766E] mb-2">Coverage Active:</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Medical emergency support</li>
              <li>• Legal aid & harassment hotline</li>
              <li>• Accident protection</li>
              <li>• 24/7 SOS emergency response</li>
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobDetails;