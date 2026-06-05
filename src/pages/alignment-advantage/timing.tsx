/**
 * Alignment Advantage — 12-Month Strategic Timing Roadmap
 *
 * Displays a month-by-month traffic-light calendar derived from the user's
 * ZWDS chart. Defaults to the current calendar month.
 * Navigating with ◀ ▶ or clicking any pill in the year-at-a-glance strip
 * replaces the main `LiuMonthCard` content instantly.
 */

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageTransition from "../../components/PageTransition";
import { useProfileContext } from "../../context/ProfileContext";
import { useTierAccess } from "../../context/TierContext";
import { ZWDSCalculator } from "../../utils/zwds/calculator";
import type { ChartData, ChartInput } from "../../utils/zwds/types";
import { getPalaceForAspectLiuMonth } from "../../utils/destiny-navigator/palace-resolver";
import { LiuMonthCard } from "../../components/liumonth/LiuMonthCard";
import MonthGrid, { type MonthPillData } from "../../components/alignment-advantage/MonthGrid";
import {
  PALACE_DATA,
  getSignalColor,
  SIGNAL_LABELS,
  SIGNAL_STYLES,
} from "../../utils/forecast/alignmentTimingData";
import {
  founderReportBackButtonClass,
  founderReportBackIconWrapClass,
  founderReportContainerClass,
  founderReportGlowClass,
  founderReportPageClass,
} from "../../styles/founderReportUi";
import { BrandGradientText } from "../../components/BrandGradientText";
import type { SignalColor } from "../../utils/forecast/alignmentTimingData";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const MONTH_NAMES_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MONTH_NAMES_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const CURRENT_YEAR        = new Date().getFullYear();
const CURRENT_MONTH_INDEX = new Date().getMonth();

// ─────────────────────────────────────────────────────────────────────────────
// Mode Guide — static template, no derivation
// ─────────────────────────────────────────────────────────────────────────────

interface ModeGuideEntry {
  label:       string;
  actions:     string[];
  instruction: string;
  emoji:       string;
}

const MODE_GUIDE: Record<SignalColor, ModeGuideEntry> = {
  green: {
    label:       "Green Light",
    actions:     ["Launch", "Sign", "Hire", "Invest", "Close"],
    instruction: "Execute your prepared moves.",
    emoji:       "🟢",
  },
  yellow: {
    label:       "Yellow Light",
    actions:     ["Plan", "Research", "Test", "Prepare"],
    instruction: "Build. Don't commit yet.",
    emoji:       "🟡",
  },
  red: {
    label:       "Red Light",
    actions:     ["Review", "Protect", "Rest", "Say no"],
    instruction: "Preserve your position.",
    emoji:       "🔴",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────────────────────

function parseBirthHour(birthTime: string): number {
  const match = String(birthTime).match(/(\d+):?(\d+)?\s*(AM|PM)?/i);
  if (!match) return 12;
  let hour = parseInt(match[1], 10);
  if (match[3]?.toUpperCase() === "PM" && hour < 12) hour += 12;
  if (match[3]?.toUpperCase() === "AM" && hour === 12) hour = 0;
  return hour;
}

// ─────────────────────────────────────────────────────────────────────────────
// Access-denied view
// ─────────────────────────────────────────────────────────────────────────────

const AccessDeniedView: React.FC = () => (
  <PageTransition>
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="rounded-3xl border border-gray-200/70 dark:border-white/8 bg-white/80 dark:bg-white/[0.04] p-14 max-w-md text-center shadow-xl">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Access Restricted</h1>
        <Link
          to="/dashboard"
          className="inline-block mt-6 px-8 py-3.5 rounded-full bg-brand-purple text-white font-semibold text-sm hover:bg-brand-purpleDeep transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  </PageTransition>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

const AlignmentAdvantageTimingPage: React.FC = () => {
  const { profiles }              = useProfileContext();
  const { hasAlignmentAdvantage } = useTierAccess();

  const profile = useMemo(
    () => profiles.find((p) => p.is_self) ?? null,
    [profiles]
  );

  const chartData = useMemo((): ChartData | null => {
    if (!profile) return null;
    try {
      const dateObj = new Date(`${profile.birthday}T12:00:00`);
      const input: ChartInput = {
        year:   dateObj.getFullYear(),
        month:  dateObj.getMonth() + 1,
        day:    dateObj.getDate(),
        hour:   parseBirthHour(String(profile.birth_time)),
        gender: profile.gender === "male" ? "male" : "female",
        name:   profile.name,
      };
      return new ZWDSCalculator(input).calculate();
    } catch {
      return null;
    }
  }, [profile]);

  /** Pre-compute month-palace mapping for all 12 months. */
  const monthPills = useMemo((): ReadonlyArray<MonthPillData> => {
    if (!chartData) return [];
    return MONTH_NAMES_SHORT.map((shortName, idx) => {
      const solarMonth   = idx + 1;
      const palaceNumber = getPalaceForAspectLiuMonth("life", chartData, solarMonth, CURRENT_YEAR);
      const palace       = palaceNumber !== null ? chartData.palaces[palaceNumber - 1] : null;
      const palaceData   = palace ? PALACE_DATA[palace.name] : null;
      const stars        = palaceData?.stars ?? 3;
      return {
        monthIndex:  idx,
        shortName,
        palaceName:  palace?.name ?? "",
        stars,
        signal:      getSignalColor(stars),
      };
    });
  }, [chartData]);

  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(CURRENT_MONTH_INDEX);

  const activePill         = monthPills[selectedMonthIndex];
  const activeSolarMonth   = selectedMonthIndex + 1;
  const activePalaceData   = activePill ? PALACE_DATA[activePill.palaceName] : null;
  const activeSignalStyles = activePill ? SIGNAL_STYLES[activePill.signal] : SIGNAL_STYLES.yellow;

  const handlePrev = () => { setSelectedMonthIndex((prev) => (prev === 0 ? 11 : prev - 1)); };
  const handleNext = () => { setSelectedMonthIndex((prev) => (prev === 11 ? 0 : prev + 1)); };

  /**
   * Find the longest consecutive run of green-light months to surface
   * as the "Best Execution Window" callout.
   */
  const bestWindow = useMemo(() => {
    if (monthPills.length === 0) return null;
    let bestStart = -1;
    let bestLen   = 0;
    let curStart  = -1;
    let curLen    = 0;
    for (let i = 0; i < monthPills.length; i++) {
      if (monthPills[i].signal === "green") {
        if (curLen === 0) curStart = i;
        curLen++;
        if (curLen > bestLen) { bestLen = curLen; bestStart = curStart; }
      } else {
        curLen = 0;
      }
    }
    if (bestLen === 0) return null;
    const endIdx  = bestStart + bestLen - 1;
    const palette = PALACE_DATA[monthPills[bestStart].palaceName];
    return {
      startName: MONTH_NAMES_LONG[bestStart],
      endName:   MONTH_NAMES_LONG[endIdx],
      length:    bestLen,
      directive: palette?.directive ?? "Prioritise high-impact execution during this window.",
    };
  }, [monthPills]);

  if (!hasAlignmentAdvantage) return <AccessDeniedView />;

  if (!profile || !chartData || monthPills.length === 0) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-5">
            <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-brand-purple border-t-transparent" />
            <p className="text-sm text-gray-400 dark:text-gray-500">Building your timing roadmap…</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  const activePalaceNumber =
    activePill
      ? chartData.palaces.findIndex((p) => p.name === activePill.palaceName) + 1
      : 1;

  return (
    <PageTransition>
      <div className={founderReportGlowClass} />
      <div className={founderReportPageClass}>
        <div className={founderReportContainerClass}>

          {/* ── Back ── */}
          <Link to="/alignment-advantage" className={founderReportBackButtonClass}>
            <span className={founderReportBackIconWrapClass}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </span>
            Back to Command Centre
          </Link>

          {/* ── Hero ── */}
          <header className="py-16 sm:py-20 text-center max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-purple dark:text-accent-gold mb-4">
              The Alignment Advantage
            </p>
            <BrandGradientText
              as="h1"
              className="text-4xl sm:text-5xl font-bold leading-tight mb-5"
            >
              12-Month Timing Roadmap
            </BrandGradientText>
            <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
              Precision timing intelligence — green, yellow, and red-light windows for
              the next 12 months. No more guessing when to move.
            </p>
          </header>

          {/* ── Best Execution Window banner ── */}
          {bestWindow !== null && (
            <div className="mb-10 rounded-3xl border border-gray-200/60 dark:border-white/8 bg-white/60 dark:bg-white/[0.04] px-8 py-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">
                  Best Execution Window
                </p>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {bestWindow.startName === bestWindow.endName
                  ? bestWindow.startName
                  : `${bestWindow.startName} → ${bestWindow.endName}`}
                <span className="ml-3 text-sm font-medium text-gray-400 dark:text-gray-500">
                  {bestWindow.length} {bestWindow.length === 1 ? "month" : "months"} of green light
                </span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {bestWindow.directive}
              </p>
            </div>
          )}

          {/* ── Month navigator ── */}
          <div className="flex items-center justify-between mb-8">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous month"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200/70 dark:border-white/10 bg-white dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex flex-col items-center gap-3">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                {MONTH_NAMES_LONG[selectedMonthIndex]} {CURRENT_YEAR}
              </h2>
              {activePill !== undefined && (
                <span
                  className={[
                    "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold border",
                    activeSignalStyles.bg,
                    activeSignalStyles.text,
                    activeSignalStyles.border,
                  ].join(" ")}
                >
                  <span className={`inline-block h-2 w-2 rounded-full ${activeSignalStyles.dot}`} aria-hidden="true" />
                  {SIGNAL_LABELS[activePill.signal]}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next month"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200/70 dark:border-white/10 bg-white dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7 7 7" />
              </svg>
            </button>
          </div>

          {/* Monthly context note */}
          {activePalaceData !== null && (
            <div className="rounded-2xl border border-gray-200/60 dark:border-white/8 bg-white/60 dark:bg-white/[0.04] px-6 py-4 mb-10 text-sm flex items-center gap-3">
              <span className={`inline-block h-2.5 w-2.5 rounded-full shrink-0 ${activeSignalStyles.dot}`} aria-hidden="true" />
              <span className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold text-gray-900 dark:text-white">{activePalaceData.area} — </span>
                {activePalaceData.priority}.
                <span className={` ${activeSignalStyles.text} font-medium`}>
                  {activePill?.signal === "green"  && " Optimal window for major moves."}
                  {activePill?.signal === "yellow" && " Good for planning; risky for full execution."}
                  {activePill?.signal === "red"    && " Avoid major commitments — protect and plan."}
                </span>
              </span>
            </div>
          )}

          {/* ── Watch-out bullets for the active month ── */}
          {activePalaceData !== null && activePalaceData.watchOut.length > 0 && (
            <div className="mb-10 rounded-3xl border border-gray-200/60 dark:border-white/8 bg-white/60 dark:bg-white/[0.04] px-8 py-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-2.5 w-2.5 rounded-full bg-rose-400" aria-hidden="true" />
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-500 dark:text-rose-400">
                  Watch Out This Month
                </p>
              </div>
              <ul className="space-y-4">
                {activePalaceData.watchOut.map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30 text-xs font-bold text-rose-600 dark:text-rose-400"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── LiuMonthCard ── */}
          {activePill !== undefined && activePalaceNumber > 0 && (
            <div className="mb-14">
              <LiuMonthCard
                selectedMonth={activeSolarMonth}
                solarYear={CURRENT_YEAR}
                palaceNumber={activePalaceNumber}
                palaceName={activePill.palaceName}
              />
            </div>
          )}

          {/* ── Year-at-a-glance ── */}
          <div className="mb-6">
            <MonthGrid
              months={monthPills}
              selectedMonthIndex={selectedMonthIndex}
              onSelect={setSelectedMonthIndex}
            />
          </div>

          {/* ── Mode Guide strip ── */}
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(["green", "yellow", "red"] as const).map((sig) => {
              const mode   = MODE_GUIDE[sig];
              const styles = SIGNAL_STYLES[sig];
              return (
                <div
                  key={sig}
                  className="rounded-2xl border border-gray-200/60 dark:border-white/8 bg-white/60 dark:bg-white/[0.04] px-6 py-6"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className={`flex h-2.5 w-2.5 rounded-full shrink-0 ${styles.dot}`} aria-hidden="true" />
                    <p className={`text-sm font-bold ${styles.text}`}>{mode.label}</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">{mode.instruction}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {mode.actions.map((action) => (
                      <span
                        key={action}
                        className="rounded-full border border-gray-200/70 dark:border-white/10 bg-gray-50 dark:bg-white/[0.06] px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300"
                      >
                        {action}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 justify-center pb-8">
            {(["green", "yellow", "red"] as const).map((sig) => (
              <span
                key={sig}
                className={[
                  "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold border",
                  SIGNAL_STYLES[sig].bg,
                  SIGNAL_STYLES[sig].text,
                  SIGNAL_STYLES[sig].border,
                ].join(" ")}
              >
                <span className={`inline-block h-2 w-2 rounded-full ${SIGNAL_STYLES[sig].dot}`} aria-hidden="true" />
                {SIGNAL_LABELS[sig]}
              </span>
            ))}
          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default AlignmentAdvantageTimingPage;
