import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import ProfileForm from "../components/ProfileForm";
import FREE_TEST_CONFIG from "../config/freeTestConfig";

/**
 * FreeTest component for allowing public users to try 紫微斗数 (Zi Wei Dou Shu) charts
 * without logging in during a promotional period
 */
const FreeTest: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isEventActive, setIsEventActive] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);



  /**
   * Check if the free test event is currently active
   */
  useEffect(() => {
    const checkEventStatus = () => {
      const status = FREE_TEST_CONFIG.getStatusReason();
      
      console.log("Free test status:", status);
      console.log("Start date:", FREE_TEST_CONFIG.startDate);
      console.log("End date:", FREE_TEST_CONFIG.endDate);
      console.log("Is enabled:", FREE_TEST_CONFIG.isEnabled);
      
      // Set active only if status is "active"
      setIsEventActive(status === "active");
    };

    checkEventStatus();
  }, []);

  /**
   * Handle successful profile creation
   * @param profileId - ID of the newly created profile
   */
  const handleProfileSuccess = (profileId?: string) => {
    console.log("Free test profile created:", profileId);
    
    // Prevent multiple submissions
    if (isSubmitting) {
      console.log("Submission already in progress, ignoring duplicate");
      return;
    }
    
    setIsSubmitting(true);
    
    if (profileId) {
      // Navigate immediately to prevent auth state race conditions
      console.log("Navigating to free result:", `/free-result/${profileId}`);
      navigate(`/free-result/${profileId}`);
    } else {
      console.error("Profile creation succeeded but no ID returned");
      setIsSubmitting(false);
      // Optional: show error message to user
    }
  };

  // If event is not active, redirect to the appropriate page
  if (!isEventActive) {
    const status = FREE_TEST_CONFIG.getStatusReason();
    if (status === "not-started") {
      // Could redirect to a "coming soon" page or show a message
      // For now, redirect to the ended page with appropriate messaging
      navigate("/free-test-ended");
    } else {
      // For "ended" or "disabled" status
      navigate("/free-test-ended");
    }
    return null;
  }

  // Format the limited time offer text with the date range
  const limitedTimeText = t("freeTest.limitedTime")
    .replace("{{startDate}}", FREE_TEST_CONFIG.startDate)
    .replace("{{endDate}}", FREE_TEST_CONFIG.endDate);



  return (  
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h1 className="text-3xl font-bold dark:text-white">
              {t("freeTest.title")}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {t("freeTest.subtitle")}
          </p>

          {/* Limited time offer badge */}
          <div className="mt-4 inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold">
            {limitedTimeText}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile form */}
          <div className="lg:col-span-2">
            <ProfileForm
              isSelfProfile={false}
              onSuccess={handleProfileSuccess}
              disabled={isSubmitting}
            />
          </div>

          {/* About the feature */}
          <div className="lg:col-span-1">
            <div
              className="rounded-2xl shadow-2xl overflow-hidden h-full
                          border border-white/10
                          backdrop-filter backdrop-blur-2xl 
                          bg-white/10 hover:bg-white/15 
                          dark:bg-black/10 dark:hover:bg-black/20 
                          transition-all duration-300 p-6">
              <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {t("freeTest.aboutTitle")}
              </h2>

              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  {t("freeTest.aboutDescription")}
                </p>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-800 dark:text-purple-300 mb-2">
                    {t("freeTest.whatYouGet")}
                  </h3>
                  <ul className="text-sm text-purple-600 dark:text-purple-400 space-y-2 pl-5 list-disc">
                    <li>{t("freeTest.feature1")}</li>
                    <li>{t("freeTest.feature2")}</li>
                    <li>{t("freeTest.feature3")}</li>
                  </ul>
                </div>


              </div>
            </div>
          </div>

          {/* Chart explanation */}
          <div className="lg:col-span-3">
            <div
              className="rounded-2xl shadow-2xl overflow-hidden
                          border border-white/10
                          backdrop-filter backdrop-blur-2xl 
                          bg-white/10 hover:bg-white/15 
                          dark:bg-black/10 dark:hover:bg-black/20 
                          transition-all duration-300 p-6">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">
                {t("calculate.aboutZiWei")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <h3 className="font-medium text-purple-800 dark:text-purple-300 mb-2">
                      {t("calculate.whatIsZiWei")}
                    </h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      {t("calculate.whatIsDescription")}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                      {t("calculate.requiredInfo")}
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      {t("calculate.requiredInfoDescription")}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">
                      {t("calculate.interpretation")}
                    </h3>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      {t("calculate.interpretationDescription")}
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

export default FreeTest;
