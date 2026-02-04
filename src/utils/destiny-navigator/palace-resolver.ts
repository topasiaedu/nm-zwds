/**
 * Palace Resolution Utilities
 * Functions to find and map palaces based on aspects, timeframes, and chart data
 */

import { ChartData } from "../zwds/types";
import { LifeAspect } from "../../types/destiny-navigator";
import { PALACE_NAMES } from "../zwds/constants";

/**
 * Palace name to month index mapping (0 = January, 11 = December).
 * Palace 10's natal name determines the starting month.
 */
const PALACE_TO_MONTH_INDEX: Record<string, number> = {
  "命宫": 0,
  "兄弟": 1,
  "夫妻": 2,
  "子女": 3,
  "财帛": 4,
  "疾厄": 5,
  "迁移": 6,
  "交友": 7,
  "官禄": 8,
  "田宅": 9,
  "福德": 10,
  "父母": 11
};

/**
 * Build secondary palace names based on a selected palace.
 * When a palace is selected (e.g., Dayun palace), all 12 palaces get
 * secondary names based on their distance from the selected palace.
 *
 * @param selectedPalaceNumber - The palace number that becomes "命宫" (1-12)
 * @returns Array of 12 secondary palace names where index 0 = palace 1's secondary name
 *
 * @example
 * If palace 5 is selected:
 * - Palace 5 gets "命宫" (distance 0)
 * - Palace 4 gets "兄弟" (distance 1)
 * - Palace 3 gets "夫妻" (distance 2)
 * etc., wrapping around the 12-palace cycle
 */
function buildSecondaryPalaceNames(selectedPalaceNumber: number): string[] {
  // Validate palace number input to prevent invalid indexing.
  if (!Number.isFinite(selectedPalaceNumber) || selectedPalaceNumber < 1 || selectedPalaceNumber > 12) {
    throw new TypeError(`Invalid palace number: ${selectedPalaceNumber}. Must be between 1 and 12.`);
  }

  // Build the secondary name list for all 12 palaces.
  const secondaryNames: string[] = Array.from({ length: 12 }, (_unused, idx) => {
    const palaceNumber = idx + 1;

    // Calculate distance from selected palace, wrapping around the 12-palace cycle.
    let distance = selectedPalaceNumber - palaceNumber;
    if (distance < 0) {
      distance += 12;
    }

    // Use the distance as an index into the palace names array.
    return PALACE_NAMES[distance];
  });

  return secondaryNames;
}

/**
 * Find the palace that represents the current Dayun (10-year cycle)
 * based on the person's current age.
 *
 * The Dayun palace is determined by which palace's majorLimit range
 * contains the current age.
 *
 * @param chartData - Complete chart data
 * @param currentAge - Person's current age
 * @returns Palace number (1-12) of current Dayun, or null if not found
 */
function findCurrentDayunPalace(chartData: ChartData, currentAge: number): number | null {
  // Validate age input to avoid invalid comparisons.
  if (!Number.isFinite(currentAge) || currentAge < 0) {
    return null;
  }

  // Find the palace whose majorLimit range contains the current age.
  const dayunPalace = chartData.palaces.find((palace) => {
    if (!palace.majorLimit) {
      return false;
    }
    return currentAge >= palace.majorLimit.startAge && currentAge <= palace.majorLimit.endAge;
  });

  return dayunPalace?.number ?? null;
}

/**
 * Find the palace that represents the next Dayun (10-year cycle)
 * based on the person's current age.
 *
 * The next Dayun palace is determined by finding the palace whose
 * majorLimit.startAge is the smallest value greater than currentAge.
 *
 * @param chartData - Complete chart data
 * @param currentAge - Person's current age
 * @returns Palace number (1-12) of next Dayun, or null if not found
 */
function findNextDayunPalace(chartData: ChartData, currentAge: number): number | null {
  // Validate age input to avoid invalid comparisons.
  if (!Number.isFinite(currentAge) || currentAge < 0) {
    return null;
  }

  // Track the nearest future palace by smallest startAge.
  let nextDayunPalace: ChartData["palaces"][number] | null = null;
  let nearestStartAge = Number.POSITIVE_INFINITY;

  // Walk all palaces and find the nearest future startAge.
  for (const palace of chartData.palaces) {
    const startAgeValue = palace.majorLimit?.startAge;
    if (typeof startAgeValue !== "number" || !Number.isFinite(startAgeValue) || startAgeValue <= currentAge) {
      continue;
    }

    if (startAgeValue < nearestStartAge) {
      nearestStartAge = startAgeValue;
      nextDayunPalace = palace;
    }
  }

  return nextDayunPalace?.number ?? null;
}

/**
 * Calculate current age from birth year.
 *
 * @param birthYear - Year of birth from chartData.input.year
 * @param currentYear - Current year (defaults to current year)
 * @returns Current age
 */
function calculateCurrentAge(birthYear: number, currentYear?: number): number {
  // Validate input years to ensure consistent age calculations.
  if (!Number.isFinite(birthYear)) {
    throw new TypeError(`Invalid birth year: ${birthYear}. Must be a finite number.`);
  }

  if (currentYear !== undefined && !Number.isFinite(currentYear)) {
    throw new TypeError(`Invalid current year: ${currentYear}. Must be a finite number.`);
  }

  // Use the provided current year or default to the system current year.
  const year = currentYear ?? new Date().getFullYear();
  return year - birthYear;
}

/**
 * Find the palace that matches the given annual flow year.
 *
 * @param chartData - Complete chart data
 * @param targetYear - Year to find in annualFlow
 * @returns Palace number (1-12) or null if not found
 */
function findPalaceWithYear(chartData: ChartData, targetYear: number): number | null {
  // Validate year input to avoid invalid comparisons.
  if (!Number.isFinite(targetYear)) {
    console.warn("Invalid target year for Liu Month:", targetYear);
    return null;
  }

  // Find the palace whose annual flow matches the target year.
  const palace = chartData.palaces.find((p) => p.annualFlow?.year === targetYear);
  return palace?.number ?? null;
}

/**
 * Calculate the month index (0-11) shown by a palace in Liu Month mode.
 *
 * @param chartData - Complete chart data
 * @param yearPalaceNumber - Palace number that holds the target year
 * @param targetPalaceNumber - Palace number to evaluate for month index
 * @returns Month index (0-11) or null if invalid
 */
function getMonthIndexForPalace(
  chartData: ChartData,
  yearPalaceNumber: number,
  targetPalaceNumber: number
): number | null {
  // Validate palace numbers to ensure safe indexing.
  if (
    !Number.isFinite(yearPalaceNumber) ||
    !Number.isFinite(targetPalaceNumber) ||
    yearPalaceNumber < 1 ||
    yearPalaceNumber > 12 ||
    targetPalaceNumber < 1 ||
    targetPalaceNumber > 12
  ) {
    console.warn("Invalid palace numbers for Liu Month:", {
      yearPalaceNumber,
      targetPalaceNumber
    });
    return null;
  }

  // Palace 10 (index 9) defines the starting month.
  const bottomRightPalace = chartData.palaces[9];
  if (!bottomRightPalace) {
    console.warn("Missing Palace 10 data for Liu Month calculation.");
    return null;
  }

  // Resolve the starting month index from Palace 10's natal name.
  const startingMonthIndex = PALACE_TO_MONTH_INDEX[bottomRightPalace.name];
  if (typeof startingMonthIndex !== "number") {
    console.warn("Invalid Palace 10 name for month mapping:", bottomRightPalace.name);
    return null;
  }

  // Calculate distance from year palace to the target palace.
  let distance = targetPalaceNumber - yearPalaceNumber;
  if (distance < 0) {
    distance += 12;
  }

  // Convert to month index using the starting month.
  return (startingMonthIndex + distance) % 12;
}

/**
 * Find which palace corresponds to the target month index.
 *
 * @param chartData - Complete chart data
 * @param yearPalaceNumber - Palace number that holds the target year
 * @param targetMonthIndex - Month index (0-11) to find
 * @returns Palace number (1-12) or null if not found
 */
function findPalaceWithMonthIndex(
  chartData: ChartData,
  yearPalaceNumber: number,
  targetMonthIndex: number
): number | null {
  // Validate month index to avoid invalid comparison.
  if (!Number.isFinite(targetMonthIndex) || targetMonthIndex < 0 || targetMonthIndex > 11) {
    console.warn("Invalid target month index for Liu Month:", targetMonthIndex);
    return null;
  }

  // Iterate through all palaces to find the matching month index.
  for (let palaceNumber = 1; palaceNumber <= 12; palaceNumber += 1) {
    const monthIndex = getMonthIndexForPalace(chartData, yearPalaceNumber, palaceNumber);
    if (monthIndex === targetMonthIndex) {
      return palaceNumber;
    }
  }

  console.warn("Could not find palace for month index:", targetMonthIndex);
  return null;
}

/**
 * Find palace number by Chinese palace name
 * @param palaceName - Chinese palace name (e.g., "官禄", "财帛")
 * @param chartData - Complete chart data
 * @returns Palace number (1-12) or null if not found
 */
export function findPalaceByName(palaceName: string, chartData: ChartData): number | null {
  const palace = chartData.palaces.find(p => p.name === palaceName);
  return palace ? palace.number : null;
}

/**
 * Get current Dayun (major limit) palace based on age
 * @param chartData - Complete chart data
 * @returns Palace number of current dayun cycle, or null if not found
 */
export function getCurrentDayunPalace(chartData: ChartData): number | null {
  const birthYear = chartData.lunarDate.year;
  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - birthYear + 1;

  const palace = chartData.palaces.find(p => {
    const startAge = p.majorLimit?.startAge;
    const endAge = p.majorLimit?.endAge;
    return startAge !== undefined && endAge !== undefined && 
           startAge <= currentAge && endAge >= currentAge;
  });

  return palace?.number ?? null;
}

/**
 * Get next Dayun (major limit) palace based on age
 * @param chartData - Complete chart data
 * @returns Palace number of next dayun cycle, or null if not found
 */
export function getNextDayunPalace(chartData: ChartData): number | null {
  const birthYear = chartData.lunarDate.year;
  if (!Number.isFinite(birthYear)) {
    console.warn("Invalid lunar birth year for next Dayun:", birthYear);
    return null;
  }

  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - birthYear + 1;

  // Track the nearest future palace by smallest startAge.
  let nextPalace: ChartData["palaces"][number] | null = null;
  let nearestStartAge = Number.POSITIVE_INFINITY;

  // Walk all palaces and find the nearest future startAge.
  for (const palace of chartData.palaces) {
    const startAgeValue = palace.majorLimit?.startAge;
    if (typeof startAgeValue !== "number" || !Number.isFinite(startAgeValue) || startAgeValue <= currentAge) {
      continue;
    }

    if (startAgeValue < nearestStartAge) {
      nearestStartAge = startAgeValue;
      nextPalace = palace;
    }
  }

  return nextPalace?.number ?? null;
}

/**
 * Get palace with current year's Liu Nian (annual flow) tag
 * @param chartData - Complete chart data
 * @returns Palace number with current year's annual flow, or null if not found
 */
export function getCurrentLiuNianPalace(chartData: ChartData): number | null {
  const currentYear = new Date().getFullYear();
  const palace = chartData.palaces.find(
    (p) => p.annualFlow?.year === currentYear
  );

  return palace?.number ?? null;
}

/**
 * Get the palace that represents a specific month in Liu Month mode.
 *
 * This is the palace that should be used as the anchor for secondary palace names
 * when analyzing Liu Month (the palace the user would click on to see its secondary name).
 *
 * @param chartData - Complete chart data
 * @param selectedMonth - Selected month (1-12)
 * @param selectedYear - Selected year (defaults to current year)
 * @returns Palace number representing that month, or null if not found
 */
export function getMonthPalaceForLiuMonth(
  chartData: ChartData,
  selectedMonth: number,
  selectedYear?: number
): number | null {
  // Validate selected month to prevent invalid indexing.
  if (!Number.isFinite(selectedMonth) || selectedMonth < 1 || selectedMonth > 12) {
    console.warn("Invalid selected month:", selectedMonth);
    return null;
  }

  // Resolve the target year, defaulting to the current year.
  const targetYear = selectedYear ?? new Date().getFullYear();

  // Find the palace that contains the target year.
  const yearPalaceNumber = findPalaceWithYear(chartData, targetYear);
  if (!yearPalaceNumber) {
    console.warn("Could not find palace for year:", targetYear);
    return null;
  }

  // Convert selected month (1-12) to index (0-11).
  const targetMonthIndex = selectedMonth - 1;

  // Find the palace that corresponds to the target month index.
  const monthPalaceNumber = findPalaceWithMonthIndex(
    chartData,
    yearPalaceNumber,
    targetMonthIndex
  );

  if (!monthPalaceNumber) {
    console.warn("Could not find palace for month:", selectedMonth);
    return null;
  }

  return monthPalaceNumber;
}

/**
 * Get the palace that contains a specific year's annual flow.
 *
 * This is the palace where months will be displayed (the year palace).
 *
 * @param chartData - Complete chart data
 * @param selectedYear - Selected year (defaults to current year)
 * @returns Palace number with that year's annual flow, or null if not found
 */
export function getYearPalaceForLiuMonth(
  chartData: ChartData,
  selectedYear?: number
): number | null {
  const targetYear = selectedYear ?? new Date().getFullYear();
  const yearPalaceNumber = findPalaceWithYear(chartData, targetYear);

  if (!yearPalaceNumber) {
    console.warn("Could not find palace for year:", targetYear);
    return null;
  }

  return yearPalaceNumber;
}

/**
 * Da Ming tag indices for each aspect (anticlockwise offset from Da Ming = 0)
 * Based on the 12 Da Ming tags: 大命, 大兄, 大夫, 大子, 大财, 大疾, 大迁, 大友, 大官, 大田, 大福, 大父
 */
export const DA_MING_TAG_INDICES: Record<LifeAspect, number> = {
  life: 0,          // Da Ming (大命) - Life palace in Dayun
  siblings: 1,      // Da Xiong (大兄) - Siblings palace in Dayun
  relationships: 2, // Da Fu (大夫) - Spouse palace in Dayun
  children: 3,      // Da Zi (大子) - Children palace in Dayun
  wealth: 4,        // Da Cai (大财) - Wealth palace in Dayun
  health: 5,        // Da Ji (大疾) - Health palace in Dayun
  travel: 6,        // Da Qian (大迁) - Travel palace in Dayun
  social: 7,        // Da You (大友) - Friends palace in Dayun
  career: 8,        // Da Guan (大官) - Career palace in Dayun
  home: 9,          // Da Tian (大田) - Property palace in Dayun
  fortune: 10,      // Da Fu (大福) - Fortune palace in Dayun
  parents: 11       // Da Fu (大父) - Parents palace in Dayun
};

/**
 * Calculate target palace from Da Xian using anticlockwise offset
 * Formula: target = (daXianPalace - tagIndex) mod 12
 * @param daXianPalace - The palace number where Da Xian starts (usually current Dayun palace)
 * @param tagIndex - The anticlockwise offset (0 = Da Ming, 1 = Da Xiong, etc.)
 * @returns Target palace number (1-12)
 */
export function getPalaceFromDaXian(daXianPalace: number, tagIndex: number): number {
  let target = daXianPalace - tagIndex;
  while (target <= 0) target += 12;
  while (target > 12) target -= 12;
  return target;
}

/**
 * Find palace by matching secondary palace name
 * When a palace is clicked in Liu Nian mode, secondary names are calculated anticlockwise
 * @param clickedPalace - The palace that was clicked (triggers secondary name display)
 * @param aspectPalaceName - The Chinese palace name we're looking for
 * @param chartData - Complete chart data
 * @returns Palace number whose secondary name matches the aspect, or null
 */
export function getPalaceBySecondaryName(
  clickedPalace: number,
  aspectPalaceName: string,
  chartData: ChartData
): number | null {
  // Find the index of the aspect palace name in the palace names array
  const targetIndex = PALACE_NAMES.indexOf(aspectPalaceName as typeof PALACE_NAMES[number]);
  if (targetIndex === -1) return null;

  // Calculate which palace's secondary name would match this
  // Secondary name for palace N is PALACE_NAMES[(clickedPalace - N) mod 12]
  // We need to solve: targetIndex = (clickedPalace - N) mod 12
  // Therefore: N = clickedPalace - targetIndex
  let targetPalace = clickedPalace - targetIndex;
  while (targetPalace <= 0) targetPalace += 12;
  while (targetPalace > 12) targetPalace -= 12;

  return targetPalace;
}

/**
 * Get palace number for a given aspect in natal mode
 * @param aspect - The life aspect
 * @param chartData - Complete chart data
 * @returns Palace number or null if not found
 */
export function getPalaceForAspectNatal(aspect: LifeAspect, chartData: ChartData): number | null {
  const palaceNameMap: Record<LifeAspect, string> = {
    life: "命宫",
    siblings: "兄弟",
    relationships: "夫妻",
    children: "子女",
    wealth: "财帛",
    health: "疾厄",
    travel: "迁移",
    social: "交友",
    career: "官禄",
    home: "田宅",
    fortune: "福德",
    parents: "父母"
  };

  const palaceName = palaceNameMap[aspect];
  return findPalaceByName(palaceName, chartData);
}

/**
 * Get palace number for a given aspect in Dayun mode
 * @param aspect - The life aspect
 * @param chartData - Complete chart data
 * @param dayunPeriod - Which Dayun period to analyze ("current" or "next")
 * @returns Palace number or null if not found
 */
export function getPalaceForAspectDayun(
  aspect: LifeAspect,
  chartData: ChartData,
  dayunPeriod: "current" | "next" = "current"
): number | null {
  // Calculate current age based on chart input birth year.
  const birthYear = chartData.input.year;
  const currentAge = calculateCurrentAge(birthYear);

  // Find Dayun palace based on the selected period.
  const dayunPalaceNumber = dayunPeriod === "next"
    ? findNextDayunPalace(chartData, currentAge)
    : findCurrentDayunPalace(chartData, currentAge);
  if (!dayunPalaceNumber) {
    console.warn(`Could not find ${dayunPeriod} Dayun palace for age:`, currentAge);
    return null;
  }

  // Build secondary palace names using the Dayun palace as "命宫".
  const secondaryNames = buildSecondaryPalaceNames(dayunPalaceNumber);

  // Map aspect to its palace name label.
  const palaceNameMap: Record<LifeAspect, string> = {
    life: "命宫",
    siblings: "兄弟",
    relationships: "夫妻",
    children: "子女",
    wealth: "财帛",
    health: "疾厄",
    travel: "迁移",
    social: "交友",
    career: "官禄",
    home: "田宅",
    fortune: "福德",
    parents: "父母"
  };

  const aspectPalaceName = palaceNameMap[aspect];

  // Find which palace has the matching secondary name.
  const targetPalaceIndex = secondaryNames.indexOf(aspectPalaceName);
  if (targetPalaceIndex === -1) {
    console.warn("Could not find palace with secondary name:", aspectPalaceName);
    return null;
  }

  // Convert 0-based index to 1-based palace number.
  return targetPalaceIndex + 1;
}

/**
 * Get palace number for a given aspect in Liu Nian mode
 *
 * Liu Nian Logic:
 * 1. Find which palace has annualFlow matching current year
 * 2. Build secondary palace names where Liu Nian palace = "命宫"
 * 3. Find which palace's secondary name matches the aspect
 *
 * @param aspect - The life aspect
 * @param chartData - Complete chart data
 * @returns Palace number or null if not found
 */
export function getPalaceForAspectLiuNian(aspect: LifeAspect, chartData: ChartData): number | null {
  // Find current year's Liu Nian palace.
  const liuNianPalaceNumber = getCurrentLiuNianPalace(chartData);
  if (!liuNianPalaceNumber) {
    console.warn("Could not find Liu Nian palace for current year");
    return null;
  }

  // Build secondary palace names using the Liu Nian palace as "命宫".
  const secondaryNames = buildSecondaryPalaceNames(liuNianPalaceNumber);

  // Map aspect to its palace name label.
  const palaceNameMap: Record<LifeAspect, string> = {
    life: "命宫",
    siblings: "兄弟",
    relationships: "夫妻",
    children: "子女",
    wealth: "财帛",
    health: "疾厄",
    travel: "迁移",
    social: "交友",
    career: "官禄",
    home: "田宅",
    fortune: "福德",
    parents: "父母"
  };

  const aspectPalaceName = palaceNameMap[aspect];

  // Find which palace has the matching secondary name.
  const targetPalaceIndex = secondaryNames.indexOf(aspectPalaceName);
  if (targetPalaceIndex === -1) {
    console.warn("Could not find palace with secondary name:", aspectPalaceName);
    return null;
  }

  // Convert 0-based index to 1-based palace number.
  return targetPalaceIndex + 1;
}

/**
 * Get palace number for a given aspect in Liu Month mode.
 * Resolves year palace, maps to month palace using Palace 10's natal name,
 * then finds the aspect via secondary palace names.
 *
 * @param aspect - The life aspect
 * @param chartData - Complete chart data
 * @param selectedMonth - Selected month (1-12)
 * @param selectedYear - Selected year (defaults to current year)
 * @returns Palace number or null if not found
 */
export function getPalaceForAspectLiuMonth(
  aspect: LifeAspect,
  chartData: ChartData,
  selectedMonth: number,
  selectedYear?: number
): number | null {
  // Validate selected month (1-12) to avoid invalid month mapping.
  if (!Number.isFinite(selectedMonth) || selectedMonth < 1 || selectedMonth > 12) {
    console.warn("Invalid selected month for Liu Month:", selectedMonth);
    return null;
  }

  // Resolve the target year, defaulting to the current year.
  const targetYear = selectedYear ?? new Date().getFullYear();

  // Find the palace that contains the target year.
  const yearPalaceNumber = findPalaceWithYear(chartData, targetYear);
  if (!yearPalaceNumber) {
    console.warn("Could not find palace for Liu Month year:", targetYear);
    return null;
  }

  // Convert selected month (1-12) to index (0-11).
  const targetMonthIndex = selectedMonth - 1;

  // Find the palace that corresponds to the target month index.
  const monthPalaceNumber = findPalaceWithMonthIndex(
    chartData,
    yearPalaceNumber,
    targetMonthIndex
  );
  if (!monthPalaceNumber) {
    console.warn("Could not find palace for Liu Month index:", targetMonthIndex);
    return null;
  }

  // Build secondary palace names using the month palace as "命宫".
  const secondaryNames = buildSecondaryPalaceNames(monthPalaceNumber);

  // Map aspect to its palace name label.
  const palaceNameMap: Record<LifeAspect, string> = {
    life: "命宫",
    siblings: "兄弟",
    relationships: "夫妻",
    children: "子女",
    wealth: "财帛",
    health: "疾厄",
    travel: "迁移",
    social: "交友",
    career: "官禄",
    home: "田宅",
    fortune: "福德",
    parents: "父母"
  };

  // Find which palace has the matching secondary name.
  const aspectPalaceName = palaceNameMap[aspect];
  const targetPalaceIndex = secondaryNames.indexOf(aspectPalaceName);
  if (targetPalaceIndex === -1) {
    console.warn("Could not find palace with secondary name:", aspectPalaceName);
    return null;
  }

  // Convert 0-based index to 1-based palace number.
  return targetPalaceIndex + 1;
}
