import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, LayoutDashboard, Briefcase, Shield, AlertCircle, Info, Menu, X, BookOpen } from 'lucide-react';
import { UserContext } from '../App';
import { Button } from './ui/button';

const Navbar = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
            <ShieldCheck className="h-7 w-7 text-[#EA580C]" />
            <span className="text-xl font-bold text-[#1C1917]">SWAYAM</span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to={
                  user.role === 'admin' ? '/admin/dashboard' :
                  user.role === 'worker' ? '/worker/dashboard' : 
                  '/employer/dashboard'
                }>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>

                {user.role === 'worker' && (
                  <>
                    <Link to="/worker/jobs">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Briefcase className="h-4 w-4" />
                        Jobs
                      </Button>
                    </Link>

                    {/* ✅ FIXED SAFETY LINK */}
                    <Link to="/worker/safety">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Shield className="h-4 w-4" />
                        Safety
                      </Button>
                    </Link>

                    <Link to="/worker/sos">
                      <Button variant="ghost" size="sm" className="gap-2 text-red-600">
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

                <div className="flex items-center gap-3 pl-4 border-l border-stone-200">
                  <div className="text-right">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/about">
                  <Button variant="ghost" size="sm">About</Button>
                </Link>
                <Link to="/schemes">
                  <Button variant="ghost" size="sm">Schemes</Button>
                </Link>
                <Link to="/login">
                  <Button className="btn-primary" size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE NAV */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white">
          <div className="px-4 py-4 space-y-3">

            {user && (
              <>
                <Link to="/worker/dashboard" onClick={closeMobileMenu}>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>

                <Link to="/worker/jobs" onClick={closeMobileMenu}>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                    <Briefcase className="h-4 w-4" />
                    Jobs
                  </Button>
                </Link>

                {/* ✅ FIXED MOBILE SAFETY */}
                <Link to="/worker/safety" onClick={closeMobileMenu}>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                    <Shield className="h-4 w-4" />
                    Safety
                  </Button>
                </Link>

                <Link to="/worker/sos" onClick={closeMobileMenu}>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    SOS
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
