import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, Users, Briefcase, Heart, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import { API } from '../App';

const ImpactPage = () => {
  const [stats, setStats] = useState({
    total_workers: 0,
    total_jobs: 0,
    policies_activated: 0,
    sos_responded: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/stats/impact`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-gradient py-20" data-testid="impact-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <ShieldCheck className="h-12 w-12 text-[#EA580C]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1C1917] mb-6" data-testid="impact-heading">
            Creating Safe Workspaces<br />
            <span className="text-[#EA580C]">for Women Everywhere</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            SWAYAM is transforming the gig economy by making safety accessible and affordable for every woman worker in India.
          </p>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-white" data-testid="impact-stats">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-4">Our Impact</h2>
            <p className="text-lg text-muted-foreground">Real numbers, real change</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card-job text-center" data-testid="stat-workers">
              <div className="bg-orange-50 p-4 rounded-full w-fit mx-auto mb-4">
                <Users className="h-10 w-10 text-[#EA580C]" />
              </div>
              <div className="text-4xl font-bold text-[#1C1917] mb-2">{stats.total_workers}+</div>
              <p className="text-sm font-semibold text-[#1C1917]">Women Protected</p>
              <p className="text-xs text-muted-foreground">Active workers on platform</p>
            </div>

            <div className="card-job text-center" data-testid="stat-jobs">
              <div className="bg-teal-50 p-4 rounded-full w-fit mx-auto mb-4">
                <Briefcase className="h-10 w-10 text-[#0F766E]" />
              </div>
              <div className="text-4xl font-bold text-[#1C1917] mb-2">{stats.total_jobs}+</div>
              <p className="text-sm font-semibold text-[#1C1917]">Safe Jobs Created</p>
              <p className="text-xs text-muted-foreground">Verified opportunities</p>
            </div>

            <div className="card-job text-center" data-testid="stat-policies">
              <div className="bg-green-50 p-4 rounded-full w-fit mx-auto mb-4">
                <ShieldCheck className="h-10 w-10 text-[#15803D]" />
              </div>
              <div className="text-4xl font-bold text-[#1C1917] mb-2">{stats.policies_activated}+</div>
              <p className="text-sm font-semibold text-[#1C1917]">Policies Activated</p>
              <p className="text-xs text-muted-foreground">Active safety coverage</p>
            </div>

            <div className="card-job text-center" data-testid="stat-sos">
              <div className="bg-red-50 p-4 rounded-full w-fit mx-auto mb-4">
                <Heart className="h-10 w-10 text-[#DC2626]" />
              </div>
              <div className="text-4xl font-bold text-[#1C1917] mb-2">{stats.sos_responded}+</div>
              <p className="text-sm font-semibold text-[#1C1917]">SOS Responded</p>
              <p className="text-xs text-muted-foreground">Emergency cases handled</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-teal-50" data-testid="mission-section">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1637176594832-97454dc84edf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NDh8MHwxfHNlYXJjaHwxfHxncm91cCUyMG9mJTIwZGl2ZXJzZSUyMGluZGlhbiUyMHdvbWVuJTIwY29uZmlkZW50fGVufDB8fHx8MTc2OTcwNjU5M3ww&ixlib=rb-4.1.0&q=85"
                alt="Diverse Indian women standing together"
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                To create a gig economy where every woman can work with confidence, dignity, and complete safety protection.
              </p>
              <p className="text-muted-foreground mb-4">
                We believe safety shouldn't be a luxury. That's why we've made it automatic, affordable, and accessible through our innovative ₹2 safety fee model.
              </p>
              <p className="text-muted-foreground">
                Every job on SWAYAM comes with built-in protection - medical coverage, legal aid, accident insurance, and 24/7 emergency support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="py-20 bg-white" data-testid="future-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-4">Future Scalability</h2>
            <p className="text-lg text-muted-foreground">Building for tomorrow</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Government Partnership',
                description: 'Integration with state welfare schemes and women safety initiatives'
              },
              {
                title: 'NGO Collaboration',
                description: 'Working with women empowerment organizations for wider reach'
              },
              {
                title: 'Pan-India Expansion',
                description: 'Scaling to every city and village, protecting millions of women workers'
              }
            ].map((item, idx) => (
              <div key={idx} className="card-job" data-testid={`future-card-${idx}`}>
                <div className="bg-orange-50 p-3 rounded-full w-fit mb-4">
                  <TrendingUp className="h-8 w-8 text-[#EA580C]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1C1917] mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1C1917] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ShieldCheck className="h-6 w-6 text-[#EA580C]" />
            <span className="text-xl font-bold">SWAYAM</span>
          </div>
          <p className="text-gray-400 text-sm">Smart Work Assurance for Women</p>
          <p className="text-gray-500 text-xs mt-4">© 2025 SWAYAM. Empowering women gig workers across India.</p>
        </div>
      </footer>
    </div>
  );
};

export default ImpactPage;