import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  LayoutDashboard,
  Briefcase,
  Shield,
  AlertCircle,
  Info,
  BookOpen,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { UserContext } from "../App";
import { Button } from "./ui/button";

const Navbar = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  const dashboardPath =
    user?.role === "worker"
      ? "/worker/dashboard"
      : "/employer/dashboard";

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2"
          >
            <ShieldCheck className="h-8 w-8 text-[#EA580C]" />
            <span className="text-2xl font-bold text-[#1C1917]">
              SWAYAM
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to={dashboardPath}>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>

                {user.role === "worker" && (
                  <>
                    <Link to="/worker/jobs">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Briefcase className="h-4 w-4" />
                        Jobs
                      </Button>
                    </Link>

                    <Link to="/worker/safety">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Shield className="h-4 w-4" />
                        Safety
                      </Button>
                    </Link>

                    <Link to="/worker/sos">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-red-600 hover:text-red-700"
                      >
                        <AlertCircle className="h-4 w-4" />
                        SOS
                      </Button>
                    </Link>
                  </>
                )}

                <Link to="/about">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Info className="h-4 w-4" />
                    About
                  </Button>
                </Link>

                <Link to="/schemes">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Schemes
                  </Button>
                </Link>

                {/* User Info */}
                <div className="flex items-center gap-3 pl-4 border-l border-stone-200">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#1C1917]">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user.role}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/about">
                  <Button variant="ghost" size="sm">
                    About
                  </Button>
                </Link>

                <Link to="/schemes">
                  <Button variant="ghost" size="sm">
                    Schemes
                  </Button>
                </Link>

                <Link to="/login">
                  <Button className="btn-primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2"
          >
            {menuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            {user ? (
              <>
                <div className="pb-3 border-b border-stone-200">
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user.role}
                  </p>
                </div>

                <Link to={dashboardPath} onClick={closeMenu}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>

                {user.role === "worker" && (
                  <>
                    <Link to="/worker/jobs" onClick={closeMenu}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2"
                      >
                        <Briefcase className="h-4 w-4" />
                        Jobs
                      </Button>
                    </Link>

                    <Link to="/worker/safety" onClick={closeMenu}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2"
                      >
                        <Shield className="h-4 w-4" />
                        Safety
                      </Button>
                    </Link>

                    <Link to="/worker/sos" onClick={closeMenu}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2 text-red-600"
                      >
                        <AlertCircle className="h-4 w-4" />
                        SOS
                      </Button>
                    </Link>
                  </>
                )}

                <Link to="/about" onClick={closeMenu}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2"
                  >
                    <Info className="h-4 w-4" />
                    About
                  </Button>
                </Link>

                <Link to="/schemes" onClick={closeMenu}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    Schemes
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/about" onClick={closeMenu}>
                  <Button variant="ghost" size="sm" className="w-full">
                    About
                  </Button>
                </Link>

                <Link to="/schemes" onClick={closeMenu}>
                  <Button variant="ghost" size="sm" className="w-full">
                    Schemes
                  </Button>
                </Link>

                <Link to="/login" onClick={closeMenu}>
                  <Button className="btn-primary w-full">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
