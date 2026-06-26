/**
 * Single month section for the monthly forecast HTML report.
 * Full content aligned with MONTHLY_REPORT_SAMPLE_DATA.md structure.
 */

import React from "react";
import type { MonthlyForecastMonthEntry } from "../../utils/forecast/buildMonthlyForecastReport";
import type { DimensionBar } from "../../utils/forecast/liuMonthData";

export interface MonthlyReportSectionProps {
  entry: MonthlyForecastMonthEntry;
  year: number;
}

/**
 * Map percentage score to 1–5 star count.
 */
function pctToStarCount(pct: number): number {
  if (pct >= 85) {
    return 5;
  }
  if (pct >= 70) {
    return 4;
  }
  if (pct >= 55) {
    return 3;
  }
  if (pct >= 40) {
    return 2;
  }
  return 1;
}

/**
 * Map percentage score to human-readable fortune label.
 */
function pctToFortuneLabel(pct: number): string {
  if (pct >= 85) {
    return "Excellent";
  }
  if (pct >= 70) {
    return "Good";
  }
  if (pct >= 55) {
    return "Average";
  }
  if (pct >= 40) {
    return "Below Average";
  }
  return "Caution";
}

/**
 * Render star rating as filled/empty stars.
 */
function StarRating({ rating }: { rating: number }): React.ReactElement {
  const clamped = Math.min(5, Math.max(1, rating));
  return (
    <span className="text-amber-500 text-sm tracking-wider" aria-label={`${clamped} star energy`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index}>{index < clamped ? "★" : "☆"}</span>
      ))}
    </span>
  );
}

/**
 * Dimension fortune bar row with star label.
 */
function DimensionBarRow({ bar }: { bar: DimensionBar }): React.ReactElement {
  const stars = pctToStarCount(bar.pct);
  const label = pctToFortuneLabel(bar.pct);

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-800">
          {bar.icon} {bar.label}
        </span>
        <div className="flex items-center gap-2">
          <StarRating rating={stars} />
          <span className="text-xs font-semibold text-gray-600">{label}</span>
        </div>
      </div>
      <div className="h-2.5 rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${bar.pct}%`, background: bar.gradient }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-0.5">{bar.pct}% energy</p>
    </div>
  );
}

/**
 * Section heading with consistent styling.
 */
function SectionHeading({
  children,
  color = "#6b7280",
}: {
  children: React.ReactNode;
  color?: string;
}): React.ReactElement {
  return (
    <h3
      className="text-sm font-bold uppercase tracking-wide mb-2"
      style={{ color }}
    >
      {children}
    </h3>
  );
}

const MonthlyReportSection: React.FC<MonthlyReportSectionProps> = ({ entry, year }) => {
  const { seasonStyle, monthData, guidance, reportCopy } = entry;

  return (
    <section
      className="monthly-report-section px-6 py-10 print:px-8 print:py-12 print:break-after-page"
      style={{ backgroundColor: "#FDFBF7" }}
    >
      <div
        className="rounded-2xl overflow-hidden shadow-lg print:shadow-none border max-w-4xl mx-auto"
        style={{ borderColor: seasonStyle.borderColor }}
      >
        {/* Hero header */}
        <div
          className="px-8 py-8 text-white relative"
          style={{ background: seasonStyle.headerGradient }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 min-w-[240px]">
              <p className="text-xs font-bold uppercase tracking-widest opacity-90 mb-2">
                {seasonStyle.icon} {monthData.season} — {seasonStyle.tagline}
              </p>
              <h2 className="text-3xl font-extrabold mb-1">
                {entry.lunarMonthLabel} · {entry.solarDateRange}, {year}
              </h2>
              <p className="text-lg font-semibold opacity-95">
                {entry.palaceEnglish} ({entry.palaceName}宮)
              </p>
              <p className="text-sm opacity-80 mt-1">
                Palace {entry.palaceNumber} · {monthData.area} · {monthData.priority}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs uppercase tracking-wide opacity-80 mb-1">Overall Energy</p>
              <StarRating rating={entry.starRating} />
              <p className="text-xs opacity-75 mt-1">{entry.starRating}/5 peak month</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-8" style={{ background: seasonStyle.bodyGradient }}>
          {/* Framework notice */}
          <p
            className="text-xs font-medium mb-6 px-3 py-2 rounded-lg border"
            style={{ color: seasonStyle.accentColor, borderColor: seasonStyle.borderColor }}
          >
            Palace Archetype Framework — fortune scores reflect general palace energy patterns for{" "}
            {entry.palaceEnglish}, not individual star combinations in your natal chart.
          </p>

          {/* This month's focus — hero callout */}
          <div
            className="rounded-xl p-6 mb-8 border-l-4"
            style={{
              borderLeftColor: seasonStyle.accentColor,
              backgroundColor: "rgba(255,255,255,0.85)",
              borderColor: seasonStyle.borderColor,
            }}
          >
            <SectionHeading color={seasonStyle.accentColor}>This Month&apos;s Focus</SectionHeading>
            <p className="text-lg font-semibold text-gray-900 leading-relaxed">
              {reportCopy.monthsFocus}
            </p>
          </div>

          {/* Strategic context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <SectionHeading>Why This Month Matters</SectionHeading>
              <p className="text-gray-800 leading-relaxed text-sm">{reportCopy.whyThisMonthMatters}</p>
            </div>
            <div>
              <SectionHeading>What to Expect</SectionHeading>
              <p className="text-gray-800 leading-relaxed text-sm">{reportCopy.whatToExpect}</p>
            </div>
          </div>

          {/* Seasonal context */}
          <div
            className="rounded-lg px-4 py-3 mb-8 text-sm text-gray-700 border"
            style={{ borderColor: seasonStyle.borderColor, backgroundColor: "rgba(255,255,255,0.5)" }}
          >
            <span className="font-semibold" style={{ color: seasonStyle.accentColor }}>
              {seasonStyle.icon} {monthData.season} Season:
            </span>{" "}
            {seasonStyle.coreMessage}
          </div>

          {/* Monthly fortune grid */}
          <div className="mb-8">
            <SectionHeading>Monthly Fortune by Life Area</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 mt-4">
              {monthData.dimensionBars.map((bar) => (
                <DimensionBarRow key={bar.label} bar={bar} />
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div
              className="rounded-xl p-5 border"
              style={{ borderColor: seasonStyle.borderColor, backgroundColor: "rgba(255,255,255,0.7)" }}
            >
              <SectionHeading color={seasonStyle.accentColor}>🎯 Primary Goal</SectionHeading>
              <p className="text-gray-800 text-sm leading-relaxed">{reportCopy.primaryGoal}</p>
            </div>
            <div
              className="rounded-xl p-5 border"
              style={{ borderColor: seasonStyle.borderColor, backgroundColor: "rgba(255,255,255,0.7)" }}
            >
              <SectionHeading color={seasonStyle.accentColor}>💡 Quick Takeaway</SectionHeading>
              <p className="text-gray-800 text-sm leading-relaxed italic">{reportCopy.quickTakeaway}</p>
            </div>
          </div>

          {/* Actions grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div
              className="rounded-xl p-5 border bg-white/60"
              style={{ borderColor: "#86efac" }}
            >
              <SectionHeading color="#15803d">Recommended Actions (Do)</SectionHeading>
              <ul className="space-y-2.5 mt-3">
                {guidance.keyActions.map((action) => (
                  <li key={action} className="flex gap-2 text-sm text-gray-700 leading-relaxed">
                    <span className="text-green-600 font-bold shrink-0">✓</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="rounded-xl p-5 border bg-white/60"
              style={{ borderColor: "#fca5a5" }}
            >
              <SectionHeading color="#b91c1c">Things to Avoid (Don&apos;t)</SectionHeading>
              <ul className="space-y-2.5 mt-3">
                {guidance.watchOut.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-gray-700 leading-relaxed">
                    <span className="text-red-500 font-bold shrink-0">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Win metrics + reflection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className="rounded-xl p-5 border bg-white/70"
              style={{ borderColor: "#6ee7b7" }}
            >
              <SectionHeading color="#047857">📊 Win Metrics — How You&apos;ll Know You Succeeded</SectionHeading>
              <ul className="space-y-2.5 mt-3">
                {guidance.successMetrics.map((metric) => (
                  <li key={metric} className="flex gap-2 text-sm text-gray-700 leading-relaxed">
                    <span className="text-emerald-600 font-bold shrink-0">▸</span>
                    <span>{metric}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="rounded-xl p-5 border bg-white/70"
              style={{ borderColor: "#c4b5fd" }}
            >
              <SectionHeading color="#6d28d9">💭 Reflect On This</SectionHeading>
              <div className="space-y-3 mt-3">
                {guidance.reflectionQuestions.map((question) => (
                  <blockquote
                    key={question}
                    className="text-sm italic text-gray-700 leading-relaxed pl-3 border-l-2"
                    style={{ borderLeftColor: seasonStyle.accentColor }}
                  >
                    &ldquo;{question}&rdquo;
                  </blockquote>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MonthlyReportSection;
