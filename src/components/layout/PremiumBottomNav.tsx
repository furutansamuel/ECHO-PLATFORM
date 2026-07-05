import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
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

  const count = enriched.length;
  const activePercent = ((activeIndex + 0.5) / count) * 100;

  return (
    <nav
      aria-label="Primary Navigation"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 md:hidden"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom),0.75rem)',
      }}
    >
      <div className="pointer-events-auto mx-auto w-[min(94vw,26rem)]">
        <div className="relative">

          {/* Navigation Bar */}
          <div
            className="
              relative
              h-16
              rounded-[2rem]
              border
              border-white/15
              bg-gradient-to-r
              from-primary/95
              via-secondary/95
              to-accent/95
              backdrop-blur-2xl
              shadow-[0_20px_60px_-15px_rgba(27,94,32,0.45)]
            "
          >

            {/* Liquid Scoop */}
            <motion.div
              aria-hidden
              className="
                absolute
                -top-4
                h-8
                w-16
                -translate-x-1/2
                rounded-b-[2rem]
                bg-gradient-to-r
                from-primary/95
                via-secondary/95
                to-accent/95
              "
              initial={false}
              animate={{
                left: `${activePercent}%`,
              }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 26,
              }}
            />

            {/* Active Button */}
            <motion.div
              aria-hidden
              className="
                absolute
                -top-5
                h-14
                w-14
                -translate-x-1/2
                rounded-full
                bg-gradient-to-br
                from-white
                via-green-50
                to-accent
                ring-4
                ring-primary/30
                shadow-[0_12px_30px_rgba(67,160,71,0.45)]
              "
              initial={false}
              animate={{
                left: `${activePercent}%`,
              }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 26,
              }}
            />

            {/* Navigation Items */}
            <ul className="relative flex h-full items-center">
              {enriched.map((item, index) => {
                const isActive = index === activeIndex;
                const Icon = item.icon;

                return (
                  <li
                    key={item.href}
                    className="flex-1"
                  >
                    <Link
                      to={item.href}
                      aria-label={item.name}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'group relative mx-auto flex h-12 w-12 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50'
                      )}
                    >
                      <motion.span
                        initial={false}
                        animate={{
                          y: isActive ? -22 : 0,
                          scale: isActive ? 1.18 : 1,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 320,
                          damping: 22,
                        }}
                        className={cn(
                          'relative flex items-center justify-center',
                          isActive
                            ? 'text-primary'
                            : 'text-white/75 group-hover:text-white'
                        )}
                      >
                        <Icon className="h-5 w-5" />

                        {item.badge && item.badge > 0 && (
                          <span
                            className="
                              absolute
                              -right-2
                              -top-1
                              flex
                              h-4
                              min-w-[1rem]
                              items-center
                              justify-center
                              rounded-full
                              bg-red-500
                              px-1
                              text-[10px]
                              font-bold
                              text-white
                              ring-2
                              ring-primary
                            "
                          >
                            {item.badge > 9
                              ? '9+'
                              : item.badge}
                          </span>
                        )}
                      </motion.span>

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
                          text-white/75
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
