/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Card, Checkbox, Label, TextInput } from "flowbite-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import AuthPageLayout from "../../components/auth/AuthPageLayout";
import {
  authCardClass,
  authErrorBannerClass,
  authLabelClass,
  authForgotPasswordLinkClass,
  authLinkClass,
  authSubmitButtonClass,
  authTextInputTheme,
  authTitleClass,
} from "../../styles/authUi";

/**
 * Sign in page using COLOR_SCHEME tokens
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

  const locationState = location.state as { from?: { pathname?: string } } | null;
  const from = locationState?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError(t("validation.required"));
      return;
    }

    try {
      setIsSubmitting(true);
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        setError(signInError.message);
        return;
      }

      navigate(from, { replace: true });
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPageLayout>
      <Card className={authCardClass}>
        <div className="space-y-3">
          <h2 className={authTitleClass}>{t("auth.signin.title")}</h2>

          {error && <div className={authErrorBannerClass}>{error}</div>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="email"
                  value={t("auth.signin.email")}
                  className={authLabelClass}
                />
              </div>
              <TextInput
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                theme={authTextInputTheme}
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="password"
                  value={t("auth.signin.password")}
                  className={authLabelClass}
                />
              </div>
              <TextInput
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                theme={authTextInputTheme}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <Label htmlFor="remember" className={authLabelClass}>
                  {t("auth.signin.remember")}
                </Label>
              </div>

              <Link
                to="/authentication/forgot-password"
                className={`text-sm ${authForgotPasswordLinkClass}`}
              >
                {t("auth.signin.forgot")}
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={authSubmitButtonClass}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {t("auth.signin.submit")}
                </div>
              ) : (
                t("auth.signin.submit")
              )}
            </button>

            <div className="text-sm text-center">
              <span className={authLabelClass}>{t("auth.signin.create")} </span>
              <Link to="/authentication/sign-up" className={authLinkClass}>
                {t("auth.signin.createLink")}
              </Link>
            </div>
          </form>
        </div>
      </Card>
    </AuthPageLayout>
  );
};

export default SignInPage;
