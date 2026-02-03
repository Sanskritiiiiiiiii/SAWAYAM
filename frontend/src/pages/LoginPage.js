import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { ShieldCheck, User, Briefcase, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input.jsx";
import { Label } from "../components/ui/label";
import { Toaster } from "../components/ui/sonner";

import { UserContext, API } from "../App";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  // Role Selection (worker/employer)
  const [role, setRole] = useState(null);

  // Toggle between Login and Register mode
  const [isRegistering, setIsRegistering] = useState(false);

  // Form Data State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Small helper to update form fields (cleaner + human style)
  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission (Login/Register)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      // Register Flow
      if (isRegistering) {
        response = await axios.post(`${API}/auth/register`, {
          ...formData,
          role,
        });

        toast.success("Account created successfully!");
      }

      // Login Flow
      else {
        response = await axios.post(`${API}/auth/login`, {
          email: formData.email,
          role,
        });

        toast.success("Logged in successfully!");
      }

      // Save user in global context
      login(response.data);

      // Redirect user based on role
      navigate(
        role === "worker"
          ? "/worker/dashboard"
          : "/employer/dashboard"
      );
    } catch (error) {
      // Friendly error handling
      if (error.response?.status === 404 && !isRegistering) {
        toast.error("Account not found. Please register first.");
        setIsRegistering(true);
      } else if (error.response?.status === 400 && isRegistering) {
        toast.error("Account already exists. Please login.");
        setIsRegistering(false);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  // ROLE SELECTION SCREEN
  if (!role) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <Toaster position="top-right" />

        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Heading */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ShieldCheck className="h-12 w-12 text-[#EA580C]" />
              <span className="text-4xl font-bold text-[#1C1917]">
                SWAYAM
              </span>
            </div>

            <h1
              className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-4"
              data-testid="role-select-heading"
            >
              Welcome to SWAYAM
            </h1>

            <p className="text-lg text-muted-foreground">
              Choose how you want to continue
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Worker */}
            <div
              onClick={() => setRole("worker")}
              className="card-job hover-lift cursor-pointer p-8 text-center"
              data-testid="worker-role-card"
            >
              <div className="bg-orange-50 p-6 rounded-full w-fit mx-auto mb-6">
                <User className="h-12 w-12 text-[#EA580C]" />
              </div>

              <h2 className="text-2xl font-bold text-[#1C1917] mb-3">
                I'm a Worker
              </h2>

              <p className="text-muted-foreground mb-6">
                Find verified gigs with instant safety protection
              </p>

              <Button className="btn-primary w-full gap-2">
                Continue as Worker
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Employer */}
            <div
              onClick={() => setRole("employer")}
              className="card-job hover-lift cursor-pointer p-8 text-center"
              data-testid="employer-role-card"
            >
              <div className="bg-teal-50 p-6 rounded-full w-fit mx-auto mb-6">
                <Briefcase className="h-12 w-12 text-[#0F766E]" />
              </div>

              <h2 className="text-2xl font-bold text-[#1C1917] mb-3">
                I'm an Employer
              </h2>

              <p className="text-muted-foreground mb-6">
                Hire verified workers for trusted, safe service
              </p>

              <Button className="btn-secondary w-full gap-2">
                Continue as Employer
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LOGIN / REGISTER FORM SCREEN
  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center">
      <Toaster position="top-right" />

      <div className="max-w-md w-full mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ShieldCheck className="h-8 w-8 text-[#EA580C]" />
              <span className="text-2xl font-bold text-[#1C1917]">
                SWAYAM
              </span>
            </div>

            <h2
              className="text-2xl font-bold text-[#1C1917] mb-2"
              data-testid="login-form-heading"
            >
              {isRegistering ? "Create Account" : "Welcome Back"}
            </h2>

            <p className="text-sm text-muted-foreground capitalize">
              {role} Account
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            data-testid="login-form"
          >
            {/* Name (Register only) */}
            {isRegistering && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  required
                  className="h-12 bg-stone-50"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                required
                className="h-12 bg-stone-50"
              />
            </div>

            {/* Phone (Register only) */}
            {isRegistering && (
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  required
                  className="h-12 bg-stone-50"
                />
              </div>
            )}

            {/* Submit */}
            <Button type="submit" className="btn-primary w-full">
              {isRegistering ? "Create Account" : "Login"}
            </Button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsRegistering((prev) => !prev)}
              className="text-sm text-[#EA580C] hover:underline"
            >
              {isRegistering
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </button>
          </div>

          {/* Back */}
          <div className="mt-4 text-center">
            <button
              onClick={() => setRole(null)}
              className="text-sm text-muted-foreground hover:underline"
            >
              Back to role selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
