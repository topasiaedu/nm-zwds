import React, { useState, useEffect } from "react";
import { Card, Button, Label, TextInput } from "flowbite-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useAlertContext } from "../context/AlertContext";
import { useTierContext } from "../context/TierContext";
import PageTransition from "../components/PageTransition";
import { supabase } from "../utils/supabase-client";

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
  const { t } = useLanguage();
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
  const loadProfile = async (): Promise<void> => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Set basic profile data from auth user
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
  };

  /**
   * Save profile changes to Supabase Auth
   */
  const saveProfile = async (): Promise<void> => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Update user metadata in auth.users
      const { error } = await supabase.auth.updateUser({
        data: {
          display_name: profile.display_name,
          phone: profile.phone,
        },
      });

      if (error) throw error;

      showAlert("Profile updated successfully", "success");

      await loadProfile(); // Reload to get updated data
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
    if (!user) return;

    // Validation
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

      // Update password in Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      });

      if (error) throw error;

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
  const handlePasswordChange = (field: keyof PasswordChangeForm, value: string): void => {
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
  }, [user, userDetails]);

  if (!user) {
    return <div>Please sign in to view your profile.</div>;
  }

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto py-8">
        <Card className="w-full relative z-10 rounded-2xl shadow-2xl 
                       border border-gray-200 dark:border-gray-700
                       bg-white dark:bg-gray-800
                       transition-all duration-300">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Profile
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Manage your account information and preferences
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  color="gray"
                  onClick={() => window.history.back()}
                  disabled={isLoading}
                >
                  Back
                </Button>
              </div>
            </div>

            {/* Profile Information Section */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Profile Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email (read-only) */}
                  <div>
                    <Label htmlFor="email" value="Email Address" />
                    <TextInput
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Display Name */}
                  <div>
                    <Label htmlFor="display_name" value="Display Name" />
                    <TextInput
                      id="display_name"
                      type="text"
                      value={profile.display_name}
                      onChange={(e) => handleProfileChange("display_name", e.target.value)}
                      className="mt-1"
                      placeholder="Enter your display name"
                    />
                  </div>

                  {/* Phone */}
                  <div className="md:col-span-2">
                    <Label htmlFor="phone" value="Phone Number" />
                    <TextInput
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => handleProfileChange("phone", e.target.value)}
                      className="mt-1"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end mt-6">
                  <button
                    onClick={saveProfile}
                    disabled={isLoading || isChangingPassword}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
                  >
                    {isLoading ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </div>

              {/* Account Information Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Account Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Membership Expiration */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Membership Expiration
                    </h3>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {profile.membership_expiration
                        ? new Date(profile.membership_expiration).toLocaleDateString()
                        : "Unlimited"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Contact support to modify membership
                    </p>
                  </div>

                  {/* Account Created */}
                  {profile.created_at && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Member Since
                      </h3>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Password Change Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Password
                  </h2>
                  {!isChangingPassword ? (
                    <Button
                      color="indigo"
                      onClick={() => setIsChangingPassword(true)}
                      disabled={isLoading}
                    >
                      Change Password
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        color="gray"
                        onClick={cancelPasswordChange}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        color="indigo"
                        onClick={changePassword}
                        disabled={isLoading}
                      >
                        {isLoading ? "Updating..." : "Update Password"}
                      </Button>
                    </div>
                  )}
                </div>

                {isChangingPassword && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="new_password" value="New Password" />
                      <TextInput
                        id="new_password"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                        className="mt-1"
                        placeholder="Enter new password (min 6 characters)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirm_password" value="Confirm New Password" />
                      <TextInput
                        id="confirm_password"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                        className="mt-1"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
};

export default Profile;