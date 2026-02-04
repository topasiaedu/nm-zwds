/**
 * Chart Configuration Generator
 * Generates chart props and settings based on aspect/timeframe selections
 */

import { ChartData } from "../zwds/types";
import { ChartSettings } from "../../context/ChartSettingsContext";
import { LifeAspect, TimeFrame } from "../../types/destiny-navigator";
import {
  getPalaceForAspectNatal,
  getPalaceForAspectDayun,
  getPalaceForAspectLiuNian,
  getPalaceForAspectLiuMonth,
  getCurrentDayunPalace,
  getNextDayunPalace,
  getCurrentLiuNianPalace,
  getMonthPalaceForLiuMonth,
  getYearPalaceForLiuMonth
} from "./palace-resolver";

/**
 * Chart configuration interface
 * Contains all props needed to control the ZWDSChart component
 */
export interface ChartConfig {
  /** The palace to highlight (1-12) */
  selectedPalaceControlled: number | null;
  /** The Da Xian palace for Da Ming tags (1-12) */
  selectedDaXianControlled: number | null;
  /** The palace for secondary name display (1-12) */
  selectedPalaceNameControlled: number | null;
  /** The palace to trigger month display (1-12) - for Liu Month mode */
  showMonthsForPalace: number | null;
  /** Simulated age for Dayun highlight (makes chart think user is this age) */
  simulatedAge?: number;
  /** Chart settings to apply */
  settings: Partial<ChartSettings>;
}

/**
 * Generate chart configuration based on user's aspect and timeframe selection
 * This is the main function that determines how the chart should be displayed
 * 
 * @param aspect - The life aspect selected by user
 * @param timeframe - The timeframe selected by user
 * @param chartData - Complete chart data for the profile
 * @param dayunPeriod - Which Dayun period to analyze (only used when timeframe is "dayun")
 * @param selectedMonth - Selected month (only used when timeframe is "liumonth")
 * @param selectedYear - Selected year (only used when timeframe is "liumonth")
 * @returns Chart configuration object with all necessary props
 */
export function getChartConfigForSelection(
  aspect: LifeAspect,
  timeframe: TimeFrame,
  chartData: ChartData,
  dayunPeriod?: "current" | "next",
  selectedMonth?: number,
  selectedYear?: number
): ChartConfig {
  switch (timeframe) {
    case "natal":
      return getNatalConfig(aspect, chartData);
    case "dayun":
      return getDayunConfig(aspect, chartData, dayunPeriod ?? "current");
    case "liunian":
      return getLiuNianConfig(aspect, chartData);
    case "liumonth":
      return getLiuMonthConfig(aspect, chartData, selectedMonth, selectedYear);
    default:
      return getDefaultConfig();
  }
}

/**
 * Natal (Core Blueprint) configuration
 * Shows the natal chart with the selected aspect palace highlighted
 * Clean view with transformation lines enabled
 */
function getNatalConfig(aspect: LifeAspect, chartData: ChartData): ChartConfig {
  const palaceNumber = getPalaceForAspectNatal(aspect, chartData);

  return {
    selectedPalaceControlled: palaceNumber,
    selectedDaXianControlled: null,
    selectedPalaceNameControlled: null,
    showMonthsForPalace: null,
    // No simulated age for natal view.
    simulatedAge: undefined,
    settings: {
      transformationLines: true,
      palaceClickInteraction: false,  // Locked - user can't change selection
      daXianClickInteraction: false,
      palaceNameClickInteraction: false,
      selfInfluenceIcon: true,
      liuNianTag: false,
      yearAgeClickInteraction: false,
      activationTags: true,
      showDaYunHighlight: false,
      showDaMingCornerTag: false,
      showDaMingBottomLabel: false,
      showSecondaryBottomLabel: false,
      showSecondaryOverlayName: false
    }
  };
}

/**
 * Resolve a simulated age for Dayun highlighting.
 *
 * Steps:
 * 1) Validate the palace index is a valid number within range.
 * 2) Resolve the palace data safely from chartData.
 * 3) Validate the majorLimit startAge and ensure it is finite.
 * 4) Return the validated startAge to shift the highlight.
 */
function getDayunSimulatedAge(
  chartData: ChartData,
  dayunPalace: number | null
): number | undefined {
  // Step 1: Validate palace index.
  if (
    typeof dayunPalace !== "number"
    || !Number.isInteger(dayunPalace)
    || dayunPalace < 1
    || dayunPalace > 12
  ) {
    return undefined;
  }

  // Step 2: Resolve palace data using the validated index.
  const palace = chartData.palaces[dayunPalace - 1];

  // Step 3: Validate startAge from majorLimit.
  const startAge = palace?.majorLimit?.startAge;
  if (typeof startAge !== "number" || !Number.isFinite(startAge)) {
    return undefined;
  }

  // Step 4: Return the validated age for highlight simulation.
  return startAge;
}

/**
 * Dayun (Decade Cycle) configuration
 * Shows Da Ming tags based on selected 10-year cycle (current or next)
 * Highlights the aspect palace in the Dayun context
 *
 * @param aspect - The life aspect selected by user
 * @param chartData - Complete chart data
 * @param dayunPeriod - Which Dayun period to analyze ("current" or "next")
 */
function getDayunConfig(
  aspect: LifeAspect,
  chartData: ChartData,
  dayunPeriod: "current" | "next"
): ChartConfig {
  // Resolve the correct Dayun palace based on the selected period.
  const dayunPalace = dayunPeriod === "next"
    ? getNextDayunPalace(chartData)
    : getCurrentDayunPalace(chartData);

  // Resolve the aspect palace using the selected Dayun period.
  const palaceNumber = getPalaceForAspectDayun(aspect, chartData, dayunPeriod);

  // Simulate the next Dayun age to shift the highlight when needed.
  const simulatedAge = dayunPeriod === "next"
    ? getDayunSimulatedAge(chartData, dayunPalace)
    : undefined;

  return {
    selectedPalaceControlled: palaceNumber,
    selectedDaXianControlled: dayunPalace,  // This triggers Da Ming tags
    selectedPalaceNameControlled: null,
    showMonthsForPalace: null,
    // Use simulated age only for next Dayun highlighting.
    simulatedAge,
    settings: {
      transformationLines: true,
      palaceClickInteraction: false,  // Locked
      daXianClickInteraction: true,   // Enables Da Ming tag display
      palaceNameClickInteraction: false,
      selfInfluenceIcon: true,
      liuNianTag: false,
      yearAgeClickInteraction: false,
      activationTags: true,
      showDaYunHighlight: true,       // Highlight current Dayun palace
      showDaMingCornerTag: true,      // Show Da Ming tags in corners
      showDaMingBottomLabel: true,    // Replace bottom label with Da Ming tag
      showSecondaryBottomLabel: false,
      showSecondaryOverlayName: false
    }
  };
}

/**
 * Liu Nian (Annual Forecast) configuration
 * Shows Liu Nian tags and secondary palace names
 * Highlights aspect palace in the current year's context
 */
function getLiuNianConfig(aspect: LifeAspect, chartData: ChartData): ChartConfig {
  const liuNianPalace = getCurrentLiuNianPalace(chartData);
  const palaceNumber = getPalaceForAspectLiuNian(aspect, chartData);

  return {
    selectedPalaceControlled: palaceNumber,
    selectedDaXianControlled: null,
    selectedPalaceNameControlled: liuNianPalace,  // This triggers secondary names
    showMonthsForPalace: null,
    // No simulated age for annual view.
    simulatedAge: undefined,
    settings: {
      transformationLines: true,
      palaceClickInteraction: false,  // Locked
      daXianClickInteraction: false,
      palaceNameClickInteraction: true,  // Enables secondary palace name display
      selfInfluenceIcon: true,
      liuNianTag: true,               // Show Liu Nian year tags
      yearAgeClickInteraction: false,
      activationTags: true,
      showDaYunHighlight: false,
      showDaMingCornerTag: false,
      showDaMingBottomLabel: false,
      showSecondaryBottomLabel: true,  // Replace bottom label with secondary name
      showSecondaryOverlayName: false   // Show secondary name overlay
    }
  };
}

/**
 * Liu Month (Monthly Rhythm) configuration
 * Same as Liu Nian but also shows months
 * Highlights aspect palace in the current year/month context
 *
 * @param aspect - The life aspect selected by user
 * @param chartData - Complete chart data
 * @param selectedMonth - Selected month (1-12), defaults to current month
 * @param selectedYear - Selected year, defaults to current year
 */
function getLiuMonthConfig(
  aspect: LifeAspect,
  chartData: ChartData,
  selectedMonth?: number,
  selectedYear?: number
): ChartConfig {
  const month = selectedMonth ?? (new Date().getMonth() + 1);
  const year = selectedYear ?? new Date().getFullYear();
  const palaceNumber = getPalaceForAspectLiuMonth(aspect, chartData, month, year);

  // Resolve year palace (month display) and month palace (secondary name anchor).
  const yearPalace = getYearPalaceForLiuMonth(chartData, year);
  const monthPalace = getMonthPalaceForLiuMonth(chartData, month, year);

  return {
    selectedPalaceControlled: palaceNumber,
    selectedDaXianControlled: null,
    selectedPalaceNameControlled: monthPalace,
    showMonthsForPalace: yearPalace,  // This triggers month display
    // No simulated age for monthly view.
    simulatedAge: undefined,
    settings: {
      transformationLines: true,
      palaceClickInteraction: false,  // Locked
      daXianClickInteraction: false,
      palaceNameClickInteraction: true,
      selfInfluenceIcon: true,
      liuNianTag: true,
      yearAgeClickInteraction: true,   // Enables month display when year is clicked
      activationTags: true,
      showDaYunHighlight: false,
      showDaMingCornerTag: false,
      showDaMingBottomLabel: false,
      showSecondaryBottomLabel: true,
      showSecondaryOverlayName: false
    }
  };
}

/**
 * Default configuration (fallback)
 * Returns a safe default when no specific configuration is needed
 */
function getDefaultConfig(): ChartConfig {
  return {
    selectedPalaceControlled: null,
    selectedDaXianControlled: null,
    selectedPalaceNameControlled: null,
    showMonthsForPalace: null,
    // No simulated age for default config.
    simulatedAge: undefined,
    settings: {
      transformationLines: false,
      palaceClickInteraction: false,
      daXianClickInteraction: false,
      palaceNameClickInteraction: false,
      selfInfluenceIcon: true,
      liuNianTag: false,
      yearAgeClickInteraction: false,
      activationTags: false,
      showDaYunHighlight: false,
      showDaMingCornerTag: false,
      showDaMingBottomLabel: false,
      showSecondaryBottomLabel: false,
      showSecondaryOverlayName: false
    }
  };
}
