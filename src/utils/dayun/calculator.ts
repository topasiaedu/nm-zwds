/**
 * Dayun (大运) Calculator
 * 
 * Calculates which 10-year cycle (Dayun) a person is currently in,
 * based on their ZWDS chart and current age.
 */

import type { ChartData, Palace } from "../zwds/types";
import type { DayunCycleExtended, DayunPhase, DayunSeason } from "../../types/dayun";
import {
  palaceToSeason,
  getEnglishPalaceName,
  getSeasonTitle,
  getSeasonMessage,
} from "./seasonMapper";

/**
 * Calculate current age from birth year
 * 
 * @param birthYear - Year of birth
 * @param currentYear - Current year (defaults to current year)
 * @returns Current age
 */
export function calculateAge(birthYear: number, currentYear?: number): number {
  const year = currentYear || new Date().getFullYear();
  return year - birthYear;
}

/**
 * Find the palace that corresponds to the current Dayun cycle
 * 
 * @param chartData - Complete chart data from ZWDS calculation
 * @param currentAge - Person's current age
 * @returns The palace for the current Dayun cycle, or null if not found
 */
export function findCurrentDayunPalace(
  chartData: ChartData,
  currentAge: number
): Palace | null {
  // Find the palace whose majorLimit contains the current age
  const dayunPalace = chartData.palaces.find((palace) => {
    if (!palace.majorLimit) {
      return false;
    }
    return (
      currentAge >= palace.majorLimit.startAge &&
      currentAge <= palace.majorLimit.endAge
    );
  });

  return dayunPalace || null;
}

/**
 * Find previous and next Dayun palaces
 * 
 * @param chartData - Complete chart data
 * @param currentPalace - Current Dayun palace
 * @param currentAge - Current age for calculating year ranges
 * @returns Object with previous and next palace info
 */
function findAdjacentCycles(
  chartData: ChartData,
  currentPalace: Palace,
  currentAge: number
): {
  previous: { years: string; season: DayunSeason; palace: string } | undefined;
  next: { years: string; season: DayunSeason; palace: string } | undefined;
} {
  // Find all palaces with majorLimit and sort by age
  const allPalaces = chartData.palaces
    .filter(p => p.majorLimit)
    .sort((a, b) => a.majorLimit!.startAge - b.majorLimit!.startAge);

  const currentStartAge = currentPalace.majorLimit?.startAge || 0;
  const currentEndAge = currentPalace.majorLimit?.endAge || 0;

  // Find immediate previous cycle (latest one before current)
  const previousPalace = allPalaces
    .filter(p => p.majorLimit!.endAge < currentStartAge)
    .sort((a, b) => b.majorLimit!.startAge - a.majorLimit!.startAge)[0];

  // Find immediate next cycle (earliest one after current)
  const nextPalace = allPalaces
    .filter(p => p.majorLimit!.startAge > currentEndAge)
    .sort((a, b) => a.majorLimit!.startAge - b.majorLimit!.startAge)[0];

  // Birth year is stored in chartData.input.year
  const birthYear = chartData.input.year;

  return {
    previous: previousPalace
      ? {
          years: `${birthYear + previousPalace.majorLimit!.startAge}-${birthYear + previousPalace.majorLimit!.endAge}`,
          season: palaceToSeason(previousPalace.name),
          palace: getEnglishPalaceName(previousPalace.name),
        }
      : undefined,
    next: nextPalace
      ? {
          years: `${birthYear + nextPalace.majorLimit!.startAge}-${birthYear + nextPalace.majorLimit!.endAge}`,
          season: palaceToSeason(nextPalace.name),
          palace: getEnglishPalaceName(nextPalace.name),
        }
      : undefined,
  };
}

/**
 * Determine which phase of the 10-year cycle the person is in
 * 
 * Years 1-3: Building phase (foundation)
 * Years 4-6: Peak phase (maximum energy)
 * Years 7-10: Integration phase (consolidation)
 * 
 * @param currentAge - Person's current age
 * @param startAge - Starting age of the Dayun cycle
 * @returns The current phase
 */
function determinePhase(currentAge: number, startAge: number): DayunPhase {
  const yearInCycle = currentAge - startAge + 1;

  if (yearInCycle >= 1 && yearInCycle <= 3) {
    return "building";
  } else if (yearInCycle >= 4 && yearInCycle <= 6) {
    return "peak";
  } else {
    return "integration";
  }
}

/**
 * Calculate the complete current Dayun cycle with all details
 * 
 * @param chartData - Complete chart data from ZWDS calculation
 * @param currentYear - Current year (defaults to current year)
 * @returns Complete Dayun cycle information, or null if not found
 */
export function calculateCurrentDayunCycle(
  chartData: ChartData,
  currentYear?: number
): DayunCycleExtended | null {
  const year = currentYear || new Date().getFullYear();
  const currentAge = calculateAge(chartData.input.year, year);

  // Find the current Dayun palace
  const dayunPalace = findCurrentDayunPalace(chartData, currentAge);

  if (!dayunPalace?.majorLimit) {
    return null;
  }

  // Calculate years
  const birthYear = chartData.input.year;
  const startYear = birthYear + dayunPalace.majorLimit.startAge;
  const endYear = birthYear + dayunPalace.majorLimit.endAge;

  // Get season information
  const season = palaceToSeason(dayunPalace.name);
  const seasonTitle = getSeasonTitle(season);
  const coreMessage = getSeasonMessage(season);

  // Find adjacent cycles
  const { previous, next } = findAdjacentCycles(chartData, dayunPalace, currentAge);

  // Determine current phase
  const phase = determinePhase(currentAge, dayunPalace.majorLimit.startAge);

  // Get English palace name
  const palaceEnglish = getEnglishPalaceName(dayunPalace.name);

  // Build the complete cycle object
  const dayunCycle: DayunCycleExtended = {
    startYear,
    endYear,
    currentYear: year,
    palace: palaceEnglish,
    palaceChinese: dayunPalace.name,
    season,
    seasonTitle,
    coreMessage,
    keyActions: [], // Will be populated by guidance generator
    watchOut: [], // Will be populated by guidance generator
    previousCycle: previous,
    nextCycle: next,
    successMetrics: [], // Will be populated by guidance generator
    reflectionQuestions: [], // Will be populated by guidance generator
    phase,
  };

  return dayunCycle;
}

/**
 * Check if a person is in the last few years of their Dayun cycle
 * 
 * @param chartData - Complete chart data
 * @param currentYear - Current year
 * @param threshold - Number of years to consider "last few years" (default: 3)
 * @returns true if in the last few years of the cycle
 */
export function isInLastYearsOfCycle(
  chartData: ChartData,
  currentYear?: number,
  threshold: number = 3
): boolean {
  const year = currentYear || new Date().getFullYear();
  const currentAge = calculateAge(chartData.input.year, year);
  const dayunPalace = findCurrentDayunPalace(chartData, currentAge);

  if (!dayunPalace?.majorLimit) {
    return false;
  }

  const yearsRemaining = dayunPalace.majorLimit.endAge - currentAge;
  return yearsRemaining < threshold;
}

/**
 * Get the year number within the current 10-year cycle (1-10)
 * 
 * @param chartData - Complete chart data
 * @param currentYear - Current year
 * @returns Year number within cycle (1-10), or null if not found
 */
export function getYearInCycle(
  chartData: ChartData,
  currentYear?: number
): number | null {
  const year = currentYear || new Date().getFullYear();
  const currentAge = calculateAge(chartData.input.year, year);
  const dayunPalace = findCurrentDayunPalace(chartData, currentAge);

  if (!dayunPalace?.majorLimit) {
    return null;
  }

  return currentAge - dayunPalace.majorLimit.startAge + 1;
}
