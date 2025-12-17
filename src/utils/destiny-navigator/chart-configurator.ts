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
  getCurrentLiuNianPalace
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
 * @returns Chart configuration object with all necessary props
 */
export function getChartConfigForSelection(
  aspect: LifeAspect,
  timeframe: TimeFrame,
  chartData: ChartData
): ChartConfig {
  switch (timeframe) {
    case "natal":
      return getNatalConfig(aspect, chartData);
    case "dayun":
      return getDayunConfig(aspect, chartData);
    case "liunian":
      return getLiuNianConfig(aspect, chartData);
    case "liumonth":
      return getLiuMonthConfig(aspect, chartData);
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
 * Dayun (Decade Cycle) configuration
 * Shows Da Ming tags based on current 10-year cycle
 * Highlights the aspect palace in the Dayun context
 */
function getDayunConfig(aspect: LifeAspect, chartData: ChartData): ChartConfig {
  const dayunPalace = getCurrentDayunPalace(chartData);
  const palaceNumber = getPalaceForAspectDayun(aspect, chartData);

  return {
    selectedPalaceControlled: palaceNumber,
    selectedDaXianControlled: dayunPalace,  // This triggers Da Ming tags
    selectedPalaceNameControlled: null,
    showMonthsForPalace: null,
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
 */
function getLiuMonthConfig(aspect: LifeAspect, chartData: ChartData): ChartConfig {
  const liuNianPalace = getCurrentLiuNianPalace(chartData);
  const palaceNumber = getPalaceForAspectLiuMonth(aspect, chartData);

  return {
    selectedPalaceControlled: palaceNumber,
    selectedDaXianControlled: null,
    selectedPalaceNameControlled: liuNianPalace,
    showMonthsForPalace: liuNianPalace,  // This triggers month display
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
      showSecondaryOverlayName: true
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
