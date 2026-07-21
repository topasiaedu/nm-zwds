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
 *  Filter : Strategic decision filter (right after overview)
 *  Ch 01  : Structure: Speed/Endurance Player + Formation Profile
 *  Ch 02  : Wealth: Archetype profile + Phase × Wealth intersection
 *  Ch 03  : Stakeholder Intelligence
 *  Ch 04  : Dayun Season: 10-year phase analysis
 *  Ch 05  : Timing: DaYun phase summary + 12-month roadmap grid
 *
 * Access is gated behind the `hasAlignmentAdvantage` feature flag.
 * Always uses the account-owner's (`is_self`) profile: one per account.
 */

import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import PageTransition from "../../components/PageTransition";
import { useProfileContext } from "../../context/ProfileContext";
import { useTierAccess } from "../../context/TierContext";
import { useAlertContext } from "../../context/AlertContext";
import { selectAccountOwnerProfile } from "../../components/alignment-advantage/data/selectAccountOwnerProfile";
import {
  STRUCTURE_LABELS,
  FORMATION_PROFILES,
} from "../../utils/forecast/structureContentData";
import { supabase } from "../../utils/supabase-client";
import {
  exportPdfViaServer,
  resolvePrintPageOrigin,
} from "../../utils/pdfExportServer";
import { useAlignmentAdvantageData } from "../../components/alignment-advantage/data/useAlignmentAdvantageData";

import DocumentViewerLayout from "../../components/layout/DocumentViewerLayout";
import { useAppNavItems } from "../../hooks/useAppNavItems";
import { C } from "../../components/alignment-advantage/shared/constants";
import { ChapterOverview } from "../../components/alignment-advantage/chapters/ChapterOverview";
import { ChapterCoreDesign } from "../../components/alignment-advantage/chapters/ChapterCoreDesign";
import { ChapterExecutionPlaybook } from "../../components/alignment-advantage/chapters/ChapterExecutionPlaybook";
import { ChapterWealthAcceleration } from "../../components/alignment-advantage/chapters/ChapterWealthAcceleration";
import { ChapterDecisionFramework } from "../../components/alignment-advantage/chapters/ChapterDecisionFramework";
import { ChapterStakeholderIntelligence } from "../../components/alignment-advantage/chapters/ChapterStakeholderIntelligence";
import { ChapterDayunSeason } from "../../components/alignment-advantage/chapters/ChapterDayunSeason";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type ChapterId = "cover" | "design" | "decision" | "wealth" | "people" | "dayun" | "timing";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────


// ─── Mini-chart helpers ───────────────────────────────────────────────────────

const CHAPTERS: Array<{ id: ChapterId; label: string; sub: string }> = [
  { id: "cover",    label: "Overview",            sub: "Your profile at a glance" },
  { id: "decision", label: "Strategic Filter",    sub: "Decision framework" },
  { id: "design",   label: "Founder's Blueprint", sub: "Ch 01 · Core Design" },
  { id: "wealth",   label: "Wealth Acceleration", sub: "Ch 02 · Wealth Blueprint" },
  { id: "dayun",    label: "Dayun Season",        sub: "Ch 03 · 10-Year Phase" },
  { id: "people",   label: "People Intel",        sub: "Ch 04 · Five Relationship Palaces" },
  { id: "timing",   label: "Execution Playbook",  sub: "Ch 05 · 12-Month Roadmap" },
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
  const { showAlert }             = useAlertContext();
  const { items: appNavItems }    = useAppNavItems({ activeKey: "alignment-advantage" });

  const profile = selectAccountOwnerProfile(profiles);
  const aaData = useAlignmentAdvantageData(profile);

  const chartData = aaData?.chartData ?? null;
  const strategicData = aaData?.strategicData ?? null;
  const structureResult = aaData?.structureResult ?? null;

  const [pdfLoading, setPdfLoading] = useState<boolean>(false);
  const [activeChapter, setActiveChapter] = useState<ChapterId>("cover");

  // Active chapter detection
  useEffect(() => {
    if (!chartData || !strategicData || !structureResult) return;
    const ids: ChapterId[] = ["cover", "decision", "design", "wealth", "dayun", "people", "timing"];
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

  /**
   * Downloads the Alignment Advantage playbook PDF via the Puppeteer microservice.
   * Requires REACT_APP_PDF_SERVICE_URL (handled inside exportPdfViaServer).
   */
  const handleDownloadPlaybook = async (): Promise<void> => {
    if (pdfLoading) {
      return;
    }
    setPdfLoading(true);
    try {
      // Prefer `|| ""` over `?.trim()` so CRA DefinePlugin + Babel optional-chaining
      // does not leave an ambiguous empty check after env inlining.
      const pdfServiceUrl = (process.env.REACT_APP_PDF_SERVICE_URL || "").trim();
      if (pdfServiceUrl.length === 0) {
        showAlert(
          "PDF download is not configured. Set REACT_APP_PDF_SERVICE_URL in .env.local and restart the app (npm start).",
          "error"
        );
        return;
      }

      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (token === undefined || token.length === 0) {
        showAlert("Please sign in first.", "error");
        return;
      }

      const printOrigin = resolvePrintPageOrigin();
      if (printOrigin.length === 0) {
        showAlert("Could not resolve the print page origin for PDF generation.", "error");
        return;
      }

      const url = new URL(`${printOrigin}/print/alignment-advantage`);
      url.searchParams.set("pdfToken", token);
      await exportPdfViaServer(
        url.toString(),
        async () => `Bearer ${token}`,
        `Alignment-Advantage-${profile?.name ?? "report"}.pdf`
      );
      showAlert("Playbook downloaded.", "success");
    } catch (err) {
      const message =
        err instanceof TypeError
          ? "Could not reach the PDF service. Is it running on port 8787?"
          : err instanceof Error
            ? err.message
            : "PDF generation failed.";
      showAlert(message, "error");
    } finally {
      setPdfLoading(false);
    }
  };

  /** Opens the print route in a new tab for browser print preview. */
  const handlePrintPreview = async (): Promise<void> => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        showAlert("Please sign in first.", "error");
        return;
      }
      const url = new URL(`${resolvePrintPageOrigin()}/print/alignment-advantage`);
      url.searchParams.set("pdfToken", token);
      window.open(url.toString(), "_blank", "noopener,noreferrer");
    } catch {
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

  const footerActions = (
    <>
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
    </>
  );

  return (
    <PageTransition>
      <DocumentViewerLayout
        profileName={profile.name}
        contextTitle="Alignment Advantage"
        appNavItems={appNavItems}
        chapters={CHAPTERS}
        activeChapter={activeChapter}
        onChapterClick={scrollTo}
        footerActions={footerActions}
      >
          {/* ══════════════════════════════════════
              SECTION 1: OVERVIEW / COVER
              ══════════════════════════════════════ */}
          <ChapterOverview
            profileName={profile.name}
            chartData={chartData}
            strategicData={strategicData}
            strLabel={strLabel}
            formation={formation}
            phaseConfig={phaseConfig}
            signalHex={signalHex}
          />

          <ChapterDecisionFramework
            strategicData={strategicData}
            strLabel={strLabel}
            formation={formation}
            phaseConfig={phaseConfig}
            signalHex={signalHex}
          />

          <ChapterCoreDesign chartData={chartData} structureResult={structureResult} strLabel={strLabel} formation={formation} />

          <ChapterWealthAcceleration chartData={chartData} strategicData={strategicData} />

          <ChapterDayunSeason strategicData={strategicData} />

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
