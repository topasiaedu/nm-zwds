import { WATCHOUT_ANALYSIS_CONSTANTS } from "../analysis_constants/watchout_analysis";
import { getStarsInPalace } from "./palaceUtils";
import type { ChartData } from "../types";

/**
 * Types for the watchout analysis constants
 */
type PalaceName = keyof typeof WATCHOUT_ANALYSIS_CONSTANTS;

/**
 * Interface for watchout result with star and warning information
 */
export interface WatchoutResult {
  /** The palace name where the star is located */
  palace: string;
  /** The star name */
  star: string;
  /** The warning message for this star in this palace */
  warning: string;
}

/**
 * Analyzes potential issues to watch out for based on stars in chart's key palaces
 * @param chartData - The calculated ZWDS chart data
 * @returns Array of watchout results with warnings based on stars and palaces
 */
export function analyzeWatchouts(chartData: ChartData | null | undefined): WatchoutResult[] {
  if (!chartData || !chartData.palaces) {
    console.log("Watchout analysis: No chart data or palaces found");
    return [];
  }

  const watchoutResults: WatchoutResult[] = [];
  
  // Get all palaces that have watchout constants defined
  const relevantPalaceNames = Object.keys(WATCHOUT_ANALYSIS_CONSTANTS) as PalaceName[];
  
  // Process each palace that has watchout data
  for (const palaceName of relevantPalaceNames) {
    // Get all stars in this palace using the utility function
    const starsInPalace = getStarsInPalace(chartData, palaceName);
    
    if (starsInPalace.length === 0) {
      console.log(`Watchout analysis: No stars found in palace ${palaceName}`);
      continue;
    }
    
    // Get the watchout constants for this palace
    const palaceConstants = WATCHOUT_ANALYSIS_CONSTANTS[palaceName];
    
    // Check each star against the watchout constants
    for (const starPosition of starsInPalace) {
      const starName = starPosition.star;
      // Get the basic star name (without any modifiers)
      const basicStarName = starName.split("_")[0].trim();
      
      // Use type assertion to check if star name exists in the constants
      if (Object.keys(palaceConstants).includes(basicStarName)) {
        const warning = palaceConstants[basicStarName as keyof typeof palaceConstants];
        
        if (warning) {
          watchoutResults.push({
            palace: palaceName,
            star: basicStarName,
            warning
          });
        }
      }
    }
  }
  
  return watchoutResults;
} 