import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
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

  // WhatsApp link
  const whatsappLink = "https://wa.me/601158639269";

  /**
   * Check if the free test event is still active
   */
  useEffect(() => {
    const checkEventStatus = () => {
      // If feature is disabled via config, redirect immediately
      if (!FREE_TEST_CONFIG.isEnabled) {
        setIsEventActive(false);
        return;
      }

      // Check if current date is after the configured end date
      const today = new Date();
      const endDate = new Date(`${FREE_TEST_CONFIG.endDate}T23:59:59`);

      console.log("today", today);
      console.log("endDate", endDate);
      
      if (today > endDate) {
        console.log("today is after endDate");
        setIsEventActive(false);
      }
    };

    checkEventStatus();
  }, []);

  /**
   * Handle successful profile creation
   * @param profileId - ID of the newly created profile
   */
  const handleProfileSuccess = (profileId?: string) => {
    console.log("Free test profile created:", profileId);
    if (profileId) {
      navigate(`/free-result/${profileId}`);
    }
  };

  // If event is not active, redirect to the event-ended page
  if (!isEventActive) {
    navigate("/free-test-ended");
    return null;
  }

  // Format the limited time offer text with the end date
  const limitedTimeText = t("freeTest.limitedTime").replace(
    "{{date}}",
    FREE_TEST_CONFIG.endDate
  );

  // WhatsApp icon SVG
  const WhatsAppIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="mr-2"
      viewBox="0 0 16 16">
      <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
    </svg>
  );

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              to="/"
              className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4">
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              {t("general.back")}
            </Link>
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

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    {t("freeTest.fullFeatures")}
                  </h3>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {t("freeTest.upgradeDescription")}
                  </p>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                    <WhatsAppIcon />
                    {t("freeTest.signUpCta")}
                  </a>
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
