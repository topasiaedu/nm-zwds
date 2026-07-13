import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Palace as PalaceType,
  Star,
  Transformation,
} from "../../../utils/zwds/types";
import { useLanguage } from "../../../context/LanguageContext";
import { translateStarName } from "../utils/helpers";
import { getPalaceBadgeIcon } from "../utils/palaceBadgeIcons";
import ZodiacIcons from "../icons";
import ZodiacIconWrapper from "./ZodiacIconWrapper";
import { FaSyncAlt } from "react-icons/fa";
import { ChartSettings } from "../../../context/ChartSettingsContext";
import {
  chartBrandChrome,
  getTransformationBorderRgba,
  getTransformationRingClass,
  isChartDarkMode,
  type TransformationType,
} from "../../../styles/chartSemanticColors";
import {
  chartPalaceBadgeIconClass,
  chartPalaceCardClass,
  chartPalaceContentClass,
  chartPalaceDaMingTagClass,
  chartPalaceDaMingTagDefaultClass,
  chartPalaceDaMingMobileRowClass,
  chartPalaceDaMingTagSelectedClass,
  chartPalaceFooterClass,
  chartPalaceFooterStemCellClass,
  chartPalaceFooterThirdCellClass,
  chartPalaceFooterYearCellClass,
  chartPalaceHeaderClass,
  chartPalaceMetaClass,
  chartPalaceMobileStarItemClass,
  chartPalaceMobileStarItemSingleColClass,
  chartPalaceMobileStarItemThreeColClass,
  chartPalaceMobileStarItemTwoColClass,
  chartPalaceMobileStarRowClass,
  chartPalaceMobileStarsStackClass,
  chartPalaceStarColumnClass,
  chartPalaceStarNameClass,
  chartPalaceStarsRowClass,
  chartPalaceStarsZoneClass,
  chartPalaceSubtitleClass,
  chartPalaceTitleClass,
  chartPalaceTitleRowClass,
  chartPalaceSecondaryNameClass,
  chartPalaceTransformationTagClass,
  chartPalaceWatermarkClass,
  chartPalaceZodiacBadgeClass,
} from "../../../styles/chartUi";

// Map earthly branches to their zodiac animals
const getZodiacIcon = (earthlyBranch: string): React.ElementType | null => {
  const branchToZodiac: Record<string, keyof typeof ZodiacIcons> = {
    子: "rat",
    丑: "ox",
    寅: "tiger",
    卯: "rabbit",
    辰: "dragon",
    巳: "snake",
    午: "horse",
    未: "goat",
    申: "monkey",
    酉: "rooster",
    戌: "dog",
    亥: "pig",
  };

  const zodiacKey = branchToZodiac[earthlyBranch];
  return zodiacKey ? ZodiacIcons[zodiacKey] : null;
};

/** True at the sm breakpoint and above — matches Tailwind `sm:` (640px). */
const useIsDesktopChart = (): boolean => {
  const [isDesktop, setIsDesktop] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 640px)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 640px)");
    const handleChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isDesktop;
};

interface PalaceProps {
  palaceNumber: number;
  palace: PalaceType;
  isSelected: boolean;
  isTargetPalace: boolean;
  transformationType: string | null;
  selectedPalace: number | null;
  birthYear: number;
  targetYear: number;
  palaceYear: number; // The calculated year for this palace
  palaceTag: string | null;
  registerStarRef: (palaceNumber: number, starName: string, element: HTMLDivElement | null) => void;
  handlePalaceClick: (palaceNumber: number) => void;
  handleDaXianClick: (palaceNumber: number) => void;
  handleYearClick: (palaceNumber: number, e: React.MouseEvent) => void;
  handlePalaceNameClick: (palaceNumber: number, e: React.MouseEvent) => void;
  monthDisplay: string | null;
  showMonths: number | null;
  palaceRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  delay: number;
  secondaryPalaceName: string | null;
  simulatedAge?: number; // Optional prop to simulate a specific age for highlighting Da Xian
  isPdfExport?: boolean; // Optional prop to indicate PDF export mode
  disableInteraction?: boolean; // Optional prop to disable all user interactions
  chartSettings: ChartSettings; // Chart settings to control feature visibility
  /** Amber Da Yun-style glow for Liu Month / Liu Nian timeframe life palace (bottom label shows Life). */
  isLifePalaceLiuMonthHighlight?: boolean;
  /** When true, double-click yellow highlights are enabled (admin only). */
  canUsePalaceHighlights: boolean;
  /** User-applied yellow highlight (double-click toggle). */
  isUserHighlighted: boolean;
  /** Toggle user yellow highlight for this palace. */
  onToggleHighlight: (palaceNumber: number) => void;
}

/**
 * Component to render a single palace in the ZWDS chart
 */
const Palace: React.FC<PalaceProps> = ({
  palaceNumber,
  palace,
  isSelected,
  isTargetPalace,
  transformationType,
  selectedPalace,
  birthYear,
  targetYear,
  palaceYear,
  palaceTag,
  registerStarRef,
  handlePalaceClick,
  handleDaXianClick,
  handleYearClick,
  handlePalaceNameClick,
  monthDisplay,
  showMonths,
  palaceRefs,
  delay,
  secondaryPalaceName,
  simulatedAge,
  isPdfExport = false,
  disableInteraction = false,
  chartSettings,
  isLifePalaceLiuMonthHighlight = false,
  canUsePalaceHighlights,
  isUserHighlighted,
  onToggleHighlight,
}) => {
  const { t, language } = useLanguage();
  const isDesktopChart = useIsDesktopChart();
  const clickTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Handle click with timing to support both single and double clicks
  const handleClick = () => {

    if (disableInteraction) return;
    
    if (clickTimeoutRef.current === null) {
      // First click
      clickTimeoutRef.current = setTimeout(() => {
        // Single click

        handlePalaceClick(palaceNumber);
        clickTimeoutRef.current = null;
      }, 250); // 250ms threshold for double click
    } else {
      // Second click within threshold — toggle yellow highlight
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      if (chartSettings.palaceClickInteraction && canUsePalaceHighlights) {
        onToggleHighlight(palaceNumber);
      }
    }
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  // Get the appropriate zodiac icon based on earthly branch (watermark only)
  const ZodiacIcon = getZodiacIcon(palace.earthlyBranch);

  const PalaceBadgeIcon = getPalaceBadgeIcon(palace.name);

  // Check if this palace has an annual flow matching the target year
  const showAnnualFlow =
    palace.annualFlow && palace.annualFlow.year === targetYear;

  // Calculate age at the annual flow year if it exists
  const getAgeAtYear = (year: number): number => {
    return year - birthYear + 1;
  };

  // Calculate current age
  const currentAge = getAgeAtYear(new Date().getFullYear());

  // Check if current age (or simulated age) falls within this palace's Major Limit (da xian) range
  const ageToCheck = simulatedAge !== undefined ? simulatedAge : currentAge;
  const isCurrentDaXian =
    chartSettings.showDaYunHighlight &&
    palace.majorLimit &&
    palace.majorLimit.startAge <= ageToCheck &&
    palace.majorLimit.endAge >= ageToCheck;

  /** Admin: user-applied yellow glow. Non-admin: automatic Da Yun / Liu life palace glow. */
  const hasYellowGlow =
    !isSelected &&
    (canUsePalaceHighlights
      ? isUserHighlighted
      : isCurrentDaXian || isLifePalaceLiuMonthHighlight);

  // Animation variants for palaces
  const palaceVariants = isPdfExport ? undefined : {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
    hover: {
      scale: 1.01,
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      transition: {
        duration: 0.2,
      },
    },
    selected: {
      scale: 1.02,
      boxShadow: chartBrandChrome.selectionBoxShadow,
      transition: {
        duration: 0.3,
      },
    },
    pulse: {
      scale: [1.02, 1.03, 1.02],
      opacity: 1,
      boxShadow: [...chartBrandChrome.selectionBoxShadowPulse],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: [0.4, 0, 0.6, 1] as const,
        opacity: { duration: 0 },
      },
    },
    daxianGlow: {
      opacity: 1,
      scale: 1,
      boxShadow: [
        "0 0 15px rgba(251, 191, 36, 0.6)",
        "0 0 20px rgba(251, 191, 36, 0.8)",
        "0 0 15px rgba(251, 191, 36, 0.6)",
      ],
      transition: {
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1] as const,
        },
        // Keep other properties stable
        opacity: { duration: 0 },
        scale: { duration: 0 },
      },
    },
    target: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
    daxian: {
      opacity: 1,
      scale: 1,
      boxShadow: chartBrandChrome.daxianRingShadow,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
    reset: {
      opacity: 1,
      scale: 1,
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  // Get transformation border color
  let transformationBorderColor = "";
  if (isTargetPalace && transformationType) {
    transformationBorderColor = getTransformationRingClass(
      transformationType as TransformationType
    );
  }

  // Brand purple gradient for selected palace
  const gradientStyle = isSelected
    ? {
        background: chartBrandChrome.selectionGradientLight,
        backgroundSize: "200% 200%",
      }
    : {};

  const darkGradientStyle = isSelected
    ? {
        background: chartBrandChrome.selectionGradientDark,
        backgroundSize: "200% 200%",
      }
    : {};

  const selectedStyle = isSelected
    ? isChartDarkMode()
      ? darkGradientStyle
      : gradientStyle
    : {};

  // Define border highlight style for target palaces
  let targetHighlightStyle = {};
  if (isTargetPalace && !isSelected && transformationType) {
    const borderColor = getTransformationBorderRgba(
      transformationType as TransformationType
    );

    targetHighlightStyle = {
      boxShadow: `0 0 0 2px ${borderColor}`,
    };
  }

  // Fixed style for user-highlighted palace with glow effect
  const daXianStyle =
    hasYellowGlow
      ? {
          backgroundImage:
            "linear-gradient(135deg, rgba(252, 211, 77, 0.7), rgba(251, 191, 36, 0.65))",
          // Don't set the box-shadow here, as it will be controlled by the animation
        }
      : {};

  // Combine all style properties with proper reset handling
  const combinedStyle = {
    ...selectedStyle,
    ...daXianStyle,
    ...(isSelected
      ? { boxShadow: chartBrandChrome.selectionGlow }
      : isTargetPalace
      ? targetHighlightStyle
      : hasYellowGlow
      ? {
          /* boxShadow already set in daXianStyle */
        }
      : isUserHighlighted
      ? {
          borderColor: chartBrandChrome.highlightBorderColor,
          borderWidth: "4px",
          borderStyle: "solid",
        }
      : { boxShadow: "none" }),
    transition: "all 0.3s ease",
  };

  const getTransformationModifierClass = (transformation: Transformation): string => {
    switch (transformation) {
      case "化祿":
        return "zwds-trans-lu";
      case "化權":
        return "zwds-trans-quan";
      case "化科":
        return "zwds-trans-ke";
      case "化忌":
        return "zwds-trans-ji";
      default:
        return "";
    }
  };

  const getTransformationTagClassName = (transformation: Transformation): string => {
    return `${chartPalaceTransformationTagClass} ${getTransformationModifierClass(transformation)}`.trim();
  };

  const getTransformationIconClassName = (transformation: Transformation): string => {
    return `zwds-palace-transformation-icon ${getTransformationModifierClass(transformation)} text-3xs xs:text-2xs sm:text-xs`;
  };

  const getTransformationLabel = (transformation: Transformation): string => {
    if (language === "en" && t(`zwds.transformations.${transformation}`)) {
      return t(`zwds.transformations.${transformation}`).split(" ")[0];
    }

    return transformation;
  };

  type StarRenderEntry = {
    key: string;
    star: Star;
    translationCategory: "minorStars" | "mainStars";
    isMain: boolean;
  };

  const buildStarRenderEntries = (): StarRenderEntry[] => {
    const entries: StarRenderEntry[] = [];

    palace.minorStars.forEach((star, starIndex) => {
      entries.push({
        key: `minor-${starIndex}`,
        star,
        translationCategory: "minorStars",
        isMain: false,
      });
    });

    (palace.mainStar ?? []).forEach((star, starIndex) => {
      entries.push({
        key: `main-${starIndex}`,
        star,
        translationCategory: "mainStars",
        isMain: true,
      });
    });

    return entries;
  };

  const splitStarEntriesForMobileRows = (
    entries: StarRenderEntry[]
  ): StarRenderEntry[][] => {
    if (entries.length <= 1) {
      return [entries];
    }

    const firstRowCount = Math.ceil(entries.length / 2);
    return [entries.slice(0, firstRowCount), entries.slice(firstRowCount)];
  };

  const renderTransformationTag = (
    transformation: Transformation,
    key: string,
    visibilityClass = ""
  ) => (
    <span
      key={key}
      className={`${visibilityClass} ${getTransformationTagClassName(transformation)}`}
    >
      {getTransformationLabel(transformation)}
    </span>
  );

  const renderSelfInfluenceIcon = (star: Star, visibilityClass = "") => {
    if (!star.selfInfluence || !chartSettings.selfInfluenceIcon) {
      return null;
    }

    return (
      <span className={`flex items-center justify-end ${visibilityClass}`}>
        <FaSyncAlt className={getTransformationIconClassName(star.selfInfluence[0])} />
      </span>
    );
  };

  const getMobileStarItemLayoutClass = (hasTags: boolean, hasRefresh: boolean): string => {
    if (hasTags && hasRefresh) {
      return chartPalaceMobileStarItemThreeColClass;
    }
    if (hasTags || hasRefresh) {
      return chartPalaceMobileStarItemTwoColClass;
    }
    return chartPalaceMobileStarItemSingleColClass;
  };

  const registerVisibleStarRef = (
    starName: string,
    element: HTMLDivElement | null,
    isDesktopBranch: boolean
  ) => {
    if (isDesktopChart === isDesktopBranch) {
      registerStarRef(palaceNumber, starName, element);
    }
  };

  const renderDesktopStarColumn = (entry: StarRenderEntry) => {
    const { key, star, translationCategory, isMain } = entry;
    const fontClass = isMain
      ? "font-medium font-semibold"
      : isSelected
      ? "font-medium"
      : star.brightness === "bright"
      ? "font-medium"
      : "";

    return (
      <div
        key={`${key}-desktop-${isDesktopChart ? "1" : "0"}`}
        className={`${chartPalaceStarColumnClass} ${fontClass}`}
        ref={(el) => registerVisibleStarRef(star.name, el, true)}
      >
        <span className={chartPalaceStarNameClass}>
          {translateStarName(star.name, translationCategory, language, t)}
        </span>
        {chartSettings.activationTags &&
          star.transformations?.map((transformation, transformationIndex) =>
            renderTransformationTag(
              transformation,
              `${key}-trans-${transformationIndex}`
            )
          )}
        {renderSelfInfluenceIcon(star, "mt-0.5")}
      </div>
    );
  };

  const renderMobileStarItem = (entry: StarRenderEntry) => {
    const { key, star, translationCategory, isMain } = entry;
    const hasTags =
      chartSettings.activationTags && (star.transformations?.length ?? 0) > 0;
    const hasRefresh = Boolean(
      star.selfInfluence && chartSettings.selfInfluenceIcon
    );
    const fontClass = isMain
      ? "font-semibold"
      : isSelected
      ? "font-medium"
      : star.brightness === "bright"
      ? "font-medium"
      : "";

    return (
      <div
        key={`${key}-mobile-${isDesktopChart ? "1" : "0"}`}
        className={`${chartPalaceMobileStarItemClass} ${getMobileStarItemLayoutClass(
          hasTags,
          hasRefresh
        )} ${fontClass}`}
        ref={(el) => registerVisibleStarRef(star.name, el, false)}
      >
        <span className={`${chartPalaceStarNameClass} min-w-0`}>
          {translateStarName(star.name, translationCategory, language, t)}
        </span>
        {hasTags ? (
          <div className="flex flex-wrap items-center justify-center gap-0.5">
            {star.transformations?.map((transformation, transformationIndex) =>
              renderTransformationTag(
                transformation,
                `${key}-mobile-trans-${transformationIndex}`,
                "inline-flex !mt-0"
              )
            )}
          </div>
        ) : null}
        {hasRefresh ? renderSelfInfluenceIcon(star) : null}
      </div>
    );
  };

  const renderStarList = () => {
    const starEntries = buildStarRenderEntries();
    const mobileRows = splitStarEntriesForMobileRows(starEntries);

    return (
      <>
        <div className={chartPalaceMobileStarsStackClass}>
          {mobileRows.map((rowEntries, rowIndex) => (
            <div
              key={`mobile-star-row-${rowIndex}`}
              className={chartPalaceMobileStarRowClass}
            >
              {rowEntries.map((entry) => renderMobileStarItem(entry))}
            </div>
          ))}
        </div>
        <div className={chartPalaceStarsRowClass}>
          {starEntries.map((entry) => renderDesktopStarColumn(entry))}
        </div>
      </>
    );
  };
  const handleMajorLimitClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disableInteraction) return;
    if (!chartSettings.daXianClickInteraction) return;
    if (palace.majorLimit) {
      handleDaXianClick(palaceNumber);
    }
  };

  const yearRowInteractive = chartSettings.yearAgeClickInteraction;
  const palaceNameInteractive = chartSettings.palaceNameClickInteraction;
  const majorLimitInteractive = chartSettings.daXianClickInteraction;

  // Compute bottom label: prefer Da Ming tag when available, otherwise palace name
  const resolvedPalaceName = (language === "en" && t(`zwds.palaces.${palace.name}`))
    ? t(`zwds.palaces.${palace.name}`)
    : palace.name;

  const bottomLabel =
    (chartSettings.showDaMingBottomLabel && palaceTag) ||
    (chartSettings.showSecondaryBottomLabel && (
      (language === "en" && secondaryPalaceName && t(`zwds.palaces.${secondaryPalaceName}`))
        ? t(`zwds.palaces.${secondaryPalaceName}`)
        : secondaryPalaceName
    )) ||
    resolvedPalaceName;

  const resolvedStem =
    language === "en" && t(`zwds.stems.${palace.heavenlyStem}`)
      ? t(`zwds.stems.${palace.heavenlyStem}`)
      : palace.heavenlyStem;

  const resolvedBranch =
    language === "en" && t(`zwds.branches.${palace.earthlyBranch}`)
      ? t(`zwds.branches.${palace.earthlyBranch}`)
      : palace.earthlyBranch;

  const yearHighlightClass = showAnnualFlow
    ? isSelected
      ? "zwds-palace-year-highlight text-red-300"
      : "zwds-palace-year-highlight text-red-600 dark:text-red-400"
    : "";

  const majorLimitClassName = majorLimitInteractive
    ? isSelected
      ? "text-white font-bold cursor-pointer"
      : isCurrentDaXian
        ? "zwds-palace-daxian-highlight text-amber-800 dark:text-amber-200 font-bold cursor-pointer"
        : "cursor-pointer hover:text-amber-700 dark:hover:text-amber-300"
    : "cursor-default";

  const renderStemBranchBlock = (
    className = "",
    layout: "stacked" | "inline" = "stacked"
  ) => {
    const labelClass = `${chartPalaceMetaClass} break-words whitespace-normal`;

    if (layout === "inline") {
      return (
        <div className={`${labelClass} ${className}`}>
          <span>{resolvedStem}</span> <span>{resolvedBranch}</span>
        </div>
      );
    }

    return (
      <div className={`flex flex-col items-start gap-0.5 ${labelClass} ${className}`}>
        <span>{resolvedStem}</span>
        <span>{resolvedBranch}</span>
      </div>
    );
  };

  const renderYearAgeBlock = (className = "") => (
    <div className={`flex flex-col items-center gap-0.5 ${chartPalaceMetaClass} ${className}`}>
      <div
        className={`${yearHighlightClass} ${
          yearRowInteractive ? "cursor-pointer hover:opacity-80" : "cursor-default"
        }`}
        onClick={(e) => {
          if (!yearRowInteractive) {
            e.stopPropagation();
            return;
          }
          handleYearClick(palaceNumber, e);
        }}
      >
        {palaceYear}
      </div>
      <div
        className={yearRowInteractive ? "cursor-pointer hover:opacity-80" : "cursor-default"}
        onClick={(e) => {
          if (!yearRowInteractive) {
            e.stopPropagation();
            return;
          }
          handleYearClick(palaceNumber, e);
        }}
      >
        {monthDisplay || getAgeAtYear(palaceYear)}
      </div>
    </div>
  );

  const shouldShowDaMingTag =
    Boolean(palaceTag) &&
    chartSettings.showDaMingCornerTag &&
    chartSettings.daXianClickInteraction;

  const renderDaMingTag = (placement: "title" | "mobile-row") => {
    if (!palaceTag) {
      return null;
    }

    return (
      <motion.div
        key={`palace-tag-${placement}-${selectedPalace}-${palaceNumber}`}
        className={`${chartPalaceDaMingTagClass} ${
          isSelected
            ? chartPalaceDaMingTagSelectedClass
            : chartPalaceDaMingTagDefaultClass
        }`}
        initial={{ opacity: 0, scale: 0.8, y: 4 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          boxShadow: isSelected
            ? [
                "0 1px 3px rgba(0, 0, 0, 0.12)",
                "0 2px 6px rgba(0, 0, 0, 0.1)",
                "0 1px 3px rgba(0, 0, 0, 0.12)",
              ]
            : [
                "0 0 0px rgba(107, 91, 149, 0.35)",
                "0 0 8px rgba(107, 91, 149, 0.25)",
                "0 0 0px rgba(107, 91, 149, 0.35)",
              ],
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
          delay: delay,
          boxShadow: {
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          },
        }}
      >
        {palaceTag}
      </motion.div>
    );
  };

  const shouldShowSecondaryOverlay =
    Boolean(secondaryPalaceName) && chartSettings.showSecondaryOverlayName;

  const renderSecondaryPalaceOverlay = (visibilityClass = "") => {
    if (!shouldShowSecondaryOverlay || !secondaryPalaceName) {
      return null;
    }

    const resolvedSecondaryName =
      language === "en" && t(`zwds.palaces.${secondaryPalaceName}`)
        ? t(`zwds.palaces.${secondaryPalaceName}`)
        : secondaryPalaceName;

    return (
      <div
        className={`${chartPalaceSecondaryNameClass} ${visibilityClass} ${
          isSelected ? "text-white/90" : ""
        }`}
      >
        {resolvedSecondaryName}
      </div>
    );
  };

  const renderFooterThirdCell = () => (
    <div
      className={chartPalaceFooterThirdCellClass}
      aria-hidden={!shouldShowSecondaryOverlay}
    >
      {renderSecondaryPalaceOverlay()}
    </div>
  );
  const hasFlowTags =
    (showAnnualFlow && chartSettings.liuNianTag) || isCurrentDaXian;

  const renderFlowTagPills = () => (
    <>
      {showAnnualFlow && chartSettings.liuNianTag && (
        <div
          className={`rounded-md px-1 py-0.5 text-[8px] font-semibold leading-tight xs:text-2xs sm:px-1.5 sm:text-xs ${
            isSelected
              ? "bg-orange-400/25 text-orange-100"
              : "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-200"
          }`}
        >
          {language === "en" ? "Liu Nian" : "流年"}
        </div>
      )}
      {isCurrentDaXian && (
        <div
          className={`rounded-md px-1 py-0.5 text-[8px] font-semibold leading-tight xs:text-2xs sm:px-1.5 sm:text-xs ${
            isSelected
              ? "bg-orange-400/20 text-amber-200"
              : "bg-orange-100 text-amber-600 dark:bg-orange-900/40 dark:text-amber-300"
          }`}
        >
          {language === "en" ? "Da Yun" : "大運"}
        </div>
      )}
    </>
  );

  const renderSecondaryPalaceOverlayMobile = () =>
    renderSecondaryPalaceOverlay("sm:hidden");

  const renderPalaceTitleBlock = (alignClass: string, withBadgeOffset = false) => (
    <div className={`flex w-full min-w-0 flex-col gap-0.5 ${alignClass}`}>
      <div className={chartPalaceTitleRowClass}>
        <div
          className={`${chartPalaceTitleClass} min-w-0 max-sm:w-full ${
            withBadgeOffset ? "sm:pl-11" : ""
          } ${
            palaceNameInteractive ? "cursor-pointer hover:opacity-80" : "cursor-default"
          }`}
          onClick={(e) => {
            if (!palaceNameInteractive) {
              e.stopPropagation();
              return;
            }
            handlePalaceNameClick(palaceNumber, e);
          }}
        >
          {bottomLabel}
        </div>
        {renderSecondaryPalaceOverlayMobile()}
        {shouldShowDaMingTag ? (
          <div className="hidden shrink-0 items-center justify-end sm:flex">
            {renderDaMingTag("title")}
          </div>
        ) : null}
      </div>
      {(palace.majorLimit || hasFlowTags) && (
        <div
          className={`mt-0.5 flex w-full min-w-0 items-center justify-between gap-1 ${
            withBadgeOffset ? "sm:pl-11" : ""
          }`}
        >
          {palace.majorLimit ? (
            <div
              className={`${chartPalaceSubtitleClass} ${majorLimitClassName} shrink-0`}
              onClick={handleMajorLimitClick}
            >
              {palace.majorLimit.startAge}-{palace.majorLimit.endAge}
            </div>
          ) : (
            <span aria-hidden="true" />
          )}
          {hasFlowTags && (
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-0.5">
              {renderFlowTagPills()}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      key={`palace-${palaceNumber}-${selectedPalace}`}
      className={`relative border ${hasYellowGlow ? "pulse-button" : ""} border-gray-100 dark:border-gray-700 p-0.5 xs:p-1 sm:p-2 md:p-3 h-full overflow-hidden min-h-[140px] xs:min-h-[180px] sm:min-h-[130px] md:min-h-[150px] ${
        isSelected
          ? "zwds-palace-selected bg-indigo-50/80 dark:bg-indigo-900/30 text-white"
          : hasYellowGlow
          ? "bg-gradient-to-br from-yellow-100 to-amber-300 dark:from-yellow-400/70 dark:to-amber-400/60"
          : chartPalaceCardClass
      } ${
        isSelected
          ? `ring-1 sm:ring-2 ${chartBrandChrome.selectionRingClass}`
          : isTargetPalace
          ? `ring-1 sm:ring-1 ${transformationBorderColor}`
          : hasYellowGlow
          ? "ring-2 ring-amber-400/80 dark:ring-amber-400/80"
          : ""
      }`}
      variants={palaceVariants}
      whileHover={isPdfExport ? undefined : "hover"}
      animate={isPdfExport ? false : (isSelected ? "pulse" : isTargetPalace ? "target" : "visible")}
      initial={isPdfExport ? false : "hidden"}
      style={combinedStyle}
      onClick={handleClick}
      ref={(el) => {
        if (palaceRefs.current) {
          palaceRefs.current[palaceNumber - 1] = el;
        }
      }}>
      {/* Zodiac watermark — bottom-right, faint tan line art */}
      {ZodiacIcon && (
        <div
          className={`${chartPalaceWatermarkClass} ${
            hasYellowGlow && !isSelected ? "opacity-[0.42] dark:opacity-[0.46]" : ""
          }`}
        >
          <ZodiacIconWrapper
            Icon={ZodiacIcon}
            invertToWatermark
            className="h-full w-full"
          />
        </div>
      )}

      <style>
        {`
          .pulse-button {
            animation: pulse 2s infinite;
          }

          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(252, 211, 77, 0.7);
            }
            70% {
              box-shadow: 0 0 0 20px rgba(252, 211, 77, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(252, 211, 77, 0);
            }
          }
        `}
      </style>

      <div className={chartPalaceContentClass}>
        <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
          <div className={chartPalaceHeaderClass}>
            {PalaceBadgeIcon && (
              <div
                className={`absolute left-0 top-0 ${chartPalaceZodiacBadgeClass} ${
                  isSelected ? "bg-white/20" : ""
                }`}
              >
                <PalaceBadgeIcon
                  className={chartPalaceBadgeIconClass}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </div>
            )}
            {renderPalaceTitleBlock("items-start text-left", Boolean(PalaceBadgeIcon))}
          </div>

          <div className={chartPalaceStarsZoneClass}>
            {renderStarList()}
          </div>

          <div className="mt-auto w-full min-w-0 shrink-0">
            {shouldShowDaMingTag ? (
              <div className={chartPalaceDaMingMobileRowClass}>
                {renderDaMingTag("mobile-row")}
              </div>
            ) : null}
            <div className={`${chartPalaceFooterClass} px-0.5 pb-0.5`}>
              <div className={chartPalaceFooterStemCellClass}>
                {renderStemBranchBlock()}
              </div>
              <div className={chartPalaceFooterYearCellClass}>
                {renderYearAgeBlock()}
              </div>
              {renderFooterThirdCell()}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Palace;