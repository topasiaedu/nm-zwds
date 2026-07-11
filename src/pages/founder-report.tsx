import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import ReportViewerLayout, {
  type ReportSection,
} from "../components/layout/ReportViewerLayout";
import { useAppNavItems } from "../hooks/useAppNavItems";
import ZWDSChart from "../components/ZWDSChart";
import { ZWDSCalculator } from "../utils/zwds/calculator";
import type { ChartData as ZWDSChartData, ChartInput } from "../utils/zwds/types";
import { useProfileContext } from "../context/ProfileContext";
import { useTierAccess } from "../context/TierContext";
import { useLanguage } from "../context/LanguageContext";
import { ChartSettingsProvider } from "../context/ChartSettingsContext";
import ChartSettingsModal from "../components/ChartSettingsModal";
import { WealthCode } from "../components/analysis_v2";
import { DestinyBlueprintPageHeader } from "../components/analysis_v2/shared/DestinyBlueprintPageHeader";
import {
  chartSectionContainerClass,
  chartSpinnerClass,
} from "../styles/chartUi";

type SectionChartProps = { chartData: ZWDSChartData };
type BusinessCalendarSectionProps = { chartData: ZWDSChartData; reportCreatedAt: string };

const WealthTimingCycle = React.lazy(async () => {
  const mod = await import("../components/founder-report/WealthTimingCycle");
  return { default: mod.WealthTimingCycle as React.ComponentType<SectionChartProps> };
});

const TalentStrategy = React.lazy(async () => {
  const mod = await import("../components/founder-report/TalentStrategy");
  return { default: mod.TalentStrategy as React.ComponentType<SectionChartProps> };
});

const BusinessCalendar = React.lazy(async () => {
  const mod = await import("../components/founder-report/BusinessCalendar");
  return { default: mod.BusinessCalendar as React.ComponentType<BusinessCalendarSectionProps> };
});

const IncomeBlueprint = React.lazy(async () => {
  const mod = await import("../components/founder-report/IncomeBlueprint");
  return { default: mod.IncomeBlueprint as React.ComponentType<SectionChartProps> };
});

/**
 * Glassmorphism card base style used across ZWDS pages.
 * Keep this string aligned with the shared style requirement.
 */
const GLASS_CARD_BASE_CLASS =
  "rounded-2xl shadow-2xl overflow-hidden border border-white/10 backdrop-filter backdrop-blur-2xl bg-white/10 hover:bg-white/15 dark:bg-black/10 dark:hover:bg-black/20";

/**
 * Narrow gender type used by ZWDS calculator input.
 */
type Gender = "male" | "female";

/**
 * Founder report profile/chart metadata.
 */
interface FounderReportChartMeta {
  id: string;
  name: string;
  birthDate: string;
  birthTime: string;
  createdAt: string;
  gender: Gender;
  /** Parsed birth hour (0-23) used for calculation. */
  birthHour: number;
}

type CalcStatus = "idle" | "running" | "done" | "error";

const CHART_SECTION: ReportSection = {
  id: "chart",
  label: "Chart",
  sub: "12-palace visualization",
};

const FOUNDER_ANALYSIS_SECTIONS: ReportSection[] = [
  { id: "wealth-code", label: "Wealth Code DNA", sub: "Natural earning style" },
  { id: "wealth-timing", label: "Wealth Timing Cycle", sub: "Timing cycles" },
  { id: "talent-strategy", label: "Talent Strategy", sub: "A+ talent strategy" },
  { id: "income-blueprint", label: "Income Blueprint", sub: "Scalable income" },
  { id: "business-calendar", label: "Business Calendar", sub: "Founder calendar" },
];

const SECTION_DIVIDER_CLASS = "border-t border-gray-200 dark:border-gray-700 my-12";

/**
 * Memoized chart component wrapper to reduce rerenders during scroll/section updates.
 */
type ZWDSChartProps = React.ComponentProps<typeof ZWDSChart>;
const MemoZWDSChart = React.memo<ZWDSChartProps>(ZWDSChart);

/**
 * Memoized WealthCode component wrapper to reduce rerenders.
 */
type WealthCodeProps = React.ComponentProps<typeof WealthCode>;
const MemoWealthCode = React.memo<WealthCodeProps>(WealthCode);

/**
 * A minimal error boundary so a single section failure doesn't break the whole report.
 */
class SectionErrorBoundary extends React.Component<
  { title: string; children: React.ReactNode },
  { hasError: boolean }
> {
  public constructor(props: { title: string; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  public componentDidCatch(): void {
    // Intentionally noop: we show fallback UI to keep the report usable.
  }

  public render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
          <div className="text-sm font-bold text-gray-900 dark:text-white mb-1">{this.props.title}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{"Data unavailable."}</div>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Lightweight skeleton blocks used while calculations/sections load.
 */
const SkeletonBlock: React.FC<{ className: string }> = ({ className }) => {
  return <div className={["animate-pulse rounded-xl bg-gray-200/70 dark:bg-gray-700/40", className].join(" ")} />;
};

const ChartSkeleton: React.FC = () => {
  return (
    <div className={`${GLASS_CARD_BASE_CLASS} transition-all duration-300 p-1 sm:p-2 md:p-4 lg:p-6`}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <SkeletonBlock className="h-6 w-52" />
        <SkeletonBlock className="h-8 w-28" />
      </div>
      <SkeletonBlock className="h-[360px] sm:h-[420px] w-full" />
    </div>
  );
};

const SectionSkeleton: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/40 p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="text-sm font-bold text-gray-900 dark:text-white">{title}</div>
        <SkeletonBlock className="h-6 w-16" />
      </div>
      <div className="space-y-3">
        <SkeletonBlock className="h-4 w-11/12" />
        <SkeletonBlock className="h-4 w-10/12" />
        <SkeletonBlock className="h-4 w-9/12" />
        <SkeletonBlock className="h-48 w-full" />
      </div>
    </div>
  );
};

/**
 * Parse a profile birth_time string into an hour 0-23.
 * Supports values like "14", "14:30", "2 PM", "02:00 AM".
 */
const parseBirthHour = (birthTimeRaw: string): number | null => {
  const trimmed = birthTimeRaw.trim();
  if (trimmed.length === 0) return null;

  const match = /^(\d{1,2})(?::(\d{1,2}))?\s*(AM|PM)?$/i.exec(trimmed);
  if (!match) return null;

  const hourPart = Number.parseInt(match[1], 10);
  if (!Number.isFinite(hourPart)) return null;

  const amPmRaw = match[3]?.toUpperCase();
  if (amPmRaw === "AM" || amPmRaw === "PM") {
    if (hourPart < 1 || hourPart > 12) return null;
    const hourBase = hourPart % 12;
    return amPmRaw === "PM" ? hourBase + 12 : hourBase;
  }

  if (hourPart < 0 || hourPart > 23) return null;
  return hourPart;
};

/**
 * Format an hour value as a 24h time string (HH:00).
 */
const formatHourAsTime = (hour: number): string => {
  const safeHour = Math.max(0, Math.min(23, hour));
  return `${safeHour.toString().padStart(2, "0")}:00`;
};

/**
 * Inner FounderReport page content.
 */
const FounderReportContent: React.FC = () => {
  const { t } = useLanguage();
  const { profiles, loading: profilesLoading } = useProfileContext();
  const { hasFounderReport } = useTierAccess();
  const { items: appNavItems } = useAppNavItems({ activeKey: "founder-report" });

  // Data state
  const [chartMeta, setChartMeta] = useState<FounderReportChartMeta | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Calculation state
  const [calcStatus, setCalcStatus] = useState<CalcStatus>("idle");
  const [calculatedChartData, setCalculatedChartData] = useState<ZWDSChartData | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const reportSections = useMemo((): ReportSection[] => {
    return [CHART_SECTION, ...FOUNDER_ANALYSIS_SECTIONS];
  }, []);

  const layoutProfileName = chartMeta?.name ?? "Founder Report";

  /**
   * Format date for display in UI and PDF export.
   */
  const formatDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  /**
   * Find the account owner's own profile (is_self).
   * The founder report should always use the account owner's profile,
   * matching the behavior of the /chart endpoint.
   */
  const profileToShow = useMemo(() => {
    return profiles.find((profile) => profile.is_self) ?? null;
  }, [profiles]);

  /**
   * Load profile into page-local meta format.
   * We intentionally keep the data pipeline aligned with `result.tsx`.
   */
  useEffect(() => {
    // Founder Report access required: do not load any data for non-authorized users.
    if (!hasFounderReport) {
      return;
    }

    if (profilesLoading) {
      setLoading(true);
      return;
    }

    if (!profileToShow) {
      setError("Account owner profile not found. Please ensure you have a profile marked as 'self' in your account.");
      setChartMeta(null);
      setLoading(false);
      return;
    }

    // Validate and normalize required fields.
    const nameRaw = typeof profileToShow.name === "string" ? profileToShow.name : "";
    const birthDateRaw =
      typeof profileToShow.birthday === "string" ? profileToShow.birthday : "";
    const genderRaw =
      typeof profileToShow.gender === "string" ? profileToShow.gender : "";
    const birthTimeRaw =
      typeof profileToShow.birth_time === "string" ? profileToShow.birth_time : "";
    const createdAtRaw =
      typeof profileToShow.created_at === "string" ? profileToShow.created_at : "";

    const parsedBirthHour = parseBirthHour(birthTimeRaw);
    const normalizedGender: Gender | null =
      genderRaw === "male" || genderRaw === "female" ? genderRaw : null;

    if (nameRaw.trim().length === 0) {
      setError("Profile is missing a name");
      setChartMeta(null);
      setLoading(false);
      return;
    }

    if (birthDateRaw.trim().length === 0) {
      setError("Profile is missing a birth date");
      setChartMeta(null);
      setLoading(false);
      return;
    }

    if (!normalizedGender) {
      setError("Profile has an invalid gender");
      setChartMeta(null);
      setLoading(false);
      return;
    }

    if (parsedBirthHour === null) {
      setError("Profile has an invalid birth time");
      setChartMeta(null);
      setLoading(false);
      return;
    }

    const meta: FounderReportChartMeta = {
      id: String(profileToShow.id),
      name: nameRaw,
      birthDate: birthDateRaw,
      birthTime: formatHourAsTime(parsedBirthHour),
      gender: normalizedGender,
      createdAt: createdAtRaw,
      birthHour: parsedBirthHour,
    };

    setError(null);
    setChartMeta(meta);
    setLoading(false);
  }, [hasFounderReport, profilesLoading, profileToShow]);

  /**
   * Memoize the ZWDS chart input. Calculation runs in an effect to allow skeletons to render.
   */
  const chartInput = useMemo<ChartInput | null>(() => {
    if (!chartMeta) return null;

    // Parse birth date in a timezone-safe way (aligns with `result.tsx` approach).
    const dateObj = chartMeta.birthDate.includes("T")
      ? new Date(chartMeta.birthDate)
      : new Date(`${chartMeta.birthDate}T12:00:00`);

    if (Number.isNaN(dateObj.getTime())) {
      return null;
    }

    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();

    return {
      year,
      month,
      day,
      hour: chartMeta.birthHour,
      gender: chartMeta.gender,
      name: chartMeta.name,
    };
  }, [chartMeta]);

  /**
   * Run chart calculation with a micro-yield so skeleton UI can paint first.
   */
  useEffect(() => {
    let isMounted = true;

    if (!chartMeta) {
      setCalculatedChartData(null);
      setCalcError(null);
      setCalcStatus("idle");
      return () => {
        isMounted = false;
      };
    }

    if (!chartInput) {
      setCalculatedChartData(null);
      setCalcError("Unable to parse chart input.");
      setCalcStatus("error");
      return () => {
        isMounted = false;
      };
    }

    setCalcStatus("running");
    setCalcError(null);
    setCalculatedChartData(null);

    const timer = globalThis.setTimeout(() => {
      try {
        const calculator = new ZWDSCalculator(chartInput);
        const result = calculator.calculate();
        if (!isMounted) return;
        setCalculatedChartData(result);
        setCalcStatus("done");
      } catch (e) {
        if (!isMounted) return;
        const message = e instanceof Error ? e.message : "Unknown calculation error";
        setCalculatedChartData(null);
        setCalcError(message);
        setCalcStatus("error");
      }
    }, 0);

    return () => {
      isMounted = false;
      globalThis.clearTimeout(timer);
    };
  }, [chartInput, chartMeta]);

  /**
   * Precompute responsive flags for render-time layout tweaks.
   */
  const isMobileViewport = useMemo((): boolean => {
    return typeof globalThis.innerWidth === "number" ? globalThis.innerWidth < 640 : false;
  }, []);

  /**
   * Build the analysis section body to avoid nested ternaries in JSX.
   */
  const analysisBody = useMemo<React.ReactNode>(() => {
    if (calcStatus === "running" || calcStatus === "idle") {
      return (
        <>
          <SectionSkeleton title="Wealth Code DNA" />
          <div className={SECTION_DIVIDER_CLASS} />
          <SectionSkeleton title="Wealth Timing Cycle" />
          <div className={SECTION_DIVIDER_CLASS} />
          <SectionSkeleton title="A+ Talent Strategy" />
          <div className={SECTION_DIVIDER_CLASS} />
          <SectionSkeleton title="Scalable Income Blueprint" />
          <div className={SECTION_DIVIDER_CLASS} />
          <SectionSkeleton title="Founder Business Calendar" />
        </>
      );
    }

    if (calculatedChartData) {
      return (
        <>
          <section id="wealth-code" className="scroll-mt-16">
            <SectionErrorBoundary title="Wealth Code DNA">
              <MemoWealthCode
                chartData={calculatedChartData}
                showTopDivider={false}
                header={{
                  badgeText: "01",
                  title: "Wealth Code DNA",
                  subtitle: "Decode your natural earning style and ideal business model aligned to your energy.",
                }}
              />
            </SectionErrorBoundary>
          </section>

          <div className={SECTION_DIVIDER_CLASS} />

          <section id="wealth-timing" className="scroll-mt-16">
            <SectionErrorBoundary title="Wealth Timing Cycle">
              <Suspense fallback={<SectionSkeleton title="Wealth Timing Cycle" />}>
                <WealthTimingCycle chartData={calculatedChartData} />
              </Suspense>
            </SectionErrorBoundary>
          </section>

          <div className={SECTION_DIVIDER_CLASS} />

          <section id="talent-strategy" className="scroll-mt-16">
            <SectionErrorBoundary title="A+ Talent Strategy">
              <Suspense fallback={<SectionSkeleton title="A+ Talent Strategy" />}>
                <TalentStrategy chartData={calculatedChartData} />
              </Suspense>
            </SectionErrorBoundary>
          </section>

          <div className={SECTION_DIVIDER_CLASS} />

          <section id="income-blueprint" className="scroll-mt-16">
            <SectionErrorBoundary title="Scalable Income Blueprint">
              <Suspense fallback={<SectionSkeleton title="Scalable Income Blueprint" />}>
                <IncomeBlueprint chartData={calculatedChartData} />
              </Suspense>
            </SectionErrorBoundary>
          </section>

          <div className={SECTION_DIVIDER_CLASS} />

          <section id="business-calendar" className="scroll-mt-16">
            <SectionErrorBoundary title="Founder Business Calendar">
              <Suspense fallback={<SectionSkeleton title="Founder Business Calendar" />}>
                <BusinessCalendar
                  chartData={calculatedChartData}
                  reportCreatedAt={chartMeta?.createdAt ?? ""}
                />
              </Suspense>
            </SectionErrorBoundary>
          </section>
        </>
      );
    }

    return (
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 text-center">
        <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {"Data unavailable"}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {"We couldn't load enough chart data to generate this report. Please confirm the profile details and try again."}
        </div>
      </div>
    );
  }, [calcStatus, calculatedChartData, chartMeta]);

  const layoutShell = (
    shellChildren: React.ReactNode
  ): React.ReactElement => (
    <PageTransition>
      <ReportViewerLayout
        profileName={layoutProfileName}
        appNavItems={appNavItems}
        reportSections={reportSections}
      >
        {shellChildren}
      </ReportViewerLayout>
    </PageTransition>
  );

  // If loading profiles from context OR tier data, show loading spinner first
  if (profilesLoading || loading) {
    return layoutShell(
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className={chartSpinnerClass} />
        </div>
      </div>
    );
  }

  /**
   * Founder Report access required (checked AFTER loading completes).
   * Non-authorized users are silently redirected to dashboard (per requirements).
   */
  if (!hasFounderReport) {
    return <Navigate to="/dashboard" replace />;
  }

  return layoutShell(
    <>
      {error ? (
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">
            {t("general.error") || "Error"}
          </h2>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <Link
            to="/dashboard"
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg inline-block"
          >
            {t("general.back") || "Back"}
          </Link>
        </div>
      ) : (
        chartMeta && (
          <>
            <section id="chart" className={`${chartSectionContainerClass} scroll-mt-16`}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-6 w-full">
                <div className="lg:col-span-2">
                  {calcStatus === "running" || calcStatus === "idle" ? (
                    <ChartSkeleton />
                  ) : (
                    <div className={`${GLASS_CARD_BASE_CLASS} transition-all duration-300 p-1 sm:p-2 md:p-4 lg:p-6`}>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 md:mb-6 dark:text-white">
                        {t("result.chartVisualization") || "Chart Visualization"}
                      </h2>

                      {calculatedChartData ? (
                        <div
                          className="flex-grow overflow-auto p-0 w-full"
                          style={{
                            minHeight: isMobileViewport ? "calc(100vh - 150px)" : undefined,
                          }}
                        >
                          <MemoZWDSChart chartData={calculatedChartData} />
                        </div>
                      ) : (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 text-center">
                          <div className="text-lg font-bold text-amber-900 dark:text-amber-200 mb-2">
                            {"We couldn't generate this chart yet"}
                          </div>
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            {calcError ?? "Chart data unavailable. Please review the profile inputs and try again."}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="lg:col-span-1">
                  <div
                    className={`${GLASS_CARD_BASE_CLASS} transition-all duration-300 p-6 mb-6`}
                  >
                    <h2 className="text-xl font-bold mb-4 dark:text-white">
                      {t("result.profileDetails") || "Profile Details"}
                    </h2>

                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-gray-500 dark:text-gray-400">
                          {t("myChart.fields.name") || "Name"}:
                        </div>
                        <div className="col-span-2 font-medium dark:text-white">
                          {chartMeta.name}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-gray-500 dark:text-gray-400">
                          {t("myChart.fields.birthDate") || "Birth Date"}:
                        </div>
                        <div className="col-span-2 font-medium dark:text-white">
                          {formatDate(chartMeta.birthDate)}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-gray-500 dark:text-gray-400">
                          {t("myChart.fields.gender") || "Gender"}:
                        </div>
                        <div className="col-span-2 font-medium dark:text-white">
                          {chartMeta.gender === "male" ? (
                            <span className="flex items-center">
                              <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                              {t("myChart.fields.male") || "Male"}
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <span className="w-3 h-3 rounded-full bg-pink-500 mr-2"></span>
                              {t("myChart.fields.female") || "Female"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="mt-8">
              <DestinyBlueprintPageHeader
                sectionTitle="FOUNDER REPORT ANALYSIS"
                subtitle="A personalized breakdown of your business DNA, timing cycles, and strategic action plans."
                className="mb-8"
              />

              <div className="space-y-8">
                {analysisBody}
              </div>
            </div>
          </>
        )
      )}

      <ChartSettingsModal pageType="result" />
    </>
  );
};

/**
 * FounderReport component wrapper with ChartSettingsProvider.
 * This matches the `result.tsx` wrapper pattern.
 */
const FounderReport: React.FC = () => {
  return (
    <ChartSettingsProvider defaultPageType="result">
      <FounderReportContent />
    </ChartSettingsProvider>
  );
};

export default FounderReport;
