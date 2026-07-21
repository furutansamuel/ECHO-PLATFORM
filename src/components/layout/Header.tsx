import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Menu,
  X,
  User,
  Settings,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Intelligence', href: '/ai-intelligence' },
  { name: 'Community', href: '/community-insights' },
  { name: 'Knowledge', href: '/knowledge' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

const profileRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, logout, user, profile } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 10);

      // Sticky reveal: hide the header while scrolling down past the
      // point where it would otherwise float over content, reveal it
      // again on any upward scroll. Never hides near the very top or
      // while the mobile menu is open, so it doesn't disappear mid-tap.
      if (!isMenuOpen) {
        if (currentY > lastScrollY.current && currentY > 120) {
          setIsHidden(true);
        } else {
          setIsHidden(false);
        }
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen]);

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      profileRef.current &&
      !profileRef.current.contains(event.target as Node)
    ) {
      setIsProfileOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () =>
    document.removeEventListener("mousedown", handleClickOutside);
}, []);
  
  const authLinks = (
    <>
      <Button
  variant="outline"
  className="rounded-full border-primary/20 hover:border-primary hover:bg-primary/5"
  asChild
>
        <Link to="/auth/login">Login</Link>
      </Button>
      <Button
  asChild
  className="rounded-full px-6 hover:shadow-xl hover:scale-105 transition-all duration-300"
>
        <Link to="/auth/register">Get Started</Link>
      </Button>
    </>
  );

     const authenticatedLinks = (
  <div className="flex items-center gap-3">
    
    <div className="relative" ref={profileRef}>
      <Button
  variant="ghost"
  onClick={() => setIsProfileOpen(!isProfileOpen)}
  className="
    flex items-center gap-2 rounded-full px-2 py-2
    hover:bg-primary/10
    focus-visible:ring-2
    focus-visible:ring-primary
    focus-visible:ring-offset-0">
        <div className="h-10 w-10 overflow-hidden rounded-full bg-primary flex items-center justify-center text-white font-semibold ring-0">
  {profile?.avatar_url ? (
    <img
      src={profile.avatar_url}
      alt="Profile"
      className="h-full w-full object-cover"
    />
  ) : (
    user?.email?.charAt(0).toUpperCase() || "U"
  )}
</div>

        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            isProfileOpen && "rotate-180"
          )}
        />
      </Button>

      <AnimatePresence>
      {isProfileOpen && (
        <motion.div
initial={{ x: "100%" }}
animate={{ x: 0 }}
exit={{ x: "100%" }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-0 mt-3 w-64 rounded-2xl border bg-background/95 backdrop-blur-xl shadow-xl origin-top-right"
        >

          <div className="border-b p-4">
            <p className="font-semibold">
  {profile?.full_name ||
   user?.email?.split("@")[0] ||
   "User"}
</p>
            <p className="text-sm text-muted-foreground">
              Welcome back
            </p>
          </div>

          <Link
            to="/profile"
            className="flex gap-3 px-4 py-3 hover:bg-muted"
          >
            <User className="h-4 w-4" />
            My Profile
          </Link>

          <Link
            to="/dashboard"
            className="flex gap-3 px-4 py-3 hover:bg-muted"
          >
            <LayoutDashboard className="h-4 w-4" />
            My Dashboard
          </Link>

          <Link
            to="/settings"
            className="flex gap-3 px-4 py-3 hover:bg-muted"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>

          <div className="border-t" />

          <button
            onClick={logout}
            className="flex w-full gap-3 px-4 py-3 text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>

        </motion.div>
      )}
      </AnimatePresence>
    </div>
  </div>
);

  return (
    <motion.header
  animate={{ y: isHidden ? '-100%' : 0 }}
  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
  className={cn(
    "fixed inset-x-0 top-0 z-[100] w-full transition-all duration-300",
    isScrolled ? "py-3" : "py-0"
  )}
  style={{
    paddingTop: isScrolled
      ? "max(env(safe-area-inset-top), 0.75rem)"
      : "max(env(safe-area-inset-top), 0px)"
  }}
>
      <div
        className={cn(
          'container mx-auto max-w-screen-xl px-4 transition-all duration-500 ease-out',
        )}
      >
        <div
          className={cn(
            'flex h-20 items-center justify-between transition-all duration-500 ease-out',
            isScrolled
              ? 'rounded-2xl border border-border/30 bg-background/70 px-6 shadow-lg backdrop-blur-xl lg:px-8'
              : 'bg-transparent px-4 lg:px-8'
          )}
        >
        <Link
  to="/"
  className="flex items-center gap-4 flex-1 min-w-0"
>
  <img
    src="/echo-wordmark.svg"
    alt="ECHO Logo"
    className="h-12 w-12 object-contain shrink-0"
  />

  <div className="flex flex-col min-w-0">

    <p className="hidden sm:block text-[11px] text-muted-foreground leading-tight truncate">
      AI Environmental Community Health Observatory
    </p>
  </div>
</Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 text-base font-medium">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'relative rounded-xl px-4 py-3 transition-colors duration-300',
                  isActive
                    ? 'text-white'
                    : 'text-muted-foreground hover:text-primary'
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="header-active-pill"
                    className="absolute inset-0 -z-10 rounded-xl bg-primary shadow-md"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? authenticatedLinks : authLinks}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
variant="ghost"
size="icon"
className="rounded-full hover:bg-primary/10 transition-all duration-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
{isMenuOpen && (
<motion.div
  initial={{ opacity: 0, y: -12 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -12 }}
transition={{ 
  duration: 0.25,
  ease: [0.16, 1, 0.3, 1]
}}
  className="
    md:hidden
    absolute
    top-full
    left-0
    w-full
    bg-background
    shadow-xl
    overflow-hidden
    z-[90]
  "
>
  <div className="px-6 py-6">

    <nav className="flex flex-col gap-8">

      <Link
        to="/report"
        onClick={() => setIsMenuOpen(false)}
        className="text-lg font-medium text-muted-foreground"
      >
        Report Hazard
      </Link>

      <Link
        to="/track-report"
        onClick={() => setIsMenuOpen(false)}
        className="text-lg font-medium text-muted-foreground"
      >
        Track Reports
      </Link>

      <Link
        to="/knowledge"
        onClick={() => setIsMenuOpen(false)}
        className="text-lg font-medium text-muted-foreground"
      >
        Learn
      </Link>

    </nav>


    <div className="border-t my-6" />


    <div className="grid grid-cols-2 gap-3">

{isAuthenticated ? (
  <>
    <Button
      asChild
      className="rounded-xl h-11"
      onClick={() => setIsMenuOpen(false)}
    >
      <Link to="/dashboard">
        Dashboard
      </Link>
    </Button>

    <Button
      variant="outline"
      className="rounded-xl h-11 text-destructive"
      onClick={() => {
        logout();
        setIsMenuOpen(false);
      }}
    >
      Logout
    </Button>
  </>
) : (
  <>
    <Button
      variant="outline"
      asChild
      className="rounded-xl h-11"
      onClick={() => setIsMenuOpen(false)}
    >
      <Link to="/auth/login">
        Sign In
      </Link>
    </Button>

    <Button
      asChild
      className="rounded-xl h-11"
      onClick={() => setIsMenuOpen(false)}
    >
      <Link to="/auth/register">
        Create Account
      </Link>
    </Button>
  </>
)}

</div>

  </div>

</motion.div>
)}
</AnimatePresence>
    </motion.header>
  );
  }
