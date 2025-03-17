import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import PageTransition from "../../components/PageTransition";

/**
 * Dashboard component for 紫微斗数 (Zi Wei Dou Shu/Purple Star Astrology) application
 * Displays various sections for the user to interact with
 */
const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  /**
   * Placeholder recent results data
   */
  const recentResults = [
    { id: "result1", name: "Zhang Wei", date: "2023-12-15", type: "完整八字命盘" },
    { id: "result2", name: "Li Na", date: "2023-12-10", type: "紫微斗数命盘" },
    { id: "result3", name: "Wang Fei", date: "2023-12-05", type: "五行分析" },
  ];
  
  return (
    <PageTransition>
      <div className="min-h-screen p-6">
        {/* Header and User Profile */}
        <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {t("dashboard.welcome")}, {user?.email?.split("@")[0] || "User"}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("dashboard.subtitle") || "Your personal 紫微斗数 (Zi Wei Dou Shu) dashboard"}
            </p>
          </div>
          
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl px-4 py-2 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg mr-3">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="mr-4">
              <p className="font-medium dark:text-white">{user?.email?.split("@")[0] || "User"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || "user@example.com"}</p>
            </div>
            <Link to="/profile" className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
          </div>
        </div>
      
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-6 gap-6">
          {/* Main Actions */}
          <div className="lg:col-span-2 grid grid-cols-1 gap-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">Quick Actions</h2>
            
            {/* My Chart */}
            <Link to="/my-chart" className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">My Chart</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">View your personal 紫微斗数 chart</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="mt-4 flex justify-end">
                <span className="text-xs py-1 px-2 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                  Updated 2d ago
                </span>
              </div>
            </Link>
            
            {/* Calculate for Others */}
            <Link to="/calculate" className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">Calculate</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Generate charts for others</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">3 saved profiles</span>
                <span className="text-xs py-1 px-2 rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  New
                </span>
              </div>
            </Link>
            
            {/* Learn */}
            <Link to="/learn" className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">Learn</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Explore 紫微斗数 principles</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="mt-4 flex justify-end">
                <span className="text-xs py-1 px-2 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  5 courses
                </span>
              </div>
            </Link>
            
            {/* Daily Fortune */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mt-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white flex items-center mb-3">
                <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Today&apos;s Fortune
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Lucky Element:</span>
                    <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Wood (木)</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Lucky Direction:</span>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">East (东)</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Lucky Color:</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">Green</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Compatibility:</span>
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">Rabbit, Dragon</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Resources */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white flex items-center mb-3">
                <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Popular Resources
              </h3>
              
              <div className="space-y-2">
                <Link to="/learn/basics" className="flex items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Introduction to 紫微斗数 Basics</span>
                </Link>
                <Link to="/learn/palace-system" className="flex items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Understanding the 12 Palace System</span>
                </Link>
                <Link to="/learn/star-types" className="flex items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Main Stars and Their Influences</span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Recent Results */}
          <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {t("dashboard.recentResults") || "Recent Results"}
              </h2>
              <Link to="/results" className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400">
                View All
              </Link>
            </div>
            
            {recentResults.length > 0 ? (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700/30">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {recentResults.map((result) => (
                      <tr key={result.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {result.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {result.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {result.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link to={`/result/${result.id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 font-medium">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No results yet</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Get started by creating a new chart calculation.
                </p>
                <div className="mt-6">
                  <Link to="/calculate" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    New Calculation
                  </Link>
                </div>
              </div>
            )}
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Chart Activity</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                </div>
                <span>65% Complete</span>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                You&apos;ve completed 13 of 20 readings this month
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard; 