import React, { useCallback, useEffect, useState } from "react";
import { Label, TextInput } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAlertContext } from "../context/AlertContext";
import { useLanguage } from "../context/LanguageContext";
import PageTransition from "../components/PageTransition";
import CommandCentreShell from "../components/layout/CommandCentreShell";
import ThemeToggle from "../components/ThemeToggle";
import { useAppNavItems } from "../hooks/useAppNavItems";
import { useTheme } from "../hooks/useTheme";
import { C } from "../components/alignment-advantage/shared/constants";
import { Sparkle } from "../components/alignment-advantage/shared/Sparkle";
import { supabase } from "../utils/supabase-client";
import {
  profileFormHintClass,
  profileFormLabelClass,
} from "../styles/profileFormUi";
import {
  profileActionsEndClass,
  profileActionsRowClass,
  profileContainerClass,
  profileFieldFullWidthClass,
  profileFormGridClass,
  profilePrimaryButtonClass,
  profilePrimaryButtonLargeClass,
  profileSecondaryButtonClass,
  profileSectionCardClass,
  profileSectionHeaderRowClass,
  profileSectionHeaderTitleClass,
  profileSectionsStackClass,
  profileSectionTitleClass,
  profileSignInPromptClass,
  profileTextInputTheme,
} from "../styles/profileUi";

interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  phone: string;
}

interface PasswordChangeForm {
  newPassword: string;
  confirmPassword: string;
}

const settingsSignOutButtonClass = [
  "px-6 py-3 text-sm font-medium rounded-lg transition-all shadow-sm",
  "border border-theme-border text-theme-fg",
  "hover:border-accent-coral hover:text-accent-coral",
  "focus:ring-4 focus:ring-theme-focus focus:outline-none",
  "disabled:opacity-50 disabled:cursor-not-allowed",
].join(" ");

/**
 * Settings page — appearance, account profile, password change, and sign out.
 */
const Settings: React.FC = () => {
  const { user, signOut } = useAuth();
  const { showAlert } = useAlertContext();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { items: appNavItems } = useAppNavItems({ activeKey: "settings" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [profile, setProfile] = useState<UserProfile>({
    id: user?.id || "",
    email: user?.email || "",
    display_name: user?.user_metadata?.display_name || "",
    phone: user?.user_metadata?.phone || "",
  });
  const [passwordForm, setPasswordForm] = useState<PasswordChangeForm>({
    newPassword: "",
    confirmPassword: "",
  });

  /**
   * Load user profile data from auth metadata and tier context.
   */
  const loadProfile = useCallback(async (): Promise<void> => {
    if (!user) {
      return;
    }

    try {
      setIsLoading(true);

      setProfile({
        id: user.id,
        email: user.email || "",
        display_name: user.user_metadata?.display_name || "",
        phone: user.user_metadata?.phone || "",
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      showAlert("Error loading profile", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showAlert, user]);

  /**
   * Save profile changes to Supabase Auth user metadata.
   */
  const saveProfile = async (): Promise<void> => {
    if (!user) {
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await supabase.auth.updateUser({
        data: {
          display_name: profile.display_name,
          phone: profile.phone,
        },
      });

      if (error) {
        throw error;
      }

      showAlert("Profile updated successfully", "success");
      await loadProfile();
    } catch (error) {
      console.error("Error saving profile:", error);
      showAlert("Error saving profile", "error");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Change password via supabase.auth.updateUser({ password }).
   * Matches the existing profile-page flow (no current-password re-auth required).
   */
  const changePassword = async (): Promise<void> => {
    if (!user) {
      return;
    }

    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      showAlert("Please fill in all password fields", "error");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showAlert("New passwords do not match", "error");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showAlert("New password must be at least 6 characters long", "error");
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      });

      if (error) {
        throw error;
      }

      showAlert("Password changed successfully", "success");
      setIsChangingPassword(false);
      setPasswordForm({
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      showAlert("Error changing password", "error");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle profile input changes.
   */
  const handleProfileChange = (field: keyof UserProfile, value: string): void => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Handle password form input changes.
   */
  const handlePasswordChange = (
    field: keyof PasswordChangeForm,
    value: string
  ): void => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Cancel password change and clear form.
   */
  const cancelPasswordChange = (): void => {
    setIsChangingPassword(false);
    setPasswordForm({
      newPassword: "",
      confirmPassword: "",
    });
  };

  /**
   * Sign out and redirect to sign-in.
   */
  const handleSignOut = async (): Promise<void> => {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);
    try {
      await signOut();
      navigate("/authentication/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
      showAlert("Error signing out", "error");
      setIsSigningOut(false);
    }
  };

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const displayName =
    user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User";

  const userInitial =
    displayName.trim().length > 0
      ? displayName.trim().charAt(0).toUpperCase()
      : "?";

  const sidebarFooter = (
    <div className="px-5 py-4">
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border border-white/30"
          style={{ background: "rgba(255,255,255,0.15)", color: C.white }}
        >
          {userInitial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-white truncate">{displayName}</p>
          <p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.55)" }}>
            {user?.email ?? ""}
          </p>
        </div>
        <Sparkle size={10} color="rgba(255,255,255,0.60)" />
      </div>
    </div>
  );

  if (!user) {
    return (
      <PageTransition>
        <p className={profileSignInPromptClass}>
          Please sign in to view your settings.
        </p>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <CommandCentreShell
        brandLabel="Purple Star Astrology"
        brandSubLabel={displayName}
        contextTitle="Settings"
        contextSubtitle={displayName}
        appNavItems={appNavItems}
        sidebarFooter={sidebarFooter}
      >
        <div className="relative px-4 sm:px-6 md:px-10 py-6 md:py-10 min-w-0">
          <div className={profileContainerClass}>
            <header className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-theme-fg">
                {t("settings.title")}
              </h1>
              <p className="mt-2 text-base text-theme-fg-secondary max-w-2xl leading-relaxed">
                Manage appearance, account details, password, and sign out.
              </p>
            </header>

            <div className={profileSectionsStackClass}>
              <section className={profileSectionCardClass}>
                <h2 className={profileSectionTitleClass}>{t("settings.theme")}</h2>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-theme-fg">
                      {isDark ? t("settings.themes.dark") : t("settings.themes.light")}
                    </p>
                    <p className="mt-1 text-sm text-theme-fg-secondary">
                      Switch between light and dark appearance across the app.
                    </p>
                  </div>
                  <ThemeToggle />
                </div>
              </section>

              <section className={profileSectionCardClass}>
                <h2 className={profileSectionTitleClass}>Profile Information</h2>

                <div className={profileFormGridClass}>
                  <div>
                    <Label htmlFor="email" value="Email Address" className={profileFormLabelClass} />
                    <TextInput
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                      theme={profileTextInputTheme}
                      className="mt-1"
                    />
                    <p className={`${profileFormHintClass} mt-1`}>
                      Email cannot be changed
                    </p>
                  </div>

                  <div>
                    <Label
                      htmlFor="display_name"
                      value="Display Name"
                      className={profileFormLabelClass}
                    />
                    <TextInput
                      id="display_name"
                      type="text"
                      value={profile.display_name}
                      onChange={(e) =>
                        handleProfileChange("display_name", e.target.value)
                      }
                      theme={profileTextInputTheme}
                      className="mt-1"
                      placeholder="Enter your display name"
                    />
                  </div>

                  <div className={profileFieldFullWidthClass}>
                    <Label htmlFor="phone" value="Phone Number" className={profileFormLabelClass} />
                    <TextInput
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => handleProfileChange("phone", e.target.value)}
                      theme={profileTextInputTheme}
                      className="mt-1"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div className={profileActionsEndClass}>
                  <button
                    type="button"
                    onClick={() => {
                      void saveProfile();
                    }}
                    disabled={isLoading || isChangingPassword || isSigningOut}
                    className={profilePrimaryButtonLargeClass}
                  >
                    {isLoading ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </section>

              <section className={profileSectionCardClass}>
                <div className={profileSectionHeaderRowClass}>
                  <h2 className={profileSectionHeaderTitleClass}>Password</h2>
                  {!isChangingPassword ? (
                    <button
                      type="button"
                      onClick={() => setIsChangingPassword(true)}
                      disabled={isLoading || isSigningOut}
                      className={profilePrimaryButtonClass}
                    >
                      Change Password
                    </button>
                  ) : (
                    <div className={profileActionsRowClass}>
                      <button
                        type="button"
                        onClick={cancelPasswordChange}
                        disabled={isLoading}
                        className={profileSecondaryButtonClass}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          void changePassword();
                        }}
                        disabled={isLoading}
                        className={profilePrimaryButtonClass}
                      >
                        {isLoading ? "Updating..." : "Update Password"}
                      </button>
                    </div>
                  )}
                </div>

                {isChangingPassword ? (
                  <div className={profileFormGridClass}>
                    <div>
                      <Label
                        htmlFor="new_password"
                        value="New Password"
                        className={profileFormLabelClass}
                      />
                      <TextInput
                        id="new_password"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          handlePasswordChange("newPassword", e.target.value)
                        }
                        theme={profileTextInputTheme}
                        className="mt-1"
                        placeholder="Enter new password (min 6 characters)"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="confirm_password"
                        value="Confirm New Password"
                        className={profileFormLabelClass}
                      />
                      <TextInput
                        id="confirm_password"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          handlePasswordChange("confirmPassword", e.target.value)
                        }
                        theme={profileTextInputTheme}
                        className="mt-1"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-theme-fg-secondary">
                    Update your password to keep your account secure.
                  </p>
                )}
              </section>

              <section className={profileSectionCardClass}>
                <h2 className={profileSectionTitleClass}>{t("navbar.signOut")}</h2>
                <p className="text-sm text-theme-fg-secondary mb-6">
                  Sign out of your account on this device.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    void handleSignOut();
                  }}
                  disabled={isSigningOut || isLoading}
                  className={settingsSignOutButtonClass}
                  aria-label={t("navbar.signOut")}
                >
                  {isSigningOut ? "Signing out..." : t("navbar.signOut")}
                </button>
              </section>
            </div>
          </div>
        </div>
      </CommandCentreShell>
    </PageTransition>
  );
};

export default Settings;
