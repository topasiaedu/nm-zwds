/**
 * PhaseAlignmentCard — Timing × Wealth Intersection
 *
 * A single card that surfaces the strategic intersection of the user's
 * current DaYun season and their dominant wealth code.
 * All data comes from existing utilities (`calculateCurrentDayunCycle`,
 * `generateDayunGuidance`, `analyzeWealthCode`). The card adds framing copy
 * only — no new computation.
 */

import React from "react";
import type { DayunCycleExtended } from "../../../types/dayun";
import type { WealthCodeAnalysisResult } from "../../../utils/zwds/analysis/wealthCodeAnalysis";
import {
  PHASE_ALIGNMENT_MATRIX,
  type PhaseAlignmentSeasonKey,
  type PhaseAlignmentWealthKey,
} from "../../../utils/forecast/wealthContentData";

type PhaseKey = PhaseAlignmentSeasonKey;
type WealthKey = PhaseAlignmentWealthKey;

/** Maps the DaYun season (spring/summer/autumn/winter) to the new phase keys. */
const DAYUN_TO_PHASE: Record<string, PhaseKey> = {
  spring: "expansion",
  summer: "visibility",
  autumn: "consolidation",
  winter: "foundation",
};

const WEALTH_KEYS: ReadonlyArray<WealthKey> = [
  "investmentBrain",
  "brandingMagnet",
  "strategyPlanner",
  "collaborator",
];

/**
 * Narrow an unknown wealth-code key to a PhaseAlignmentWealthKey.
 */
function toWealthKey(value: string | undefined): WealthKey | undefined {
  if (value === undefined) {
    return undefined;
  }
  return WEALTH_KEYS.find((key) => key === value);
}

const PHASE_CONFIG: Record<PhaseKey, { gradient: string; icon: string; label: string }> = {
  expansion: { gradient: "from-emerald-500 to-green-600", icon: "🚀", label: "Expansion" },
  visibility: { gradient: "from-amber-500 to-orange-600", icon: "✨", label: "Visibility" },
  consolidation: { gradient: "from-orange-500 to-red-600", icon: "🛡️", label: "Consolidation" },
  foundation: { gradient: "from-blue-500 to-indigo-600", icon: "🏗️", label: "Foundation" },
};

interface PhaseAlignmentCardProps {
  /** Full DaYun cycle with guidance populated by `generateDayunGuidance`. */
  dayunCycle: DayunCycleExtended;
  /** Full wealth code analysis result from `analyzeWealthCode`. */
  wealthProfile: WealthCodeAnalysisResult;
}

/**
 * PhaseAlignmentCard displays the intersection of the user's current DaYun
 * season and their dominant wealth code archetype.
 */
const PhaseAlignmentCard: React.FC<PhaseAlignmentCardProps> = ({
  dayunCycle,
  wealthProfile,
}) => {
  const phaseKey: PhaseKey = DAYUN_TO_PHASE[dayunCycle.season] ?? "expansion";
  const wealthKey = toWealthKey(wealthProfile.codes[0]?.key);
  const phaseConfig = PHASE_CONFIG[phaseKey] ?? PHASE_CONFIG.expansion;

  const alignmentEntry =
    wealthKey !== undefined
      ? (PHASE_ALIGNMENT_MATRIX[phaseKey]?.[wealthKey] ?? null)
      : null;

  const alignmentCopy = alignmentEntry?.copy ?? "";
  const watchOutItems = alignmentEntry?.watchOut ?? [];
  const topActions = dayunCycle.keyActions.slice(0, 3);
  const phaseLabel =
    dayunCycle.phase.length > 0
      ? `${dayunCycle.phase.charAt(0).toUpperCase()}${dayunCycle.phase.slice(1)}`
      : "Unknown";

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
      <div className={`bg-gradient-to-r ${phaseConfig.gradient} px-6 py-5`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">{phaseConfig.icon}</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/80 mb-0.5">
              Current Phase Alignment
            </p>
            <h3 className="text-xl font-bold text-white">
              {phaseConfig.label} Phase × {wealthProfile.dominantArchetype ?? "Your Wealth Code"}
            </h3>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 space-y-5">
        {alignmentCopy.length > 0 && (
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {alignmentCopy}
          </p>
        )}

        {dayunCycle.coreMessage.length > 0 && (
          <div className="rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1">
              Phase directive
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {dayunCycle.coreMessage}
            </p>
          </div>
        )}

        {topActions.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">
              Key actions for this phase
            </p>
            <ul className="space-y-2">
              {topActions.map((action, idx) => (
                <li key={`${action}-${idx}`} className="flex items-start gap-2.5">
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${phaseConfig.gradient} text-[10px] font-bold text-white shadow-sm`}
                    aria-hidden="true"
                  >
                    {idx + 1}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300 leading-snug">{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {watchOutItems.length > 0 && (
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 px-4 py-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-2 w-2 rounded-full bg-rose-400" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-widest text-rose-500 dark:text-rose-400">
                Watch out this phase
              </p>
            </div>
            <ul className="space-y-2.5">
              {watchOutItems.map((item, i) => (
                <li key={`${item}-${i}`} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30 text-[10px] font-bold text-rose-500 dark:text-rose-400"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-xs text-gray-400 dark:text-gray-500 pt-1 border-t border-gray-100 dark:border-gray-700">
          Current DaYun cycle: {dayunCycle.startYear}–{dayunCycle.endYear}
          {" "}· Phase: {phaseLabel}
        </p>
      </div>
    </div>
  );
};

export default PhaseAlignmentCard;
