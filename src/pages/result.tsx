import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Link, useParams, useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { useProfileContext } from "../context/ProfileContext";
import ProfileForm from "../components/ProfileForm";
import ZWDSChart from "../components/ZWDSChart";
import { ZWDSCalculator } from "../utils/zwds/calculator";
import { ChartInput } from "../utils/zwds/types";
import { useAuthContext } from "../context/AuthContext";
import { useTierAccess } from "../context/TierContext";

// Import PrintableReport component and PDF export utilities
import PrintableReport from "../components/PrintableReport";
import { ChartData, exportChartAsPdf } from "../utils/pdfExport";
import {
  Overview,
  Career,
  FourKeyPalace,
  Health,
  DestinyCompass,
  AreasOfLife,
} from "../components/analysis_v2";

/**
 * Result component to display 紫微斗数 chart results
 * Can display either user's own chart (is_self=true) or another profile's chart
 */
const Result: React.FC = () => {
  const { t, language } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profiles, loading: profilesLoading } = useProfileContext();
  const { user } = useAuthContext();
  const { hasAnalyticsAccess, tier } = useTierAccess();

  // State for chart data
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);


  // Add a ref to keep track of the loaded chart data
  const loadedChartDataRef = useRef<{ id: string; data: ChartData } | null>(
    null
  );

  const [calculatedChartData, setCalculatedChartData] = useState<any>(null);
  const printRef = useRef<HTMLDivElement>(null);

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
  const selfProfile = profiles.find((profile) => profile.is_self);
  const profileToShow = isSelfProfile
    ? selfProfile
    : profiles.find((profile) => String(profile.id) === String(id));

  // Add debug logs to help identify issues
  useEffect(() => {
    if (id && !profileToShow && profiles.length > 0) {
      console.log("Profile not found in context:", id);
      console.log(
        "Available profiles:",
        profiles.map((p) => ({ id: p.id, name: p.name }))
      );
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
            createdAt: profile.created_at,
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
          if (
            loadedChartDataRef.current &&
            String(loadedChartDataRef.current.id) === String(id)
          ) {
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
          await new Promise((resolve) => setTimeout(resolve, 800));

          // Only use mock data for development purposes - this should be removed in production
          // or replaced with a real API call
          if (process.env.NODE_ENV === "development") {
            const mockData: ChartData = {
              id: id,
              name: "Zhang Wei (Mock Data)", // Clearly mark as mock data
              birthDate: "1985-08-15",
              birthTime: "14:30",
              gender: "male",
              createdAt: "2023-12-15",
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
  }, [
    id,
    profiles,
    profilesLoading,
    selfProfile,
    profileToShow,
    isSelfProfile,
  ]);

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
      day: "numeric",
    });
  };

  /**
   * Calculate the Zi Wei Dou Shu chart data
   */
  useEffect(() => {
    if (chartData) {
      try {
        // Convert birth time to 24-hour format
        const timeMatch = chartData.birthTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
        let hour = timeMatch ? parseInt(timeMatch[1]) : 12;

        // Convert to 24-hour format if PM
        if (
          timeMatch &&
          timeMatch[3] &&
          timeMatch[3].toUpperCase() === "PM" &&
          hour < 12
        ) {
          hour += 12;
        }
        // Handle 12 AM conversion
        if (
          timeMatch &&
          timeMatch[3] &&
          timeMatch[3].toUpperCase() === "AM" &&
          hour === 12
        ) {
          hour = 0;
        }

        // Parse birth date - handle potential timezone issues
        let dateObj;
        if (chartData.birthDate.includes("T")) {
          // If it's an ISO string, create the date directly to handle timezone
          dateObj = new Date(chartData.birthDate);
        } else {
          // If it's just YYYY-MM-DD, create a date at noon to avoid timezone issues
          dateObj = new Date(`${chartData.birthDate}T12:00:00`);
        }

        // Get the correct date components in local timezone
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1; // JavaScript months are 0-indexed
        const day = dateObj.getDate();

        // Create chart input
        const chartInput: ChartInput = {
          year,
          month,
          day,
          hour,
          gender: chartData.gender as "male" | "female",
          name: chartData.name,
        };

        // Calculate chart
        const calculator = new ZWDSCalculator(chartInput);
        const calculatedData = calculator.calculate();
        setCalculatedChartData(calculatedData);
      } catch (error) {
        console.error("Error calculating chart:", error);
        setError(`Failed to calculate chart data: ${error}`);
      }
    }
  }, [chartData]);

  /**
   * Handle exporting the chart as a PDF with direct download
   */
  const handleExport = useCallback(() => {
    exportChartAsPdf(
      printRef,
      chartData,
      language,
      () => setIsExporting(true),
      () => {
        setIsPrinting(false);
        setIsExporting(false);
      }
    );

    // Show printable report during export
    setIsPrinting(true);
  }, [chartData, language]);

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
              <Link
                to="/dashboard"
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
                {t("general.back") || "Back"}
              </Link>
              <h1 className="text-3xl font-bold dark:text-white flex items-center">
                <svg
                  className="w-7 h-7 mr-2 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {t("myChart.title") || "My 紫微斗数 Chart"}
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {t("myChart.subtitle") ||
                "View your personal Zi Wei Dou Shu chart and analysis"}
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
      {/* Print View (hidden until printing) */}
      {isPrinting && chartData && calculatedChartData && (
        <div
          ref={printRef}
          className={`print-only ${!isPrinting ? "hidden" : ""}`}>
          <PrintableReport
            chartData={chartData}
            calculatedChartData={calculatedChartData}
            formatDate={formatDate}
          />
        </div>
      )}

      {/* Regular View */}
      <div
        className={`container mx-auto px-0 xs:px-1 sm:px-2 md:px-4 py-2 sm:py-4 md:py-8 ${
          isPrinting ? "no-print" : ""
        }`}>
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              to="/dashboard"
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
              {t("general.back") || "Back"}
            </Link>
            <h1 className="text-3xl font-bold dark:text-white flex items-center">
              {loading ? (
                t("result.loading") || "Loading Chart..."
              ) : (
                <>
                  {isSelfProfile ? (
                    <>
                      <svg
                        className="w-7 h-7 mr-2 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      {t("myChart.title") || "My 紫微斗数 Chart"}
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-7 h-7 mr-2 text-purple-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
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
              {isSelfProfile
                ? t("myChart.subtitle") ||
                  "View your personal Zi Wei Dou Shu chart and analysis"
                : t("result.subtitle") ||
                  `紫微斗数 (Zi Wei Dou Shu) chart analysis for ${chartData.name}`}
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
            <svg
              className="mx-auto h-12 w-12 text-red-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">
              {t("general.error") || "Error"}
            </h2>
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              onClick={() => window.location.reload()}>
              {t("general.retry") || "Retry"}
            </button>
          </div>
        ) : (
          chartData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-6">
              {/* Chart visualization */}
              <div className="lg:col-span-2">
                <div
                  className="rounded-2xl shadow-2xl overflow-hidden
                            border border-white/10
                            backdrop-filter backdrop-blur-2xl 
                            bg-white/10 hover:bg-white/15 
                            dark:bg-black/10 dark:hover:bg-black/20 
                            transition-all duration-300 p-1 sm:p-2 md:p-4 lg:p-6">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 md:mb-6 dark:text-white">
                    {t("result.chartVisualization") || "Chart Visualization"}
                  </h2>

                  {calculatedChartData ? (
                    <div
                      className="flex-grow overflow-auto p-0"
                      style={{
                        minHeight:
                          window.innerWidth < 640
                            ? "calc(100vh - 150px)"
                            : undefined,
                      }}>
                      <ZWDSChart chartData={calculatedChartData} />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800">
                      <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">
                          {t("general.loadingText") ||
                            "Calculating chart data..."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile information */}
              <div className="lg:col-span-1">
                <div
                  className="rounded-2xl shadow-2xl overflow-hidden
                            border border-white/10
                            backdrop-filter backdrop-blur-2xl 
                            bg-white/10 hover:bg-white/15 
                            dark:bg-black/10 dark:hover:bg-black/20 
                            transition-all duration-300 p-6 mb-6">
                  <h2 className="text-xl font-bold mb-4 dark:text-white">
                    {t("result.profileDetails") || "Profile Details"}
                  </h2>

                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-gray-500 dark:text-gray-400">
                        {t("myChart.fields.name") || "Name"}:
                      </div>
                      <div className="col-span-2 font-medium dark:text-white">
                        {chartData.name}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-gray-500 dark:text-gray-400">
                        {t("myChart.fields.type") || "Type"}:
                      </div>
                      <div className="col-span-2 font-medium dark:text-white">
                        {isSelfProfile ? (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-xs">
                            {t("myChart.fields.self") || "Self"}
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 rounded-full text-xs">
                            {t("myChart.fields.other") || "Other"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-gray-500 dark:text-gray-400">
                        {t("myChart.fields.birthDate") || "Birth Date"}:
                      </div>
                      <div className="col-span-2 font-medium dark:text-white">
                        {formatDate(chartData.birthDate)}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-gray-500 dark:text-gray-400">
                        {t("myChart.fields.birthTime") || "Birth Time"}:
                      </div>
                      <div className="col-span-2 font-medium dark:text-white">
                        {chartData.birthTime}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-gray-500 dark:text-gray-400">
                        {t("myChart.fields.gender") || "Gender"}:
                      </div>
                      <div className="col-span-2 font-medium dark:text-white">
                        {chartData.gender === "male" ? (
                          <span className="flex items-center">
                            <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                            {t("myChart.fields.male") || "Male"}
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <span className="w-3 h-3 rounded-full bg-pink-500 mr-2"></span>
                            {t("myChart.fields.female") || "Female"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-gray-500 dark:text-gray-400">
                        {t("result.fields.generated") || "Generated"}:
                      </div>
                      <div className="col-span-2 font-medium dark:text-white">
                        {formatDate(chartData.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    {/* <button
                      onClick={handleExport}
                      disabled={isExporting}
                      className="w-full px-6 py-3 text-white font-medium rounded-lg transition-all 
                               bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700
                               focus:ring-4 focus:ring-purple-300 focus:outline-none
                               shadow-lg hover:shadow-xl
                               disabled:opacity-70 disabled:cursor-not-allowed
                               flex items-center justify-center">
                      {isExporting ? (
                        <>
                          <div className="w-5 h-5 mr-3 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                          {t("result.exporting") || "正在导出..."}
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          {t("result.exportPdf") || "导出专业PDF报告"}
                        </>
                      )}
                    </button> */}
                  </div>

                  {isSelfProfile && (
                    <div className="mt-6">
                      <Link
                        to="/calculate"
                        className="w-full px-4 py-2 text-white font-medium rounded-lg transition-all 
                              bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700
                              focus:ring-4 focus:ring-purple-300 focus:outline-none block text-center">
                        {t("myChart.createOtherProfile") ||
                          "Create Profile for Someone Else"}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        )}

        {/* Analysis Section - Always show Overview, but other components require Tier 2+ */}
        {calculatedChartData && !loading && !error &&hasAnalyticsAccess && (
          <div className="mt-8">
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-4xl mb-2 font-bold dark:text-white flex items-center text-center pt-4">
                {t("analysis.title") || "Chart Analysis"}
              </h2>

              {/* Subtitle */}
              <p className="text-lg mb-6 dark:text-white text-center italic">
                {t("analysis.subtitle") ||
                  "A custom breakdown of your chart's strengths, patterns, and strategic focus areas."}
              </p>


            </div>

            <div className="space-y-8">
              {/* Overview - Always available */}
              <Overview chartData={calculatedChartData} />
              
              {/* Premium Analytics - Tier 2+ only */}
                <>
                  <Career chartData={calculatedChartData} />
                  <Health chartData={calculatedChartData} />
                  <AreasOfLife chartData={calculatedChartData} />
                  <FourKeyPalace chartData={calculatedChartData} />
                  <DestinyCompass chartData={calculatedChartData} />
                </>

              {/* Summary Analysis */}
              {/* <SummaryAnalysis chartData={calculatedChartData} /> */}

              {/* Life Areas Radar Chart */}
              {/* <LifeAreasRadarChart chartData={calculatedChartData} /> */}

              {/* Life Areas Explanation */}
              {/* <LifeAreasExplanation chartData={calculatedChartData} /> */}

              {/* Four Key Palace Analysis */}
              {/* <FourKeyPalaceAnalysis chartData={calculatedChartData} /> */}

              {/* Watchout Analysis */}
              {/* <WatchoutAnalysis chartData={calculatedChartData} /> */}

              {/* Career Analysis */}
              {/* <CareerAnalysis chartData={calculatedChartData} /> */}

              {/* Health Analysis */}
              {/* <HealthAnalysis chartData={calculatedChartData} /> */}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Result;
