import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, LayoutDashboard, Briefcase, Shield, AlertCircle, Info, Menu, X } from 'lucide-react';
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
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2" data-testid="logo-link" onClick={closeMobileMenu}>
            <ShieldCheck className="h-7 w-7 sm:h-8 sm:w-8 text-[#EA580C]" />
            <span className="text-xl sm:text-2xl font-bold text-[#1C1917]">SWAYAM</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to={user.role === 'worker' ? '/worker/dashboard' : '/employer/dashboard'} data-testid="dashboard-link">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                
                {user.role === 'worker' && (
                  <>
                    <Link to="/worker/jobs" data-testid="browse-jobs-link">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Briefcase className="h-4 w-4" />
                        Jobs
                      </Button>
                    </Link>
                    <Link to="/worker/safety" data-testid="safety-link">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Shield className="h-4 w-4" />
                        Safety
                      </Button>
                    </Link>
                    <Link to="/worker/sos" data-testid="sos-nav-link">
                      <Button variant="ghost" size="sm" className="gap-2 text-red-600 hover:text-red-700">
                        <AlertCircle className="h-4 w-4" />
                        SOS
                      </Button>
                    </Link>
                  </>
                )}
                
                <Link to="/about" data-testid="about-link">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Info className="h-4 w-4" />
                    About
                  </Button>
                </Link>

                <div className="flex items-center gap-3 pl-4 border-l border-stone-200">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#1C1917]" data-testid="user-name">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize" data-testid="user-role">{user.role}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout} data-testid="logout-button">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/about" data-testid="about-link-guest">
                  <Button variant="ghost" size="sm">About</Button>
                </Link>
                <Link to="/login" data-testid="login-link">
                  <Button className="btn-primary" size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-button"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white" data-testid="mobile-menu">
          <div className="px-4 py-4 space-y-3">
            {user ? (
              <>
                <div className="pb-3 border-b border-stone-200">
                  <p className="text-sm font-semibold text-[#1C1917]">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
                
                <Link to={user.role === 'worker' ? '/worker/dashboard' : '/employer/dashboard'} onClick={closeMobileMenu}>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                
                {user.role === 'worker' && (
                  <>
                    <Link to="/worker/jobs" onClick={closeMobileMenu} data-testid="mobile-browse-jobs-link">
                      <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                        <Briefcase className="h-4 w-4" />
                        Jobs
                      </Button>
                    </Link>
                    <Link to="/worker/safety" onClick={closeMobileMenu} data-testid="mobile-safety-link">
                      <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                        <Shield className="h-4 w-4" />
                        Safety
                      </Button>
                    </Link>
                    <Link to="/worker/sos" onClick={closeMobileMenu} data-testid="mobile-sos-link">
                      <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        SOS
                      </Button>
                    </Link>
                  </>
                )}
                
                <Link to="/about" onClick={closeMobileMenu}>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                    <Info className="h-4 w-4" />
                    About
                  </Button>
                </Link>

                <Button variant="outline" size="sm" onClick={handleLogout} className="w-full justify-start gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/about" onClick={closeMobileMenu}>
                  <Button variant="ghost" size="sm" className="w-full">About</Button>
                </Link>
                <Link to="/login" onClick={closeMobileMenu}>
                  <Button className="btn-primary w-full">Get Started</Button>
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