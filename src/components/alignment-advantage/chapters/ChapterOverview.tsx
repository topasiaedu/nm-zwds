/**
 * Shared Overview / cover chapter for Alignment Advantage.
 * Used by the in-app Document Viewer and the print/PDF route so both
 * surfaces render the same at-a-glance profile content.
 */

import React from "react";
import type { ChartData } from "../../../utils/zwds/types";
import type { FormationProfile, StructureLabel } from "../../../utils/forecast/structure/formationProfiles";
import type { StrategicData } from "../data/types";
import { C } from "../shared/constants";
import { PageContextStrip } from "../shared/PageContextStrip";
import { SectionWatermark } from "../shared/SectionWatermark";
import { firstSentences } from "../shared/textHelpers";
import { TwelvePalaceMiniGrid } from "../shared/TwelvePalaceMiniGrid";

/** Phase chip config passed from the parent (matches PHASE_DISPLAY derivation). */
export interface OverviewPhaseConfig {
  label: string;
  bgColor: string;
  textColor: string;
}

export interface ChapterOverviewProps {
  /** Display name shown in the hero eyebrow. */
  profileName: string;
  chartData: ChartData;
  strategicData: StrategicData;
  strLabel: StructureLabel;
  formation: FormationProfile;
  phaseConfig: OverviewPhaseConfig;
  /** Hex colour for the monthly signal accent (green / coral / gold). */
  signalHex: string;
}

/**
 * Overview cover: hero, 3-stat chips, wealth archetype strip, and mini grid.
 * Visuals must stay identical between web and print consumers.
 */
export const ChapterOverview: React.FC<ChapterOverviewProps> = ({
  profileName,
  chartData,
  strategicData,
  strLabel,
  formation,
  phaseConfig,
  signalHex,
}) => {
  return (
    <section id="cover" className="scroll-mt-16 mb-32 pt-16 relative overflow-x-hidden bg-white rounded-[40px] p-6 sm:p-8 md:p-10 lg:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-[#e8ddd0]/50">
      <SectionWatermark type="compass" />
      <PageContextStrip label="Overview · Your Profile at a Glance" />

      {/* Hero */}
      <div className="mb-16 relative z-10 min-w-0 max-w-full">
        <div className="absolute -top-10 -right-10 w-64 h-64 opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" fill="none" stroke="#e8642d" strokeWidth="0.5">
            <circle cx="50" cy="50" r="45" strokeDasharray="2 4" />
            <circle cx="50" cy="50" r="35" />
            <path d="M50 5 L50 95 M5 50 L95 50" />
            <circle cx="50" cy="50" r="10" fill="#e8642d" fillOpacity="0.2" />
          </svg>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] mb-4" style={{ color: C.coral }}>
          Strategic Playbook · {profileName}
        </p>
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 max-w-full break-words"
          style={{
            fontFamily: "Georgia,'Times New Roman',serif",
            letterSpacing: "-0.03em",
            background: `linear-gradient(135deg, ${C.navy} 0%, ${C.coralDark} 55%, ${C.coral} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Your Alignment<br />Advantage
        </h1>
        <p className="text-lg leading-relaxed mt-3 max-w-lg" style={{ color: C.muted }}>
          {firstSentences(
            "A personalised strategic playbook built from your Purple Star Astrology chart - giving you clarity on how you are wired, when to move, and how to build wealth on your terms.",
            2
          )}
        </p>
      </div>

      {/* 3-stat summary cards: cream with coral left-border accent */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full min-w-0">
        {/* Stat 1: Structure */}
        <div
          className="rounded-2xl p-5 flex flex-col gap-3 w-full min-w-0"
          style={{
            background: C.cream,
            border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
            borderLeft: `3px solid ${C.coral}`,
          }}
        >
          <p className="text-[8px] font-bold uppercase tracking-[0.24em]" style={{ color: C.coral }}>
            Operating Structure
          </p>
          <div>
            <p className="text-lg font-bold leading-tight mb-1" style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}>
              {strLabel.label}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{formation.englishName}</p>
          </div>
        </div>

        {/* Stat 2: Timing Phase */}
        <div
          className="rounded-2xl p-5 flex flex-col gap-3 w-full min-w-0"
          style={{
            background: C.cream,
            border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
            borderLeft: `3px solid ${C.navy}`,
          }}
        >
          <p className="text-[8px] font-bold uppercase tracking-[0.24em]" style={{ color: C.navy }}>
            Timing Phase
          </p>
          <div>
            <p className="text-lg font-bold leading-tight mb-1" style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}>
              {phaseConfig.label}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
              {strategicData.dayun?.startYear ?? ""}-{strategicData.dayun?.endYear ?? ""}
            </p>
          </div>
        </div>

        {/* Stat 3: Monthly Signal */}
        <div
          className="rounded-2xl p-5 flex flex-col gap-3 w-full min-w-0"
          style={{
            background: C.cream,
            border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
            borderLeft: `3px solid ${signalHex}`,
          }}
        >
          <p className="text-[8px] font-bold uppercase tracking-[0.24em]" style={{ color: signalHex }}>
            {strategicData.monthName} Signal
          </p>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: signalHex }} />
              <p className="text-lg font-bold leading-tight" style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}>
                {strategicData.signal === "green" ? "Green Light"
                  : strategicData.signal === "yellow" ? "Yellow Light" : "Red Light"}
              </p>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
              {strategicData.palaceArea}
            </p>
          </div>
        </div>
      </div>

      {/*
        Print: wealth strip + chart as one unit so the mini-grid is not stranded
        alone on a sparse second page after the archetype banner.
      */}
      <div data-aa-overview-tail="">
        {/* Wealth archetype highlight */}
        <div
          className="mt-4 rounded-2xl px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full min-w-0"
          style={{
            background: `linear-gradient(135deg, ${C.navy}ee, ${C.navyMid}ee)`,
            border: `1px solid ${C.coral}15`, boxShadow: "0 4px 24px rgba(232,100,45,0.03)",
          }}
        >
          <div className="w-full min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.22em] mb-1.5" style={{ color: C.coral }}>
              Dominant Wealth Archetype
            </p>
            <p
              className="text-lg font-bold"
              style={{ color: C.white, fontFamily: "Georgia,'Times New Roman',serif" }}
            >
              {strategicData.wealthArchetype}
            </p>
          </div>
          <p
            className="text-xs leading-relaxed w-full min-w-0 md:max-w-xs md:text-right"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            {strategicData.dayun?.coreMessage ?? ""}
          </p>
        </div>
        {/* 12-Palace Mini Grid: full chart at a glance (keep label+grid together in print) */}
        <div className="mt-6" data-aa-chart-block="">
          <p
            className="text-[8px] font-bold uppercase tracking-[0.24em] mb-3 text-center"
            style={{ color: C.muted }}
          >
            Your Full 12-Palace Chart · Each chapter below unpacks one zone
          </p>
          <TwelvePalaceMiniGrid chartData={chartData} />
        </div>
      </div>
    </section>
  );
};
