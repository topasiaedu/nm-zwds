/**
 * Part 3 — Year Map & Action Plan.
 */

import React from "react";
import type { AnnualRunReport } from "../../utils/annual-report/types";
import {
  AnnualPlaybookPanel,
  BestMonthsPanel,
  MONTH_THEME_ACCENT_COLORS,
  StarRating,
  TurningPointsKeyWindowsPanel,
} from "./reportUtils";
import ReportPrintPage from "./ReportPrintPage";
import {
  ReportPartHeader,
  ReportSection,
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
              {yearMap.overviewRows.map((row, rowIndex) => (
                <tr key={row.lunarMonthLabel}>
                  <td className="report-overview-month-cell">
                    <span
                      className="report-overview-month-bar"
                      style={{ backgroundColor: MONTH_THEME_ACCENT_COLORS[rowIndex] ?? "#94a3b8" }}
                    />
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
          <BestMonthsPanel bestMonths={yearMap.bestMonths} />
        </ReportSection>
      </ReportPrintPage>

      <ReportPrintPage partId="3" pageId="Part 3.2">
        <ReportSection index="3.3" title="Turning Points & Key Windows">
          <TurningPointsKeyWindowsPanel
            turningPoints={yearMap.turningPoints}
            goldenWindows={yearMap.goldenWindows}
            cautionCalendar={yearMap.cautionCalendar}
          />
        </ReportSection>

        <ReportSection index="3.4" title="Your Annual Playbook">
          <AnnualPlaybookPanel
            playbook={yearMap.playbook}
            overviewRows={yearMap.overviewRows}
          />
        </ReportSection>
      </ReportPrintPage>
    </>
  );
};

export default Part3YearMap;
