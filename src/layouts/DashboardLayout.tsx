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
  BarChart3,
  BrainCircuit,
  HelpCircle,
  Users
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import WelcomeHeader from '@/components/dashboard/WelcomeHeader';
import { PremiumBottomNav } from '@/components/layout/PremiumBottomNav';
import { useNotifications } from '@/hooks/use-notifications';
import { LocationPermissionCard } from '@/components/dashboard/LocationPermissionCard';


const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['citizen', 'volunteer'] },
  { name: 'Track Reports', href: '/reports', icon: ClipboardList, roles: ['citizen', 'volunteer'] },
  { name: 'Interactive Map', href: '/map', icon: MapIcon, roles: ['citizen', 'volunteer'] },
  { name: 'AI Intelligence', href: '/ai-intelligence', icon: BrainCircuit, roles: ['citizen', 'volunteer'] },
  { name: 'Community Health', href: '/community-health', icon: HeartPulse, roles: ['citizen', 'volunteer'] },
  { name: 'Cleanup Events', href: '/community-insights', icon: Calendar, roles: ['citizen', 'volunteer'] },
  { name: 'Impact Center', href: '/rewards', icon: Award, roles: ['citizen', 'volunteer'] },
  { name: 'Community Insights', href: '/community-insights', icon: Users, roles: ['citizen', 'volunteer'] },
  { name: 'Knowledge Centre', href: '/knowledge', icon: BookOpen, roles: ['citizen', 'volunteer'] },
];

const footerItems = [
  { name: 'Profile', href: '/profile', icon: User, roles: ['citizen', 'volunteer', 'administrator'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['citizen', 'volunteer', 'administrator'] },
];

// Mobile bottom nav is rendered by <PremiumBottomNav /> — items live there.

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

  const filteredNavItems = navItems.filter(item => item.roles.includes(profile?.role || ''));
  
  const NavLink = ({ item, isCollapsed }: { item: any, isCollapsed?: boolean }) => {
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
                   : "text-muted-foreground hover:bg-primary/5 hover:text-primary/80"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110", isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary/80")} />
              {!isCollapsed && <span className={cn("font-bold text-sm tracking-tight whitespace-nowrap", isActive ? "text-primary" : "text-muted-foreground")}>{item.name}</span>}
              {isActive && (
                <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
              )}
            </Link>
          </TooltipTrigger>
          {isCollapsed && <TooltipContent side="right">{item.name}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="flex min-h-screen w-full bg-background font-sans text-foreground selection:bg-primary/10 selection:text-primary">
      <aside
        className={cn(
          'hidden md:flex flex-col border-r border-border/40 bg-sidebar/50 backdrop-blur-xl transition-all duration-300 ease-in-out z-30',
          collapsed ? 'w-[70px]' : 'w-64'
        )}
      >
        <div className="flex items-center justify-between p-4">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <img src="/echo-wordmark.svg" alt="ECHO" className="h-8 w-auto" />
            </Link>
          )}
          {collapsed && (
            <img src="/echo-symbol.svg" alt="ECHO" className="mx-auto h-8 w-8" />
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-full h-8 w-8 hover:bg-primary/10 transition-colors flex items-center justify-center border border-border/40"
          >
            {collapsed ? <ChevronRight className="h-4 w-4 text-primary" /> : <ChevronLeft className="h-4 w-4 text-primary" />}
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {filteredNavItems.map((item) => (
              <NavLink key={item.href} item={item} isCollapsed={collapsed} />
            ))}
          </div>
          
        </nav>

        <div className="space-y-1 border-t p-3">
          {footerItems.map((item) => (
            <NavLink key={item.href} item={item} isCollapsed={collapsed} />
          ))}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 text-destructive hover:bg-destructive/10 hover:text-destructive',
                    collapsed && 'justify-center'
                  )}
                  onClick={() => logout()}
                >
                  <LogOut className="h-5 w-5" />
                  {!collapsed && <span className="font-medium">Logout</span>}
                </Button>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">Logout</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header
          className="sticky top-0 z-20 flex min-h-20 items-center justify-between border-b border-border/40 bg-background px-4 py-2 md:px-8"
          style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.5rem)' }}
        >
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] max-w-sm p-0">
                <div className="border-b p-4">
                  <Link to="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <img src="/echo-wordmark.svg" alt="ECHO" className="h-8 w-auto" />
                  </Link>
                </div>
                <div className="max-h-[calc(100vh-80px)] space-y-4 overflow-y-auto p-4">
                  <nav className="space-y-1">
                    {filteredNavItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2',
                          location.pathname === item.href
                            ? 'bg-primary text-white'
                            : 'text-foreground hover:bg-secondary'
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </nav>
                  
                  <Separator />
                  <div className="space-y-1">
                    {footerItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
                          location.pathname === item.href
                            ? 'bg-primary text-white'
                            : 'text-foreground hover:bg-secondary'
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <WelcomeHeader />
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-64 rounded-full bg-muted/40 border border-border/20 pl-9 pr-4 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-background focus:border-primary/30"
              />
            </form>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <div className="p-3 border-b flex items-center justify-between">
                  <p className="text-sm font-semibold">Notifications</p>
                  {unreadCount > 0 && <Badge variant="secondary" className="text-[10px]">{unreadCount} new</Badge>}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y">
                  {notifications.length === 0 ? (
                    <p className="p-6 text-center text-xs text-muted-foreground">No notifications yet.</p>
                  ) : (
                    notifications.slice(0, 6).map((n) => (
                      <button
                        key={n.id}
                        onClick={() => { markAsRead(n.id); navigate('/notifications'); }}
                        className={cn(
                          'w-full text-left p-3 hover:bg-muted/50 transition-colors',
                          !n.is_read && 'bg-primary/5'
                        )}
                      >
                        <p className="text-xs font-semibold truncate">{n.title}</p>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{n.message}</p>
                      </button>
                    ))
                  )}
                </div>
                <div className="p-2 border-t">
                  <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => navigate('/notifications')}>
                    View all notifications
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-primary/10 hover:ring-primary/30 transition-all duration-300" onClick={() => navigate('/profile')}>
              <AvatarImage src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.full_name}`} />
              <AvatarFallback className="bg-primary/10 font-bold text-primary">
                {(profile?.full_name || '?').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main
          data-scroll-root
          className="flex-1 p-4 pb-28 md:p-8 md:pb-12"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 7rem)' }}
        >
          <LocationPermissionCard />
          <Outlet />
        </main>

        <PremiumBottomNav />
      </div>
    </div>
  );
}
