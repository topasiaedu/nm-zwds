/**
 * Alignment Advantage — Home Base Portal
 *
 * The strategic command centre for the Alignment Advantage programme.
 * Synthesises the user's wealth archetype, DaYun season, and current-month
 * traffic-light signal into a single at-a-glance view, surfaces navigation
 * cards to the Timing Roadmap and Wealth Blueprint, and hosts the
 * Playbook download and the Decision Framework.
 *
 * Access is gated behind the `hasAlignmentAdvantage` feature flag.
 * Always uses the account-owner's (`is_self`) profile — one per account.
 */

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageTransition from "../../components/PageTransition";
import { useProfileContext } from "../../context/ProfileContext";
import { useTierAccess } from "../../context/TierContext";
import { useAlertContext } from "../../context/AlertContext";
import { ZWDSCalculator } from "../../utils/zwds/calculator";
import type { ChartData, ChartInput } from "../../utils/zwds/types";
import { analyzeWealthCode } from "../../utils/zwds/analysis/wealthCodeAnalysis";
import { calculateCurrentDayunCycle } from "../../utils/dayun/calculator";
import { generateDayunGuidance } from "../../utils/dayun/guidanceGenerator";
import {
  getPalaceForAspectLiuMonth,
  getLiuMonthAnchorFromLocalDate,
} from "../../utils/destiny-navigator/palace-resolver";
import {
  PALACE_DATA,
  getSignalColor,
  SIGNAL_LABELS,
  SIGNAL_STYLES,
  type SignalColor,
} from "../../utils/forecast/alignmentTimingData";
import { supabase } from "../../utils/supabase-client";
import {
  exportPdfViaServer,
  resolvePrintPageOrigin,
} from "../../utils/pdfExportServer";
import { FRAMEWORK_RECOMMENDATIONS } from "../../utils/forecast/wealthContentData";
import {
  founderReportBackButtonClass,
  founderReportBackIconWrapClass,
  founderReportContainerClass,
  founderReportGlowClass,
  founderReportPageClass,
} from "../../styles/founderReportUi";
import { BrandGradientText } from "../../components/BrandGradientText";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type AxisAnswer = boolean | null;

interface DecisionFrameworkState {
  structural: AxisAnswer;
  timing: AxisAnswer;
  wealth: AxisAnswer;
}

// ─────────────────────────────────────────────────────────────────────────────
// Season display config
// ─────────────────────────────────────────────────────────────────────────────

const SEASON_DISPLAY: Record<
  string,
  { label: string; icon: string; gradient: string; textClass: string }
> = {
  spring: {
    label:     "Spring",
    icon:      "🌱",
    gradient:  "from-emerald-500 to-green-600",
    textClass: "text-emerald-700 dark:text-emerald-300",
  },
  summer: {
    label:     "Summer",
    icon:      "☀️",
    gradient:  "from-amber-500 to-orange-600",
    textClass: "text-amber-700 dark:text-amber-300",
  },
  autumn: {
    label:     "Autumn",
    icon:      "🍂",
    gradient:  "from-orange-500 to-red-600",
    textClass: "text-orange-700 dark:text-orange-300",
  },
  winter: {
    label:     "Winter",
    icon:      "❄️",
    gradient:  "from-blue-500 to-indigo-600",
    textClass: "text-blue-700 dark:text-blue-300",
  },
};

// FRAMEWORK_RECOMMENDATIONS imported from wealthContentData.ts

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Single synthesis stat used in the 3-column snapshot strip. */
const SnapshotCell: React.FC<{
  label:   string;
  value:   string;
  sub?:    string;
  accent:  string;
  dot?:    React.ReactNode;
}> = ({ label, value, sub, accent, dot }) => (
  <div className="flex flex-col items-center text-center gap-4 py-10 px-6 rounded-3xl bg-white/70 dark:bg-white/[0.04] border border-gray-200/60 dark:border-white/8 shadow-sm">
    {dot !== undefined && (
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent}`}>
        {dot}
      </div>
    )}
    <div className="space-y-1">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500">
        {label}
      </p>
      <p className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{value}</p>
      {sub !== undefined && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{sub}</p>
      )}
    </div>
  </div>
);

/** Deep-dive navigation card. */
const NavCard: React.FC<{
  to:          string;
  title:       string;
  description: string;
  gradient:    string;
}> = ({ to, title, description, gradient }) => (
  <Link
    to={to}
    className="group relative overflow-hidden rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
    {/* subtle dot texture */}
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
      aria-hidden="true"
    />
    <div className="relative z-10 p-10">
      <h3 className="text-2xl font-bold text-white mb-4 leading-snug">{title}</h3>
      <p className="text-white/75 text-sm leading-relaxed mb-8">{description}</p>
      <span className="inline-flex items-center gap-2 text-white font-semibold text-sm group-hover:gap-3 transition-all">
        Explore
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </div>
  </Link>
);

/** A single Decision Framework axis card. */
const AxisGauge: React.FC<{
  title:        string;
  description:  string;
  value:        string;
  isAutoFilled: boolean;
  answer:       AxisAnswer;
  onAnswer?:    (value: boolean) => void;
  alignedColor: string;
}> = ({ title, description, value, isAutoFilled, answer, onAnswer, alignedColor }) => {
  const isAligned    = answer === true;
  const isNotAligned = answer === false;

  return (
    <div
      className={[
        "rounded-2xl border p-8 flex flex-col gap-5 transition-all duration-300",
        isAligned
          ? "border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/80 dark:bg-emerald-900/15"
          : isNotAligned
          ? "border-rose-200 dark:border-rose-800/60 bg-rose-50/80 dark:bg-rose-900/15"
          : "border-gray-200/70 dark:border-gray-700/60 bg-white/70 dark:bg-white/[0.04]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500">
            {title}
          </p>
          <p className={`text-base font-bold ${alignedColor}`}>{value}</p>
        </div>
        {isAutoFilled && (
          <span className="shrink-0 inline-flex items-center rounded-full bg-brand-purple/8 dark:bg-accent-gold/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-purple dark:text-accent-gold">
            Auto
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1">
        {description}
      </p>

      {onAnswer !== undefined ? (
        <div className="flex gap-3 mt-auto pt-2">
          <button
            type="button"
            onClick={() => { onAnswer(true); }}
            className={[
              "flex-1 rounded-xl py-3 text-sm font-semibold border transition-all duration-200",
              isAligned
                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-emerald-400",
            ].join(" ")}
          >
            Yes, aligned
          </button>
          <button
            type="button"
            onClick={() => { onAnswer(false); }}
            className={[
              "flex-1 rounded-xl py-3 text-sm font-semibold border transition-all duration-200",
              isNotAligned
                ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-rose-400",
            ].join(" ")}
          >
            Not aligned
          </button>
        </div>
      ) : (
        <div className="mt-auto pt-2">
          <div
            className={[
              "w-full rounded-xl py-3 text-sm font-semibold text-center",
              isAligned
                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                : "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300",
            ].join(" ")}
          >
            {isAligned ? "Aligned" : "Caution"}
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Access-denied view
// ─────────────────────────────────────────────────────────────────────────────

const AccessDeniedView: React.FC = () => (
  <PageTransition>
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="rounded-3xl border border-gray-200/70 dark:border-white/8 bg-white/80 dark:bg-white/[0.04] p-14 max-w-md text-center shadow-xl">
        <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-brand-purple/8 flex items-center justify-center">
          <svg className="w-8 h-8 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Access Restricted</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-10 leading-relaxed text-sm">
          The Alignment Advantage is a premium programme. Contact us to unlock your strategic command centre.
        </p>
        <Link
          to="/dashboard"
          className="inline-block px-8 py-3.5 rounded-full bg-brand-purple text-white font-semibold text-sm hover:bg-brand-purpleDeep transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  </PageTransition>
);

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
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
// Main page
// ─────────────────────────────────────────────────────────────────────────────

const AlignmentAdvantage: React.FC = () => {
  const { profiles }             = useProfileContext();
  const { hasAlignmentAdvantage } = useTierAccess();
  const { showAlert }             = useAlertContext();

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

  const strategicData = useMemo(() => {
    if (!chartData) return null;

    const wealthProfile = analyzeWealthCode(chartData);
    const rawDayun      = calculateCurrentDayunCycle(chartData);
    const dayun         = rawDayun ? generateDayunGuidance(rawDayun) : null;

    const { solarYear, lunarMonth }    = getLiuMonthAnchorFromLocalDate();
    const currentMonthPalaceNumber     = getPalaceForAspectLiuMonth("life", chartData, lunarMonth, solarYear);
    const currentMonthPalace           = currentMonthPalaceNumber !== null ? chartData.palaces[currentMonthPalaceNumber - 1] : null;
    const palaceData                   = currentMonthPalace ? PALACE_DATA[currentMonthPalace.name] : null;
    const signal: SignalColor          = palaceData ? getSignalColor(palaceData.stars) : "yellow";
    const monthName                    = new Date().toLocaleString("en-US", { month: "long" });

    return {
      wealthArchetype:  wealthProfile.dominantArchetype ?? "Your Wealth Code",
      season:           dayun?.season ?? null,
      seasonTitle:      dayun?.seasonTitle ?? "",
      signal,
      signalLabel:      SIGNAL_LABELS[signal],
      monthName,
      palaceArea:       palaceData?.area ?? "",
      palacePriority:   palaceData?.priority ?? "",
      timingAligned:    signal === "green",
      wealthAligned:    (wealthProfile.codes[0]?.score ?? 0) >= 5,
    };
  }, [chartData]);

  const [framework, setFramework] = useState<DecisionFrameworkState>({
    structural: null,
    timing:     null,
    wealth:     null,
  });

  const [pdfLoading, setPdfLoading] = useState<boolean>(false);

  const timingAnswer: AxisAnswer = strategicData ? strategicData.timingAligned : null;
  const wealthAnswer: AxisAnswer = strategicData ? strategicData.wealthAligned : null;

  const frameworkScore: number = [
    framework.structural === true,
    timingAnswer === true,
    wealthAnswer === true,
  ].filter(Boolean).length;

  const allAnswered   = framework.structural !== null;
  const recommendation = allAnswered ? FRAMEWORK_RECOMMENDATIONS[frameworkScore] : null;

  /**
   * Open the print page directly in a new tab so the user can Ctrl+P → Save as PDF.
   * Works without the Render PDF service — ideal for local development and mockup review.
   */
  const handlePrintPreview = async (): Promise<void> => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (accessToken === undefined || accessToken === "") {
        showAlert("Please sign in first.", "error");
        return;
      }
      const printUrl = new URL(`${resolvePrintPageOrigin()}/print/alignment-advantage`);
      printUrl.searchParams.set("pdfToken", accessToken);
      window.open(printUrl.toString(), "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Print preview error:", err);
      showAlert("Could not open print preview. Please try again.", "error");
    }
  };

  /** Download the full Strategic Playbook PDF via the existing server-side export. */
  const handleDownloadPlaybook = async (): Promise<void> => {
    if (pdfLoading) return;
    setPdfLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (accessToken === undefined || accessToken === "") {
        showAlert("Please sign in first so we can prepare your playbook.", "error");
        return;
      }
      const printOrigin  = resolvePrintPageOrigin();
      const printUrl     = new URL(`${printOrigin}/print/alignment-advantage`);
      printUrl.searchParams.set("pdfToken", accessToken);
      const targetUrl    = printUrl.toString();
      await exportPdfViaServer(
        targetUrl,
        async () => `Bearer ${accessToken}`,
        `Alignment-Advantage-Playbook-${profile?.name ?? "report"}.pdf`
      );
    } catch (err) {
      console.error("Playbook PDF export error:", err);
      showAlert(
        err instanceof Error ? err.message : "PDF generation failed. Please try again.",
        "error"
      );
    } finally {
      setPdfLoading(false);
    }
  };

  if (!hasAlignmentAdvantage) return <AccessDeniedView />;

  if (!profile || !chartData || !strategicData) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-5">
            <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-brand-purple border-t-transparent" />
            <p className="text-sm text-gray-400 dark:text-gray-500">Loading your strategic profile…</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  const seasonConfig  = SEASON_DISPLAY[strategicData.season ?? "spring"] ?? SEASON_DISPLAY.spring;
  const signalStyles  = SIGNAL_STYLES[strategicData.signal];

  return (
    <PageTransition>
      <div className={founderReportGlowClass} />
      <div className={founderReportPageClass}>
        <div className={founderReportContainerClass}>

          {/* ── Back ── */}
          <Link to="/dashboard" className={founderReportBackButtonClass}>
            <span className={founderReportBackIconWrapClass}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </span>
            Back to Dashboard
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
              Strategic Command Centre
            </BrandGradientText>
            <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
              Your wealth archetype, current cycle, and monthly signal —{" "}
              synthesised for immediate clarity.
            </p>
          </header>

          {/* ── Snapshot strip ── */}
          <section className="mb-24" aria-label="Strategic snapshot">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <SnapshotCell
                label="Your Wealth Code"
                value={strategicData.wealthArchetype}
                sub="Dominant archetype"
                accent="bg-brand-purple/8 dark:bg-accent-gold/12"
                dot={<span className="text-xl">💰</span>}
              />
              <SnapshotCell
                label="Life Season"
                value={`${seasonConfig.icon} ${seasonConfig.label}`}
                sub={strategicData.seasonTitle}
                accent={`bg-gradient-to-br ${seasonConfig.gradient} opacity-15`}
                dot={<span className="text-xl">{seasonConfig.icon}</span>}
              />
              <SnapshotCell
                label={`${strategicData.monthName} Signal`}
                value={
                  strategicData.signal === "green" ? "Green Light" :
                  strategicData.signal === "yellow" ? "Yellow Light" : "Red Light"
                }
                sub={strategicData.palaceArea}
                accent={signalStyles.bg}
                dot={
                  <span
                    className={`inline-block w-5 h-5 rounded-full ${signalStyles.dot}`}
                    aria-hidden="true"
                  />
                }
              />
            </div>

            {/* Synthesis sentence */}
            <div className="mt-6 rounded-2xl bg-white/60 dark:bg-white/[0.04] border border-gray-200/60 dark:border-white/8 px-8 py-6 text-sm text-gray-700 dark:text-gray-300 leading-relaxed text-center">
              You are a{" "}
              <span className="font-semibold text-brand-purple dark:text-accent-gold">
                {strategicData.wealthArchetype}
              </span>{" "}
              in a{" "}
              <span className={`font-semibold ${seasonConfig.textClass}`}>
                {seasonConfig.label} Season
              </span>{" "}
              cycle.{" "}
              {strategicData.monthName} is a{" "}
              <span className={`font-semibold ${signalStyles.text}`}>
                {strategicData.signal === "green" ? "green-light" :
                 strategicData.signal === "yellow" ? "yellow-light" : "red-light"} month
              </span>{" "}
              — priority:{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {strategicData.palacePriority}
              </span>.
            </div>
          </section>

          {/* ── Navigation cards ── */}
          <section className="mb-8" aria-label="Deep-dive modules">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NavCard
                to="/alignment-advantage/timing"
                title="12-Month Timing Roadmap"
                description="Your month-by-month traffic-light calendar. Know exactly when to execute, when to proceed with caution, and when to protect."
                gradient="from-brand-purpleDeep via-brand-purple to-indigo-600"
              />
              <NavCard
                to="/alignment-advantage/wealth"
                title="Wealth Blueprint"
                description="Your wealth archetype decoded, your income path aligned, and your strategic blind spots exposed."
                gradient="from-amber-600 via-orange-600 to-rose-600"
              />
            </div>
          </section>

          {/* ── Strategic Playbook download ── */}
          <section className="mb-24" aria-label="Strategic Playbook">
            <div className="rounded-3xl border border-gray-200/60 dark:border-white/8 bg-white/60 dark:bg-white/[0.04] px-10 py-12 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500 mb-3">
                Strategic Playbook
              </p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Your Full Report, Ready to Download
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                Chart analysis, 10-year cycle, wealth profile, key palaces, and 12-month timing
                table — compiled into a single PDF you can save or share.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => { void handleDownloadPlaybook(); }}
                  disabled={pdfLoading}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-brand-purple dark:bg-accent-gold text-white dark:text-gray-900 text-sm font-semibold shadow-md hover:bg-brand-purpleDeep dark:hover:bg-accent-gold/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {pdfLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Generating your playbook…
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Strategic Playbook
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => { void handlePrintPreview(); }}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-gray-300 dark:border-white/15 bg-white/70 dark:bg-white/[0.06] text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-brand-purple dark:hover:border-accent-gold hover:text-brand-purple dark:hover:text-accent-gold transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Preview
                </button>
              </div>
            </div>
          </section>

          {/* ── Decision Framework ── */}
          <section aria-label="Lifetime Decision Framework" className="mb-8">
            <div className="mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500 mb-3">
                Lifetime Decision Framework
              </p>
              <BrandGradientText as="h2" className="text-3xl font-bold mb-4">
                Should You Make This Move?
              </BrandGradientText>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed">
                Evaluate any high-stakes decision — investments, business moves, partnerships —
                through your three-axis Purple Star lens.
                Timing and wealth axes are pre-filled from your chart.
                Answer the structural question to get your alignment score.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              <AxisGauge
                title="Structural"
                description="Does this decision align with the direction of your Life and Career palaces — your core design and purpose?"
                value={profile.name}
                isAutoFilled={false}
                answer={framework.structural}
                onAnswer={(val) => { setFramework((prev) => ({ ...prev, structural: val })); }}
                alignedColor="text-brand-purple dark:text-accent-gold"
              />
              <AxisGauge
                title="Timing"
                description={`${strategicData.monthName} is a ${
                  strategicData.signal === "green" ? "green-light" :
                  strategicData.signal === "yellow" ? "yellow-light" : "red-light"
                } period. ${
                  strategicData.signal === "green" ? "Optimal window for major moves." :
                  strategicData.signal === "yellow" ? "Good for planning, risky for execution." :
                  "Avoid major commitments this month."
                }`}
                value={
                  strategicData.signal === "green" ? "Green Light Month" :
                  strategicData.signal === "yellow" ? "Yellow Light Month" : "Red Light Month"
                }
                isAutoFilled={true}
                answer={timingAnswer}
                alignedColor={signalStyles.text}
              />
              <AxisGauge
                title="Wealth"
                description={`Your dominant wealth code is ${strategicData.wealthArchetype}. ${
                  strategicData.wealthAligned
                    ? "Your archetype is at a strong alignment score for this type of move."
                    : "Consider whether this decision is on your path of least resistance to wealth."
                }`}
                value={strategicData.wealthArchetype}
                isAutoFilled={true}
                answer={wealthAnswer}
                alignedColor="text-amber-700 dark:text-amber-300"
              />
            </div>

            {/* Recommendation */}
            {recommendation !== null && (
              <div className="rounded-2xl border border-gray-200/60 dark:border-white/8 bg-white/60 dark:bg-white/[0.04] p-8">
                <p className={`text-xl font-bold mb-3 ${recommendation.color}`}>
                  {recommendation.heading}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  {recommendation.copy}
                </p>
                <div className="flex items-center gap-3">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={[
                        "h-2 flex-1 rounded-full transition-all duration-500",
                        i < frameworkScore
                          ? "bg-emerald-500"
                          : "bg-gray-200 dark:bg-gray-700",
                      ].join(" ")}
                      aria-hidden="true"
                    />
                  ))}
                  <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 ml-1 shrink-0">
                    {frameworkScore} / 3
                  </span>
                </div>
              </div>
            )}

            {framework.structural !== null && (
              <div className="mt-5 text-center">
                <button
                  type="button"
                  onClick={() => { setFramework({ structural: null, timing: null, wealth: null }); }}
                  className="text-xs text-gray-400 dark:text-gray-500 hover:text-brand-purple dark:hover:text-accent-gold transition-colors underline underline-offset-4"
                >
                  Reset framework
                </button>
              </div>
            )}
          </section>

        </div>
      </div>
    </PageTransition>
  );
};

export default AlignmentAdvantage;
