import React, { useMemo } from "react";
import type { ChartData } from "../../../utils/zwds/types";
import type { PeoplePalaceKey } from "../../../utils/forecast/people/peoplePalaceData";
import type { StrategicData } from "../data/types";
import { C } from "../shared/constants";
import { SectionHeader } from "../shared/SectionHeader";
import { ReportSheet } from "../shared/ReportSheet";
import { TwelvePalaceMiniGrid } from "../shared/TwelvePalaceMiniGrid";
import { PeoplePriorityDashboard } from "./PeoplePriorityDashboard";
import { PeoplePalaceBriefingBody } from "./PeoplePalaceBriefingBody";
import {
  analyzePeoplePalaces,
  analyzePeopleChapterStats,
  buildPeoplePriorityBars,
  buildPeopleSnapshotHighlights,
} from "../shared/helpers/peoplePalaceAnalysis";

const PEOPLE_HIGHLIGHTS: PeoplePalaceKey[] = ["兄弟", "夫妻", "交友", "父母", "子女"];

const PALACE_PAGE_LABELS: Record<PeoplePalaceKey, string> = {
  "兄弟": "Siblings Palace",
  "夫妻": "Spouse Palace",
  "交友": "Friends Palace",
  "父母": "Parents Palace",
  "子女": "Children Palace",
};

export const ChapterStakeholderIntelligence: React.FC<{
  chartData: ChartData;
  strategicData?: StrategicData;
}> = ({ chartData }) => {
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

  return (
    <div id="people" className="scroll-mt-16 mb-8">
      <ReportSheet watermark="network">
        <SectionHeader
          graphicType="people"
          chapter="Chapter 04 · People Intelligence"
          title="Your Five Relationship Palaces"
          subtitle="Ranked view of peers, partner, friends, mentors, and people you develop."
        />

        <div className="mb-10" data-aa-chart-block="">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6 text-center" style={{ color: C.muted }}>
            Structural Indicators: Siblings, Spouse, Friends, Parents, Children
          </p>
          <TwelvePalaceMiniGrid chartData={chartData} highlightPalaces={PEOPLE_HIGHLIGHTS} />
        </div>

        <div className="mb-12" data-aa-people-priority="">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6" style={{ color: C.muted }}>
            Relationship Priority Distribution
          </p>
          <PeoplePriorityDashboard
            priorityBars={priorityBars}
            resourcePalace={snapshotHighlights.resourcePalace}
            boundaryPalaces={snapshotHighlights.boundaryPalaces}
          />
        </div>
      </ReportSheet>

      {priorityBars.map((priority, idx) => {
        const reading = palaceReadings.find((r) => r.palaceKey === priority.palaceKey);
        if (reading === undefined) return null;

        return (
          <ReportSheet key={priority.palaceKey}>
            <PeoplePalaceBriefingBody
              reading={reading}
              rank={priority.rank}
              score={priority.score}
              isPrimary={priority.isPrimary}
              focusLabel={priority.focusLabel}
              pageLabel={`Chapter 04 · People Intelligence · Page ${idx + 2} of 6 · ${PALACE_PAGE_LABELS[priority.palaceKey]}`}
            />
          </ReportSheet>
        );
      })}
    </div>
  );
};
