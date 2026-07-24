/**
 * Season agreement score between decade, year, and month cycles.
 *
 * Important product rule: this is a timing-alignment score, not luck,
 * fortune, or "how good / bad the month is."
 */

import type { DayunSeason } from "../../../types/dayun";
import type { ConvergenceResult, MonthlyTimingStack } from "./types";

const SCORE_ALL_MATCH = 100;
const SCORE_PER_MISMATCH = 25;
const SCORE_FLOOR = 20;

/** Shared explainer shown under every Sync score. */
const SCORE_EXPLAINER = [
  "This number measures how aligned your longer decade chapter, this year, and this month are.",
  "It is not a luck rating, and a low score does not mean an unlucky or cursed month.",
  "It tells you how hard to push versus how carefully to protect and repair.",
].join(" ");

/**
 * Count pairwise season mismatches among decade / year / month.
 */
const countMismatches = (
  a: DayunSeason | null,
  b: DayunSeason | null,
  c: DayunSeason
): number => {
  let mismatches = 0;
  if (a !== null && b !== null && a !== b) {
    mismatches += 1;
  }
  if (b !== null && b !== c) {
    mismatches += 1;
  }
  if (a !== null && a !== c) {
    mismatches += 1;
  }
  return mismatches;
};

/**
 * Build a short convergence score people can act on quickly.
 */
export const buildConvergenceScore = (stack: MonthlyTimingStack): ConvergenceResult => {
  const daXianSeason = stack.daXian?.season ?? null;
  const liuNianSeason = stack.liuNianSeason;
  const liuYueSeason = stack.liuYueSeason;

  const mismatches = countMismatches(daXianSeason, liuNianSeason, liuYueSeason);
  const score = Math.max(SCORE_FLOOR, SCORE_ALL_MATCH - mismatches * SCORE_PER_MISMATCH);

  let band: ConvergenceResult["band"];
  let label: string;
  let summary: string;
  let bandMeaning: string;
  let tips: string[];

  if (score >= 85) {
    band = "aligned";
    label = "In sync";
    summary = "Your timing layers agree. Push this month's focus; skip side quests.";
    bandMeaning =
      "High score means decade, year, and month are pointing the same way. Use that agreement to move your main focus early.";
    tips = [
      "Green light: move the month focus early, before energy scatters",
      "Batch similar tasks in the same week so momentum compounds",
      "Say no to side quests that do not serve this focus",
    ];
  } else if (score >= 50) {
    band = "partial";
    label = "Mixed signals";
    summary =
      "Timing is split. Do one clear fix (people or agreements) instead of chasing every new open door.";
    bandMeaning =
      "A mid score means some layers agree and some clash. Keep one bigger goal alive, and use the month for one clear repair instead of many new launches.";
    tips = [
      "Agree: keep one visible goal alive from your decade or year theme",
      "Clash: the month wants repair; new launches wait until that is done",
      "Act: one clear conversation or agreement beats three new opportunities",
    ];
  } else {
    band = "clash";
    label = "At odds";
    summary =
      "This month pulls against your bigger timing. Protect what you have; delay risky leaps.";
    bandMeaning = [
      `A score around ${String(score)} means your month season is fighting your year or decade season.`,
      "That is a protect-and-cleanup month, not a verdict that you are unlucky.",
      "Favor repair, boundaries, and finishing unfinished business over big bets.",
    ].join(" ");
    tips = [
      "Protect cash, reputation, and key relationships first",
      "Postpone high-risk bets until the month pressure eases",
      "Use this month for cleanup: ends, docs, and unfinished talks",
    ];
  }

  return {
    score,
    band,
    label,
    summary,
    scoreExplainer: SCORE_EXPLAINER,
    bandMeaning,
    tips,
    daXianSeason,
    liuNianSeason,
    liuYueSeason,
  };
};
