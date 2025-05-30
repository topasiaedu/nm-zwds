import { ChartData, Star, Palace } from "../types";
import { OVERVIEW_DESCRIPTION_CONSTANTS } from "../analysis_constants/overview_description";
import { DATASET_1 } from "../analysis_constants";

/**
 * Type definitions for overview analysis results
 */
export type OverviewAnalysisResult = {
  descriptions: string[];
  strengths: string[];
  weaknesses: string[];
  quotes: string[];
};

/**
 * Extract all star names from a palace's various star arrays
 */
const extractStarNamesFromPalace = (palace: Palace): string[] => {
  const starNames: string[] = [];
  
  // Extract from main stars
  if (palace.mainStar) {
    starNames.push(...palace.mainStar.map(star => star.name));
  }
  
  // Extract from body star
  if (palace.bodyStar) {
    starNames.push(palace.bodyStar.name);
  }
  
  // Extract from life star
  if (palace.lifeStar) {
    starNames.push(palace.lifeStar.name);
  }
  
  // Extract from minor stars
  if (palace.minorStars) {
    starNames.push(...palace.minorStars.map(star => star.name));
  }
  
  // Extract from auxiliary stars
  if (palace.auxiliaryStars) {
    starNames.push(...palace.auxiliaryStars.map(star => star.name));
  }
  
  // Extract from time-based stars
  if (palace.yearStars) {
    starNames.push(...palace.yearStars.map(star => star.name));
  }
  
  if (palace.monthStars) {
    starNames.push(...palace.monthStars.map(star => star.name));
  }
  
  if (palace.dayStars) {
    starNames.push(...palace.dayStars.map(star => star.name));
  }
  
  if (palace.hourStars) {
    starNames.push(...palace.hourStars.map(star => star.name));
  }
  
  return starNames;
};

/**
 * Find a palace by name in the chart data
 */
const findPalaceByName = (chartData: ChartData, palaceName: string): Palace | null => {
  return chartData.palaces.find(palace => palace.name === palaceName) || null;
};

/**
 * Get star names from life palace, or travel palace as fallback
 */
const getRelevantStars = (chartData: ChartData): string[] => {
  // First try life palace (命宫)
  const lifePalace = findPalaceByName(chartData, "命宫");
  if (lifePalace) {
    const lifeStars = extractStarNamesFromPalace(lifePalace);
    if (lifeStars.length > 0) {
      return lifeStars;
    }
  }
  
  // Fallback to travel palace (迁移)
  const travelPalace = findPalaceByName(chartData, "迁移");
  if (travelPalace) {
    return extractStarNamesFromPalace(travelPalace);
  }
  
  return [];
};

/**
 * Get descriptions from OVERVIEW_DESCRIPTION_CONSTANTS for given star names
 */
const getDescriptions = (starNames: string[]): string[] => {
  const descriptions: string[] = [];
  
  starNames.forEach(starName => {
    const starData = OVERVIEW_DESCRIPTION_CONSTANTS[starName as keyof typeof OVERVIEW_DESCRIPTION_CONSTANTS];
    if (starData && starData.description) {
      descriptions.push(starData.description);
    }
  });
  
  return descriptions;
};

/**
 * Get strengths and weaknesses from DATASET_1 for given star names
 */
const getStrengthsAndWeaknesses = (starNames: string[]): { strengths: string[]; weaknesses: string[] } => {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  
  starNames.forEach(starName => {
    const starData = DATASET_1[starName as keyof typeof DATASET_1];
    if (starData && starData.命宫) {
      // Extract strengths
      if (starData.命宫.strengths) {
        if (typeof starData.命宫.strengths === "string") {
          // Split by common delimiters like "、" or "," or "/"
          const strengthList = starData.命宫.strengths.split(/[、，,\/]/).map(s => s.trim()).filter(s => s.length > 0);
          strengths.push(...strengthList);
        }
      }
      
      // Extract cautions (weakness)
      if (starData.命宫.cautions) {
        if (typeof starData.命宫.cautions === "string") {
          // Split by common delimiters
          const cautionList = starData.命宫.cautions.split(/[、，,\/]/).map(s => s.trim()).filter(s => s.length > 0);
          weaknesses.push(...cautionList);
        }
      }
    }
  });
  
  return { strengths, weaknesses };
};

/**
 * Get quotes from life, wealth, and career palaces
 */
const getQuotes = (chartData: ChartData): string[] => {
  const quotes: string[] = [];
  const palaceTypes = ["命宫", "财帛", "官禄"]; // life, wealth, career
  
  palaceTypes.forEach(palaceType => {
    const palace = findPalaceByName(chartData, palaceType);
    if (palace) {
      const starNames = extractStarNamesFromPalace(palace);
      
      starNames.forEach(starName => {
        const starData = DATASET_1[starName as keyof typeof DATASET_1];
        if (starData) {
          let quote = "";
          
          if (palaceType === "命宫" && starData.命宫 && starData.命宫.quote) {
            quote = starData.命宫.quote;
          } else if (palaceType === "财帛" && starData.财帛宫 && starData.财帛宫.quote) {
            quote = starData.财帛宫.quote;
          } else if (palaceType === "官禄" && starData.官禄宫 && starData.官禄宫.quote) {
            quote = starData.官禄宫.quote;
          }
          
          if (quote && !quotes.includes(quote)) {
            quotes.push(quote);
          }
        }
      });
    }
  });
  
  return quotes;
};

/**
 * Main function to analyze chart data for overview component
 */
export const analyzeOverview = (chartData: ChartData): OverviewAnalysisResult => {
  // Get relevant stars from life palace or travel palace as fallback
  const relevantStars = getRelevantStars(chartData);
  
  // Get descriptions
  const descriptions = getDescriptions(relevantStars);
  
  // Get strengths and weaknesses
  const { strengths, weaknesses } = getStrengthsAndWeaknesses(relevantStars);
  
  // Get quotes from life, wealth, and career palaces
  const quotes = getQuotes(chartData);
  
  return {
    descriptions,
    strengths,
    weaknesses,
    quotes,
  };
};

/**
 * Helper function to get debugging information about what stars were found
 */
export const getDebugInfo = (chartData: ChartData): { lifePalaceStars: string[]; travelPalaceStars: string[]; usedStars: string[] } => {
  const lifePalace = findPalaceByName(chartData, "命宫");
  const travelPalace = findPalaceByName(chartData, "迁移");
  
  const lifePalaceStars = lifePalace ? extractStarNamesFromPalace(lifePalace) : [];
  const travelPalaceStars = travelPalace ? extractStarNamesFromPalace(travelPalace) : [];
  const usedStars = getRelevantStars(chartData);
  
  return {
    lifePalaceStars,
    travelPalaceStars,
    usedStars,
  };
}; 