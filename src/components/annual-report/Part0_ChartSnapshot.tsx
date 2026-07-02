/**
 * Annual report cover page.
 */

import React from "react";
import type { AnnualRunReport } from "../../utils/annual-report/types";
import { CoverDetailIcon, CoverEmblem, formatBirthDate, formatBirthHour } from "./reportUtils";
import ReportPrintPage from "./ReportPrintPage";

export interface Part0ChartSnapshotProps {
  report: AnnualRunReport;
}

const Part0ChartSnapshot: React.FC<Part0ChartSnapshotProps> = ({ report }) => {
  const { subject, reportYear, reportMeta } = report;
  const generatedDate = new Date(report.generatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const detailRows: { label: string; value: string; icon: "calendar" | "clock" | "gender" | "year" }[] = [
    { label: "Birth Date", value: formatBirthDate(subject.birthday), icon: "calendar" },
    { label: "Birth Time", value: formatBirthHour(subject.birthTime), icon: "clock" },
    { label: "Gender", value: subject.gender, icon: "gender" },
    { label: "Report Year", value: String(reportYear), icon: "year" },
  ];

  return (
    <ReportPrintPage className="annual-report-cover" pageId="Cover" partId="cover">
      <div className="text-center py-4">
        <p className="text-xs font-bold uppercase tracking-[0.25em] mb-4 text-indigo-700">
          Zi Wei Dou Shu · Annual Destiny Guide
        </p>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
          Your {reportYear} Destiny Guide
        </h1>
        <CoverEmblem />
        <p className="text-lg text-slate-600 mb-1 font-medium">{subject.name}</p>
        <p className="text-sm text-slate-500 mb-6">
          {reportMeta.stemBranchLabel} · {reportMeta.lunarYearLabel}
        </p>
        <div className="text-left max-w-md mx-auto text-sm text-gray-600 space-y-4">
          <div className="border-t border-b border-gray-200 py-4 space-y-2">
            {detailRows.map((row) => (
              <div key={row.label} className="report-cover-detail-row">
                <span className="report-cover-detail-label">
                  <CoverDetailIcon type={row.icon} />
                  <span>{row.label}</span>
                </span>
                <strong className="capitalize">{row.value}</strong>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400">Generated {generatedDate}</p>
          <p className="text-xs text-gray-500">{reportMeta.disclaimer}</p>
        </div>
      </div>
    </ReportPrintPage>
  );
};

export default Part0ChartSnapshot;
