import { HEALTH_ANALYSIS_CONSTANTS } from "./analysis_constants/health_analysis";
import { HEALTH_TIPS_CONSTANTS } from "./analysis_constants/health_tips";
import { ChartData, Star } from "./types";

/**
 * Interface for health analysis results
 */
export interface HealthAnalysisResult {
  affectedBodyParts: string[];
  healthTips: Array<{
    bodyPart: string;
    chineseName: string;
    englishName: string;
    description: string;
    associatedStars: string[];
  }>;
  starsInHealthPalace: string[];
  usedParentsPalace: boolean;
}

/**
 * Extracts all stars from a palace including main stars, minor stars, auxiliary stars, etc.
 */
const extractAllStarsFromPalace = (palace: any): Star[] => {
  const allStars: Star[] = [];
  
  // Add main stars
  if (palace.mainStar && Array.isArray(palace.mainStar)) {
    allStars.push(...palace.mainStar);
  }
  
  // Add body star if exists
  if (palace.bodyStar) {
    allStars.push(palace.bodyStar);
  }
  
  // Add life star if exists
  if (palace.lifeStar) {
    allStars.push(palace.lifeStar);
  }
  
  // Add minor stars
  if (palace.minorStars && Array.isArray(palace.minorStars)) {
    allStars.push(...palace.minorStars);
  }
  
  // Add auxiliary stars
  if (palace.auxiliaryStars && Array.isArray(palace.auxiliaryStars)) {
    allStars.push(...palace.auxiliaryStars);
  }
  
  // Add year stars
  if (palace.yearStars && Array.isArray(palace.yearStars)) {
    allStars.push(...palace.yearStars);
  }
  
  // Add month stars
  if (palace.monthStars && Array.isArray(palace.monthStars)) {
    allStars.push(...palace.monthStars);
  }
  
  // Add day stars
  if (palace.dayStars && Array.isArray(palace.dayStars)) {
    allStars.push(...palace.dayStars);
  }
  
  // Add hour stars
  if (palace.hourStars && Array.isArray(palace.hourStars)) {
    allStars.push(...palace.hourStars);
  }
  
  return allStars;
};

/**
 * Maps stars to affected body parts using HEALTH_ANALYSIS_CONSTANTS
 */
const mapStarsToBodyParts = (stars: Star[]): string[] => {
  const affectedParts = new Set<string>();
  
  stars.forEach(star => {
    const starName = star.name;
    const bodyParts = HEALTH_ANALYSIS_CONSTANTS[starName as keyof typeof HEALTH_ANALYSIS_CONSTANTS];
    
    if (bodyParts) {
      bodyParts.forEach(part => affectedParts.add(part));
    }
  });
  
  return Array.from(affectedParts);
};

/**
 * Gets health tips for the affected body parts
 */
const getHealthTipsForBodyParts = (bodyParts: string[]) => {
  return bodyParts.map(bodyPart => {
    const tipData = HEALTH_TIPS_CONSTANTS[bodyPart as keyof typeof HEALTH_TIPS_CONSTANTS];
    
    if (tipData) {
      return {
        bodyPart,
        chineseName: tipData.chinese_name,
        englishName: tipData.english_name,
        description: tipData.description,
        associatedStars: [...tipData.associated_stars],
      };
    }
    
    // Handle missing tip data gracefully
    console.warn(`Health Analysis: No health tips found for body part: ${bodyPart}`);
    return {
      bodyPart,
      chineseName: bodyPart,
      englishName: bodyPart,
      description: "No health information available for this body part.",
      associatedStars: [],
    };
  });
};

/**
 * Main function to analyze health based on chart data
 */
export const analyzeHealthFromChart = (chartData: ChartData): HealthAnalysisResult => {
  if (!chartData || !chartData.palaces) {
    throw new Error("Invalid chart data provided");
  }
  
  // Find the health palace (疾厄)
  const healthPalace = chartData.palaces.find(palace => palace.name === "疾厄");
  
  if (!healthPalace) {
    const palaceNames = chartData.palaces.map(p => p.name);
    console.error("Health Analysis: Available palace names:", palaceNames);
    throw new Error("Health palace (疾厄) not found in chart data");
  }
  
  // Extract stars from health palace
  let starsInPalace = extractAllStarsFromPalace(healthPalace);
  let usedParentsPalace = false;
  
  // If no stars in health palace, use parents palace (父母) as fallback
  if (starsInPalace.length === 0) {
    const parentsPalace = chartData.palaces.find(palace => palace.name === "父母");
    
    if (parentsPalace) {
      starsInPalace = extractAllStarsFromPalace(parentsPalace);
      usedParentsPalace = true;
    } else {
      console.warn("Health Analysis: No parents palace found for fallback");
    }
  }
  
  // Extract star names
  const starNames = starsInPalace.map(star => star.name);
  
  // Map stars to body parts
  const affectedBodyParts = mapStarsToBodyParts(starsInPalace);
  
  // Get health tips for affected body parts
  const healthTips = getHealthTipsForBodyParts(affectedBodyParts);
  
  const result: HealthAnalysisResult = {
    affectedBodyParts,
    healthTips,
    starsInHealthPalace: starNames,
    usedParentsPalace,
  };
  
  return result;
};

/**
 * Helper function to get stars in a specific palace by name
 */
export const getStarsInPalaceByName = (chartData: ChartData, palaceName: string): Star[] => {
  if (!chartData || !chartData.palaces) {
    return [];
  }
  
  const palace = chartData.palaces.find(p => p.name === palaceName);
  
  if (!palace) {
    return [];
  }
  
  return extractAllStarsFromPalace(palace);
}; 