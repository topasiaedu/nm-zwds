/**
 * LiuMonthCard — Premium Monthly Briefing Component
 *
 * Displays the monthly energetic briefing for the active Liu Month palace.
 * Design mirrors the WealthCode premium aesthetic:
 *  - Gradient hero card with pattern overlay and animated indicators
 *  - 4 life-dimension bar chart (Career / Wealth / Relationships / Health)
 *  - Two-column action grid (Focus On / Watch Out For)
 *  - Two-column lower grid (Win Metrics / Reflect On This)
 */

import React from "react";
import {
  PALACE_MONTH_DATA,
  PALACE_GUIDANCE_DATA,
  SEASON_STYLES,
  type DimensionBar,
  type SeasonStyle,
} from "../../utils/forecast/liuMonthData";

/** English display names for each palace */
const PALACE_ENGLISH: Record<string, string> = {
  "命宫": "Life Palace",
  "兄弟": "Siblings Palace",
  "夫妻": "Spouse Palace",
  "子女": "Children Palace",
  "财帛": "Wealth Palace",
  "疾厄": "Health Palace",
  "迁移": "Travel Palace",
  "交友": "Friends Palace",
  "官禄": "Career Palace",
  "田宅": "Property Palace",
  "福德": "Inner Power Palace",
  "父母": "Parents Palace",
};

/** Returns a human-readable energy descriptor for a score percentage. */
const getScoreLabel = (pct: number): string => {
  if (pct >= 85) return "Peak";
  if (pct >= 70) return "Strong";
  if (pct >= 55) return "Moderate";
  return "Caution";
};

/**
 * Props for the LiuMonthCard component.
 */
export interface LiuMonthCardProps {
  /** The current month number (1–12) */
  selectedMonth: number;
  /** The physical palace number (1–12) that is active for this month */
  palaceNumber: number;
  /** The Chinese name of the active palace (e.g. "官禄") */
  palaceName: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/**
 * HeroCard — gradient banner with season, palace name, priority and core message.
 * Modelled after PremiumHeroCard in WealthCode.tsx.
 */
const HeroCard: React.FC<{
  seasonStyle: SeasonStyle;
  monthName: string;
  currentYear: number;
  palaceName: string;
  palaceEnglish: string;
  palaceNumber: number;
  area: string;
  priority: string;
}> = ({
  seasonStyle,
  monthName,
  currentYear,
  palaceName,
  palaceEnglish,
  palaceNumber,
  area,
  priority,
}) => (
  <div className="relative overflow-hidden rounded-2xl mb-6 shadow-xl">
    {/* Gradient Background */}
    <div
      className="absolute inset-0"
      style={{ background: seasonStyle.headerGradient, opacity: 0.95 }}
    />

    {/* Subtle dot-pattern overlay — matches WealthCode */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,.12) 1px, transparent 1px),
                          radial-gradient(circle at 80% 80%, rgba(255,255,255,.12) 1px, transparent 1px)`,
        backgroundSize: "50px 50px",
      }}
    />

    {/* Content */}
    <div className="relative px-8 py-10">
      <div className="flex items-start justify-between flex-wrap gap-6">

        {/* Left: Title block */}
        <div className="flex-1 min-w-[280px]">
          {/* Animated "Monthly Briefing" badge */}
          <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5 border border-white/20">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-white text-xs font-bold uppercase tracking-wider drop-shadow-lg">
              Monthly Briefing · {area}
            </span>
          </div>

          {/* Month + Year headline */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight drop-shadow-lg">
            {monthName} {currentYear}
          </h1>

          {/* Season tagline */}
          <p className="text-xl md:text-2xl font-semibold text-white/90 mb-4 drop-shadow-md">
            &ldquo;{seasonStyle.tagline}&rdquo;
          </p>

          {/* Core seasonal message */}
          <p className="text-white/85 text-sm leading-relaxed max-w-xl drop-shadow-md mb-6">
            {seasonStyle.coreMessage}
          </p>

          {/* Palace context badge */}
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/20">
            <span className="text-white text-xl font-bold">宮</span>
            <div>
              <div className="text-white font-semibold text-sm">{palaceEnglish}</div>
              <div className="text-white/70 text-xs">{palaceName} · Palace {palaceNumber}</div>
            </div>
          </div>
        </div>

        {/* Right: Priority badge */}
        <div className="flex-shrink-0">
          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-2xl min-w-[160px] text-center">
            <div className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-2">
              This Month&apos;s Priority
            </div>
            <div className="text-white text-base font-bold leading-snug">
              {seasonStyle.icon} {priority}
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
);

/**
 * DimensionBarChart — 4 horizontal bars for Career / Wealth / Relationships / Health.
 * Modelled after ModernBarChart in WealthCode.tsx.
 */
const DimensionBarChart: React.FC<{ bars: readonly DimensionBar[] }> = ({ bars }) => (
  <div className="rounded-2xl shadow-lg border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 p-8 mb-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
        Monthly Energy Profile
      </h3>
      <div className="text-xs px-3 py-1.5 rounded-full text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
        Dimension Scores
      </div>
    </div>

    <div className="space-y-6">
      {bars.map((bar, idx) => {
        const scoreLabel = getScoreLabel(bar.pct);
        return (
          <div key={`${bar.label}-${idx}`} className="group">
            <div className="flex items-center justify-between mb-2">
              {/* Left: icon + label */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow"
                  style={{ background: bar.gradient }}
                >
                  <span className="text-lg">{bar.icon}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {bar.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {scoreLabel}
                  </div>
                </div>
              </div>
              {/* Right: numeric score */}
              <div
                className="text-2xl font-bold"
                style={{ color: bar.color }}
              >
                {bar.pct}
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative">
              <div className="h-4 rounded-full overflow-hidden shadow-inner bg-gray-100 dark:bg-gray-700">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                  style={{ width: `${bar.pct}%`, background: bar.gradient }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

/**
 * ActionColumns — two-column "Focus On" vs "Watch Out For" grid.
 * Modelled after ModernInsights in WealthCode.tsx.
 */
const ActionColumns: React.FC<{
  keyActions: string[];
  watchOut: string[];
  accentColor: string;
}> = ({ keyActions, watchOut, accentColor }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    {/* Focus On */}
    <div className="relative overflow-hidden rounded-2xl p-6 border shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200 dark:border-blue-700/50">
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl bg-gradient-to-br from-blue-400/10 to-indigo-400/10" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div
            className="rounded-lg flex items-center justify-center shadow-lg"
            style={{
              width: "36px",
              height: "36px",
              background: "linear-gradient(135deg, #2563eb 0%, #6366f1 100%)",
              border: "2px solid rgba(37, 99, 235, 0.3)",
            }}
          >
            <span style={{ color: "#ffffff", fontSize: "1rem", fontWeight: "bold" }}>✅</span>
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white">This Month, Focus On</h3>
        </div>
        <ul className="space-y-2.5">
          {keyActions.slice(0, 4).map((action) => (
            <li key={action.slice(0, 40)} className="flex items-start gap-2.5">
              <div
                className="rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
                style={{
                  width: "24px",
                  height: "24px",
                  marginTop: "2px",
                  background: "linear-gradient(135deg, #2563eb 0%, #6366f1 100%)",
                  border: "2px solid rgba(37, 99, 235, 0.3)",
                }}
              >
                <span style={{ color: "#ffffff", fontSize: "0.65rem", fontWeight: "800" }}>▸</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{action}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* Watch Out For */}
    <div className="relative overflow-hidden rounded-2xl p-6 border shadow-md bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border-amber-200 dark:border-amber-700/50">
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl bg-gradient-to-br from-amber-400/10 to-orange-400/10" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div
            className="rounded-lg flex items-center justify-center shadow-lg"
            style={{
              width: "36px",
              height: "36px",
              background: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
              border: "2px solid rgba(217, 119, 6, 0.3)",
            }}
          >
            <span style={{ color: "#ffffff", fontSize: "1rem", fontWeight: "bold" }}>⚠️</span>
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white">Watch Out For</h3>
        </div>
        <ul className="space-y-2.5">
          {watchOut.slice(0, 4).map((warning) => (
            <li key={warning.slice(0, 40)} className="flex items-start gap-2.5">
              <div
                className="rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
                style={{
                  width: "24px",
                  height: "24px",
                  marginTop: "2px",
                  background: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
                  border: "2px solid rgba(217, 119, 6, 0.3)",
                }}
              >
                <span style={{ color: "#ffffff", fontSize: "0.65rem", fontWeight: "800" }}>!</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{warning}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

/**
 * MetricsAndReflection — lower two-column grid showing win metrics and reflection prompts.
 */
const MetricsAndReflection: React.FC<{
  successMetrics: string[];
  reflectionQuestions: string[];
  accentColor: string;
}> = ({ successMetrics, reflectionQuestions, accentColor }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Win Metrics */}
    <div className="rounded-2xl shadow-lg border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div
          className="rounded-lg flex items-center justify-center shadow-lg"
          style={{
            width: "32px",
            height: "32px",
            background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
            border: "2px solid rgba(5, 150, 105, 0.3)",
          }}
        >
          <span style={{ color: "#ffffff", fontSize: "0.85rem", fontWeight: "bold" }}>📊</span>
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-widest">
          Win Metrics
        </h3>
      </div>
      <ul className="space-y-2.5">
        {successMetrics.slice(0, 4).map((metric) => (
          <li key={metric.slice(0, 40)} className="flex items-start gap-2.5">
            <div
              className="rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                width: "20px",
                height: "20px",
                marginTop: "2px",
                background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
              }}
            >
              <span style={{ color: "#ffffff", fontSize: "0.6rem", fontWeight: "800" }}>✓</span>
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{metric}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* Reflect On This */}
    <div className="rounded-2xl shadow-lg border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div
          className="rounded-lg flex items-center justify-center shadow-lg"
          style={{
            width: "32px",
            height: "32px",
            background: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)",
            border: "2px solid rgba(124, 58, 237, 0.3)",
          }}
        >
          <span style={{ color: "#ffffff", fontSize: "0.85rem", fontWeight: "bold" }}>💭</span>
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-widest">
          Reflect On This
        </h3>
      </div>
      <div className="space-y-4">
        {reflectionQuestions.slice(0, 2).map((q) => (
          <div
            key={q.slice(0, 40)}
            className="pl-4 py-2 text-sm italic text-gray-700 dark:text-gray-300 font-medium leading-relaxed"
            style={{ borderLeft: `3px solid ${accentColor}` }}
          >
            &ldquo;{q}&rdquo;
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * LiuMonthCard — Premium monthly briefing for the active Liu Month palace.
 *
 * Sections:
 *  1. GradientSectionHeader (badge "01", title "MONTHLY BRIEFING")
 *  2. HeroCard — gradient banner with season context
 *  3. DimensionBarChart — Career / Wealth / Relationships / Health scores
 *  4. ActionColumns — Focus On vs Watch Out For
 *  5. MetricsAndReflection — Win Metrics vs Reflect On This
 */
export const LiuMonthCard: React.FC<LiuMonthCardProps> = ({
  selectedMonth,
  palaceNumber,
  palaceName,
}) => {
  const monthData = PALACE_MONTH_DATA[palaceName];
  const guidanceData = PALACE_GUIDANCE_DATA[palaceName];

  const currentYear = new Date().getFullYear();
  const monthName = new Date(currentYear, selectedMonth - 1).toLocaleString("default", { month: "long" });

  /** Graceful fallback when palace data is unavailable */
  if (!monthData || !guidanceData) {
    return (
      <div className="w-full py-16 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Monthly forecast data unavailable for this palace.
        </p>
      </div>
    );
  }

  const seasonStyle = SEASON_STYLES[monthData.season];
  const palaceEnglish = PALACE_ENGLISH[palaceName] ?? "Unknown Palace";

  return (
    <div className="p-6 dark:bg-gray-900">
      {/* ── 1. Hero Card ── */}
      <HeroCard
        seasonStyle={seasonStyle}
        monthName={monthName}
        currentYear={currentYear}
        palaceName={palaceName}
        palaceEnglish={palaceEnglish}
        palaceNumber={palaceNumber}
        area={monthData.area}
        priority={monthData.priority}
      />

      {/* ── 2. Dimension Bar Chart ── */}
      <DimensionBarChart bars={monthData.dimensionBars} />

      {/* ── 3. Focus On vs Watch Out For ── */}
      <ActionColumns
        keyActions={guidanceData.keyActions}
        watchOut={guidanceData.watchOut}
        accentColor={seasonStyle.accentColor}
      />

      {/* ── 4. Win Metrics vs Reflect On This ── */}
      <MetricsAndReflection
        successMetrics={guidanceData.successMetrics}
        reflectionQuestions={guidanceData.reflectionQuestions}
        accentColor={seasonStyle.accentColor}
      />
    </div>
  );
};
