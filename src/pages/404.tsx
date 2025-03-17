import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import PageTransition from "../components/PageTransition";

/**
 * 404 Not Found page with frosted glass design
 */
const NotFoundPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md rounded-2xl shadow-2xl 
                     border border-white/10
                     backdrop-filter backdrop-blur-2xl 
                     bg-white/10 hover:bg-white/15 
                     dark:bg-black/10 dark:hover:bg-black/20 
                     transition-all duration-300 p-8">
          <div className="text-center">
            <h1 className="text-9xl font-bold text-purple-600 dark:text-purple-500">404</h1>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Page not found</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              The page you are looking for doesn&lsquo;t exist or has been moved.
            </p>
            <div className="mt-8">
              <Link
                to="/"
                className="px-6 py-3 text-white font-medium rounded-lg transition-all 
                       bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700
                       focus:ring-4 focus:ring-purple-300 focus:outline-none"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default NotFoundPage; 