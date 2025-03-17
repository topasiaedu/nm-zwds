import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useProfileContext } from "../context/ProfileContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useAlertContext } from "../context/AlertContext";
import { Database } from "../../database.types";
import { Datepicker } from "flowbite-react";

type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];

interface ProfileFormProps {
  isSelfProfile: boolean;
  onSuccess?: (profileId?: string) => void;
}

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
 */
const ProfileForm: React.FC<ProfileFormProps> = ({ isSelfProfile, onSuccess }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { addProfile } = useProfileContext();
  const { showAlert } = useAlertContext();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
    gender: ""
  });
  
  /**
   * Handle form input changes
   * @param e - Change event from form input
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  /**
   * Handle date selection from the datepicker
   * @param date - The selected date object or null if cleared
   */
  const handleDateChange = (date: Date | null) => {
    if (date) {
      // Fix timezone offset issue by creating a new date with only the date components
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      
      // Create a new date to avoid timezone offset issues
      const adjustedDate = new Date(year, month, day, 12); // Use noon to avoid daylight saving issues
      
      // Format the date as YYYY-MM-DD for storage
      const formattedDate = adjustedDate.toISOString().split("T")[0];
      
      setFormData({
        ...formData,
        birthDate: formattedDate
      });
    } else {
      // Clear the date if null is received
      setFormData({
        ...formData,
        birthDate: ""
      });
    }
  };
  
  /**
   * Handle form submission to create a profile
   * @param e - Submit event from form
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newProfile: ProfileInsert = {
        name: formData.name,
        birthday: formData.birthDate,
        birth_time: formData.birthTime,
        gender: formData.gender as "male" | "female",
        is_self: isSelfProfile,
        user_id: user?.id || "",
        created_at: new Date().toISOString(),
        last_viewed: new Date().toISOString()
      };

      await addProfile(newProfile);
      showAlert(
        isSelfProfile 
          ? t("profile.createSelfSuccess") 
          : t("profile.createOtherSuccess"), 
        "success"
      );
      
      if (onSuccess) {
        onSuccess(newProfile.id);
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
  
  // Custom theme for datepicker to match the design
  const datepickerTheme = {
    root: {
      base: "relative flex justify-center",
    },
    views: {
      days: {
        items: {
          base: "grid w-64 grid-cols-7",
          item: {
            base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
            selected: "bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700"
          }
        }
      }
    }
  };
  
  // Convert string date to Date object for the datepicker
  const selectedDate = formData.birthDate ? (function() {
    // Parse the stored date string
    const [year, month, day] = formData.birthDate.split("-").map(Number);
    // Create a new date at noon to avoid timezone issues
    return new Date(year, month - 1, day, 12);
  })() : undefined;
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-2xl shadow-2xl overflow-hidden
                    border border-white/10
                    backdrop-filter backdrop-blur-2xl 
                    bg-white/10 hover:bg-white/15 
                    dark:bg-black/10 dark:hover:bg-black/20 
                    transition-all duration-300 p-6">
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
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                className="bg-gray-50/50 border border-gray-300/50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700/50 dark:border-gray-600/50 dark:placeholder-gray-400 dark:text-white"
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
                className="bg-gray-50/50 border border-gray-300/50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700/50 dark:border-gray-600/50 dark:placeholder-gray-400 dark:text-white"
                required
              >
                <option value="">{t("form.selectGender")}</option>
                <option value="male">{t("form.male")}</option>
                <option value="female">{t("form.female")}</option>
              </select>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="birthDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {t("form.birthDate")}
              </label>
              <div className="w-full bg-gray-50/50 dark:bg-gray-700/50 border border-gray-300/50 dark:border-gray-600/50 rounded-lg p-4 flex justify-center">
                <div className="max-w-full">
                  <Datepicker
                    id="birthDate"
                    inline
                    value={selectedDate}
                    onChange={handleDateChange}
                    theme={datepickerTheme}
                    required
                  />
                </div>
              </div>
              {formData.birthDate && (
                <div className="mt-2 text-center text-sm text-gray-700 dark:text-gray-300">
                  {t("form.selectedDate")}: {new Date(formData.birthDate).toLocaleDateString()}
                </div>
              )}
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="birthTime" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {t("form.birthTime")}
              </label>
              <select
                id="birthTime"
                name="birthTime"
                value={formData.birthTime}
                onChange={handleChange}
                className="bg-gray-50/50 border border-gray-300/50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700/50 dark:border-gray-600/50 dark:placeholder-gray-400 dark:text-white"
                required
              >
                <option value="">{t("form.selectTime") || "Select time"}</option>
                {EarthlyBranches.map((branch, i) => {
                  const startHour = (23 + (i * 2)) % 24;
                  const endHour = (startHour + 2) % 24;
                  const formattedStartHour = startHour.toString().padStart(2, "0");
                  const formattedEndHour = endHour.toString().padStart(2, "0");
                  const timeLabel = `${branch}【${formattedStartHour}:00~${formattedEndHour}:00】`;
                  return (
                    <option key={branch} value={`${formattedStartHour}:00`}>
                      {timeLabel}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-all 
                       bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
                       focus:ring-4 focus:ring-gray-300 focus:outline-none"
            >
              {t("form.cancel") || "Cancel"}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white font-medium rounded-lg transition-all 
                       bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700
                       focus:ring-4 focus:ring-purple-300 focus:outline-none"
            >
              {isSelfProfile 
                ? t("form.createSelfProfile") 
                : t("form.createOtherProfile")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm; 