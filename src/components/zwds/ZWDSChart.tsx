import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { ChartData } from "../../utils/zwds/types";

// Import our modular components and hooks
import useStarRefs from "./hooks/useStarRefs";
import useTransformations from "./hooks/useTransformations";
import Palace from "./components/Palace";
import CenterInfo from "./components/CenterInfo";
import TransformationLines from "./components/TransformationLines";
import { useLanguage } from "../../context/LanguageContext";
import { useChartSettings } from "../../context/ChartSettingsContext";
import { PALACE_NAMES } from "../../utils/zwds/constants";

// Breakpoint constants - matching TailwindCSS defaults
const SCREEN_SM = 640;

// Da Ming tag labels. Spread direction (clockwise vs anticlockwise) depends on gender + Yin/Yang.
const PALACE_TAGS = [
  "大命",
  "大兄",
  "大夫",
  "大子",
  "大财",
  "大疾",
  "大迁",
  "大友",
  "大官",
  "大田",
  "大福",
  "大父",
];
const PALACE_TAGS_EN = [
  "Da Ming",
  "Da Xiong",
  "Da Fu",
  "Da Zi",
  "Da Cai",
  "Da Ji",
  "Da Qian",
  "Da You",
  "Da Guan",
  "Da Tian",
  "Da Fu",
  "Da Fu",
];

// Month mapping to palace names - this is used to determine the starting month
const PALACE_TO_MONTH_MAPPING = {
  命宫: "Jan",
  兄弟: "Feb",
  夫妻: "Mar",
  子女: "Apr",
  财帛: "May",
  疾厄: "Jun",
  迁移: "Jul",
  交友: "Aug",
  官禄: "Sep",
  田宅: "Oct",
  福德: "Nov",
  父母: "Dec",
} as const;

const PALACE_TO_MONTH_MAPPING_EN = {
  命宫: "January",
  兄弟: "February",
  夫妻: "March",
  子女: "April",
  财帛: "May",
  疾厄: "June",
  迁移: "July",
  交友: "August",
  官禄: "September",
  田宅: "October",
  福德: "November",
  父母: "December",
} as const;

// Array of months in order for easy cycling
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface ZWDSChartProps {
  chartData: ChartData;
  targetYear?: number; // Optional prop to specify which year's annual flow to display
  simulatedAge?: number; // Optional prop to simulate a specific age for highlighting Da Xian
  selectedDaXianPalace?: number; // Optional prop to auto-select a palace for Da Ming tags
  disableInteraction?: boolean; // Optional prop to disable all user interactions
  isPdfExport?: boolean; // Optional prop to indicate PDF export mode
  /** Optional controlled selected palace (1-12). When set, overrides internal selection. */
  selectedPalaceControlled?: number | null;
  /** Optional controlled selected Da Xian palace (1-12). When set, mimics Da Xian click to show Da Ming tags. */
  selectedDaXianControlled?: number | null;
  /** Optional controlled selected palace for secondary name computation (mimics palace name click). */
  selectedPalaceNameControlled?: number | null;
  /** Optional controlled showMonths state (1-12). When set, automatically shows months for that palace. */
  showMonthsControlled?: number | null;
  /**
   * When true, every palace shows the chart `targetYear` in the year row (used for Liu Month month view).
   */
  uniformAnnualYearForMonths?: boolean;
  /**
   * When true, the timeframe life palace gets amber Da Yun-style styling. Used for Liu Month
   * and Liu Nian. Pair with `liuMonthLifeHighlightPalaceNumber` (life palace 1–12 from resolver).
   */
  highlightLifePalaceLikeDayun?: boolean;
  /**
   * Physical palace (1–12) for life-aspect highlight: Liu Month or Liu Nian secondary 命宫.
   */
  liuMonthLifeHighlightPalaceNumber?: number | null;
  /**
   * Callback fired when the user changes the palace name selection via click.
   * Only called for user-driven interactions, not controlled prop syncs.
   */
  onPalaceNameChange?: (palace: number | null) => void;
  /**
   * Callback fired when the user changes the Da Xian selection via click.
   * Only called for user-driven interactions, not controlled prop syncs.
   */
  onDaXianChange?: (palace: number | null) => void;
}

/**
 * Component to display the Zi Wei Dou Shu chart in a 4x4 grid layout
 */
const ZWDSChart: React.FC<ZWDSChartProps> = ({
  chartData,
  targetYear = new Date().getFullYear(),
  simulatedAge,
  selectedDaXianPalace,
  disableInteraction = false,
  isPdfExport = false,
  selectedPalaceControlled = null,
  selectedDaXianControlled = null,
  selectedPalaceNameControlled = null,
  onPalaceNameChange,
  onDaXianChange,
  showMonthsControlled = null,
  uniformAnnualYearForMonths = false,
  highlightLifePalaceLikeDayun = false,
  liuMonthLifeHighlightPalaceNumber = null,
}) => {
  // State to track the selected palace for transformations
  const [selectedPalace, setSelectedPalace] = useState<number | null>(null);
  // State to track the selected Da Xian for palace tags
  const [selectedDaXian, setSelectedDaXian] = useState<number | null>(
    selectedDaXianPalace || null
  );
  // State to track whether to show months instead of years
  const [showMonths, setShowMonths] = useState<number | null>(null);
  // State to track clicked palace name for secondary palace names
  const [selectedPalaceName, setSelectedPalaceName] = useState<number | null>(
    null
  );

  // Sync showMonths with controlled prop.
  // When showMonthsControlled is null, also clear the internal state so months
  // are not left visible after switching away from Liu Month mode.
  React.useEffect(() => {
    if (showMonthsControlled !== undefined) {
      setShowMonths(showMonthsControlled);
    }
  }, [showMonthsControlled]);

  const { language } = useLanguage();
  const { settings } = useChartSettings();

  // Reference to the chart container
  const chartRef = useRef<HTMLDivElement>(null);

  // State to track window size changes
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Remove redraw counter as it's no longer needed and causes flashing

  // Use our custom hooks
  const { starRefs, palaceRefs, refsReady, setRefsReady, registerStarRef } =
    useStarRefs(chartData, selectedPalace);
  const {
    calculateTransformations,
    getTargetPalaces,
    calculateOppositePalaceInfluences,
  } = useTransformations(chartData, selectedPalace);

  // Update window size when resized
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      // Window resize handled by TransformationLines component
    };

    window.addEventListener("resize", handleResize);

    // Clean up event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /**
   * Calculate all activation lines to draw, including opposite palace influences
   * Memoized to prevent expensive recalculations on every render
   */
  const getAllTransformations = useMemo(() => {
    // Get regular transformations when a palace is selected
    const regularTransformations = selectedPalace
      ? calculateTransformations()
      : [];

    // Get opposite palace influences for all palaces
    let oppositeInfluences: Array<{
      type: "祿" | "權" | "科" | "忌";
      fromPalace: number;
      toPalace: number;
      starName: string;
      isOppositeInfluence: true;
    }> = [];

    // Loop through all palaces to find all opposite palace influences
    for (let i = 1; i <= 12; i++) {
      const palaceInfluences = calculateOppositePalaceInfluences(i);
      if (palaceInfluences.length > 0) {
        oppositeInfluences = [...oppositeInfluences, ...palaceInfluences];
      }
    }

    // Build transformations array based on settings
    const allTransformations = [];

    // Add regular transformations (from palace clicks) if palace click interaction is enabled
    if (settings.palaceClickInteraction && selectedPalace) {
      allTransformations.push(...regularTransformations);
    }

    // Add opposite palace influences if transformation lines setting is enabled
    if (settings.transformationLines) {
      allTransformations.push(...oppositeInfluences);
    }

    return allTransformations;
  }, [selectedPalace, settings.palaceClickInteraction, settings.transformationLines, calculateTransformations, calculateOppositePalaceInfluences]);

  /**
   * Calculate palace tag for a given palace based on the selected Da Xian.
   * Tags spread in the Da Xian progression direction from the selected palace.
   * Clockwise Da Xian (Yang Male / Yin Female): tags increase with palace number.
   * Counter-clockwise Da Xian (Yin Male / Yang Female): tags decrease.
   */
  const getPalaceTag = (
    palaceNumber: number
  ): { tag: string | null; delay: number } => {
    if (!selectedDaXian) return { tag: null, delay: 0 };

    // Determine direction from chart data
    // const gender = chartData.input.gender;
    // const yinYang = chartData.yinYang;
    // const isClockwise =
    //   (gender === "male" && yinYang === "Yang") ||
    //   (gender === "female" && yinYang === "Yin");

    const isClockwise = false;

    // Calculate directional distance from selected Da Xian palace
    let tagIndex: number;
    if (isClockwise) {
      tagIndex = (palaceNumber - selectedDaXian + 12) % 12;
    } else {
      tagIndex = (selectedDaXian - palaceNumber + 12) % 12;
    }

    return {
      tag: language === "en" ? PALACE_TAGS_EN[tagIndex] : PALACE_TAGS[tagIndex],
      delay: tagIndex * 0.05,
    };
  };

  /**
   * Animation variants for different elements
   */
  const containerVariants = isPdfExport
    ? undefined
    : {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.3,
        },
      },
    };

  /**
   * Handle palace click
   * Memoized to prevent unnecessary re-renders of Palace components
   */
  const handlePalaceClick = useCallback((palaceNumber: number) => {
    if (disableInteraction || !settings.palaceClickInteraction) return;

    console.log("🏰 Palace clicked:", palaceNumber);

    const newSelectedPalace =
      selectedPalace === palaceNumber ? null : palaceNumber;
    console.log("🏰 New selected palace will be:", newSelectedPalace);

    setSelectedPalace(newSelectedPalace);

    // Ensure refs are ready for rendering activation lines
    if (!refsReady) {
      setRefsReady(true);
    }

    // Redraw counter removed to prevent flashing
  }, [disableInteraction, settings.palaceClickInteraction, selectedPalace, refsReady, setRefsReady]);

  // Sync internal selection with controlled prop if provided
  useEffect(() => {
    if (selectedPalaceControlled !== null && selectedPalaceControlled !== undefined) {
      setSelectedPalace(selectedPalaceControlled);
      if (!refsReady) {
        setRefsReady(true);
      }
    }
  }, [selectedPalaceControlled, refsReady, setRefsReady]);

  // Sync Da Xian selection with controlled prop if provided
  useEffect(() => {
    if (selectedDaXianControlled !== null && selectedDaXianControlled !== undefined) {
      setSelectedDaXian(selectedDaXianControlled);
    } else if (selectedDaXianControlled === null) {
      setSelectedDaXian(null);
    }
  }, [selectedDaXianControlled]);

  // Sync selectedPalaceName with controlled prop (mimic palace name click interaction)
  useEffect(() => {
    if (selectedPalaceNameControlled !== undefined && selectedPalaceNameControlled !== null) {
      setSelectedPalaceName(selectedPalaceNameControlled);
    } else if (selectedPalaceNameControlled === null) {
      setSelectedPalaceName(null);
    }
  }, [selectedPalaceNameControlled]);

  /**
   * Handle Da Xian click
   * Memoized to prevent unnecessary re-renders.
   * Fires the onDaXianChange callback for user-driven interactions so the parent
   * can persist the selection across blueprint mode switches.
   */
  const handleDaXianClick = useCallback((palaceNumber: number) => {
    if (disableInteraction || !settings.daXianClickInteraction) return;

    const newValue = selectedDaXian === palaceNumber ? null : palaceNumber;
    setSelectedDaXian(newValue);
    // Notify parent of the user-driven change (not triggered by controlled prop syncs)
    onDaXianChange?.(newValue);
  }, [disableInteraction, settings.daXianClickInteraction, selectedDaXian, onDaXianChange]);

  /**
   * Handle year click to show months
   * Memoized to prevent unnecessary re-renders
   */
  const handleYearClick = useCallback((palaceNumber: number, e: React.MouseEvent) => {
    if (disableInteraction || !settings.yearAgeClickInteraction) return;

    e.stopPropagation();
    setShowMonths(showMonths === palaceNumber ? null : palaceNumber);
  }, [disableInteraction, settings.yearAgeClickInteraction, showMonths]);

  /**
   * Handle palace name click to show secondary palace name.
   * Memoized to prevent unnecessary re-renders.
   * Fires the onPalaceNameChange callback for user-driven interactions so the parent
   * can persist the selection across blueprint mode switches.
   */
  const handlePalaceNameClick = useCallback((palaceNumber: number, e: React.MouseEvent) => {
    if (disableInteraction || !settings.palaceNameClickInteraction) return;

    e.stopPropagation();
    const newValue = selectedPalaceName === palaceNumber ? null : palaceNumber;
    setSelectedPalaceName(newValue);
    // Notify parent of the user-driven change (not triggered by controlled prop syncs)
    onPalaceNameChange?.(newValue);
  }, [disableInteraction, settings.palaceNameClickInteraction, selectedPalaceName, onPalaceNameChange]);

  /**
   * Calculate the year for a given palace based on the annual flow position
   * Memoized to prevent recalculations on every render
   */
  const calculateYearForPalace = useCallback((palaceNum: number): number => {
    // Find which palace has the target year (annual flow)
    const annualFlowPalace = chartData.palaces.find(
      (p) => p.annualFlow && p.annualFlow.year === targetYear
    );

    if (!annualFlowPalace) {
      // Fallback: calculate from palace 1
      let distance = palaceNum - 1;
      if (distance < 0) {
        distance += 12;
      }
      return targetYear + distance;
    }

    // Calculate how many positions away from the annual flow palace
    let distance = palaceNum - annualFlowPalace.number;
    if (distance < 0) {
      distance += 12;
    }

    return targetYear + distance;
  }, [chartData.palaces, targetYear]);

  /**
   * Get month for a palace based on the clicked palace number
   * Memoized to prevent recalculations on every render
   */
  const getMonthForPalace = useCallback((
    clickedPalaceNumber: number,
    currentPalaceNumber: number
  ): string | null => {
    if (!showMonths) return null;
    if (!settings.yearAgeClickInteraction && !uniformAnnualYearForMonths) return null;

    // Get the bottom right palace (palace number 10)
    const bottomRightPalace = chartData.palaces[9];
    if (!bottomRightPalace) return null;

    // Get the starting month based on the bottom right palace's name
    const monthMapping =
      language === "en" ? PALACE_TO_MONTH_MAPPING_EN : PALACE_TO_MONTH_MAPPING;
    const startingMonth =
      monthMapping[bottomRightPalace.name as keyof typeof monthMapping];
    if (!startingMonth) return null;

    // Find the index of the starting month
    const months = language === "en" ? MONTHS_EN : MONTHS;
    const startingMonthIndex = months.indexOf(startingMonth);
    if (startingMonthIndex === -1) return null;

    // Calculate how many positions to move from the clicked palace
    let distance = currentPalaceNumber - clickedPalaceNumber;
    if (distance < 0) {
      distance += 12; // Wrap around for negative distances
    }

    // Calculate the final month index
    const monthIndex = (startingMonthIndex + distance) % 12;
    return months[monthIndex];
  }, [showMonths, settings.yearAgeClickInteraction, uniformAnnualYearForMonths, chartData.palaces, language]);

  /**
   * Get secondary palace name based on clicked palace
   * Memoized to prevent recalculations on every render
   */
  const getSecondaryPalaceName = useCallback((
    currentPalaceNumber: number
  ): string | null => {
    if (!selectedPalaceName) return null;

    // Calculate how many positions to move from the clicked palace
    let distance = selectedPalaceName - currentPalaceNumber;
    if (distance < 0) {
      distance += 12; // Wrap around for negative distances
    }

    // Return the palace name at this position translated to English if applicable
    const nameCn = PALACE_NAMES[distance];
    if (language === "en") {
      // Try translate using i18n keys if available
      // We expect t("zwds.palaces.<name>") to exist for English
      // Fallback to Chinese if missing
      // Note: we cannot call t here (not in this file), so fallback is handled in Palace overlay rendering
    }
    return nameCn;
  }, [selectedPalaceName, language]);

  /**
   * Render a single palace in the chart
   */
  const renderPalace = (palaceNumber: number) => {
    const palace = chartData.palaces[palaceNumber - 1];
    if (!palace) return null;

    // Check if this palace is selected
    const isSelected = selectedPalace === palaceNumber;

    // Get target palaces that are pointed to by transformations from the selected palace
    const targetPalaces = getTargetPalaces();
    // Convert to boolean to match the prop type expected by Palace component
    const isTargetPalace = Boolean(
      selectedPalace && targetPalaces[palaceNumber]
    );
    const transformationType = isTargetPalace
      ? targetPalaces[palaceNumber]?.type
      : null;

    // Get the palace tag if a Da Xian is selected
    const { tag: palaceTag, delay } = getPalaceTag(palaceNumber);

    // Get month display if a palace year was clicked
    let monthDisplay = null;
    if (showMonths !== null) {
      const clickedPalace = chartData.palaces[showMonths - 1];
      if (clickedPalace) {
        monthDisplay = getMonthForPalace(showMonths, palaceNumber);
      }
    }

    // Get the secondary palace name if a palace was clicked
    const secondaryPalaceName = getSecondaryPalaceName(palaceNumber);

    const palaceYear = uniformAnnualYearForMonths
      ? targetYear
      : calculateYearForPalace(palaceNumber);

    const isLifePalaceLiuMonthHighlight =
      highlightLifePalaceLikeDayun &&
      liuMonthLifeHighlightPalaceNumber !== null &&
      palaceNumber === liuMonthLifeHighlightPalaceNumber;

    return (
      <Palace
        key={palaceNumber}
        palaceNumber={palaceNumber}
        palace={palace}
        isSelected={isSelected}
        isTargetPalace={isTargetPalace}
        transformationType={transformationType}
        selectedPalace={selectedPalace}
        birthYear={chartData.lunarDate.year}
        targetYear={targetYear}
        palaceYear={palaceYear}
        palaceTag={palaceTag}
        registerStarRef={registerStarRef}
        handlePalaceClick={handlePalaceClick}
        handleDaXianClick={handleDaXianClick}
        handleYearClick={handleYearClick}
        handlePalaceNameClick={handlePalaceNameClick}
        monthDisplay={monthDisplay}
        showMonths={showMonths}
        palaceRefs={palaceRefs}
        delay={delay}
        secondaryPalaceName={secondaryPalaceName}
        simulatedAge={simulatedAge}
        isPdfExport={isPdfExport}
        disableInteraction={disableInteraction}
        chartSettings={settings}
        isLifePalaceLiuMonthHighlight={isLifePalaceLiuMonthHighlight}
      />
    );
  };

  return (
    <div className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}</style>
      <motion.div
        className="w-full mx-auto aspect-[4/5] md:aspect-square relative min-w-[640px] md:min-w-0"
        initial={isPdfExport ? false : "hidden"}
        animate={isPdfExport ? false : "visible"}
        variants={containerVariants}
        ref={chartRef}
        data-zwds-chart-container="true"
        style={{
          minHeight:
            windowSize.width < SCREEN_SM ? "600px" : undefined,
          height:
            windowSize.width < SCREEN_SM ? "100%" : undefined,
          maxHeight: "900px",
        }}>
        <motion.div
          className={`grid grid-cols-4 grid-rows-4 gap-1.5 xs:gap-2 sm:gap-1.5 md:gap-1 p-1 xs:p-1.5 sm:p-1 md:p-1 h-full rounded-xl ${isPdfExport ? "bg-white" : ""
            }`}
          initial={isPdfExport ? false : { opacity: 0 }}
          animate={isPdfExport ? false : { opacity: 1 }}
          transition={isPdfExport ? { duration: 0 } : { duration: 0.5 }}>
          {/* First row (top) */}
          {renderPalace(1)}
          {renderPalace(2)}
          {renderPalace(3)}
          {renderPalace(4)}

          {/* Second row */}
          {renderPalace(12)}
          {/* Center info spans 2x2 */}
          <div className="col-span-2 row-span-2">
            <CenterInfo chartData={chartData} isPdfExport={isPdfExport} />
          </div>
          {renderPalace(5)}

          {/* Third row */}
          {renderPalace(11)}
          {/* Center info already spans here */}
          {renderPalace(6)}

          {/* Fourth row (bottom) */}
          {renderPalace(10)}
          {renderPalace(9)}
          {renderPalace(8)}
          {renderPalace(7)}
        </motion.div>

        {/* Render transformation lines as overlay */}
        <TransformationLines
          transformations={getAllTransformations}
          chartRef={chartRef}
          palaceRefs={palaceRefs}
          starRefs={starRefs}
          refsReady={refsReady}
          selectedPalace={selectedPalace}
          windowSize={windowSize}
          disableAnimations={isPdfExport}
        />
      </motion.div>
    </div>
  );
};

export default ZWDSChart;
