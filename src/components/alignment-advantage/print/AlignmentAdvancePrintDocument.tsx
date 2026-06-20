/**
 * Alignment Advantage print document — auth, data loading, and section composition.
 * Rendered by Puppeteer / PDF microservice and browser print preview.
 */

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../../../utils/supabase-client";
import type { Profile } from "../../../context/ProfileContext";
import { fetchPrintProfile } from "../data/fetchPrintProfile";
import { useAlignmentAdvantageData } from "../data/useAlignmentAdvantageData";
import { PRINT_STYLES } from "./printStyles";
import { ChapterOpener } from "./primitives/ChapterOpener";
import { CompactTimingTable } from "./primitives/SeasonIllustrations";
import { PrintGlobalFooter } from "./primitives/PrintGlobalFooter";
import {
  PrintCoverPage,
  PrintTableOfContents,
  PrintExecutiveSummary,
  PrintDecisionFramework,
  PrintStructureProfile,
  PrintWealthBlueprint,
  PrintRevenueStrategy,
  PrintPhaseAlignment,
  PrintActionPlan,
  PrintIdealCollaborator,
  PrintStakeholderIntel,
  PrintDayunCycle,
  PrintRiskMitigation,
  PrintMonthlyDeepDive,
  PrintReflectionQuestions,
  PrintAppendixChart,
} from "./sections";

const AlignmentAdvancePrintDocument: React.FC = () => {
  const [searchParams] = useSearchParams();
  const pdfToken = searchParams.get("pdfToken");

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const printTriggered = useRef(false);

  const data = useAlignmentAdvantageData(profile);

  useEffect(() => {
    if (pdfToken === null || pdfToken === "") return;
    void (async () => {
      await supabase.auth.setSession({
        access_token: pdfToken,
        refresh_token: pdfToken,
      });
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

  return (
    <div
      className="print-root"
      style={{
        background: "#faf0e6",
        color: "#1a1e3f",
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      <style>{PRINT_STYLES}</style>

      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: "96px 0" }} data-pdf-loading="true" className="print-hide">
          <div style={{ textAlign: "center" }}>
            <div
              className="inline-block h-10 w-10 animate-spin rounded-full"
              style={{ border: "3px solid #6b5b95", borderTopColor: "transparent" }}
            />
            <p style={{ marginTop: 16, color: "#6b5b95", fontSize: 14 }}>Preparing your playbook…</p>
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

      {!loading && error === null && profile !== null && data !== null && (
        <div data-pdf-render-ready="true" style={{ display: "flex", flexDirection: "column", gap: 0, padding: "0 24px" }}>
          <PrintCoverPage profile={profile} />
          <PrintTableOfContents />
          <PrintExecutiveSummary
            wealthAnalysis={data.wealthAnalysis}
            wealthKey={data.wealthKey}
            dayunGuidance={data.dayunGuidance}
            currentMonthPalaceData={data.currentMonthPalaceData}
          />
          <PrintDecisionFramework
            wealthAnalysis={data.wealthAnalysis}
            wealthKey={data.wealthKey}
            dayunGuidance={data.dayunGuidance}
          />

          <ChapterOpener
            number="01"
            title="Founder's Blueprint"
            subtitle="Your operating structure type, primary formation, and special formations — the blueprint for how you are naturally wired to build momentum."
          />
          <PrintStructureProfile structureResult={data.structureResult} />

          <ChapterOpener
            number="02"
            title="Wealth Acceleration"
            subtitle="Your wealth archetype, income blueprint, 90-day priorities, and ideal collaborator profile."
          />
          <PrintWealthBlueprint
            chartData={data.chartData}
            wealthAnalysis={data.wealthAnalysis}
            wealthKey={data.wealthKey}
          />
          <PrintRevenueStrategy
            wealthAnalysis={data.wealthAnalysis}
            wealthKey={data.wealthKey}
          />
          <PrintPhaseAlignment
            dayunGuidance={data.dayunGuidance}
            wealthAnalysis={data.wealthAnalysis}
            wealthKey={data.wealthKey}
          />
          <PrintActionPlan
            dayunGuidance={data.dayunGuidance}
            wealthAnalysis={data.wealthAnalysis}
            wealthKey={data.wealthKey}
          />
          <PrintIdealCollaborator wealthKey={data.wealthKey} />

          <ChapterOpener
            number="03"
            title="People Intelligence"
            subtitle="Priority scoring, cross-palace strategy, and operational briefings for peers, partner, allies, sponsors, and successors."
          />
          <PrintStakeholderIntel chartData={data.chartData} strategicData={data.strategicData} />

          <ChapterOpener
            number="04"
            title="Execution Playbook"
            subtitle="Your 10-year cycle, risk mitigation, and month-by-month strategic roadmap."
          />
          <PrintDayunCycle dayunGuidance={data.dayunGuidance} />
          <PrintRiskMitigation dayunGuidance={data.dayunGuidance} />

          {data.timingRows.map((row, idx) => (
            <PrintMonthlyDeepDive key={row.month} row={row} monthIndex={idx} />
          ))}

          <PrintReflectionQuestions dayunGuidance={data.dayunGuidance} />

          {data.timingRows.length > 0 && <CompactTimingTable rows={data.timingRows} />}

          <PrintAppendixChart chartData={data.chartData} />
          <PrintGlobalFooter profileName={profile.name} />
        </div>
      )}
    </div>
  );
};

export { AlignmentAdvancePrintDocument };
