import React, { useMemo } from "react";
import { Users } from "lucide-react";
import { SectionPill } from "../primitives/SectionPill";
import { OrnamentalDivider } from "../primitives/OrnamentalDivider";
import { IconCircle } from "../primitives/IconCircle";
import { PrintSparkle } from "../primitives/PrintSparkle";
import { TwelvePalaceMiniGrid } from "../../shared/TwelvePalaceMiniGrid";
import { PEOPLE_SYNTHESIS } from "../../../../utils/forecast/people/peoplePalaceData";
import type { PeoplePalaceKey } from "../../../../utils/forecast/people/peoplePalaceData";
import {
  analyzePeoplePalaces,
  analyzePeopleChapterStats,
  buildPeoplePriorityBars,
  buildPeopleSnapshotHighlights,
  buildPeopleCrossPalaceStrategy,
  buildPalaceActivationTiles,
  buildPalaceStarRoster,
  resolvePeopleSynthesisKey,
} from "../../shared/helpers/peoplePalaceAnalysis";
import {
  getPeoplePalaceActions,
  getPeoplePalaceWatchOuts,
  getPeoplePalaceStarContext,
} from "../../shared/peoplePalaceGuidance";
import type { PeoplePalaceReading } from "../../shared/helpers/peoplePalaceAnalysis";
import type { ChartData } from "../../../../utils/zwds/types";
import type { StrategicData } from "../../data/types";

export interface PrintStakeholderIntelProps {
  chartData: ChartData;
  strategicData?: StrategicData;
}

const PEOPLE_HIGHLIGHTS: PeoplePalaceKey[] = ["兄弟", "夫妻", "交友", "父母", "子女"];

const PrintPalaceBriefing: React.FC<{
  reading: PeoplePalaceReading;
  rank?: number;
  score?: number;
  isPrimary?: boolean;
  focusLabel?: string;
}> = ({ reading, rank, score, isPrimary = false, focusLabel }) => {
  const { framing, hasMainStars } = reading;
  const activationTiles = buildPalaceActivationTiles(reading);
  const starRoster = buildPalaceStarRoster(reading);
  const actions = getPeoplePalaceActions(reading);
  const risks = getPeoplePalaceWatchOuts(reading);
  const starsSummary = getPeoplePalaceStarContext(reading);
  const heroLine = hasMainStars ? framing.bottomLine : framing.emptyPalaceGuidance;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#e8642d", margin: "0 0 4px" }}>
            Relationship Palace
          </p>
          <p style={{ fontSize: 15, fontWeight: 800, color: "#1a1e3f", margin: "0 0 4px", fontFamily: "Georgia,'Times New Roman',serif" }}>
            {framing.sectionTitle}
          </p>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b5b95", margin: "0 0 6px" }}>
            {framing.strategicRole}
          </p>
          <p style={{ fontSize: 11, color: "#1a1e3f", lineHeight: 1.45, margin: 0 }}>
            {heroLine}
          </p>
        </div>
        {rank !== undefined && score !== undefined && (
          <div
            style={{
              minWidth: 88,
              textAlign: "center",
              padding: "10px 12px",
              borderRadius: 12,
              background: isPrimary ? "rgba(232,100,45,0.1)" : "rgba(26,30,63,0.06)",
              border: isPrimary ? "1px solid rgba(232,100,45,0.25)" : "1px solid rgba(201,135,58,0.2)",
            }}
          >
            <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: isPrimary ? "#e8642d" : "#6b5b95", margin: "0 0 2px" }}>
              Priority #{rank}
            </p>
            <p style={{ fontSize: 22, fontWeight: 800, color: "#1a1e3f", margin: "0 0 2px", fontFamily: "Georgia,'Times New Roman',serif" }}>
              {score}
            </p>
            {focusLabel !== undefined && (
              <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#6b5b95", margin: 0 }}>
                {focusLabel}
              </p>
            )}
          </div>
        )}
      </div>

      <div style={{ marginBottom: 12 }}>
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#e8642d", margin: "0 0 6px" }}>
          Activations In This Palace
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
          {activationTiles.map((tile) => (
            <div
              key={tile.kind}
              style={{
                padding: "8px 6px",
                borderRadius: 8,
                textAlign: "center",
                border: tile.active ? "1px solid rgba(22,163,74,0.3)" : "1px solid rgba(201,135,58,0.15)",
                background: tile.active ? "rgba(22,163,74,0.06)" : "rgba(26,30,63,0.03)",
                opacity: tile.active ? 1 : 0.7,
              }}
            >
              <p style={{ fontSize: 8, fontWeight: 700, color: "#1a1e3f", margin: "0 0 2px" }}>{tile.shortLabel}</p>
              <p style={{ fontSize: 7, color: "#6b5b95", margin: 0 }}>
                {tile.active && tile.starLabel !== null ? `Active · ${tile.starLabel}` : "Off"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {starRoster.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1a1e3f", margin: "0 0 6px" }}>
            Stars In This Palace
          </p>
          <p style={{ fontSize: 10, color: "#1a1e3f", margin: "0 0 4px", lineHeight: 1.6 }}>
            {starRoster.map((chip) => chip.pinyin).join(" · ")}
          </p>
          <p style={{ fontSize: 10, color: "#6b5b95", margin: 0, lineHeight: 1.45 }}>
            {starsSummary}
          </p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: "linear-gradient(135deg, #1a1e3f 0%, #2a2f55 100%)", borderRadius: 12, padding: "14px 16px" }}>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.85)", margin: "0 0 8px" }}>
            What To Do Now
          </p>
          {actions.map((action, idx) => (
            <p key={idx} style={{ fontSize: 10, color: "rgba(255,255,255,0.92)", marginBottom: idx < actions.length - 1 ? 6 : 0, lineHeight: 1.45 }}>
              {idx + 1}. {action}
            </p>
          ))}
        </div>

        {risks.length > 0 && (
          <div style={{ border: "1px solid rgba(232,100,45,0.25)", borderRadius: 12, padding: "12px 14px" }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#e8642d", margin: "0 0 6px" }}>
              What To Watch
            </p>
            {risks.map((item, idx) => (
              <p key={idx} style={{ fontSize: 10, color: "#1a1e3f", marginBottom: idx < risks.length - 1 ? 4 : 0, lineHeight: 1.45 }}>
                · {item}
              </p>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export const PrintStakeholderIntelOverview: React.FC<PrintStakeholderIntelProps> = ({
  chartData,
  strategicData,
}) => {
  const palaceReadings = useMemo(() => analyzePeoplePalaces(chartData), [chartData]);
  const chapterStats = useMemo(() => analyzePeopleChapterStats(chartData), [chartData]);
  const priorityBars = useMemo(
    () => buildPeoplePriorityBars(chartData, palaceReadings, chapterStats.luTargetPalace),
    [chartData, palaceReadings, chapterStats.luTargetPalace]
  );
  const snapshotHighlights = useMemo(
    () => buildPeopleSnapshotHighlights(palaceReadings, chapterStats.luTargetPalace),
    [palaceReadings, chapterStats.luTargetPalace]
  );
  const crossPalaceStrategy = useMemo(
    () => buildPeopleCrossPalaceStrategy(chartData, palaceReadings, strategicData?.season ?? undefined),
    [chartData, palaceReadings, strategicData?.season]
  );
  const synthesisKey = useMemo(() => resolvePeopleSynthesisKey(chartData), [chartData]);

  return (
    <>
      <section className="print-page-break print-avoid-break" aria-label="People Intelligence Overview" style={{ padding: "48px 0 32px" }}>
        <SectionPill>People Intelligence</SectionPill>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
          <IconCircle icon={Users} />
          <h2 className="pp-heading" style={{ marginBottom: 0 }}>Your Five Relationship Palaces</h2>
        </div>
        <OrnamentalDivider />

        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b5b95", textAlign: "center", marginBottom: 12 }}>
          Structural Indicators: Siblings, Spouse, Friends, Parents, Children
        </p>
        <div style={{ marginBottom: 24 }}>
          <TwelvePalaceMiniGrid chartData={chartData} highlightPalaces={PEOPLE_HIGHLIGHTS} />
        </div>

        <p className="pp-section-header">Relationship Priority Distribution</p>
        {(snapshotHighlights.resourcePalace !== null || snapshotHighlights.boundaryPalaces.length > 0) && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 12 }}>
            {snapshotHighlights.resourcePalace !== null && (
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#15803d" }}>
                Resource · {snapshotHighlights.resourcePalace}
              </span>
            )}
            {snapshotHighlights.boundaryPalaces.length > 0 && (
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#be3e50" }}>
                Boundary · {snapshotHighlights.boundaryPalaces.join(", ")}
              </span>
            )}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px" }}>
          {priorityBars.map((row) => (
            <div key={row.palaceKey}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {row.isPrimary && (
                    <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#e8642d", background: "rgba(232,100,45,0.1)", padding: "2px 6px", borderRadius: 999 }}>
                      Primary
                    </span>
                  )}
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#1a1e3f" }}>{row.palaceLabel}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: row.isPrimary ? "#e8642d" : "#1a1e3f" }}>{row.score}</span>
              </div>
              <div style={{ height: 4, background: "rgba(201,135,58,0.12)", borderRadius: 999, marginBottom: 4 }}>
                <div style={{ width: `${row.score}%`, height: "100%", background: row.isPrimary ? "linear-gradient(90deg, #1a1e3f, #e8642d)" : "linear-gradient(90deg, #1a1e3f88, #1a1e3f55)", borderRadius: 999 }} />
              </div>
              <p style={{ fontSize: 9, color: "#6b5b95", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>{row.leadStar}</p>
            </div>
          ))}
        </div>

        <p className="pp-section-header" style={{ marginTop: 24 }}>People Strategy</p>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 20 }}>
          <div style={{ background: "#fff", border: "1px solid rgba(201,135,58,0.2)", borderRadius: 12, padding: "14px 16px" }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b5b95", marginBottom: 4 }}>Ideal Collaborator</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1e3f", margin: "0 0 8px", fontFamily: "Georgia,'Times New Roman',serif" }}>
              {crossPalaceStrategy.primaryPalaceLabel} Lead
            </p>
            <p style={{ fontSize: 11, color: "#1a1e3f", lineHeight: 1.55, margin: 0 }}>{crossPalaceStrategy.idealCollaborator}</p>
          </div>
          {crossPalaceStrategy.cyclePriority !== null && (
            <div style={{ background: "#1a1e3f", borderRadius: 12, padding: "14px 16px" }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>This Cycle</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#fdf6ee", margin: "0 0 6px", fontFamily: "Georgia,'Times New Roman',serif" }}>
                {crossPalaceStrategy.cyclePriority.palaceLabel}
              </p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", lineHeight: 1.55, margin: 0 }}>{crossPalaceStrategy.cyclePriority.action}</p>
            </div>
          )}
        </div>

        <div style={{ background: "linear-gradient(135deg, #1a1e3f 0%, #2d1b4e 100%)", borderRadius: 14, padding: "20px 24px", display: "flex", gap: 14, alignItems: "flex-start" }}>
          <PrintSparkle size={14} color="#e8642d" style={{ marginTop: 2 }} />
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#e8642d", marginBottom: 6 }}>Pattern Across Your Five Palaces</p>
            <p style={{ fontSize: 13, color: "#ffffff", lineHeight: 1.6 }}>{PEOPLE_SYNTHESIS[synthesisKey]}</p>
          </div>
        </div>
      </section>
    </>
  );
};

/** One print page per palace briefing. */
export const PrintStakeholderIntelPalaces: React.FC<PrintStakeholderIntelProps> = ({
  chartData,
  strategicData,
}) => {
  const palaceReadings = useMemo(() => analyzePeoplePalaces(chartData), [chartData]);
  const chapterStats = useMemo(() => analyzePeopleChapterStats(chartData), [chartData]);
  const priorityBars = useMemo(
    () => buildPeoplePriorityBars(chartData, palaceReadings, chapterStats.luTargetPalace),
    [chartData, palaceReadings, chapterStats.luTargetPalace]
  );

  return (
    <>
      {priorityBars.map((priority) => {
        const reading = palaceReadings.find((r) => r.palaceKey === priority.palaceKey);
        if (reading === undefined) return null;

        return (
          <section
            key={priority.palaceKey}
            className="print-page-break print-avoid-break"
            aria-label={`${reading.framing.sectionTitle} briefing`}
            style={{ padding: "48px 0 32px" }}
          >
            <PrintPalaceBriefing
              reading={reading}
              rank={priority.rank}
              score={priority.score}
              isPrimary={priority.isPrimary}
              focusLabel={priority.focusLabel}
            />
          </section>
        );
      })}
    </>
  );
};

/** @deprecated Use PrintStakeholderIntelOverview + PrintStakeholderIntelPalaces */
export const PrintStakeholderIntel: React.FC<PrintStakeholderIntelProps> = (props) => (
  <>
    <PrintStakeholderIntelOverview {...props} />
    <PrintStakeholderIntelPalaces {...props} />
  </>
);
