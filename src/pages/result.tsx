import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useParams, useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import ReportViewerLayout, {
  type ReportSection,
} from "../components/layout/ReportViewerLayout";
import { useAppNavItems } from "../hooks/useAppNavItems";
import { useProfileContext } from "../context/ProfileContext";
import ProfileForm from "../components/ProfileForm";
import ZWDSChart from "../components/ZWDSChart";
import ChartBlueprintSwitcher from "../components/zwds/components/ChartBlueprintSwitcher";
import ChartProfileSidebar from "../components/zwds/components/ChartProfileSidebar";
import { ZWDSCalculator } from "../utils/zwds/calculator";
import { ChartInput } from "../utils/zwds/types";
import { useTierAccess } from "../context/TierContext";

// PDF export functionality
import {
  exportChartAsPdf,
  isPdfExportSupported,
  type PdfResultExportContext,
} from "../utils/pdfExport";
import PdfExportModal from "../components/PdfExportModal";
import { PdfChartData } from "../components/PdfDocument";
import { useAlertContext } from "../context/AlertContext";
import {
  buildPrintResultTargetUrl,
  exportPdfViaServer,
  resolvePrintPageOrigin,
} from "../utils/pdfExportServer";
import {
  createPdfServerExportProgressTicker,
  DEFAULT_PDF_SERVER_EXPORT_TICKER,
} from "../utils/pdfServerExportProgressTicker";
import { supabase } from "../utils/supabase-client";
import {
  Overview,
  Health,
  AreasOfLife,
  WealthCode,
  FourKeyPalace,
} from "../components/analysis_v2";
import { DestinyBlueprintPageHeader } from "../components/analysis_v2/shared/DestinyBlueprintPageHeader";
import { ChartSettingsProvider, useChartSettings } from "../context/ChartSettingsContext";
import ChartSettingsModal from "../components/ChartSettingsModal";
import {
  chartAnalysisDividerClass,
  chartCardAccentBarClass,
  chartCardBlueprintToolbarClass,
  chartCardBodyClass,
  chartCardClass,
  chartCardTitleClass,
  chartCardToolbarClass,
  chartChartLoadingOverlayClass,
  chartScrollWrapperClass,
  chartContainerClass,
  chartSectionContainerClass,
  chartSectionLayoutClass,
  chartErrorPanelClass,
  chartErrorRetryClass,
  chartErrorTextClass,
  chartErrorTitleClass,
  chartLoadingTextClass,
  chartSpinnerClass,
  chartSpinnerSmallClass,
} from "../styles/chartUi";
import { DayunSection } from "../components/dayun";
import { NoblemanSection } from "../components/nobleman";
import { LiuMonthCard } from "../components/liumonth";
import { getCurrentLiuNianPalace, getCurrentDayunPalace, getMonthPalaceForLiuMonth, getYearPalaceForLiuMonth, getPalaceForAspectLiuNian, getPalaceForAspectLiuMonth, getPalaceForAspectDayun, getPalaceEnglishNameForTimeframe, getLiuMonthAnchorFromLocalDate } from "../utils/destiny-navigator/palace-resolver";
import type { LifeAspect } from "../types/destiny-navigator";
// FourKeyPalaceAnalysis and LifeAreasExplanation are kept commented out for potential future use
// import { FourKeyPalaceAnalysis, LifeAreasExplanation } from "../components/analysis";

const ENABLE_PDF_EXPORT = true;

/** Base report section anchors */
const CHART_SECTION: ReportSection = {
  id: "chart",
  label: "Chart",
  sub: "12-palace visualization",
};

const ANALYSIS_SECTIONS: ReportSection[] = [
  { id: "overview", label: "Overview", sub: "Life palace summary" },
  { id: "wealth-code", label: "Wealth Code", sub: "Earning style analysis" },
  { id: "health", label: "Health", sub: "Wellness patterns" },
  { id: "four-key-palace", label: "Destiny Alert Map", sub: "Four key palaces" },
  { id: "areas-of-life", label: "Areas of Life", sub: "All palace areas" },
];

const DAYUN_SECTION: ReportSection = {
  id: "dayun",
  label: "Da Yun",
  sub: "10-year cycle analysis",
};

const LIU_MONTH_SECTION: ReportSection = {
  id: "liu-month",
  label: "Liu Month",
  sub: "Monthly briefing",
};

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
  const { updateSetting } = useChartSettings();

  // State for chart data
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCapturingForPdf, setIsCapturingForPdf] = useState<boolean>(false);

  // State for branch adjustment (allows users to cycle through the 12 time branches)
  const [branchOffset, setBranchOffset] = useState<number>(0);

  // State for blueprint mode switching (controls chart overlay presets)
  const [blueprintMode, setBlueprintMode] = useState<"dna" | "dayun" | "liunian" | "liumonth">("dna");

  /**
   * Liu Month anchor: **lunar month** (1-12) from today's solar date, plus **solar year** for 流年 palace.
   * E.g. Gregorian Apr 3, 2026 -> lunar second month -> wheel slot 2 ("February" label), not April.
   */
  const { solarYear: liuMonthSolarYear, lunarMonth: selectedLiuMonth } =
    getLiuMonthAnchorFromLocalDate();

  /**
   * Persisted palace name selection for DNA (natal) mode.
   * Saved when the user clicks a palace name in DNA mode and restored when
   * the user switches back to DNA mode from another blueprint.
   */
  const [dnaPalaceNameSelection, setDnaPalaceNameSelection] = useState<number | null>(null);

  /**
   * Persisted Da Xian selection for DNA (natal) mode.
   * Saved when the user clicks a Da Xian palace in DNA mode and restored when
   * the user switches back to DNA mode from another blueprint.
   */
  const [dnaDaXianSelection, setDnaDaXianSelection] = useState<number | null>(null);

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
   * Handle blueprint mode changes and sync chart overlay settings.
   * @param mode - Selected blueprint mode.
   */
  const handleBlueprintChange = useCallback((mode: "dna" | "dayun" | "liunian" | "liumonth"): void => {
    setBlueprintMode(mode);

    if (mode === "dna") {
      // Reset all chart settings to match DEFAULT_SETTINGS["result"] (clean natal chart).
      // showDaMingBottomLabel and showSecondaryBottomLabel are intentionally false so the
      // bottom label always shows the palace's own name — not a Da Ming or secondary overlay
      // name. Showing both secondary overlay AND secondary bottom label causes a "Life Life"
      // duplicate when a palace name is clicked with no Da Xian selected.
      updateSetting("palaceClickInteraction", true);
      updateSetting("liuNianTag", true);
      updateSetting("showDaYunHighlight", true);
      updateSetting("showDaMingCornerTag", true);
      updateSetting("showDaMingBottomLabel", false);
      updateSetting("showSecondaryBottomLabel", false);
      updateSetting("showSecondaryOverlayName", true);
      updateSetting("yearAgeClickInteraction", true);
      updateSetting("daXianClickInteraction", true);
      updateSetting("palaceNameClickInteraction", true);
    } else if (mode === "dayun") {
      // Dayun mode: remapped decade roles as English DNA names (Da Ming → Life, etc.).
      // Anchor secondary names on the current Da Yun palace so that palace reads as Life.
      updateSetting("palaceClickInteraction", true);
      updateSetting("liuNianTag", false);
      updateSetting("showDaYunHighlight", true);
      updateSetting("showDaMingCornerTag", false);
      updateSetting("showDaMingBottomLabel", false);
      updateSetting("showSecondaryBottomLabel", true);
      updateSetting("showSecondaryOverlayName", false);
      updateSetting("yearAgeClickInteraction", false);
      updateSetting("daXianClickInteraction", false);
      updateSetting("palaceNameClickInteraction", false);
    } else if (mode === "liunian") {
      // LiuNian mode - matches Destiny Navigator getLiuNianConfig
      updateSetting("palaceClickInteraction", true);
      updateSetting("liuNianTag", true);
      updateSetting("showDaYunHighlight", false);
      updateSetting("showDaMingCornerTag", false);
      updateSetting("showDaMingBottomLabel", false);
      updateSetting("showSecondaryBottomLabel", true);
      updateSetting("showSecondaryOverlayName", false);
      updateSetting("yearAgeClickInteraction", false);
      updateSetting("daXianClickInteraction", false);
      updateSetting("palaceNameClickInteraction", false);
    } else if (mode === "liumonth") {
      // Liu Month: month labels come from controlled showMonths + ZWDSChart uniform mode,
      // not from year clicks (yearAgeClickInteraction stays false so bottom row is inert).
      // Palace click and highlight are enabled so users can select palaces and
      // view activation lines just like in every other chart mode.
      updateSetting("palaceClickInteraction", true);
      updateSetting("liuNianTag", true);
      updateSetting("showDaYunHighlight", false);
      updateSetting("showDaMingCornerTag", false);
      updateSetting("showDaMingBottomLabel", false);
      updateSetting("showSecondaryBottomLabel", true);
      updateSetting("showSecondaryOverlayName", false);
      updateSetting("yearAgeClickInteraction", false);
      updateSetting("daXianClickInteraction", false);
      updateSetting("palaceNameClickInteraction", false);
    }
  }, [updateSetting]);

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

  const { items: appNavItems } = useAppNavItems({
    activeKey: isSelfProfile ? "my-chart" : undefined,
  });

  const layoutProfileName = profileToShow?.name ?? chartData?.name ?? "My Chart";

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

  const reportSections = useMemo((): ReportSection[] => {
    const sections: ReportSection[] = [CHART_SECTION];

    if (!hasFullAnalysis || !calculatedChartData) {
      return sections;
    }

    if (blueprintMode === "dayun") {
      sections.push(DAYUN_SECTION);
    } else if (blueprintMode === "liumonth") {
      sections.push(LIU_MONTH_SECTION);
    } else if (blueprintMode === "dna" || blueprintMode === "liunian") {
      sections.push(...ANALYSIS_SECTIONS);
    }

    return sections;
  }, [blueprintMode, calculatedChartData, hasFullAnalysis]);

  /**
   * Get current Liu Nian palace for month display and secondary names in LiuNian mode
   */
  const currentLiuNianPalace = useMemo(() => {
    if (!calculatedChartData) return null;
    return getCurrentLiuNianPalace(calculatedChartData);
  }, [calculatedChartData]);

  /**
   * Liu Nian life palace (secondary 命宫) for amber highlight in Liu Nian blueprint mode.
   */
  const currentLiuNianLifePalace = useMemo<number | null>(() => {
    if (!calculatedChartData) return null;
    return getPalaceForAspectLiuNian("life", calculatedChartData);
  }, [calculatedChartData]);

  /**
   * Get current Dayun palace for Da Ming tags in Dayun mode
   */
  const currentDayunPalace = useMemo(() => {
    if (!calculatedChartData) return null;
    return getCurrentDayunPalace(calculatedChartData);
  }, [calculatedChartData]);

  /**
   * The year palace for Liu Month mode.
   * Identifies which physical palace contains the selected year's annual flow.
   */
  const currentLiuMonthYearPalace = useMemo<number | null>(() => {
    if (!calculatedChartData) return null;
    return getYearPalaceForLiuMonth(calculatedChartData, liuMonthSolarYear);
  }, [calculatedChartData, liuMonthSolarYear]);

  /**
   * The month palace anchor for Liu Month mode.
   * Identifies which physical palace represents the selected month.
   */
  const currentLiuMonthPalace = useMemo<number | null>(() => {
    if (!calculatedChartData) return null;
    return getMonthPalaceForLiuMonth(
      calculatedChartData,
      selectedLiuMonth,
      liuMonthSolarYear
    );
  }, [calculatedChartData, selectedLiuMonth, liuMonthSolarYear]);

  /**
   * Liu Month "life" palace for the current **lunar** month (see `getLiuMonthAnchorFromLocalDate`).
   */
  const currentLiuMonthLifePalace = useMemo<number | null>(() => {
    if (!calculatedChartData) return null;
    return getPalaceForAspectLiuMonth(
      "life",
      calculatedChartData,
      selectedLiuMonth,
      liuMonthSolarYear
    );
  }, [calculatedChartData, selectedLiuMonth, liuMonthSolarYear]);

  /**
   * Resolve the physical palace number override for a given life aspect
   * based on the currently active blueprint mode.
   *
   * Returns null when no override is needed (natal mode uses palace names directly).
   *
   * @param aspect - The life aspect to resolve (e.g. "wealth", "health", "life")
   * @returns Palace number (1–12) or null
   */
  const getPalaceOverride = useCallback(
    (aspect: LifeAspect): number | null => {
      if (!calculatedChartData) return null;

      switch (blueprintMode) {
        case "dna":
          // Natal — no override; components use their own name-based palace lookup
          // (including any internal fallback logic, e.g. wealth → 福德 fallback)
          return null;

        case "liunian":
          return getPalaceForAspectLiuNian(aspect, calculatedChartData);

        case "liumonth":
          return getPalaceForAspectLiuMonth(
            aspect,
            calculatedChartData,
            selectedLiuMonth,
            liuMonthSolarYear
          );

        case "dayun":
          return getPalaceForAspectDayun(aspect, calculatedChartData, "current");

        default:
          return null;
      }
    },
    [calculatedChartData, blueprintMode, selectedLiuMonth, liuMonthSolarYear]
  );

  /**
   * Resolve the English palace name for a given physical palace number
   * based on the active timeframe mode. Used by the Destiny Alert Map
   * (FourKeyPalace) so its palace labels update in sync with all other sections.
   *
   * Returns an empty string for DNA mode so the component falls back to the
   * natal name already stored in the alert data.
   *
   * @param palaceNumber - Physical palace number (1–12)
   * @returns Timeframe-aware English palace name, or empty string for DNA/fallback
   */
  const resolvePalaceName = useCallback(
    (palaceNumber: number): string => {
      if (!calculatedChartData) return "";
      return (
        getPalaceEnglishNameForTimeframe(
          palaceNumber,
          calculatedChartData,
          blueprintMode,
          blueprintMode === "liumonth" ? selectedLiuMonth : undefined,
          blueprintMode === "liumonth" ? liuMonthSolarYear : undefined
        ) ?? ""
      );
    },
    [calculatedChartData, blueprintMode, selectedLiuMonth, liuMonthSolarYear]
  );

  /**
   * Handle PDF export with progress modal; mirrors active blueprint and palace overrides.
   */
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
        step: t("pdfExport.starting") || "Getting your report ready...",
        percentage: 0,
        isComplete: false,
        error: undefined,
      },
    });

    const pdfServiceUrl = process.env.REACT_APP_PDF_SERVICE_URL;
    if (pdfServiceUrl !== undefined && pdfServiceUrl !== "") {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData.session?.access_token;
        if (accessToken === undefined) {
          showAlert(
            t("pdfExport.noSession") || "Please sign in first so we can prepare your chart.",
            "error"
          );
          setPdfExportModal({
            isOpen: false,
            progress: {
              step: "",
              percentage: 0,
              isComplete: false,
              error: undefined,
            },
          });
          return;
        }

        setPdfExportModal((prev) => ({
          ...prev,
          progress: {
            ...prev.progress,
            step: t("pdfExport.serverRendering") ||
              "Sorting your chart into neat pages you can save or print...",
            percentage: 10,
          },
        }));

        const targetUrl = buildPrintResultTargetUrl(
          resolvePrintPageOrigin(),
          String(chartData.id),
          accessToken
        );

        const serverProgressTicker = createPdfServerExportProgressTicker({
          ...DEFAULT_PDF_SERVER_EXPORT_TICKER,
          onTick: ({ percentage, elapsedMs }) => {
            const step =
              elapsedMs < 15_000
                ? t("pdfExport.serverRendering") ||
                  "Sorting your chart into neat pages you can save or print..."
                : elapsedMs < 38_000
                  ? t("pdfExport.serverPhase2") ||
                    "Still working. Full reports like yours can take a little longer..."
                  : t("pdfExport.serverPhase3") ||
                    "Almost there. Just tidying the last details...";
            setPdfExportModal((prev) => ({
              ...prev,
              progress: {
                ...prev.progress,
                step,
                percentage,
              },
            }));
          },
        });

        serverProgressTicker.start();
        try {
          await exportPdfViaServer(targetUrl, async () => `Bearer ${accessToken}`);
        } catch (error) {
          console.error("PDF server export error:", error);
          setPdfExportModal((prev) => ({
            ...prev,
            progress: {
              step: t("pdfExport.failed") || "Export failed",
              percentage: 0,
              isComplete: true,
              error: error instanceof Error ? error.message : "Unknown error",
            },
          }));
          return;
        } finally {
          serverProgressTicker.stop();
        }

        setPdfExportModal({
          isOpen: true,
          progress: {
            step: t("pdfExport.complete") || "Complete",
            percentage: 100,
            isComplete: true,
            error: undefined,
          },
        });
        return;
      } catch (error) {
        console.error("PDF server export error:", error);
        setPdfExportModal((prev) => ({
          ...prev,
          progress: {
            step: t("pdfExport.failed") || "Export failed",
            percentage: 0,
            isComplete: true,
            error: error instanceof Error ? error.message : "Unknown error",
          },
        }));
        return;
      }
    }

    const resultExportContext: PdfResultExportContext = {
      blueprintMode,
      selectedLiuMonth,
      liuMonthSolarYear,
      palaceOverrides: {
        life: getPalaceOverride("life"),
        wealth: getPalaceOverride("wealth"),
        health: getPalaceOverride("health"),
      },
      resolvePalaceName,
      liuMonthCard:
        blueprintMode === "liumonth" && currentLiuMonthPalace !== null
          ? {
              palaceNumber: currentLiuMonthPalace,
              palaceName:
                calculatedChartData.palaces[currentLiuMonthPalace - 1]?.name ??
                "",
            }
          : null,
    };

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
          resultExportContext,
        },
        setIsCapturingForPdf
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
  }, [
    blueprintMode,
    calculatedChartData,
    chartData,
    currentLiuMonthPalace,
    formatDate,
    getPalaceOverride,
    hasFullAnalysis,
    language,
    resolvePalaceName,
    selectedLiuMonth,
    liuMonthSolarYear,
    setIsCapturingForPdf,
    showAlert,
    t,
  ]);

  const layoutShell = (
    shellChildren: React.ReactNode
  ): React.ReactElement => (
    <PageTransition>
      <ReportViewerLayout
        profileName={layoutProfileName}
        appNavItems={appNavItems}
        reportSections={reportSections}
      >
        {shellChildren}
      </ReportViewerLayout>
    </PageTransition>
  );

  // If loading profiles from context
  if (profilesLoading) {
    return layoutShell(
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className={chartSpinnerClass} />
        </div>
      </div>
    );
  }

  // If viewing self profile but none exists, show profile form
  if (isSelfProfile && !selfProfile) {
    return layoutShell(
      <div className={chartContainerClass}>
        <ProfileForm isSelfProfile={true} onSuccess={() => navigate("/chart")} />
      </div>
    );
  }

  return layoutShell(
    <>
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className={`${chartSpinnerClass} mb-4`} />
            <p className={chartLoadingTextClass}>
              {t("general.loadingText") || "Loading chart data..."}
            </p>
          </div>
        </div>
      ) : error ? (
        <div className={chartErrorPanelClass}>
          <svg
            className="mx-auto h-12 w-12 text-theme-danger mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className={chartErrorTitleClass}>
            {t("general.error") || "Error"}
          </h2>
          <p className={chartErrorTextClass}>{error}</p>
          <button
            type="button"
            className={chartErrorRetryClass}
            onClick={() => window.location.reload()}
          >
            {t("general.retry") || "Retry"}
          </button>
        </div>
      ) : (
        chartData && (
          <>
            <section id="chart" className={`${chartSectionContainerClass} scroll-mt-16`}>
              <div className={chartSectionLayoutClass}>
                <div className="min-w-0">
                  <div className={chartCardClass}>
                    <div className={chartCardAccentBarClass} aria-hidden="true" />
                    <div className={chartCardToolbarClass}>
                      <h2 className={chartCardTitleClass}>
                        {t("result.chartVisualization") || "Chart Visualization"}
                      </h2>
                    </div>

                    <div className={chartCardBlueprintToolbarClass}>
                      <ChartBlueprintSwitcher
                        value={blueprintMode}
                        onChange={handleBlueprintChange}
                      />
                    </div>

                    <div className={chartCardBodyClass}>
                      {calculatedChartData ? (
                        <div className={chartScrollWrapperClass}>
                          <ZWDSChart
                            chartData={calculatedChartData}
                            blueprintMode={blueprintMode}
                            targetYear={
                              blueprintMode === "liumonth" ? liuMonthSolarYear : undefined
                            }
                            isPdfExport={isCapturingForPdf}
                            selectedDaXianControlled={
                              blueprintMode === "dayun"
                                ? currentDayunPalace
                                : blueprintMode === "dna"
                                  ? dnaDaXianSelection
                                  : null
                            }
                            selectedPalaceNameControlled={
                              blueprintMode === "dayun"
                                ? currentDayunPalace
                                : blueprintMode === "liunian"
                                  ? currentLiuNianPalace
                                  : blueprintMode === "liumonth"
                                    ? currentLiuMonthPalace
                                    : blueprintMode === "dna"
                                      ? dnaPalaceNameSelection
                                      : null
                            }
                            showMonthsControlled={
                              blueprintMode === "liumonth" ? currentLiuMonthYearPalace : null
                            }
                            uniformAnnualYearForMonths={blueprintMode === "liumonth"}
                            highlightLifePalaceLikeDayun={
                              blueprintMode === "liumonth" || blueprintMode === "liunian"
                            }
                            liuMonthLifeHighlightPalaceNumber={
                              blueprintMode === "liumonth"
                                ? currentLiuMonthLifePalace
                                : blueprintMode === "liunian"
                                  ? currentLiuNianLifePalace
                                  : null
                            }
                            onPalaceNameChange={(palace) => {
                              if (blueprintMode === "dna") {
                                setDnaPalaceNameSelection(palace);
                              }
                            }}
                            onDaXianChange={(palace) => {
                              if (blueprintMode === "dna") {
                                setDnaDaXianSelection(palace);
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className={chartChartLoadingOverlayClass}>
                          <div className="text-center">
                            <div className={`${chartSpinnerSmallClass} mb-4`} />
                            <p className={chartLoadingTextClass}>
                              {t("general.loadingText") ||
                                "Calculating chart data..."}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="min-w-0">
                  <ChartProfileSidebar
                    chartData={chartData}
                    calculatedChartData={calculatedChartData}
                    isSelfProfile={isSelfProfile}
                    isAdmin={isAdmin}
                    branchOffset={branchOffset}
                    enablePdfExport={ENABLE_PDF_EXPORT}
                    onBranchOffsetChange={setBranchOffset}
                    onBranchReset={() => setBranchOffset(0)}
                    onPdfExport={handlePdfExport}
                    getCurrentBranchInfo={getCurrentBranchInfo}
                    formatDate={formatDate}
                    t={t}
                  />
                </div>
              </div>
            </section>

            {calculatedChartData && hasFullAnalysis && (
              <div className={chartAnalysisDividerClass}>
                {(blueprintMode === "dna" || blueprintMode === "liunian") && (
                  <DestinyBlueprintPageHeader
                    sectionTitle={t("analysis.title") || "PERSONALIZED LIFE REPORT"}
                    subtitle={
                      t("analysis.subtitle") ||
                      "A custom breakdown of your chart's strengths, patterns, and strategic focus areas."
                    }
                    className="mb-8"
                  />
                )}

                <div className="space-y-8">
                  {blueprintMode === "dayun" && (
                    <section id="dayun" className="scroll-mt-16">
                      <DayunSection chartData={calculatedChartData} showHeader={false} />
                    </section>
                  )}

                  {blueprintMode === "liumonth" && currentLiuMonthPalace !== null ? (
                    <section id="liu-month" className="scroll-mt-16">
                      <LiuMonthCard
                        selectedMonth={selectedLiuMonth}
                        solarYear={liuMonthSolarYear}
                        palaceNumber={currentLiuMonthPalace}
                        palaceName={calculatedChartData.palaces[currentLiuMonthPalace - 1]?.name ?? ""}
                      />
                    </section>
                  ) : (blueprintMode === "dna" || blueprintMode === "liunian") ? (
                    <>
                      <section id="overview" className="scroll-mt-16">
                        <Overview
                          chartData={calculatedChartData}
                          palaceOverride={getPalaceOverride("life") ?? undefined}
                        />
                      </section>

                      <section id="wealth-code" className="scroll-mt-16">
                        <WealthCode
                          chartData={calculatedChartData}
                          showTopDivider={true}
                          header={{
                            badgeText: "02",
                            title: "WEALTH CODE ANALYSIS",
                            subtitle:
                              "Decode your natural earning style and ideal business model aligned to your energy.",
                          }}
                          palaceOverride={getPalaceOverride("wealth") ?? undefined}
                        />
                      </section>

                      <NoblemanSection chartData={calculatedChartData} />

                      <section id="health" className="scroll-mt-16">
                        <Health
                          chartData={calculatedChartData}
                          palaceOverride={getPalaceOverride("health") ?? undefined}
                        />
                      </section>

                      <section id="four-key-palace" className="scroll-mt-16">
                        <FourKeyPalace
                          chartData={calculatedChartData}
                          resolvePalaceName={resolvePalaceName}
                        />
                      </section>

                      <section id="areas-of-life" className="scroll-mt-16">
                        <AreasOfLife
                          chartData={calculatedChartData}
                          palaceOverride={getPalaceOverride("life") ?? undefined}
                        />
                      </section>
                    </>
                  ) : null}
                </div>
              </div>
            )}
          </>
        )
      )}

      {ENABLE_PDF_EXPORT ? (
        <PdfExportModal
          isOpen={pdfExportModal.isOpen}
          onClose={closePdfExportModal}
          progress={pdfExportModal.progress}
          chartName={chartData?.name || ""}
        />
      ) : null}

      <ChartSettingsModal pageType="result" />
    </>
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
