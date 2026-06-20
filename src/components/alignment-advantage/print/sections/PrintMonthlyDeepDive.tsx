import React from "react";
import { SectionPill } from "../primitives/SectionPill";
import { OrnamentalDivider } from "../primitives/OrnamentalDivider";
import { SEASON_ILLUSTRATIONS } from "../primitives/SeasonIllustrations";
import { CURRENT_YEAR } from "../../data/constants";
import type { TimingRow } from "../../data/types";
import { PALACE_DATA } from "../../../../utils/forecast/alignmentTimingData";

export interface PrintMonthlyDeepDiveProps {
  row: TimingRow;
  monthIndex: number;
}

type SignalKey = "green" | "yellow" | "red";

interface SignalConfig {
  bg: string;
  text: string;
  accent: string;
  label: string;
  bestFor: string[];
}

const SIG_CONFIG: Record<SignalKey, SignalConfig> = {
  green: {
    bg: "#f0fdf4", text: "#166534", accent: "#16a34a",
    label: "Green Light — Execute",
    bestFor: ["Major decisions and commitments", "Signing contracts and formalising agreements", "Launching new ventures or campaigns", "High-stakes investments and capital deployment", "Raising prices, launching premium offers, or expanding scope"],
  },
  yellow: {
    bg: "#fffbeb", text: "#92400e", accent: "#d97706",
    label: "Yellow Light — Proceed with Caution",
    bestFor: ["Strategic planning and preparation", "Due diligence and research", "Building and deepening relationships", "Refining systems and processes", "Preparing for future green-light execution"],
  },
  red: {
    bg: "#fff1f2", text: "#881337", accent: "#f43f5e",
    label: "Red Light — Protect & Plan",
    bestFor: ["Consolidating and protecting existing assets", "Rest, recovery, and energy management", "Reviewing and auditing current commitments", "Maintaining relationships without major asks", "Building the foundation for future cycles"],
  },
};

const SEASON_FOCUS: Record<string, string> = {
  Spring: "Expansion and initiative-taking dominate this period. Channel energy into visible, forward-moving actions.",
  Summer: "Harvest and monetisation are the natural rhythm. Consolidate and convert what has been built.",
  Autumn: "Consolidation and review are called for. Protect what is working and gracefully release what is not.",
  Winter: "Foundation-building and deep work are most productive. Invest in preparation for the next spring cycle.",
};

function resolveSignalConfig(signal: TimingRow["signal"]): SignalConfig {
  if (signal === "green" || signal === "yellow" || signal === "red") {
    return SIG_CONFIG[signal];
  }
  return SIG_CONFIG.green;
}

export const PrintMonthlyDeepDive: React.FC<PrintMonthlyDeepDiveProps> = ({ row, monthIndex }) => {
  const palaceEntry = PALACE_DATA[row.palaceName];
  const sc = resolveSignalConfig(row.signal);
  const stars = palaceEntry?.stars ?? 3;
  const watchOut = palaceEntry?.watchOut ?? [];
  const currentMonth = new Date().getMonth() + 1;
  const isCurrentMonth = monthIndex === (currentMonth - 1);
  const monthParts = row.month.split(" ");
  const monthFirst = monthParts[0];
  const monthRest = monthParts.length > 1 ? ` ${monthParts.slice(1).join(" ")}` : "";
  const seasonFocus = SEASON_FOCUS[row.season] ?? "";

  return (
    <section className="print-page-break print-avoid-break" style={{ padding: "48px 0 32px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
        <div style={{ flex: 1 }}>
          <SectionPill>{`Month ${monthIndex + 1} of 12 · ${CURRENT_YEAR}${isCurrentMonth ? " · You Are Here" : ""}`}</SectionPill>
          <h2 style={{ fontSize: 34, fontWeight: 800, color: "#1a1e3f", margin: "2px 0 8px", fontFamily: "Georgia, 'Times New Roman', serif" }}>
            <span style={{ color: "#c9873a", fontStyle: "italic" }}>{monthFirst}</span>
            {monthRest}
          </h2>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 600, background: "rgba(201,135,58,0.12)", color: "#c9873a", padding: "2px 10px", borderRadius: 20, letterSpacing: "0.06em" }}>{row.season}</span>
            <span style={{ fontSize: 10, fontWeight: 600, background: "rgba(107,91,149,0.1)", color: "#6b5b95", padding: "2px 10px", borderRadius: 20 }}>{row.palaceName} Palace</span>
            {isCurrentMonth && <span style={{ fontSize: 10, fontWeight: 700, background: "#c9873a", color: "white", padding: "2px 10px", borderRadius: 20 }}>Current Month</span>}
          </div>
        </div>
        <div style={{ flexShrink: 0, marginLeft: 16 }}>
          {SEASON_ILLUSTRATIONS[row.season] ?? SEASON_ILLUSTRATIONS.Spring}
        </div>
      </div>
      <OrnamentalDivider />

      <div style={{ background: sc.bg, border: `1px solid ${sc.accent}44`, borderRadius: 14, padding: "16px 22px", marginBottom: 20, display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ width: 14, height: 14, borderRadius: "50%", background: sc.accent, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: sc.accent }}>{sc.label}</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: sc.text, marginTop: 4 }}>{row.priority}</p>
        </div>
        <div style={{ display: "flex", gap: 3 }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <span key={s} style={{ width: 10, height: 10, borderRadius: "50%", background: s <= stars ? sc.accent : "rgba(0,0,0,0.1)" }} />
          ))}
        </div>
      </div>

      <div style={{ borderLeft: "3px solid #6b5b95", paddingLeft: 16, marginBottom: 22 }}>
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b5b95", marginBottom: 6 }}>Strategic Directive</p>
        <p style={{ fontSize: 15, fontWeight: 700, color: "#1a1e3f", lineHeight: 1.65, fontStyle: "italic", fontFamily: "Georgia, serif" }}>&ldquo;{row.directive}&rdquo;</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 22 }}>
        <div>
          <p className="pp-section-header" style={{ color: "#16a34a", borderColor: "rgba(22,163,74,0.30)" }}>Best For This Month</p>
          <ul style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {sc.bestFor.map((item, i) => (
              <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "7px 0", borderBottom: "1px solid rgba(26,30,63,0.06)" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: sc.accent, flexShrink: 0, marginTop: 5 }} />
                <span style={{ fontSize: 11, color: "#1a1e3f", lineHeight: 1.5 }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="pp-section-header" style={{ color: "#be3e50", borderColor: "rgba(190,62,80,0.30)" }}>Watch Out</p>
          {watchOut.length > 0 ? (
            <ul style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {watchOut.map((item, i) => (
                <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "7px 0", borderBottom: "1px solid rgba(26,30,63,0.06)" }}>
                  <span className="pp-num" style={{ background: "rgba(190,62,80,0.10)", color: "#be3e50", flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                  <span style={{ fontSize: 11, color: "#1a1e3f", lineHeight: 1.5 }}>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: 12, color: "#5c5c5c", lineHeight: 1.6 }}>Stay alert to over-committing or rushing decisions better made in the next cycle.</p>
          )}
        </div>
      </div>

      <div style={{ paddingTop: 18, borderTop: "1px solid rgba(201,135,58,0.20)", display: "flex", gap: 20, alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <p className="pp-section-header">Area of Focus</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#1a1e3f", marginBottom: 6, fontFamily: "Georgia, serif" }}>{palaceEntry?.area ?? row.palaceName}</p>
          <p style={{ fontSize: 12, color: "#5c5c5c", lineHeight: 1.65 }}>{seasonFocus}</p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{ fontSize: 40, fontWeight: 900, color: sc.accent, lineHeight: 1, fontFamily: "Georgia, serif", fontStyle: "italic" }}>{monthIndex + 1}</p>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#a89bc4" }}>of 12</p>
        </div>
      </div>
    </section>
  );
};
