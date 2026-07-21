/**
 * Alignment Advantage print document — auth, data loading, and chapter composition.
 * Rendered by Puppeteer / PDF microservice and browser print preview.
 *
 * Option A parity: composes the same shared chapter components as the in-app
 * viewer (minus DocumentViewerLayout chrome). Old Print* sections are unused here.
 */

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../../../utils/supabase-client";
import type { Profile } from "../../../context/ProfileContext";
import {
  STRUCTURE_LABELS,
  FORMATION_PROFILES,
} from "../../../utils/forecast/structureContentData";
import { fetchPrintProfile } from "../data/fetchPrintProfile";
import { useAlignmentAdvantageData } from "../data/useAlignmentAdvantageData";
import { C } from "../shared/constants";
import { ChapterOverview } from "../chapters/ChapterOverview";
import { ChapterDecisionFramework } from "../chapters/ChapterDecisionFramework";
import { ChapterCoreDesign } from "../chapters/ChapterCoreDesign";
import { ChapterWealthAcceleration } from "../chapters/ChapterWealthAcceleration";
import { ChapterStakeholderIntelligence } from "../chapters/ChapterStakeholderIntelligence";
import { ChapterDayunSeason } from "../chapters/ChapterDayunSeason";
import { ChapterExecutionPlaybook } from "../chapters/ChapterExecutionPlaybook";
import { PRINT_STYLES } from "./printStyles";

/** Same phase display map as the in-app Alignment Advantage page. */
const PHASE_DISPLAY: Record<string, { label: string; bgColor: string; textColor: string }> = {
  spring: { label: "Expansion",     bgColor: `linear-gradient(135deg, #16a34a, #15803d)`, textColor: "#15803d" },
  summer: { label: "Visibility",    bgColor: `linear-gradient(135deg, ${C.coral}, ${C.coralDark})`,  textColor: C.coral },
  autumn: { label: "Consolidation", bgColor: `linear-gradient(135deg, #d97706, #b45309)`,            textColor: "#d97706" },
  winter: { label: "Foundation",    bgColor: `linear-gradient(135deg, #2563eb, #1d4ed8)`,            textColor: "#2563eb" },
};

const AlignmentAdvancePrintDocument: React.FC = () => {
  const [searchParams] = useSearchParams();
  const pdfToken = searchParams.get("pdfToken");

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const printTriggered = useRef(false);

  const data = useAlignmentAdvantageData(profile);

  /**
   * Best-effort session sync for any client hooks that read auth.
   * Profile data itself is loaded via `fetchPrintProfile(pdfToken)` with an
   * explicit user_id filter — do not rely on setSession for identity.
   * Using the access token as refresh_token is invalid; omit refresh when
   * only pdfToken (access JWT) is available.
   */
  useEffect(() => {
    if (pdfToken === null || pdfToken === "") {
      return;
    }
    void (async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser(pdfToken);
      if (userError !== null || userData.user === null) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            "AA print: pdfToken getUser failed:",
            userError?.message ?? "no user"
          );
        }
        return;
      }
      const existing = await supabase.auth.getSession();
      const refreshToken = existing.data.session?.refresh_token;
      if (refreshToken !== undefined && refreshToken !== "") {
        const { error } = await supabase.auth.setSession({
          access_token: pdfToken,
          refresh_token: refreshToken,
        });
        if (error !== null && process.env.NODE_ENV !== "production") {
          console.warn("AA print: setSession did not fully apply:", error.message);
        }
      }
    })();
  }, [pdfToken]);

  useEffect(() => {
    let cancelled = false;

    const run = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      const sessionResult = await supabase.auth.getSession();
      const sessionToken = sessionResult.data.session?.access_token ?? null;
      const bearer = pdfToken !== null && pdfToken !== "" ? pdfToken : sessionToken;

      if (bearer === null) {
        if (!cancelled) {
          setError("Sign in or open this page with a valid pdfToken query parameter.");
          setLoading(false);
        }
        return;
      }

      const fetchedProfile = await fetchPrintProfile(bearer);
      if (cancelled) return;

      if (fetchedProfile === null) {
        setError("Profile not found or access denied.");
        setLoading(false);
        return;
      }

      setProfile(fetchedProfile);
      setLoading(false);
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [pdfToken]);

  useEffect(() => {
    const isPuppeteer = searchParams.get("puppeteer") === "1";
    if (!loading && error === null && profile !== null && data !== null && !isPuppeteer && !printTriggered.current) {
      printTriggered.current = true;
      const id = setTimeout(() => {
        window.print();
      }, 800);
      return () => {
        clearTimeout(id);
      };
    }
    return undefined;
  }, [loading, error, profile, data, searchParams]);

  /** Derive chapter props the same way as the in-app page when data is loaded. */
  const reportBody = (() => {
    if (loading || error !== null || profile === null || data === null) {
      return null;
    }

    const { chartData, strategicData, structureResult } = data;
    const springPhase = {
      label: "Expansion",
      bgColor: "linear-gradient(135deg, #16a34a, #15803d)",
      textColor: "#15803d",
    };
    const phaseConfig = PHASE_DISPLAY[strategicData.season ?? "spring"] ?? springPhase;
    const strLabel = STRUCTURE_LABELS[structureResult.structureType];
    const formation = FORMATION_PROFILES[structureResult.formation];
    const signalHex = strategicData.signal === "green" ? "#16a34a"
      : strategicData.signal === "red" ? C.coral : C.gold;

    return {
      chartData,
      strategicData,
      structureResult,
      phaseConfig,
      strLabel,
      formation,
      signalHex,
      profileName: profile.name,
      profile,
    };
  })();

  return (
    <div
      className="print-root"
      style={{
        background: C.cream,
        color: C.navy,
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
    >
      <style>{PRINT_STYLES}</style>

      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: "96px 0" }} data-pdf-loading="true" className="print-hide">
          <div style={{ textAlign: "center" }}>
            <div
              className="inline-block h-10 w-10 animate-spin rounded-full"
              style={{ border: `3px solid ${C.coral}`, borderTopColor: "transparent" }}
            />
            <p style={{ marginTop: 16, color: C.coral, fontSize: 14 }}>Preparing your playbook…</p>
          </div>
        </div>
      )}

      {!loading && error !== null && (
        <div
          style={{ border: "1px solid #f87171", background: "#fef2f2", borderRadius: 12, padding: 24, textAlign: "center" }}
          data-pdf-error="true"
          className="print-hide"
        >
          <p style={{ color: "#991b1b" }}>{error}</p>
        </div>
      )}

      {reportBody !== null && (
        <div
          data-pdf-render-ready="true"
          data-aa-print-body=""
          style={{ display: "flex", flexDirection: "column", gap: 0, padding: 0 }}
        >
          <ChapterOverview
            profileName={reportBody.profileName}
            chartData={reportBody.chartData}
            strategicData={reportBody.strategicData}
            strLabel={reportBody.strLabel}
            formation={reportBody.formation}
            phaseConfig={reportBody.phaseConfig}
            signalHex={reportBody.signalHex}
          />

          <ChapterDecisionFramework
            strategicData={reportBody.strategicData}
            strLabel={reportBody.strLabel}
            formation={reportBody.formation}
            phaseConfig={reportBody.phaseConfig}
            signalHex={reportBody.signalHex}
          />

          <ChapterCoreDesign
            chartData={reportBody.chartData}
            structureResult={reportBody.structureResult}
            strLabel={reportBody.strLabel}
            formation={reportBody.formation}
          />

          <ChapterWealthAcceleration
            chartData={reportBody.chartData}
            strategicData={reportBody.strategicData}
          />

          <ChapterDayunSeason strategicData={reportBody.strategicData} />

          <ChapterStakeholderIntelligence
            chartData={reportBody.chartData}
            strategicData={reportBody.strategicData}
          />

          <ChapterExecutionPlaybook
            strategicData={reportBody.strategicData}
            chartData={reportBody.chartData}
            profile={reportBody.profile}
            mode="print"
          />
        </div>
      )}
    </div>
  );
};

export { AlignmentAdvancePrintDocument };
