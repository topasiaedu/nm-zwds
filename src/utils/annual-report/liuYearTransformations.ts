/**
 * 流年四化 engine — annual flow transformations for the report year.
 */

import type { ChartData } from "../zwds/types";
import { getYearPalaceForLiuMonth } from "../destiny-navigator/palace-resolver";
import type { LiuYearTransformations } from "./types";
import {
  getStemBranchForYear,
  getYearPalaceNumberForReportYear,
  resolveTransformationsFromStem,
} from "./transformationResolver";

/**
 * Compute 流年四化 for the report year.
 * Uses the 流年 palace heavenly stem when available; falls back to year formula.
 */
export function computeLiuYearTransformations(
  chartData: ChartData,
  reportYear: number
): LiuYearTransformations {
  if (!Number.isFinite(reportYear)) {
    throw new Error(`Invalid report year: ${reportYear}`);
  }

  const chartYearPalace = getYearPalaceForLiuMonth(chartData, reportYear);
  const fallbackPalaceNumber = getYearPalaceNumberForReportYear(reportYear);
  const yearPalaceNumber = chartYearPalace ?? fallbackPalaceNumber;

  const yearPalace = chartData.palaces[yearPalaceNumber - 1];
  const stemBranchFromYear = getStemBranchForYear(reportYear);

  const yearHeavenlyStem =
    yearPalace?.annualFlow?.heavenlyStem ?? stemBranchFromYear.heavenlyStem;
  const yearEarthlyBranch =
    yearPalace?.annualFlow?.earthlyBranch ?? stemBranchFromYear.earthlyBranch;

  const activations = resolveTransformationsFromStem(
    chartData,
    yearHeavenlyStem,
    `流年 ${reportYear}`
  );

  return {
    reportYear,
    yearPalaceNumber,
    yearHeavenlyStem,
    yearEarthlyBranch,
    activations,
  };
}
