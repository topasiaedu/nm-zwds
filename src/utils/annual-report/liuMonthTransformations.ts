/**
 * 流月四化 engine — monthly flow transformations for all 12 lunar months.
 */

import type { ChartData } from "../zwds/types";
import { getMonthPalaceForLiuMonth } from "../destiny-navigator/palace-resolver";
import type { LiuMonthTransformationSet } from "./types";
import { resolveTransformationsFromStem } from "./transformationResolver";

/**
 * Compute 流月四化 for each lunar month in the report year.
 * Each month's stem comes from the resolved 流月 palace natal heavenly stem.
 */
export function computeLiuMonthTransformations(
  chartData: ChartData,
  reportYear: number
): LiuMonthTransformationSet[] {
  const results: LiuMonthTransformationSet[] = [];

  for (let lunarMonth = 1; lunarMonth <= 12; lunarMonth += 1) {
    const monthPalaceNumber = getMonthPalaceForLiuMonth(chartData, lunarMonth, reportYear);
    if (monthPalaceNumber === null) {
      continue;
    }

    const monthPalace = chartData.palaces[monthPalaceNumber - 1];
    if (monthPalace === undefined) {
      continue;
    }

    const activations = resolveTransformationsFromStem(
      chartData,
      monthPalace.heavenlyStem,
      `流月 ${lunarMonth}`
    );

    results.push({
      lunarMonth,
      monthPalaceNumber,
      monthPalaceName: monthPalace.name,
      monthHeavenlyStem: monthPalace.heavenlyStem,
      monthEarthlyBranch: monthPalace.earthlyBranch,
      activations,
    });
  }

  return results;
}
