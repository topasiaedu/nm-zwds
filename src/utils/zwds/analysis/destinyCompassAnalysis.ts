import { ChartData, Palace, Star, Transformation } from "../types";
import { FOUR_TRANSFORMATIONS } from "../constants";
import { DESTINY_COMPASS_CONSTANTS } from "../analysis_constants/destiny_compass";
import { lunar } from "../../lunar";

/**
 * Type definition for a year's destiny compass data
 */
export type YearDestinyData = {
  year: number;
  age: number;
  activatedPalace: Palace;
  activations: {
    化祿: {
      starName: string;
      palaceNumber: number;
      palaceName: string;
      description: string;
    };
    化權: {
      starName: string;
      palaceNumber: number;
      palaceName: string;
      description: string;
    };
    化科: {
      starName: string;
      palaceNumber: number;
      palaceName: string;
      description: string;
    };
    化忌: {
      starName: string;
      palaceNumber: number;
      palaceName: string;
      description: string;
    };
  };
};

/**
 * Calculate user's current age based on their birth data using lunar calendar
 */
function calculateCurrentAge(birthYear: number, birthMonth: number, birthDay: number): number {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  
  // Convert birth date to lunar
  const lunarBirthDate = lunar.convertSolarToLunar(birthYear, birthMonth, birthDay);
  
  // Convert current date to lunar 
  const lunarCurrentDate = lunar.convertSolarToLunar(currentYear, currentDate.getMonth() + 1, currentDate.getDate());
  
  // Calculate age based on lunar years
  let age = lunarCurrentDate.year - lunarBirthDate.year;
  
  // Adjust if birthday hasn't occurred this lunar year
  if (lunarCurrentDate.month < lunarBirthDate.month || 
      (lunarCurrentDate.month === lunarBirthDate.month && lunarCurrentDate.day < lunarBirthDate.day)) {
    age--;
  }
  
  return age;
}

/**
 * Calculate which palace is activated for a given year
 */
function getActivatedPalaceForYear(year: number, chartData: ChartData): Palace {
  // Palace index 0 represents year 2025
  const baseYear = 2025;
  const yearOffset = year - baseYear;
  
  // Calculate palace index (0-11), wrapping around for years before/after the base cycle
  let palaceIndex = yearOffset % 12;
  if (palaceIndex < 0) {
    palaceIndex = 12 + palaceIndex; // Handle negative years
  }
  
  return chartData.palaces[palaceIndex];
}

/**
 * Find a star by name across all star arrays in all palaces
 */
function findStarInChart(starName: string, chartData: ChartData): { star: Star; palace: Palace } | null {
  for (const palace of chartData.palaces) {
    const allStars: Star[] = [
      ...(palace.mainStar || []),
      ...(palace.bodyStar ? [palace.bodyStar] : []),
      ...(palace.lifeStar ? [palace.lifeStar] : []),
      ...palace.minorStars,
      ...palace.auxiliaryStars,
      ...palace.yearStars,
      ...palace.monthStars,
      ...palace.dayStars,
      ...palace.hourStars,
    ];
    
    const foundStar = allStars.find(star => star.name === starName);
    if (foundStar) {
      return { star: foundStar, palace };
    }
  }
  
  return null;
}

/**
 * Get the four transformation stars for a given heavenly stem
 */
function getTransformationStars(heavenlyStem: string, chartData: ChartData) {
  const transformations = FOUR_TRANSFORMATIONS[heavenlyStem as keyof typeof FOUR_TRANSFORMATIONS];
  
  if (!transformations) {
    throw new Error(`No transformations found for heavenly stem: ${heavenlyStem}`);
  }
  
  const result = {
    化祿: findStarInChart(transformations.祿, chartData),
    化權: findStarInChart(transformations.權, chartData),
    化科: findStarInChart(transformations.科, chartData),
    化忌: findStarInChart(transformations.忌, chartData),
  };
  
  return result;
}

/**
 * Get description for a transformation activation
 */
function getActivationDescription(palaceNumber: number, transformationType: Transformation): string {
  const palaceData = DESTINY_COMPASS_CONSTANTS[palaceNumber.toString() as keyof typeof DESTINY_COMPASS_CONSTANTS];
  
  if (!palaceData) {
    return "Description not available for this palace.";
  }
  
  // Map traditional characters to simplified characters used in DESTINY_COMPASS_CONSTANTS
  const transformationMap: Record<Transformation, string> = {
    "化祿": "化禄",
    "化權": "化权",
    "化科": "化科",
    "化忌": "化忌",
  };
  
  const simplifiedTransformation = transformationMap[transformationType];
  const activation = palaceData.activations[simplifiedTransformation as keyof typeof palaceData.activations];
  
  if (!activation) {
    return "Description not available for this transformation.";
  }
  
  return activation.description;
}

/**
 * Generate destiny compass data for a specific year
 */
function generateYearDestinyData(year: number, chartData: ChartData): YearDestinyData {
  const { input } = chartData;
  const currentAge = calculateCurrentAge(input.year, input.month, input.day);
  const age = currentAge + (year - new Date().getFullYear());
  
  const activatedPalace = getActivatedPalaceForYear(year, chartData);
  const transformationStars = getTransformationStars(activatedPalace.heavenlyStem, chartData);
  
  const activations = {
    化祿: {
      starName: transformationStars.化祿?.star.name || "Unknown",
      palaceNumber: transformationStars.化祿?.palace.number || 0,
      palaceName: transformationStars.化祿?.palace.name || "Unknown",
      description: getActivationDescription(transformationStars.化祿?.palace.number || 0, "化祿"),
    },
    化權: {
      starName: transformationStars.化權?.star.name || "Unknown",
      palaceNumber: transformationStars.化權?.palace.number || 0,
      palaceName: transformationStars.化權?.palace.name || "Unknown",
      description: getActivationDescription(transformationStars.化權?.palace.number || 0, "化權"),
    },
    化科: {
      starName: transformationStars.化科?.star.name || "Unknown",
      palaceNumber: transformationStars.化科?.palace.number || 0,
      palaceName: transformationStars.化科?.palace.name || "Unknown",
      description: getActivationDescription(transformationStars.化科?.palace.number || 0, "化科"),
    },
    化忌: {
      starName: transformationStars.化忌?.star.name || "Unknown",
      palaceNumber: transformationStars.化忌?.palace.number || 0,
      palaceName: transformationStars.化忌?.palace.name || "Unknown",
      description: getActivationDescription(transformationStars.化忌?.palace.number || 0, "化忌"),
    },
  };
  
  return {
    year,
    age,
    activatedPalace,
    activations,
  };
}

/**
 * Generate destiny compass data for age range 18-100
 */
export function generateDestinyCompassData(chartData: ChartData): YearDestinyData[] {
  const { input } = chartData;
  const currentAge = calculateCurrentAge(input.year, input.month, input.day);
  const currentYear = new Date().getFullYear();
  
  const data: YearDestinyData[] = [];
  
  // Generate data for ages 18-100
  for (let age = 18; age <= 100; age++) {
    const year = currentYear + (age - currentAge);
    const yearData = generateYearDestinyData(year, chartData);
    data.push(yearData);
  }
  
  return data;
}

/**
 * Get debug information for development
 */
export function getDestinyCompassDebugInfo(chartData: ChartData) {
  const { input } = chartData;
  const currentAge = calculateCurrentAge(input.year, input.month, input.day);
  const currentYear = new Date().getFullYear();
  
  return {
    birthData: {
      year: input.year,
      month: input.month,
      day: input.day,
    },
    currentAge,
    currentYear,
    sampleYearCalculation: {
      year2025: getActivatedPalaceForYear(2025, chartData),
      year2026: getActivatedPalaceForYear(2026, chartData),
    },
  };
} 