/**

 * Branch harmony timing — 三合 / 六合 / 相冲 / 相害 for 流月 vs 命宫.

 */



import type { EarthlyBranchType } from "../zwds/types";

import type { BranchHarmonyType, MonthRhythmVisual, TimingRhythmBand } from "./types";



/** 三合局 groups (each branch maps to its two partners). */

const SAN_HE_GROUPS: readonly (readonly EarthlyBranchType[])[] = [

  ["寅", "午", "戌"],

  ["申", "子", "辰"],

  ["亥", "卯", "未"],

  ["巳", "酉", "丑"],

] as const;



/** 六合 pairs. */

const LIU_HE_PAIRS: readonly (readonly [EarthlyBranchType, EarthlyBranchType])[] = [

  ["子", "丑"],

  ["寅", "亥"],

  ["卯", "戌"],

  ["辰", "酉"],

  ["巳", "申"],

  ["午", "未"],

] as const;



/** 六害 pairs. */

const LIU_HAI_PAIRS: readonly (readonly [EarthlyBranchType, EarthlyBranchType])[] = [

  ["子", "未"],

  ["丑", "午"],

  ["寅", "巳"],

  ["卯", "辰"],

  ["申", "亥"],

  ["酉", "戌"],

] as const;



/** Branch index for 六冲 (opposite branch). */

const BRANCH_ORDER: readonly EarthlyBranchType[] = [

  "子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥",

] as const;



/**

 * Check if two branches are in the same 三合局.

 */

function isSanHe(a: EarthlyBranchType, b: EarthlyBranchType): boolean {

  if (a === b) {

    return false;

  }

  for (const group of SAN_HE_GROUPS) {

    if (group.includes(a) && group.includes(b)) {

      return true;

    }

  }

  return false;

}



/**

 * Check if two branches form 六合.

 */

function isLiuHe(a: EarthlyBranchType, b: EarthlyBranchType): boolean {

  for (const [x, y] of LIU_HE_PAIRS) {

    if ((a === x && b === y) || (a === y && b === x)) {

      return true;

    }

  }

  return false;

}



/**

 * Check if two branches form 六害.

 */

function isLiuHai(a: EarthlyBranchType, b: EarthlyBranchType): boolean {

  for (const [x, y] of LIU_HAI_PAIRS) {

    if ((a === x && b === y) || (a === y && b === x)) {

      return true;

    }

  }

  return false;

}



/**

 * Check if two branches are 六冲 (opposite).

 */

function isLiuChong(a: EarthlyBranchType, b: EarthlyBranchType): boolean {

  const indexA = BRANCH_ORDER.indexOf(a);

  const indexB = BRANCH_ORDER.indexOf(b);

  if (indexA < 0 || indexB < 0) {

    return false;

  }

  return Math.abs(indexA - indexB) === 6;

}



export interface BranchHarmonyResult {

  harmony: BranchHarmonyType;

  explanation: string;

}



/**

 * Evaluate branch harmony between 流月 palace branch and natal 命宫 branch.

 */

export function evaluateBranchHarmony(

  liuMonthBranch: EarthlyBranchType,

  lifePalaceBranch: EarthlyBranchType

): BranchHarmonyResult {

  if (isSanHe(liuMonthBranch, lifePalaceBranch)) {
    return {
      harmony: "favorable",
      explanation:
        "This month's rhythm aligns well with your chart. " +
        "Key moves are supported, but still check the details before you commit.",
    };
  }

  if (isLiuHe(liuMonthBranch, lifePalaceBranch)) {
    return {
      harmony: "supportive",
      explanation:
        "This month works smoothly with your chart. " +
        "It is a good time to coordinate plans and work with others.",
    };
  }

  if (isLiuChong(liuMonthBranch, lifePalaceBranch)) {
    return {
      harmony: "challenging",
      explanation:
        "This month pushes against your chart's flow. " +
        "Go slow on major moves and focus on stability first.",
    };
  }

  if (isLiuHai(liuMonthBranch, lifePalaceBranch)) {
    return {
      harmony: "watchful",
      explanation:
        "This month carries hidden friction with your chart. " +
        "Watch for misunderstandings and misaligned expectations.",
    };
  }

  return {
    harmony: "neutral",
    explanation:
      "This month is neutral for your chart. " +
      "Timing is neither strongly for nor against you, so plan as usual.",
  };

}



/** Percent spans on the month timeline for good vs go-slow windows. */
export interface TimingZonePercents {
  favorableStart: number;
  favorableEnd: number;
  cautionStart: number;
  cautionEnd: number;
}

export const TIMING_ZONES_BY_HARMONY: Record<BranchHarmonyType, TimingZonePercents> = {
  favorable: { favorableStart: 0, favorableEnd: 100, cautionStart: 38, cautionEnd: 52 },
  supportive: { favorableStart: 0, favorableEnd: 58, cautionStart: 68, cautionEnd: 100 },
  challenging: { favorableStart: 0, favorableEnd: 28, cautionStart: 42, cautionEnd: 100 },
  watchful: { favorableStart: 38, favorableEnd: 58, cautionStart: 0, cautionEnd: 100 },
  neutral: { favorableStart: 0, favorableEnd: 55, cautionStart: 55, cautionEnd: 100 },
};

const SHORT_MONTHS: readonly string[] = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

/**
 * Format a date as "Mon D" for timing window labels.
 */
function formatShortTimingDate(date: Date): string {
  const month = SHORT_MONTHS[date.getMonth()] ?? "Mon";
  return `${month} ${date.getDate()}`;
}

/**
 * Map a 0–100 position to a calendar date within the lunar month's solar span.
 */
function dateAtMonthProgress(start: Date, end: Date, percent: number): Date {
  const startMs = start.getTime();
  const endMs = end.getTime();
  if (endMs <= startMs) {
    return new Date(startMs);
  }
  const clamped = Math.min(100, Math.max(0, percent));
  return new Date(startMs + Math.round((endMs - startMs) * (clamped / 100)));
}

/**
 * Build a reader-facing window label from percent spans on the month timeline.
 */
function formatWindowLabel(
  solarStart: Date,
  solarEnd: Date,
  fromPercent: number,
  toPercent: number
): string {
  const fromDate = dateAtMonthProgress(solarStart, solarEnd, fromPercent);
  const toDate = dateAtMonthProgress(solarStart, solarEnd, toPercent);
  const fromLabel = formatShortTimingDate(fromDate);
  const toLabel = formatShortTimingDate(toDate);

  if (fromLabel === toLabel) {
    return `Around ${fromLabel}`;
  }

  const span = toPercent - fromPercent;
  if (span <= 18) {
    const center = dateAtMonthProgress(solarStart, solarEnd, (fromPercent + toPercent) / 2);
    return `Around ${formatShortTimingDate(center)}`;
  }

  return `From ${fromLabel} to ${toLabel}`;
}

/**
 * Build date anchors and band positions for the Part 6 month rhythm visual.
 */
export function buildMonthRhythmVisual(
  solarStart: Date,
  solarEnd: Date,
  harmony: BranchHarmonyType
): MonthRhythmVisual {
  const zones = TIMING_ZONES_BY_HARMONY[harmony];

  const band = (startPercent: number, endPercent: number): TimingRhythmBand => ({
    startPercent,
    endPercent,
    startLabel: formatShortTimingDate(dateAtMonthProgress(solarStart, solarEnd, startPercent)),
    endLabel: formatShortTimingDate(dateAtMonthProgress(solarStart, solarEnd, endPercent)),
  });

  return {
    monthStartLabel: formatShortTimingDate(solarStart),
    monthEndLabel: formatShortTimingDate(solarEnd),
    earlyEndLabel: formatShortTimingDate(dateAtMonthProgress(solarStart, solarEnd, 33.3)),
    lateStartLabel: formatShortTimingDate(dateAtMonthProgress(solarStart, solarEnd, 66.6)),
    favorableBand: band(zones.favorableStart, zones.favorableEnd),
    cautionBand: band(zones.cautionStart, zones.cautionEnd),
  };
}

/**
 * Build timing window labels from harmony and the month's solar start/end dates.
 * Window percents match the Part 6 month rhythm bar (TIMING_ZONES_BY_HARMONY).
 */
export function buildTimingWindows(
  solarStart: Date,
  solarEnd: Date,
  harmony: BranchHarmonyType
): { favorable: string; caution: string } {
  const zones = TIMING_ZONES_BY_HARMONY[harmony];

  switch (harmony) {
    case "favorable":
      return {
        favorable: `${formatWindowLabel(solarStart, solarEnd, zones.favorableStart, zones.favorableEnd)}. Strong window for key moves across the month.`,
        caution: `${formatWindowLabel(solarStart, solarEnd, zones.cautionStart, zones.cautionEnd)}. You can still act, but confirm details twice.`,
      };
    case "supportive":
      return {
        favorable: `${formatWindowLabel(solarStart, solarEnd, zones.favorableStart, zones.favorableEnd)}. Best opening window for new steps.`,
        caution: `${formatWindowLabel(solarStart, solarEnd, zones.cautionStart, zones.cautionEnd)}. Wrap up tasks instead of starting big commitments.`,
      };
    case "challenging":
      return {
        favorable: `${formatWindowLabel(solarStart, solarEnd, zones.favorableStart, zones.favorableEnd)}. Light planning only. Save big moves for later.`,
        caution: `${formatWindowLabel(solarStart, solarEnd, zones.cautionStart, zones.cautionEnd)}. Hold steady and avoid major commitments.`,
      };
    case "watchful":
      return {
        favorable: `${formatWindowLabel(solarStart, solarEnd, zones.favorableStart, zones.favorableEnd)}. Best after you clear misunderstandings.`,
        caution: `${formatWindowLabel(solarStart, solarEnd, zones.cautionStart, zones.cautionEnd)}. Verify agreements and health routines.`,
      };
    default:
      return {
        favorable: `${formatWindowLabel(solarStart, solarEnd, zones.favorableStart, zones.favorableEnd)}. Reasonable window for steady action.`,
        caution: `${formatWindowLabel(solarStart, solarEnd, zones.cautionStart, zones.cautionEnd)}. Slow down if plans feel rushed.`,
      };
  }
}

