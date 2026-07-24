/**
 * Monthly Consultation: 15-chapter Document Viewer + PDF download.
 * Gated by hasMonthlyConsultation. Uses account-owner (is_self) profile.
 * Month/year picker is admin-only (developer accounts); normal users always see the current Liu Month.
 */

import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageTransition from "../../components/PageTransition";
import { useProfileContext } from "../../context/ProfileContext";
import { useTierAccess } from "../../context/TierContext";
import { useAlertContext } from "../../context/AlertContext";
import { selectAccountOwnerProfile } from "../../components/alignment-advantage/data/selectAccountOwnerProfile";
import { supabase } from "../../utils/supabase-client";
import {
  exportPdfViaServer,
  resolvePrintPageOrigin,
} from "../../utils/pdfExportServer";
import { getLiuMonthAnchorFromLocalDate } from "../../utils/destiny-navigator/palace-resolver";
import { useMonthlyConsultationData } from "../../components/monthly-consultation/data/useMonthlyConsultationData";
import {
  MONTHLY_CHAPTER_IDS,
  MONTHLY_CHAPTERS,
  MonthlyConsultationBody,
  type MonthlyChapterId,
} from "../../components/monthly-consultation/chapters/MonthlyConsultationChapters";
import DocumentViewerLayout from "../../components/layout/DocumentViewerLayout";
import { useAppNavItems } from "../../hooks/useAppNavItems";
import { C } from "../../components/alignment-advantage/shared/constants";

/** Temporary: hide Download PDF / Print Preview while report copy is still being tuned. */
const SHOW_PDF_ACTIONS = false;

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
        <p className="text-[9px] font-bold uppercase tracking-[0.24em] mb-3" style={{ color: C.coral }}>
          Premium Access Required
        </p>
        <h1
          className="text-2xl font-bold mb-3"
          style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}
        >
          Monthly Consultation
        </h1>
        <p className="text-sm leading-relaxed mb-8" style={{ color: C.muted }}>
          This is a premium Liu Yue consultation report. Contact us to unlock access.
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

const MonthlyConsultationPage: React.FC = () => {
  const { profiles } = useProfileContext();
  const { hasMonthlyConsultation, isAdmin } = useTierAccess();
  const { showAlert } = useAlertContext();
  const { items: appNavItems } = useAppNavItems({ activeKey: "monthly-consultation" });

  const profile = selectAccountOwnerProfile(profiles);
  const anchor = getLiuMonthAnchorFromLocalDate();
  const [lunarMonth, setLunarMonth] = useState<number>(anchor.lunarMonth);
  const [solarYear, setSolarYear] = useState<number>(anchor.solarYear);

  const { bundle, loading, error } = useMonthlyConsultationData(
    profile,
    lunarMonth,
    solarYear
  );

  const [pdfLoading, setPdfLoading] = useState<boolean>(false);
  const [activeChapter, setActiveChapter] = useState<MonthlyChapterId>("cover");

  useEffect(() => {
    if (bundle === null) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting);
        if (hit.length > 0) {
          const top = hit.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          const id = top.target.id;
          if ((MONTHLY_CHAPTER_IDS as readonly string[]).includes(id)) {
            setActiveChapter(id as MonthlyChapterId);
          }
        }
      },
      { rootMargin: "-10% 0px -60% 0px", threshold: 0 }
    );
    MONTHLY_CHAPTER_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el !== null) {
        observer.observe(el);
      }
    });
    return () => {
      observer.disconnect();
    };
  }, [bundle]);

  const scrollTo = useCallback((id: string): void => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const buildPrintUrl = async (): Promise<string | null> => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token === undefined || token.length === 0) {
      showAlert("Please sign in first.", "error");
      return null;
    }
    const printOrigin = resolvePrintPageOrigin();
    if (printOrigin.length === 0) {
      showAlert("Could not resolve the print page origin for PDF generation.", "error");
      return null;
    }
    const url = new URL(`${printOrigin}/print/monthly-consultation`);
    url.searchParams.set("pdfToken", token);
    url.searchParams.set("lunarMonth", String(lunarMonth));
    url.searchParams.set("solarYear", String(solarYear));
    return url.toString();
  };

  const handleDownload = async (): Promise<void> => {
    if (pdfLoading) {
      return;
    }
    setPdfLoading(true);
    try {
      const pdfServiceUrl = (process.env.REACT_APP_PDF_SERVICE_URL || "").trim();
      if (pdfServiceUrl.length === 0) {
        showAlert(
          "PDF download is not configured. Set REACT_APP_PDF_SERVICE_URL in .env.local and restart the app.",
          "error"
        );
        return;
      }
      const targetUrl = await buildPrintUrl();
      if (targetUrl === null) {
        return;
      }
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (token === undefined || token.length === 0) {
        return;
      }
      await exportPdfViaServer(
        targetUrl,
        async () => `Bearer ${token}`,
        `Monthly-Consultation-${profile?.name ?? "report"}-M${String(lunarMonth)}-${String(solarYear)}.pdf`
      );
      showAlert("Monthly Consultation PDF downloaded.", "success");
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

  const handlePrintPreview = async (): Promise<void> => {
    try {
      const targetUrl = await buildPrintUrl();
      if (targetUrl === null) {
        return;
      }
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    } catch {
      showAlert("Could not open print preview.", "error");
    }
  };

  if (!hasMonthlyConsultation) {
    return <AccessDeniedView />;
  }

  if (profile === null || loading || bundle === null) {
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
              {error ?? "Loading your monthly consultation…"}
            </p>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (error !== null) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center p-6" style={{ background: C.cream }}>
          <p className="text-sm" style={{ color: C.coral }}>{error}</p>
        </div>
      </PageTransition>
    );
  }

  const monthSelector = (
    <div
      className="flex flex-wrap items-end gap-4 p-4 rounded-2xl"
      style={{ background: `${C.navy}06`, border: `1px solid ${C.border}` }}
    >
      <label className="flex flex-col gap-1 text-xs" style={{ color: C.muted }}>
        Lunar month (matches Liu Month chart)
        <select
          className="rounded-lg px-3 py-2 text-sm"
          style={{ border: `1px solid ${C.border}`, color: C.navy, background: C.cream }}
          value={lunarMonth}
          onChange={(e) => {
            const next = Number(e.target.value);
            if (Number.isFinite(next) && next >= 1 && next <= 12) {
              setLunarMonth(next);
            }
          }}
        >
          {Array.from({ length: 12 }, (_u, i) => i + 1).map((m) => (
            <option key={m} value={m}>{`Lunar month ${String(m)}`}</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs" style={{ color: C.muted }}>
        Year
        <input
          type="number"
          className="rounded-lg px-3 py-2 text-sm w-28"
          style={{ border: `1px solid ${C.border}`, color: C.navy, background: C.cream }}
          value={solarYear}
          onChange={(e) => {
            const next = Number(e.target.value);
            if (Number.isFinite(next) && next >= 1900 && next <= 2100) {
              setSolarYear(next);
            }
          }}
        />
      </label>
    </div>
  );

  const footerActions = SHOW_PDF_ACTIONS ? (
    <>
      <button
        type="button"
        onClick={() => { void handleDownload(); }}
        disabled={pdfLoading}
        className="w-full px-4 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
        style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.coral})`, color: C.white }}
      >
        {pdfLoading ? "Generating PDF…" : "Download PDF"}
      </button>
      <button
        type="button"
        onClick={() => { void handlePrintPreview(); }}
        className="w-full px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
        style={{ background: "transparent", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.2)" }}
      >
        Print Preview
      </button>
    </>
  ) : undefined;

  return (
    <PageTransition>
      <DocumentViewerLayout
        profileName={profile.name}
        contextTitle="Monthly Consultation"
        brandLabel="Personal Monthly Briefing"
        appNavItems={appNavItems}
        chapters={MONTHLY_CHAPTERS}
        activeChapter={activeChapter}
        onChapterClick={scrollTo}
        footerActions={footerActions}
      >
        <MonthlyConsultationBody
          bundle={bundle}
          monthSelector={isAdmin ? monthSelector : undefined}
        />
      </DocumentViewerLayout>
    </PageTransition>
  );
};

export default MonthlyConsultationPage;
