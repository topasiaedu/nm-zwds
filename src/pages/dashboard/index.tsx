import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { useProfileContext } from "../../context/ProfileContext";
import { useTierAccess } from "../../context/TierContext";
import { Link } from "react-router-dom";
import PageTransition from "../../components/PageTransition";
import { useAlertContext } from "../../context/AlertContext";
import ConfirmationModal from "../../components/ConfirmationModal";

/**
 * Dashboard component for 紫微斗数 (Zi Wei Dou Shu/Purple Star Astrology) application
 * Displays various sections for the user to interact with
 */
const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { profiles, loading, deleteProfile } = useProfileContext();
  const { showAlert } = useAlertContext();
  const { hasDestinyNavigatorAccess, isAdmin, tier } = useTierAccess();
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
   * Get recent profiles sorted by last_viewed
   */
  const recentProfiles = React.useMemo(() => {
    return [...profiles]
      .sort((a, b) => {
        // Sort by last_viewed if available, otherwise by created_at
        const aDate = a.last_viewed || a.created_at;
        const bDate = b.last_viewed || b.created_at;
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      })
      .slice(0, 5); // Get only the 5 most recent profiles
  }, [profiles]);

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

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header and User Profile */}
          <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                {t("dashboard.welcome")}, {user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User"}
              </h1>
              <p className="text-base text-gray-600 dark:text-gray-400">
                {t("dashboard.subtitle")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
            {/* Main Actions */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {t("dashboard.quickActions")}
                </h2>

                <div className="space-y-4">
                  {/* Admin: Experimental Chart */}
                  {(isAdmin ) && (
                    <Link
                      to="/tier3-result"
                      className="block bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-4 hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-900/30 dark:hover:to-indigo-900/30 transition-colors border border-purple-200 dark:border-purple-800">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <div>
                            <div className="flex items-center">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Advanced Chart Analysis</h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Clean natal chart + palace activation preview</p>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  )}
                  {/* Admin: Destiny Navigator */}
                  {(isAdmin && recentProfiles.length > 0) && (
                    <Link
                      to={`/destiny-navigator/${recentProfiles[0].id}`}
                      className="block bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-4 hover:from-cyan-100 hover:to-blue-100 dark:hover:from-cyan-900/30 dark:hover:to-blue-900/30 transition-colors border border-cyan-200 dark:border-cyan-800">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <div>
                            <div className="flex items-center">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Destiny Navigator</h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Interactive timing analysis by life aspect</p>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  )}
                  {/* Admin: Founder Timing Decision System Report */}
                  {(isAdmin && recentProfiles.length > 0) && (
                    <Link
                      to={`/founder-report/${recentProfiles[0].id}`}
                      className="block bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 transition-colors border border-amber-200 dark:border-amber-800">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-amber-700 dark:text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Founder Report</h3>
                              <span className="inline-block bg-gradient-to-r from-amber-500 to-orange-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                                Premium
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Founder Timing Decision System Report</p>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  )}
                  {/* My Chart */}
                  <Link
                    to={tier === "tier3" && !isAdmin ? "/tier3-result" : "/chart"}
                    className="block bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
                          <svg
                            className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {t("dashboard.actions.myChart.title")}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t("dashboard.actions.myChart.description")}
                          </p>
                        </div>
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                    {/* <div className="mt-4 flex justify-end">
                      <span className="text-xs py-1 px-2 rounded-md bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                        {t("dashboard.updatedAgo").replace("{{time}}", "2d")}
                      </span>
                    </div> */}
                  </Link>

                  {/* Calculate for Others */}
                  <Link
                    to="/calculate"
                    className="block bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                          <svg
                            className="w-5 h-5 text-green-600 dark:text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {t("dashboard.actions.calculate.title")}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t("dashboard.actions.calculate.description")}
                          </p>
                        </div>
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {t("dashboard.savedProfiles").replace(
                          "{{count}}",
                          profiles.length.toString()
                        )}
                      </span>
                      <span className="text-xs py-1 px-2 rounded-md bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        {t("dashboard.newBadge")}
                      </span>
                    </div>
                  </Link>

                  {/* Destiny Wealth Navigator AI Assistant - Tier 2+ */}
                  {hasDestinyNavigatorAccess && (
                    <Link
                      to="/destiny-wealth-navigator"
                      className="block bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
                            <svg
                              className="w-5 h-5 text-purple-600 dark:text-purple-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              Destiny Wealth Navigator
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              AI-powered astrology insights and guidance
                            </p>
                          </div>
                        </div>
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Link>
                  )}

                  {/* Admin Management - Admin Only */}
                  {isAdmin && (
                    <Link
                      to="/admin/users"
                      className="block bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-4 hover:from-red-100 hover:to-pink-100 dark:hover:from-red-900/30 dark:hover:to-pink-900/30 transition-all border border-red-200 dark:border-red-800">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center mr-3">
                            <svg
                              className="w-5 h-5 text-red-600 dark:text-red-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <div className="flex items-center mb-1">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                User Management
                              </h3>
                              <span className="ml-2 px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full">
                                ADMIN
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Manage user tiers and permissions
                            </p>
                          </div>
                        </div>
                        <svg
                          className="w-5 h-5 text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Link>
                  )}

                  {/* Numerology Analytics - Admin Only */}
                  {isAdmin && (
                    <Link
                      to="/admin/numerology-analytics"
                      className="block bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl p-4 hover:from-orange-100 hover:to-yellow-100 dark:hover:from-orange-900/30 dark:hover:to-yellow-900/30 transition-all border border-orange-200 dark:border-orange-800">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center mr-3">
                            <svg
                              className="w-5 h-5 text-orange-600 dark:text-orange-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <div className="flex items-center mb-1">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Numerology Analytics
                              </h3>
                              <span className="ml-2 px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 rounded-full">
                                ADMIN
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              View birth date numerology patterns
                            </p>
                          </div>
                        </div>
                        <svg
                          className="w-5 h-5 text-orange-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Link>
                  )}
                </div>
              </div>

              {/* Resources */}
              {/* <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center mb-4">
                  <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  {t("dashboard.popularResources")}
                </h3>
                
                <div className="space-y-3">
                  <Link 
                    to="/learn/basics" 
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3 group-hover:w-3 group-hover:h-3 transition-all"></span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {t("dashboard.resourceLinks.basics")}
                    </span>
                  </Link>
                  <Link 
                    to="/learn/palace-system" 
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 group-hover:w-3 group-hover:h-3 transition-all"></span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {t("dashboard.resourceLinks.palaceSystem")}
                    </span>
                  </Link>
                  <Link 
                    to="/learn/star-types" 
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:w-3 group-hover:h-3 transition-all"></span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {t("dashboard.resourceLinks.starTypes")}
                    </span>
                  </Link>
                </div>
              </div> */}
            </div>

            {/* Recent Results */}
            <div className="lg:col-span-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      {t("dashboard.recentResults")}
                    </h2>
                    <Link
                      to="/calculate"
                      className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 px-3 py-1 rounded-lg transition-colors">
                      {t("dashboard.viewAll")}
                    </Link>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  </div>
                ) : recentProfiles.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700/30">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {t("dashboard.table.name")}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {t("dashboard.table.date")}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {t("dashboard.table.gender")}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {t("dashboard.table.action")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {recentProfiles.map((profile) => (
                          <tr
                            key={profile.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {profile.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(
                                  profile.birthday
                                ).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {profile.gender === "male"
                                  ? t("dashboard.table.male")
                                  : t("dashboard.table.female")}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex items-center space-x-3">
                                <Link
                                  to={tier === "tier3" && !isAdmin ? `/tier3-result/${profile.id}` : `/result/${profile.id}`}
                                  className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 px-3 py-1 rounded-lg transition-colors inline-block">
                                  {t("dashboard.table.view")}
                                </Link>
                                <button
                                  onClick={() =>
                                    handleDeleteClick(
                                      profile.id,
                                      profile.name
                                    )
                                  }
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 px-3 py-1 rounded-lg transition-colors inline-block"
                                  title={t("dashboard.table.delete")}>
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
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                      {t("dashboard.emptyState.title")}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {t("dashboard.emptyState.description")}
                    </p>
                    <div className="mt-6">
                      <Link
                        to="/calculate"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm">
                        <svg
                          className="-ml-1 mr-2 h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        {t("dashboard.emptyState.action")}
                      </Link>
                    </div>
                  </div>
                )}
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

export default Dashboard;
