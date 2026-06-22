/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Label, TextInput } from "flowbite-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import AuthPageLayout from "../../components/auth/AuthPageLayout";
import {
  authBodyTextClass,
  authCardClass,
  authErrorBannerClass,
  authLabelClass,
  authForgotPageLinkClass,
  authForgotPageSubmitButtonClass,
  authForgotPageTextInputTheme,
  authSuccessBannerClass,
  authTitleClass,
} from "../../styles/authUi";

/**
 * Forgot password page using COLOR_SCHEME tokens
 */
const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const { resetPassword } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError(t("validation.required"));
      return;
    }

    try {
      setIsSubmitting(true);
      const { error: resetError } = await resetPassword(email);

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setSuccess(true);
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
        <div className="space-y-6">
          <h2 className={authTitleClass}>{t("auth.forgot.title")}</h2>
          <p className={authBodyTextClass}>{t("auth.forgot.description")}</p>

          {error && <div className={authErrorBannerClass}>{error}</div>}

          {success ? (
            <div className="space-y-6">
              <div className={authSuccessBannerClass}>{t("auth.forgot.success")}</div>
              <div className="text-center">
                <Link to="/authentication/sign-in" className={authForgotPageLinkClass}>
                  {t("auth.forgot.back")}
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="email"
                    value={t("auth.forgot.email")}
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
                  theme={authForgotPageTextInputTheme}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={authForgotPageSubmitButtonClass}
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
                    {t("auth.forgot.submit")}
                  </div>
                ) : (
                  t("auth.forgot.submit")
                )}
              </button>

              <div className="text-center">
                <Link to="/authentication/sign-in" className={authForgotPageLinkClass}>
                  {t("auth.forgot.back")}
                </Link>
              </div>
            </form>
          )}
        </div>
      </Card>
    </AuthPageLayout>
  );
};

export default ForgotPasswordPage;
