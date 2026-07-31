import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Home, Map as MapIcon, Plus, BrainCircuit, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BottomNavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const DEFAULT_ITEMS: BottomNavItem[] = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Map', href: '/map', icon: MapIcon },
  { name: 'Report', href: '/report', icon: Plus },
  { name: 'Intelligence', href: '/ai-intelligence', icon: BrainCircuit },
  { name: 'Profile', href: '/profile', icon: User },
];

interface Props {
  items?: BottomNavItem[];
}

export function PremiumBottomNav({
  items = DEFAULT_ITEMS,
}: Props) {
  const location = useLocation();

  const enriched = items;

  const activeIndex = Math.max(
    0,
    enriched.findIndex((item) =>
      item.href === '/dashboard'
        ? location.pathname === '/' ||
          location.pathname === '/dashboard'
        : location.pathname.startsWith(item.href)
    )
  );

  const prefersReducedMotion = useReducedMotion();

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : {
        type: 'spring' as const,
        stiffness: 300,
        damping: 25,
      };

  return (
    <nav
      aria-label="Primary Navigation"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 md:hidden"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom),0.75rem)',
      }}
    >
      <div className="pointer-events-auto mx-auto w-[min(92vw,25rem)]">
        <div className="relative">

          {/* Modern Floating Navbar */}
          <div
            className="
              relative
              h-16
              rounded-[2rem]
              bg-primary/95
              backdrop-blur-xl
              border
              border-white/10
              shadow-elev-3
            "
          >

            <ul className="relative flex h-full items-center">

              {enriched.map((item, index) => {
                const isActive = index === activeIndex;
                const isFab = item.name === 'Report';
                const Icon = item.icon;

                if (isFab) {
                  return (
                    <li key={item.href} className="relative flex-1">
                      {/* Report FAB: blue-to-green gradient disc with a
                          white ring, floating above the bar in place —
                          same position/behavior as before, just recolored
                          away from the flat gold fill. */}
                      <motion.div
                        aria-hidden
                        className="
                          absolute
                          -top-6
                          left-1/2
                          h-14
                          w-14
                          -translate-x-1/2
                          rounded-full
                          bg-gradient-to-br
                          from-highlight
                          to-amber-600
                        
                          shadow-lg
                          ring-4
                          ring-white/100
                        "
                        whileTap={{ scale: 0.92 }}
                      />
                      <Link
                        to={item.href}
                        aria-label={item.name}
                        aria-current={isActive ? 'page' : undefined}
                        className="relative mx-auto -mt-6 flex h-14 w-14 items-center justify-center"
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </Link>
                    </li>
                  );
                }

                return (
                  <li
                    key={item.href}
                    className="relative flex-1"
                  >

                    <Link
                      to={item.href}
                      aria-label={item.name}
                      aria-current={
                        isActive ? 'page' : undefined
                      }
                      className="
                        relative
                        mx-auto
                        flex
                        h-12
                        w-12
                        flex-col
                        items-center
                        justify-center
                        gap-1
                      "
                    >

                      {/* No floating circle for the active tab anymore —
                          just a color change on the icon and label,
                          same as every other icon's resting state. */}
                      <motion.span
                        initial={false}
                        animate={{
                          scale: isActive ? 1.1 : 1,
                        }}
                        transition={transition}
                        className={cn(
                          "relative flex items-center justify-center",
                          isActive ? "text-highlight" : "text-white/70"
                        )}
                      >

                        <Icon className="h-5 w-5" />

                      </motion.span>

                      {/* Label stays visible at all times (previously
                          faded out on the active tab, which meant the
                          current page had the least text feedback of
                          any tab). */}
                      <span
                        className={cn(
                          "text-[10px] font-medium",
                          isActive ? "text-highlight" : "text-white/70"
                        )}
                      >
                        {item.name}
                      </span>

                    </Link>

                  </li>
                );
              })}

            </ul>

          </div>

        </div>
      </div>
    </nav>
  );
}
