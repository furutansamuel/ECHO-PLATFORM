import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/use-auth";
import { DemoProvider } from "@/hooks/use-demo";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DashboardLayout } from "@/layouts/DashboardLayout";

// Lazy-loaded pages for code splitting (reduces build memory)
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const LandingPage = lazy(() => import("@/pages/public/LandingPage"));
const Dashboard = lazy(() => import("@/pages/citizen/Dashboard"));
const ReportHazard = lazy(() => import("@/pages/citizen/ReportHazard"));
const TrackReportsPage = lazy(() => import("@/pages/citizen/TrackReportsPage"));
const ReportDetailsPage = lazy(() => import("@/pages/citizen/ReportDetailsPage"));
const NotificationsPage = lazy(() => import("@/pages/citizen/NotificationsPage"));
const RewardsPage = lazy(() => import("@/pages/citizen/RewardsPage"));
const ProfilePage = lazy(() => import("@/pages/citizen/ProfilePage"));
const AIIntelligencePage = lazy(() => import("@/pages/intelligence/AIIntelligencePage"));
const AnalyticsPage = lazy(() => import("@/pages/intelligence/AnalyticsPage"));
const InteractiveMapPage = lazy(() => import("@/pages/intelligence/InteractiveMapPage"));
const CommunityHealthPage = lazy(() => import("@/pages/intelligence/CommunityHealthPage"));
const KnowledgeCentre = lazy(() => import("@/pages/community/KnowledgeCentre"));
const ArticleDetailsPage = lazy(() => import("@/pages/community/ArticleDetailsPage"));
const CommunityInsights = lazy(() => import("@/pages/community/CommunityInsights"));
const GlobalSearchPage = lazy(() => import("@/pages/intelligence/GlobalSearchPage"));

function LoadingFallback() {
  return <div className="flex items-center justify-center min-h-screen"><p>Loading...</p></div>;
}

function App() {
  return (
    <DemoProvider>
      <AuthProvider>
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Auth Routes */}
              <Route path="/auth">
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
              </Route>

              {/* Protected Dashboard Routes */}
              <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/report" element={<ReportHazard />} />
                <Route path="/reports" element={<TrackReportsPage />} />
                <Route path="/reports/:id" element={<ReportDetailsPage />} />
                <Route path="/rewards" element={<RewardsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                
                {/* Intelligence Routes */}
                <Route path="/map" element={<InteractiveMapPage />} />
                <Route path="/ai-intelligence" element={<AIIntelligencePage />} />
                <Route path="/community-health" element={<CommunityHealthPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/knowledge" element={<KnowledgeCentre />} />
                <Route path="/knowledge/:slug" element={<ArticleDetailsPage />} />
                <Route path="/community-insights" element={<CommunityInsights />} />
                <Route path="/search" element={<GlobalSearchPage />} />
              </Route>

              {/* Redirects */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
        <Toaster position="top-right" richColors closeButton />
      </AuthProvider>
    </DemoProvider>
  );
}

export default App;
