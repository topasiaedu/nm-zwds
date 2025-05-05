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
    birthDate: new Date().toISOString().split("T")[0],
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
   * Handle form submission to create a profile
   * @param e - Submit event from form
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form data:", formData);
    
    try {
      const newProfile: ProfileInsert = {
        name: formData.name,
        birthday: formData.birthDate,
        birth_time: formData.birthTime,
        gender: formData.gender as "male" | "female",
        is_self: isSelfProfile,
        user_id: user?.id || "2fdd8c60-fdb0-4ba8-a6e4-327a28179498",
        created_at: new Date().toISOString(),
        last_viewed: new Date().toISOString()
      };

      const createdProfile = await addProfile(newProfile);
      showAlert(
        isSelfProfile 
          ? t("profile.createSelfSuccess") 
          : t("profile.createOtherSuccess"), 
        "success"
      );
      
      if (onSuccess && createdProfile) {
        console.log("Calling onSuccess with profile ID:", createdProfile.id);
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
            
          <div>
            <label htmlFor="birthDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              {t("form.birthDate")}
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              required
            />
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
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
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
              className="flex-1 px-5 py-3 text-white font-medium rounded-lg transition-all 
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