import React from "react";
import { SectionPill } from "../primitives/SectionPill";

/** Table of contents page listing all playbook sections. */
export const PrintTableOfContents: React.FC = () => (
  <section className="print-page-break print-avoid-break" aria-label="Table of Contents" style={{ padding: "64px 0 48px" }}>
    <SectionPill>Contents</SectionPill>
    <h2 style={{ fontSize: 32, fontWeight: 800, color: "#1a1e3f", marginBottom: 8, fontFamily: "Georgia, 'Times New Roman', serif" }}>
      Your <span style={{ color: "#c9873a", fontStyle: "italic" }}>Strategic</span> Playbook
    </h2>
    <p style={{ fontSize: 13, color: "#5c5c5c", marginBottom: 40, lineHeight: 1.6 }}>
      A comprehensive strategic intelligence report compiled from your Purple Star Astrology chart.
      Reference this document at key decision points throughout the year ahead.
    </p>

    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {[
        { section: "Strategic Overview", items: ["Executive Summary", "Your ZWDS Chart", "Life Structure Overview", "Your Strategic Decision Filter"] },
        { section: "Timing Intelligence", items: ["10-Year Life Cycle", "Risk Mitigation & Alternative Paths", "Phase Alignment — Season × Wealth Code"] },
        { section: "Wealth Strategy", items: ["Wealth Archetype Profile", "Business Domains & Revenue Strategy", "90-Day Strategic Priorities", "Ideal Collaborator Profile"] },
        { section: "People Intelligence", items: ["Siblings & Peers", "Spouse & Partner", "Friends & Allies", "Parents & Supervisors", "Children & Protégés", "Hua Lu Activation Notes"] },
        { section: "12-Month Roadmap", items: ["Month-by-Month Strategic Deep Dives (12 pages)"] },
        { section: "Reflection", items: ["Strategic Reflection Questions", "12-Month Timing Summary Table"] },
      ].map(({ section, items }, sIdx) => (
        <div key={sIdx} style={{ borderTop: "1px solid rgba(107,91,149,0.14)", paddingTop: 16, paddingBottom: 16 }}>
          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b5b95", marginBottom: 10 }}>{section}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {items.map((item, iIdx) => (
              <div key={iIdx} style={{ display: "flex", alignItems: "center", gap: 0 }}>
                <span style={{ fontSize: 12, color: "#1a1e3f", fontWeight: 500 }}>{item}</span>
                <span style={{ flex: 1, borderBottom: "1px dotted rgba(107,91,149,0.25)", margin: "0 10px", height: 1, alignSelf: "flex-end", marginBottom: 4 }} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    <div style={{ marginTop: 40, background: "linear-gradient(135deg, #1a1e3f 0%, #2d1b4e 100%)", borderRadius: 14, padding: "20px 24px" }}>
      <p style={{ fontSize: 12, color: "#d4b896", lineHeight: 1.7 }}>
        <strong style={{ color: "#ffffff" }}>How to use this report:</strong> Start with the Executive Summary for your strategic snapshot.
        Use the 12-Month Roadmap as your monthly reference. Apply the Decision Framework to every major
        move in the year ahead. This report is your strategic companion — not a one-time read.
      </p>
    </div>
  </section>
);
