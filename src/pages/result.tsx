import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Link, useParams, useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { useProfileContext } from "../context/ProfileContext";
import ProfileForm from "../components/ProfileForm";
import ZWDSChart from "../components/ZWDSChart";
import { ZWDSCalculator } from "../utils/zwds/calculator";
import { ChartInput } from "../utils/zwds/types";
import { useTierAccess } from "../context/TierContext";

// PDF export functionality
import { exportChartAsPdf, isPdfExportSupported } from "../utils/pdfExport";
import PdfExportModal from "../components/PdfExportModal";
import { PdfChartData } from "../components/PdfDocument";
import { useAlertContext } from "../context/AlertContext";
import {
  Overview,
  Health,
  AreasOfLife,
  WealthCode,
} from "../components/analysis_v2";
import { ChartSettingsProvider } from "../context/ChartSettingsContext";
import ChartSettingsModal from "../components/ChartSettingsModal";
import { DayunSection } from "../components/dayun";
import { NoblemanSection } from "../components/nobleman";

/**
 * Chinese Earthly Branches for time periods (地支)
 */
const EarthlyBranches = [
  "子", // 23-1
  "丑", // 1-3
  "寅", // 3-5
  "卯", // 5-7
  "辰", // 7-9
  "巳", // 9-11
  "午", // 11-13
  "未", // 13-15
  "申", // 15-17
  "酉", // 17-19
  "戌", // 19-21
  "亥", // 21-23
];

/**
 * Get branch index from hour (0-23)
 * @param hour - Hour in 24-hour format
 * @returns Branch index (0-11)
 */
const getBranchIndexFromHour = (hour: number): number => {
  // Adjust for 子时 starting at 23:00
  const adjustedHour = (hour + 1) % 24;
  return Math.floor(adjustedHour / 2);
};

/**
 * Get hour from branch index
 * @param branchIndex - Branch index (0-11)
 * @returns Starting hour for that branch
 */
const getHourFromBranchIndex = (branchIndex: number): number => {
  return (23 + (branchIndex * 2)) % 24;
};

/**
 * Get time range string for a branch
 * @param branchIndex - Branch index (0-11)
 * @returns Time range string like "23:00-00:59"
 */
const getTimeRangeForBranch = (branchIndex: number): string => {
  const startHour = (23 + (branchIndex * 2)) % 24;
  const endHour = (startHour + 2) % 24;
  const formattedStartHour = startHour.toString().padStart(2, "0");
  const formattedEndHour = (endHour - 1).toString().padStart(2, "0");
  return `${formattedStartHour}:00-${formattedEndHour}:59`;
};

/**
 * ChartData interface for chart information - using PdfChartData for consistency
 */
type ChartData = PdfChartData;

/**
 * Inner Result component that uses chart settings
 */
const ResultContent: React.FC = () => {
  const { t, language } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profiles, loading: profilesLoading } = useProfileContext();
  const { hasFullAnalysis, isAdmin } = useTierAccess();
  const { showAlert } = useAlertContext();

  // State for chart data
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCapturingForPdf] = useState<boolean>(false);
  
  // State for branch adjustment (allows users to cycle through the 12 time branches)
  const [branchOffset, setBranchOffset] = useState<number>(0);

  // Removed Tier3/Admin control pills from this page and moved to tier3-result

  // PDF export state
  const [pdfExportModal, setPdfExportModal] = useState({
    isOpen: false,
    progress: {
      step: "",
      percentage: 0,
      isComplete: false,
      error: undefined as string | undefined,
    },
  });

  // Add a ref to keep track of the loaded chart data
  const loadedChartDataRef = useRef<{ id: string; data: ChartData } | null>(
    null
  );

  /**
   * Memoized formatBirthTime function to prevent unnecessary re-renders
   */
  const formatBirthTime = useCallback((birthTimeString: string): string => {
    const hour = parseInt(birthTimeString);
    if (isNaN(hour)) return "Unknown";

    // Map hour to time range
    const getTimeRange = (hour: number): string => {
      const timeRanges = [
        { start: 23, end: 1, range: "23:00-00:59" },
        { start: 1, end: 3, range: "01:00-02:59" },
        { start: 3, end: 5, range: "03:00-04:59" },
        { start: 5, end: 7, range: "05:00-06:59" },
        { start: 7, end: 9, range: "07:00-08:59" },
        { start: 9, end: 11, range: "09:00-10:59" },
        { start: 11, end: 13, range: "11:00-12:59" },
        { start: 13, end: 15, range: "13:00-14:59" },
        { start: 15, end: 17, range: "15:00-16:59" },
        { start: 17, end: 19, range: "17:00-18:59" },
        { start: 19, end: 21, range: "19:00-20:59" },
        { start: 21, end: 23, range: "21:00-22:59" },
      ];

      // Handle special case for 23:00-01:59
      if (hour >= 23 || hour < 1) {
        return timeRanges[0].range;
      }

      // Find the correct time range
      for (const timeRange of timeRanges) {
        if (hour >= timeRange.start && hour < timeRange.end) {
          return timeRange.range;
        }
      }

      // Fallback to first range if no match found
      return timeRanges[0].range;
    };

    return getTimeRange(hour);
  }, []);

  /**
   * Memoized formatDate function to prevent unnecessary re-renders
   */
  const formatDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  /**
   * Close PDF export modal
   */
  const closePdfExportModal = useCallback(() => {
    setPdfExportModal({
      isOpen: false,
      progress: {
        step: "",
        percentage: 0,
        isComplete: false,
        error: undefined,
      },
    });
  }, []);

  /**
   * Get current branch display info based on chartData and branchOffset
   */
  const getCurrentBranchInfo = useCallback((): { branch: string; timeRange: string } | null => {
    if (!chartData) return null;

    try {
      // Parse original hour
      const timeMatch = chartData.birthTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      let hour = timeMatch ? parseInt(timeMatch[1]) : 12;

      if (
        timeMatch &&
        timeMatch[3] &&
        timeMatch[3].toUpperCase() === "PM" &&
        hour < 12
      ) {
        hour += 12;
      }
      if (
        timeMatch &&
        timeMatch[3] &&
        timeMatch[3].toUpperCase() === "AM" &&
        hour === 12
      ) {
        hour = 0;
      }

      // Calculate current branch with offset (ensure positive result with double modulo)
      const originalBranchIndex = getBranchIndexFromHour(hour);
      const currentBranchIndex = ((originalBranchIndex + branchOffset) % 12 + 12) % 12;
      
      return {
        branch: EarthlyBranches[currentBranchIndex],
        timeRange: getTimeRangeForBranch(currentBranchIndex),
      };
    } catch (error) {
      console.error("Error getting branch info:", error);
      return null;
    }
  }, [chartData, branchOffset]);

  // Find the user's self profile if no id is provided
  const isSelfProfile = !id;
  const selfProfile = profiles.find((profile) => profile.is_self);
  const profileToShow = isSelfProfile
    ? selfProfile
    : profiles.find((profile) => String(profile.id) === String(id));

  // Add debug logs to help identify issues
  useEffect(() => {
    // Add debug logs only in development for missing profiles
    if (process.env.NODE_ENV === "development" && id && !profileToShow && profiles.length > 0) {
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
    formatBirthTime,
  ]);

  /**
   * Memoized chart calculation to prevent unnecessary recalculations
   * Recalculates when chartData or branchOffset changes
   */
  const calculatedChartData = useMemo(() => {
    if (!chartData) return null;

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

      // Apply branch offset for temporary adjustment (cycles through 12 branches)
      if (branchOffset !== 0) {
        const originalBranchIndex = getBranchIndexFromHour(hour);
        // Use double modulo to ensure positive result: ((value % 12) + 12) % 12
        const newBranchIndex = ((originalBranchIndex + branchOffset) % 12 + 12) % 12;
        hour = getHourFromBranchIndex(newBranchIndex);
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
      return calculator.calculate();
    } catch (error) {
      console.error("Error calculating chart:", error);
      setError(`Failed to calculate chart data: ${error}`);
      return null;
    }
  }, [chartData, branchOffset]);

  /**
   * Handle PDF export with progress modal (currently disabled)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePdfExport = useCallback(async () => {
    if (!chartData || !calculatedChartData) {
      showAlert(
        t("pdfExport.noData") || "No chart data available for export",
        "error"
      );
      return;
    }

    // Check if PDF export is supported
    if (!isPdfExportSupported()) {
      showAlert(
        t("pdfExport.notSupported") || "PDF export is not supported in this browser",
        "error"
      );
      return;
    }

    // Show modal and start export
    setPdfExportModal({
      isOpen: true,
      progress: {
        step: t("pdfExport.starting") || "Starting export...",
        percentage: 0,
        isComplete: false,
        error: undefined,
      },
    });

    try {
      await exportChartAsPdf(
        chartData,
        calculatedChartData,
        formatDate,
        language,
        (progress) => {
          setPdfExportModal(prev => ({
            ...prev,
            progress: {
              ...progress,
              error: progress.error || undefined,
            },
          }));
        },
        {
          includeAnalysis: hasFullAnalysis,
          pageBreaks: true,
          quality: 0.95,
          scale: 1.5,
          format: "a4",
          orientation: "portrait",
        }
      );
    } catch (error) {
      console.error("PDF export error:", error);
      setPdfExportModal(prev => ({
        ...prev,
        progress: {
          step: t("pdfExport.failed") || "Export failed",
          percentage: 0,
          isComplete: true,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      }));
    }
  }, [chartData, calculatedChartData, formatDate, hasFullAnalysis, language, showAlert, t]);

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
      {/* Regular View */}
      <div className="container mx-auto px-0 xs:px-1 sm:px-2 md:px-4 py-2 sm:py-4 md:py-8">
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
                      <ZWDSChart
                        chartData={calculatedChartData}
                        isPdfExport={isCapturingForPdf}
                      />
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

                  {/* Hour Adjustment Controls - Admin Only */}
                  {isAdmin && (() => {
                    const currentBranchInfo = getCurrentBranchInfo();
                    return (
                      <div className="mt-6 p-4 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:bg-gradient-to-br dark:from-gray-800/50 dark:to-gray-700/50 rounded-lg border border-amber-200/50 dark:border-gray-600/50">
                        <h3 className="text-sm font-semibold mb-3 text-gray-800 dark:text-white flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-amber-600 dark:text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {t("result.hourAdjustment.title") || "Adjust Birth Hour"}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
                          {t("result.hourAdjustment.description") || "Cycle through the 12 time branches (地支) to explore chart variations"}
                        </p>
                      
                        <div className="flex items-center justify-between gap-3">
                          {/* Previous Branch Button */}
                          <button
                            onClick={() => setBranchOffset(prev => prev - 1)}
                            className="flex-1 px-3 py-2 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 
                                       rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600/50 
                                       transition-colors font-medium text-sm text-gray-700 dark:text-gray-200
                                       flex items-center justify-center gap-1">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                            <span>{t("result.hourAdjustment.previous") || "Prev"}</span>
                          </button>

                          {/* Current Branch Display */}
                          <div className="flex-[2] text-center">
                            <div className={`px-3 py-2 rounded-lg font-bold text-sm ${
                              branchOffset === 0 
                                ? "bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-500/30" 
                                : "bg-amber-100 dark:bg-blue-500/20 text-amber-800 dark:text-blue-300 border border-amber-200 dark:border-blue-500/30"
                            }`}>
                              {currentBranchInfo ? (
                                <div className="flex flex-col">
                                  <span className="text-lg">{currentBranchInfo.branch}</span>
                                  <span className="text-xs font-normal opacity-80">
                                    {currentBranchInfo.timeRange}
                                  </span>
                                </div>
                              ) : (
                                <span>{t("result.hourAdjustment.original") || "Original"}</span>
                              )}
                            </div>
                          </div>

                          {/* Next Branch Button */}
                          <button
                            onClick={() => setBranchOffset(prev => prev + 1)}
                            className="flex-1 px-3 py-2 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 
                                       rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600/50 
                                       transition-colors font-medium text-sm text-gray-700 dark:text-gray-200
                                       flex items-center justify-center gap-1">
                            <span>{t("result.hourAdjustment.next") || "Next"}</span>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Reset Button */}
                        {branchOffset !== 0 && (
                          <button
                            onClick={() => setBranchOffset(0)}
                            className="w-full mt-3 px-3 py-2 bg-gradient-to-r from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700
                                       hover:from-gray-600 hover:to-gray-700 dark:hover:from-gray-500 dark:hover:to-gray-600 text-white rounded-lg 
                                       transition-all text-sm font-medium flex items-center justify-center gap-2 shadow-sm">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                            {t("result.hourAdjustment.reset") || "Reset to Original"}
                          </button>
                        )}
                      </div>
                    );
                  })()}

                  {/* Chart Settings Button */}
                  {/* <div className="mt-6">
                    <button
                      onClick={toggleModal}
                      className="w-full px-4 py-2 text-white font-medium rounded-lg transition-all 
                            bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700
                            focus:ring-4 focus:ring-purple-300 focus:outline-none
                            flex items-center justify-center mb-3">
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
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Chart Settings
                    </button>
                  </div> */}

                  {/* PDF Export Button */}
                  <div className="mt-3">
                    <button
                      onClick={handlePdfExport}
                      disabled={!chartData || !calculatedChartData}
                      className="w-full px-4 py-2 text-white font-medium rounded-lg transition-all 
                            bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700
                            focus:ring-4 focus:ring-red-300 focus:outline-none
                            disabled:opacity-50 disabled:cursor-not-allowed
                            flex items-center justify-center">
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
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      {t("result.exportPdf") || "Export PDF"}
                    </button>
                  </div>



                  {/* Timing Chart Button - Hidden */}
                  <div className="mt-6">
                    <Link
                      to={`/timing-chart/${chartData.id}`}
                      className="w-full px-4 py-2 text-white font-medium rounded-lg transition-all 
                            bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
                            focus:ring-4 focus:ring-purple-300 focus:outline-none block text-center
                            flex items-center justify-center">
                     
                      {"View Timing Analysis"}
                    </Link>
                  </div>

                  {/* Destiny Navigator Button - Admin Only */}
                  {isAdmin && (
                    <div className="mt-3">
                      <Link
                        to={`/destiny-navigator/${chartData.id}`}
                        className="w-full px-4 py-2 text-white font-medium rounded-lg transition-all 
                              bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700
                              focus:ring-4 focus:ring-cyan-300 focus:outline-none block text-center
                              flex items-center justify-center">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        Destiny Navigator
                      </Link>
                    </div>
                  )}

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
        {calculatedChartData && !loading && !error && hasFullAnalysis && (
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
              {hasFullAnalysis && (
                <>
                  {/* <Career chartData={calculatedChartData} /> */}
                  <WealthCode 
                    chartData={calculatedChartData}
                    showTopDivider={true}
                    header={{
                      badgeText: "02",
                      title: "WEALTH CODE ANALYSIS",
                      subtitle: "Decode your natural earning style and ideal business model aligned to your energy."
                    }}
                  />
                  <NoblemanSection chartData={calculatedChartData} />

                  <Health chartData={calculatedChartData} />
                  {/* <FourKeyPalace chartData={calculatedChartData} /> */}
                </>
              )}

              {/* Wealth Code Analysis - Admin only (testing phase) - Placed at bottom */}



              {/* Nobleman Analysis - Key Supportive People */}


              {/* <DestinyCompass chartData={calculatedChartData} /> */}
              <AreasOfLife chartData={calculatedChartData} />
              {/* Dayun Season Analysis - 10-Year Life Cycle */}
              <DayunSection chartData={calculatedChartData} />
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

        {/* PDF Export Modal */}
        <PdfExportModal
          isOpen={pdfExportModal.isOpen}
          onClose={closePdfExportModal}
          progress={pdfExportModal.progress}
          chartName={chartData?.name || ""}
        />

        {/* Chart Settings Modal */}
        <ChartSettingsModal pageType="result" />
      </div>
    </PageTransition>
  );
};

/**
 * Result component wrapper with ChartSettingsProvider
 */
const Result: React.FC = () => {
  return (
    <ChartSettingsProvider defaultPageType="result">
      <ResultContent />
    </ChartSettingsProvider>
  );
};

export default Result;
