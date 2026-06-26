/**
 * Print-optimized route for the 12-month monthly forecast HTML report.
 *
 * URL (query params, GHL funnel):
 * /print/monthly-forecast?name=John&birthday=1990-03-15&birth_time=10:30&gender=female&year=2026
 */

import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import MonthlyForecastDocument from "../components/monthly-report/MonthlyForecastDocument";
import {
  buildMonthlyForecastReport,
  chartInputFromParams,
} from "../utils/forecast/buildMonthlyForecastReport";

/**
 * Parse and validate gender query param.
 */
function parseGender(value: string | null): "male" | "female" | null {
  if (value === "male" || value === "female") {
    return value;
  }
  return null;
}

const PrintMonthlyForecast: React.FC = () => {
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

    if (name === null || name === "" || birthday === null || birthday === "" || birthTime === null || birthTime === "" || gender === null) {
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
      const report = buildMonthlyForecastReport(chartInput, year);
      return { report } as const;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to build report.";
      return { error: message } as const;
    }
  }, [searchParams]);

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
              /print/monthly-forecast?name=Jane&amp;birthday=1985-03-15&amp;birth_time=10:30&amp;gender=female&amp;year=2026
            </code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="print-monthly-forecast">
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .monthly-report-section { break-after: page; }
          .monthly-report-cover { break-after: page; }
          .monthly-report-overview { break-after: page; }
        }
      `}</style>
      <MonthlyForecastDocument report={reportResult.report} />
    </div>
  );
};

export default PrintMonthlyForecast;
