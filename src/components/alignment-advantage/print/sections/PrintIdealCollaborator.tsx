import React from "react";
import { Users } from "lucide-react";
import { SectionPill } from "../primitives/SectionPill";
import { OrnamentalDivider } from "../primitives/OrnamentalDivider";
import { IconCircle } from "../primitives/IconCircle";
import type { AlignmentAdvantageData } from "../../data/types";
import { getIdealCollaborator, getWealthTypeProfile } from "../../content/resolvers";

/** Subset of AlignmentAdvantageData required for the ideal collaborator profile page. */
export type PrintIdealCollaboratorProps = Pick<AlignmentAdvantageData, "wealthKey">;

const COLLABORATION_RED_FLAGS: [string, string, string] = [
  "No clear ownership structure or equity agreement in writing before work begins",
  "Avoids discussing numbers, margins, or financial accountability",
  "Confuses activity with output — busy but unable to show measurable results",
];

export const PrintIdealCollaborator: React.FC<PrintIdealCollaboratorProps> = ({ wealthKey }) => {
  const collab = getIdealCollaborator(wealthKey);
  const wType = getWealthTypeProfile(wealthKey);

  return (
    <section className="print-page-break print-avoid-break" style={{ padding: "48px 0 32px" }}>
      <SectionPill>Team Strategy</SectionPill>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
        <IconCircle icon={Users} />
        <h2 className="pp-heading" style={{ marginBottom: 0 }}>Your Ideal Collaborator Profile</h2>
      </div>
      <OrnamentalDivider />

      <div style={{ background: "#f9f7fd", border: "1px solid rgba(107,91,149,0.18)", borderRadius: 14, padding: "20px 24px", marginBottom: 20 }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b5b95", marginBottom: 8 }}>Why You Need This Person</p>
        <p style={{ fontSize: 14, fontWeight: 700, color: "#1a1e3f", marginBottom: 8 }}>{collab.type}</p>
        <p style={{ fontSize: 13, color: "#5c5c5c", lineHeight: 1.7 }}>{collab.description}</p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <p className="pp-section-header">What to Look For</p>
        {collab.lookFor.map((item: string, i: number) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 0", borderBottom: "1px solid rgba(26,30,63,0.06)" }}>
            <span className="pp-num" style={{ flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
            <span style={{ fontSize: 13, color: "#1a1e3f", lineHeight: 1.5 }}>{item}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 24, paddingTop: 18, borderTop: "1px solid rgba(201,135,58,0.20)" }}>
        <div>
          <p className="pp-section-header">Your Wealth Category</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#1a1e3f", marginBottom: 6, fontFamily: "Georgia, serif" }}>{wType.category}</p>
          <p style={{ fontSize: 12, color: "#5c5c5c", lineHeight: 1.55 }}>{wType.tagline}</p>
        </div>
        <div>
          <p className="pp-section-header">Collaboration Examples</p>
          <ul style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {wType.examples.map((ex: string, i: number) => (
              <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "6px 0", borderBottom: "1px solid rgba(26,30,63,0.06)" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#6b5b95", flexShrink: 0, marginTop: 5 }} />
                <span style={{ fontSize: 12, color: "#1a1e3f" }}>{ex}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <p className="pp-section-header" style={{ color: "#be3e50", borderColor: "rgba(190,62,80,0.30)" }}>Collaboration Red Flags</p>
        <p style={{ fontSize: 12, color: "#5c5c5c", marginBottom: 10, lineHeight: 1.6 }}>
          Regardless of archetype, avoid entering partnerships where these signals are present:
        </p>
        {COLLABORATION_RED_FLAGS.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 0", borderBottom: "1px solid rgba(26,30,63,0.06)" }}>
            <span className="pp-num" style={{ background: "rgba(190,62,80,0.10)", color: "#be3e50", flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
            <span style={{ fontSize: 12, color: "#1a1e3f", lineHeight: 1.5 }}>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
