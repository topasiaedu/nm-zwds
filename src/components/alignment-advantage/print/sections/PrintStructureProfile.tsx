import React from "react";
import { GitFork } from "lucide-react";
import { SectionPill } from "../primitives/SectionPill";
import { OrnamentalDivider } from "../primitives/OrnamentalDivider";
import { IconCircle } from "../primitives/IconCircle";
import type { StructureAnalysisResult } from "../../../../utils/zwds/analysis/structureAnalysis";
import { getStructureLabel, getFormationProfile } from "../../content/resolvers";

export interface PrintStructureProfileProps {
  structureResult: StructureAnalysisResult;
}

export const PrintStructureProfile: React.FC<PrintStructureProfileProps> = ({ structureResult }) => {
  const strLabel = getStructureLabel(structureResult.structureType);
  const formProfile = getFormationProfile(structureResult.formation);
  const gradColors: Record<string, { start: string; end: string }> = {
    speed: { start: "#f97316", end: "#dc2626" },
    endurance: { start: "#d97706", end: "#b45309" },
  };
  const grad = gradColors[structureResult.structureType] ?? gradColors.speed;

  return (
    <section className="print-page-break print-avoid-break" aria-label="Structure Profile" style={{ padding: "48px 0 32px" }}>
      <SectionPill>Structure &amp; Formation Profile</SectionPill>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
        <IconCircle icon={GitFork} gradient={`linear-gradient(135deg, ${grad.start}, ${grad.end})`} />
        <h2 className="pp-heading" style={{ marginBottom: 0 }}>Your Player Type &amp; Formation</h2>
      </div>
      <OrnamentalDivider />

      <div style={{
        background: `linear-gradient(135deg, ${grad.start}, ${grad.end})`,
        borderRadius: 14, padding: "20px 24px", marginBottom: 20,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)", marginBottom: 4 }}>
            Operating Structure
          </p>
          <p style={{ fontSize: 22, fontWeight: 800, color: "#ffffff", margin: 0 }}>{strLabel.label}</p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 4, maxWidth: 340 }}>{strLabel.description}</p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 24 }}>
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.65)" }}>Star balance</p>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#ffffff" }}>
            N{structureResult.northernCount} · S{structureResult.southernCount}
          </p>
        </div>
      </div>

      <div style={{ border: "1px solid rgba(26,30,63,0.10)", borderRadius: 12, padding: "20px 22px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <p style={{ fontSize: 18, fontWeight: 800, color: "#1a1e3f", margin: 0 }}>{formProfile.englishName}</p>
          <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(107,91,149,0.10)", color: "#6b5b95", padding: "3px 10px", borderRadius: 20, letterSpacing: "0.06em" }}>
            {formProfile.chineseStyle}
          </span>
          <span style={{ fontSize: 10, color: "#a89bc4" }}>{formProfile.subtitle}</span>
        </div>

        <p style={{ fontSize: 12, color: "#5c5c5c", fontStyle: "italic", lineHeight: 1.6, borderLeft: "3px solid #c9873a", paddingLeft: 12, marginBottom: 14 }}>
          &ldquo;{formProfile.tagline}&rdquo;
        </p>

        <p className="pp-section-header" style={{ marginBottom: 6 }}>Key Traits</p>
        <ol style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {formProfile.keyTraits.map((trait, i) => (
            <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 0", borderBottom: "1px solid rgba(26,30,63,0.06)" }}>
              <span className="pp-num" style={{ flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
              <span style={{ fontSize: 12, color: "#1a1e3f", lineHeight: 1.55 }}>{trait}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
