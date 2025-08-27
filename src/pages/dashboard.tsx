import React from "react";
import { Card } from "flowbite-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";



const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
      <Card className="w-full max-w-4xl relative z-10 rounded-2xl shadow-2xl 
                     border border-gray-200 dark:border-gray-700
                     bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700
                     transition-all duration-300">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold dark:text-white">
            {t("nav.dashboard")}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Welcome Card */}
            <div className="md:col-span-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-xl p-4 border border-white/10 dark:border-gray-700/20">
              <div className="flex items-center">
                <div className="mr-4 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <h5 className="text-lg font-bold dark:text-white">
                    Welcome, {user?.email?.split("@")[0] || "User"}!
                  </h5>
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    This is your personal dashboard for the {t("app.title")} application.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Stats Card */}
            <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-xl p-4 border border-white/10 dark:border-gray-700/20">
              <h5 className="text-md font-bold dark:text-white flex items-center mb-3">
                <svg className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Statistics
              </h5>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                  <h6 className="text-xs text-gray-600 dark:text-gray-400 mb-1">Charts</h6>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">7</p>
                </div>
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                  <h6 className="text-xs text-gray-600 dark:text-gray-400 mb-1">Reports</h6>
                  <p className="text-xl font-bold text-purple-600 dark:text-purple-400">12</p>
                </div>
              </div>
            </div>
            
            {/* Recent Activity Card */}
            <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-xl p-4 border border-white/10 dark:border-gray-700/20">
              <h5 className="text-md font-bold dark:text-white flex items-center mb-3">
                <svg className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recent Activity
              </h5>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    Profile updated <span className="text-gray-500 dark:text-gray-400">2h ago</span>
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    New chart <span className="text-gray-500 dark:text-gray-400">yesterday</span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Quick Actions Card */}
            <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-xl p-4 border border-white/10 dark:border-gray-700/20">
              <h5 className="text-md font-bold dark:text-white flex items-center mb-3">
                <svg className="w-4 h-4 mr-2 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick Actions
              </h5>
              <div className="space-y-2">
                <button className="w-full p-2 text-xs text-left bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg flex items-center transition-colors">
                  <svg className="w-3 h-3 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create New Chart
                </button>
                <button className="w-full p-2 text-xs text-left bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 rounded-lg flex items-center transition-colors">
                  <svg className="w-3 h-3 mr-2 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Export Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage; 