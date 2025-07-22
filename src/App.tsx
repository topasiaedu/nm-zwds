import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProfileProvider } from "./context/ProfileContext";
import { TierProvider } from "./context/TierContext";
import { LanguageProvider } from "./context/LanguageContext";
import { AlertProvider } from "./context/AlertContext";
import { SidebarProvider } from "./context/SidebarContext";
import ProtectedRoute from "./components/ProtectedRoute";
import TierProtectedRoute from "./components/TierProtectedRoute";
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
// Import new free test pages
import FreeTest from "./pages/free-test";
import FreeResult from "./pages/free-result";
import FreeTestEnded from "./pages/free-test-ended";
// Import centralized config
import FREE_TEST_CONFIG from "./config/freeTestConfig";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

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
                  <MainLayout>
                  <Routes>
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

                    {/* 紫微斗数 (Zi Wei Dou Shu) Routes */}
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
                          <Result />
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
                          <Result />
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

                    {/* 404 page */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </MainLayout>
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
