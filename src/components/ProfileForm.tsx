import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useProfileContext } from "../context/ProfileContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useAlertContext } from "../context/AlertContext";
import { Database } from "../../database.types";

type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];

interface ProfileFormProps {
  isSelfProfile: boolean;
  onSuccess?: (profileId?: string) => void;
  disabled?: boolean;
  showEmailField?: boolean;
}

/**
 * Formats a date string from YYYY-MM-DD to DD/MM/YYYY
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Formatted date string in DD/MM/YYYY format
 */
const formatDateForDisplay = (dateString: string): string => {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

/**
 * Formats a date string from DD/MM/YYYY to YYYY-MM-DD
 * @param dateString - Date string in DD/MM/YYYY format
 * @returns Formatted date string in YYYY-MM-DD format
 */
const formatDateForStorage = (dateString: string): string => {
  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
};

/**
 * Validates a date string in DD/MM/YYYY format
 * @param dateString - Date string in DD/MM/YYYY format
 * @returns Whether the date is valid
 */
const isValidDate = (dateString: string): boolean => {
  // Check format
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    return false;
  }

  // Check if it's a valid date
  const [day, month, year] = dateString.split("/").map(Number);

  // JavaScript months are 0-indexed
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

// Chinese Earthly Branches for time periods
const EarthlyBranches = [
  "子", // 23-1
  "丑", // 1-3
  "寅", // 3-5
  "卯", // 5-7
  "辰", // 7-9
  "巳", // 9-11
  "午", // 11-13
  "未", // 13-15
  "申", // 15-17
  "酉", // 17-19
  "戌", // 19-21
  "亥", // 21-23
];

/**
 * ProfileForm component for creating both self and other profiles
 * @param isSelfProfile - Whether this is for creating a self profile
 * @param onSuccess - Optional callback to run after successful profile creation
 * @param disabled - Whether the form should be disabled (prevents multiple submissions)
 */
const ProfileForm: React.FC<ProfileFormProps> = ({ isSelfProfile, onSuccess, disabled = false, showEmailField = false }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { addProfile } = useProfileContext();
  const { showAlert } = useAlertContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    birthDate: new Date().toISOString().split("T")[0],
    birthTime: "",
    gender: "",
    email: ""
  });

  const [displayDate, setDisplayDate] = useState(
    formatDateForDisplay(formData.birthDate)
  );

  const [dateError, setDateError] = useState<string | null>(null);
  const [dontRememberBirthTime, setDontRememberBirthTime] = useState<boolean>(false);

  /**
   * Generate a random birth time from the available Earthly Branch options
   * @returns Random birth time string in HH:00 format
   */
  const generateRandomBirthTime = (): string => {
    const randomIndex = Math.floor(Math.random() * EarthlyBranches.length);
    const startHour = (23 + (randomIndex * 2)) % 24;
    const formattedStartHour = startHour.toString().padStart(2, "0");
    return `${formattedStartHour}:00`;
  };

  /**
   * Handle checkbox change for "don't remember birth time"
   * @param e - Change event from checkbox
   */
  const handleDontRememberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setDontRememberBirthTime(checked);

    // Clear birth time selection when checkbox is checked
    if (checked) {
      setFormData({
        ...formData,
        birthTime: ""
      });
    }
  };

  /**
   * Handle form input changes
   * @param e - Change event from form input
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "birthDate") {
      setDisplayDate(value);

      // Validate date format and clear error if valid
      if (isValidDate(value)) {
        setDateError(null);
        // Convert display format (DD/MM/YYYY) to storage format (YYYY-MM-DD)
        const storageDate = formatDateForStorage(value);
        setFormData({
          ...formData,
          [name]: storageDate
        });
      } else {
        setDateError(t("form.invalidDateFormat") || "Invalid date format. Please use DD/MM/YYYY");
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  /**
   * Handle form submission to create a profile
   * @param e - Submit event from form
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submission if form is disabled
    if (disabled) {
      console.log("Form submission blocked - form is disabled");
      return;
    }

    // Validate date before submission
    if (!isValidDate(displayDate)) {
      setDateError(t("form.invalidDateFormat") || "Invalid date format. Please use DD/MM/YYYY");
      return;
    }

    console.log("Form submission started:", {
      formData,
      isSelfProfile,
      userId: user?.id,
      dontRememberBirthTime
    });

    // Determine birth time: use form data or generate random if user doesn't remember
    const birthTime = dontRememberBirthTime || !formData.birthTime
      ? generateRandomBirthTime()
      : formData.birthTime;

    console.log("Birth time to use:", birthTime, "(random time used:", dontRememberBirthTime, ")");

    try {
      const newProfile: ProfileInsert = {
        name: formData.name,
        birthday: formData.birthDate,
        birth_time: birthTime,
        gender: formData.gender as "male" | "female",
        is_self: isSelfProfile,
        user_id: user?.id || "2fdd8c60-fdb0-4ba8-a6e4-327a28179498",
        created_at: new Date().toISOString(),
        last_viewed: new Date().toISOString(),
        ...(showEmailField && formData.email ? { email: formData.email } : {})
      };

      console.log("Creating profile with data:", newProfile);
      const createdProfile = await addProfile(newProfile);

      if (!createdProfile) {
        console.error("Profile creation failed - no profile returned");
        showAlert(t("profile.createError"), "error");
        return;
      }

      console.log("Profile created successfully:", createdProfile);
      showAlert(
        isSelfProfile
          ? t("profile.createSelfSuccess")
          : t("profile.createOtherSuccess"),
        "success"
      );

      if (onSuccess) {
        console.log("Calling onSuccess callback with profile ID:", createdProfile.id);
        onSuccess(createdProfile.id);
      } else if (isSelfProfile) {
        navigate("/my-chart");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      showAlert(t("profile.createError"), "error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-2xl shadow-xl overflow-hidden
                    border border-white/10
                    backdrop-filter backdrop-blur-2xl 
                    bg-white/10 dark:bg-gray-800/90
                    transition-all duration-300 p-8">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">
          {isSelfProfile
            ? t("profile.createSelfTitle")
            : t("profile.createOtherTitle")}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {isSelfProfile
            ? t("profile.createSelfDesc")
            : t("profile.createOtherDesc")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {t("form.name")}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder={isSelfProfile ? t("form.yourNamePlaceholder") : t("form.theirNamePlaceholder")}
                required
              />
            </div>

            <div>
              <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {t("form.gender")}
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                required
              >
                <option value="">{t("form.selectGender")}</option>
                <option value="male">{t("form.male")}</option>
                <option value="female">{t("form.female")}</option>
              </select>
            </div>
          </div>

          {/* Email field - only shown for free test */}
          {showEmailField && (
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {t("form.email")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder={t("form.emailPlaceholder") || "your@email.com"}
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="birthDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              {t("form.birthDate")}
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {t("form.dateFormatHint") || "Enter date in DD/MM/YYYY format (e.g., 31/12/1990)"}
            </p>
            <input
              type="text"
              id="birthDate"
              name="birthDate"
              value={displayDate}
              onChange={handleChange}
              placeholder="DD/MM/YYYY"
              pattern="\d{2}/\d{2}/\d{4}"
              className={`bg-gray-50 border ${dateError ? "border-red-500" : "border-gray-300"} text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
              required
            />
            {dateError && (
              <p className="mt-1 text-sm text-red-500">
                {dateError}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="birthTime" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              {t("form.birthTime")}
            </label>

            <select
              id="birthTime"
              name="birthTime"
              value={formData.birthTime}
              onChange={handleChange}
              disabled={dontRememberBirthTime}
              className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ${dontRememberBirthTime ? "opacity-50 cursor-not-allowed" : ""
                }`}
              required={!dontRememberBirthTime}
            >
              <option value="">{t("form.selectTime") || "Select time"}</option>
              {EarthlyBranches.map((branch, i) => {
                const startHour = (23 + (i * 2)) % 24;
                const endHour = (startHour + 2) % 24;
                const formattedStartHour = startHour.toString().padStart(2, "0");
                const formattedEndHour = (endHour - 1).toString().padStart(2, "0");
                const timeLabel = `${branch}【${formattedStartHour}:00~${formattedEndHour}:59】`;
                return (
                  <option key={branch} value={`${formattedStartHour}:00`}>
                    {timeLabel}
                  </option>
                );
              })}
            </select>

            {/* Don't remember birth time checkbox */}
            <div className="mt-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={dontRememberBirthTime}
                  onChange={handleDontRememberChange}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {t("form.dontRememberBirthTime")}
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-5 py-3 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-all 
                       bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
                       focus:ring-4 focus:ring-gray-300 focus:outline-none"
            >
              {t("form.cancel") || "Cancel"}
            </button>
            <button
              type="submit"
              disabled={disabled}
              className={`flex-1 px-5 py-3 text-white font-medium rounded-lg transition-all 
                       ${disabled
                  ? "bg-gray-400 cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                }
                       focus:ring-4 focus:ring-purple-300 focus:outline-none`}
            >
              {disabled ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t("form.submitting") || "Creating..."}
                </span>
              ) : (
                isSelfProfile
                  ? t("form.createSelfProfile")
                  : t("form.createOtherProfile")
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm; 