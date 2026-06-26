/**
 * Full monthly forecast document — cover, 12 months, yearly overview.
 */

import React from "react";
import type { MonthlyForecastReport } from "../../utils/forecast/buildMonthlyForecastReport";
import MonthlyReportCover from "./MonthlyReportCover";
import MonthlyReportSection from "./MonthlyReportSection";
import YearlyOverviewTable from "./YearlyOverviewTable";

export interface MonthlyForecastDocumentProps {
  report: MonthlyForecastReport;
}

const MonthlyForecastDocument: React.FC<MonthlyForecastDocumentProps> = ({ report }) => {
  return (
    <div className="monthly-forecast-document" data-testid="monthly-forecast-document">
      <MonthlyReportCover report={report} />

      {report.months.map((entry) => (
        <MonthlyReportSection
          key={`${entry.lunarMonth}-${entry.palaceName}`}
          entry={entry}
          year={report.year}
        />
      ))}

      <YearlyOverviewTable rows={report.yearlyOverview} year={report.year} />

      {/* Closing note */}
      <section
        className="px-6 py-12 print:px-8 text-center"
        style={{ backgroundColor: "#FDFBF7" }}
      >
        <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
          This report uses the 12-Palace monthly rotation framework of Zi Wei Dou Shu (紫微斗数).
          For complete star-level analysis, Dayun cycles, and precise timing, explore the full
          Destiny Blueprint at{" "}
          <a href="https://app.caegoh.com" className="text-red-800 underline">
            app.caegoh.com
          </a>
          .
        </p>
        <p className="text-xs text-gray-400 mt-4">
          Zi Wei Dou Shu · 1000 Years of Strategic Wisdom · CAE GOH
        </p>
      </section>
    </div>
  );
};

export default MonthlyForecastDocument;
