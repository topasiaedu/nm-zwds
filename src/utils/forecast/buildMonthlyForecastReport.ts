/**
 * Builds a complete 12-month monthly forecast report from birth data.
 * Shared by the HTML print route and the PDF forecast flow.
 */

import { ZWDSCalculator } from "../zwds/calculator";
import type { ChartInput, ChartData } from "../zwds/types";
import { getPalaceForAspectLiuMonth } from "../destiny-navigator/palace-resolver";
import {
  PALACE_MONTH_DATA,
  PALACE_GUIDANCE_DATA,
  SEASON_STYLES,
  type PalaceMonthData,
  type PalaceGuidanceData,
  type SeasonStyle,
  type DimensionBar,
} from "./liuMonthData";
import { PALACE_REPORT_COPY, type PalaceReportCopy } from "./liuMonthReportCopy";
import { getLunarMonthDateRanges, type LunarMonthRange } from "./lunarMonthRanges";
import { parseBirthHourForChart } from "../zwds/utils";

/** English display names for each palace. */
export const PALACE_ENGLISH: Record<string, string> = {
  "命宫": "Life Palace",
  "兄弟": "Siblings Palace",
  "夫妻": "Spouse Palace",
  "子女": "Children Palace",
  "财帛": "Wealth Palace",
  "疾厄": "Health Palace",
  "迁移": "Travel Palace",
  "交友": "Friends Palace",
  "官禄": "Career Palace",
  "田宅": "Property Palace",
  "福德": "Inner Power Palace",
  "父母": "Parents Palace",
};

/** Report subject birth details. */
export interface MonthlyForecastSubject {
  name: string;
  birthday: string;
  birthTime: string;
  gender: string;
}

/** One month entry in the report. */
export interface MonthlyForecastMonthEntry {
  lunarMonth: number;
  lunarMonthLabel: string;
  solarDateRange: string;
  palaceName: string;
  palaceEnglish: string;
  palaceNumber: number;
  monthData: PalaceMonthData;
  guidance: PalaceGuidanceData;
  reportCopy: PalaceReportCopy;
  seasonStyle: SeasonStyle;
  starRating: 3 | 4 | 5;
}

/** Yearly overview table row. */
export interface YearlyOverviewRow {
  lunarMonthLabel: string;
  solarDateRange: string;
  palaceEnglish: string;
  area: string;
  season: string;
  starRating: 3 | 4 | 5;
  priority: string;
}

/** Full report payload for rendering. */
export interface MonthlyForecastReport {
  subject: MonthlyForecastSubject;
  year: number;
  generatedAt: string;
  months: MonthlyForecastMonthEntry[];
  yearlyOverview: YearlyOverviewRow[];
}

/**
 * Build ChartInput from URL/form parameters.
 */
export function chartInputFromParams(params: {
  name: string;
  birthday: string;
  birthTime: string;
  gender: "male" | "female";
  email?: string;
}): ChartInput {
  const birthDate = new Date(params.birthday);
  if (Number.isNaN(birthDate.getTime())) {
    throw new Error(`Invalid birthday: ${params.birthday}`);
  }

  return {
    name: params.name,
    year: birthDate.getFullYear(),
    month: birthDate.getMonth() + 1,
    day: birthDate.getDate(),
    hour: parseBirthHourForChart(params.birthTime),
    gender: params.gender,
    email: params.email,
  };
}

/**
 * Derive 3/4/5 star energy from dimension bar peak score.
 */
export function getStarRatingFromBars(bars: readonly DimensionBar[]): 3 | 4 | 5 {
  const maxPct = Math.max(...bars.map((bar) => bar.pct));
  if (maxPct >= 90) {
    return 5;
  }
  if (maxPct >= 70) {
    return 4;
  }
  return 3;
}

/**
 * Resolve palace for each lunar month 1–12.
 */
function calculateMonthlyPalaces(
  chartData: ChartData,
  year: number
): Array<{ lunarMonth: number; palaceName: string; palaceNumber: number }> {
  const monthlyData: Array<{ lunarMonth: number; palaceName: string; palaceNumber: number }> = [];

  for (let lunarMonth = 1; lunarMonth <= 12; lunarMonth += 1) {
    const palaceNumber = getPalaceForAspectLiuMonth(
      "life",
      chartData,
      lunarMonth,
      year
    );

    if (palaceNumber === null) {
      continue;
    }

    const palace = chartData.palaces[palaceNumber - 1];
    if (palace === undefined) {
      continue;
    }

    monthlyData.push({
      lunarMonth,
      palaceName: palace.name,
      palaceNumber,
    });
  }

  return monthlyData;
}

/**
 * Default report copy when palace key is missing.
 */
function getReportCopy(palaceName: string): PalaceReportCopy {
  const copy = PALACE_REPORT_COPY[palaceName];
  if (copy !== undefined) {
    return copy;
  }
  return {
    monthsFocus: "Take one concrete action aligned with this month's palace theme.",
    whyThisMonthMatters:
      "Each lunar month shifts the active palace in your chart cycle. Use this window strategically.",
    whatToExpect: "This month activates a new palace focus in your chart cycle.",
    primaryGoal: "Take one concrete action aligned with this month's palace theme.",
    quickTakeaway: "Align your actions with the seasonal energy of this month.",
  };
}

/**
 * Build the full monthly forecast report.
 */
export function buildMonthlyForecastReport(
  chartInput: ChartInput,
  year?: number
): MonthlyForecastReport {
  const reportYear = year ?? new Date().getFullYear();
  const calculator = new ZWDSCalculator(chartInput);
  const chartData = calculator.calculate();

  const lunarRanges = getLunarMonthDateRanges(reportYear);
  const palaceByMonth = calculateMonthlyPalaces(chartData, reportYear);

  const months: MonthlyForecastMonthEntry[] = palaceByMonth.map((entry) => {
    const range: LunarMonthRange | undefined = lunarRanges.find(
      (r) => r.lunarMonth === entry.lunarMonth
    );
    const monthData = PALACE_MONTH_DATA[entry.palaceName];
    const guidance = PALACE_GUIDANCE_DATA[entry.palaceName];
    const reportCopy = getReportCopy(entry.palaceName);

    if (monthData === undefined || guidance === undefined) {
      throw new Error(`Missing palace data for: ${entry.palaceName}`);
    }

    const seasonStyle = SEASON_STYLES[monthData.season];
    const palaceEnglish = PALACE_ENGLISH[entry.palaceName] ?? entry.palaceName;

    return {
      lunarMonth: entry.lunarMonth,
      lunarMonthLabel: range?.lunarMonthLabel ?? `${entry.lunarMonth}`,
      solarDateRange: range?.solarDateRange ?? "",
      palaceName: entry.palaceName,
      palaceEnglish,
      palaceNumber: entry.palaceNumber,
      monthData,
      guidance,
      reportCopy,
      seasonStyle,
      starRating: getStarRatingFromBars(monthData.dimensionBars),
    };
  });

  const yearlyOverview: YearlyOverviewRow[] = months.map((month) => ({
    lunarMonthLabel: month.lunarMonthLabel,
    solarDateRange: month.solarDateRange,
    palaceEnglish: month.palaceEnglish,
    area: month.monthData.area,
    season: month.monthData.season,
    starRating: month.starRating,
    priority: month.monthData.priority,
  }));

  const birthdayIso = `${chartInput.year}-${String(chartInput.month).padStart(2, "0")}-${String(chartInput.day).padStart(2, "0")}`;

  return {
    subject: {
      name: chartInput.name,
      birthday: birthdayIso,
      birthTime: String(chartInput.hour),
      gender: chartInput.gender,
    },
    year: reportYear,
    generatedAt: new Date().toISOString(),
    months,
    yearlyOverview,
  };
}
