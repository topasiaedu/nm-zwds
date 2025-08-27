/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Alert, Card, Label, TextInput } from "flowbite-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import PageTransition from "../../components/PageTransition";
import { supabase } from "../../utils/supabase-client";

/**
 * ResetPasswordPage component
 * Allows users to set a new password using a reset token
 */
const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  
  const { completePasswordReset } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract token from URL hash fragment
  // Example: https://app.caegoh.com/authentication/reset-password#access_token=eyJhbGciOiJIUzI1NiIsImtpZCI6InI5RE5qQkVuelR0L0JCRW8iLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2Z3Ynl4Y3p4dGVwa3ZrbGtobmp2LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI1NGIxZjZhNS00YWY2LTRmNzgtYmEyNS0zOGMzMTY0NmEyMzAiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQ5NDQzMzc3LCJpYXQiOjE3NDk0Mzk3NzcsImVtYWlsIjoic3RhbmxleTEyMTQ5OUBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsX3ZlcmlmaWVkIjp0cnVlfSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJvdHAiLCJ0aW1lc3RhbXAiOjE3NDk0Mzk3Nzd9XSwic2Vzc2lvbl9pZCI6ImY4MGIwMzlmLTc2ODItNDQyMy05MDliLTliNDViZTMyNDM4NSIsImlzX2Fub255bW91cyI6ZmFsc2V9.jjS0Y1uxq6QoTFDI5WWAozZPCGBT8ws-qnnGxaFuJrE&expires_at=1749443377&expires_in=3600&refresh_token=gymcwzxm2ntk&token_type=bearer&type=recovery
  useEffect(() => {
    const handleAuthCallback = async () => {
      // Parse hash fragment parameters (after #)
      const hash = location.hash.substring(1); // Remove the # character
      const hashParams = new URLSearchParams(hash);
      const accessToken = hashParams.get("access_token");
      
      if (accessToken) {
        try {
          // Manually set the session using the tokens from the URL
          const refreshToken = hashParams.get("refresh_token");
          
          if (refreshToken) {
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            
            if (error) {
              console.error("Error setting session:", error);
              setError(t("auth.reset.invalidToken"));
              return;
            }
            
            console.log("Session established successfully for password reset");
            setToken("ready");
          } else {
            setError(t("auth.reset.invalidToken"));
          }
        } catch (err) {
          console.error("Error processing auth callback:", err);
          setError(t("auth.reset.invalidToken"));
        }
      } else {
        // Fallback: check query parameters for backward compatibility
        const queryParams = new URLSearchParams(location.search);
        const resetToken = queryParams.get("token");
        
        if (resetToken) {
          setToken(resetToken);
        } else {
          setError(t("auth.reset.invalidToken"));
        }
      }
    };
    
    handleAuthCallback();
  }, [location, t]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (!password || !confirmPassword) {
      setError(t("validation.required"));
      return;
    }
    
    if (password.length < 6) {
      setError(t("validation.password.length"));
      return;
    }
    
    if (password !== confirmPassword) {
      setError(t("validation.password.match"));
      return;
    }
    
    if (!token) {
      setError(t("auth.reset.invalidToken"));
      return;
    }
    
    try {
      setIsSubmitting(true);
      // For Supabase, we don't need to pass the token as it's handled automatically
      const { error } = await completePasswordReset("", password);
      
      if (error) {
        setError(error.message);
        return;
      }
      
      setSuccess(true);
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate("/authentication/sign-in");
      }, 3000);
    } catch (err) {
      setError(t("errors.unexpected"));
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md px-4 mt-14">
        <Card className="w-full relative z-10 rounded-2xl shadow-2xl 
                     border border-gray-200 dark:border-gray-700
                     bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 
                     transition-all duration-300">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-center dark:text-white">
              {t("auth.reset.title")}
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400">
              {t("auth.reset.description")}
            </p>
            
            {error && (
              <Alert color="failure">
                {error}
              </Alert>
            )}
            
            {success ? (
              <div className="space-y-6">
                <Alert color="success">
                  {t("auth.reset.success")}
                </Alert>
                <div className="text-center">
                  <Link 
                    to="/authentication/sign-in"
                    className="text-blue-500 dark:text-blue-400 hover:underline"
                  >
                    {t("auth.reset.login")}
                  </Link>
                </div>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="password" value={t("auth.reset.password")} className="dark:text-white" />
                  </div>
                  <TextInput
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="confirmPassword" value={t("auth.reset.confirmPassword")} className="dark:text-white" />
                  </div>
                  <TextInput
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting || !token}
                  className="w-full px-4 py-2 text-white font-medium rounded-lg transition-all 
                           bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700
                           focus:ring-4 focus:ring-purple-300 focus:outline-none
                           disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t("auth.reset.submit")}
                    </div>
                  ) : (
                    t("auth.reset.submit")
                  )}
                </button>
                
                <div className="text-center">
                  <Link 
                    to="/authentication/sign-in"
                    className="text-blue-500 dark:text-blue-400 hover:underline"
                  >
                    {t("auth.forgot.back")}
                  </Link>
                </div>
              </form>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
