/**
 * Configuration for timeframe selections in Destiny Navigator
 * Defines the temporal layers available for analysis
 */

import { TimeframeConfig } from "../../types/destiny-navigator";

/**
 * Array of all available timeframe periods with their configuration
 * Ordered from longest to shortest time span
 */
export const TIMEFRAME_CONFIGS: TimeframeConfig[] = [
  {
    key: "natal",
    label: "Core Blueprint",
    icon: "🔮",
    description: "Your innate destiny pattern from birth"
  },
  {
    key: "dayun",
    label: "Decade Cycle",
    icon: "🌊",
    description: "10-year life phases and major themes"
  },
  {
    key: "liunian",
    label: "Annual Forecast",
    icon: "🌙",
    description: "Current year influences and opportunities"
  },
  {
    key: "liumonth",
    label: "Monthly Rhythm",
    icon: "⭐",
    description: "Month-by-month energy patterns"
  }
];

/**
 * Get timeframe configuration by key
 * @param key - The timeframe key to look up
 * @returns The timeframe configuration or undefined if not found
 */
export const getTimeframeConfig = (key: string): TimeframeConfig | undefined => {
  return TIMEFRAME_CONFIGS.find(timeframe => timeframe.key === key);
};











