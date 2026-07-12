/**
 * Alignment Advantage: PDF Document Viewer
 *
 * Layout mirrors the Joey Yap Monthly Planner reference:
 * : Fixed-width dark sidebar on the left for chapter navigation.
 * : Right content area rendered as a PDF viewer: warm-gray background
 *    with centered white "pages" that have drop shadows, mimicking actual
 *    printed pages in a browser-based PDF reader.
 *
 * Chapters:
 *  Cover  : Client name, at-a-glance summary chips
 *  Filter : Strategic decision filter (right after overview)
 *  Ch 01  : Structure: Speed/Endurance Player + Formation Profile
 *  Ch 02  : Wealth: Archetype profile + Phase × Wealth intersection
 *  Ch 03  : Stakeholder Intelligence
 *  Ch 04  : Timing: DaYun phase summary + 12-month roadmap grid
 *
 * Access is gated behind the `hasAlignmentAdvantage` feature flag.
 * Always uses the account-owner's (`is_self`) profile: one per account.
 */

import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import PageTransition from "../../components/PageTransition";
import { useProfileContext } from "../../context/ProfileContext";
import { useTierAccess } from "../../context/TierContext";
import {
  STRUCTURE_LABELS,
  FORMATION_PROFILES,
} from "../../utils/forecast/structureContentData";
import { useAlignmentAdvantageData } from "../../components/alignment-advantage/data/useAlignmentAdvantageData";

import DocumentViewerLayout from "../../components/layout/DocumentViewerLayout";
import { useAppNavItems } from "../../hooks/useAppNavItems";
import { C } from "../../components/alignment-advantage/shared/constants";
import { PageContextStrip } from "../../components/alignment-advantage/shared/PageContextStrip";
import { SectionWatermark } from "../../components/alignment-advantage/shared/SectionWatermark";
import { firstSentences } from "../../components/alignment-advantage/shared/textHelpers";
import { TwelvePalaceMiniGrid } from "../../components/alignment-advantage/shared/TwelvePalaceMiniGrid";
import { ChapterCoreDesign } from "../../components/alignment-advantage/chapters/ChapterCoreDesign";
import { ChapterExecutionPlaybook } from "../../components/alignment-advantage/chapters/ChapterExecutionPlaybook";
import { ChapterWealthAcceleration } from "../../components/alignment-advantage/chapters/ChapterWealthAcceleration";
import { ChapterDecisionFramework } from "../../components/alignment-advantage/chapters/ChapterDecisionFramework";
import { ChapterStakeholderIntelligence } from "../../components/alignment-advantage/chapters/ChapterStakeholderIntelligence";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type ChapterId = "cover" | "design" | "decision" | "wealth" | "people" | "timing";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────


// ─── Mini-chart helpers ───────────────────────────────────────────────────────

const CHAPTERS: Array<{ id: ChapterId; label: string; sub: string }> = [
  { id: "cover",    label: "Overview",            sub: "Your profile at a glance" },
  { id: "decision", label: "Strategic Filter",    sub: "Decision framework" },
  { id: "design",   label: "Founder's Blueprint", sub: "Ch 01 · Core Design" },
  { id: "wealth",   label: "Wealth Acceleration", sub: "Ch 02 · Wealth Blueprint" },
  { id: "people",   label: "People Intel",        sub: "Ch 03 · Five Relationship Palaces" },
  { id: "timing",   label: "Execution Playbook",  sub: "Ch 04 · 12-Month Roadmap" },
];

const PHASE_DISPLAY: Record<string, { label: string; bgColor: string; textColor: string }> = {
  spring: { label: "Expansion",     bgColor: `linear-gradient(135deg, #16a34a, #15803d)`, textColor: "#15803d" },
  summer: { label: "Visibility",    bgColor: `linear-gradient(135deg, ${C.coral}, ${C.coralDark})`,  textColor: C.coral },
  autumn: { label: "Consolidation", bgColor: `linear-gradient(135deg, #d97706, #b45309)`,            textColor: "#d97706" },
  winter: { label: "Foundation",    bgColor: `linear-gradient(135deg, #2563eb, #1d4ed8)`,            textColor: "#2563eb" },
};

// ─────────────────────────────────────────────────────────────────────────────
// Access denied
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Mini-chart display components
// ─────────────────────────────────────────────────────────────────────────────

const AccessDeniedView: React.FC = () => (
  <PageTransition>
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMid} 60%, ${C.coralDark} 100%)` }}
    >
      <div
        className="rounded-3xl p-12 max-w-sm text-center"
        style={{ background: C.cream, border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}
      >
        <div
          className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.coral})` }}
        >
          <svg className="w-7 h-7" fill="none" stroke={C.white} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <p className="text-[9px] font-bold uppercase tracking-[0.24em] mb-3" style={{ color: C.coral }}>
          Premium Access Required
        </p>
        <h1 className="text-2xl font-bold mb-3" style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}>
          Alignment Advantage
        </h1>
        <p className="text-sm leading-relaxed mb-8" style={{ color: C.muted }}>
          This is a premium programme. Contact us to unlock your complete strategic playbook.
        </p>
        <Link
          to="/dashboard"
          className="inline-block px-7 py-3 rounded-2xl text-sm font-bold transition-all"
          style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.coral})`, color: C.white }}
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

const AlignmentAdvantage: React.FC = () => {
  const { profiles }              = useProfileContext();
  const { hasAlignmentAdvantage } = useTierAccess();
  const { items: appNavItems }    = useAppNavItems({ activeKey: "alignment-advantage" });

  const profile = profiles.find((p) => p.is_self) ?? null;
  const aaData = useAlignmentAdvantageData(profile);

  const chartData = aaData?.chartData ?? null;
  const strategicData = aaData?.strategicData ?? null;
  const structureResult = aaData?.structureResult ?? null;

  const [activeChapter, setActiveChapter] = useState<ChapterId>("cover");

  // Active chapter detection
  useEffect(() => {
    if (!chartData || !strategicData || !structureResult) return;
    const ids: ChapterId[] = ["cover", "decision", "design", "wealth", "people", "timing"];
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting);
        if (hit.length > 0) {
          const top = hit.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActiveChapter(top.target.id as ChapterId);
        }
      },
      { rootMargin: "-10% 0px -60% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => { observer.disconnect(); };
  }, [chartData, strategicData, structureResult]);

  const scrollTo = useCallback((id: string): void => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  if (!hasAlignmentAdvantage) return <AccessDeniedView />;

  if (!profile || !chartData || !strategicData || !structureResult) {
    return (
      <PageTransition>
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMid} 60%, ${C.coralDark} 100%)` }}
        >
          <div className="flex flex-col items-center gap-4">
            <div
              className="h-10 w-10 animate-spin rounded-full border-[3px] border-t-transparent"
              style={{ borderColor: `${C.coral} transparent transparent transparent` }}
            />
            <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
              Loading your playbook…
            </p>
          </div>
        </div>
      </PageTransition>
    );
  }

  const phaseConfig  = PHASE_DISPLAY[strategicData.season ?? "spring"] ?? PHASE_DISPLAY.spring;
  const strLabel     = STRUCTURE_LABELS[structureResult.structureType];
  const formation    = FORMATION_PROFILES[structureResult.formation];

  /** Signal dot colour */
  const signalHex = strategicData.signal === "green" ? "#16a34a"
    : strategicData.signal === "red" ? C.coral : C.gold;

  return (
    <PageTransition>
      <DocumentViewerLayout
        profileName={profile.name}
        contextTitle="Alignment Advantage"
        appNavItems={appNavItems}
        chapters={CHAPTERS}
        activeChapter={activeChapter}
        onChapterClick={scrollTo}
      >
          {/* ══════════════════════════════════════
              SECTION 1: OVERVIEW / COVER
              ══════════════════════════════════════ */}
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
                Strategic Playbook · {profile.name}
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
            {/* 12-Palace Mini Grid: full chart at a glance */}
            <div className="mt-6">
              <p
                className="text-[8px] font-bold uppercase tracking-[0.24em] mb-3 text-center"
                style={{ color: C.muted }}
              >
                Your Full 12-Palace Chart · Each chapter below unpacks one zone
              </p>
              <TwelvePalaceMiniGrid chartData={chartData} />
            </div>
          </section>

          <ChapterDecisionFramework
            strategicData={strategicData}
            strLabel={strLabel}
            formation={formation}
            phaseConfig={phaseConfig}
            signalHex={signalHex}
          />

          <ChapterCoreDesign chartData={chartData} structureResult={structureResult} strLabel={strLabel} formation={formation} />

          <ChapterWealthAcceleration chartData={chartData} strategicData={strategicData} />

          <ChapterStakeholderIntelligence chartData={chartData} strategicData={strategicData} />

          {chartData && (
            <ChapterExecutionPlaybook
              strategicData={strategicData}
              chartData={chartData}
              profile={profile}
            />
          )}

      </DocumentViewerLayout>
    </PageTransition>
  );
};

export default AlignmentAdvantage;
