import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
import { Icons } from '@/components/icons';

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

const profileRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, logout, user, profile } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        className="flex items-center gap-2 rounded-full px-2 py-2"
      >
        <div className="h-10 w-10 overflow-hidden rounded-full bg-primary flex items-center justify-center text-white font-semibold">
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

      {isProfileOpen && (
        <div className="absolute right-0 mt-3 w-64 rounded-2xl border bg-background shadow-xl">

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

        </div>
      )}
    </div>
  </div>
);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-500 ease-out', 
        isScrolled
  ? 'border-b border-border/20 bg-background/95 shadow-lg'
  : 'bg-transparent'
      )}
      style={{ paddingTop: 'max(env(safe-area-inset-top), 0px)' }}
    >
      <div className="container flex h-20 max-w-screen-xl items-center justify-between px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
  <Icons.logo className="h-8 w-8 text-primary" />

  <div className="flex flex-col leading-none">
  <span className="text-2xl font-black tracking-wide text-primary">
    ECHO
  </span>

  <span className="hidden sm:block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
    Environmental Community Health Observatory
  </span>
</div>
</Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2 text-base font-medium">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
  location.pathname === item.href
    ? "bg-primary text-white rounded-xl px-4 py-3 shadow-md"
    : "rounded-xl px-4 py-3 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:-translate-y-0.5 transition-all duration-300"
)}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? authenticatedLinks : authLinks}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
    variant="ghost"
    size="icon"
    className="rounded-full hover:bg-primary/10" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t shadow-xl animate-in fade-in zoom-in-95 duration-300">
          <div className="container max-w-md py-4 space-y-4">
            <nav className="flex flex-col gap-4">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
  location.pathname === item.href
    ? "bg-primary text-white rounded-xl px-4 py-3 shadow-md"
    : "rounded-xl px-4 py-3 text-muted-foreground hover:bg-primary/10 transition-colors"
)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="border-t pt-4">
              <div className="flex flex-col gap-2">
                {isAuthenticated ? (
                    <div className="space-y-2">
  <Button
    asChild
    className="w-full rounded-full shadow-lg"
    onClick={() => setIsMenuOpen(false)}
  >
    <Link to="/dashboard">Open Dashboard</Link>
  </Button>

  <Button
    variant="outline"
    className="w-full rounded-full border-destructive/20 text-destructive"
    onClick={() => {
      logout();
      setIsMenuOpen(false);
    }}
  >
    Logout
  </Button>
</div>
                ) : (
                  <div className='grid grid-cols-2 gap-2'>
                      <Button
  variant="outline"
  asChild
  className="rounded-full border-primary/20 hover:border-primary"
  onClick={() => setIsMenuOpen(false)}
>
                          <Link to="/auth/login">Login</Link>
                      </Button>
                      <Button
  asChild
  className="rounded-full px-6 shadow-lg hover:scale-105 transition-all duration-500 ease-out"
  onClick={() => setIsMenuOpen(false)}
>
                          <Link to="/auth/register">Get Started</Link>
                      </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
