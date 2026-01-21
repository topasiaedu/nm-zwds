/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Checkbox, Label, TextInput } from "flowbite-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

/**
 * Sign up page with frosted glass design
 */
const SignUpPage: React.FC = () => {
  // Registration availability control - set to true to enable registration
  const isRegistrationOpen = true;

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [referralCode, setReferralCode] = useState<string>("");
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { signUp } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isRegistrationOpen) {
      setError("Registration is currently closed. Please check back later.");
      return;
    }
    
    setError(null);
    
    // Form validation
    if (!email || !password || !confirmPassword || !referralCode) {
      setError(t("validation.required"));
      return;
    }
    
    if (password !== confirmPassword) {
      setError(t("validation.password.match"));
      return;
    }
    
    if (password.length < 6) {
      setError(t("validation.password.length"));
      return;
    }
    
    if (!acceptTerms) {
      setError(t("validation.terms"));
      return;
    }
    
    try {
      setIsSubmitting(true);
      const response = await signUp(email, password, referralCode);
      
      if (response.error) {
        setError(response.error.message);
        return;
      }
      
      if (response.data?.user) {
        setSuccess("Account created successfully! You can now sign in.");
        setTimeout(() => {
          navigate("/authentication/sign-in");
        }, 2000);
      } else {
        setError("Failed to create account. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
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
              {t("auth.signup.title")}
            </h2>
            
            {!isRegistrationOpen && (
              <div className="p-4 mb-4 text-white bg-blue-600 dark:bg-blue-700 rounded-lg">
                We are currently not open for registration. Please check back later.
              </div>
            )}
            
            {error && (
              <div className="p-4 mb-4 text-white bg-red-600 dark:bg-red-700 rounded-lg">
                {error}
              </div>
            )}
            
            {success && (
              <div className="p-4 mb-4 text-white bg-green-600 dark:bg-green-700 rounded-lg">
                {success}
              </div>
            )}
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="email" value={t("auth.signup.email")} className="dark:text-white" />
                </div>
                <TextInput
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={!isRegistrationOpen}
                  theme={{
                    field: {
                      input: {
                        base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 dark:bg-gray-700 dark:text-white",
                      }
                    }
                  }}
                />
              </div>
              
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="password" value={t("auth.signup.password")} className="dark:text-white" />
                </div>
                <TextInput
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={!isRegistrationOpen}
                  theme={{
                    field: {
                      input: {
                        base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 dark:bg-gray-700 dark:text-white",
                      }
                    }
                  }}
                />
              </div>
              
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="confirmPassword" value={t("auth.signup.confirmPassword")} className="dark:text-white" />
                </div>
                <TextInput
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={!isRegistrationOpen}
                  theme={{
                    field: {
                      input: {
                        base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 dark:bg-gray-700 dark:text-white",
                      }
                    }
                  }}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="referralCode" value="Referral Code" className="dark:text-white" />
                </div>
                <TextInput
                  id="referralCode"
                  type="text"
                  placeholder="Enter your referral code"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  required
                  disabled={!isRegistrationOpen}
                  theme={{
                    field: {
                      input: {
                        base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 dark:bg-gray-700 dark:text-white",
                      }
                    }
                  }}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onChange={() => setAcceptTerms(!acceptTerms)}
                  disabled={!isRegistrationOpen}
                />
                <Label htmlFor="terms" className="dark:text-white">
                  {t("auth.signup.terms")}
                </Label>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting || !isRegistrationOpen}
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
                    {t("auth.signup.submit")}
                  </div>
                ) : (
                  t("auth.signup.submit")
                )}
              </button>
              
              <div className="text-sm text-center">
                <span className="dark:text-white">{t("auth.signup.login")} </span>
                <Link
                  to="/authentication/sign-in"
                  className="text-blue-500 dark:text-blue-400 hover:underline"
                >
                  {t("auth.signup.loginLink")}
                </Link>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SignUpPage;
