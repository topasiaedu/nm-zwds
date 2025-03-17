import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";

/**
 * Interface for form data when calculating for others
 */
interface CalcFormData {
  name: string;
  relationship: string;
  birthDate: string;
  birthTime: string;
  gender: string;
  birthPlace: string;
}

/**
 * Interface for a person's profile in the list of saved profiles
 */
interface SavedProfile {
  id: string;
  name: string;
  relationship: string;
  birthDate: string;
  lastViewed: string;
}

/**
 * Calculate component for creating 紫微斗数 (Zi Wei Dou Shu) charts for other people
 */
const Calculate: React.FC = () => {
  const { t } = useLanguage();
  
  // State for form inputs
  const [formData, setFormData] = useState<CalcFormData>({
    name: "",
    relationship: "",
    birthDate: "",
    birthTime: "",
    gender: "",
    birthPlace: ""
  });
  
  // Placeholders for previously saved profiles
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>([
    {
      id: "profile1",
      name: "Chen Wei",
      relationship: "Father",
      birthDate: "1965-08-12",
      lastViewed: "2023-11-05"
    },
    {
      id: "profile2",
      name: "Liu Mei",
      relationship: "Mother",
      birthDate: "1968-03-25",
      lastViewed: "2023-12-10"
    },
    {
      id: "profile3",
      name: "Zhang Yong",
      relationship: "Friend",
      birthDate: "1990-11-18",
      lastViewed: "2024-01-15"
    }
  ]);
  
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
   * Handle form submission
   * @param e - Submit event from form
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save the profile data and navigate to results
    console.log("Form submitted:", formData);
    
    // Mock success alert
    alert("Chart calculation successful! Redirecting to results...");
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
              {t("calculate.title") || "Calculate for Others"}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {t("calculate.subtitle") || "Generate 紫微斗数 (Zi Wei Dou Shu) charts for friends, family, or clients"}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Saved profiles section */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="rounded-2xl shadow-2xl overflow-hidden h-full
                          border border-white/10
                          backdrop-filter backdrop-blur-2xl 
                          bg-white/10 hover:bg-white/15 
                          dark:bg-black/10 dark:hover:bg-black/20 
                          transition-all duration-300 p-6">
              <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                {t("calculate.savedProfiles") || "Saved Profiles"}
              </h2>
              
              {savedProfiles.length > 0 ? (
                <div className="space-y-3">
                  {savedProfiles.map((profile) => (
                    <Link 
                      key={profile.id}
                      to={`/result/${profile.id}`}
                      className="block p-3 rounded-lg bg-white/20 dark:bg-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-sm font-medium dark:text-white">{profile.name}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {profile.relationship} • {profile.birthDate}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {profile.lastViewed}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {t("calculate.noProfiles") || "No saved profiles yet"}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* New calculation form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="rounded-2xl shadow-2xl overflow-hidden
                          border border-white/10
                          backdrop-filter backdrop-blur-2xl 
                          bg-white/10 hover:bg-white/15 
                          dark:bg-black/10 dark:hover:bg-black/20 
                          transition-all duration-300 p-6">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">
                {t("calculate.newCalculation") || "New Calculation"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t("calculate.enterDetails") || "Enter the person's details to generate their 紫微斗数 chart"}
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
                      placeholder="Person's name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="relationship" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      {t("form.relationship") || "Relationship"}
                    </label>
                    <input
                      type="text"
                      id="relationship"
                      name="relationship"
                      value={formData.relationship}
                      onChange={handleChange}
                      className="bg-gray-50/50 border border-gray-300/50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700/50 dark:border-gray-600/50 dark:placeholder-gray-400 dark:text-white"
                      placeholder="e.g. Friend, Client, Father"
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
                  
                  <div>
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
                
                <div className="flex flex-col md:flex-row gap-4">
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-white font-medium rounded-lg transition-all flex-1
                             bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700
                             focus:ring-4 focus:ring-purple-300 focus:outline-none"
                  >
                    {t("calculate.generateChart") || "Generate Chart"}
                  </button>
                  
                  <button
                    type="button"
                    className="px-6 py-2.5 text-gray-900 dark:text-white font-medium rounded-lg transition-all
                             bg-white/50 dark:bg-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-700/70
                             focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-700 focus:outline-none"
                  >
                    {t("form.saveProfile") || "Save Profile"}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Chart calculation explanation */}
          <div className="lg:col-span-3 order-3">
            <div className="rounded-2xl shadow-2xl overflow-hidden
                          border border-white/10
                          backdrop-filter backdrop-blur-2xl 
                          bg-white/10 hover:bg-white/15 
                          dark:bg-black/10 dark:hover:bg-black/20 
                          transition-all duration-300 p-6">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">
                {t("calculate.aboutZiWei") || "About 紫微斗数 (Zi Wei Dou Shu)"}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <h3 className="font-medium text-purple-800 dark:text-purple-300 mb-2">What is 紫微斗数?</h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      紫微斗数 (Zi Wei Dou Shu) is an ancient Chinese astrology system that creates a chart based on a person&apos;s birth date and time.
                      It analyzes the positions of celestial bodies to provide insights into personality, relationships, career, and life path.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Required Information</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      To create an accurate 紫微斗数 chart, you&apos;ll need the person&apos;s exact birth date, time, and location.
                      The more precise this information, the more accurate the chart will be.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">Interpretation</h3>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      The chart analysis provides insights into various aspects of life including career, relationships, health, and personal development.
                      The interpretation combines both traditional wisdom and modern psychological understanding.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Calculate; 