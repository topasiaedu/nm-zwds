import React from "react";
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { AlertComponent } from "./components/AlertComponent";
import FlowbiteWrapper from "./components/FlowbiteWrapper";
import ProtectedRoute from "./components/ProtectedRoute";
import { AlertProvider } from "./context/AlertContext";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import DashboardPage from "./pages";
import ForgotPasswordPage from "./pages/authentication/forgot-password";
import ProfileLockPage from "./pages/authentication/profile-lock";
import ResetPasswordPage from "./pages/authentication/reset-password";
import SignInPage from "./pages/authentication/sign-in";
import SignUpPage from "./pages/authentication/sign-up";
import PrivacyPage from "./pages/legal/privacy";
import NotFoundPage from "./pages/pages/404";
import ServerErrorPage from "./pages/pages/500";
import LoadingPage from "./pages/pages/loading";
import MaintenancePage from "./pages/pages/maintenance";
import OtherProfileListPage from "./pages/calc/OtherProfileListPage";
import ProfileFormPage from "./pages/calc/ProfileFormPage";
import CalcResultPage from "./pages/calc/CalcResultPage";
import CalcChoicesPage from "./pages/calc/CalcChoices";
import { LanguageProvider } from "./context/LanguageContext";
import { ProfileProvider } from "./context/ProfileContext";

const App = () => (
  <LanguageProvider>
    <AlertProvider>
      <AuthProvider>
        <ProfileProvider>
          <AlertComponent />
          <BrowserRouter>
            <Routes>
              <Route element={<FlowbiteWrapper />}>
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<DashboardPage />} index />
                  <Route
                    path="/calc/profiles"
                    element={<OtherProfileListPage />}
                  />
                  <Route
                    path="/calc/profile/:isSelf"
                    element={<ProfileFormPage />}
                  />

                  <Route path="/calc/choices/:profileId" element={<CalcChoicesPage />} />

                  <Route
                    path="/calc/results/:profileId/:calcType"
                    element={<CalcResultPage />}
                  />
                </Route>

                <Route
                  path="/pages/maintenance"
                  element={<MaintenancePage />}
                />
                <Route
                  path="/authentication/sign-in"
                  element={<SignInPage />}
                />
                <Route
                  path="/authentication/sign-up"
                  element={<SignUpPage />}
                />
                <Route
                  path="/authentication/forgot-password"
                  element={<ForgotPasswordPage />}
                />
                <Route
                  path="/authentication/reset-password"
                  element={<ResetPasswordPage />}
                />
                <Route
                  path="/authentication/profile-lock"
                  element={<ProfileLockPage />}
                />

                {/* Legal Pages */}
                <Route path="/legal/privacy" element={<PrivacyPage />} />

                {/* Testing */}
                <Route path="/loading" element={<LoadingPage />} />

                {/* Error Handling Routes */}
                <Route path="/500" element={<ServerErrorPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ProfileProvider>
      </AuthProvider>
    </AlertProvider>
  </LanguageProvider>
);

export default App;
