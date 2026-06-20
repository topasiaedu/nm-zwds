import React from "react";
import { Briefcase } from "lucide-react";
import { SectionPill } from "../primitives/SectionPill";
import { OrnamentalDivider } from "../primitives/OrnamentalDivider";
import { IconCircle } from "../primitives/IconCircle";
import type { AlignmentAdvantageData } from "../../data/types";
import { getWealthTypeProfile, getActionPlanItem, getIdealCollaborator } from "../../content/resolvers";

/** Subset of AlignmentAdvantageData required for the revenue strategy page. */
export type PrintRevenueStrategyProps = Pick<
  AlignmentAdvantageData,
  "wealthAnalysis" | "wealthKey"
>;

export const PrintRevenueStrategy: React.FC<PrintRevenueStrategyProps> = ({
  wealthAnalysis,
  wealthKey,
}) => {
  const collab = getIdealCollaborator(wealthKey);
  const actionItem = getActionPlanItem(wealthKey);
  const wTypeProfile = getWealthTypeProfile(wealthKey);

  return (
    <section className="print-page-break print-avoid-break" style={{ padding: "48px 0 32px" }}>
      <SectionPill color="#16a34a">Revenue Strategy</SectionPill>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
        <IconCircle icon={Briefcase} gradient="linear-gradient(135deg, #16a34a, #059669)" />
        <h2 className="pp-heading" style={{ marginBottom: 0 }}>
          Where Your <span className="pp-accent">Wealth</span> Flows Best
        </h2>
      </div>
      <OrnamentalDivider />

      <div style={{ borderLeft: "3px solid #c9873a", paddingLeft: 16, marginBottom: 24 }}>
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c9873a", marginBottom: 6 }}>Your Wealth Category</p>
        <p style={{ fontSize: 15, fontWeight: 700, color: "#1a1e3f", marginBottom: 6, fontFamily: "Georgia, serif" }}>{wTypeProfile.category}</p>
        <p style={{ fontSize: 13, color: "#5c5c5c", lineHeight: 1.65 }}>{wTypeProfile.description}</p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <p className="pp-section-header" style={{ color: "#16a34a", borderColor: "rgba(22,163,74,0.30)" }}>
          Business Domains &amp; Revenue Models
        </p>
        <p style={{ fontSize: 12, color: "#5c5c5c", marginBottom: 14, lineHeight: 1.6 }}>
          These are the business contexts where your chart creates natural leverage — the domains where your wealth code generates disproportionate returns relative to effort.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {wealthAnalysis.idealRoles.slice(0, 6).map((r, i) => (
            <div key={i} style={{ borderLeft: "3px solid #16a34a", paddingLeft: 12, paddingTop: 4, paddingBottom: 4 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#166534", marginBottom: 3 }}>{r.role}</p>
              <p style={{ fontSize: 10, color: "#4b7a5a", lineHeight: 1.45 }}>{r.reason}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, paddingTop: 20, borderTop: "1px solid rgba(201,135,58,0.20)" }}>
        <div>
          <p className="pp-section-header">90-Day Priority Action</p>
          <p style={{ fontSize: 14, color: "#1a1e3f", lineHeight: 1.65, fontStyle: "italic", fontFamily: "Georgia, serif" }}>&ldquo;{actionItem}&rdquo;</p>
        </div>
        <div>
          <p className="pp-section-header">Key Business Partner Type</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1e3f", marginBottom: 6 }}>{collab.type}</p>
          <p style={{ fontSize: 12, color: "#5c5c5c", lineHeight: 1.55 }}>{collab.description}</p>
        </div>
      </div>
    </section>
  );
};
