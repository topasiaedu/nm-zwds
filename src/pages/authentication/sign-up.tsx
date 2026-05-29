/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Checkbox, Label, TextInput } from "flowbite-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import AuthPageLayout from "../../components/auth/AuthPageLayout";
import {
  authCardClass,
  authErrorBannerClass,
  authInfoBannerClass,
  authLabelClass,
  authLinkClass,
  authSubmitButtonClass,
  authSuccessBannerClass,
  authTextInputTheme,
  authTitleClass,
} from "../../styles/authUi";

/**
 * Sign up page using COLOR_SCHEME tokens
 */
const SignUpPage: React.FC = () => {
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
    <AuthPageLayout>
      <Card className={authCardClass}>
        <div className="space-y-3">
          <h2 className={authTitleClass}>{t("auth.signup.title")}</h2>

          {!isRegistrationOpen && (
            <div className={authInfoBannerClass}>
              We are currently not open for registration. Please check back later.
            </div>
          )}

          {error && <div className={authErrorBannerClass}>{error}</div>}

          {success && <div className={authSuccessBannerClass}>{success}</div>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="email"
                  value={t("auth.signup.email")}
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
                disabled={!isRegistrationOpen}
                theme={authTextInputTheme}
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="password"
                  value={t("auth.signup.password")}
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
                disabled={!isRegistrationOpen}
                theme={authTextInputTheme}
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="confirmPassword"
                  value={t("auth.signup.confirmPassword")}
                  className={authLabelClass}
                />
              </div>
              <TextInput
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={!isRegistrationOpen}
                theme={authTextInputTheme}
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="referralCode"
                  value="Referral Code"
                  className={authLabelClass}
                />
              </div>
              <TextInput
                id="referralCode"
                type="text"
                placeholder="Enter your referral code"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                required
                disabled={!isRegistrationOpen}
                theme={authTextInputTheme}
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onChange={() => setAcceptTerms(!acceptTerms)}
                disabled={!isRegistrationOpen}
              />
              <Label htmlFor="terms" className={authLabelClass}>
                {t("auth.signup.terms")}
              </Label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isRegistrationOpen}
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
                  {t("auth.signup.submit")}
                </div>
              ) : (
                t("auth.signup.submit")
              )}
            </button>

            <div className="text-sm text-center">
              <span className={authLabelClass}>{t("auth.signup.login")} </span>
              <Link to="/authentication/sign-in" className={authLinkClass}>
                {t("auth.signup.loginLink")}
              </Link>
            </div>
          </form>
        </div>
      </Card>
    </AuthPageLayout>
  );
};

export default SignUpPage;
