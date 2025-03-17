/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Alert, Card, Checkbox, Label, TextInput } from "flowbite-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import LanguageToggle from "../../components/LanguageToggle";
import PageTransition from "../../components/PageTransition";

/**
 * Sign in page with frosted glass design
 */
const SignInPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  
  // Get the redirect path from location state or default to dashboard
  const from = (location.state as any)?.from?.pathname || "/dashboard";
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError(t("validation.required"));
      return;
    }
    
    try {
      setIsSubmitting(true);
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
        return;
      }
      
      // Redirect to the original requested page or dashboard
      navigate(from, { replace: true });
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="w-full max-w-md relative z-10 rounded-2xl shadow-2xl 
                     border border-white/10
                     backdrop-filter backdrop-blur-2xl 
                     bg-white/10 hover:bg-white/15 
                     dark:bg-black/10 dark:hover:bg-black/20 
                     transition-all duration-300">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center dark:text-white">
            {t("auth.signin.title")}
          </h2>
          
          {error && (
            <Alert color="failure">
              {error}
            </Alert>
          )}
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value={t("auth.signin.email")} className="dark:text-white" />
              </div>
              <TextInput
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value={t("auth.signin.password")} className="dark:text-white" />
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
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <Label htmlFor="remember" className="dark:text-white">
                  {t("auth.signin.remember")}
                </Label>
              </div>
              
              <Link
                to="/authentication/forgot-password"
                className="text-sm text-blue-500 dark:text-blue-400 hover:underline"
              >
                {t("auth.signin.forgot")}
              </Link>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
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
                  {t("auth.signin.submit")}
                </div>
              ) : (
                t("auth.signin.submit")
              )}
            </button>
            
            <div className="text-sm text-center">
              <span className="dark:text-white">{t("auth.signin.create")} </span>
              <Link
                to="/authentication/sign-up"
                className="text-blue-500 dark:text-blue-400 hover:underline"
              >
                {t("auth.signin.createLink")}
              </Link>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default SignInPage;
