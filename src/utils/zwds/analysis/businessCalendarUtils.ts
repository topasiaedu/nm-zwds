import type { ChartData } from "../types";
import { PALACE_NAMES } from "../constants";
import { analyzeWealthCode } from "./wealthCodeAnalysis";
import type { WealthCodeKey } from "../analysis_constants/wealth_code_mapping";

/**
 * Business calendar month metadata used for UI rendering.
 */
export type BusinessCalendarMonth = {
  sequence: number;
  monthIndex: number;
  year: number;
  label: string;
  startDate: Date;
};

/**
 * Wealth code lookup result for a specific month.
 */
export type MonthlyWealthCodeResult = {
  month: BusinessCalendarMonth;
  wealthCode: WealthCodeKey | null;
  reason: string | null;
};

const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const PALACE_TO_MONTH_INDEX: Record<string, number> = {
  命宫: 0,
  兄弟: 1,
  夫妻: 2,
  子女: 3,
  财帛: 4,
  疾厄: 5,
  迁移: 6,
  交友: 7,
  官禄: 8,
  田宅: 9,
  福德: 10,
  父母: 11,
};

/**
 * Parse report creation date in a timezone-safe way.
 */
function parseReportCreatedAt(createdAt: string): Date | null {
  if (typeof createdAt !== "string" || createdAt.trim().length === 0) {
    return null;
  }

  const dateValue = createdAt.includes("T")
    ? new Date(createdAt)
    : new Date(`${createdAt}T12:00:00`);

  if (Number.isNaN(dateValue.getTime())) {
    return null;
  }

  return dateValue;
}

/**
 * Build the next three months from the report creation date.
 * Month 1 is always the next calendar month.
 */
export function buildNextThreeMonths(
  reportCreatedAt: string
): { months: BusinessCalendarMonth[]; error: string | null } {
  const baseDate = parseReportCreatedAt(reportCreatedAt);
  if (!baseDate) {
    return {
      months: [],
      error: "Report creation date is missing or invalid.",
    };
  }

  const firstMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 1);
  const months: BusinessCalendarMonth[] = Array.from({ length: 3 }, (_, idx) => {
    const date = new Date(firstMonth.getFullYear(), firstMonth.getMonth() + idx, 1);
    const monthIndex = date.getMonth();
    const monthLabel = MONTH_LABELS[monthIndex] ?? "Unknown";
    return {
      sequence: idx + 1,
      monthIndex,
      year: date.getFullYear(),
      label: `${monthLabel} ${date.getFullYear()}`,
      startDate: date,
    };
  });

  return { months, error: null };
}

/**
 * Find the palace number that matches the report year (annual flow).
 */
function findAnnualFlowPalace(chartData: ChartData, targetYear: number): number | null {
  const match = chartData.palaces.find((palace) => palace.annualFlow?.year === targetYear);
  return match ? match.number : null;
}

/**
 * Determine the month index for a palace using ZWDS chart month logic.
 */
function getMonthIndexForPalace(
  chartData: ChartData,
  clickedPalaceNumber: number,
  palaceNumber: number
): number | null {
  if (clickedPalaceNumber < 1 || clickedPalaceNumber > 12) return null;
  if (palaceNumber < 1 || palaceNumber > 12) return null;

  const bottomRightPalace = chartData.palaces[9];
  if (!bottomRightPalace) return null;

  const startingMonthIndex = PALACE_TO_MONTH_INDEX[bottomRightPalace.name];
  if (typeof startingMonthIndex !== "number") return null;

  let distance = palaceNumber - clickedPalaceNumber;
  if (distance < 0) {
    distance += 12;
  }

  return (startingMonthIndex + distance) % 12;
}

/**
 * Identify the palace number that corresponds to a target month index.
 */
function findPalaceForMonthIndex(
  chartData: ChartData,
  clickedPalaceNumber: number,
  targetMonthIndex: number
): number | null {
  if (targetMonthIndex < 0 || targetMonthIndex > 11) return null;

  for (let palaceNumber = 1; palaceNumber <= 12; palaceNumber += 1) {
    const monthIndex = getMonthIndexForPalace(chartData, clickedPalaceNumber, palaceNumber);
    if (monthIndex === targetMonthIndex) {
      return palaceNumber;
    }
  }

  return null;
}

/**
 * Build secondary palace names using the same logic as ZWDSChart.
 */
function buildSecondaryPalaceNames(selectedPalaceNumber: number): string[] | null {
  if (!Number.isFinite(selectedPalaceNumber)) return null;
  if (selectedPalaceNumber < 1 || selectedPalaceNumber > 12) return null;

  const names = PALACE_NAMES;
  if (names.length !== 12) return null;

  const secondaryNames = Array.from({ length: 12 }, (_, idx) => {
    const palaceNumber = idx + 1;
    let distance = selectedPalaceNumber - palaceNumber;
    if (distance < 0) {
      distance += 12;
    }
    return names[distance] ?? "";
  });

  if (secondaryNames.some((name) => name.trim().length === 0)) {
    return null;
  }

  return secondaryNames;
}

/**
 * Create a chart data copy with palace names swapped to secondary palace names.
 */
function buildSecondaryPalaceChartData(
  chartData: ChartData,
  selectedPalaceNumber: number
): ChartData | null {
  const secondaryNames = buildSecondaryPalaceNames(selectedPalaceNumber);
  if (!secondaryNames || secondaryNames.length !== chartData.palaces.length) {
    return null;
  }

  const updatedPalaces = chartData.palaces.map((palace, index) => {
    const secondaryName = secondaryNames[index] ?? palace.name;
    return {
      ...palace,
      name: secondaryName,
    };
  });

  return {
    ...chartData,
    palaces: updatedPalaces,
  };
}

/**
 * Resolve the dominant wealth code for a specific month index.
 * Returns all wealth code scores for deduplication logic.
 */
export function getDominantWealthCodeForMonth(
  chartData: ChartData,
  reportYear: number,
  targetMonthIndex: number
): { wealthCode: WealthCodeKey | null; allScores: Array<{ key: WealthCodeKey; score: number }>; reason: string | null } {
  if (!chartData || !Array.isArray(chartData.palaces) || chartData.palaces.length < 12) {
    return { wealthCode: null, allScores: [], reason: "Chart data is incomplete." };
  }

  if (!Number.isFinite(reportYear)) {
    return { wealthCode: null, allScores: [], reason: "Report year is invalid." };
  }

  const clickedPalaceNumber = findAnnualFlowPalace(chartData, reportYear);
  if (!clickedPalaceNumber) {
    return { wealthCode: null, allScores: [], reason: "Unable to locate annual flow palace for report year." };
  }

  const monthPalaceNumber = findPalaceForMonthIndex(chartData, clickedPalaceNumber, targetMonthIndex);
  if (!monthPalaceNumber) {
    return { wealthCode: null, allScores: [], reason: "Unable to map month to palace." };
  }

  const secondaryChart = buildSecondaryPalaceChartData(chartData, monthPalaceNumber);
  if (!secondaryChart) {
    return { wealthCode: null, allScores: [], reason: "Unable to build secondary palace layout." };
  }

  try {
    const profile = analyzeWealthCode(secondaryChart);
    if (!profile.hasRecognizedStars || profile.codes.length === 0) {
      return { wealthCode: null, allScores: [], reason: "Wealth palace has no recognized stars." };
    }
    
    const allScores = profile.codes.map((code) => ({
      key: code.key,
      score: code.score,
    }));
    
    return { wealthCode: profile.codes[0].key, allScores, reason: null };
  } catch (error) {
    console.error("BusinessCalendar wealth code analysis failed:", error);
    return { wealthCode: null, allScores: [], reason: "Wealth code analysis failed." };
  }
}

/**
 * Build monthly wealth code results for the Business Calendar.
 * Ensures no duplicate wealth codes across the 3 months by picking the next highest score.
 */
export function buildMonthlyWealthCodes(
  chartData: ChartData,
  reportCreatedAt: string
): { results: MonthlyWealthCodeResult[]; error: string | null } {
  const reportDate = parseReportCreatedAt(reportCreatedAt);
  if (!reportDate) {
    return { results: [], error: "Report creation date is missing or invalid." };
  }

  const { months, error } = buildNextThreeMonths(reportCreatedAt);
  if (error) {
    return { results: [], error };
  }

  if (months.length === 0) {
    return { results: [], error: "No months available for the Business Calendar." };
  }

  const reportYear = reportDate.getFullYear();

  // First pass: get dominant wealth code and all scores for each month
  const monthData = months.map((month) => {
    const { wealthCode, allScores, reason } = getDominantWealthCodeForMonth(
      chartData,
      reportYear,
      month.monthIndex
    );

    return {
      month,
      wealthCode,
      allScores,
      reason,
    };
  });

  // Second pass: deduplicate by picking next highest score for duplicates
  const usedCodes = new Set<WealthCodeKey>();
  const results: MonthlyWealthCodeResult[] = [];

  for (const data of monthData) {
    let finalCode = data.wealthCode;
    let finalReason = data.reason;

    // If this month has a valid code but it's already used, pick the next highest unused code
    if (finalCode && usedCodes.has(finalCode) && data.allScores.length > 0) {
      const nextCode = data.allScores.find((score) => !usedCodes.has(score.key));
      if (nextCode) {
        finalCode = nextCode.key;
        finalReason = null; // Clear reason since we found an alternative
      } else {
        // All codes are used; keep the duplicate but note it in reason
        finalReason = "Alternative wealth code not available; showing duplicate.";
      }
    }

    if (finalCode) {
      usedCodes.add(finalCode);
    }

    results.push({
      month: data.month,
      wealthCode: finalCode,
      reason: finalReason,
    });
  }

  return { results, error: null };
}

