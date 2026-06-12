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
 *  Cover  : Client name, at-a-glance summary chips, PDF download
 *  Ch 01  : Structure: Speed/Endurance Player + Formation Profile
 *  Ch 02  : Timing: DaYun phase summary + 12-month roadmap grid
 *  Ch 03  : Wealth: Archetype profile + Phase × Wealth intersection
 *  Ch 04  : Decision Framework: 3-axis alignment checker
 *
 * Access is gated behind the `hasAlignmentAdvantage` feature flag.
 * Always uses the account-owner's (`is_self`) profile: one per account.
 */

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Compass, Users } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "../../components/PageTransition";
import { useProfileContext } from "../../context/ProfileContext";
import { useTierAccess } from "../../context/TierContext";
import { useAlertContext } from "../../context/AlertContext";
import { ZWDSCalculator } from "../../utils/zwds/calculator";
import type { ChartData, ChartInput, Palace } from "../../utils/zwds/types";
import { analyzeWealthCode } from "../../utils/zwds/analysis/wealthCodeAnalysis";
import type { WealthCodeAnalysisResult } from "../../utils/zwds/analysis/wealthCodeAnalysis";
import { calculateCurrentDayunCycle } from "../../utils/dayun/calculator";
import { generateDayunGuidance } from "../../utils/dayun/guidanceGenerator";
import type { DayunCycleExtended } from "../../types/dayun";
import {
  getPalaceForAspectLiuMonth,
  getLiuMonthAnchorFromLocalDate,
} from "../../utils/destiny-navigator/palace-resolver";
import {
  PALACE_DATA,
  getSignalColor,
  SIGNAL_LABELS,
  type SignalColor,
} from "../../utils/forecast/alignmentTimingData";
import { detectStructure } from "../../utils/zwds/analysis/structureAnalysis";
import type { StructureAnalysisResult } from "../../utils/zwds/analysis/structureAnalysis";
import {
  STRUCTURE_LABELS,
  FORMATION_PROFILES,
} from "../../utils/forecast/structureContentData";
import { PHASE_LABELS } from "../../utils/dayun/seasonMapper";
import { supabase } from "../../utils/supabase-client";
import {
  exportPdfViaServer,
  resolvePrintPageOrigin,
} from "../../utils/pdfExportServer";
import {
  type PhaseAlignmentSeasonKey,
} from "../../utils/forecast/wealthContentData";
import { STAR_BRIEF } from "../../utils/forecast/starBriefDescriptions";
import {
  PEOPLE_PALACE_FRAMING,
  PEOPLE_SYNTHESIS,
} from "../../utils/forecast/peoplePalaceData";
import {
  PALACE_MONTH_DATA,
  PALACE_GUIDANCE_DATA,
  SEASON_STYLES,
} from "../../utils/forecast/liuMonthData";
import MonthGrid from "../../components/alignment-advantage/MonthGrid";
import type { MonthPillData } from "../../components/alignment-advantage/MonthGrid";

import { C, PALACE_ENGLISH, NORTHERN_MAIN_STARS, SOUTHERN_MAIN_STARS } from "../../components/alignment-advantage/shared/constants";
import { Sparkle } from "../../components/alignment-advantage/shared/Sparkle";
import { SectionWatermark } from "../../components/alignment-advantage/shared/SectionWatermark";
import { TwelvePalaceMiniGrid } from "../../components/alignment-advantage/shared/TwelvePalaceMiniGrid";
import { ChapterCoreDesign } from "../../components/alignment-advantage/chapters/ChapterCoreDesign";
import { ChapterExecutionPlaybook } from "../../components/alignment-advantage/chapters/ChapterExecutionPlaybook";
import { ChapterOperatingSystem } from "../../components/alignment-advantage/chapters/ChapterOperatingSystem";
import { ChapterWealthAcceleration } from "../../components/alignment-advantage/chapters/ChapterWealthAcceleration";
import { ChapterDecisionFramework } from "../../components/alignment-advantage/chapters/ChapterDecisionFramework";
import { ChapterStakeholderIntelligence } from "../../components/alignment-advantage/chapters/ChapterStakeholderIntelligence";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type ChapterId = "cover" | "design" | "operate" | "timing" | "wealth" | "people" | "decision";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────


// ─── Mini-chart helpers ───────────────────────────────────────────────────────

const CHAPTERS: Array<{ id: ChapterId; label: string; sub: string }> = [
  { id: "cover",    label: "Overview",     sub: "Your profile at a glance" },
  { id: "design",   label: "Founder's Blueprint", sub: "Ch 01 · Core Design" },
  { id: "operate",  label: "Operating System", sub: "Ch 02 · Executive Capacity" },
  { id: "wealth",   label: "Wealth Acceleration", sub: "Ch 03 · Wealth Blueprint" },
  { id: "people",   label: "Stakeholder Intel", sub: "Ch 04 · People Intelligence" },
  { id: "timing",   label: "Execution Playbook", sub: "Ch 05 · 12-Month Roadmap" },
  { id: "decision", label: "Decision Filter", sub: "Ch 06 · Decision Framework" },
];

const PHASE_DISPLAY: Record<string, { label: string; bgColor: string; textColor: string }> = {
  spring: { label: "Expansion",     bgColor: `linear-gradient(135deg, #16a34a, #15803d)`, textColor: "#15803d" },
  summer: { label: "Visibility",    bgColor: `linear-gradient(135deg, ${C.coral}, ${C.coralDark})`,  textColor: C.coral },
  autumn: { label: "Consolidation", bgColor: `linear-gradient(135deg, #d97706, #b45309)`,            textColor: "#d97706" },
  winter: { label: "Foundation",    bgColor: `linear-gradient(135deg, #2563eb, #1d4ed8)`,            textColor: "#2563eb" },
};

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

/** Returns the palace matching a given Chinese name, or null if not found. */

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────


/** Skeleton loading shimmer */
const Shimmer: React.FC<{ className: string }> = ({ className }) => (
  <div className={["animate-pulse rounded-xl", className].join(" ")}
    style={{ background: "rgba(255,255,255,0.12)" }} />
);

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
  const { showAlert }             = useAlertContext();

  const profile = useMemo(() => profiles.find((p) => p.is_self) ?? null, [profiles]);

  const chartData = useMemo((): ChartData | null => {
    if (!profile) return null;
    try {
      const d = new Date(`${profile.birthday}T12:00:00`);
      const input: ChartInput = {
        year:   d.getFullYear(),
        month:  d.getMonth() + 1,
        day:    d.getDate(),
        hour:   parseBirthHour(String(profile.birth_time)),
        gender: profile.gender === "male" ? "male" : "female",
        name:   profile.name,
      };
      return new ZWDSCalculator(input).calculate();
    } catch { return null; }
  }, [profile]);

  const strategicData = useMemo(() => {
    if (!chartData) return null;

    const wealthProfile: WealthCodeAnalysisResult = analyzeWealthCode(chartData);
    const rawDayun      = calculateCurrentDayunCycle(chartData);
    const dayun: DayunCycleExtended | null = rawDayun ? generateDayunGuidance(rawDayun) : null;

    const { solarYear, lunarMonth } = getLiuMonthAnchorFromLocalDate();
    const palaceNum   = getPalaceForAspectLiuMonth("life", chartData, lunarMonth, solarYear);
    const palace      = palaceNum !== null ? chartData.palaces[palaceNum - 1] : null;
    const palaceData  = palace ? PALACE_DATA[palace.name] : null;
    const signal: SignalColor = palaceData ? getSignalColor(palaceData.stars) : "yellow";

    return {
      wealthProfile,
      dayun,
      wealthArchetype: wealthProfile.dominantArchetype ?? "Your Wealth Code",
      season:          dayun?.season ?? null,
      phaseLabel:      PHASE_LABELS[dayun?.season ?? "spring"] ?? "Expansion",
      signal,
      signalLabel:     SIGNAL_LABELS[signal],
      monthName:       new Date().toLocaleString("en-US", { month: "long" }),
      palaceArea:      palaceData?.area ?? "",
      palacePriority:  palaceData?.priority ?? "",
      timingAligned:   signal === "green",
      wealthAligned:   (wealthProfile.codes[0]?.score ?? 0) >= 5,
    };
  }, [chartData]);

  const structureResult = useMemo((): StructureAnalysisResult | null => {
    if (!chartData) return null;
    return detectStructure(chartData, "natal");
  }, [chartData]);

  const [pdfLoading, setPdfLoading] = useState<boolean>(false);
  const [activeChapter, setActiveChapter] = useState<ChapterId>("cover");

  // Active chapter detection
  useEffect(() => {
    if (!chartData || !strategicData || !structureResult) return;
    const ids: ChapterId[] = ["cover", "design", "operate", "timing", "wealth", "people", "decision"];
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

  const scrollTo = useCallback((id: ChapterId): void => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleDownloadPlaybook = async (): Promise<void> => {
    if (pdfLoading) return;
    setPdfLoading(true);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) { showAlert("Please sign in first.", "error"); return; }
      const url = new URL(`${resolvePrintPageOrigin()}/print/alignment-advantage`);
      url.searchParams.set("pdfToken", token);
      await exportPdfViaServer(url.toString(), async () => `Bearer ${token}`, `Alignment-Advantage-${profile?.name ?? "report"}.pdf`);
    } catch (err) {
      showAlert(err instanceof Error ? err.message : "PDF generation failed.", "error");
    } finally {
      setPdfLoading(false);
    }
  };

  const handlePrintPreview = async (): Promise<void> => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) { showAlert("Please sign in first.", "error"); return; }
      const url = new URL(`${resolvePrintPageOrigin()}/print/alignment-advantage`);
      url.searchParams.set("pdfToken", token);
      window.open(url.toString(), "_blank", "noopener,noreferrer");
    } catch (err) {
      showAlert("Could not open print preview.", "error");
    }
  };

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
      {/* ── Full-viewport two-column shell ─────────────────────────────── */}
      <div
        style={{
          position: "fixed", inset: 0, display: "flex", zIndex: 40, overflow: "hidden",
          background: C.navyDeep,
        }}
      >

        {/* ═══════════════════════════════════════════════════════════════
            SIDEBAR: mirrors the dashboard sidebar exactly
            ═══════════════════════════════════════════════════════════════ */}
        <aside
          className="shrink-0 flex flex-col overflow-hidden"
          style={{
            width: 230,
            height: "100%",
            background: `
              linear-gradient(180deg,
                ${C.navy}      0%,
                ${C.navyMid}   55%,
                ${C.coralDark}88 85%,
                ${C.coral}55   100%
              )
            `,
            position: "relative",
          }}
        >
          {/* Dot-texture overlay */}
          <div
            style={{
              position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)`,
              backgroundSize: "18px 18px",
            }}
          />

          {/* ── Brand header ── */}
          <div className="relative z-10 px-5 pt-7 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-2 mb-1">
              <Sparkle size={9} color={C.coral} />
              <p className="text-[8px] font-bold uppercase tracking-[0.28em]" style={{ color: C.coral }}>
                Premium Programme
              </p>
            </div>
            <p
              className="text-base font-bold leading-tight mb-0.5"
              style={{ color: C.white, fontFamily: "Georgia,'Times New Roman',serif" }}
            >
              Alignment Advantage
            </p>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>
              {profile.name}
            </p>
          </div>

          {/* ── Summary chips ── */}
          <div className="relative z-10 px-4 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-[8px] font-bold uppercase tracking-[0.2em] mb-2.5" style={{ color: "rgba(255,255,255,0.3)" }}>
              Your Profile
            </p>
            <div className="flex flex-col gap-2">
              <div
                className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5"
                style={{ background: `${C.coral}22`, border: `1px solid ${C.coral}40` }}
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: C.coral }} />
                <p className="text-[10px] font-bold truncate" style={{ color: C.white }}>
                  {strLabel.label}
                </p>
              </div>
              <div
                className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: C.gold }} />
                <p className="text-[10px] font-medium truncate" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {phaseConfig.label} Phase
                </p>
              </div>
            </div>
          </div>

          {/* ── Chapter navigation ── */}
          <nav className="relative z-10 flex-1 overflow-y-auto px-3 py-4" aria-label="Document chapters">
            <p className="text-[8px] font-bold uppercase tracking-[0.2em] px-2 mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
              Contents
            </p>
            <ul className="space-y-0.5">
              {CHAPTERS.map((ch) => {
                const isActive = activeChapter === ch.id;
                return (
                  <li key={ch.id}>
                    <button
                      type="button"
                      onClick={() => { scrollTo(ch.id); }}
                      className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150"
                      style={{
                        background: isActive ? `${C.coral}22` : "transparent",
                        borderLeft: isActive ? `2px solid ${C.coral}` : "2px solid transparent",
                      }}
                    >
                      <div className="min-w-0 flex-1">
                        <p
                          className="text-xs font-semibold truncate"
                          style={{ color: isActive ? C.white : "rgba(255,255,255,0.5)" }}
                        >
                          {ch.label}
                        </p>
                        <p className="text-[9px] truncate" style={{ color: "rgba(255,255,255,0.28)" }}>
                          {ch.sub}
                        </p>
                      </div>
                      {isActive && (
                        <div
                          className="shrink-0 w-1 h-5 rounded-full"
                          style={{ background: `linear-gradient(180deg, ${C.coral}, ${C.gold})` }}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* ── Action buttons ── */}
          <div
            className="relative z-10 px-4 py-4 space-y-2"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            <button
              type="button"
              onClick={() => { void handleDownloadPlaybook(); }}
              disabled={pdfLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-60"
              style={{ background: `linear-gradient(135deg, ${C.coralDark}, ${C.coral})`, color: C.white }}
            >
              {pdfLoading ? (
                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
              {pdfLoading ? "Generating…" : "Download Playbook"}
            </button>
            <button
              type="button"
              onClick={() => { void handlePrintPreview(); }}
              className="w-full py-2 rounded-xl text-xs font-medium transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)" }}
            >
              Print Preview
            </button>
          </div>

          {/* ── User footer with coral gradient ── */}
          <div
            className="relative z-10 px-4 py-3 flex items-center gap-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "transparent" }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
              style={{ background: `linear-gradient(135deg, ${C.coral}, ${C.coralDark})`, color: C.white }}
            >
              {profile.name.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold truncate" style={{ color: "rgba(255,255,255,0.7)" }}>
                {profile.name}
              </p>
              <Link
                to="/dashboard"
                className="text-[9px] font-medium transition-colors hover:opacity-80"
                style={{ color: C.coral }}
              >
                ← Dashboard
              </Link>
            </div>
          </div>
        </aside>

        {/* ═══════════════════════════════════════════════════════════════
            MAIN CONTENT: warm peach-coral gradient, rich card sections
            ═══════════════════════════════════════════════════════════════ */}
        <main
          className="flex-1 overflow-y-auto"
          style={{
            height: "100%",
            background: `
              radial-gradient(ellipse 80% 60% at 70% 20%, ${C.coral}18 0%, transparent 60%),
              radial-gradient(ellipse 50% 40% at 20% 80%, ${C.navyMid}55 0%, transparent 55%),
              linear-gradient(160deg, ${C.cream} 0%, #f5ece2 60%, #ede4d8 100%)
            `,
          }}
        >
          {/* ── Session tag bar ── */}
          <div
            className="sticky top-0 z-20 flex items-center gap-3 px-8 py-3"
            style={{
              background: `${C.navy}ee`,
              backdropFilter: "blur(12px)",
              borderBottom: `1px solid rgba(255,255,255,0.07)`,
            }}
          >
            <Sparkle size={9} color={C.coral} />
            <p className="text-[9px] font-bold uppercase tracking-[0.28em]" style={{ color: C.coral }}>
              Alignment Advantage
            </p>
            <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
            <p className="text-[9px] font-bold uppercase tracking-[0.28em]" style={{ color: "rgba(255,255,255,0.35)" }}>
              Cae Goh
            </p>
            <div className="ml-auto flex items-center gap-2">
              <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* ── Scrollable content ── */}
          <div className="px-8 py-8 max-w-4xl mx-auto space-y-12">

          {/* ══════════════════════════════════════
              SECTION 1: OVERVIEW / COVER
              ══════════════════════════════════════ */}
          <section id="cover" className="scroll-mt-16 mb-32 pt-16 relative overflow-hidden bg-white rounded-[40px] p-10 md:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-[#e8ddd0]/50">
            <SectionWatermark type="compass" />
            
            {/* Hero */}
            <div className="mb-16 relative z-10">
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
                className="text-6xl font-bold leading-none mb-6"
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
                A personalised strategic playbook built from your Purple Star Astrology chart -
                giving you clarity on how you&apos;re wired, when to move, and how to build wealth on your terms.
              </p>
            </div>


            {/* 3-stat summary cards: cream with coral left-border accent */}
            <div className="grid grid-cols-3 gap-4">
              {/* Stat 1: Structure */}
              <div
                className="rounded-2xl p-5 flex flex-col gap-3"
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
                className="rounded-2xl p-5 flex flex-col gap-3"
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
                    {strategicData.dayun?.startYear ?? ""}–{strategicData.dayun?.endYear ?? ""}
                  </p>
                </div>
              </div>

              {/* Stat 3: Monthly Signal */}
              <div
                className="rounded-2xl p-5 flex flex-col gap-3"
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
              className="mt-4 rounded-2xl px-6 py-5 flex items-center justify-between gap-4"
              style={{
                background: `linear-gradient(135deg, ${C.navy}ee, ${C.navyMid}ee)`,
                border: `1px solid ${C.coral}15`, boxShadow: "0 4px 24px rgba(232,100,45,0.03)",
              }}
            >
              <div>
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
              <p className="text-xs leading-relaxed text-right max-w-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                {strategicData.dayun?.coreMessage ?? ""}
              </p>
            </div>
            {/* 12-Palace Mini Grid: full chart at a glance */}
            <div className="mt-6">
              <p
                className="text-[8px] font-bold uppercase tracking-[0.24em] mb-3"
                style={{ color: C.muted }}
              >
                Your Full 12-Palace Chart
              </p>
              <TwelvePalaceMiniGrid chartData={chartData} />
            </div>
          </section>

          <ChapterCoreDesign chartData={chartData} structureResult={structureResult} strLabel={strLabel} formation={formation} />

          <ChapterOperatingSystem chartData={chartData} strLabel={strLabel} />

          {/* ══════════════════════════════════════
              SECTION 4: TIMING
              ══════════════════════════════════════ */}
          <ChapterWealthAcceleration chartData={chartData} strategicData={strategicData} />

          {/* ══════════════════════════════════════
              SECTION 6: PEOPLE INTELLIGENCE
              ══════════════════════════════════════ */}
          <ChapterStakeholderIntelligence chartData={chartData} />

          {/* ══════════════════════════════════════
              SECTION 7: DECISION FRAMEWORK
              ══════════════════════════════════════ */}
          {chartData && (
            <ChapterExecutionPlaybook
              strategicData={strategicData}
              chartData={chartData}
              profile={profile}
            />
          )}

          {/* ══════════════════════════════════════
              SECTION 5: WEALTH BLUEPRINT
              ══════════════════════════════════════ */}
          <ChapterDecisionFramework
            strategicData={strategicData}
            strLabel={strLabel}
            formation={formation}
            phaseConfig={phaseConfig}
            signalHex={signalHex}
          />

          </div>{/* end scrollable content */}
        </main>
      </div>
    </PageTransition>
  );
};

export default AlignmentAdvantage;
