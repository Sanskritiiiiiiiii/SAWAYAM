import React from "react";
import { Link } from "react-router-dom";

import WomenGigWorker from "../assets/Women-GigWorker.jpg";

import {
  ShieldCheck,
  IndianRupee,
  AlertCircle,
  Heart,
  Award,
  ArrowRight,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";

/* Content Data (kept outside like real projects) */
const FEATURES = [
  {
    icon: <Heart className="h-8 w-8 text-[#EA580C]" />,
    title: "Medical Coverage",
    description: "Up to ₹50,000 emergency medical support",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-[#0F766E]" />,
    title: "Legal Aid",
    description: "Free consultation + ₹25,000 legal support",
  },
  {
    icon: <AlertCircle className="h-8 w-8 text-[#DC2626]" />,
    title: "SOS Emergency",
    description: "24/7 instant response & location tracking",
  },
  {
    icon: <Award className="h-8 w-8 text-[#15803D]" />,
    title: "Verified Jobs",
    description: "Every employer and worker is verified",
  },
];

const STEPS = [
  {
    step: "1",
    title: "Browse Verified Gigs",
    desc: "Find jobs near you from verified employers",
  },
  {
    step: "2",
    title: "Accept + Pay ₹2",
    desc: "Safety policy activates instantly",
  },
  {
    step: "3",
    title: "Work Protected",
    desc: "Complete job with full safety coverage",
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ================= HERO ================= */}
      <HeroSection />

      {/* ================= FEATURES ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="How SWAYAM Protects You"
            subtitle="Automatic safety coverage with every gig you accept"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((feature, idx) => (
              <FeatureCard key={idx} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Simple. Safe. Instant." />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((item, idx) => (
              <StepCard key={idx} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <CTASection />

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
};

export default LandingPage;

//
// =====================================================
// Components (Human Style)
// =====================================================
//

const HeroSection = () => (
  <section className="hero-gradient py-20 md:py-32">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Content */}
        <div className="lg:col-span-7 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold mb-6">
            <ShieldCheck className="h-4 w-4" />
            Empowering Women Gig Workers
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none text-[#1C1917] mb-6">
            Safe Gigs for <br />
            <span className="text-[#EA580C]">Every Woman</span>
          </h1>

          <p className="text-lg leading-relaxed text-muted-foreground mb-8 max-w-2xl">
            India's first gig platform with instant safety protection. For just
            ₹2 per job, get medical coverage, legal aid, and 24/7 emergency
            support.
          </p>

          {/* Safety Fee Card */}
          <div className="safety-card-gradient rounded-xl p-6 mb-8 max-w-md">
            <div className="flex items-start gap-4">
              <div className="bg-teal-100 p-3 rounded-full">
                <IndianRupee className="h-6 w-6 text-[#0F766E]" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#0F766E] mb-2">
                  ₹2 Safety Fee = Full Protection
                </h3>
                <p className="text-sm text-muted-foreground">
                  Every job automatically includes medical coverage, legal aid,
                  accident protection, and instant SOS support.
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link to="/login">
              <Button className="btn-primary gap-2">
                Find Work <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>

            <Link to="/login">
              <Button className="btn-secondary">Hire Safely</Button>
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="lg:col-span-5">
          <img
            src={WomenGigWorker}
            alt="Confident Indian woman delivery partner"
            className="rounded-2xl shadow-2xl w-full hover-lift"
          />
        </div>
      </div>
    </div>
  </section>
);

const SectionHeading = ({ title, subtitle }) => (
  <div className="text-center mb-16">
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1C1917] mb-4">
      {title}
    </h2>
    {subtitle && (
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        {subtitle}
      </p>
    )}
  </div>
);

const FeatureCard = ({ feature }) => (
  <div className="card-job hover-lift">
    <div className="bg-orange-50 p-3 rounded-full w-fit mb-4">
      {feature.icon}
    </div>
    <h3 className="text-xl font-semibold text-[#1C1917] mb-2">
      {feature.title}
    </h3>
    <p className="text-muted-foreground">{feature.description}</p>
  </div>
);

const StepCard = ({ item }) => (
  <div className="text-center">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#EA580C] text-white text-2xl font-bold mb-4">
      {item.step}
    </div>
    <h3 className="text-xl font-semibold text-[#1C1917] mb-2">
      {item.title}
    </h3>
    <p className="text-muted-foreground">{item.desc}</p>
  </div>
);

const CTASection = () => (
  <section className="py-20 bg-[#0F766E]">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
        Join 10,000+ Women Working Safely
      </h2>

      <p className="text-lg text-teal-100 mb-8">
        Start earning with confidence. Your safety is our priority.
      </p>

      <Link to="/login">
        <Button className="bg-white text-[#0F766E] hover:bg-gray-100 h-14 px-10 rounded-full font-bold text-lg">
          Get Started Now
        </Button>
      </Link>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-[#1C1917] text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <ShieldCheck className="h-6 w-6 text-[#EA580C]" />
        <span className="text-xl font-bold">SWAYAM</span>
      </div>

      <p className="text-gray-400 text-sm">
        Smart Work Assurance for Women
      </p>

      <p className="text-gray-500 text-xs mt-4">
        © 2025 SWAYAM. Empowering women gig workers across India.
      </p>
    </div>
  </footer>
);
