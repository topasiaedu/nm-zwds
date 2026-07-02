/**
 * Single A4 print page wrapper with brand bar and footer.
 */

import React from "react";
import type { ReportPartId } from "./ReportHierarchy";
import { ReportPartZone } from "./ReportHierarchy";
import { getMonthThemeClass } from "./monthThemes";

export interface ReportPrintPageProps {
  children: React.ReactNode;
  /** Part zone for background differentiation */
  partId?: ReportPartId;
  pageId?: string;
  id?: string;
  className?: string;
  /** Lunar month 1–12 — applies a distinct per-month color theme */
  lunarMonth?: number;
}

const ReportPrintPage: React.FC<ReportPrintPageProps> = ({
  children,
  partId,
  pageId,
  id,
  className = "",
  lunarMonth,
}) => {
  const monthThemeClass =
    lunarMonth !== undefined ? getMonthThemeClass(lunarMonth) : "";

  const inner = partId !== undefined ? (
    <ReportPartZone partId={partId} monthThemeClass={monthThemeClass || undefined}>
      {children}
    </ReportPartZone>
  ) : (
    children
  );

  const pageClass = [
    "annual-report-print-page",
    monthThemeClass !== "" ? "annual-report-month-page" : "",
    monthThemeClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={pageClass} data-page-id={pageId} id={id}>
      <div className="annual-report-brand-bar" aria-hidden="true" />
      <div className="annual-report-page-inner">
        {inner}
        <footer className="annual-report-page-footer">
          <span>CAE GOH · Zi Wei Dou Shu Annual Guide</span>
          {pageId !== undefined && pageId !== "" ? <span>{pageId}</span> : null}
        </footer>
      </div>
    </section>
  );
};

export default ReportPrintPage;
