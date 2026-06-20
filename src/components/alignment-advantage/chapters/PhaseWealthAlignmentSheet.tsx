import React from "react";
import { C } from "../shared/constants";
import { ReportSheet } from "../shared/ReportSheet";
import { PhaseCycleGrid } from "../shared/PhaseCycleGrid";
import { firstSentences } from "../shared/textHelpers";
import type { PhaseAlignmentSeasonKey } from "../../../utils/forecast/wealthContentData";
import type { WealthCodeKey } from "../../../utils/zwds/analysis_constants/wealth_code_mapping";
import { getPhaseWealthActions } from "../shared/phaseWealthGuidance";
import {
  SeasonPhaseSvg,
  PhaseActionsSvg,
  RiskShieldSvg,
  PHASE_LABELS,
} from "../shared/phaseWealthVisuals";

const PHASE_ACCENT: Record<PhaseAlignmentSeasonKey, string> = {
  expansion: "#16a34a",
  visibility: C.coral,
  consolidation: "#d97706",
  foundation: "#2563eb",
};

interface PhaseAlignmentEntry {
  copy: string;
  watchOut: string[];
}

interface PhaseWealthAlignmentSheetProps {
  phaseKey: PhaseAlignmentSeasonKey;
  alignEntry: PhaseAlignmentEntry | null;
  wealthKey?: WealthCodeKey;
  wealthArchetype?: string;
}

const SectionLabel: React.FC<{ index: string; title: string }> = ({ index, title }) => (
  <div className="flex items-center gap-3 mb-4">
    <span
      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
      style={{ background: `${C.coral}18`, color: C.coral, border: `1px solid ${C.coral}30` }}
    >
      {index}
    </span>
    <p className="text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: C.coral }}>
      {title}
    </p>
  </div>
);

/** Ch02 page 2: cycle map hero, phase read, and action plan. */
export const PhaseWealthAlignmentSheet: React.FC<PhaseWealthAlignmentSheetProps> = ({
  phaseKey,
  alignEntry,
  wealthKey,
  wealthArchetype,
}) => {
  const phaseLabel = PHASE_LABELS[phaseKey];
  const phaseAccent = PHASE_ACCENT[phaseKey];
  const phaseDirective = alignEntry !== null ? firstSentences(alignEntry.copy, 2) : "";
  const archetypeLabel = wealthArchetype ?? "your wealth style";
  const actions = getPhaseWealthActions(phaseKey, wealthKey);

  return (
    <ReportSheet watermark="waves">
      {/* Single header — no duplicate grey strip */}
      <div className="mb-10 relative z-10">
        <div
          className="w-full h-px mb-6"
          style={{ background: `linear-gradient(90deg, ${C.border} 0%, transparent 100%)` }}
        />
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] mb-3" style={{ color: C.coral }}>
          Chapter 02 · Wealth Acceleration · Page 2 of 2
        </p>
        <h2
          className="text-3xl font-bold leading-tight mb-2"
          style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif", letterSpacing: "-0.02em" }}
        >
          Your Timing Read
        </h2>
        <p className="text-sm leading-relaxed max-w-lg" style={{ color: C.muted }}>
          Where you sit in the business cycle right now — and what to focus on during this period.
        </p>
      </div>

      {/* Hero: 2×2 cycle grid + side read */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div>
          <PhaseCycleGrid activePhaseKey={phaseKey} />
        </div>

        <div
          className="rounded-3xl p-6 flex flex-col justify-center h-full"
          style={{
            background: `linear-gradient(160deg, ${phaseAccent}10, ${C.white})`,
            border: `1px solid ${phaseAccent}35`,
            boxShadow: "0 4px 24px rgba(0,0,0,0.03)",
          }}
        >
          <div className="flex items-start gap-4 mb-5">
            <div
              className="shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center p-2"
              style={{ background: `${phaseAccent}18`, border: `1px solid ${phaseAccent}30` }}
            >
              <SeasonPhaseSvg season={phaseKey} />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] mb-1" style={{ color: phaseAccent }}>
                Your current phase
              </p>
              <p
                className="text-2xl font-bold leading-tight"
                style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}
              >
                {phaseLabel}
              </p>
            </div>
          </div>

          {alignEntry !== null && (
            <>
              <p className="text-sm font-semibold leading-snug mb-4" style={{ color: C.navy }}>
                {phaseDirective}
              </p>
              <p className="text-xs leading-snug" style={{ color: C.muted }}>
                Applied to {archetypeLabel}.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Action plan — two equal columns */}
      <div className="pt-8" style={{ borderTop: `1px solid ${C.border}60` }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {actions.length > 0 && (
            <div>
              <SectionLabel index="01" title="What To Do Now" />
              <div className="rounded-3xl overflow-hidden relative min-h-[220px]" style={{ background: C.navy }}>
                <div className="absolute right-5 top-5 w-20 h-20 opacity-15 pointer-events-none">
                  <PhaseActionsSvg />
                </div>
                <div className="p-6 space-y-4 relative z-10">
                  {actions.map((action, idx) => (
                    <div key={action} className="flex items-start gap-3">
                      <span
                        className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                        style={{ background: `${C.coral}30`, color: C.white, border: `1px solid ${C.coral}50` }}
                      >
                        {idx + 1}
                      </span>
                      <p className="text-sm leading-snug" style={{ color: "rgba(255,255,255,0.9)" }}>
                        {action}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {alignEntry !== null && alignEntry.watchOut.length > 0 && (
            <div>
              <SectionLabel index="02" title="What To Watch During This Period" />
              <div
                className="rounded-3xl p-6 min-h-[220px]"
                style={{ background: C.white, border: `1px solid ${C.coral}35` }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 shrink-0">
                    <RiskShieldSvg />
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: C.coral }}>
                    Common mistakes in this phase
                  </p>
                </div>
                <div className="space-y-3">
                  {alignEntry.watchOut.map((item) => (
                    <p key={item} className="text-sm leading-snug pl-3 relative" style={{ color: C.navy }}>
                      <span
                        className="absolute left-0 top-[0.5em] w-1.5 h-1.5 rounded-full"
                        style={{ background: C.coral }}
                      />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ReportSheet>
  );
};
