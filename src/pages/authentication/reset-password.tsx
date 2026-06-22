/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Card, Label, TextInput } from "flowbite-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { supabase } from "../../utils/supabase-client";
import AuthPageLayout from "../../components/auth/AuthPageLayout";
import {
  authBodyTextClass,
  authCardClass,
  authErrorBannerClass,
  authLabelClass,
  authLinkClass,
  authSubmitButtonClass,
  authSuccessBannerClass,
  authTextInputTheme,
  authTitleClass,
} from "../../styles/authUi";

/**
 * Reset password page using COLOR_SCHEME tokens
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

  useEffect(() => {
    const handleAuthCallback = async () => {
      const hash = location.hash.substring(1);
      const hashParams = new URLSearchParams(hash);
      const accessToken = hashParams.get("access_token");

      if (accessToken) {
        try {
          const refreshToken = hashParams.get("refresh_token");

          if (refreshToken) {
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (sessionError) {
              console.error("Error setting session:", sessionError);
              setError(t("auth.reset.invalidToken"));
              return;
            }

            setToken("ready");
          } else {
            setError(t("auth.reset.invalidToken"));
          }
        } catch (err) {
          console.error("Error processing auth callback:", err);
          setError(t("auth.reset.invalidToken"));
        }
      } else {
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
      const { error: resetError } = await completePasswordReset("", password);

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setSuccess(true);

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
    <AuthPageLayout>
      <Card className={authCardClass}>
        <div className="space-y-3">
          <h2 className={authTitleClass}>{t("auth.reset.title")}</h2>
          <p className={authBodyTextClass}>{t("auth.reset.description")}</p>

          {error && <div className={authErrorBannerClass}>{error}</div>}

          {success ? (
            <div className="space-y-6">
              <div className={authSuccessBannerClass}>{t("auth.reset.success")}</div>
              <div className="text-center">
                <Link to="/authentication/sign-in" className={authLinkClass}>
                  {t("auth.reset.login")}
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="password"
                    value={t("auth.reset.password")}
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

              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="confirmPassword"
                    value={t("auth.reset.confirmPassword")}
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
                  theme={authTextInputTheme}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !token}
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
                    {t("auth.reset.submit")}
                  </div>
                ) : (
                  t("auth.reset.submit")
                )}
              </button>

              <div className="text-center">
                <Link to="/authentication/sign-in" className={authLinkClass}>
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

export default ResetPasswordPage;
