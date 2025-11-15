import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useProfileContext } from "../context/ProfileContext";
import { Link, useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import ProfileForm from "../components/ProfileForm";
import ConfirmationModal from "../components/ConfirmationModal";
import { useAlertContext } from "../context/AlertContext";

/**
 * Calculate component for creating 紫微斗数 (Zi Wei Dou Shu) charts for other people
 */
const Calculate: React.FC = () => {
  const { t } = useLanguage();
  const { profiles, loading, deleteProfile } = useProfileContext();
  const { showAlert } = useAlertContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    profileId: string;
    profileName: string;
  }>({
    isOpen: false,
    profileId: "",
    profileName: "",
  });
  
  /**
   * Handle successful profile creation
   * @param profileId - ID of the newly created profile
   */
  const handleProfileSuccess = (profileId?: string) => {
    console.log("handleProfileSuccess", profileId);
    if (profileId) {
      navigate(`/result/${profileId}`);
    }
  };

  /**
   * Open delete confirmation dialog
   * @param profileId - ID of the profile to delete
   * @param profileName - Name of the profile to delete
   */
  const handleDeleteClick = (profileId: string, profileName: string) => {
    setDeleteConfirmation({
      isOpen: true,
      profileId,
      profileName,
    });
  };

  /**
   * Handle confirmed profile deletion
   */
  const handleConfirmDelete = async () => {
    try {
      await deleteProfile(deleteConfirmation.profileId);
      showAlert(
        t("dashboard.deleteSuccess").replace("{{name}}", deleteConfirmation.profileName),
        "success"
      );
      setDeleteConfirmation({ isOpen: false, profileId: "", profileName: "" });
    } catch (error) {
      console.error("Error deleting profile:", error);
      showAlert(t("dashboard.deleteError"), "error");
    }
  };

  /**
   * Handle cancel delete
   */
  const handleCancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, profileId: "", profileName: "" });
  };
  
  // Filter out self profiles - we only want to show profiles of others
  const otherProfiles = profiles
    .filter(profile => !profile.is_self)
    .sort((a, b) => {
      const dateA = new Date(a.last_viewed || a.created_at).getTime();
      const dateB = new Date(b.last_viewed || b.created_at).getTime();
      return dateB - dateA; // Sort by most recent first
    });
    
  // Filter profiles based on search query
  const filteredProfiles = searchQuery.trim() 
    ? otherProfiles.filter(profile => 
        profile.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : otherProfiles;
  
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link to="/dashboard" className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t("general.back")}
            </Link>
            <h1 className="text-3xl font-bold dark:text-white">
              {t("calculate.title")}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {t("calculate.subtitle")}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Saved profiles section */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="rounded-2xl shadow-2xl overflow-hidden h-full
                          border border-gray-200 dark:border-gray-700
                          bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 
                          transition-all duration-300 p-6">
              <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                {t("calculate.savedProfiles")}
              </h2>
              
              {/* Search input */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
                <input 
                  type="search" 
                  className="block w-full p-2 pl-10 pr-4 text-sm rounded-lg 
                          bg-white/20 dark:bg-gray-800/20
                          border border-gray-200 dark:border-gray-700 dark:border-gray-700/30
                          text-gray-700 dark:text-gray-300
                          placeholder-gray-500 dark:placeholder-gray-400
                          focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder={t("general.search") || "Search profiles..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {loading ? (
                <div className="text-center py-6">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {t("common.loading")}
                  </p>
                </div>
              ) : otherProfiles.length > 0 ? (
                <>
                  <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                    {filteredProfiles.map((profile) => (
                      <div 
                        key={profile.id}
                        className="p-3 rounded-lg bg-white/20 dark:bg-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <Link 
                            to={`/result/${profile.id}`}
                            className="flex-1"
                          >
                            <div>
                              <h3 className="text-sm font-medium dark:text-white">{profile.name}</h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {t("dashboard.table.other")} • {new Date(profile.birthday).toLocaleDateString()}
                              </p>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(profile.last_viewed || profile.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </Link>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(profile.id, profile.name);
                            }}
                            className="flex-shrink-0 ml-2 text-red-600 hover:text-red-900 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-colors"
                            title={t("dashboard.table.delete")}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {filteredProfiles.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t("general.noSearchResults") || "No profiles match your search"}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-6">
                  <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {t("calculate.noProfiles")}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Profile form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <ProfileForm
              isSelfProfile={false}
              onSuccess={handleProfileSuccess}
            />
          </div>
          
          {/* Chart calculation explanation */}
          <div className="lg:col-span-3 order-3">
            <div className="rounded-2xl shadow-2xl overflow-hidden
                          border border-gray-200 dark:border-gray-700
                          bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 
                          transition-all duration-300 p-6">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">
                {t("calculate.aboutZiWei")}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <h3 className="font-medium text-purple-800 dark:text-purple-300 mb-2">{t("calculate.whatIsZiWei")}</h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      {t("calculate.whatIsDescription")}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">{t("calculate.requiredInfo")}</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      {t("calculate.requiredInfoDescription")}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">{t("calculate.interpretation")}</h3>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      {t("calculate.interpretationDescription")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={deleteConfirmation.isOpen}
          title={t("dashboard.deleteConfirmTitle") || "Delete Profile"}
          message={
            t("dashboard.deleteConfirmMessage")?.replace(
              "{{name}}",
              deleteConfirmation.profileName
            ) || `Are you sure you want to delete "${deleteConfirmation.profileName}"? This action cannot be undone.`
          }
          confirmText={t("dashboard.table.delete") || "Delete"}
          cancelText={t("general.cancel") || "Cancel"}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          type="danger"
        />
      </div>
    </PageTransition>
  );
};

export default Calculate; 