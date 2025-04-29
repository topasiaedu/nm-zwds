import { SUMMARY_ANALYSIS_CONSTANTS } from "../analysis_constants/summary_analysis";

/**
 * Interface for summary analysis result
 */
export interface SummaryAnalysisResult {
  starName: string;
  description: string;
}

/**
 * Analyzes personality summary based on stars in the Life Palace (命宫)
 * @param chartData - The calculated ZWDS chart data
 * @returns Array of summary analysis results containing star names and descriptions
 */
export function analyzeSummary(chartData: any): SummaryAnalysisResult[] {
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
  const stars: Set<string> = new Set();
  
  // Add main stars if available
  if (lifePalace.mainStar && Array.isArray(lifePalace.mainStar)) {
    const mainStarNames = lifePalace.mainStar.map((star: any) => star.name);
    mainStarNames.forEach((star: string) => {
      // Ensure we only use the main star name (some might have suffixes)
      const mainStarName = star.split("_")[0].trim();
      stars.add(mainStarName);
    });
  }
  
  // Add minor stars if available
  if (lifePalace.minorStars && Array.isArray(lifePalace.minorStars)) {
    const minorStarNames = lifePalace.minorStars.map((star: any) => star.name);
    minorStarNames.forEach((star: string) => {
      // Ensure we only use the star name (some might have suffixes)
      const starName = star.split("_")[0].trim();
      stars.add(starName);
    });
  }
  
  // Add auxiliary stars if available
  if (lifePalace.auxiliaryStars && Array.isArray(lifePalace.auxiliaryStars)) {
    const auxStarNames = lifePalace.auxiliaryStars.map((star: any) => star.name);
    auxStarNames.forEach((star: string) => {
      const starName = star.split("_")[0].trim();
      stars.add(starName);
    });
  }
  
  if (stars.size === 0) {
    console.log("Summary analysis: No stars found in Life Palace");
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