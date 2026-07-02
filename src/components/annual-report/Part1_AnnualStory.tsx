/**
 * Part 1 — Annual Story & Domain Guide.
 */

import React from "react";
import type { AnnualRunReport } from "../../utils/annual-report/types";
import {
  AnnualTransformationCard,
  AnnualTransformationGrid,
  OpportunityRiskSplit,
  QuarterScoreGrid,
} from "./reportUtils";
import { getPlainLifeAreaName } from "../../utils/annual-report/domainConfig";
import { getBriefAnnualTransformationInsight } from "../../utils/annual-report/starCombinations";
import { getStarEnglishLabel } from "../../utils/annual-report/reportLabels";
import ReportPrintPage from "./ReportPrintPage";
import {
  ReportPartHeader,
  ReportSection,
  ReportSubSection,
} from "./ReportHierarchy";

export interface Part1AnnualStoryProps {
  report: AnnualRunReport;
}

const Part1AnnualStory: React.FC<Part1AnnualStoryProps> = ({ report }) => {
  const { annualStory } = report;

  return (
    <ReportPrintPage partId="1" pageId="Part 1" id="part-1">
      <ReportPartHeader
        partNumber="1"
        title="Your Year at a Glance"
        subtitle="What this year is about, how energy shifts, and where to focus"
      />

      <ReportSection index="1.1" title="Year Theme and Energy">
        <ReportSubSection label="What this year is about">
          <p className="font-semibold text-gray-900 mb-1">{annualStory.yearTheme}</p>
          <p className="text-sm text-gray-600 mb-0">
            <strong>Your keyword for the year:</strong> {annualStory.annualKeyword}
          </p>
        </ReportSubSection>
        <ReportSubSection label="How the year flows">
          <p className="mb-0">{annualStory.energyArc}</p>
        </ReportSubSection>
        <ReportSubSection label="Quarter by quarter">
          <QuarterScoreGrid quarters={annualStory.quarterlyArc} />
        </ReportSubSection>
      </ReportSection>

      <ReportSection index="1.2" title="Annual Transformations">
        <p className="text-sm text-gray-600 mb-3">
          Where this year&apos;s energy lands on your chart.
        </p>
        <AnnualTransformationGrid>
          {annualStory.liuYearTransformations.map((activation) => (
            <AnnualTransformationCard
              key={`${activation.kind}-${activation.starName}`}
              kind={activation.kind}
              starLabel={getStarEnglishLabel(activation.starName)}
              palaceLabel={getPlainLifeAreaName(activation.targetPalaceName)}
              insight={getBriefAnnualTransformationInsight(activation.kind)}
            />
          ))}
        </AnnualTransformationGrid>
      </ReportSection>

      <ReportSection index="1.3" title="Opportunities and Risks">
        <OpportunityRiskSplit
          opportunities={annualStory.opportunities}
          risks={annualStory.risks}
        />
      </ReportSection>
    </ReportPrintPage>
  );
};

export default Part1AnnualStory;
