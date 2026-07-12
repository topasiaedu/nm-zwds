import React from "react";
import { Shield } from "lucide-react";
import { SectionPill } from "../primitives/SectionPill";
import { OrnamentalDivider } from "../primitives/OrnamentalDivider";
import { IconCircle } from "../primitives/IconCircle";
import type { AlignmentAdvantageData } from "../../data/types";
import { getAlternativePath } from "../../content/resolvers";

/** Subset of AlignmentAdvantageData required for the risk mitigation page. */
export type PrintRiskMitigationProps = Pick<AlignmentAdvantageData, "dayunGuidance">;

export const PrintRiskMitigation: React.FC<PrintRiskMitigationProps> = ({ dayunGuidance }) => {
  if (dayunGuidance === null) return null;

  const alternativePath = getAlternativePath(dayunGuidance.season);

  return (
    <section className="print-page-break print-avoid-break" aria-label="Risk Mitigation" style={{ padding: "48px 0 32px" }}>
      <SectionPill color="#be3e50">Risk Mitigation</SectionPill>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
        <IconCircle icon={Shield} gradient="linear-gradient(135deg, #be3e50, #d97706)" />
        <h2 className="pp-heading" style={{ marginBottom: 0 }}>Key Risks in Your Current Cycle</h2>
      </div>
      <OrnamentalDivider />
      <p style={{ fontSize: 13, color: "#5c5c5c", marginBottom: 20, lineHeight: 1.6 }}>
        Based on your <strong>{dayunGuidance.season}</strong> season cycle. Address these proactively before they derail your strategy.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {(dayunGuidance.watchOut ?? []).map((item, i) => (
          <div key={i} className="pp-row">
            <span className="pp-num" style={{ background: "rgba(190,62,80,0.1)", color: "#be3e50", flexShrink: 0 }}>{i + 1}</span>
            <span style={{ fontSize: 13, color: "#1a1e3f", lineHeight: 1.5 }}>{item}</span>
          </div>
        ))}
      </div>
      <div style={{ background: "#fff8f0", border: "1px solid rgba(212,184,150,0.4)", borderRadius: 12, padding: "18px 20px" }}>
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#d4af7b", marginBottom: 8 }}>Alternative Path if Misalignment is Detected</p>
        <p style={{ fontSize: 13, color: "#5c5c5c", fontStyle: "italic", lineHeight: 1.6 }}>
          {alternativePath}
        </p>
      </div>
    </section>
  );
};
