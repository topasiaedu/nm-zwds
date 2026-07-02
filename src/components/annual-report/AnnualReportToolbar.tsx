/**
 * Screen-only toolbar: print / scroll to top. Hidden when printing.
 */

import React from "react";

export interface AnnualReportToolbarProps {
  subjectName: string;
  reportYear: number;
}

const AnnualReportToolbar: React.FC<AnnualReportToolbarProps> = ({
  subjectName,
  reportYear,
}) => {
  const handlePrint = (): void => {
    window.print();
  };

  const handleTop = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="annual-report-toolbar annual-report-no-print" role="toolbar" aria-label="Report actions">
      <button
        type="button"
        className="annual-report-toolbar-top"
        onClick={handleTop}
      >
        Top
      </button>
      <button
        type="button"
        className="annual-report-toolbar-print"
        onClick={handlePrint}
      >
        Save as PDF
      </button>
      <span className="sr-only">
        {`Print or save ${subjectName} ${reportYear} annual report as PDF`}
      </span>
    </div>
  );
};

export default AnnualReportToolbar;
