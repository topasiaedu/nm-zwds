import React from "react";
import { Clock } from "lucide-react";
import { SectionPill } from "../primitives/SectionPill";
import { OrnamentalDivider } from "../primitives/OrnamentalDivider";
import { IconCircle } from "../primitives/IconCircle";
import type { AlignmentAdvantageData } from "../../data/types";
import { DAYUN_SEASON_COLORS } from "../../content/resolvers";

/** Subset of AlignmentAdvantageData required for the 10-year life cycle page. */
export type PrintDayunCycleProps = Pick<AlignmentAdvantageData, "dayunGuidance">;

export const PrintDayunCycle: React.FC<PrintDayunCycleProps> = ({ dayunGuidance }) => {
  if (dayunGuidance === null) return null;

  const sc = DAYUN_SEASON_COLORS[dayunGuidance.season] ?? DAYUN_SEASON_COLORS.spring;
  const phaseWidth = dayunGuidance.phase === "building" ? "30%" : dayunGuidance.phase === "peak" ? "65%" : "90%";

  return (
    <section className="print-page-break print-avoid-break" style={{ padding: "48px 0 32px" }}>
      <SectionPill>10-Year Life Cycle</SectionPill>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
        <IconCircle icon={Clock} />
        <h2 className="pp-heading" style={{ marginBottom: 0 }}>Your Current DaYun Phase</h2>
      </div>
      <OrnamentalDivider />

      <div style={{ background: sc.bg, border: `1px solid ${sc.accent}33`, borderRadius: 14, padding: "20px 24px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: sc.accent, marginBottom: 4 }}>
            {dayunGuidance.season.charAt(0).toUpperCase() + dayunGuidance.season.slice(1)} Season · {dayunGuidance.seasonTitle}
          </p>
          <p style={{ fontSize: 18, fontWeight: 800, color: sc.text }}>{dayunGuidance.coreMessage}</p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 24 }}>
          <p style={{ fontSize: 10, color: "#5c5c5c" }}>Cycle years</p>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#1a1e3f" }}>{dayunGuidance.startYear}-{dayunGuidance.endYear}</p>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <p className="pp-section-header">
          Phase: {dayunGuidance.phase.charAt(0).toUpperCase() + dayunGuidance.phase.slice(1)}
        </p>
        <div style={{ height: 7, background: "rgba(107,91,149,0.12)", borderRadius: 999, overflow: "hidden", marginBottom: 6 }}>
          <div style={{ width: phaseWidth, height: "100%", background: "linear-gradient(90deg, #6b5b95, #c9873a)", borderRadius: 999 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {(["Building", "Peak", "Integration"] as const).map((p) => (
            <span key={p} style={{ fontSize: 10, color: dayunGuidance.phase === p.toLowerCase() ? "#c9873a" : "#a89bc4", fontWeight: dayunGuidance.phase === p.toLowerCase() ? 700 : 400 }}>{p}</span>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <div>
          <p className="pp-section-header">Key Actions This Cycle</p>
          <ol style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {dayunGuidance.keyActions.slice(0, 5).map((action, i) => (
              <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 0", borderBottom: "1px solid rgba(26,30,63,0.06)" }}>
                <span className="pp-num" style={{ flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                <span style={{ fontSize: 12, color: "#1a1e3f", lineHeight: 1.55 }}>{action}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <p className="pp-section-header">Success Metrics</p>
          <ul style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {dayunGuidance.successMetrics.slice(0, 5).map((metric, i) => (
              <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 0", borderBottom: "1px solid rgba(26,30,63,0.06)" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: sc.accent, flexShrink: 0, marginTop: 5 }} />
                <span style={{ fontSize: 12, color: "#1a1e3f", lineHeight: 1.55 }}>{metric}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {(dayunGuidance.previousCycle !== undefined || dayunGuidance.nextCycle !== undefined) && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(201,135,58,0.20)" }}>
          {dayunGuidance.previousCycle !== undefined && (
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#a89bc4", marginBottom: 4 }}>Previous Cycle</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#6b5b95", marginBottom: 2 }}>{dayunGuidance.previousCycle.years}</p>
              <p style={{ fontSize: 11, color: "#5c5c5c", textTransform: "capitalize" }}>{dayunGuidance.previousCycle.season} · {dayunGuidance.previousCycle.palace}</p>
            </div>
          )}
          {dayunGuidance.nextCycle !== undefined && (
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#a89bc4", marginBottom: 4 }}>Next Cycle</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#6b5b95", marginBottom: 2 }}>{dayunGuidance.nextCycle.years}</p>
              <p style={{ fontSize: 11, color: "#5c5c5c", textTransform: "capitalize" }}>{dayunGuidance.nextCycle.season} · {dayunGuidance.nextCycle.palace}</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
