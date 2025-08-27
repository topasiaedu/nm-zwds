import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";

/**
 * CAEGPT component - AI Chat Assistant page
 * Embeds the CAEGPT chatbot for user interactions
 */
const CAEGPT: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <PageTransition>
      <div className="bg-gray-50 dark:bg-gray-900">
        <div className="max-w-full mx-auto px-1 sm:px-2 ">
          {/* Chat Interface */}
          <div className="w-full max-w-5xl mx-auto mt-2">
            <div
              className="rounded-2xl shadow-2xl overflow-hidden
                          border border-gray-200 dark:border-gray-700
                          bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 
                          transition-all duration-300">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 px-2 sm:px-4 py-2 sm:py-3 border-b border-white/10">
                <div className="flex items-center justify-between">
                  {/* Back Button - Hidden text on mobile */}
                  <Link
                    to="/dashboard"
                    className="flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors min-w-0 flex-shrink-0">
                    <svg
                      className="w-5 h-5 sm:mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    <span className="hidden sm:inline ml-2">{t("general.back")}</span>
                  </Link>

                  {/* Title Section - Responsive text sizing */}
                  <div className="flex items-center justify-center flex-1 min-w-0 mx-2 sm:mx-4">
                    <div className="text-center">
                      <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-none">
                        <span className="hidden sm:inline">Destiny Wealth Navigator</span>
                        <span className="sm:hidden">Destiny Navigator</span>
                      </h3>
                    </div>
                  </div>

                  {/* Online Status - Compact on mobile */}
                  <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      <span className="hidden sm:inline">Online</span>
                      <span className="sm:hidden">●</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Iframe Container */}
              <div className="p-1 sm:p-2">
                <div className="rounded-xl overflow-hidden shadow-inner bg-white/5 dark:bg-black/5">
                  <iframe
                    src={`https://chatbot-gen-client.vercel.app/chat-widget/3ce543bc-8767-4a05-9836-d1f21e2749c1${user?.email ? `?email=${encodeURIComponent(user.email)}` : ""}`}
                    // src={`http://localhost:3001/chat-widget/3ce543bc-8767-4a05-9836-d1f21e2749c1${user?.email ? `?email=${encodeURIComponent(user.email)}` : ""}`}
                    width="100%"
                    style={{ height: "80vh", border: "none", width: "100%" }}
                    title="Destiny Wealth Navigator Chat Assistant"
                    frameBorder="0"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="px-2 sm:px-4 py-3 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 border-t border-white/10">
                <div className="flex items-center justify-between text-2xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <span>
                      Secure & Private. We do not store chat data or share it
                      with third parties.
                    </span>
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

export default CAEGPT;
