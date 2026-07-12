import React from "react";
import { Zap } from "lucide-react";
import { SectionPill } from "../primitives/SectionPill";
import { OrnamentalDivider } from "../primitives/OrnamentalDivider";
import { IconCircle } from "../primitives/IconCircle";
import { TwelvePalaceMiniGrid } from "../../shared/TwelvePalaceMiniGrid";
import type { AlignmentAdvantageData } from "../../data/types";
import { getWealthTypeProfile, getStopDoingItems } from "../../content/resolvers";
import type { ChartData } from "../../../../utils/zwds/types";

/** Subset of AlignmentAdvantageData required for the wealth archetype blueprint page. */
export type PrintWealthBlueprintProps = Pick<
  AlignmentAdvantageData,
  "wealthAnalysis" | "wealthKey"
> & {
  chartData: ChartData;
};

const ARCHETYPE_HANZI: Record<string, { char: string; pinyin: string; meaning: string }> = {
  investmentBrain: { char: "财", pinyin: "Cái", meaning: "Wealth" },
  brandingMagnet: { char: "名", pinyin: "Míng", meaning: "Reputation" },
  strategyPlanner: { char: "谋", pinyin: "Móu", meaning: "Strategy" },
  collaborator: { char: "合", pinyin: "Hé", meaning: "Harmony" },
};

export const PrintWealthBlueprint: React.FC<PrintWealthBlueprintProps> = ({
  chartData,
  wealthAnalysis,
  wealthKey,
}) => {
  const wTypeProfile = getWealthTypeProfile(wealthKey);
  const stopDoingItems = getStopDoingItems(wealthKey);
  const hanzi = ARCHETYPE_HANZI[wealthKey] ?? { char: "财", pinyin: "Cái", meaning: "Wealth" };
  const archetypeFirst = wealthAnalysis.dominantArchetype.split(" ")[0];
  const archetypeRest = wealthAnalysis.dominantArchetype.split(" ").slice(1).join(" ");

  return (
    <section className="print-page-break print-avoid-break" style={{ padding: "48px 0 32px" }}>
      <SectionPill color="#d97706">Wealth Acceleration Blueprint</SectionPill>

      <div style={{ marginBottom: 24 }}>
        <p className="pp-section-header">Structural Indicators: Wealth, Property, and Career Palaces</p>
        <TwelvePalaceMiniGrid chartData={chartData} highlightPalaces={["财帛", "田宅", "官禄"]} />
      </div>

      <div style={{ marginBottom: 24 }}>
        <p className="pp-section-header">Wealth Code Scores</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {wealthAnalysis.codes.slice(0, 4).map((code) => (
            <div key={code.key} style={{ display: "grid", gridTemplateColumns: "140px 1fr 32px", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#1a1e3f" }}>{code.label}</span>
              <div style={{ height: 7, background: "rgba(201,135,58,0.12)", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ width: `${(code.score / 10) * 100}%`, height: "100%", background: "linear-gradient(90deg, #c9873a, #6b5b95)", borderRadius: 999 }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#c9873a", textAlign: "right" }}>{code.score}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "stretch", gap: 20, marginBottom: 20 }}>
        <div style={{
          width: 120, flexShrink: 0,
          background: "linear-gradient(160deg, #1a1e3f 0%, #2d1b4e 100%)",
          borderRadius: 14,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "20px 12px",
          gap: 4,
        }}>
          <span style={{ fontSize: 72, lineHeight: 1, color: "#c9873a", fontWeight: 700 }}>{hanzi.char}</span>
          <span style={{ fontSize: 11, color: "rgba(201,135,58,0.7)", letterSpacing: "0.14em" }}>{hanzi.pinyin}</span>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.12em" }}>{hanzi.meaning}</span>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <IconCircle icon={Zap} gradient="linear-gradient(135deg, #d97706, #c9873a)" />
            <h2 className="pp-heading" style={{ marginBottom: 0 }}>
              <span className="pp-accent">{archetypeFirst}</span>{" "}
              {archetypeRest}
            </h2>
          </div>
          <p style={{ fontSize: 13, color: "#5c5c5c", lineHeight: 1.6, marginLeft: 52 }}>
            {wTypeProfile.tagline}
          </p>
          <div style={{ display: "flex", gap: 8, marginLeft: 52 }}>
            <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(201,135,58,0.12)", color: "#c9873a", padding: "3px 10px", borderRadius: 20, letterSpacing: "0.08em" }}>
              {wTypeProfile.category}
            </span>
          </div>
        </div>
      </div>
      <OrnamentalDivider />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 24 }}>
        <div>
          <p className="pp-section-header">Wealth Category</p>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#1a1e3f", marginBottom: 6, fontFamily: "Georgia, serif" }}>{wTypeProfile.category}</p>
          <p style={{ fontSize: 12, color: "#5c5c5c", lineHeight: 1.65 }}>{wTypeProfile.tagline}</p>
        </div>
        <div>
          <p className="pp-section-header">Archetype Summary</p>
          <p style={{ fontSize: 12, color: "#1a1e3f", lineHeight: 1.75 }}>{wealthAnalysis.summaryText}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 24 }}>
        <div>
          <p className="pp-section-header" style={{ color: "#16a34a", borderColor: "rgba(22,163,74,0.30)" }}>Strengths</p>
          <ul style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {wealthAnalysis.strengths.slice(0, 5).map((s, i) => (
              <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "8px 0", borderBottom: "1px solid rgba(26,30,63,0.06)" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a", flexShrink: 0, marginTop: 5 }} />
                <span style={{ fontSize: 12, color: "#1a1e3f", lineHeight: 1.5 }}>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="pp-section-header" style={{ color: "#be3e50", borderColor: "rgba(190,62,80,0.30)" }}>Blind Spots</p>
          <ul style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {wealthAnalysis.blindSpots.slice(0, 5).map((s, i) => (
              <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "8px 0", borderBottom: "1px solid rgba(26,30,63,0.06)" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#be3e50", flexShrink: 0, marginTop: 5 }} />
                <span style={{ fontSize: 12, color: "#1a1e3f", lineHeight: 1.5 }}>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <p className="pp-section-header" style={{ color: "#be3e50", borderColor: "rgba(190,62,80,0.30)" }}>Stop Doing</p>
        <p style={{ fontSize: 12, color: "#5c5c5c", marginBottom: 12 }}>These patterns quietly drain your wealth-building energy:</p>
        <ul style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {stopDoingItems.map((item, i) => (
            <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 0", borderBottom: "1px solid rgba(26,30,63,0.06)" }}>
              <span className="pp-num" style={{ background: "rgba(190,62,80,0.10)", color: "#be3e50", flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
              <span style={{ fontSize: 12, color: "#1a1e3f", lineHeight: 1.5 }}>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
