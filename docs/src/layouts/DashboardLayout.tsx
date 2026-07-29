import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Map as MapIcon,
  HeartPulse,
  Calendar,
  Award,
  Bell,
  BookOpen,
  User,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Search,
  BrainCircuit,
  Users,
  ShieldCheck
} from 'lucide-react';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

import WelcomeHeader from '@/components/dashboard/WelcomeHeader';
import { PremiumBottomNav } from '@/components/layout/PremiumBottomNav';
import { useNotifications } from '@/hooks/use-notifications';
import { LocationPermissionCard } from '@/components/dashboard/LocationPermissionCard';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

const navItems = [
  { name: 'Admin Panel', href: '/admin', icon: ShieldCheck, roles: ['administrator'] },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['citizen', 'volunteer'] },
  { name: 'Track Reports', href: '/reports', icon: ClipboardList, roles: ['citizen', 'volunteer'] },
  { name: 'Interactive Map', href: '/map', icon: MapIcon, roles: ['citizen', 'volunteer'] },
  { name: 'AI Intelligence', href: '/ai-intelligence', icon: BrainCircuit, roles: ['citizen', 'volunteer'] },
  { name: 'Community Health', href: '/community-health', icon: HeartPulse, roles: ['citizen', 'volunteer'] },
  { name: 'Cleanup Events', href: '/cleanup-events', icon: Calendar, roles: ['citizen', 'volunteer'] },
  { name: 'Impact Center', href: '/rewards', icon: Award, roles: ['citizen', 'volunteer'] },
  { name: 'Community Hub', href: '/community-insights', icon: Users, roles: ['citizen', 'volunteer'] },
  { name: 'Knowledge Centre', href: '/knowledge', icon: BookOpen, roles: ['citizen', 'volunteer'] },
];

const footerItems = [
  { name: 'Profile', href: '/profile', icon: User, roles: ['citizen', 'volunteer', 'administrator'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['citizen', 'volunteer', 'administrator'] },
];

export function DashboardLayout() {
  const { profile, logout } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const filteredNavItems = navItems.filter(item =>
    item.roles.includes(profile?.role || '')
  );

  const NavLink = ({
    item,
    isCollapsed,
  }: {
    item: any;
    isCollapsed?: boolean;
  }) => {
    const isActive = location.pathname === item.href;
    const Icon = item.icon;

    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative",

                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-primary hover:bg-primary/5 hover:text-primary"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110",

                  isActive
                    ? "text-primary"
                    : "text-primary group-hover:text-primary"
                )}
              />

              {!isCollapsed && (
                <span
                  className={cn(
                    "font-bold text-sm tracking-tight whitespace-nowrap",

                    isActive
                      ? "text-primary"
                      : "text-primary"
                  )}
                >
                  {item.name}
                </span>
              )}

              {isActive && (
                <div className="absolute left-0 w-1 h-6 rounded-r-full bg-primary" />
              )}
            </Link>
          </TooltipTrigger>

          {isCollapsed && (
            <TooltipContent side="right">
              {item.name}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  
  return (
  <div className="flex min-h-screen w-full bg-background font-sans text-foreground selection:bg-primary/10 selection:text-primary">

    {/* =========================
        Desktop Sidebar
    ========================== */}
    <aside
      className={cn(
        "hidden md:flex flex-col w-64 bg-card border-r border-border shadow-sm transition-all duration-300 ease-in-out z-30",
        collapsed && "w-[70px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed ? (
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/echo-wordmark.svg"
              alt="ECHO"
              className="h-8 w-auto"
            />
          </Link>
        ) : (
          <img
            src="/echo-symbol.svg"
            alt="ECHO"
            className="mx-auto h-8 w-8"
          />
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border hover:bg-primary/10 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-primary" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-primary" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              isCollapsed={collapsed}
            />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3 space-y-1">

        {footerItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isCollapsed={collapsed}
          />
        ))}

        <TooltipProvider delayDuration={0}>
          <Tooltip>

            <TooltipTrigger asChild>

              <Button
                variant="ghost"
                onClick={logout}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive",
                  collapsed && "justify-center"
                )}
              >
                <LogOut className="h-5 w-5" />

                {!collapsed && (
                  <span className="font-medium">
                    Logout
                  </span>
                )}

              </Button>

            </TooltipTrigger>

            {collapsed && (
              <TooltipContent side="right">
                Logout
              </TooltipContent>
            )}

          </Tooltip>
        </TooltipProvider>

      </div>

    </aside>
    

      <div className="flex flex-1 flex-col">
        <header
          className="sticky top-0 z-20 flex min-h-20 items-center justify-between border-b border-border bg-card px-4 py-2 md:px-8"
          style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.5rem)' }}
        >
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
  side="left"
  className="w-[85vw] max-w-sm p-0 bg-card"
>
  {/* Logo */}
  <div className="border-b border-border p-4 bg-card">
    <Link
      to="/"
      className="flex items-center gap-2"
      onClick={() => setIsMobileMenuOpen(false)}
    >
      <img
        src="/echo-wordmark.svg"
        alt="ECHO"
        className="h-8 w-auto"
      />
    </Link>
  </div>

  {/* Navigation */}
  <div className="max-h-[calc(100vh-80px)] overflow-y-auto p-4 bg-card">

    <nav className="space-y-1">

      {filteredNavItems.map((item) => {
        const isActive = location.pathname === item.href;

        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition-all duration-200",

              isActive
                ? "bg-primary/10 text-primary"
                : "text-primary hover:bg-primary/5 hover:text-primary"
            )}
          >
            <item.icon className="h-5 w-5 text-primary" />

            <span>{item.name}</span>
          </Link>
        );
      })}

    </nav>

    <Separator className="my-4" />

    {/* Footer */}
    <div className="space-y-1">

      {footerItems.map((item) => {
        const isActive = location.pathname === item.href;

        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition-all duration-200",

              isActive
                ? "bg-primary/10 text-primary"
                : "text-primary hover:bg-primary/5 hover:text-primary"
            )}
          >
            <item.icon className="h-5 w-5 text-primary" />

            <span>{item.name}</span>
          </Link>
        );
      })}

      <button
        type="button"
        onClick={() => {
          setIsMobileMenuOpen(false);
          logout();
        }}
        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-destructive transition-colors hover:bg-destructive/10"
      >
        <LogOut className="h-5 w-5" />
        <span className="font-semibold">Logout</span>
      </button>

    </div>

  </div>
</SheetContent>
            </Sheet>
            <WelcomeHeader />
          </div>

          <div className="flex items-center gap-2 md:gap-4">

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="relative hidden sm:block"
            >
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-primary" />

              <input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  h-10
                  w-64
                  rounded-full
                  border
                  border-border
                  bg-white
                  pl-9
                  pr-4
                  text-sm
                  transition-all
                  focus:border-primary
                  focus:outline-none
                  focus:ring-4
                  focus:ring-primary/10
                "
              />
            </form>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <Popover>

              <PopoverTrigger asChild>

                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-primary/10"
                >
                  <Bell className="h-5 w-5 text-primary" />

                  {unreadCount > 0 && (
                    <span
                      className="
                        absolute
                        right-1.5
                        top-1.5
                        flex
                        h-4
                        min-w-4
                        items-center
                        justify-center
                        rounded-full
                        bg-destructive
                        px-1
                        text-[9px]
                        font-bold
                        text-white
                      "
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}

                </Button>

              </PopoverTrigger>

              <PopoverContent
                align="end"
                className="w-80 p-0 bg-card"
              >

                <div className="flex items-center justify-between border-b p-3">

                  <p className="text-sm font-semibold">
                    Notifications
                  </p>

                  {unreadCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="text-[10px]"
                    >
                      {unreadCount} new
                    </Badge>
                  )}

                </div>

                <div className="max-h-80 overflow-y-auto divide-y">

                  {notifications.length === 0 ? (

                    <p className="p-6 text-center text-xs text-muted-foreground">
                      No notifications yet.
                    </p>

                  ) : (

                    notifications.slice(0, 6).map((n) => (

                      <button
                        key={n.id}
                        onClick={() => {
                          markAsRead(n.id);
                          navigate("/notifications");
                        }}
                        className={cn(
                          "w-full p-3 text-left transition-colors hover:bg-primary/5",
                          !n.is_read && "bg-primary/5"
                        )}
                      >
                        <p className="truncate text-xs font-semibold">
                          {n.title}
                        </p>

                        <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
                          {n.message}
                        </p>

                      </button>

                    ))

                  )}

                </div>

                <div className="border-t p-2">

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-primary hover:bg-primary/5"
                    onClick={() => navigate("/notifications")}
                  >
                    View all notifications
                  </Button>

                </div>

              </PopoverContent>

            </Popover>

            {/* Avatar */}

            <Avatar
              onClick={() => navigate("/profile")}
              className="
                h-9
                w-9
                cursor-pointer
                ring-2
                ring-primary/10
                transition-all
                hover:ring-primary/30
              "
            >
              <AvatarImage
                src={
                  profile?.avatar_url ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.full_name}`
                }
              />

              <AvatarFallback className="bg-primary/10 font-bold text-primary">

                {(profile?.full_name || "?")
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}

              </AvatarFallback>

            </Avatar>

          </div>

        </header>

        {/* Main Content */}

        <main
          data-scroll-root
          className="flex-1 p-4 pb-28 md:p-8 md:pb-12"
          style={{
            paddingBottom:
              "calc(env(safe-area-inset-bottom,0px) + 7rem)",
          }}
        >

          <LocationPermissionCard />

          <Outlet />

        </main>

        {/* Bottom Navigation */}

        <PremiumBottomNav />

      </div>

    </div>
  );
}

