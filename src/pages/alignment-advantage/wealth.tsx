/**
 * Alignment Advantage — Wealth Blueprint
 *
 * Assembles three existing components in sequence:
 *  1. WealthCode       — full wealth archetype, scores, strengths, blind spots, career paths
 *  2. IncomeBlueprint  — aligned income paths and side-income priority matrix
 *  3. PhaseAlignmentCard — timing × wealth code intersection (new framing, existing data)
 *
 * The Strategic Playbook PDF download lives on the home base page (/alignment-advantage).
 * Access is gated behind `hasAlignmentAdvantage`. Always uses the `is_self` profile.
 */

import React, { Suspense, useMemo } from "react";
import { Link } from "react-router-dom";
import PageTransition from "../../components/PageTransition";
import { useProfileContext } from "../../context/ProfileContext";
import { useTierAccess } from "../../context/TierContext";
import { ZWDSCalculator } from "../../utils/zwds/calculator";
import type { ChartData, ChartInput } from "../../utils/zwds/types";
import { analyzeWealthCode } from "../../utils/zwds/analysis/wealthCodeAnalysis";
import { calculateCurrentDayunCycle } from "../../utils/dayun/calculator";
import { generateDayunGuidance } from "../../utils/dayun/guidanceGenerator";
import { WealthCode } from "../../components/analysis_v2";
import PhaseAlignmentCard from "../../components/alignment-advantage/shared/PhaseAlignmentCard";
import {
  WEALTH_TYPE,
  STOP_DOING,
  ACTION_PLAN_ITEMS,
  IDEAL_COLLABORATOR,
} from "../../utils/forecast/wealthContentData";
import type { WealthCodeKey } from "../../utils/zwds/analysis_constants/wealth_code_mapping";
import {
  founderReportBackButtonClass,
  founderReportBackIconWrapClass,
  founderReportContainerClass,
  founderReportGlowClass,
  founderReportPageClass,
} from "../../styles/founderReportUi";
import { BrandGradientText } from "../../components/BrandGradientText";

/** Lazy-load IncomeBlueprint — matches the pattern in founder-report.tsx */
const IncomeBlueprint = React.lazy(async () => {
  const mod = await import("../../components/founder-report/IncomeBlueprint");
  return { default: mod.IncomeBlueprint as React.ComponentType<{ chartData: ChartData }> };
});

/** Skeleton block used while lazy sections load. */
const SkeletonBlock: React.FC<{ className: string }> = ({ className }) => (
  <div className={["animate-pulse rounded-2xl bg-gray-200/60 dark:bg-gray-700/30", className].join(" ")} />
);

/** Minimal error boundary so one section failure doesn't break the page. */
class SectionErrorBoundary extends React.Component<
  { title: string; children: React.ReactNode },
  { hasError: boolean }
> {
  public constructor(props: { title: string; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  public static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }
  public componentDidCatch(): void { /* noop */ }
  public render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="rounded-2xl border border-gray-200/60 dark:border-white/8 bg-white dark:bg-gray-900 p-8">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{this.props.title}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Data unavailable.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

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

const AlignmentAdvantageWealthPage: React.FC = () => {
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

  const phaseData = useMemo(() => {
    if (!chartData) return null;
    const wealthProfile = analyzeWealthCode(chartData);
    const rawDayun      = calculateCurrentDayunCycle(chartData);
    if (!rawDayun) return null;
    const dayunWithGuidance = generateDayunGuidance(rawDayun);
    /** Primary wealth code key for template lookups. */
    const wealthKey: WealthCodeKey =
      (wealthProfile.codes[0]?.key as WealthCodeKey | undefined) ?? "investmentBrain";
    return { wealthProfile, dayunCycle: dayunWithGuidance, wealthKey };
  }, [chartData]);

  if (!hasAlignmentAdvantage) return <AccessDeniedView />;

  if (!profile || !chartData) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-5">
            <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-brand-purple border-t-transparent" />
            <p className="text-sm text-gray-400 dark:text-gray-500">Loading your wealth blueprint…</p>
          </div>
        </div>
      </PageTransition>
    );
  }

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
              Wealth Blueprint
            </BrandGradientText>
            <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
              Your wealth archetype decoded — what to focus on, what to stop doing,
              and the exact income paths your chart is designed for.
            </p>
          </header>

          {/* ── Wealth Type Card ── */}
          {phaseData !== null && (() => {
            const wealthProfile = WEALTH_TYPE[phaseData.wealthKey];
            const categoryText: Record<string, string> = {
              "Earned Income":       "text-violet-600 dark:text-violet-400",
              "Passive Returns":     "text-blue-600 dark:text-blue-400",
              "Equity Growth":       "text-emerald-600 dark:text-emerald-400",
              "Strategic Windfalls": "text-amber-600 dark:text-amber-400",
            };
            const textClass = categoryText[wealthProfile.category] ?? categoryText["Equity Growth"];
            return (
              <div className="mb-10 rounded-3xl border border-gray-200/60 dark:border-white/8 bg-white/60 dark:bg-white/[0.04] px-8 py-10">
                <p className={`text-xs font-semibold uppercase tracking-[0.14em] mb-3 ${textClass}`}>
                  {wealthProfile.category}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-snug">
                  {wealthProfile.tagline}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                  {wealthProfile.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {wealthProfile.examples.map((ex) => (
                    <span
                      key={ex}
                      className="rounded-full border border-gray-200/70 dark:border-white/10 bg-gray-50 dark:bg-white/[0.06] px-3.5 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* ── Section 1: Wealth Code ── */}
          <SectionErrorBoundary title="Wealth Code Analysis">
            <WealthCode
              chartData={chartData}
              showTopDivider={false}
              header={{
                badgeText: "",
                title:     "YOUR WEALTH ACCELERATION BLUEPRINT",
                subtitle:  "Your natural wealth-building strengths, focus areas, and blind spots decoded from your chart.",
              }}
            />
          </SectionErrorBoundary>

          {/* ── Stop Doing Card ── */}
          {phaseData !== null && (() => {
            const items = STOP_DOING[phaseData.wealthKey];
            return (
              <div className="mt-10 mb-6 rounded-3xl border border-gray-200/60 dark:border-white/8 bg-white/60 dark:bg-white/[0.04] px-8 py-10">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-500 dark:text-rose-400 mb-3">
                  Stop Doing
                </p>
                <p className="text-base font-semibold text-gray-900 dark:text-white mb-6 leading-snug">
                  These three patterns are quietly draining your wealth-building energy.
                </p>
                <ul className="space-y-4">
                  {items.map((item, i) => (
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
            );
          })()}

          <div className="my-16 border-t border-gray-100 dark:border-white/8" />

          {/* ── 90-Day Action Plan ── */}
          {phaseData !== null && (() => {
            const dayunActions = phaseData.dayunCycle.keyActions?.slice(0, 2) ?? [];
            const wealthAction = ACTION_PLAN_ITEMS[phaseData.wealthKey];
            const season       = (phaseData.dayunCycle.season ?? "spring") as string;
            const archetype    = phaseData.wealthProfile.codes[0]?.label ?? "your archetype";
            const seasonLabel  = season.charAt(0).toUpperCase() + season.slice(1);
            const allActions   = [...dayunActions, wealthAction];
            return (
              <div className="mb-10 rounded-3xl border border-gray-200/60 dark:border-white/8 bg-white/60 dark:bg-white/[0.04] px-8 py-10">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-purple dark:text-accent-gold mb-3">
                  90-Day Action Plan
                </p>
                <p className="text-base font-semibold text-gray-900 dark:text-white mb-2 leading-snug">
                  As a <span className="text-brand-purple dark:text-accent-gold">{archetype}</span> in a{" "}
                  <span className="text-gray-700 dark:text-gray-200">{seasonLabel} season</span>:
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-7 leading-relaxed">
                  These are the highest-leverage moves for the next 90 days.
                </p>
                <ol className="space-y-4">
                  {allActions.map((action, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span
                        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-purple/10 dark:bg-accent-gold/10 text-xs font-bold text-brand-purple dark:text-accent-gold"
                        aria-hidden="true"
                      >
                        {i + 1}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{action}</span>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })()}

          {/* ── Section 2: Income Blueprint ── */}
          <SectionErrorBoundary title="Income Blueprint">
            <Suspense
              fallback={
                <div className="space-y-5 p-6">
                  <SkeletonBlock className="h-8 w-56" />
                  <SkeletonBlock className="h-52 w-full" />
                </div>
              }
            >
              <IncomeBlueprint chartData={chartData} />
            </Suspense>
          </SectionErrorBoundary>

          <div className="my-16 border-t border-gray-100 dark:border-white/8" />

          {/* ── Section 3: Phase Alignment ── */}
          {phaseData !== null && (
            <SectionErrorBoundary title="Phase Alignment">
              <div>
                <div className="mb-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500 mb-3">
                    Current Phase Alignment
                  </p>
                  <BrandGradientText as="h2" className="text-3xl font-bold mb-4">
                    Where Your Season Meets Your Wealth Code
                  </BrandGradientText>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed">
                    Your DaYun cycle season and wealth archetype create a unique strategic position.
                    Here is what that intersection means for you right now.
                  </p>
                </div>
                <PhaseAlignmentCard
                  dayunCycle={phaseData.dayunCycle}
                  wealthProfile={phaseData.wealthProfile}
                />
              </div>
            </SectionErrorBoundary>
          )}

          {/* ── Ideal Collaborator card ── */}
          {phaseData !== null && (() => {
            const collab = IDEAL_COLLABORATOR[phaseData.wealthKey];
            return (
              <div className="mt-10 mb-2 rounded-3xl border border-gray-200/60 dark:border-white/8 bg-white/60 dark:bg-white/[0.04] px-8 py-10">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-purple dark:text-accent-gold mb-3">
                  Your Ideal Collaborator
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{collab.type}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8 max-w-xl">
                  {collab.description}
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400 dark:text-gray-500 mb-4">
                  What to look for
                </p>
                <ul className="space-y-3">
                  {collab.lookFor.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-brand-purple dark:bg-accent-gold" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })()}

          {/* ── Footer nudge ── */}
          <div className="mt-20 mb-8 rounded-3xl border border-gray-200/60 dark:border-white/8 bg-white/60 dark:bg-white/[0.04] px-10 py-10 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Ready to take the full picture with you?
            </p>
            <Link
              to="/alignment-advantage"
              className="text-sm font-semibold text-brand-purple dark:text-accent-gold hover:underline underline-offset-4 transition-colors"
            >
              Download your Strategic Playbook from the Command Centre →
            </Link>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default AlignmentAdvantageWealthPage;
