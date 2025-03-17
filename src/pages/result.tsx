import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Link, useParams, useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { useProfileContext } from "../context/ProfileContext";
import ProfileForm from "../components/ProfileForm";

/**
 * Interface for chart data
 */
interface ChartData {
  id: string;
  name: string;
  birthDate: string;
  birthTime: string;
  gender: string;
  createdAt: string;
}

/**
 * Result component to display 紫微斗数 chart results
 * Can display either user's own chart (is_self=true) or another profile's chart
 */
const Result: React.FC = () => {
  const { t, language } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profiles, loading: profilesLoading } = useProfileContext();
  
  // State for chart data
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Add this state to force iframe reload when needed
  const [iframeKey, setIframeKey] = useState(0);
  
  // Add zoom functionality
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const chartContainerRef = useRef<HTMLDivElement>(null);
  
  // Add a ref to keep track of the loaded chart data
  const loadedChartDataRef = useRef<{ id: string; data: ChartData } | null>(null);
  
  // Track previous touch position for better mobile handling
  const lastTouchRef = useRef<{ x: number, y: number } | null>(null);
  
  // Track if iframe is loaded
  const [iframeLoaded, setIframeLoaded] = useState(false);
  
  // Track iframe loading errors
  const [iframeError, setIframeError] = useState(false);
  
  // Initialize zoom based on screen size
  useEffect(() => {
    const setInitialZoom = () => {
      const isMobile = window.innerWidth < 768;
      setZoomLevel(isMobile ? 0.8 : 1.2);
    };
    
    setInitialZoom();
    
    window.addEventListener('resize', setInitialZoom);
    return () => window.removeEventListener('resize', setInitialZoom);
  }, []);
  
  // Memoize formatBirthTime function to prevent it from changing on every render
  const formatBirthTime = useCallback((birthTimeString: string): string => {
    const hour = parseInt(birthTimeString);
    if (isNaN(hour)) return "Unknown";
    
    const hourIn12Format = hour % 12 || 12;
    const period = hour >= 12 ? "PM" : "AM";
    
    return `${hourIn12Format}:00 ${period}`;
  }, []);
  
  // Find the user's self profile if no id is provided
  const isSelfProfile = !id;
  const selfProfile = profiles.find(profile => profile.is_self);
  const profileToShow = isSelfProfile 
    ? selfProfile 
    : profiles.find(profile => String(profile.id) === String(id));
  
  // Add debug logs to help identify issues
  useEffect(() => {
    if (id && !profileToShow && profiles.length > 0) {
      console.log("Profile not found in context:", id);
      console.log("Available profiles:", profiles.map(p => ({ id: p.id, name: p.name })));
    }
  }, [id, profileToShow, profiles]);
  
  /**
   * Fetch or prepare chart data on component mount and when profiles change
   */
  useEffect(() => {
    // Track if component is mounted to prevent state updates after unmount
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Handle differently based on whether viewing self or other profile
        if (isSelfProfile && !selfProfile) {
          // If viewing self profile but none exists, don't fetch data
          if (isMounted) {
            setLoading(false);
          }
          return;
        }
        
        // If profile is found in context, use that data
        if (profileToShow) {
          const profile = profileToShow;
          
          // Convert the profile data to ChartData format
          const chartData: ChartData = {
            id: profile.id,
            name: profile.name,
            birthDate: profile.birthday,
            birthTime: formatBirthTime(profile.birth_time),
            gender: profile.gender,
            createdAt: profile.created_at
          };
          
          if (isMounted) {
            setChartData(chartData);
            loadedChartDataRef.current = { id: profile.id, data: chartData };
            setLoading(false);
          }
          return;
        }
        
        // If id specified but profile not found in context, try to fetch from API
        // Only show mock data in development and if profiles haven't been loaded yet
        if (id && !profileToShow) {
          // If we previously loaded this profile's data, use that instead of showing an error
          if (loadedChartDataRef.current && String(loadedChartDataRef.current.id) === String(id)) {
            if (isMounted) {
              setChartData(loadedChartDataRef.current.data);
              setLoading(false);
            }
            return;
          }
          
          // If profiles are loaded and the profile isn't found, it probably doesn't exist
          if (profiles.length > 0) {
            if (isMounted) {
              setError(`Profile with ID ${id} not found`);
              setLoading(false);
            }
            return;
          }
          
          // Simulating API request delay (in a real app, this would be a real API call)
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Only use mock data for development purposes - this should be removed in production
          // or replaced with a real API call
          if (process.env.NODE_ENV === 'development') {
            const mockData: ChartData = {
              id: id,
              name: "Zhang Wei (Mock Data)",  // Clearly mark as mock data
              birthDate: "1985-08-15",
              birthTime: "14:30",
              gender: "male",
              createdAt: "2023-12-15"
            };
            
            if (isMounted) {
              setChartData(mockData);
            }
          } else {
            if (isMounted) {
              setError(`Profile with ID ${id} not found`);
            }
          }
          if (isMounted) {
            setLoading(false);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load chart data");
          setLoading(false);
        }
      }
    };
    
    if (!profilesLoading) {
      fetchData();
    }
    
    // Cleanup function to prevent state updates after component unmount
    return () => {
      isMounted = false;
    };
  }, [id, profiles, profilesLoading, selfProfile, profileToShow, isSelfProfile]);
  
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
  
  // Add a function to refresh the iframe
  const refreshChart = () => {
    // Reset all states
    setIframeLoaded(false);
    setIframeError(false);
    
    // Force iframe to reload with new key
    setIframeKey(prevKey => prevKey + 1);
    
    // Calculate optimal zoom level for the viewport size
    handleZoomReset();
  };
  
  // Auto-fit chart to viewport when first loaded
  useEffect(() => {
    if (iframeLoaded && chartContainerRef.current) {
      handleZoomReset();
    }
  }, [iframeLoaded]);
  
  // Add a function to convert date strings to query parameters
  const buildQueryParams = (chartData: ChartData): string => {
    if (!chartData) return "";
    
    try {
      // Parse the birth date components - handle any date format
      // First, try to clean any ISO time components
      let dateStr = chartData.birthDate;
      if (dateStr.includes('T')) {
        dateStr = dateStr.split('T')[0];
      }
      
      // Parse the birth date components - clean any ISO time components first
      const cleanDate = chartData.birthDate.split('T')[0]; // Remove any time portion
      const dateParts = cleanDate.split("-");
      if (dateParts.length !== 3) {
        console.error("Invalid birth date format:", chartData.birthDate);
        return "";
      }
      
      const year = dateParts[0];
      const month = dateParts[1].padStart(2, '0');  // Ensure two digits
      const day = dateParts[2].padStart(2, '0');    // Ensure two digits
      
      // Parse birth time (assume it's in format like "10:00 AM")
      const timeMatch = chartData.birthTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      let hour = timeMatch ? parseInt(timeMatch[1]) : 12;
      
      // Convert to 24-hour format if PM
      if (timeMatch && timeMatch[3] && timeMatch[3].toUpperCase() === "PM" && hour < 12) {
        hour += 12;
      }
      // Handle 12 AM conversion
      if (timeMatch && timeMatch[3] && timeMatch[3].toUpperCase() === "AM" && hour === 12) {
        hour = 0;
      }
      
      // Add padding to hour to ensure it's two digits
      const hourStr = hour.toString().padStart(2, '0');
      
      console.log("Chart parameters:", { year, month, day, hour: hourStr });
      
      // Use the same parameter names from your previous working code
      return `year=${year}&month=${month}&day=${day}&hour=${hourStr}&gender=${chartData.gender}&name=${encodeURIComponent(chartData.name)}`;
    } catch (error) {
      console.error("Error building query parameters:", error);
      return "";
    }
  };
  
  // Add zoom controls functionality
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleZoomReset = () => {
    // Set optimal fit for the viewport based on device
    const isMobile = window.innerWidth < 768;
    const containerWidth = chartContainerRef.current?.clientWidth || 977;
    const optimalZoom = isMobile ? 
      Math.min(containerWidth / 977 * 0.95, 1) : // 95% of container width on mobile
      Math.min(containerWidth / 977 * 0.95, 1.2); // Up to 120% on desktop
    
    setZoomLevel(optimalZoom);
  };

  // We don't need drag handlers with the scrollable approach
  const handleMouseDown = () => {};
  const handleMouseMove = () => {};
  const handleMouseUp = () => {};
  const handleTouchStart = () => {};
  const handleTouchMove = () => {};
  const handleTouchEnd = () => {};
  
  // Handle iframe load event
  const handleIframeLoad = () => {
    console.log("Iframe loaded successfully");
    setIframeLoaded(true);
    setIframeError(false);
  };
  
  // Handle iframe error
  const handleIframeError = () => {
    console.error("Iframe failed to load");
    setIframeError(true);
    setIframeLoaded(false);
  };
  
  // If loading profiles from context
  if (profilesLoading) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        </div>
      </PageTransition>
    );
  }
  
  // If viewing self profile but none exists, show profile form
  if (isSelfProfile && !selfProfile) {
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
              <h1 className="text-3xl font-bold dark:text-white flex items-center">
                <svg className="w-7 h-7 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {t("myChart.title") || "My 紫微斗数 Chart"}
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {t("myChart.subtitle") || "View your personal Zi Wei Dou Shu chart and analysis"}
            </p>
          </div>

          <ProfileForm 
            isSelfProfile={true} 
            onSuccess={() => navigate("/chart")}
          />
        </div>
      </PageTransition>
    );
  }
  
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
            <h1 className="text-3xl font-bold dark:text-white flex items-center">
              {loading ? (t("result.loading") || "Loading Chart...") : (
                <>
                  {isSelfProfile ? (
                    <>
                      <svg className="w-7 h-7 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {t("myChart.title") || "My 紫微斗数 Chart"}
                    </>
                  ) : (
                    <>
                      <svg className="w-7 h-7 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {`${chartData?.name}'s ${t("result.chart") || "Chart"}`}
                    </>
                  )}
                </>
              )}
            </h1>
          </div>
          {!loading && chartData && (
            <p className="text-gray-600 dark:text-gray-400">
              {isSelfProfile ? 
                (t("myChart.subtitle") || "View your personal Zi Wei Dou Shu chart and analysis") :
                (t("result.subtitle") || `紫微斗数 (Zi Wei Dou Shu) chart analysis for ${chartData.name}`)}
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
                
                {/* Zoom controls */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={handleZoomOut}
                      className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors"
                      title={t("result.zoomOut") || "Zoom Out"}
                      disabled={zoomLevel <= 0.5}
                    >
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <button 
                      onClick={handleZoomIn}
                      className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors"
                      title={t("result.zoomIn") || "Zoom In"}
                      disabled={zoomLevel >= 3}
                    >
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    <button 
                      onClick={handleZoomReset}
                      className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors"
                      title={t("result.zoomReset") || "Reset Zoom"}
                    >
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 hidden md:block">
                    {zoomLevel > 1 ? t("result.dragToNavigate") || "Drag to navigate" : ""}
                  </div>
                  <button 
                    onClick={refreshChart}
                    className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors"
                    title={t("result.refreshChart") || "Refresh Chart"}
                  >
                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                
                {/* Update the iframe container with zoom capabilities */}
                <div 
                  className="min-h-[500px] md:aspect-square bg-white dark:bg-gray-800 rounded-xl border border-white/10 dark:border-gray-700/20 overflow-hidden flex flex-col relative"
                  ref={chartContainerRef}
                >
                  <div className="flex justify-between items-center p-3 border-b border-white/10 dark:border-gray-700/20">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("result.chartVisualization") || "Chart Visualization"}
                    </h3>
                    <div className="text-xs text-gray-500 dark:text-gray-400 md:hidden">
                      {t("result.scrollToView") || "Scroll to view entire chart"}
                    </div>
                  </div>
                  
                  {!iframeLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800 z-20">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                  )}
                  
                  {iframeError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20 z-20">
                      <div className="text-center p-4">
                        <svg className="mx-auto h-12 w-12 text-red-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-600 dark:text-red-400 mb-2">
                          {t("result.chartLoadError") || "Failed to load chart"}
                        </p>
                        <button 
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                          onClick={refreshChart}
                        >
                          {t("general.retry") || "Retry"}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex-grow overflow-auto"
                       style={{ cursor: 'default' }}
                  >
                    {chartData && (
                      <div className="transform-origin-center"
                           style={{ 
                             transform: `scale(${zoomLevel})`,
                             transformOrigin: 'top left',
                             width: 'fit-content',
                             minWidth: '100%',
                             height: 'fit-content',
                             minHeight: '100%',
                             transition: isDragging ? 'none' : 'transform 0.3s ease'
                           }}>
                        <iframe
                          key={iframeKey}
                          src={`/calc/${language === "en" ? "en" : "zh"}/index-${language === "en" ? "en" : "zh"}.html?${buildQueryParams(chartData)}`}
                          style={{ 
                            width: "977px", 
                            height: "1175px", 
                            border: "none", 
                            display: "block",
                            backgroundColor: "white"
                          }}
                          title={t("result.chartVisualization") || "Chart Visualization"}
                          onLoad={handleIframeLoad}
                          onError={handleIframeError}
                          scrolling="no"
                          sandbox="allow-same-origin allow-scripts allow-forms"
                          loading="eager"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Mobile instructions */}
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                  {t("result.viewportInstructions") || "Use zoom controls and scroll to view all parts of the chart"}
                  {iframeError && (
                    <button 
                      onClick={refreshChart}
                      className="ml-2 underline text-blue-500 dark:text-blue-400"
                    >
                      {t("general.tryAgain") || "Try again"}
                    </button>
                  )}
                </div>
                
                {/* Fallback for mobile if iframe doesn't load */}
                {iframeError && (
                  <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <h3 className="text-sm font-medium mb-2 dark:text-white">
                      {t("result.fallbackInfo") || "Chart Information"}
                    </h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-gray-500 dark:text-gray-400 text-xs">{t("myChart.fields.name") || "Name"}:</div>
                        <div className="col-span-2 font-medium text-xs dark:text-white">{chartData.name}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-gray-500 dark:text-gray-400 text-xs">{t("myChart.fields.birthDate") || "Birth Date"}:</div>
                        <div className="col-span-2 font-medium text-xs dark:text-white">{formatDate(chartData.birthDate)}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-gray-500 dark:text-gray-400 text-xs">{t("myChart.fields.birthTime") || "Birth Time"}:</div>
                        <div className="col-span-2 font-medium text-xs dark:text-white">{chartData.birthTime}</div>
                      </div>
                    </div>
                  </div>
                )}
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
                    <div className="text-gray-500 dark:text-gray-400">{t("myChart.fields.name") || "Name"}:</div>
                    <div className="col-span-2 font-medium dark:text-white">{chartData.name}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-gray-500 dark:text-gray-400">{t("myChart.fields.type") || "Type"}:</div>
                    <div className="col-span-2 font-medium dark:text-white">
                      {isSelfProfile ? 
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-xs">
                          {t("myChart.fields.self") || "Self"}
                        </span> : 
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 rounded-full text-xs">
                          {t("myChart.fields.other") || "Other"}
                        </span>
                      }
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-gray-500 dark:text-gray-400">{t("myChart.fields.birthDate") || "Birth Date"}:</div>
                    <div className="col-span-2 font-medium dark:text-white">{formatDate(chartData.birthDate)}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-gray-500 dark:text-gray-400">{t("myChart.fields.birthTime") || "Birth Time"}:</div>
                    <div className="col-span-2 font-medium dark:text-white">{chartData.birthTime}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-gray-500 dark:text-gray-400">{t("myChart.fields.gender") || "Gender"}:</div>
                    <div className="col-span-2 font-medium dark:text-white">
                      {chartData.gender === "male" ? 
                        <span className="flex items-center">
                          <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                          {t("myChart.fields.male") || "Male"}
                        </span> : 
                        <span className="flex items-center">
                          <span className="w-3 h-3 rounded-full bg-pink-500 mr-2"></span>
                          {t("myChart.fields.female") || "Female"}
                        </span>
                      }
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-gray-500 dark:text-gray-400">{t("result.fields.generated") || "Generated"}:</div>
                    <div className="col-span-2 font-medium dark:text-white">{formatDate(chartData.createdAt)}</div>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-3">
                  <button className="flex-1 px-4 py-2 text-white font-medium rounded-lg transition-all 
                                   bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700
                                   focus:ring-4 focus:ring-purple-300 focus:outline-none flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    {t("result.shareChart") || "Share"}
                  </button>
                  <button className="flex-1 px-4 py-2 text-gray-900 dark:text-white font-medium rounded-lg transition-all
                                   bg-white/50 dark:bg-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-700/70
                                   focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-700 focus:outline-none flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    {t("result.print") || "Print"}
                  </button>
                </div>
                
                {isSelfProfile && (
                  <div className="mt-6">
                    <Link 
                      to="/calculate" 
                      className="w-full px-4 py-2 text-white font-medium rounded-lg transition-all 
                              bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700
                              focus:ring-4 focus:ring-purple-300 focus:outline-none block text-center"
                    >
                      {t("myChart.createOtherProfile") || "Create Profile for Someone Else"}
                    </Link>
                  </div>
                )}
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
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">{t("result.insights.lifePath") || "Life Path"}</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400">{t("result.insights.lifePathText") || "Placeholder for life path insights"}</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300">{t("result.insights.personality") || "Personality"}</h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400">{t("result.insights.personalityText") || "Placeholder for personality traits"}</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-300">{t("result.insights.fortune") || "Fortune"}</h3>
                    <p className="text-sm text-green-600 dark:text-green-400">{t("result.insights.fortuneText") || "Placeholder for fortune predictions"}</p>
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
                      {t("result.analysis.careerWealth") || "Career & Wealth"}
                    </h3>
                    <div className="space-y-4">
                      <p className="text-gray-600 dark:text-gray-400">
                        {t("result.analysis.careerWealthText") || "This is a placeholder for detailed career and wealth analysis. In a full implementation, this would contain personalized insights about career path, financial prospects, and wealth management recommendations."}
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                          <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">{t("result.analysis.suitableCareer") || "Suitable Career"}</h4>
                          <p className="text-xs text-yellow-600 dark:text-yellow-400">
                            {t("result.analysis.suitableCareerText") || "Technology, Finance, Research"}
                          </p>
                        </div>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                          <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">{t("result.analysis.financialOutlook") || "Financial Outlook"}</h4>
                          <p className="text-xs text-yellow-600 dark:text-yellow-400">
                            {t("result.analysis.financialOutlookText") || "Stable with growth potential"}
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
                      {t("result.analysis.relationshipsFamily") || "Relationships & Family"}
                    </h3>
                    <div className="space-y-4">
                      <p className="text-gray-600 dark:text-gray-400">
                        {t("result.analysis.relationshipsFamilyText") || "This is a placeholder for relationship and family analysis. In a full implementation, this would contain personalized insights about relationship patterns, family dynamics, and compatibility with others."}
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                          <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">{t("result.analysis.relationshipStyle") || "Relationship Style"}</h4>
                          <p className="text-xs text-red-600 dark:text-red-400">
                            {t("result.analysis.relationshipStyleText") || "Loyal, Patient, Analytical"}
                          </p>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                          <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">{t("result.analysis.compatibleSigns") || "Compatible Signs"}</h4>
                          <p className="text-xs text-red-600 dark:text-red-400">
                            {t("result.analysis.compatibleSignsText") || "Horse, Rabbit, Goat"}
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
                      {t("result.analysis.healthWellness") || "Health & Wellness"}
                    </h3>
                    <div className="space-y-4">
                      <p className="text-gray-600 dark:text-gray-400">
                        {t("result.analysis.healthWellnessText") || "This is a placeholder for health and wellness analysis. In a full implementation, this would contain personalized insights about health tendencies, potential concerns, and wellness recommendations."}
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                          <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">{t("result.analysis.strengths") || "Strengths"}</h4>
                          <p className="text-xs text-green-600 dark:text-green-400">
                            {t("result.analysis.strengthsText") || "Resilient immune system, Strong vital energy"}
                          </p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                          <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">{t("result.analysis.areasAttention") || "Areas for Attention"}</h4>
                          <p className="text-xs text-green-600 dark:text-green-400">
                            {t("result.analysis.areasAttentionText") || "Digestive system, Stress management"}
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
                      {t("result.analysis.lifePurpose") || "Life Purpose & Potential"}
                    </h3>
                    <div className="space-y-4">
                      <p className="text-gray-600 dark:text-gray-400">
                        {t("result.analysis.lifePurposeText") || "This is a placeholder for life purpose and potential analysis. In a full implementation, this would contain personalized insights about life mission, spiritual path, and personal growth opportunities."}
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">{t("result.analysis.naturalTalents") || "Natural Talents"}</h4>
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            {t("result.analysis.naturalTalentsText") || "Analysis, Communication, Problem-solving"}
                          </p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">{t("result.analysis.lifeLessons") || "Life Lessons"}</h4>
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            {t("result.analysis.lifeLessonsText") || "Balance, Emotional expression, Trust"}
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