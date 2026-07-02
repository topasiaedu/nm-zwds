/**

 * Branch harmony timing — 三合 / 六合 / 相冲 / 相害 for 流月 vs 命宫.

 */



import type { EarthlyBranchType } from "../zwds/types";

import type { BranchHarmonyType } from "./types";



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

  for (const [x, y] of LIU_HE_PAIRS) {

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

        `This month's branch ${liuMonthBranch} harmonizes with your Life Palace ${lifePalaceBranch} (三合). ` +

        `Timing supports key moves. Act with confidence but still check the details.`,

    };

  }



  if (isLiuHe(liuMonthBranch, lifePalaceBranch)) {

    return {

      harmony: "supportive",

      explanation:

        `This month's branch ${liuMonthBranch} pairs well with your Life Palace ${lifePalaceBranch} (六合). ` +

        `Good month to coordinate plans and work with others.`,

    };

  }



  if (isLiuChong(liuMonthBranch, lifePalaceBranch)) {

    return {

      harmony: "challenging",

      explanation:

        `This month's branch ${liuMonthBranch} clashes with your Life Palace ${lifePalaceBranch} (六冲). ` +

        `Go slow on major moves. Focus on stability first.`,

    };

  }



  if (isLiuHai(liuMonthBranch, lifePalaceBranch)) {

    return {

      harmony: "watchful",

      explanation:

        `This month's branch ${liuMonthBranch} forms friction with your Life Palace ${lifePalaceBranch} (六害). ` +

        `Watch for misunderstandings and misaligned expectations.`,

    };

  }



  return {

    harmony: "neutral",

    explanation:

      `This month's branch ${liuMonthBranch} is neutral with your Life Palace ${lifePalaceBranch}. ` +

      `Timing is neither strongly for nor against you. Plan as usual.`,

  };

}



/**

 * Split a solar date range string into start and end parts.

 */

function splitSolarDateRange(solarDateRange: string): { start: string; end: string; mid: string } {

  const parts = solarDateRange.split(/[–-]/).map((s) => s.trim());

  const start = parts[0] ?? "Early month";

  const end = parts[1] ?? "Late month";

  const mid = parts.length >= 2 ? `Mid ${parts[0]?.split(" ")[0] ?? "month"}` : "Mid month";

  return { start, end, mid };

}



/**

 * Build timing window labels from harmony and solar date range.

 */

export function buildTimingWindows(

  solarDateRange: string,

  harmony: BranchHarmonyType

): { favorable: string; caution: string } {

  const { start, end, mid } = splitSolarDateRange(solarDateRange);



  switch (harmony) {

    case "favorable":

      return {

        favorable: `From ${start} to ${end}. Strong window for key moves across the month.`,

        caution: `Around ${mid}. You can still act, but confirm details twice.`,

      };

    case "supportive":

      return {

        favorable: `From ${start} to ${mid}. Best opening window for new steps.`,

        caution: `Around ${end}. Wrap up tasks instead of starting big commitments.`,

      };

    case "challenging":

      return {

        favorable: `Around ${start}. Light planning only. Save big moves for later.`,

        caution: `From ${mid} to ${end}. Hold steady and avoid major commitments.`,

      };

    case "watchful":

      return {

        favorable: `Around ${mid}. Best after you clear misunderstandings.`,

        caution: `From ${start} to ${end}. Verify agreements and health routines.`,

      };

    default:

      return {

        favorable: `From ${start} to ${mid}. Reasonable window for steady action.`,

        caution: `From ${mid} to ${end}. Slow down if plans feel rushed.`,

      };

  }

}


