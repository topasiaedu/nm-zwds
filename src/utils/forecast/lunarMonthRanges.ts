/**
 * Gregorian date ranges for each lunar month (正月–腊月) within a report solar year.
 * Uses solarlunar for lunar→solar conversion and tyme4ts-backed lunar util for year anchor.
 */

import solarLunar from "solarlunar";
import { lunar as lunarUtil } from "../lunar";

/** Chinese lunar month labels (正月 = month 1). */
export const LUNAR_MONTH_LABELS: readonly string[] = [
  "正月",
  "二月",
  "三月",
  "四月",
  "五月",
  "六月",
  "七月",
  "八月",
  "九月",
  "十月",
  "十一月",
  "腊月",
] as const;

/** solarlunar lunar2solar result — Gregorian fields are cYear/cMonth/cDay. */
interface Lunar2SolarResult {
  cYear: number;
  cMonth: number;
  cDay: number;
}

/** One lunar month's solar calendar span. */
export interface LunarMonthRange {
  /** Lunar month index 1–12 (正月 = 1). */
  lunarMonth: number;
  /** Chinese label, e.g. "正月". */
  lunarMonthLabel: string;
  /** Short display range, e.g. "Feb 17 – Mar 17". */
  solarDateRange: string;
  /** Inclusive Gregorian start. */
  solarStart: Date;
  /** Inclusive Gregorian end. */
  solarEnd: Date;
}

const SHORT_MONTHS: readonly string[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/**
 * Format a date as "Mon D" for report headers.
 */
function formatShortDate(date: Date): string {
  const month = SHORT_MONTHS[date.getMonth()];
  const day = date.getDate();
  return `${month} ${day}`;
}

/**
 * Resolve the lunar year used for a solar report year (mid-year anchor).
 */
function getLunarYearForSolarReport(solarYear: number): number {
  if (solarYear < 1660 || solarYear > 2100) {
    throw new Error(`Report year out of range: ${solarYear}`);
  }
  return lunarUtil.convertSolarToLunar(solarYear, 6, 15).year;
}

/**
 * Convert lunar year + month day 1 to a Gregorian Date.
 */
function lunarFirstDayToDate(lunarYear: number, lunarMonth: number): Date {
  const result = solarLunar.lunar2solar(lunarYear, lunarMonth, 1, false) as Lunar2SolarResult;
  return new Date(result.cYear, result.cMonth - 1, result.cDay);
}

/**
 * Returns 12 lunar month ranges for the report solar year.
 * Month 1 = 正月 of the lunar year that contains most of the solar year.
 */
export function getLunarMonthDateRanges(solarYear: number): LunarMonthRange[] {
  const lunarYear = getLunarYearForSolarReport(solarYear);
  const ranges: LunarMonthRange[] = [];

  for (let lunarMonth = 1; lunarMonth <= 12; lunarMonth += 1) {
    const solarStart = lunarFirstDayToDate(lunarYear, lunarMonth);

    const nextLunarMonth = lunarMonth === 12 ? 1 : lunarMonth + 1;
    const nextLunarYear = lunarMonth === 12 ? lunarYear + 1 : lunarYear;
    const nextMonthStart = lunarFirstDayToDate(nextLunarYear, nextLunarMonth);

    const solarEnd = new Date(nextMonthStart);
    solarEnd.setDate(solarEnd.getDate() - 1);

    const label = LUNAR_MONTH_LABELS[lunarMonth - 1] ?? `${lunarMonth}`;

    ranges.push({
      lunarMonth,
      lunarMonthLabel: label,
      solarDateRange: `${formatShortDate(solarStart)} – ${formatShortDate(solarEnd)}`,
      solarStart,
      solarEnd,
    });
  }

  return ranges;
}
