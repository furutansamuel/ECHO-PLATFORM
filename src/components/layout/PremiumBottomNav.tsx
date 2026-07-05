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

/**
 * ECHO Premium Smart Nav
 * Floating pill bottom navigation with a liquid scoop under the active tab.
 * Active icon rises inside a circular button; inactive icons stay muted.
 */
export function PremiumBottomNav({ items = DEFAULT_ITEMS, alertsCount = 0 }: Props) {
  const location = useLocation();

  const enriched = items.map((it) =>
    it.name === 'Alerts' ? { ...it, badge: alertsCount } : it,
  );

  const activeIndex = Math.max(
    0,
    enriched.findIndex((it) =>
      it.href === '/dashboard'
        ? location.pathname === '/dashboard' || location.pathname === '/'
        : location.pathname.startsWith(it.href),
    ),
  );
  const safeActive = activeIndex === -1 ? 0 : activeIndex;

  const count = enriched.length;
  // Position of the floating circle center as a percentage across the pill.
  const activePercent = ((safeActive + 0.5) / count) * 100;

  return (
    <nav
      aria-label="Primary"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 md:hidden"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0.75rem)' }}
    >
      <div className="pointer-events-auto mx-auto w-[min(94vw,26rem)]">
        <div className="relative">
          {/* Floating pill */}
          <div className="relative h-16 rounded-[2rem] border border-white/10 bg-slate-900/85 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
            {/* Liquid scoop – subtle notch that morphs to active tab */}
            <motion.div
              aria-hidden
              className="absolute -top-4 h-8 w-16 -translate-x-1/2 rounded-b-[2rem] bg-slate-900/85 backdrop-blur-2xl"
              style={{
                boxShadow:
                  'inset 0 6px 12px -6px rgba(255,255,255,0.08)',
              }}
              initial={false}
              animate={{ left: `${activePercent}%` }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            />

            {/* Floating active circle */}
            <motion.div
              aria-hidden
              className="absolute -top-5 h-14 w-14 -translate-x-1/2 rounded-full bg-gradient-to-br from-primary to-emerald-600 shadow-[0_10px_25px_-5px_rgba(16,185,129,0.5)] ring-4 ring-slate-900/85"
              initial={false}
              animate={{ left: `${activePercent}%` }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            />

            {/* Tabs */}
            <ul className="relative flex h-full items-center">
              {enriched.map((item, i) => {
                const isActive = i === safeActive;
                const Icon = item.icon;
                return (
                  <li key={item.href} className="flex-1">
                    <Link
                      to={item.href}
                      aria-label={item.name}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'group relative mx-auto flex h-12 w-12 items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
                      )}
                    >
                      <motion.span
                        initial={false}
                        animate={{
                          y: isActive ? -22 : 0,
                          scale: isActive ? 1.15 : 1,
                        }}
                        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                        className={cn(
                          'relative flex items-center justify-center',
                          isActive
                            ? 'text-white'
                            : 'text-slate-400 group-hover:text-slate-200',
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.badge && item.badge > 0 ? (
                          <span
                            aria-label={`${item.badge} unread alerts`}
                            className="absolute -right-2 -top-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-slate-900"
                          >
                            {item.badge > 9 ? '9+' : item.badge}
                          </span>
                        ) : null}
                      </motion.span>

                      {/* Label for inactive tabs */}
                      <motion.span
                        initial={false}
                        animate={{ opacity: isActive ? 0 : 1 }}
                        className="absolute bottom-1 text-[10px] font-medium text-slate-400"
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
