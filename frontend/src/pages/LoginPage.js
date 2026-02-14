import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ShieldCheck, User, Briefcase, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { UserContext, API } from "../App";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";

const LoginPage = () => {
  const [role, setRole] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ---------------- REGISTER ----------------
      if (isRegistering) {
        await axios.post(`${API}/auth/register`, {
          ...formData,
          role,
        });

        toast.success("Account created successfully!");
        setIsRegistering(false);
        return;
      }

      // ---------------- LOGIN ----------------
      const response = await axios.post(`${API}/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("swayam_token", response.data.access_token);
      login(response.data.user);

      toast.success("Logged in successfully!");

      // 🔥 IMPORTANT:
      // Do NOT decide onboarding here.
      // App.js will handle onboarding redirect.
      if (response.data.user.role === "worker") {
        navigate("/worker/dashboard");
      } else if (response.data.user.role === "employer") {
        navigate("/employer/dashboard");
      } else {
        navigate("/admin/dashboard");
      }

    } catch (error) {
      console.error("Auth error:", error);

      if (error.response?.status === 401) {
        toast.error("Invalid email or password");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.detail || "Email already registered");
      } else if (error.response?.status === 422) {
        toast.error("Please check your input details");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  // ---------------- ROLE SELECTION ----------------
  if (!role) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <Toaster position="top-right" />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ShieldCheck className="h-12 w-12 text-[#EA580C]" />
              <span className="text-4xl font-bold text-[#1C1917]">SWAYAM</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-4">
              Welcome to SWAYAM
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose how you want to continue
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              onClick={() => handleRoleSelect("worker")}
              className="card-job hover-lift cursor-pointer p-8 text-center"
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

            <div
              onClick={() => handleRoleSelect("employer")}
              className="card-job hover-lift cursor-pointer p-8 text-center"
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

  // ---------------- LOGIN / REGISTER FORM ----------------
  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center">
      <Toaster position="top-right" />
      <div className="max-w-md w-full mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ShieldCheck className="h-8 w-8 text-[#EA580C]" />
              <span className="text-2xl font-bold text-[#1C1917]">SWAYAM</span>
            </div>
            <h2 className="text-2xl font-bold text-[#1C1917] mb-2">
              {isRegistering ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-sm text-muted-foreground capitalize">
              {role} Account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="h-12 bg-stone-50"
                />
              </div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="h-12 bg-stone-50"
              />
            </div>

            {isRegistering && (
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                  className="h-12 bg-stone-50"
                />
              </div>
            )}

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="h-12 bg-stone-50"
              />
            </div>

            <Button type="submit" className="btn-primary w-full">
              {isRegistering ? "Create Account" : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-sm text-[#EA580C] hover:underline"
            >
              {isRegistering
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </button>
          </div>

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
