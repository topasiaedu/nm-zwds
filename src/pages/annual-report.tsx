/**
 * Print-optimized route for the Annual ZWDS 运势 Report.
 *
 * URL: /print/annual-report?name=Jane&birthday=1985-03-15&birth_time=10:30&gender=female&year=2026
 */

import React, { useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AnnualReportDocument from "../components/annual-report/AnnualReportDocument";
import {
  buildAnnualReport,
  chartInputFromParams,
} from "../utils/annual-report/buildAnnualReport";

/**
 * Parse and validate gender query param.
 */
function parseGender(value: string | null): "male" | "female" | null {
  if (value === "male" || value === "female") {
    return value;
  }
  return null;
}

const PrintAnnualReport: React.FC = () => {
  const [searchParams] = useSearchParams();

  const reportResult = useMemo(() => {
    const name = searchParams.get("name");
    const birthday = searchParams.get("birthday");
    const birthTime = searchParams.get("birth_time");
    const gender = parseGender(searchParams.get("gender"));
    const yearParam = searchParams.get("year");
    const year =
      yearParam !== null && yearParam !== ""
        ? parseInt(yearParam, 10)
        : new Date().getFullYear();

    if (
      name === null ||
      name === "" ||
      birthday === null ||
      birthday === "" ||
      birthTime === null ||
      birthTime === "" ||
      gender === null
    ) {
      return {
        error:
          "Missing required parameters: name, birthday, birth_time, gender. Optional: year (defaults to current year).",
      } as const;
    }

    if (Number.isNaN(year) || year < 1900 || year > 2100) {
      return { error: "Invalid year parameter." } as const;
    }

    try {
      const chartInput = chartInputFromParams({
        name,
        birthday,
        birthTime,
        gender,
        email: searchParams.get("email") ?? undefined,
      });
      const report = buildAnnualReport(chartInput, year);
      return { report } as const;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to build report.";
      return { error: message } as const;
    }
  }, [searchParams]);

  useEffect(() => {
    if (!("error" in reportResult)) {
      document.title = `${reportResult.report.subject.name} — ${reportResult.report.reportYear} Annual Destiny Guide`;
    }
  }, [reportResult]);

  if ("error" in reportResult) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-8"
        style={{ backgroundColor: "#FDFBF7" }}
      >
        <div className="max-w-md text-center bg-white rounded-lg shadow p-8 border-t-4 border-red-800">
          <h1 className="text-xl font-bold text-gray-900 mb-3">Report Unavailable</h1>
          <p className="text-sm text-gray-600 mb-4">{reportResult.error}</p>
          <p className="text-xs text-gray-400">
            Example:{" "}
            <code className="bg-gray-100 px-1 rounded">
              /print/annual-report?name=Jane&amp;birthday=1985-03-15&amp;birth_time=10:30&amp;gender=female&amp;year=2026
            </code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="print-annual-report min-h-screen" style={{ backgroundColor: "#e5e7eb" }}>
      <AnnualReportDocument report={reportResult.report} />
    </div>
  );
};

export default PrintAnnualReport;
