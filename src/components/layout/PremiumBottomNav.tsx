import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Home, Map as MapIcon, ShieldAlert, Bell, User } from 'lucide-react';
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
  { name: 'Report', href: '/report', icon: ShieldAlert },
  { name: 'Alerts', href: '/notifications', icon: Bell },
  { name: 'Profile', href: '/profile', icon: User },
];

interface Props {
  items?: BottomNavItem[];
  alertsCount?: number;
}

export function PremiumBottomNav({
  items = DEFAULT_ITEMS,
  alertsCount = 0,
}: Props) {
  const location = useLocation();

  const enriched = items.map((item) =>
    item.name === 'Alerts'
      ? { ...item, badge: alertsCount }
      : item
  );

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
              bg-[#1B5E20]/95
              backdrop-blur-xl
              border
              border-white/10
              shadow-[0_20px_50px_-15px_rgba(0,0,0,0.45)]
            "
          >

            <ul className="relative flex h-full items-center">

              {enriched.map((item, index) => {
                const isActive = index === activeIndex;
                const Icon = item.icon;

                return (
                  <li
                    key={item.href}
                    className="relative flex-1"
                  >

                    {/* Active Floating Circle */}
                    {isActive && (
                      <motion.div
                        layoutId="active-nav"
                        className="
                          absolute
                          -top-5
                          left-1/2
                          h-14
                          w-14
                          -translate-x-1/2
                          rounded-full
                          bg-white
                          shadow-lg
                          ring-4
                          ring-[#1B5E20]/40
                        "
                        transition={transition}
                      />
                    )}

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
                        items-center
                        justify-center
                      "
                    >

                      <motion.span
                        initial={false}
                        animate={{
                          y: isActive ? -20 : 0,
                          scale: isActive ? 1.2 : 1,
                        }}
                        transition={transition}
                        className={cn(
                          "relative flex items-center justify-center",
                          isActive
                            ? "text-[#1B5E20]"
                            : "text-white"
                        )}
                      >

                        <Icon className="h-5 w-5" />

                        {item.badge && item.badge > 0 && (
                          <span
                            className="
                              absolute
                              -right-2
                              -top-2
                              flex
                              h-4
                              min-w-4
                              items-center
                              justify-center
                              rounded-full
                              bg-red-500
                              px-1
                              text-[10px]
                              font-bold
                              text-white
                              ring-2
                              ring-[#1B5E20]
                            "
                          >
                            {item.badge > 9
                              ? '9+'
                              : item.badge}
                          </span>
                        )}

                      </motion.span>

                      {/* Label */}
                      <motion.span
                        initial={false}
                        animate={{
                          opacity: isActive ? 0 : 1,
                        }}
                        className="
                          absolute
                          bottom-1
                          text-[10px]
                          font-medium
                          text-white
                        "
                      >
                        {item.name}
                      </motion.span>

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
