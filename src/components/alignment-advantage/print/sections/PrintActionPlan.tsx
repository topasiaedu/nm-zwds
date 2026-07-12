import React from "react";
import { Target } from "lucide-react";
import { SectionPill } from "../primitives/SectionPill";
import { OrnamentalDivider } from "../primitives/OrnamentalDivider";
import { IconCircle } from "../primitives/IconCircle";
import type { AlignmentAdvantageData } from "../../data/types";
import { getActionPlanItem } from "../../content/resolvers";

/** Subset of AlignmentAdvantageData required for the 90-day action plan page. */
export type PrintActionPlanProps = Pick<
  AlignmentAdvantageData,
  "dayunGuidance" | "wealthAnalysis" | "wealthKey"
>;

export const PrintActionPlan: React.FC<PrintActionPlanProps> = ({
  dayunGuidance,
  wealthAnalysis,
  wealthKey,
}) => {
  if (dayunGuidance === null) return null;

  const dayunActions = dayunGuidance.keyActions.slice(0, 4);
  const wealthAction = getActionPlanItem(wealthKey);
  const season = dayunGuidance.season ?? "spring";
  const archetype = wealthAnalysis.dominantArchetype;
  const allActions = [...dayunActions, wealthAction];

  return (
    <section className="print-page-break print-avoid-break" style={{ padding: "48px 0 32px" }}>
      <SectionPill>Your Action Plan</SectionPill>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
        <IconCircle icon={Target} />
        <h2 className="pp-heading" style={{ marginBottom: 0 }}>90-Day Strategic Priorities</h2>
      </div>
      <OrnamentalDivider />
      <p style={{ fontSize: 13, color: "#5c5c5c", marginBottom: 28, lineHeight: 1.6 }}>
        As a <strong>{archetype}</strong> in a <strong>{season.charAt(0).toUpperCase() + season.slice(1)} season</strong>,
        these are your highest-leverage moves for the next 90 days. Execute them in order.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {allActions.map((action, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "14px 0", borderBottom: "1px solid rgba(26,30,63,0.07)" }}>
            <span className="pp-num" style={{ width: 32, height: 32, fontSize: 14, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
            <p style={{ fontSize: 13, color: "#1a1e3f", lineHeight: 1.7 }}>{action}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, borderLeft: "3px solid #c9873a", paddingLeft: 16 }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b5b95", marginBottom: 8 }}>Why These Priorities</p>
        <p style={{ fontSize: 12, color: "#5c5c5c", lineHeight: 1.7 }}>
          These actions are aligned with both your current DaYun season and your dominant wealth archetype.
          They represent the highest-leverage moves available to you in the next 90 days: the intersection
          of what your chart is structured to support and where timing is most favourable.
          Executing these in sequence minimises resistance and maximises return on effort.
        </p>
      </div>
    </section>
  );
};
