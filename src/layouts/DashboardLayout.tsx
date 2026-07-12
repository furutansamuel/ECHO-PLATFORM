import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Icons } from '@/components/icons';
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
  CheckCircle,
  Users,
  Presentation,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useDemo } from '@/hooks/use-demo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import WelcomeHeader from '@/components/dashboard/WelcomeHeader';
import { DemoHints } from '@/components/dashboard/DemoHints';
import { PremiumBottomNav } from '@/components/layout/PremiumBottomNav';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['citizen', 'volunteer', 'administrator'] },
  { name: 'Track Reports', href: '/reports', icon: ClipboardList, roles: ['citizen', 'volunteer', 'administrator'] },
  { name: 'Interactive Map', href: '/map', icon: MapIcon, roles: ['citizen', 'volunteer', 'administrator'] },
  { name: 'AI Intelligence', href: '/ai-intelligence', icon: BrainCircuit, roles: ['citizen', 'volunteer', 'administrator'] },
  { name: 'Community Health', href: '/community-health', icon: HeartPulse, roles: ['citizen', 'volunteer', 'administrator'] },
  { name: 'Cleanup Events', href: '/community-insights', icon: Calendar, roles: ['citizen', 'volunteer', 'administrator'] },
  { name: 'Impact Center', href: '/rewards', icon: Award, roles: ['citizen', 'volunteer', 'administrator'] },
  { name: 'Community Insights', href: '/community-insights', icon: Users, roles: ['citizen', 'volunteer', 'administrator'] },
  { name: 'Knowledge Centre', href: '/knowledge', icon: BookOpen, roles: ['citizen', 'volunteer', 'administrator'] },
];

const adminItems = [
  { name: 'Verify Reports', href: '/admin/verify', icon: CheckCircle, roles: ['administrator'] },
  { name: 'Manage Reports', href: '/admin/reports', icon: ClipboardList, roles: ['administrator'] },
  { name: 'User Management', href: '/admin/users', icon: Users, roles: ['administrator'] },
  { name: 'Environmental Analytics', href: '/admin/analytics', icon: BarChart3, roles: ['administrator'] },
  { name: 'Environmental Monitoring', href: '/admin/monitoring', icon: MapIcon, roles: ['administrator'] },
  { name: 'System Settings', href: '/admin/settings', icon: Settings, roles: ['administrator'] },
];

const footerItems = [
  { name: 'Profile', href: '/profile', icon: User, roles: ['citizen', 'volunteer', 'administrator'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['citizen', 'volunteer', 'administrator'] },
];

// Mobile bottom nav is rendered by <PremiumBottomNav /> — items live there.

export function DashboardLayout() {
  const { profile, logout } = useAuth();
  const location = useLocation();
  const { isDemoMode, isPresentationMode, setPresentationMode } = useDemo();
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
  const filteredAdminItems = adminItems.filter(item => item.roles.includes(profile?.role || ''));

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
    <div className={cn(
      "flex min-h-screen w-full bg-background font-sans text-foreground selection:bg-primary/10 selection:text-primary",
      isPresentationMode && "presentation-mode"
    )}>
      <aside
        className={cn(
          'hidden md:flex flex-col border-r border-border/40 bg-sidebar/50 backdrop-blur-xl transition-all duration-300 ease-in-out z-30',
          collapsed ? 'w-[70px]' : 'w-64'
        )}
      >
        <div className="flex items-center justify-between p-4">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <Icons.logo className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold tracking-tight text-sidebar-foreground">ECHO</span>
            </Link>
          )}
          {collapsed && (
            <Icons.logo className="mx-auto h-8 w-8 text-primary" />
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
          {filteredAdminItems.length > 0 && (
            <div className="space-y-1 pt-4">
              <Separator />
              <p className={cn('px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground', collapsed && 'text-center')}>Admin</p>
              {filteredAdminItems.map((item) => (
                <NavLink key={item.href} item={item} isCollapsed={collapsed} />
              ))}
            </div>
          )}
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

      <div className="flex flex-1 flex-col overflow-hidden">
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
                    <Icons.logo className="h-8 w-8 text-primary" />
                    <span className="text-xl font-bold tracking-tight">ECHO</span>
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
                  {filteredAdminItems.length > 0 && (
                    <div className="space-y-1">
                      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Admin
                      </p>
                      {filteredAdminItems.map((item) => (
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
                    </div>
                  )}
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
            {isDemoMode && !isPresentationMode && (
              <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <Button variant="ghost" size="sm" onClick={() => setPresentationMode(true)} className="h-6 px-2 text-[10px] font-bold uppercase gap-1">
                  <Presentation className="h-3 w-3" /> Present
                </Button>
              </div>
            )}
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
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
            </Button>
            <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-primary/10 hover:ring-primary/30 transition-all duration-300" onClick={() => navigate('/profile')}>
              <AvatarImage src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.full_name}`} />
              <AvatarFallback className="bg-primary/10 font-bold text-primary">JD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main
          data-scroll-root
          className="flex-1 overflow-y-auto p-4 pb-28 md:p-8 md:pb-12"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 7rem)' }}
        >
          <DemoHints />
          <Outlet />
        </main>

        <PremiumBottomNav />
      </div>
    </div>
  );
}

