import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";

/**
 * Types for user profile data
 */
interface UserProfileData {
  hasProfile: boolean;
  name?: string;
  birthDate?: string;
  birthTime?: string;
  gender?: "male" | "female";
  birthPlace?: string;
}

/**
 * MyChart component for viewing the user's personal 紫微斗数 (Zi Wei Dou Shu) chart
 * Displays either the user's chart if a profile exists, or a form to create one
 */
const MyChart: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  // Placeholder profile data - in a real app, this would come from an API call
  const [profileData, setProfileData] = useState<UserProfileData>({
    hasProfile: false
  });
  
  // Placeholder state for form inputs
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
    gender: "",
    birthPlace: ""
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save the profile data to a backend
    console.log("Form submitted:", formData);
    
    // For now, just simulate a successful profile creation
    setProfileData({
      hasProfile: true,
      name: formData.name,
      birthDate: formData.birthDate,
      birthTime: formData.birthTime,
      gender: formData.gender as "male" | "female",
      birthPlace: formData.birthPlace
    });
  };
  
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link to="/dashboard" className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t("general.back") || "Back"}
            </Link>
            <h1 className="text-3xl font-bold dark:text-white">
              {t("myChart.title") || "My 紫微斗数 Chart"}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {t("myChart.subtitle") || "View your personal Zi Wei Dou Shu chart and analysis"}
          </p>
        </div>

        {profileData.hasProfile ? (
          // Show chart if profile exists
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main chart */}
            <div className="col-span-1 lg:col-span-2">
              <div className="rounded-2xl shadow-2xl overflow-hidden
                            border border-white/10
                            backdrop-filter backdrop-blur-2xl 
                            bg-white/10 hover:bg-white/15 
                            dark:bg-black/10 dark:hover:bg-black/20 
                            transition-all duration-300 p-6">
                <h2 className="text-2xl font-bold mb-6 dark:text-white">
                  {profileData.name}&apos;s 紫微斗数 Chart
                </h2>
                
                {/* Placeholder chart visualization */}
                <div className="aspect-square bg-white/20 dark:bg-gray-800/20 rounded-xl p-4 flex items-center justify-center border border-white/10 dark:border-gray-700/20">
                  <div className="text-center">
                    <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-gray-600 dark:text-gray-400">
                      Chart Visualization Placeholder
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      In the full implementation, an interactive 紫微斗数 chart would be displayed here
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Profile info and chart details */}
            <div className="col-span-1">
              <div className="rounded-2xl shadow-2xl overflow-hidden
                            border border-white/10
                            backdrop-filter backdrop-blur-2xl 
                            bg-white/10 hover:bg-white/15 
                            dark:bg-black/10 dark:hover:bg-black/20 
                            transition-all duration-300 p-6">
                <h2 className="text-xl font-bold mb-4 dark:text-white">
                  {t("myChart.profileDetails") || "Profile Details"}
                </h2>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-gray-500 dark:text-gray-400">Name:</div>
                    <div className="col-span-2 font-medium dark:text-white">{profileData.name}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-gray-500 dark:text-gray-400">Birth Date:</div>
                    <div className="col-span-2 font-medium dark:text-white">{profileData.birthDate}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-gray-500 dark:text-gray-400">Birth Time:</div>
                    <div className="col-span-2 font-medium dark:text-white">{profileData.birthTime}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-gray-500 dark:text-gray-400">Gender:</div>
                    <div className="col-span-2 font-medium dark:text-white">{profileData.gender}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-gray-500 dark:text-gray-400">Birth Place:</div>
                    <div className="col-span-2 font-medium dark:text-white">{profileData.birthPlace}</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button className="w-full px-4 py-2 text-white font-medium rounded-lg transition-all 
                                   bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700
                                   focus:ring-4 focus:ring-purple-300 focus:outline-none">
                    {t("myChart.editProfile") || "Edit Profile"}
                  </button>
                </div>
              </div>
              
              {/* Chart analysis summary */}
              <div className="rounded-2xl shadow-2xl overflow-hidden mt-6
                            border border-white/10
                            backdrop-filter backdrop-blur-2xl 
                            bg-white/10 hover:bg-white/15 
                            dark:bg-black/10 dark:hover:bg-black/20 
                            transition-all duration-300 p-6">
                <h2 className="text-xl font-bold mb-4 dark:text-white">
                  {t("myChart.keySummary") || "Key Summary"}
                </h2>
                
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Life Path</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Placeholder for life path analysis</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300">Personality</h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Placeholder for personality traits</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Relationships</h3>
                    <p className="text-sm text-green-600 dark:text-green-400">Placeholder for relationship analysis</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Analysis sections */}
            <div className="col-span-1 lg:col-span-3">
              <div className="rounded-2xl shadow-2xl overflow-hidden
                            border border-white/10
                            backdrop-filter backdrop-blur-2xl 
                            bg-white/10 hover:bg-white/15 
                            dark:bg-black/10 dark:hover:bg-black/20 
                            transition-all duration-300 p-6">
                <h2 className="text-2xl font-bold mb-6 dark:text-white">
                  {t("myChart.detailedAnalysis") || "Detailed Analysis"}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/20 dark:bg-gray-800/20 rounded-xl p-4 border border-white/10 dark:border-gray-700/20">
                    <h3 className="text-lg font-bold mb-3 dark:text-white">Career & Wealth</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      This is a placeholder for detailed career and wealth analysis based on your 紫微斗数 chart.
                      In the full implementation, this would contain personalized insights about your career path,
                      financial prospects, and recommendations for career development.
                    </p>
                  </div>
                  
                  <div className="bg-white/20 dark:bg-gray-800/20 rounded-xl p-4 border border-white/10 dark:border-gray-700/20">
                    <h3 className="text-lg font-bold mb-3 dark:text-white">Health & Wellness</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      This is a placeholder for health and wellness analysis based on your 紫微斗数 chart.
                      In the full implementation, this would contain personalized insights about potential health
                      concerns, strengths, and recommendations for maintaining balance.
                    </p>
                  </div>
                  
                  <div className="bg-white/20 dark:bg-gray-800/20 rounded-xl p-4 border border-white/10 dark:border-gray-700/20">
                    <h3 className="text-lg font-bold mb-3 dark:text-white">Relationships & Family</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      This is a placeholder for relationship and family analysis based on your 紫微斗数 chart.
                      In the full implementation, this would contain personalized insights about your relationship
                      patterns, family dynamics, and compatibility with others.
                    </p>
                  </div>
                  
                  <div className="bg-white/20 dark:bg-gray-800/20 rounded-xl p-4 border border-white/10 dark:border-gray-700/20">
                    <h3 className="text-lg font-bold mb-3 dark:text-white">Life Purpose & Spirituality</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      This is a placeholder for life purpose and spirituality analysis based on your 紫微斗数 chart.
                      In the full implementation, this would contain personalized insights about your life mission,
                      spiritual path, and personal growth opportunities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Show profile creation form if no profile exists
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl shadow-2xl overflow-hidden
                          border border-white/10
                          backdrop-filter backdrop-blur-2xl 
                          bg-white/10 hover:bg-white/15 
                          dark:bg-black/10 dark:hover:bg-black/20 
                          transition-all duration-300 p-6">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">
                {t("myChart.createProfile") || "Create Your Profile"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t("myChart.createProfileDesc") || "To generate your personal 紫微斗数 chart, please provide your birth information."}
              </p>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      {t("form.name") || "Name"}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-gray-50/50 border border-gray-300/50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700/50 dark:border-gray-600/50 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      {t("form.gender") || "Gender"}
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="bg-gray-50/50 border border-gray-300/50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700/50 dark:border-gray-600/50 dark:placeholder-gray-400 dark:text-white"
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="birthDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      {t("form.birthDate") || "Birth Date"}
                    </label>
                    <input
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      className="bg-gray-50/50 border border-gray-300/50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700/50 dark:border-gray-600/50 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="birthTime" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      {t("form.birthTime") || "Birth Time"}
                    </label>
                    <input
                      type="time"
                      id="birthTime"
                      name="birthTime"
                      value={formData.birthTime}
                      onChange={handleChange}
                      className="bg-gray-50/50 border border-gray-300/50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700/50 dark:border-gray-600/50 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="birthPlace" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      {t("form.birthPlace") || "Birth Place"}
                    </label>
                    <input
                      type="text"
                      id="birthPlace"
                      name="birthPlace"
                      value={formData.birthPlace}
                      onChange={handleChange}
                      className="bg-gray-50/50 border border-gray-300/50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700/50 dark:border-gray-600/50 dark:placeholder-gray-400 dark:text-white"
                      placeholder="City, Country"
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white font-medium rounded-lg transition-all 
                             bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700
                             focus:ring-4 focus:ring-purple-300 focus:outline-none"
                >
                  {t("form.createProfile") || "Create Profile & Generate Chart"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default MyChart; 