/**
 * Solar / lunar date labels for chart center panel and profile sidebar.
 */

import { EARTHLY_BRANCHES } from "../../../utils/zwds/constants";
import type { ChartData } from "../../../utils/zwds/types";

const LUNAR_DAY_STRINGS = [
  "初一",
  "初二",
  "初三",
  "初四",
  "初五",
  "初六",
  "初七",
  "初八",
  "初九",
  "初十",
  "十一",
  "十二",
  "十三",
  "十四",
  "十五",
  "十六",
  "十七",
  "十八",
  "十九",
  "二十",
  "廿一",
  "廿二",
  "廿三",
  "廿四",
  "廿五",
  "廿六",
  "廿七",
  "廿八",
  "廿九",
  "三十",
] as const;

const HOUR_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;

type TranslateFn = (key: string) => string;

/**
 * Format solar birth date/time for display.
 */
export function formatChartSolarDate(
  chartData: ChartData,
  t: TranslateFn,
  language: string
): string {
  const { input } = chartData;
  const yearLabel = language === "en" ? t("zwds.chart.年") : "年";
  const monthLabel = language === "en" ? t("zwds.chart.月") : "月";
  const dayLabel = language === "en" ? t("zwds.chart.日") : "日";
  const hourLabel = language === "en" ? t("zwds.chart.时") : "時";

  return `${input.year} ${yearLabel} ${input.month} ${monthLabel} ${input.day} ${dayLabel} ${input.hour} ${hourLabel}`;
}

/**
 * Format lunar birth date/time for display.
 */
export function formatChartLunarDate(
  chartData: ChartData,
  t: TranslateFn,
  language: string
): string {
  const { input } = chartData;
  const yearLabel = language === "en" ? t("zwds.chart.年") : "年";
  const monthLabel = language === "en" ? t("zwds.chart.月") : "月";
  const dayLabel = language === "en" ? t("zwds.chart.日") : "日";
  const hourLabel = language === "en" ? t("zwds.chart.时") : "時";

  const lunarDayKey = LUNAR_DAY_STRINGS[chartData.lunarDate.day - 1];
  const lunarDayLabel =
    t(`zwds.lunarDays.${lunarDayKey}`) || lunarDayKey;

  const hourBranch = HOUR_BRANCHES[Math.floor(((input.hour + 1) % 24) / 2)];

  const stemBranch = `${t(`zwds.stems.${chartData.heavenlyStem}`)}${
    language === "en" ? " " : ""
  }${t(`zwds.branches.${chartData.earthlyBranch}`)}`;

  const monthStem =
    chartData.palaces?.find((p) => p.annualFlow?.year === input.year)?.annualFlow
      ?.heavenlyStem ?? "";

  const monthBranch =
    t(`zwds.monthBranches.${EARTHLY_BRANCHES[chartData.lunarDate.month - 1]}`) || "";

  const dayBranch = t(`zwds.dayBranches.${hourBranch}`);

  return `${stemBranch}${chartData.lunarDate.year} ${yearLabel} ${monthStem}${monthBranch} ${monthLabel} ${lunarDayLabel} ${dayLabel} ${dayBranch} ${hourLabel}`;
}
