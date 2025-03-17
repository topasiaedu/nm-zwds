import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Link, useParams } from "react-router-dom";
import PageTransition from "../components/PageTransition";

/**
 * Interface for chart data
 */
interface ChartData {
  id: string;
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  gender: string;
  createdAt: string;
  relationship?: string;
}

/**
 * Result component to display 紫微斗数 chart results
 */
const Result: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  
  // State for chart data
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Fetch chart data on component mount
   */
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchData = async () => {
      try {
        // Simulating API request delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data response
        const mockData: ChartData = {
          id: id || "result1",
          name: "Zhang Wei",
          birthDate: "1985-08-15",
          birthTime: "14:30",
          birthPlace: "Beijing, China",
          gender: "male",
          createdAt: "2023-12-15",
          relationship: "Friend"
        };
        
        setChartData(mockData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load chart data");
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  /**
   * Format a date string to a readable format
   * @param dateString - ISO date string
   * @returns Formatted date string
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
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
              {loading ? (t("result.loading") || "Loading Chart...") : `${chartData?.name}'s ${t("result.chart") || "Chart"}`}
            </h1>
          </div>
          {!loading && chartData && (
            <p className="text-gray-600 dark:text-gray-400">
              {t("result.subtitle") || `紫微斗数 (Zi Wei Dou Shu) chart analysis for ${chartData.name}`}
            </p>
          )}
        </div>
        
        {loading ? (
          // Loading state
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                {t("general.loadingText") || "Loading chart data..."}
              </p>
            </div>
          </div>
        ) : error ? (
          // Error state
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg text-center">
            <svg className="mx-auto h-12 w-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">
              {t("general.error") || "Error"}
            </h2>
            <p className="text-red-600 dark:text-red-400">
              {error}
            </p>
            <button 
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              onClick={() => window.location.reload()}
            >
              {t("general.retry") || "Retry"}
            </button>
          </div>
        ) : chartData && (
          // Chart display
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart visualization */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl shadow-2xl overflow-hidden
                            border border-white/10
                            backdrop-filter backdrop-blur-2xl 
                            bg-white/10 hover:bg-white/15 
                            dark:bg-black/10 dark:hover:bg-black/20 
                            transition-all duration-300 p-6">
                <h2 className="text-2xl font-bold mb-6 dark:text-white">
                  {t("result.chartVisualization") || "Chart Visualization"}
                </h2>
                
                {/* Placeholder for the actual chart visualization */}
                <div className="aspect-square bg-white/20 dark:bg-gray-800/20 rounded-xl p-4 border border-white/10 dark:border-gray-700/20">
                  <div className="grid grid-cols-3 grid-rows-3 gap-4 h-full">
                    {/* 12 houses in the chart - this is just a placeholder representation */}
                    {Array.from({ length: 9 }).map((_, index) => (
                      <div 
                        key={index}
                        className="bg-white/20 dark:bg-gray-700/20 rounded-lg p-3 flex flex-col items-center justify-center text-center relative"
                      >
                        <span className="absolute top-2 left-2 text-xs font-bold text-purple-600 dark:text-purple-400">
                          {index + 1}
                        </span>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          House {index + 1}
                        </div>
                        {index === 4 && (
                          <div className="w-10 h-10 rounded-full bg-purple-400/50 dark:bg-purple-800/50 flex items-center justify-center mt-1">
                            <span className="text-purple-800 dark:text-purple-200 text-xs font-bold">紫微</span>
                          </div>
                        )}
                        {index === 2 && (
                          <div className="w-8 h-8 rounded-full bg-blue-400/50 dark:bg-blue-800/50 flex items-center justify-center mt-1">
                            <span className="text-blue-800 dark:text-blue-200 text-xs font-bold">天機</span>
                          </div>
                        )}
                        {index === 6 && (
                          <div className="w-8 h-8 rounded-full bg-green-400/50 dark:bg-green-800/50 flex items-center justify-center mt-1">
                            <span className="text-green-800 dark:text-green-200 text-xs font-bold">太陽</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    This is a placeholder visualization. In the full implementation, this would show an interactive 紫微斗数 chart.
                  </div>
                </div>
              </div>
            </div>
            
            {/* Profile information */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl shadow-2xl overflow-hidden
                            border border-white/10
                            backdrop-filter backdrop-blur-2xl 
                            bg-white/10 hover:bg-white/15 
                            dark:bg-black/10 dark:hover:bg-black/20 
                            transition-all duration-300 p-6">
                <h2 className="text-xl font-bold mb-4 dark:text-white">
                  {t("result.profileDetails") || "Profile Details"}
                </h2>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-gray-500 dark:text-gray-400">Name:</div>
                    <div className="col-span-2 font-medium dark:text-white">{chartData.name}</div>
                  </div>
                  {chartData.relationship && (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-gray-500 dark:text-gray-400">Relationship:</div>
                      <div className="col-span-2 font-medium dark:text-white">{chartData.relationship}</div>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-gray-500 dark:text-gray-400">Birth Date:</div>
                    <div className="col-span-2 font-medium dark:text-white">{formatDate(chartData.birthDate)}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-gray-500 dark:text-gray-400">Birth Time:</div>
                    <div className="col-span-2 font-medium dark:text-white">{chartData.birthTime}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-gray-500 dark:text-gray-400">Birth Place:</div>
                    <div className="col-span-2 font-medium dark:text-white">{chartData.birthPlace}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-gray-500 dark:text-gray-400">Gender:</div>
                    <div className="col-span-2 font-medium dark:text-white">
                      {chartData.gender === "male" ? "Male" : "Female"}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-gray-500 dark:text-gray-400">Generated:</div>
                    <div className="col-span-2 font-medium dark:text-white">{formatDate(chartData.createdAt)}</div>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-3">
                  <button className="flex-1 px-4 py-2 text-white font-medium rounded-lg transition-all 
                                   bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700
                                   focus:ring-4 focus:ring-purple-300 focus:outline-none">
                    {t("result.shareChart") || "Share"}
                  </button>
                  <button className="flex-1 px-4 py-2 text-gray-900 dark:text-white font-medium rounded-lg transition-all
                                   bg-white/50 dark:bg-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-700/70
                                   focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-700 focus:outline-none">
                    {t("result.print") || "Print"}
                  </button>
                </div>
              </div>
              
              {/* Key insights */}
              <div className="rounded-2xl shadow-2xl overflow-hidden mt-6
                            border border-white/10
                            backdrop-filter backdrop-blur-2xl 
                            bg-white/10 hover:bg-white/15 
                            dark:bg-black/10 dark:hover:bg-black/20 
                            transition-all duration-300 p-6">
                <h2 className="text-xl font-bold mb-4 dark:text-white">
                  {t("result.keyInsights") || "Key Insights"}
                </h2>
                
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Life Path</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Placeholder for life path insights</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300">Personality</h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Placeholder for personality traits</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Fortune</h3>
                    <p className="text-sm text-green-600 dark:text-green-400">Placeholder for fortune predictions</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Detailed analysis */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl shadow-2xl overflow-hidden
                            border border-white/10
                            backdrop-filter backdrop-blur-2xl 
                            bg-white/10 hover:bg-white/15 
                            dark:bg-black/10 dark:hover:bg-black/20 
                            transition-all duration-300 p-6">
                <h2 className="text-2xl font-bold mb-6 dark:text-white">
                  {t("result.detailedAnalysis") || "Detailed Analysis"}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-bold mb-3 dark:text-white flex items-center">
                      <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Career & Wealth
                    </h3>
                    <div className="space-y-4">
                      <p className="text-gray-600 dark:text-gray-400">
                        This is a placeholder for detailed career and wealth analysis. In a full implementation, this would contain personalized insights about career path, financial prospects, and wealth management recommendations.
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                          <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">Suitable Career</h4>
                          <p className="text-xs text-yellow-600 dark:text-yellow-400">
                            Technology, Finance, Research
                          </p>
                        </div>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                          <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">Financial Outlook</h4>
                          <p className="text-xs text-yellow-600 dark:text-yellow-400">
                            Stable with growth potential
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold mb-3 dark:text-white flex items-center">
                      <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Relationships & Family
                    </h3>
                    <div className="space-y-4">
                      <p className="text-gray-600 dark:text-gray-400">
                        This is a placeholder for relationship and family analysis. In a full implementation, this would contain personalized insights about relationship patterns, family dynamics, and compatibility with others.
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                          <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">Relationship Style</h4>
                          <p className="text-xs text-red-600 dark:text-red-400">
                            Loyal, Patient, Analytical
                          </p>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                          <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">Compatible Signs</h4>
                          <p className="text-xs text-red-600 dark:text-red-400">
                            Horse, Rabbit, Goat
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold mb-3 dark:text-white flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Health & Wellness
                    </h3>
                    <div className="space-y-4">
                      <p className="text-gray-600 dark:text-gray-400">
                        This is a placeholder for health and wellness analysis. In a full implementation, this would contain personalized insights about health tendencies, potential concerns, and wellness recommendations.
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                          <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">Strengths</h4>
                          <p className="text-xs text-green-600 dark:text-green-400">
                            Resilient immune system, Strong vital energy
                          </p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                          <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">Areas for Attention</h4>
                          <p className="text-xs text-green-600 dark:text-green-400">
                            Digestive system, Stress management
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold mb-3 dark:text-white flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Life Purpose & Potential
                    </h3>
                    <div className="space-y-4">
                      <p className="text-gray-600 dark:text-gray-400">
                        This is a placeholder for life purpose and potential analysis. In a full implementation, this would contain personalized insights about life mission, spiritual path, and personal growth opportunities.
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Natural Talents</h4>
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            Analysis, Communication, Problem-solving
                          </p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Life Lessons</h4>
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            Balance, Emotional expression, Trust
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Result; 