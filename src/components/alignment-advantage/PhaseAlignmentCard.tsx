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
import type { DayunCycleExtended } from "../../types/dayun";
import type { WealthCodeAnalysisResult } from "../../utils/zwds/analysis/wealthCodeAnalysis";
import {
  PHASE_ALIGNMENT_MATRIX,
  type PhaseAlignmentSeasonKey,
  type PhaseAlignmentWealthKey,
} from "../../utils/forecast/wealthContentData";

type SeasonKey = PhaseAlignmentSeasonKey;
type WealthKey = PhaseAlignmentWealthKey;

// ─────────────────────────────────────────────────────────────────────────────
// Season styles
// ─────────────────────────────────────────────────────────────────────────────

const SEASON_CONFIG: Record<SeasonKey, { gradient: string; icon: string; label: string }> = {
  spring: { gradient: "from-emerald-500 to-green-600",   icon: "🌱", label: "Spring" },
  summer: { gradient: "from-amber-500 to-orange-600",    icon: "☀️", label: "Summer" },
  autumn: { gradient: "from-orange-500 to-red-600",      icon: "🍂", label: "Autumn" },
  winter: { gradient: "from-blue-500 to-indigo-600",     icon: "❄️", label: "Winter" },
};

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface PhaseAlignmentCardProps {
  /** Full DaYun cycle with guidance populated by `generateDayunGuidance`. */
  dayunCycle: DayunCycleExtended;
  /** Full wealth code analysis result from `analyzeWealthCode`. */
  wealthProfile: WealthCodeAnalysisResult;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * PhaseAlignmentCard displays the intersection of the user's current DaYun
 * season and their dominant wealth code archetype.
 */
const PhaseAlignmentCard: React.FC<PhaseAlignmentCardProps> = ({
  dayunCycle,
  wealthProfile,
}) => {
  const season = dayunCycle.season as SeasonKey;
  const wealthKey = wealthProfile.codes[0]?.key as WealthKey | undefined;
  const seasonConfig = SEASON_CONFIG[season] ?? SEASON_CONFIG.spring;

  const alignmentEntry =
    wealthKey !== undefined
      ? (PHASE_ALIGNMENT_MATRIX[season]?.[wealthKey] ?? null)
      : null;

  const alignmentCopy = alignmentEntry?.copy ?? "";
  const watchOutItems = alignmentEntry?.watchOut ?? [];

  /** Top 3 key actions from guidance, already populated by generateDayunGuidance. */
  const topActions = dayunCycle.keyActions.slice(0, 3);

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
      {/* Gradient header */}
      <div className={`bg-gradient-to-r ${seasonConfig.gradient} px-6 py-5`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">{seasonConfig.icon}</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/80 mb-0.5">
              Current Phase Alignment
            </p>
            <h3 className="text-xl font-bold text-white">
              {seasonConfig.label} Season × {wealthProfile.dominantArchetype ?? "Your Wealth Code"}
            </h3>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="bg-white dark:bg-gray-800 p-6 space-y-5">
        {/* Alignment narrative */}
        {alignmentCopy.length > 0 && (
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {alignmentCopy}
          </p>
        )}

        {/* Season core message */}
        {dayunCycle.coreMessage.length > 0 && (
          <div className="rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1">
              Season directive
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {dayunCycle.coreMessage}
            </p>
          </div>
        )}

        {/* Top 3 key actions */}
        {topActions.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">
              Key actions for this season
            </p>
            <ul className="space-y-2">
              {topActions.map((action, idx) => (
                <li key={`${action}-${idx}`} className="flex items-start gap-2.5">
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${seasonConfig.gradient} text-[10px] font-bold text-white shadow-sm`}
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

        {/* Watch out this season */}
        {watchOutItems.length > 0 && (
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 px-4 py-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-2 w-2 rounded-full bg-rose-400" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-widest text-rose-500 dark:text-rose-400">
                Watch out this season
              </p>
            </div>
            <ul className="space-y-2.5">
              {watchOutItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30 text-[10px] font-bold text-rose-500 dark:text-rose-400" aria-hidden="true">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Cycle year range */}
        <p className="text-xs text-gray-400 dark:text-gray-500 pt-1 border-t border-gray-100 dark:border-gray-700">
          Current DaYun cycle: {dayunCycle.startYear}–{dayunCycle.endYear}
          {" "}· Phase: {dayunCycle.phase.charAt(0).toUpperCase() + dayunCycle.phase.slice(1)}
        </p>
      </div>
    </div>
  );
};

export default PhaseAlignmentCard;
