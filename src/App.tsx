import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { SidebarProvider } from "./context/SidebarContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/dashboard/index";
import SignInPage from "./pages/authentication/sign-in";
import SignUpPage from "./pages/authentication/sign-up";
import ForgotPasswordPage from "./pages/authentication/forgot-password";
import ResetPasswordPage from "./pages/authentication/reset-password";
import NotFoundPage from "./pages/404";
import MyChart from "./pages/my-chart";
import Calculate from "./pages/calculate";
import Result from "./pages/result";

/**
 * Authentication route wrapper that redirects authenticated users to dashboard
 */
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (user && location.pathname.includes("/authentication")) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

/**
 * Main application component
 */
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <SidebarProvider>
            <MainLayout>
              <Routes>
                {/* Authentication routes */}
                <Route path="/authentication/sign-in" element={
                  <AuthRoute>
                    <SignInPage />
                  </AuthRoute>
                } />
                <Route path="/authentication/sign-up" element={
                  <AuthRoute>
                    <SignUpPage />
                  </AuthRoute>
                } />
                <Route path="/authentication/forgot-password" element={
                  <AuthRoute>
                    <ForgotPasswordPage />
                  </AuthRoute>
                } />
                <Route path="/authentication/reset-password" element={
                  <AuthRoute>
                    <ResetPasswordPage />
                  </AuthRoute>
                } />
                
                {/* Protected routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Navigate to="/dashboard" replace />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />

                {/* 紫微斗数 (Zi Wei Dou Shu) Routes */}
                <Route path="/my-chart" element={
                  <ProtectedRoute>
                    <MyChart />
                  </ProtectedRoute>
                } />
                <Route path="/calculate" element={
                  <ProtectedRoute>
                    <Calculate />
                  </ProtectedRoute>
                } />
                <Route path="/result/:id" element={
                  <ProtectedRoute>
                    <Result />
                  </ProtectedRoute>
                } />
                
                {/* 404 page */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </MainLayout>
          </SidebarProvider>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
