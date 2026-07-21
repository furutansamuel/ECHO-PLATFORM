// src/components/header/Header.tsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

import { Logo } from './Logo';
import { DesktopNav } from './DesktopNav';
import { ProfileDropdown } from './ProfileDropdown';
import { MobileDrawer } from './MobileDrawer';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, user, profile, logout } = useAuth();
  const location = useLocation();

  const currentPath = useMemo(() => location.pathname, [location.pathname]);

  // Reusable memoized toggles
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);

  // 1. IntersectionObserver instead of scroll listener
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When sentinel goes out of view (scrolled down > 10px), activate glass shadow
        setIsScrolled(!entry.isIntersecting);
      },
      { threshold: 1.0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Body scroll locking with scrollbar space reservation
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    document.body.style.scrollbarGutter = 'stable';
    return () => {
      document.body.style.overflow = '';
      document.body.style.scrollbarGutter = '';
    };
  }, [isMenuOpen]);

  // Route change cleanup
  useEffect(() => {
    closeMenu();
  }, [currentPath, closeMenu]);

  return (
    <>
      {/* Scroll observer sentinel element placed right above the sticky header */}
      <div ref={sentinelRef} className="absolute top-0 left-0 h-2.5 w-full pointer-events-none -z-50" aria-hidden="true" />

      <header
  className={cn(
    'fixed top-0 left-0 right-0 z-50 w-full transition-all duration-200',
          'supports-[padding-top:env(safe-area-inset-top)]:pt-[env(safe-area-inset-top)]',
          isScrolled
            ? 'bg-background/80 backdrop-blur-md border-b border-border/40 shadow-lg shadow-black/5'
            : 'bg-background/50 backdrop-blur-xs border-b border-border/10 shadow-none'
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[64px] items-center justify-between gap-4">
            
            <div className="flex-shrink-0">
  <Logo />
</div>

            <DesktopNav currentPath={currentPath} />

            <ProfileDropdown
              isAuthenticated={isAuthenticated}
              user={user}
              profile={profile}
              logout={logout}
              onCloseMenu={closeMenu}
            />

            {/* Mobile Toggle Button */}
            <div className="flex md:hidden">
              <Button
                ref={menuButtonRef}
                variant="ghost"
                size="icon"
                aria-label={isMenuOpen ? 'Close navigation' : 'Open navigation'}
                className="h-10 w-10 rounded-lg hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                onClick={toggleMenu}
              >
                {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Component */}
      <MobileDrawer
        isOpen={isMenuOpen}
        onClose={closeMenu}
        currentPath={currentPath}
        isAuthenticated={isAuthenticated}
        user={user}
        profile={profile}
        logout={logout}
        menuButtonRef={menuButtonRef}
      />
    </>
  );
}

