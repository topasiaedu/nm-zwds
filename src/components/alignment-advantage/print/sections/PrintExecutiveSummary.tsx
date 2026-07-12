import React from "react";
import { FileText } from "lucide-react";
import { SectionPill } from "../primitives/SectionPill";
import { OrnamentalDivider } from "../primitives/OrnamentalDivider";
import { IconCircle } from "../primitives/IconCircle";
import type { AlignmentAdvantageData } from "../../data/types";
import { getWealthTypeProfile } from "../../content/resolvers";
import { getSignalColor } from "../../../../utils/forecast/alignmentTimingData";

/** Subset of AlignmentAdvantageData required for the executive summary page. */
export type PrintExecutiveSummaryProps = Pick<
  AlignmentAdvantageData,
  "wealthAnalysis" | "wealthKey" | "dayunGuidance" | "currentMonthPalaceData"
>;

export const PrintExecutiveSummary: React.FC<PrintExecutiveSummaryProps> = ({
  wealthAnalysis,
  wealthKey,
  dayunGuidance,
  currentMonthPalaceData,
}) => {
  const wTypeProfile = getWealthTypeProfile(wealthKey);

  const summaryRows: Array<{ num: number; label: string; value: string; italic?: boolean }> = [
    {
      num: 1,
      label: "Wealth Archetype",
      value: `${wealthAnalysis.dominantArchetype}: ${wTypeProfile.tagline}`,
    },
    ...(dayunGuidance !== null ? [{
      num: 2,
      label: "Life Season",
      value: `${dayunGuidance.season.charAt(0).toUpperCase()}${dayunGuidance.season.slice(1)} Season${dayunGuidance.coreMessage.length > 0 ? `: ${dayunGuidance.coreMessage}` : ""}`,
    }] : []),
    ...(dayunGuidance !== null ? [{
      num: 3,
      label: "Current Cycle Phase",
      value: `${dayunGuidance.phase.charAt(0).toUpperCase()}${dayunGuidance.phase.slice(1)} Phase (${dayunGuidance.startYear}-${dayunGuidance.endYear})`,
    }] : []),
    ...(currentMonthPalaceData !== null ? [{
      num: 4,
      label: "This Month",
      value: `${currentMonthPalaceData.area}: ${currentMonthPalaceData.priority}. ${getSignalColor(currentMonthPalaceData.stars) === "green" ? "Green light: execute." : getSignalColor(currentMonthPalaceData.stars) === "yellow" ? "Yellow light: proceed with caution." : "Red light: protect your position."}`,
    }] : []),
    ...(currentMonthPalaceData !== null ? [{
      num: 5,
      label: "Monthly Directive",
      value: currentMonthPalaceData.directive,
      italic: true,
    }] : []),
  ];

  return (
    <section className="print-page-break print-avoid-break" aria-label="Executive Summary" style={{ padding: "48px 0 32px" }}>
      <SectionPill>Executive Summary</SectionPill>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
        <IconCircle icon={FileText} />
        <h2 className="pp-heading" style={{ marginBottom: 0 }}>
          Your <span className="pp-accent">Strategic</span> Profile at a Glance
        </h2>
      </div>
      <OrnamentalDivider />
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 24 }}>
        {summaryRows.map(({ num, label, value, italic }) => (
          <div key={num} className="pp-row">
            <span className="pp-num" style={{ flexShrink: 0 }}>{num}</span>
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c9873a", marginBottom: 4 }}>{label}</p>
              <p style={{ fontSize: 13, color: "#1a1e3f", lineHeight: 1.5, fontStyle: italic === true ? "italic" : "normal" }}>{value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
