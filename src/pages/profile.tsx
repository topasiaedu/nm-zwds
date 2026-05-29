import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Label, TextInput } from "flowbite-react";
import { useAuth } from "../context/AuthContext";
import { useAlertContext } from "../context/AlertContext";
import { useTierContext } from "../context/TierContext";
import { BrandGradientText } from "../components/BrandGradientText";
import PageTransition from "../components/PageTransition";
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
  profileBackButtonClass,
  profileBackIconWrapClass,
  profileGlowClass,
  profileHeroClass,
  profileHeroSubtitleClass,
  profileHeroTitleClass,
  profileInfoBoxClass,
  profileInfoBoxHintClass,
  profileInfoBoxLabelClass,
  profileInfoBoxValueClass,
  profileInfoGridClass,
  profilePageClass,
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
  membership_expiration: string | null;
  created_at: string;
}

interface PasswordChangeForm {
  newPassword: string;
  confirmPassword: string;
}

/**
 * Profile page component for users to view and edit their profile information
 */
const Profile: React.FC = () => {
  const { user } = useAuth();
  const { showAlert } = useAlertContext();
  const { userDetails } = useTierContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [profile, setProfile] = useState<UserProfile>({
    id: user?.id || "",
    email: user?.email || "",
    display_name: user?.user_metadata?.display_name || "",
    phone: user?.user_metadata?.phone || "",
    membership_expiration: null,
    created_at: "",
  });
  const [passwordForm, setPasswordForm] = useState<PasswordChangeForm>({
    newPassword: "",
    confirmPassword: "",
  });

  /**
   * Load user profile data from Supabase
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
        membership_expiration: userDetails?.membership_expiration || null,
        created_at: user.created_at || "",
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      showAlert("Error loading profile", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showAlert, user, userDetails]);

  /**
   * Save profile changes to Supabase Auth
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
   * Change user password
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
   * Handle profile input changes
   */
  const handleProfileChange = (field: keyof UserProfile, value: string): void => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Handle password form input changes
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
   * Cancel password change and clear form
   */
  const cancelPasswordChange = (): void => {
    setIsChangingPassword(false);
    setPasswordForm({
      newPassword: "",
      confirmPassword: "",
    });
  };

  /**
   * Load profile data on component mount
   */
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (!user) {
    return (
      <PageTransition>
        <p className={profileSignInPromptClass}>
          Please sign in to view your profile.
        </p>
      </PageTransition>
    );
  }

  return (
    <>
      <div className={profileGlowClass} aria-hidden="true" />
      <PageTransition>
        <div className={profilePageClass}>
          <div className={profileContainerClass}>
            <header className={profileHeroClass}>
              <Link to="/dashboard" className={profileBackButtonClass}>
                <span className={profileBackIconWrapClass} aria-hidden="true">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </span>
                <span>Back</span>
              </Link>
              <h1 className={profileHeroTitleClass}>
                Profile
                {profile.display_name ? (
                  <>
                    {", "}
                    <BrandGradientText>{profile.display_name}</BrandGradientText>
                  </>
                ) : null}
              </h1>
              <p className={profileHeroSubtitleClass}>
                Manage your account information and preferences
              </p>
            </header>

            <div className={profileSectionsStackClass}>
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
                    onClick={saveProfile}
                    disabled={isLoading || isChangingPassword}
                    className={profilePrimaryButtonLargeClass}
                  >
                    {isLoading ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </section>

              <section className={profileSectionCardClass}>
                <h2 className={profileSectionTitleClass}>Account Information</h2>

                <div className={profileInfoGridClass}>
                  <div className={profileInfoBoxClass}>
                    <h3 className={profileInfoBoxLabelClass}>Membership Expiration</h3>
                    <p className={profileInfoBoxValueClass}>
                      {profile.membership_expiration
                        ? new Date(profile.membership_expiration).toLocaleDateString()
                        : "Unlimited"}
                    </p>
                    <p className={profileInfoBoxHintClass}>
                      Contact support to modify membership
                    </p>
                  </div>

                  {profile.created_at ? (
                    <div className={profileInfoBoxClass}>
                      <h3 className={profileInfoBoxLabelClass}>Member Since</h3>
                      <p className={profileInfoBoxValueClass}>
                        {new Date(profile.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ) : null}
                </div>
              </section>

              <section className={profileSectionCardClass}>
                <div className={profileSectionHeaderRowClass}>
                  <h2 className={profileSectionHeaderTitleClass}>Password</h2>
                  {!isChangingPassword ? (
                    <button
                      type="button"
                      onClick={() => setIsChangingPassword(true)}
                      disabled={isLoading}
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
                        onClick={changePassword}
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
                ) : null}
              </section>
            </div>
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default Profile;
