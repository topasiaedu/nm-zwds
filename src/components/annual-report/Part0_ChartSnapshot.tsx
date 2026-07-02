/**
 * Annual report cover page.
 */

import React from "react";
import type { AnnualRunReport } from "../../utils/annual-report/types";
import { formatBirthDate, formatBirthHour } from "./reportUtils";
import ReportPrintPage from "./ReportPrintPage";
import { ReportSection, ReportBulletList } from "./ReportHierarchy";

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

  return (
    <ReportPrintPage className="annual-report-cover" pageId="Cover" partId="cover">
      <div className="text-center py-4">
        <p className="text-xs font-bold uppercase tracking-[0.25em] mb-4 text-indigo-700">
          Zi Wei Dou Shu · Annual Destiny Guide
        </p>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
          Your {reportYear} Destiny Guide
        </h1>
        <p className="text-lg text-slate-600 mb-1 font-medium">{subject.name}</p>
        <p className="text-sm text-slate-500 mb-6">
          {reportMeta.stemBranchLabel} · {reportMeta.lunarYearLabel}
        </p>
        <div className="text-left max-w-md mx-auto text-sm text-gray-600 space-y-4">
          <ReportSection index="—" title="How to Use This Report">
            <ReportBulletList
              items={[
                "This report shows tendencies in your chart, not a fixed future. Your choices still matter.",
                "Read Part 1 first to understand what this year is about.",
                "Before a big decision, open that month’s section for practical guidance.",
                "Everything here is built from your birth chart, this year’s flow, and each month’s flow.",
              ]}
            />
          </ReportSection>
          <div className="border-t border-b border-gray-200 py-4 space-y-2">
            <div className="flex justify-between"><span>Birth Date</span><strong>{formatBirthDate(subject.birthday)}</strong></div>
            <div className="flex justify-between"><span>Birth Time</span><strong>{formatBirthHour(subject.birthTime)}</strong></div>
            <div className="flex justify-between"><span>Gender</span><strong className="capitalize">{subject.gender}</strong></div>
            <div className="flex justify-between"><span>Report Year</span><strong>{reportYear}</strong></div>
          </div>
          <p className="text-xs text-gray-400">Generated {generatedDate}</p>
          <p className="text-xs text-gray-500">{reportMeta.disclaimer}</p>
        </div>
      </div>
    </ReportPrintPage>
  );
};

export default Part0ChartSnapshot;
