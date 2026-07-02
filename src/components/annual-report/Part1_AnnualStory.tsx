/**
 * Part 1 — Annual Story & Domain Guide.
 */

import React from "react";
import type { AnnualRunReport } from "../../utils/annual-report/types";
import { EnergyBar } from "./reportUtils";
import { getPalaceEnglish } from "../../utils/annual-report/domainConfig";
import { getPlainAnnualTransformationInsight } from "../../utils/annual-report/starCombinations";
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {annualStory.quarterlyArc.map((q) => (
              <div key={q.quarter}>
                <EnergyBar score={q.averageScore} label={`${q.quarter}: ${q.label}`} />
                <p className="text-xs text-gray-600 mb-0">{q.summary}</p>
              </div>
            ))}
          </div>
        </ReportSubSection>
      </ReportSection>

      <ReportSection index="1.2" title="Annual Transformations (流年四化)">
        <p className="text-sm text-gray-600 mb-3">
          These four shifts show where this year&apos;s energy lands on your chart and what to watch for.
        </p>
        <table className="report-data-table">
          <thead>
            <tr>
              <th>Shift</th>
              <th>Star</th>
              <th>Lands in</th>
              <th>What it means for you</th>
            </tr>
          </thead>
          <tbody>
            {annualStory.liuYearTransformations.map((activation) => (
              <tr key={`${activation.kind}-${activation.starName}`}>
                <td>{activation.kind}</td>
                <td>{activation.starName}</td>
                <td>{getPalaceEnglish(activation.targetPalaceName)}</td>
                <td className="text-xs">
                  {getPlainAnnualTransformationInsight(
                    activation.kind,
                    getPalaceEnglish(activation.targetPalaceName)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ReportSection>

      <ReportSection index="1.3" title="Opportunities and Risks">
        <ReportSubSection label="Opportunities">
          <ul className="space-y-2 text-sm">
            {annualStory.opportunities.map((item) => (
              <li key={item.title} className="border-l-2 border-emerald-500 pl-3 py-0.5">
                <p className="font-semibold text-slate-800">{item.title}</p>
                <p className="text-slate-600">{item.detail}</p>
                <p className="text-emerald-700 text-xs mt-0.5">
                  <strong>What to do:</strong> {item.posture}
                </p>
              </li>
            ))}
          </ul>
        </ReportSubSection>
        <ReportSubSection label="Risks">
          <ul className="space-y-2 text-sm">
            {annualStory.risks.map((item) => (
              <li key={item.title} className="border-l-2 border-amber-500 pl-3 py-0.5">
                <p className="font-semibold text-slate-800">{item.title}</p>
                <p className="text-slate-600">{item.detail}</p>
                <p className="text-amber-700 text-xs mt-0.5">
                  <strong>What to do:</strong> {item.posture}
                </p>
              </li>
            ))}
          </ul>
        </ReportSubSection>
      </ReportSection>
    </ReportPrintPage>
  );
};

export default Part1AnnualStory;
