import React from "react";
import { TrendingUp } from "lucide-react";
import { SectionPill } from "../primitives/SectionPill";
import { OrnamentalDivider } from "../primitives/OrnamentalDivider";
import { IconCircle } from "../primitives/IconCircle";
import type { AlignmentAdvantageData } from "../../data/types";
import {
  getPhaseAlignmentEntry,
  dayunSeasonToPhaseKey,
  PHASE_ACCENT_COLORS,
  DAYUN_SEASON_COLORS,
  type PhaseAlignmentSeasonKey,
} from "../../content/resolvers";

/** Subset of AlignmentAdvantageData required for the phase alignment deep dive. */
export type PrintPhaseAlignmentProps = Pick<
  AlignmentAdvantageData,
  "dayunGuidance" | "wealthAnalysis" | "wealthKey"
>;

const PHASE_KEYS: PhaseAlignmentSeasonKey[] = ["expansion", "visibility", "consolidation", "foundation"];

export const PrintPhaseAlignment: React.FC<PrintPhaseAlignmentProps> = ({
  dayunGuidance,
  wealthAnalysis,
  wealthKey,
}) => {
  if (dayunGuidance === null) return null;

  const season = dayunGuidance.season ?? "spring";
  const phaseKey = dayunSeasonToPhaseKey(season);
  const entry = getPhaseAlignmentEntry(season, wealthKey);
  if (entry === null) return null;

  const sc = DAYUN_SEASON_COLORS[season] ?? DAYUN_SEASON_COLORS.spring;
  const seasonLabel = `${season.charAt(0).toUpperCase()}${season.slice(1)}`;

  return (
    <section className="print-page-break print-avoid-break" style={{ padding: "48px 0 32px" }}>
      <SectionPill>Strategic Alignment</SectionPill>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
        <IconCircle icon={TrendingUp} />
        <h2 className="pp-heading" style={{ marginBottom: 0 }}>Your Season × Wealth Code Intersection</h2>
      </div>
      <OrnamentalDivider />

      <div style={{ background: sc.bg, border: `1px solid ${sc.accent}44`, borderRadius: 14, padding: "20px 24px", marginBottom: 20 }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: sc.accent, marginBottom: 8 }}>
          {seasonLabel} Season · {wealthAnalysis.dominantArchetype}
        </p>
        <p style={{ fontSize: 15, color: sc.text, lineHeight: 1.7 }}>{entry.copy}</p>
      </div>

      <div style={{ marginBottom: 22 }}>
        <p className="pp-section-header" style={{ color: "#be3e50", borderColor: "rgba(190,62,80,0.30)" }}>Watch Out for This Combination</p>
        {entry.watchOut.map((item: string, i: number) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 0", borderBottom: "1px solid rgba(26,30,63,0.06)" }}>
            <span className="pp-num" style={{ background: "rgba(190,62,80,0.10)", color: "#be3e50", flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
            <span style={{ fontSize: 13, color: "#1a1e3f", lineHeight: 1.5 }}>{item}</span>
          </div>
        ))}
      </div>

      <div style={{ paddingLeft: 16, borderLeft: "3px solid #6b5b95", marginBottom: 22 }}>
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b5b95", marginBottom: 6 }}>Season Directive</p>
        <p style={{ fontSize: 15, fontWeight: 700, color: "#1a1e3f", lineHeight: 1.55, fontFamily: "Georgia, serif" }}>{dayunGuidance.coreMessage}</p>
      </div>

      <div style={{ marginBottom: 0 }}>
        <p className="pp-section-header">Season × Archetype Reference</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {PHASE_KEYS.map((phase) => {
            const phaseEntry = getPhaseAlignmentEntry(phase, wealthKey);
            const isActive = phase === phaseKey;
            const accentColor = PHASE_ACCENT_COLORS[phase];
            return (
              <div key={phase} style={{ borderLeft: `3px solid ${isActive ? accentColor : "rgba(107,91,149,0.20)"}`, paddingLeft: 12 }}>
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: "capitalize", color: accentColor, marginBottom: 3 }}>
                  {phase.charAt(0).toUpperCase() + phase.slice(1)}{isActive ? "  ← current" : ""}
                </p>
                <p style={{ fontSize: 11, color: isActive ? "#1a1e3f" : "#5c5c5c", lineHeight: 1.4 }}>
                  {phaseEntry !== null ? `${phaseEntry.copy.slice(0, 90)}…` : ""}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
