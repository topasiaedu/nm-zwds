/**
 * Yearly overview table for the monthly forecast report.
 */

import React from "react";
import type { YearlyOverviewRow } from "../../utils/forecast/buildMonthlyForecastReport";

export interface YearlyOverviewTableProps {
  rows: YearlyOverviewRow[];
  year: number;
}

const SEASON_COLORS: Record<string, string> = {
  Spring: "#f97316",
  Summer: "#eab308",
  Autumn: "#10b981",
  Winter: "#3b82f6",
};

/**
 * Render energy stars for table cell.
 */
function EnergyStars({ rating }: { rating: 3 | 4 | 5 }): React.ReactElement {
  return (
    <span className="text-amber-500 text-xs">
      {Array.from({ length: rating }, (_, i) => (
        <span key={i}>★</span>
      ))}
    </span>
  );
}

const YearlyOverviewTable: React.FC<YearlyOverviewTableProps> = ({ rows, year }) => {
  return (
    <section
      className="monthly-report-overview px-6 py-10 print:px-8 print:py-12 print:break-after-page"
      style={{ backgroundColor: "#FDFBF7" }}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
          {year} Monthly Focus at a Glance
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Lunar month · Gregorian dates · Palace focus · Seasonal energy
        </p>

        <div className="overflow-x-auto rounded-lg shadow print:shadow-none border border-gray-200">
          <table className="w-full text-xs border-collapse" style={{ backgroundColor: "#FEFBF4" }}>
            <thead>
              <tr style={{ backgroundColor: "#b4583c", color: "#ffffff" }}>
                <th className="px-3 py-2 text-left font-semibold uppercase">Lunar Month</th>
                <th className="px-3 py-2 text-left font-semibold uppercase">Dates</th>
                <th className="px-3 py-2 text-left font-semibold uppercase">Palace</th>
                <th className="px-3 py-2 text-left font-semibold uppercase">Area</th>
                <th className="px-3 py-2 text-left font-semibold uppercase">Season</th>
                <th className="px-3 py-2 text-left font-semibold uppercase">Energy</th>
                <th className="px-3 py-2 text-left font-semibold uppercase">Priority</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.lunarMonthLabel} className="border-t border-gray-200">
                  <td className="px-3 py-2 font-medium text-gray-900">{row.lunarMonthLabel}</td>
                  <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{row.solarDateRange}</td>
                  <td className="px-3 py-2 text-gray-800">{row.palaceEnglish}</td>
                  <td className="px-3 py-2 text-gray-700">{row.area}</td>
                  <td className="px-3 py-2">
                    <span
                      className="inline-block px-2 py-0.5 rounded text-white text-xs font-medium"
                      style={{ backgroundColor: SEASON_COLORS[row.season] ?? "#6b7280" }}
                    >
                      {row.season}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <EnergyStars rating={row.starRating} />
                  </td>
                  <td className="px-3 py-2 text-gray-700">{row.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default YearlyOverviewTable;
