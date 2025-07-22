import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Link, useParams, useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { useProfileContext } from "../context/ProfileContext";
import ZWDSChart from "../components/ZWDSChart";
import { ZWDSCalculator } from "../utils/zwds/calculator";
import { ChartInput } from "../utils/zwds/types";
import FREE_TEST_CONFIG from "../config/freeTestConfig";
import { supabase } from "../utils/supabase-client";

// PDF export functionality
import { exportChartAsPdf, isPdfExportSupported } from "../utils/pdfExport";
import PdfExportModal from "../components/PdfExportModal";
import { PdfChartData } from "../components/PdfDocument";
import { useAlertContext } from "../context/AlertContext";
import { ChartSettingsProvider, useChartSettings } from "../context/ChartSettingsContext";
import ChartSettingsModal from "../components/ChartSettingsModal";

/**
 * Interface for chart data - using PdfChartData for consistency
 */
type ChartData = PdfChartData;

/**
 * Inner FreeResult component that uses chart settings
 */
const FreeResultContent: React.FC = () => {
  const { t, language } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profiles, loading: profilesLoading } = useProfileContext();
  const profileLoadAttempts = useRef<number>(0);
  const { showAlert } = useAlertContext();
  const { toggleModal } = useChartSettings();

  // State for chart data
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEventActive, setIsEventActive] = useState<boolean>(true);

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

  // WhatsApp link (currently unused)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const whatsappLink = "https://wa.me/601158639269";

  // WhatsApp icon SVG component (currently unused)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // If event is not active, redirect to the event-ended page
  useEffect(() => {
    if (!isEventActive) {
      navigate("/free-test-ended");
    }
  }, [isEventActive, navigate]);

  // Memoize formatBirthTime function to prevent it from changing on every render
  const formatBirthTime = useCallback((birthTimeString: string): string => {
    const hour = parseInt(birthTimeString);
    if (isNaN(hour)) return "Unknown";

    const hourIn12Format = hour % 12 || 12;
    const period = hour >= 12 ? "PM" : "AM";

    return `${hourIn12Format}:00 ${period}`;
  }, []);

  // Find profile in context to display - memoized to prevent infinite re-renders
  const profileToShow = useMemo(() => {
    return profiles.find((profile) => String(profile.id) === String(id));
  }, [profiles, id]);

  /**
   * Fetch or prepare chart data on component mount and when profiles change
   */
  useEffect(() => {
    // Track if component is mounted to prevent state updates after unmount
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        
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
            // Don't set loading to false here, it's handled by the calculation useEffect
          }
          return;
        }

        // If id specified but profile not found in context
        if (id) {
          if (profiles.length > 0) {
            if (isMounted) {
              // Check if we've waited long enough before showing error
              if (!profileLoadAttempts.current) {
                profileLoadAttempts.current = 1;
                // Try again after a longer delay - profiles might still be updating in context
                setTimeout(() => {
                  if (isMounted) fetchData();
                }, 2000); // Increased from 1000ms to 2000ms
                return;
              } else if (profileLoadAttempts.current < 3) {
                // Allow up to 3 attempts instead of just 1
                profileLoadAttempts.current++;
                setTimeout(() => {
                  if (isMounted) fetchData();
                }, 2000);
                return;
              }
              
              // Before showing error, try direct database fetch as final fallback
              const directProfile = await fetchProfileDirectly(id);
              if (directProfile) {
                const chartData: ChartData = {
                  id: directProfile.id,
                  name: directProfile.name,
                  birthDate: directProfile.birthday,
                  birthTime: formatBirthTime(directProfile.birth_time),
                  gender: directProfile.gender,
                  createdAt: directProfile.created_at,
                };
                setChartData(chartData);
                return;
              }
              
              console.log("FreeResult fetchData - Profile not found even with direct fetch, showing error");
              setError(`Profile with ID ${id} not found.`);
              setLoading(false);
            }
          } else {
            console.log("FreeResult fetchData - No profiles loaded yet, waiting...");
            // If profiles aren't loaded yet, wait longer and show loading state
            await new Promise((resolve) => setTimeout(resolve, 2500)); // Increased from 1500ms to 2500ms
            if (isMounted) {
              // Check one more time if profile is now available
              const retryProfileCheck = profiles.find(
                (profile) => String(profile.id) === String(id)
              );
              
              if (retryProfileCheck) {
                console.log("FreeResult fetchData - Profile found after wait:", retryProfileCheck.id);
                const profile = retryProfileCheck;
                const chartData: ChartData = {
                  id: profile.id,
                  name: profile.name,
                  birthDate: profile.birthday,
                  birthTime: formatBirthTime(profile.birth_time),
                  gender: profile.gender,
                  createdAt: profile.created_at,
                };
                setChartData(chartData);
                return;
              }
              
              // Additional retry attempt after longer wait
              if (!profileLoadAttempts.current) {
                console.log("FreeResult fetchData - Final retry attempt after long wait");
                profileLoadAttempts.current = 1;
                await new Promise((resolve) => setTimeout(resolve, 2000));
                if (isMounted) {
                  const finalRetryCheck = profiles.find(
                    (profile) => String(profile.id) === String(id)
                  );
                  if (finalRetryCheck) {
                    console.log("FreeResult fetchData - Profile found in final retry:", finalRetryCheck.id);
                    const profile = finalRetryCheck;
                    const chartData: ChartData = {
                      id: profile.id,
                      name: profile.name,
                      birthDate: profile.birthday,
                      birthTime: formatBirthTime(profile.birth_time),
                      gender: profile.gender,
                      createdAt: profile.created_at,
                    };
                    setChartData(chartData);
                    return;
                  }
                  
                  // Last resort: try direct database fetch
                  console.log("FreeResult fetchData - Attempting direct database fetch as final fallback");
                  const directProfile = await fetchProfileDirectly(id);
                  if (directProfile) {
                    console.log("FreeResult fetchData - Profile found via direct fetch:", directProfile.id);
                    const chartData: ChartData = {
                      id: directProfile.id,
                      name: directProfile.name,
                      birthDate: directProfile.birthday,
                      birthTime: formatBirthTime(directProfile.birth_time),
                      gender: directProfile.gender,
                      createdAt: directProfile.created_at,
                    };
                    setChartData(chartData);
                    return;
                  }
                }
              }
              
              console.log("FreeResult fetchData - All retries exhausted, showing error");
              setError(
                "Unable to find the requested profile. It may have expired or been removed."
              );
              setLoading(false);
            }
          }
        }
      } catch (err) {
        console.error("FreeResult fetchData - Error:", err);
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
  }, [id, profiles, profilesLoading, formatBirthTime]); // Removed profileToShow from dependencies

  /**
   * Memoized chart calculation to prevent unnecessary recalculations
   * Only recalculates when chartData changes
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
  }, [chartData]);

  /**
   * Handle loading completion when chart calculation is ready
   */
  useEffect(() => {
    if (chartData && calculatedChartData) {
      setLoading(false);
    }
  }, [chartData, calculatedChartData]);

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
          includeAnalysis: false, // Free users don't get full analysis
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
  }, [chartData, calculatedChartData, formatDate, language, showAlert, t]);

  // Prepare the limited time offer text
  const limitedTimeText = t("freeTest.limitedTime")
    .replace("{{startDate}}", FREE_TEST_CONFIG.startDate)
    .replace("{{endDate}}", FREE_TEST_CONFIG.endDate);

  /**
   * Fetch profile directly from database as final fallback
   * @param profileId - ID of the profile to fetch
   * @returns Profile data or null if not found
   */
  const fetchProfileDirectly = async (profileId: string) => {
    try {
      console.log("FreeResult - Attempting direct database fetch for profile:", profileId);
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profileId)
        .single();

      if (error) {
        console.error("FreeResult - Error fetching profile directly:", error);
        return null;
      }

      console.log("FreeResult - Profile fetched directly from database:", profile);
      return profile;
    } catch (error) {
      console.error("FreeResult - Exception during direct fetch:", error);
      return null;
    }
  };

  // If loading profiles from context
  if (profilesLoading) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {t("general.loadingText")}
            </p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-0 xs:px-1 sm:px-2 md:px-4 py-2 sm:py-8 md:py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h1 className="text-3xl font-bold dark:text-white flex items-center pt-8 sm:pt-0">
              {loading ? (
                t("result.loading")
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  {`${chartData?.name}'s ${t("freeTest.resultTitle")}`}
                </>
              )}
            </h1>
          </div>

          {!loading && chartData && (
            <p className="text-gray-600 dark:text-gray-400">
              {t("freeTest.resultSubtitle")}
            </p>
          )}

          {/* Limited time offer badge */}
          <div className="mt-4 inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold">
            {limitedTimeText}
          </div>
        </div>

        {loading ? (
          // Loading state
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                {t("general.loadingText")}
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
              {t("general.error")}
            </h2>
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Link
              to="/free-test"
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg inline-block">
              {t("freeTest.tryAgain")}
            </Link>
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
                    {t("result.chartVisualization")}
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
                    <div className="flex items-center justify-center min-h-[400px]">
                      <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">
                          {t("general.loadingText")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile information and CTA */}
              <div className="lg:col-span-1">
                <div
                  className="rounded-2xl shadow-2xl overflow-hidden
                            border border-white/10
                            backdrop-filter backdrop-blur-2xl 
                            bg-white/10 hover:bg-white/15 
                            dark:bg-black/10 dark:hover:bg-black/20 
                            transition-all duration-300 p-6 mb-6">
                  <h2 className="text-xl font-bold mb-4 dark:text-white">
                    {t("result.profileDetails")}
                  </h2>

                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-gray-500 dark:text-gray-400">
                        {t("myChart.fields.name")}:
                      </div>
                      <div className="col-span-2 font-medium dark:text-white">
                        {chartData.name}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-gray-500 dark:text-gray-400">
                        {t("myChart.fields.birthDate")}:
                      </div>
                      <div className="col-span-2 font-medium dark:text-white">
                        {formatDate(chartData.birthDate)}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-gray-500 dark:text-gray-400">
                        {t("myChart.fields.birthTime")}:
                      </div>
                      <div className="col-span-2 font-medium dark:text-white">
                        {chartData.birthTime}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-gray-500 dark:text-gray-400">
                        {t("myChart.fields.gender")}:
                      </div>
                      <div className="col-span-2 font-medium dark:text-white">
                        {chartData.gender === "male" ? (
                          <span className="flex items-center">
                            <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                            {t("myChart.fields.male")}
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <span className="w-3 h-3 rounded-full bg-pink-500 mr-2"></span>
                            {t("myChart.fields.female")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Chart Settings Button */}
                  <div className="mt-6">
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
                  </div>

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

                  {/* Sign up CTA */}
                  {/* <div
                    className="mt-8 rounded-2xl shadow-2xl overflow-hidden
                            border border-white/10
                            backdrop-filter backdrop-blur-2xl 
                            bg-gradient-to-r from-green-600 to-green-800 text-white
                            transition-all duration-300 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">
                          {t("freeTest.upgradeTitle")}
                        </h2>
                        <p className="text-green-100 mb-4">
                          {t("freeTest.upgradeBenefits")}
                        </p>
                        <a
                          href={whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-white text-green-700 rounded-lg font-medium hover:bg-green-50 transition-colors inline-flex items-center">
                          <WhatsAppIcon />
                          {t("freeTest.createAccount")}
                        </a>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          )
        )}

        {/* PDF Export Modal */}
        <PdfExportModal
          isOpen={pdfExportModal.isOpen}
          onClose={closePdfExportModal}
          progress={pdfExportModal.progress}
          chartName={chartData?.name || ""}
        />

        {/* Chart Settings Modal */}
        <ChartSettingsModal pageType="free-result" />
        
      </div>
    </PageTransition>
  );
};

/**
 * FreeResult component wrapper with ChartSettingsProvider (everything disabled by default)
 */
const FreeResult: React.FC = () => {
  return (
    <ChartSettingsProvider defaultPageType="free-result">
      <FreeResultContent />
    </ChartSettingsProvider>
  );
};

export default FreeResult;
