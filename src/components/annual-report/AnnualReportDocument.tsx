/**
 * Full annual report document — cover through Part 3.
 */

import React from "react";
import type { AnnualRunReport } from "../../utils/annual-report/types";
import Part0ChartSnapshot from "./Part0_ChartSnapshot";
import Part1AnnualStory from "./Part1_AnnualStory";
import Part2MonthlyChapter from "./Part2_MonthlyChapter";
import Part3YearMap from "./Part3_YearMap";
import AnnualReportToolbar from "./AnnualReportToolbar";
import "./annualReportPrint.css";

export interface AnnualReportDocumentProps {
  report: AnnualRunReport;
}

const AnnualReportDocument: React.FC<AnnualReportDocumentProps> = ({ report }) => {
  return (
    <>
      <AnnualReportToolbar
        subjectName={report.subject.name}
        reportYear={report.reportYear}
      />

      <div className="annual-report-document" data-testid="annual-report-document">
        <Part0ChartSnapshot report={report} />
        <Part1AnnualStory report={report} />

        {report.months.map((entry) => (
          <Part2MonthlyChapter
            key={`month-${entry.lunarMonth}`}
            entry={entry}
            reportYear={report.reportYear}
          />
        ))}

        <Part3YearMap report={report} />

        <section className="annual-report-print-page annual-report-no-print">
          <div className="annual-report-page-inner text-center py-8">
            <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
              Use <strong>Save as PDF</strong> (bottom right) for customer delivery. For interactive
              chart views, visit{" "}
              <a href="https://app.caegoh.com" className="text-indigo-700 underline">
                app.caegoh.com
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default AnnualReportDocument;
