/**
 * Part 3 — Year Map & Action Plan.
 */

import React from "react";
import type { AnnualRunReport } from "../../utils/annual-report/types";
import { StarRating } from "./reportUtils";
import ReportPrintPage from "./ReportPrintPage";
import {
  ReportPartHeader,
  ReportSection,
  ReportSubSection,
  ReportBulletList,
} from "./ReportHierarchy";

/**
 * Return a CSS background/text class pair for a 1–5 score cell
 * so the heatmap is scannable at a glance.
 */
function scoreCellStyle(score: number): React.CSSProperties {
  if (score >= 4.5) return { backgroundColor: "#dcfce7", color: "#14532d" };
  if (score >= 3.5) return { backgroundColor: "#f0fdf4", color: "#166534" };
  if (score >= 2.5) return {};
  if (score >= 1.5) return { backgroundColor: "#fef9ec", color: "#78350f" };
  /* Lowest scores: muted amber-grey rather than red to stay in the new palette */
  return { backgroundColor: "#fef3c7", color: "#92400e" };
}

export interface Part3YearMapProps {
  report: AnnualRunReport;
}

const Part3YearMap: React.FC<Part3YearMapProps> = ({ report }) => {
  const { yearMap } = report;

  return (
    <>
      <ReportPrintPage partId="3" pageId="Part 3.1" id="part-3">
        <ReportPartHeader
          partNumber="3"
          title="Year Map & Action Plan"
          subtitle="Your full year at a glance, the best months to act, and your action plan"
        />

        <ReportSection index="3.1" title="Twelve-Month Overview Map">
          <table className="report-data-table text-xs">
            <thead>
              <tr>
                <th>Month</th>
                <th>Career</th>
                <th>Wealth</th>
                <th>Love</th>
                <th>Health</th>
                <th>Keyword</th>
              </tr>
            </thead>
            <tbody>
              {yearMap.overviewRows.map((row) => (
                <tr key={row.lunarMonthLabel}>
                  <td>
                    <div className="font-semibold text-slate-800">{row.lunarMonthLabel}</div>
                    <div className="text-xs text-slate-400">{row.solarDateRange}</div>
                  </td>
                  <td className="text-center" style={scoreCellStyle(row.career)}>
                    <StarRating rating={row.career} />
                  </td>
                  <td className="text-center" style={scoreCellStyle(row.wealth)}>
                    <StarRating rating={row.wealth} />
                  </td>
                  <td className="text-center" style={scoreCellStyle(row.love)}>
                    <StarRating rating={row.love} />
                  </td>
                  <td className="text-center" style={scoreCellStyle(row.health)}>
                    <StarRating rating={row.health} />
                  </td>
                  <td className="text-slate-600">{row.keyword}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReportSection>

        <ReportSection index="3.2" title="Best & Challenging Months">
          <table className="report-data-table text-sm">
            <thead>
              <tr>
                <th>Category</th>
                <th>Months</th>
                <th>Why</th>
                <th>Strategy</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ["Best for career", yearMap.bestMonths.career],
                  ["Best for wealth", yearMap.bestMonths.wealth],
                  ["Best for love", yearMap.bestMonths.love],
                  ["Best for health/rest", yearMap.bestMonths.health],
                  ["Most challenging", yearMap.bestMonths.mostChallenging],
                ] as const
              ).map(([label, entry]) => (
                <tr key={label}>
                  <td className="font-medium">{label}</td>
                  <td>{entry.months.join(", ")}</td>
                  <td className="text-xs">{entry.why}</td>
                  <td className="text-xs">{entry.strategy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReportSection>
      </ReportPrintPage>

      <ReportPrintPage partId="3" pageId="Part 3.2">
        <ReportSection index="3.3" title="Turning Points & Key Windows">
          <ReportSubSection label="Turning points">
            <ReportBulletList items={yearMap.turningPoints} />
          </ReportSubSection>
          <ReportSubSection label="Golden windows">
            <ReportBulletList items={yearMap.goldenWindows} />
          </ReportSubSection>
          <ReportSubSection label="Caution calendar">
            <ReportBulletList items={yearMap.cautionCalendar} />
          </ReportSubSection>
        </ReportSection>

        <ReportSection index="3.4" title="Your Annual Playbook">
          <ReportSubSection label="3 annual goals">
            <ReportBulletList items={yearMap.playbook.annualGoals} />
          </ReportSubSection>
          <ReportSubSection label="3 guardrails">
            <ReportBulletList items={yearMap.playbook.guardrails} />
          </ReportSubSection>
          <ReportSubSection label="12 monthly keywords">
            <p className="mb-0 leading-relaxed text-slate-600">
              {yearMap.playbook.monthlyKeywords.join(" · ")}
            </p>
          </ReportSubSection>
          <ReportSubSection label="Q1 starter plan">
            <ReportBulletList items={yearMap.playbook.q1StarterPlan} />
          </ReportSubSection>
          <ReportSubSection label="When to re-read">
            <ReportBulletList items={yearMap.playbook.rereadGuide} />
          </ReportSubSection>
          <ReportSubSection label="Closing">
            <p className="italic font-semibold text-slate-700 mb-0">{yearMap.playbook.closingLine}</p>
          </ReportSubSection>
        </ReportSection>
      </ReportPrintPage>
    </>
  );
};

export default Part3YearMap;
