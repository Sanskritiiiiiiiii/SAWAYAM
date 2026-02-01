import WomenGigWorker from "../assets/Women-GigWorker.jpg";
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, IndianRupee, AlertCircle, Users, Heart, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient py-20 md:py-32" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold mb-6" data-testid="tagline">
                <ShieldCheck className="h-4 w-4" />
                Empowering Women Gig Workers
              </div>
              
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none text-[#1C1917] mb-6" data-testid="hero-heading">
                Safe Gigs for<br />
                <span className="text-[#EA580C]">Every Woman</span>
              </h1>
              
              <p className="text-lg leading-relaxed text-muted-foreground mb-8 max-w-2xl" data-testid="hero-description">
                India's first gig platform with instant safety protection. For just ₹2 per job, get medical coverage, legal aid, and 24/7 emergency support. Because every woman deserves to work fearlessly.
              </p>

              {/* Safety Fee Highlight */}
              <div className="safety-card-gradient rounded-xl p-6 mb-8 max-w-md" data-testid="safety-fee-card">
                <div className="flex items-start gap-4">
                  <div className="bg-teal-100 p-3 rounded-full">
                    <IndianRupee className="h-6 w-6 text-[#0F766E]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0F766E] mb-2">₹2 Safety Fee = Full Protection</h3>
                    <p className="text-sm text-muted-foreground">
                      Every job automatically includes medical coverage, legal aid, accident protection, and instant SOS support.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/login" data-testid="find-work-button">
                  <Button className="btn-primary gap-2">
                    Find Work
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/login" data-testid="hire-safely-button">
                  <Button className="btn-secondary">Hire Safely</Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5" data-testid="hero-image">
             <img 
                src={WomenGigWorker}
                alt="Confident Indian woman delivery partner"
                className="rounded-2xl shadow-2xl w-full hover-lift"
            />

            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1C1917] mb-4">How SWAYAM Protects You</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Automatic safety coverage with every gig you accept
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Heart className="h-8 w-8 text-[#EA580C]" />,
                title: "Medical Coverage",
                description: "Up to ₹50,000 emergency medical support"
              },
              {
                icon: <ShieldCheck className="h-8 w-8 text-[#0F766E]" />,
                title: "Legal Aid",
                description: "Free consultation + ₹25,000 legal support"
              },
              {
                icon: <AlertCircle className="h-8 w-8 text-[#DC2626]" />,
                title: "SOS Emergency",
                description: "24/7 instant response & location tracking"
              },
              {
                icon: <Award className="h-8 w-8 text-[#15803D]" />,
                title: "Verified Jobs",
                description: "Every employer and worker is verified"
              }
            ].map((feature, idx) => (
              <div key={idx} className="card-job hover-lift" data-testid={`feature-card-${idx}`}>
                <div className="bg-orange-50 p-3 rounded-full w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#1C1917] mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-teal-50" data-testid="how-it-works-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1C1917] mb-4">Simple. Safe. Instant.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Browse Verified Gigs", desc: "Find jobs near you from verified employers" },
              { step: "2", title: "Accept + Pay ₹2", desc: "Safety policy activates instantly" },
              { step: "3", title: "Work Protected", desc: "Complete job with full safety coverage" }
            ].map((item, idx) => (
              <div key={idx} className="text-center" data-testid={`step-${idx}`}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#EA580C] text-white text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-[#1C1917] mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0F766E]" data-testid="cta-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Join 10,000+ Women Working Safely
          </h2>
          <p className="text-lg text-teal-100 mb-8">
            Start earning with confidence. Your safety is our priority.
          </p>
          <Link to="/login" data-testid="cta-button">
            <Button className="bg-white text-[#0F766E] hover:bg-gray-100 h-14 px-10 rounded-full font-bold text-lg">
              Get Started Now
            </Button>
          </Link>
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

export default LandingPage;