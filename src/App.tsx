import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
  useParams,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProfileProvider } from "./context/ProfileContext";
import { TierProvider } from "./context/TierContext";
import { LanguageProvider } from "./context/LanguageContext";
import { AlertProvider } from "./context/AlertContext";
import { SidebarProvider } from "./context/SidebarContext";
import ProtectedRoute from "./components/ProtectedRoute";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/dashboard/index";
import SignInPage from "./pages/authentication/sign-in";
import SignUpPage from "./pages/authentication/sign-up";
import ForgotPasswordPage from "./pages/authentication/forgot-password";
import ResetPasswordPage from "./pages/authentication/reset-password";
import NotFoundPage from "./pages/404";
import Calculate from "./pages/calculate";
import Result from "./pages/result";
import TimingChart from "./pages/timing-chart";
import CAEGPT from "./pages/caegpt";
import UserManagement from "./pages/admin/user-management";
import NumerologyAnalytics from "./pages/admin/numerology-analytics";
import ChartOnly from "./pages/chart-only";
import ChartTest from "./pages/chart-test";
import Tier3Result from "./pages/tier3-result";
import Profile from "./pages/profile";
import MembershipExpired from "./pages/membership-expired";
// Import new free test pages
import FreeTest from "./pages/free-test";
import FreeResult from "./pages/free-result";
import FreeTestEnded from "./pages/free-test-ended";
// Import dev pages
import WealthCodePreviewPage from "./pages/dev/wealth-code-preview";
// Import centralized config
import FREE_TEST_CONFIG from "./config/freeTestConfig";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import { useTierAccess } from "./context/TierContext";

/**
 * Authentication route wrapper that redirects authenticated users to dashboard
 * (except for password reset flow)
 */
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  // EXCEPT for password reset page (allow users to complete password reset flow)
  if (user && location.pathname.includes("/authentication") && 
      !location.pathname.includes("/reset-password")) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

/**
 * Wrapper to render routes inside `MainLayout` with Outlet.
 * This allows us to exclude certain paths (like /chart-only) from the layout/nav.
 */
const MainLayoutWrapper: React.FC = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

/**
 * Route element that redirects Tier3 (non-admin) users to the Tier3 result page for /chart
 */
const TierAwareChartRoute: React.FC = () => {
  const { tier, isAdmin } = useTierAccess();
  const isTier3Only = tier === "tier3" && !isAdmin;
  if (isTier3Only) {
    // Tier 3 users should always see the Tier3Result page instead of standard Result
    return <Navigate to="/tier3-result" replace />;
  }
  return <Result />;
};

/**
 * Route element that redirects Tier3 (non-admin) users to the Tier3 result page for /result/:id
 */
const TierAwareResultByIdRoute: React.FC = () => {
  const { tier, isAdmin } = useTierAccess();
  const params = useParams<{ id: string }>();
  const isTier3Only = tier === "tier3" && !isAdmin;
  if (isTier3Only) {
    const target = params.id ? `/tier3-result/${params.id}` : "/tier3-result";
    return <Navigate to={target} replace />;
  }
  return <Result />;
};

/**
 * Check if free test feature is active based on config
 */
const isFreeTestActive = (): boolean => {
  return FREE_TEST_CONFIG.isActive();
};

/**
 * Main application component
 */
const App: React.FC = () => {
  return (
    <Router>
      <Analytics />
      <SpeedInsights />
      <AlertProvider>
        <AuthProvider>
          <TierProvider>
            <ProfileProvider>
              <LanguageProvider>
                <SidebarProvider>
                  {/* Single router switch. Some routes bypass MainLayout. */}
                  <Routes>
                    {/* Routes WITHOUT MainLayout (no navbar) */}
                    <Route path="/chart-only" element={<ChartOnly />} />
                    <Route path="/chart-test" element={<ChartTest />} />
                    <Route path="/membership-expired" element={<MembershipExpired />} />
                    {/* Dev-only routes */}
                    <Route path="/dev/wealth-code-preview" element={<WealthCodePreviewPage />} />

                    {/* Routes WITH MainLayout */}
                    <Route element={<MainLayoutWrapper />}>
                    {/* Authentication routes */}
                    <Route
                      path="/authentication/sign-in"
                      element={
                        <AuthRoute>
                          <SignInPage />
                        </AuthRoute>
                      }
                    />
                    <Route
                      path="/authentication/sign-up"
                      element={
                        <AuthRoute>
                          <SignUpPage />
                        </AuthRoute>
                      }
                    />
                    <Route
                      path="/authentication/forgot-password"
                      element={
                        <AuthRoute>
                          <ForgotPasswordPage />
                        </AuthRoute>
                      }
                    />
                    <Route
                      path="/authentication/reset-password"
                      element={
                        <AuthRoute>
                          <ResetPasswordPage />
                        </AuthRoute>
                      }
                    />

                    {/* Public Free Test Routes */}
                    <Route
                      path="/free-test"
                      element={
                        isFreeTestActive() ? <FreeTest /> : <FreeTestEnded />
                      }
                    />
                    <Route
                      path="/free-result/:id"
                      element={
                        isFreeTestActive() ? <FreeResult /> : <FreeTestEnded />
                      }
                    />
                    <Route
                      path="/free-test-ended"
                      element={<FreeTestEnded />}
                    />

                    {/* Protected routes */}
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <Navigate to="/dashboard" replace />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* Profile Route */}
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />

                    {/* 紫微斗数 (Zi Wei Dou Shu) Routes */}
                    <Route
                      path="/tier3-result"
                      element={
                        <ProtectedRoute>
                          <Tier3Result />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/tier3-result/:id"
                      element={
                        <ProtectedRoute>
                          <Tier3Result />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/my-chart"
                      element={
                        <ProtectedRoute>
                          <Navigate to="/chart" replace />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/chart"
                      element={
                        <ProtectedRoute>
                          <TierAwareChartRoute />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/calculate"
                      element={
                        <ProtectedRoute>
                          <Calculate />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/result/:id"
                      element={
                        <ProtectedRoute>
                          <TierAwareResultByIdRoute />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/timing-chart/:id"
                      element={
                        <ProtectedRoute>
                          <TimingChart />
                        </ProtectedRoute>
                      }
                    />

                    

                    {/* Destiny Wealth Navigator AI Assistant - Tier 2+ Only */}
                    <Route
                      path="/destiny-wealth-navigator"
                      element={
                        <ProtectedRoute>
                            <CAEGPT />
                        </ProtectedRoute>
                      }
                    />



                    {/* Admin Routes */}
                    <Route
                      path="/admin/users"
                      element={
                        <ProtectedRoute>
                            <UserManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/numerology-analytics"
                      element={
                        <ProtectedRoute>
                            <NumerologyAnalytics />
                        </ProtectedRoute>
                      }
                    />

                    {/* 404 page */}
                    <Route path="*" element={<NotFoundPage />} />
                    </Route>
                  </Routes>
                </SidebarProvider>
              </LanguageProvider>
            </ProfileProvider>
          </TierProvider>
        </AuthProvider>
      </AlertProvider>
    </Router>
  );
};

export default App;
