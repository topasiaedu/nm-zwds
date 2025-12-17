/**
 * Palace Resolution Utilities
 * Functions to find and map palaces based on aspects, timeframes, and chart data
 */

import { ChartData } from "../zwds/types";
import { LifeAspect } from "../../types/destiny-navigator";
import { PALACE_NAMES } from "../zwds/constants";

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
 * Get palace with current year's Liu Nian (annual flow) tag
 * @param chartData - Complete chart data
 * @returns Palace number with current year's annual flow, or null if not found
 */
export function getCurrentLiuNianPalace(chartData: ChartData): number | null {
  const currentYear = new Date().getFullYear();
  const palace = chartData.palaces.find(
    p => p.annualFlow && p.annualFlow.year === currentYear
  );

  return palace ? palace.number : null;
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
 * @returns Palace number or null if not found
 */
export function getPalaceForAspectDayun(aspect: LifeAspect, chartData: ChartData): number | null {
  const dayunPalace = getCurrentDayunPalace(chartData);
  if (!dayunPalace) return null;

  const tagIndex = DA_MING_TAG_INDICES[aspect];
  return getPalaceFromDaXian(dayunPalace, tagIndex);
}

/**
 * Get palace number for a given aspect in Liu Nian mode
 * @param aspect - The life aspect
 * @param chartData - Complete chart data
 * @returns Palace number or null if not found
 */
export function getPalaceForAspectLiuNian(aspect: LifeAspect, chartData: ChartData): number | null {
  const liuNianPalace = getCurrentLiuNianPalace(chartData);
  if (!liuNianPalace) return null;

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
  return getPalaceBySecondaryName(liuNianPalace, aspectPalaceName, chartData);
}

/**
 * Get palace number for a given aspect in Liu Month mode
 * Same as Liu Nian mode (palace resolution is the same)
 * @param aspect - The life aspect
 * @param chartData - Complete chart data
 * @returns Palace number or null if not found
 */
export function getPalaceForAspectLiuMonth(aspect: LifeAspect, chartData: ChartData): number | null {
  return getPalaceForAspectLiuNian(aspect, chartData);
}
