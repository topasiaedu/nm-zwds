import { SUMMARY_ANALYSIS_CONSTANTS } from "../analysis_constants/summary_analysis";
import type { ChartData, Palace, Star } from "../types";

/**
 * Interface for summary analysis result
 */
export interface SummaryAnalysisResult {
  starName: string;
  description: string;
}

/**
 * Analyzes personality summary based on stars in the Life Palace (命宫)
 * If no stars are found in Life Palace, falls back to Migration Palace (迁移)
 * @param chartData - The calculated ZWDS chart data
 * @returns Array of summary analysis results containing star names and descriptions
 */
export function analyzeSummary(chartData: ChartData | null | undefined): SummaryAnalysisResult[] {
  if (!chartData || !chartData.palaces) {
    console.log("Summary analysis: No chart data or palaces found");
    return [];
  }

  // Find the Life Palace (命宫) position
  const lifePalacePosition = chartData.lifePalace;
  if (!lifePalacePosition || lifePalacePosition < 1 || lifePalacePosition > 12) {
    console.log("Summary analysis: Invalid Life Palace position");
    return [];
  }

  // Get the Life Palace (0-indexed array)
  const lifePalace = chartData.palaces[lifePalacePosition - 1];
  if (!lifePalace || lifePalace.name !== "命宫") {
    console.log("Summary analysis: Life Palace not found or has incorrect name");
    return [];
  }

  // Find all stars in the Life Palace (both main and minor)
  let stars: Set<string> = new Set();

  /**
   * Collect star names from a palace's star collections.
   */
  const collectStarsFromPalace = (palace: Palace): Set<string> => {
    const palaceStars: Set<string> = new Set();
    
    // Add main stars if available
    if (palace.mainStar && Array.isArray(palace.mainStar)) {
      const mainStarNames = palace.mainStar.map((star: Star) => star.name);
      mainStarNames.forEach((star: string) => {
        // Ensure we only use the main star name (some might have suffixes)
        const mainStarName = star.split("_")[0].trim();
        palaceStars.add(mainStarName);
      });
    }
    
    // Add minor stars if available
    if (palace.minorStars && Array.isArray(palace.minorStars)) {
      const minorStarNames = palace.minorStars.map((star: Star) => star.name);
      minorStarNames.forEach((star: string) => {
        // Ensure we only use the star name (some might have suffixes)
        const starName = star.split("_")[0].trim();
        palaceStars.add(starName);
      });
    }
    
    // Add auxiliary stars if available
    if (palace.auxiliaryStars && Array.isArray(palace.auxiliaryStars)) {
      const auxStarNames = palace.auxiliaryStars.map((star: Star) => star.name);
      auxStarNames.forEach((star: string) => {
        const starName = star.split("_")[0].trim();
        palaceStars.add(starName);
      });
    }
    
    return palaceStars;
  };
  
  // Get stars from Life Palace
  stars = collectStarsFromPalace(lifePalace);
  
  // If no stars found in Life Palace, check Migration Palace (迁移)
  if (stars.size === 0) {
    console.log("Summary analysis: No stars found in Life Palace, checking Migration Palace");
    // Find Migration Palace
    const migrationPalace = chartData.palaces.find((palace: Palace) => palace.name === "迁移");
    
    if (migrationPalace) {
      stars = collectStarsFromPalace(migrationPalace);
      if (stars.size > 0) {
        console.log("Summary analysis: Found stars in Migration Palace");
      } else {
        console.log("Summary analysis: No stars found in Migration Palace either");
      }
    } else {
      console.log("Summary analysis: Migration Palace not found");
    }
  }
  
  if (stars.size === 0) {
    console.log("Summary analysis: No stars found in relevant palaces");
    return [];
  }
  
  // Get personality summaries based on stars in Life Palace
  const summaries: SummaryAnalysisResult[] = [];
  
  stars.forEach(starName => {
    const description = SUMMARY_ANALYSIS_CONSTANTS[starName as keyof typeof SUMMARY_ANALYSIS_CONSTANTS];
    if (description) {
      summaries.push({
        starName,
        description
      });
    } else {
      console.log(`Summary analysis: No matching description found for star ${starName}`);
    }
  });

  return summaries;
} 