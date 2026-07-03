import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Icons } from '@/components/icons';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Intelligence', href: '/ai-intelligence' },
  { name: 'Community', href: '/community-insights' },
  { name: 'Knowledge', href: '/knowledge' },
  { name: 'Demo', href: '/auth/login' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const authLinks = (
    <>
      <Button variant="ghost" asChild>
        <Link to="/auth/login">Login</Link>
      </Button>
      <Button asChild>
        <Link to="/auth/register">Get Started</Link>
      </Button>
    </>
  );

  const authenticatedLinks = (
    <Button asChild>
      <Link to="/dashboard">Go to Dashboard</Link>
    </Button>
  );

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'border-b border-border/40 bg-background/80 backdrop-blur-xl'
          : 'bg-transparent'
      )}
    >
      <div className="container flex h-20 max-w-screen-2xl items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Icons.logo className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl tracking-tight text-primary">ECHO</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-base font-medium">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'relative transition-colors hover:text-primary after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:origin-center after:scale-x-0 after:bg-primary after:transition-transform after:duration-300',
                location.pathname === item.href ? 'text-primary after:scale-x-100' : 'text-muted-foreground'
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
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-t animate-in fade-in-20 slide-in-from-top-2">
          <div className="container py-4 space-y-4">
            <nav className="flex flex-col gap-4">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'text-lg font-medium',
                    location.pathname === item.href ? 'text-primary font-semibold' : 'text-muted-foreground'
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
                    <Button asChild className="w-full" onClick={() => setIsMenuOpen(false)}>
                        <Link to="/dashboard">Go to Dashboard</Link>
                    </Button>
                ) : (
                  <div className='grid grid-cols-2 gap-2'>
                      <Button variant="ghost" asChild className="w-full" onClick={() => setIsMenuOpen(false)}>
                          <Link to="/auth/login">Login</Link>
                      </Button>
                      <Button asChild className="w-full" onClick={() => setIsMenuOpen(false)}>
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
