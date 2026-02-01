import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Briefcase } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import Navbar from '../components/Navbar';
import { UserContext, API } from '../App';
import { toast } from 'sonner';
import { Toaster } from '../components/ui/sonner';

const PostJob = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    pay: '',
    duration: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Cleaning', 'Delivery', 'Beauty', 'Tutoring', 'Cooking', 'Caregiving'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(`${API}/jobs`, {
        ...formData,
        pay: parseFloat(formData.pay),
        employer_id: user.id,
        employer_name: user.name
      });

      toast.success('Job posted successfully!');
      setTimeout(() => {
        navigate('/employer/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error('Failed to post job. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <Navbar />
      <Toaster position="top-right" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-100 p-3 rounded-full">
              <Briefcase className="h-6 w-6 text-[#EA580C]" />
            </div>
            <h1 className="text-2xl font-bold text-[#1C1917]" data-testid="post-job-heading">Post a New Job</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="post-job-form">
            <div>
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                type="text"
                placeholder="e.g., House Cleaning Service"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                data-testid="title-input"
                className="h-12 bg-stone-50"
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})} required>
                <SelectTrigger className="h-12 bg-stone-50" data-testid="category-select">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} data-testid={`category-${cat.toLowerCase()}`}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the job requirements and expectations..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                data-testid="description-input"
                className="min-h-24 bg-stone-50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., Koramangala, Bangalore"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                  data-testid="location-input"
                  className="h-12 bg-stone-50"
                />
              </div>

              <div>
                <Label htmlFor="duration">Duration *</Label>
                <Input
                  id="duration"
                  type="text"
                  placeholder="e.g., 2 hours, 1 day"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  required
                  data-testid="duration-input"
                  className="h-12 bg-stone-50"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="pay">Payment (₹) *</Label>
              <Input
                id="pay"
                type="number"
                placeholder="e.g., 500"
                value={formData.pay}
                onChange={(e) => setFormData({...formData, pay: e.target.value})}
                required
                min="1"
                data-testid="pay-input"
                className="h-12 bg-stone-50"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Note: ₹2 safety fee will be automatically added
              </p>
            </div>

            <div className="safety-card-gradient rounded-lg p-4">
              <p className="text-sm font-semibold text-[#0F766E] mb-1">Safety Fee Included</p>
              <p className="text-xs text-muted-foreground">
                Every job on SWAYAM includes a ₹2 safety fee that provides workers with medical coverage, legal aid, and emergency support.
              </p>
            </div>

            <Button 
              type="submit" 
              className="btn-primary w-full text-lg h-14"
              disabled={submitting}
              data-testid="submit-job-button"
            >
              {submitting ? 'Posting...' : 'Post Job'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;