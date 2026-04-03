import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useTierAccess } from "../context/TierContext";
import type { Profile } from "../context/ProfileContext";
import { supabase } from "../utils/supabase-client";
import ZWDSChart from "../components/ZWDSChart";
import { ZWDSCalculator } from "../utils/zwds/calculator";
import type { ChartInput } from "../utils/zwds/types";
import type { PdfChartData } from "../components/PdfDocument";
import { ChartSettingsProvider } from "../context/ChartSettingsContext";
import {
  Overview,
  Health,
  AreasOfLife,
  WealthCode,
  FourKeyPalace,
} from "../components/analysis_v2";
import { NoblemanSection } from "../components/nobleman";
import type { LifeAspect } from "../types/destiny-navigator";

type ChartData = PdfChartData;

/**
 * Format stored birth_time (hour index string) into a display range (mirrors Result page).
 */
function formatProfileBirthTime(birthTimeString: string): string {
  const hour = parseInt(birthTimeString, 10);
  if (Number.isNaN(hour)) {
    return "Unknown";
  }
  const timeRanges: { start: number; end: number; range: string }[] = [
    { start: 23, end: 1, range: "23:00-00:59" },
    { start: 1, end: 3, range: "01:00-02:59" },
    { start: 3, end: 5, range: "03:00-04:59" },
    { start: 5, end: 7, range: "05:00-06:59" },
    { start: 7, end: 9, range: "07:00-08:59" },
    { start: 9, end: 11, range: "09:00-10:59" },
    { start: 11, end: 13, range: "11:00-12:59" },
    { start: 13, end: 15, range: "13:00-14:59" },
    { start: 15, end: 17, range: "15:00-16:59" },
    { start: 17, end: 19, range: "17:00-18:59" },
    { start: 19, end: 21, range: "19:00-20:59" },
    { start: 21, end: 23, range: "21:00-22:59" },
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
 * Load a single profile row using PostgREST + user JWT (session or `pdfToken` query).
 */
async function fetchProfileForPrint(profileId: string, bearerToken: string): Promise<Profile | null> {
  const base = process.env.REACT_APP_SUPABASE_URL ?? "";
  const key = process.env.REACT_APP_SUPABASE_ANON_KEY ?? "";
  if (base === "" || key === "") {
    return null;
  }
  const url = `${base}/rest/v1/profiles?id=eq.${encodeURIComponent(profileId)}&select=*`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      apikey: key,
      Authorization: `Bearer ${bearerToken}`,
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    return null;
  }
  const rows = (await response.json()) as Profile[];
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Inner print layout: natal (DNA) chart + analysis blocks, no nav or export UI.
 */
const PrintResultContent: React.FC = () => {
  const { t, language } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { hasFullAnalysis } = useTierAccess();

  const pdfQueryToken = searchParams.get("pdfToken");
  const includeAnalysisBlocks =
    hasFullAnalysis ||
    (pdfQueryToken !== null && pdfQueryToken !== "");

  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Sync Supabase session when `pdfToken` is present so tier/features match the JWT user.
   */
  useEffect(() => {
    const q = searchParams.get("pdfToken");
    if (q === null || q === "") {
      return;
    }
    void (async () => {
      const { error } = await supabase.auth.setSession({
        access_token: q,
        refresh_token: q,
      });
      if (error !== null && process.env.NODE_ENV !== "production") {
        console.warn("PrintResult: setSession with pdfToken did not fully apply:", error.message);
      }
    })();
  }, [searchParams]);

  const formatDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "zh" ? "zh-TW" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [language]);

  useEffect(() => {
    if (id === undefined || id === "") {
      setError("Missing profile id.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    const run = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      const fromQuery = searchParams.get("pdfToken");
      const sessionResult = await supabase.auth.getSession();
      const sessionToken = sessionResult.data.session?.access_token ?? null;
      const bearer =
        fromQuery !== null && fromQuery !== "" ? fromQuery : sessionToken;

      if (bearer === null) {
        if (!cancelled) {
          setError(
            "Sign in or open this page with a valid pdfToken query parameter for server-side PDF export."
          );
          setLoading(false);
        }
        return;
      }

      const profile = await fetchProfileForPrint(id, bearer);
      if (cancelled) {
        return;
      }
      if (profile === null) {
        setError("Profile not found or access denied.");
        setLoading(false);
        return;
      }

      const nextChart: ChartData = {
        id: profile.id,
        name: profile.name,
        birthDate: profile.birthday,
        birthTime: formatProfileBirthTime(profile.birth_time),
        gender: profile.gender,
        createdAt: profile.created_at,
      };
      setChartData(nextChart);
      setLoading(false);
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [id, searchParams]);

  const calculatedChartData = useMemo(() => {
    if (chartData === null) {
      return null;
    }
    try {
      const timeMatch = chartData.birthTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      let hour = timeMatch ? parseInt(timeMatch[1], 10) : 12;
      if (
        timeMatch &&
        timeMatch[3] &&
        timeMatch[3].toUpperCase() === "PM" &&
        hour < 12
      ) {
        hour += 12;
      }
      if (
        timeMatch &&
        timeMatch[3] &&
        timeMatch[3].toUpperCase() === "AM" &&
        hour === 12
      ) {
        hour = 0;
      }

      let dateObj: Date;
      if (chartData.birthDate.includes("T")) {
        dateObj = new Date(chartData.birthDate);
      } else {
        dateObj = new Date(`${chartData.birthDate}T12:00:00`);
      }
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();

      const chartInput: ChartInput = {
        year,
        month,
        day,
        hour,
        gender: chartData.gender as "male" | "female",
        name: chartData.name,
      };
      const calculator = new ZWDSCalculator(chartInput);
      return calculator.calculate();
    } catch (e) {
      console.error("PrintResult: chart calculation failed", e);
      return null;
    }
  }, [chartData]);

  /**
   * When profile loaded but natal calculation fails, avoid a totally empty print page for Puppeteer.
   */
  useEffect(() => {
    if (loading || error !== null || chartData === null) {
      return;
    }
    if (calculatedChartData === null) {
      setError("Chart could not be calculated for this profile.");
    }
  }, [loading, error, chartData, calculatedChartData]);

  const getPalaceOverride = useCallback((_aspect: LifeAspect): number | null => null, []);

  const resolvePalaceName = useCallback((_palaceNumber: number): string => "", []);

  const zhPrint = language === "zh";
  const genderLabel =
    chartData !== null
      ? chartData.gender === "male"
        ? zhPrint
          ? "男"
          : "Male"
        : zhPrint
          ? "女"
          : "Female"
      : "";

  return (
    <div className="print-root bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 min-h-screen px-3 py-6 sm:px-4">
      <style>
        {`
          @media print {
            .print-root {
              background: #ffffff !important;
              color: #111827 !important;
              min-height: 0 !important;
            }
            .print-cover-page {
              page-break-after: always;
              break-after: page;
            }
            .print-avoid-break {
              break-inside: avoid;
              page-break-inside: avoid;
            }
            [data-pdf-page-break-before] {
              break-before: page;
              page-break-before: always;
            }
          }
        `}
      </style>
      {loading ? (
        <div className="flex justify-center py-24" data-pdf-loading="true">
          <div className="text-center">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {t("general.loadingText") || "Loading…"}
            </p>
          </div>
        </div>
      ) : null}

      {!loading && error !== null ? (
        <div
          className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/40"
          data-pdf-error="true"
        >
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      ) : null}

      {!loading && error === null && chartData !== null && calculatedChartData !== null ? (
        <div className="space-y-8" data-pdf-render-ready="true">
          {/* Cover page: dedicated sheet for server Puppeteer PDF (matches jsPDF cover intent). */}
          <section
            className="print-cover-page mx-auto max-w-lg rounded-2xl border border-violet-200 bg-gradient-to-b from-white to-slate-50 px-8 py-12 text-center shadow-sm"
            aria-label={zhPrint ? "报告封面" : "Report cover"}
          >
            <h1 className="text-2xl font-bold text-violet-700 sm:text-3xl">
              {zhPrint ? "紫微斗数图表分析" : "Zi Wei Dou Shu Chart Analysis"}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {zhPrint ? "专业占星报告" : "Professional Astrological Report"}
            </p>
            <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 px-6 py-8 text-left">
              <p className="text-center text-sm font-semibold text-slate-700">
                {zhPrint ? "个人信息" : "Profile Information"}
              </p>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">{zhPrint ? "姓名" : "Name"}</dt>
                  <dd className="font-medium text-slate-900">{chartData.name}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">{zhPrint ? "性别" : "Gender"}</dt>
                  <dd className="font-medium text-slate-900">{genderLabel}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">{zhPrint ? "出生日期" : "Birth Date"}</dt>
                  <dd className="font-medium text-slate-900">{formatDate(chartData.birthDate)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">{zhPrint ? "出生时间" : "Birth Time"}</dt>
                  <dd className="font-medium text-slate-900">{chartData.birthTime}</dd>
                </div>
              </dl>
            </div>
            <p className="mt-8 text-xs text-slate-400">
              {zhPrint ? "报告生成日期" : "Report Generated"}:{" "}
              {new Date().toLocaleDateString(zhPrint ? "zh-TW" : "en-US")}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              {zhPrint
                ? "此报告为机密文件，仅供个人使用"
                : "This report is confidential and intended for personal use only."}
            </p>
          </section>

          <header className="text-center print-avoid-break">
            <h1 className="text-2xl font-bold sm:text-3xl">
              {chartData.name}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {formatDate(chartData.birthDate)} · {chartData.birthTime}
            </p>
          </header>

          <section className="print-avoid-break rounded-xl border border-gray-200 p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900/50 sm:p-4">
            <h2 className="mb-3 text-lg font-semibold">
              {t("result.chartVisualization") || "Chart"}
            </h2>
            <div className="overflow-auto">
              <ZWDSChart
                chartData={calculatedChartData}
                isPdfExport={true}
                disableInteraction
                selectedDaXianControlled={null}
                selectedPalaceNameControlled={null}
                showMonthsControlled={null}
              />
            </div>
          </section>

          {includeAnalysisBlocks ? (
            <section className="space-y-8">
              <div
                className="text-center print-avoid-break"
                data-pdf-page-break-before=""
              >
                <h2 className="text-2xl font-bold">
                  {t("analysis.title") || "PERSONALIZED LIFE REPORT"}
                </h2>
                <p className="mt-1 text-sm italic text-gray-600 dark:text-gray-400">
                  {t("analysis.subtitle") ||
                    "A custom breakdown of your chart's strengths, patterns, and strategic focus areas."}
                </p>
              </div>

              <Overview
                chartData={calculatedChartData}
                palaceOverride={getPalaceOverride("life") ?? undefined}
                forPdfCapture={true}
              />

              <WealthCode
                chartData={calculatedChartData}
                showTopDivider={false}
                header={{
                  badgeText: "02",
                  title: "WEALTH CODE ANALYSIS",
                  subtitle:
                    "Decode your natural earning style and ideal business model aligned to your energy.",
                }}
                palaceOverride={getPalaceOverride("wealth") ?? undefined}
                forPdfCapture={true}
              />

              <NoblemanSection chartData={calculatedChartData} forPdfCapture={true} />

              <Health
                chartData={calculatedChartData}
                palaceOverride={getPalaceOverride("health") ?? undefined}
                forPdfCapture={true}
              />

              <FourKeyPalace
                chartData={calculatedChartData}
                resolvePalaceName={resolvePalaceName}
                forPdfCapture={true}
              />

              <AreasOfLife
                chartData={calculatedChartData}
                palaceOverride={getPalaceOverride("life") ?? undefined}
                forPdfCapture={true}
              />
            </section>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

/**
 * Print-only route for Puppeteer PDF capture (`/print/result/:id?pdfToken=…`).
 */
const PrintResult: React.FC = () => (
  <ChartSettingsProvider defaultPageType="result">
    <PrintResultContent />
  </ChartSettingsProvider>
);

export default PrintResult;
