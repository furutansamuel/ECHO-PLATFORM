import { useAuth } from '@/hooks/use-auth';
import { DashboardLayout } from './DashboardLayout';
import { MainLayout } from './MainLayout';

// For routes that should be reachable by BOTH logged-in members and
// logged-out visitors (e.g. /map, /knowledge) without redirecting either
// away. A logged-in member gets DashboardLayout, so they never leave their
// normal app shell/nav (sidebar, bottom nav, search, etc.) just by visiting
// one of these pages. A logged-out visitor gets MainLayout, the plain public
// shell. Do not use this for pages that must be gated behind login — use
// ProtectedRoute for those instead, since this component never redirects.
export function AdaptiveLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh]">
        <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? <DashboardLayout /> : <MainLayout />;
}
