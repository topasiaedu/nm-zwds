import React from "react";
import { CURRENT_YEAR } from "../../data/constants";
import type { TimingRow } from "../../data/types";

export const SEASON_ILLUSTRATIONS: Record<string, React.ReactElement> = {
  Spring: (
    <svg viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="90" height="90" aria-hidden="true">
      <circle cx="45" cy="45" r="43" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.2" opacity="0.7"/>
      <path d="M45 70 L45 36" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M45 52 C37 45 27 46 25 36 C33 34 43 40 45 52Z" fill="#16a34a" opacity="0.55"/>
      <path d="M45 52 C53 45 63 46 65 36 C57 34 47 40 45 52Z" fill="#16a34a" opacity="0.55"/>
      <circle cx="45" cy="29" r="9" fill="#16a34a" opacity="0.18"/>
      <circle cx="36" cy="34" r="6" fill="#16a34a" opacity="0.18"/>
      <circle cx="54" cy="34" r="6" fill="#16a34a" opacity="0.18"/>
      <circle cx="45" cy="29" r="4.5" fill="#16a34a" opacity="0.8"/>
    </svg>
  ),
  Summer: (
    <svg viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="90" height="90" aria-hidden="true">
      <circle cx="45" cy="45" r="43" fill="#fffbeb" stroke="#d97706" strokeWidth="1.2" opacity="0.7"/>
      <circle cx="45" cy="45" r="18" fill="#d97706" opacity="0.2"/>
      <circle cx="45" cy="45" r="11" fill="#d97706" opacity="0.7"/>
      {([0, 45, 90, 135, 180, 225, 270, 315] as number[]).map((deg, i) => {
        const r = (deg * Math.PI) / 180;
        return (
          <line key={i}
            x1={45 + 15 * Math.cos(r)} y1={45 + 15 * Math.sin(r)}
            x2={45 + (i % 2 === 0 ? 32 : 27) * Math.cos(r)} y2={45 + (i % 2 === 0 ? 32 : 27) * Math.sin(r)}
            stroke="#d97706" strokeWidth={i % 2 === 0 ? 2.2 : 1.5} strokeLinecap="round" opacity={i % 2 === 0 ? 0.9 : 0.55}
          />
        );
      })}
    </svg>
  ),
  Autumn: (
    <svg viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="90" height="90" aria-hidden="true">
      <circle cx="45" cy="45" r="43" fill="#fff7ed" stroke="#ea580c" strokeWidth="1.2" opacity="0.7"/>
      <path d="M45 18 L49 28 L59 22 L54 32 L65 30 L58 38 L68 41 L60 46 L63 57 L53 50 L52 63 L45 55 L38 63 L37 50 L27 57 L30 46 L22 41 L32 38 L25 30 L36 32 L31 22 L41 28 Z" fill="#ea580c" opacity="0.55"/>
      <line x1="45" y1="63" x2="45" y2="74" stroke="#c2410c" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Winter: (
    <svg viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="90" height="90" aria-hidden="true">
      <circle cx="45" cy="45" r="43" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.2" opacity="0.7"/>
      {([0, 60, 120] as number[]).map((deg, i) => {
        const r = (deg * Math.PI) / 180;
        return (
          <line key={i}
            x1={45 - 32 * Math.cos(r)} y1={45 - 32 * Math.sin(r)}
            x2={45 + 32 * Math.cos(r)} y2={45 + 32 * Math.sin(r)}
            stroke="#2563eb" strokeWidth="2" strokeLinecap="round" opacity="0.8"
          />
        );
      })}
      <circle cx="45" cy="45" r="5" fill="#2563eb" opacity="0.85"/>
    </svg>
  ),
};

export const CompactTimingTable: React.FC<{ rows: TimingRow[] }> = ({ rows }) => (
  <div className="print-page-break print-avoid-break" style={{ padding: "48px 0 32px" }}>
    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#6b5b95", marginBottom: 4 }}>
      Strategic Timing
    </p>
    <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1a1e3f", marginBottom: 6 }}>
      12-Month Roadmap — {CURRENT_YEAR}
    </h2>
    <div style={{ borderTop: "1px solid rgba(107,91,149,0.14)", marginBottom: 20, marginTop: 12 }} />
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
      <thead>
        <tr style={{ background: "#1a1e3f" }}>
          {["Month", "Signal", "Focus Area", "Priority", "Executive Action", "Risk Mitigation"].map((h) => (
            <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: "#d4b896", fontWeight: 700, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.1)" }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => {
          const dotColor = row.signal === "green" ? "#10b981" : row.signal === "yellow" ? "#f59e0b" : "#f43f5e";
          const rowBg = idx % 2 === 0 ? "#ffffff" : "#f6f0e8";
          return (
            <tr key={row.month} style={{ background: rowBg }}>
              <td style={{ padding: "8px 12px", fontWeight: 600, color: "#1a1e3f", border: "1px solid rgba(107,91,149,0.1)", whiteSpace: "nowrap" }}>{row.month}</td>
              <td style={{ padding: "8px 12px", border: "1px solid rgba(107,91,149,0.1)", whiteSpace: "nowrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: dotColor, display: "inline-block", flexShrink: 0 }} aria-hidden="true" />
                  <span style={{ fontWeight: 600, color: dotColor, fontSize: 11 }}>{row.signal.charAt(0).toUpperCase() + row.signal.slice(1)}</span>
                </span>
              </td>
              <td style={{ padding: "8px 12px", color: "#1a1e3f", border: "1px solid rgba(107,91,149,0.1)" }}>{row.palaceName}</td>
              <td style={{ padding: "8px 12px", color: "#5c5c5c", border: "1px solid rgba(107,91,149,0.1)" }}>{row.priority}</td>
              <td style={{ padding: "8px 12px", color: "#5c5c5c", fontStyle: "italic", border: "1px solid rgba(107,91,149,0.1)", lineHeight: 1.4 }}>{row.directive}</td>
              <td style={{ padding: "8px 12px", color: "#5c5c5c", border: "1px solid rgba(107,91,149,0.1)", lineHeight: 1.4 }}>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {row.watchOut.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);
