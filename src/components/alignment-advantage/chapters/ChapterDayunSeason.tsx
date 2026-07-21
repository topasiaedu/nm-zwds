/**
 * Alignment Advantage — Chapter 03 · Dayun Season
 *
 * Full 10-year Dayun season analysis restyled for AA visual language.
 * Rebuilds the five Founder Dayun blocks (hero, journey, intensity,
 * guidance, reflection) without mounting Dayun* presentational components.
 */

import React from "react";
import { AreaChart, Area, XAxis, ResponsiveContainer } from "recharts";
import type { DayunCycleExtended, DayunSeason } from "../../../types/dayun";
import type { PhaseAlignmentSeasonKey } from "../../../utils/forecast/wealthContentData";
import type { StrategicData } from "../data/types";
import { C } from "../shared/constants";
import { ReportSheet } from "../shared/ReportSheet";
import { SectionHeader } from "../shared/SectionHeader";
import { PhaseCycleGrid } from "../shared/PhaseCycleGrid";
import { WhatToDoNowList } from "../shared/WhatToDoNowList";
import {
  SeasonPhaseSvg,
  PHASE_LABELS,
  resolvePhaseKey,
} from "../shared/phaseWealthVisuals";

/** Phase accent colors matching PhaseWealthAlignmentSheet / PhaseCycleGrid. */
const PHASE_ACCENT: Record<PhaseAlignmentSeasonKey, string> = {
  expansion: "#16a34a",
  visibility: C.coral,
  consolidation: "#d97706",
  foundation: "#2563eb",
};

/**
 * U-shaped intensity curve values (years 1–10).
 * Preserved from PhaseIntensityChart for identical messaging.
 */
const INTENSITY_BY_YEAR: Record<number, number> = {
  1: 550,
  2: 289,
  3: 144,
  4: 100,
  5: 139,
  6: 244,
  7: 400,
  8: 589,
  9: 794,
  10: 1000,
};

interface ChapterDayunSeasonProps {
  /** Strategic snapshot; dayun guidance is already generated upstream. */
  strategicData: StrategicData;
}

interface CycleJourneyItem {
  years: string;
  season: DayunSeason;
  palace: string;
  label: string;
  isCurrent: boolean;
}

interface IntensityPhaseCallout {
  years: string;
  label: string;
  description: string;
  isCurrent: boolean;
}

interface IntensityChartPoint {
  year: number;
  intensity: number;
  name: string;
}

/** Small indexed section label used inside guidance columns. */
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

/**
 * Resolve intensity for a cycle year (1–10), defaulting to year-1 value.
 */
function getIntensityValue(year: number): number {
  const value = INTENSITY_BY_YEAR[year];
  if (value === undefined) {
    return 550;
  }
  return value;
}

/**
 * Build previous / current / next journey rows from the guided Dayun cycle.
 */
function buildCycleJourney(dayun: DayunCycleExtended): CycleJourneyItem[] {
  const items: CycleJourneyItem[] = [];

  if (dayun.previousCycle !== undefined) {
    items.push({
      years: dayun.previousCycle.years,
      season: dayun.previousCycle.season,
      palace: dayun.previousCycle.palace,
      label: "Previous",
      isCurrent: false,
    });
  }

  items.push({
    years: `${dayun.startYear}-${dayun.endYear}`,
    season: dayun.season,
    palace: dayun.palace,
    label: "Current",
    isCurrent: true,
  });

  if (dayun.nextCycle !== undefined) {
    items.push({
      years: dayun.nextCycle.years,
      season: dayun.nextCycle.season,
      palace: dayun.nextCycle.palace,
      label: "Next",
      isCurrent: false,
    });
  }

  return items;
}

/**
 * Build years 1–5 vs 6–10 callouts based on position in the cycle.
 */
function buildIntensityPhases(currentYearInCycle: number): IntensityPhaseCallout[] {
  const isInFoundationPhase = currentYearInCycle <= 5;

  if (isInFoundationPhase) {
    return [
      {
        years: "1-5",
        label: "Plan & Strategize",
        description: "Find your exact money path",
        isCurrent: true,
      },
      {
        years: "6-10",
        label: "Future: Maximize",
        description: "Scale what works",
        isCurrent: false,
      },
    ];
  }

  return [
    {
      years: "1-5",
      label: "Foundation Built",
      description: "Strategic base established",
      isCurrent: false,
    },
    {
      years: "6-10",
      label: "Maximize & Scale",
      description: "Execute and expand",
      isCurrent: true,
    },
  ];
}

/**
 * Block 1 — Phase hero with cycle grid, phase read, and progress.
 */
const DayunPhaseHero: React.FC<{ dayun: DayunCycleExtended }> = ({ dayun }) => {
  const phaseKey = resolvePhaseKey(dayun.season);
  const phaseLabel = PHASE_LABELS[phaseKey];
  const phaseAccent = PHASE_ACCENT[phaseKey];

  const yearsElapsed = dayun.currentYear - dayun.startYear;
  const totalYears = dayun.endYear - dayun.startYear + 1;
  const yearInCycle = yearsElapsed + 1;
  const progressPct = totalYears > 0 ? (yearsElapsed / totalYears) * 100 : 0;
  const progressRounded = Math.round(progressPct);
  const progressWidth = Math.min(100, Math.max(0, progressPct));

  return (
    <div className="mb-12" data-aa-dayun-hero="">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
        <div>
          <PhaseCycleGrid activePhaseKey={phaseKey} />
        </div>

        <div
          className="rounded-3xl p-6 flex flex-col justify-center h-full min-w-0"
          style={{
            background: `linear-gradient(160deg, ${phaseAccent}10, ${C.white})`,
            border: `1px solid ${phaseAccent}35`,
            boxShadow: "0 4px 24px rgba(0,0,0,0.03)",
          }}
        >
          <div className="flex flex-col sm:flex-row items-start gap-4 mb-5 min-w-0">
            <div
              className="shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center p-2"
              style={{ background: `${phaseAccent}18`, border: `1px solid ${phaseAccent}30` }}
            >
              <SeasonPhaseSvg season={phaseKey} />
            </div>
            <div className="min-w-0 flex-1 w-full sm:w-auto">
              <p
                className="text-[9px] font-bold uppercase tracking-[0.18em] mb-1"
                style={{ color: phaseAccent }}
              >
                Your current phase
              </p>
              <p
                className="text-xl sm:text-2xl font-bold leading-tight break-words"
                style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}
              >
                {phaseLabel}
              </p>
              <p className="text-sm font-semibold mt-1" style={{ color: C.muted }}>
                {dayun.seasonTitle}
              </p>
            </div>
          </div>

          <p className="text-sm leading-relaxed mb-5" style={{ color: C.navy }}>
            {dayun.coreMessage}
          </p>

          <div
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 mb-5"
            style={{ background: `${C.navy}08`, border: `1px solid ${C.border}` }}
          >
            <span className="text-xs font-bold" style={{ color: C.navy }}>
              {dayun.palace}
            </span>
            <span className="text-xs" style={{ color: C.muted }}>
              {dayun.palaceChinese}
            </span>
          </div>

          <div
            className="rounded-2xl p-4"
            style={{ background: C.white, border: `1px solid ${C.border}` }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: C.muted }}>
                10-Year Cycle
              </p>
              <p className="text-sm font-bold" style={{ color: C.navy }}>
                {dayun.startYear}–{dayun.endYear}
              </p>
            </div>
            <p className="text-xs mb-2" style={{ color: C.muted }}>
              Year {yearInCycle} of {totalYears}
            </p>
            <div
              className="h-2 rounded-full overflow-hidden mb-2"
              style={{ background: `${C.border}` }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${progressWidth}%`, background: phaseAccent }}
              />
            </div>
            <p className="text-xs font-bold text-right" style={{ color: phaseAccent }}>
              {progressRounded}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Block 2 — Previous / current / next cycle journey.
 */
const DayunCycleJourney: React.FC<{ dayun: DayunCycleExtended }> = ({ dayun }) => {
  const cycles = buildCycleJourney(dayun);

  return (
    <div className="mb-12" data-aa-dayun-journey="">
      <p
        className="text-[10px] font-bold uppercase tracking-[0.2em] mb-5"
        style={{ color: C.coral }}
      >
        Your Dayun Journey
      </p>
      <div className="space-y-3">
        {cycles.map((cycle) => {
          const phaseKey = resolvePhaseKey(cycle.season);
          const phaseLabel = PHASE_LABELS[phaseKey];
          const accent = PHASE_ACCENT[phaseKey];

          return (
            <div
              key={`${cycle.label}-${cycle.years}`}
              className="flex items-center gap-4 p-4 rounded-2xl"
              style={{
                background: cycle.isCurrent ? `${accent}10` : C.white,
                border: `1.5px solid ${cycle.isCurrent ? `${accent}50` : `${C.border}80`}`,
                opacity: cycle.isCurrent ? 1 : 0.72,
              }}
            >
              <div
                className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center p-1.5"
                style={{
                  background: cycle.isCurrent ? `${accent}18` : `${C.navy}08`,
                  border: `1px solid ${cycle.isCurrent ? `${accent}30` : C.border}`,
                }}
              >
                <SeasonPhaseSvg season={phaseKey} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.16em]"
                    style={{ color: C.muted }}
                  >
                    {cycle.label}
                  </span>
                  {cycle.isCurrent && (
                    <span
                      className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                      style={{ background: accent, color: C.white }}
                    >
                      You are here
                    </span>
                  )}
                </div>
                <p
                  className="text-sm font-bold"
                  style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}
                >
                  {cycle.years} · {phaseLabel}
                </p>
                <p className="text-xs mt-0.5" style={{ color: C.muted }}>
                  {cycle.palace}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Block 3 — 10-year intensity curve with foundation vs maximize callouts.
 */
const DayunIntensityCurve: React.FC<{ dayun: DayunCycleExtended }> = ({ dayun }) => {
  const phaseKey = resolvePhaseKey(dayun.season);
  const phaseAccent = PHASE_ACCENT[phaseKey];
  const currentYearInCycle = dayun.currentYear - dayun.startYear + 1;
  const isInFoundationPhase = currentYearInCycle <= 5;
  const phases = buildIntensityPhases(currentYearInCycle);

  const chartData: IntensityChartPoint[] = Array.from({ length: 10 }, (_, i) => {
    const year = i + 1;
    return {
      year,
      intensity: getIntensityValue(year),
      name: `Year ${year}`,
    };
  });

  const contextualTitle = isInFoundationPhase
    ? "Years 1-5: Strategic Foundation Phase"
    : "Years 6-10: Maximize & Scale Phase";

  const contextualDescription = isInFoundationPhase
    ? "You're in the critical foundation years. Wrong starting point = wasted 10 years. Focus on finding your exact money path and core strengths before expanding."
    : "Foundation established. Time to maximize returns and scale proven strategies. Execute with confidence and prepare for cycle transition.";

  const gradientId = `aa-dayun-intensity-${phaseKey}`;

  return (
    <div
      className="mb-12 rounded-3xl p-6"
      style={{ background: C.white, border: `1px solid ${C.border}` }}
      data-aa-dayun-intensity=""
    >
      <h3
        className="text-lg font-bold mb-2"
        style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}
      >
        {contextualTitle}
      </h3>
      <p className="text-sm mb-6 leading-relaxed" style={{ color: C.muted }}>
        {contextualDescription}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <div className="space-y-3">
          {phases.map((phase) => (
            <div
              key={phase.years}
              className="p-4 rounded-2xl"
              style={{
                background: phase.isCurrent ? `${phaseAccent}10` : `${C.cream}`,
                border: `1.5px solid ${phase.isCurrent ? `${phaseAccent}45` : `${C.border}80`}`,
              }}
            >
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span
                  className="text-sm font-bold"
                  style={{ color: phase.isCurrent ? phaseAccent : C.muted }}
                >
                  Years {phase.years}
                </span>
                {phase.isCurrent && (
                  <span
                    className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                    style={{ background: phaseAccent, color: C.white }}
                  >
                    Now
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold mb-1" style={{ color: C.navy }}>
                {phase.label}
              </p>
              <p className="text-xs" style={{ color: C.muted }}>
                {phase.description}
              </p>
            </div>
          ))}
        </div>

        <div className="w-full" style={{ height: "280px" }} data-aa-dayun-chart="">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 16, right: 20, left: 8, bottom: 16 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={phaseAccent} stopOpacity={0.75} />
                  <stop offset="95%" stopColor={phaseAccent} stopOpacity={0.08} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="year"
                tick={{ fill: C.muted, fontSize: 11 }}
                axisLine={{ stroke: C.border }}
                tickLine={{ stroke: C.border }}
                label={{
                  value: "Year",
                  position: "insideBottom",
                  offset: -8,
                  fill: C.muted,
                  fontSize: 11,
                }}
              />
              <Area
                type="monotone"
                dataKey="intensity"
                stroke={phaseAccent}
                strokeWidth={2.5}
                fill={`url(#${gradientId})`}
                dot={{ fill: phaseAccent, r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

/**
 * Block 4 — What To Do + Watch Out guidance columns.
 */
const DayunCycleGuidance: React.FC<{ dayun: DayunCycleExtended }> = ({ dayun }) => (
  <div className="mb-12 pt-8" style={{ borderTop: `1px solid ${C.border}60` }} data-aa-dayun-guidance="">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {dayun.keyActions.length > 0 && (
        <div data-aa-action-column="">
          <SectionLabel index="01" title="What To Do This Cycle" />
          <WhatToDoNowList actions={dayun.keyActions} />
        </div>
      )}

      {dayun.watchOut.length > 0 && (
        <div data-aa-action-column="">
          <SectionLabel index="02" title="Watch Out For" />
          <div
            className="rounded-3xl p-6 min-h-[220px]"
            style={{ background: `${C.coral}08`, border: `1px solid ${C.coral}35` }}
            data-aa-watch-card=""
          >
            <div className="space-y-4 pt-2">
              {dayun.watchOut.map((item) => (
                <p
                  key={item}
                  className="text-sm leading-snug pl-4 relative"
                  style={{ color: C.navy }}
                  data-aa-numbered-list-row=""
                >
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
);

/**
 * Block 5 — Always-expanded strategic reflection questions.
 */
const DayunReflection: React.FC<{ questions: string[] }> = ({ questions }) => {
  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="pt-8" style={{ borderTop: `1px solid ${C.border}` }} data-aa-dayun-reflection="">
      <p
        className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4"
        style={{ color: C.navy }}
      >
        Strategic Reflection
      </p>
      <div className="space-y-4">
        {questions.map((question, idx) => (
          <p
            key={`reflection-${idx}-${question.slice(0, 24)}`}
            className="text-sm italic pl-4 py-1"
            style={{ color: C.muted, borderLeft: `2px solid ${C.coral}` }}
            data-aa-dayun-reflection-row=""
          >
            &quot;{question}&quot;
          </p>
        ))}
      </div>
    </div>
  );
};

/**
 * Alignment Advantage chapter: full Dayun 10-year season stack
 * (phase hero, journey, intensity, guidance, reflection).
 *
 * Renders a calm unavailable state when `strategicData.dayun` is null.
 */
export const ChapterDayunSeason: React.FC<ChapterDayunSeasonProps> = ({
  strategicData,
}) => {
  const dayun = strategicData.dayun;

  if (dayun === null) {
    return (
      <div id="dayun" className="scroll-mt-16 mb-8">
        <ReportSheet watermark="timeline">
          <SectionHeader
            graphicType="timing"
            chapter="Chapter 03 · Dayun Season"
            title="Your 10-Year Phase"
            subtitle="Where you are in the decade cycle, what to prioritize, and what to watch."
          />
          <div
            className="rounded-3xl p-8 text-center"
            style={{ background: C.white, border: `1px solid ${C.border}` }}
            data-aa-dayun-unavailable=""
          >
            <p
              className="text-sm font-semibold mb-2"
              style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}
            >
              Data unavailable
            </p>
            <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
              Your 10-year phase analysis could not be calculated for this profile.
              Other chapters remain available.
            </p>
          </div>
        </ReportSheet>
      </div>
    );
  }

  return (
    <div id="dayun" className="scroll-mt-16 mb-8">
      <ReportSheet watermark="timeline">
        <SectionHeader
          graphicType="timing"
          chapter="Chapter 03 · Dayun Season"
          title="Your 10-Year Phase"
          subtitle="Where you are in the decade cycle, what to prioritize, and what to watch."
        />

        <DayunPhaseHero dayun={dayun} />
        <DayunCycleJourney dayun={dayun} />
        <DayunIntensityCurve dayun={dayun} />
        <DayunCycleGuidance dayun={dayun} />
        <DayunReflection questions={dayun.reflectionQuestions} />
      </ReportSheet>
    </div>
  );
};
