/**
 * Zodiac Mapper Utility
 * 
 * Maps earthly branches to Chinese zodiac animals and generates
 * relevant birth year examples.
 */

import type { ZodiacInfo } from "../../types/nobleman";
import { EARTHLY_BRANCHES } from "../zwds/constants";

/**
 * Earthly Branch to Zodiac mapping
 * Maps each of the 12 earthly branches to their corresponding zodiac animal
 */
export const EARTHLY_BRANCH_TO_ZODIAC: Record<string, { english: string; chinese: string }> = {
  "子": { english: "Rat", chinese: "鼠" },
  "丑": { english: "Ox", chinese: "牛" },
  "寅": { english: "Tiger", chinese: "虎" },
  "卯": { english: "Rabbit", chinese: "兔" },
  "辰": { english: "Dragon", chinese: "龍" },
  "巳": { english: "Snake", chinese: "蛇" },
  "午": { english: "Horse", chinese: "馬" },
  "未": { english: "Goat", chinese: "羊" },
  "申": { english: "Monkey", chinese: "猴" },
  "酉": { english: "Rooster", chinese: "雞" },
  "戌": { english: "Dog", chinese: "狗" },
  "亥": { english: "Pig", chinese: "豬" },
};

/**
 * Map earthly branch to zodiac information
 * 
 * @param earthlyBranch - Earthly branch character (e.g., "寅")
 * @returns Zodiac information with English and Chinese names
 */
export function mapEarthlyBranchToZodiac(earthlyBranch: string): ZodiacInfo {
  const zodiacData = EARTHLY_BRANCH_TO_ZODIAC[earthlyBranch];
  
  if (!zodiacData) {
    // Fallback for unknown branches
    return {
      english: "Unknown",
      chinese: "未知",
      branch: earthlyBranch,
    };
  }
  
  return {
    english: zodiacData.english,
    chinese: zodiacData.chinese,
    branch: earthlyBranch,
  };
}

/**
 * Generate 5 most recent years for a given earthly branch
 * 
 * The Chinese zodiac operates on a 12-year cycle. This function finds
 * the 5 most recent occurrences of the given zodiac year.
 * 
 * @param earthlyBranch - Earthly branch character (e.g., "寅" for Tiger)
 * @returns Array of 5 birth years in ascending order (e.g., [1974, 1986, 1998, 2010, 2022])
 */
export function generateRecentYears(earthlyBranch: string): number[] {
  const currentYear = new Date().getFullYear();
  
  // Find the index of this earthly branch (0-11)
  const branchIndex = EARTHLY_BRANCHES.indexOf(earthlyBranch as typeof EARTHLY_BRANCHES[number]);
  
  if (branchIndex === -1) {
    // If branch not found, return empty array
    return [];
  }
  
  // Chinese zodiac year calculation:
  // The year 4 CE was a 子 (Rat) year (index 0)
  // So year N corresponds to branch index: (N - 4) % 12
  // We need to find years where: (year - 4) % 12 === branchIndex
  
  // Find the most recent year for this branch that is <= current year
  let year = currentYear;
  while ((year - 4) % 12 !== branchIndex) {
    year--;
  }
  
  // Now generate 5 consecutive cycles going backwards
  const years: number[] = [];
  for (let i = 0; i < 5; i++) {
    years.unshift(year - (i * 12));
  }
  
  return years;
}

/**
 * Format year array as a comma-separated string
 * 
 * @param years - Array of years
 * @returns Formatted string (e.g., "1972, 1984, 1996, 2008, 2020")
 */
export function formatYearExamples(years: number[]): string {
  return years.join(", ");
}

/**
 * Get zodiac information with year examples
 * Convenience function that combines zodiac mapping and year generation
 * 
 * @param earthlyBranch - Earthly branch character
 * @returns Object with zodiac info and year examples
 */
export function getZodiacWithYears(earthlyBranch: string): {
  zodiac: ZodiacInfo;
  years: number[];
  yearsFormatted: string;
} {
  const zodiac = mapEarthlyBranchToZodiac(earthlyBranch);
  const years = generateRecentYears(earthlyBranch);
  const yearsFormatted = formatYearExamples(years);
  
  return {
    zodiac,
    years,
    yearsFormatted,
  };
}
