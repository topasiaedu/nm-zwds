import React from "react";
import { GitFork } from "lucide-react";
import { SectionPill } from "../primitives/SectionPill";
import { OrnamentalDivider } from "../primitives/OrnamentalDivider";
import { IconCircle } from "../primitives/IconCircle";
import type { AlignmentAdvantageData } from "../../data/types";
import { getStopDoingItems, getFrameworkRecommendation } from "../../content/resolvers";
import { PHASE_LABELS } from "../../../../utils/dayun/seasonMapper";

/** Subset of AlignmentAdvantageData required for the decision framework worksheet. */
export type PrintDecisionFrameworkProps = Pick<
  AlignmentAdvantageData,
  "wealthAnalysis" | "wealthKey" | "dayunGuidance"
>;

export const PrintDecisionFramework: React.FC<PrintDecisionFrameworkProps> = ({
  wealthAnalysis,
  wealthKey,
  dayunGuidance,
}) => {
  const stopDoingItems = getStopDoingItems(wealthKey);
  const seasonKey = dayunGuidance?.season ?? "spring";

  return (
    <section className="print-page-break print-avoid-break" aria-label="Decision Framework" style={{ padding: "48px 0 32px" }}>
      <SectionPill>Lifetime Tool</SectionPill>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
        <IconCircle icon={GitFork} />
        <h2 className="pp-heading" style={{ marginBottom: 0 }}>Your Strategic Decision Filter</h2>
      </div>
      <OrnamentalDivider />
      <p style={{ fontSize: 13, color: "#5c5c5c", marginBottom: 24, lineHeight: 1.6 }}>
        Use this worksheet for every future high-stakes decision. Write your decision below, then test it against your three-axis alignment. If it doesn&apos;t pass all three, rethink the move.
      </p>

      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#1a1e3f", marginBottom: 8 }}>The Decision on the Table:</p>
        <div style={{ width: "100%", height: 60, border: "1px solid rgba(26,30,63,0.2)", borderRadius: 8, background: "#faf0e6" }} />
      </div>

      <div style={{ marginBottom: 28 }}>
        {[
          {
            axis: "Structural Alignment",
            color: "#6b5b95",
            q: `Does this decision rely on my ${wealthAnalysis.dominantArchetype} advantage, or does it force me to operate outside my zone of genius?`,
          },
          {
            axis: "Timing Alignment",
            color: "#10b981",
            q: `My current 10-year cycle is in the ${PHASE_LABELS[seasonKey] ?? "Expansion"} phase. Does this decision respect this season, or am I forcing the wrong energy?`,
          },
          {
            axis: "Wealth Alignment",
            color: "#c9873a",
            q: `Does this move eliminate one of my known profit drains: ${stopDoingItems[0] ?? "wasting energy"}?`,
          },
        ].map(({ axis, color, q }) => (
          <div key={axis} style={{ display: "flex", flexDirection: "column", gap: 8, padding: "16px 0", borderBottom: "1px solid rgba(26,30,63,0.07)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 20, height: 20, border: "2px solid rgba(26,30,63,0.2)", borderRadius: 4, flexShrink: 0 }} />
              <span style={{ fontSize: 14, fontWeight: 700, color }}>{axis}</span>
            </div>
            <span style={{ fontSize: 13, color: "#1a1e3f", lineHeight: 1.5, paddingLeft: 32 }}>{q}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 0 }}>
        <p className="pp-section-header">Evaluation Rules</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {([3, 2, 1, 0] as const).map((score) => {
            const rec = getFrameworkRecommendation(score);
            const scoreColors = ["#10b981", "#f59e0b", "#f97316", "#f43f5e"] as const;
            const barColor = scoreColors[3 - score];
            return (
              <div key={score} style={{ borderLeft: `3px solid ${barColor}`, paddingLeft: 12, paddingTop: 4, paddingBottom: 4 }}>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5c5c5c", marginBottom: 3 }}>
                  Score {score}/3
                </p>
                <p style={{ fontSize: 12, fontWeight: 700, color: barColor, marginBottom: 3 }}>{rec.heading}</p>
                <p style={{ fontSize: 11, color: "#5c5c5c", lineHeight: 1.5 }}>{rec.copy}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
