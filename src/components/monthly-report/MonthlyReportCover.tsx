/**
 * Cover page for the 12-month monthly forecast HTML report.
 */

import React from "react";
import type { MonthlyForecastReport } from "../../utils/forecast/buildMonthlyForecastReport";

export interface MonthlyReportCoverProps {
  report: MonthlyForecastReport;
}

/**
 * Format birth hour index into a display range.
 */
function formatBirthHour(hourIndex: string): string {
  const hour = parseInt(hourIndex, 10);
  if (Number.isNaN(hour)) {
    return hourIndex;
  }
  const timeRanges: { start: number; end: number; range: string }[] = [
    { start: 23, end: 1, range: "23:00–00:59" },
    { start: 1, end: 3, range: "01:00–02:59" },
    { start: 3, end: 5, range: "03:00–04:59" },
    { start: 5, end: 7, range: "05:00–06:59" },
    { start: 7, end: 9, range: "07:00–08:59" },
    { start: 9, end: 11, range: "09:00–10:59" },
    { start: 11, end: 13, range: "11:00–12:59" },
    { start: 13, end: 15, range: "13:00–14:59" },
    { start: 15, end: 17, range: "15:00–16:59" },
    { start: 17, end: 19, range: "17:00–18:59" },
    { start: 19, end: 21, range: "19:00–20:59" },
    { start: 21, end: 23, range: "21:00–22:59" },
  ];
  if (hour >= 23 || hour < 1) {
    return timeRanges[0].range;
  }
  for (const tr of timeRanges) {
    if (hour >= tr.start && hour < tr.end) {
      return tr.range;
    }
  }
  return timeRanges[0].range;
}

/**
 * Format gender for display.
 */
function formatGender(gender: string): string {
  if (gender === "male") {
    return "Male";
  }
  if (gender === "female") {
    return "Female";
  }
  return gender;
}

/**
 * Format birth date for cover display.
 */
function formatBirthDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const MonthlyReportCover: React.FC<MonthlyReportCoverProps> = ({ report }) => {
  const generatedDate = new Date(report.generatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section
      className="monthly-report-cover min-h-screen flex flex-col justify-center items-center px-8 py-16 print:min-h-[100vh] print:break-after-page"
      style={{ backgroundColor: "#FDFBF7" }}
    >
      <div
        className="w-full max-w-2xl text-center border-t-8 rounded-lg px-10 py-14 shadow-lg print:shadow-none"
        style={{ borderTopColor: "#991b1b", backgroundColor: "#ffffff" }}
      >
        <p
          className="text-xs font-bold uppercase tracking-[0.25em] mb-6"
          style={{ color: "#991b1b" }}
        >
          Zi Wei Dou Shu · Monthly Strategic Forecast
        </p>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Navigate Your Year
        </h1>

        <p className="text-xl text-gray-600 mb-10">
          12-Month Palace Framework · {report.year}
        </p>

        <div className="border-t border-b border-gray-200 py-8 mb-8 text-left max-w-md mx-auto space-y-3">
          <div className="flex justify-between gap-4">
            <span className="text-gray-500 text-sm font-medium">Name</span>
            <span className="text-gray-900 font-semibold text-sm">{report.subject.name}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500 text-sm font-medium">Birth Date</span>
            <span className="text-gray-900 font-semibold text-sm">
              {formatBirthDate(report.subject.birthday)}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500 text-sm font-medium">Birth Time</span>
            <span className="text-gray-900 font-semibold text-sm">
              {formatBirthHour(report.subject.birthTime)}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500 text-sm font-medium">Gender</span>
            <span className="text-gray-900 font-semibold text-sm">
              {formatGender(report.subject.gender)}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500 text-sm font-medium">Report Year</span>
            <span className="text-gray-900 font-semibold text-sm">{report.year}</span>
          </div>
        </div>

        <p className="text-xs text-gray-400">
          Generated {generatedDate} · CAE GOH Purple Star Astrology
        </p>

        <p className="text-xs text-gray-500 mt-6 max-w-lg mx-auto leading-relaxed">
          Palace sequence is personalized from your birth chart. Scores and guidance reflect the
          Palace Archetype Framework — general energetic patterns by palace type, not individual
          star analysis.
        </p>
      </div>
    </section>
  );
};

export default MonthlyReportCover;
