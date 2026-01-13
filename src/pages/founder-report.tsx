import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import ZWDSChart from "../components/ZWDSChart";
import { ZWDSCalculator } from "../utils/zwds/calculator";
import type { ChartData as ZWDSChartData, ChartInput } from "../utils/zwds/types";
import { useProfileContext } from "../context/ProfileContext";
import { useTierAccess } from "../context/TierContext";
import { useLanguage } from "../context/LanguageContext";
import { ChartSettingsProvider } from "../context/ChartSettingsContext";
import ChartSettingsModal from "../components/ChartSettingsModal";
import { WealthCode } from "../components/analysis_v2";

type SectionChartProps = { chartData: ZWDSChartData };

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
  return { default: mod.BusinessCalendar as React.ComponentType<SectionChartProps> };
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
 * PDF export modal local state.
 */
// NOTE: Founder report currently uses browser print (`window.print()`), not the jsPDF modal flow from `result.tsx`.

/**
 * Narrow gender type used by ZWDS calculator input.
 */
type Gender = "male" | "female";

/**
 * Founder report profile/chart metadata.
 *
 * Extends `PdfChartData` so it can be used directly for PDF export.
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

type SectionId =
  | "wealth-code"
  | "wealth-timing"
  | "talent-strategy"
  | "business-calendar"
  | "income-blueprint";

type SectionNavItem = {
  id: SectionId;
  label: string;
  shortLabel: string;
};

const SECTION_NAV: ReadonlyArray<SectionNavItem> = [
  { id: "wealth-code", label: "01. Wealth Code DNA", shortLabel: "Wealth Code" },
  { id: "wealth-timing", label: "02. Wealth Timing Cycle", shortLabel: "Timing Cycle" },
  { id: "talent-strategy", label: "03. Talent Strategy", shortLabel: "Talent" },
  { id: "business-calendar", label: "04. Business Calendar", shortLabel: "Calendar" },
  { id: "income-blueprint", label: "05. Income Blueprint", shortLabel: "Income" },
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
 * Mirrors `src/pages/result.tsx` structure:
 * - Header
 * - Top grid: chart (2/3) + profile sidebar (1/3)
 * - Bottom section: analysis components shell (stack)
 */
const FounderReportContent: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const { profiles, loading: profilesLoading } = useProfileContext();
  const { isAdmin } = useTierAccess();

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

  // Scrollspy / section visibility
  const [activeSection, setActiveSection] = useState<SectionId>("wealth-code");
  const activeSectionRef = useRef<SectionId>("wealth-code");
  const sectionVisibilityRef = useRef<Record<SectionId, boolean>>({
    "wealth-code": false,
    "wealth-timing": false,
    "talent-strategy": false,
    "business-calendar": false,
    "income-blueprint": false,
  });
  const [visibleSections, setVisibleSections] = useState<Record<SectionId, boolean>>({
    "wealth-code": true,
    "wealth-timing": true,
    "talent-strategy": true,
    "business-calendar": true,
    "income-blueprint": true,
  });

  /**
   * Keep active section in a ref to avoid stale-closure issues in IntersectionObserver callback.
   */
  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

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
   * Find the profile for the given route ID.
   */
  const profileToShow = useMemo(() => {
    if (!id) return null;
    return profiles.find((profile) => String(profile.id) === String(id)) ?? null;
  }, [profiles, id]);

  /**
   * Load profile into page-local meta format.
   * We intentionally keep the data pipeline aligned with `result.tsx`.
   */
  useEffect(() => {
    // Admin-only page: do not load any data for non-admin users.
    if (!isAdmin) {
      return;
    }

    if (profilesLoading) {
      setLoading(true);
      return;
    }

    if (!id) {
      setError("Missing profile ID");
      setChartMeta(null);
      setLoading(false);
      return;
    }

    if (!profileToShow) {
      setError(`Profile with ID ${id} not found`);
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
  }, [isAdmin, profilesLoading, id, profileToShow]);

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
   * Print/export the full report using browser print.
   */
  const handlePrintExport = useCallback(() => {
    if (!isAdmin) return;
    globalThis.print();
  }, [isAdmin]);

  /**
   * Precompute responsive flags for render-time layout tweaks.
   * (Use `globalThis` to satisfy lint rules and keep DOM assumptions explicit.)
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
          <section
            id="wealth-code"
            className={[
              "scroll-mt-24 transition-all duration-700 ease-out",
              visibleSections["wealth-code"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
              "print:opacity-100 print:translate-y-0",
            ].join(" ")}
          >
            <SectionErrorBoundary title="Wealth Code DNA">
              <MemoWealthCode
                chartData={calculatedChartData}
                showTopDivider={false}
                header={{
                  title: "WEALTH CODE DNA",
                  subtitle: "Your Natural Business Model & Income Strategy",
                }}
              />
            </SectionErrorBoundary>
          </section>

          <div className={SECTION_DIVIDER_CLASS} />

          <section
            id="wealth-timing"
            className={[
              "scroll-mt-24 transition-all duration-700 ease-out",
              visibleSections["wealth-timing"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
              "print:opacity-100 print:translate-y-0",
            ].join(" ")}
          >
            <SectionErrorBoundary title="Wealth Timing Cycle">
              <Suspense fallback={<SectionSkeleton title="Wealth Timing Cycle" />}>
                <WealthTimingCycle chartData={calculatedChartData} />
              </Suspense>
            </SectionErrorBoundary>
          </section>

          <div className={SECTION_DIVIDER_CLASS} />

          <section
            id="talent-strategy"
            className={[
              "scroll-mt-24 transition-all duration-700 ease-out",
              visibleSections["talent-strategy"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
              "print:opacity-100 print:translate-y-0",
            ].join(" ")}
          >
            <SectionErrorBoundary title="A+ Talent Strategy">
              <Suspense fallback={<SectionSkeleton title="A+ Talent Strategy" />}>
                <TalentStrategy chartData={calculatedChartData} />
              </Suspense>
            </SectionErrorBoundary>
          </section>

          <div className={SECTION_DIVIDER_CLASS} />

          <section
            id="income-blueprint"
            className={[
              "scroll-mt-24 transition-all duration-700 ease-out",
              visibleSections["income-blueprint"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
              "print:opacity-100 print:translate-y-0",
            ].join(" ")}
          >
            <SectionErrorBoundary title="Scalable Income Blueprint">
              <Suspense fallback={<SectionSkeleton title="Scalable Income Blueprint" />}>
                <IncomeBlueprint chartData={calculatedChartData} />
              </Suspense>
            </SectionErrorBoundary>
          </section>

          <div className={SECTION_DIVIDER_CLASS} />

          <section
            id="business-calendar"
            className={[
              "scroll-mt-24 transition-all duration-700 ease-out",
              visibleSections["business-calendar"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
              "print:opacity-100 print:translate-y-0",
            ].join(" ")}
          >
            <SectionErrorBoundary title="Founder Business Calendar">
              <Suspense fallback={<SectionSkeleton title="Founder Business Calendar" />}>
                <BusinessCalendar chartData={calculatedChartData} />
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
  }, [calcStatus, calculatedChartData, visibleSections]);

  /**
   * Smooth scroll to a report section.
   */
  const scrollToSection = useCallback((sectionId: SectionId) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  /**
   * Observe which section is currently in view for the desktop nav and fade-in animations.
   */
  useEffect(() => {
    const ids = SECTION_NAV.map((s) => s.id);
    const elements = ids
      .map((id2) => document.getElementById(id2))
      .filter((el): el is HTMLElement => el instanceof HTMLElement);

    if (elements.length === 0) return () => {};

    const observer = new IntersectionObserver(
      (entries) => {
        let didChange = false;

        for (const entry of entries) {
          const target = entry.target;
          if (!(target instanceof HTMLElement)) continue;
          const id2 = target.id as SectionId;
          const isVisible = entry.isIntersecting;

          if (sectionVisibilityRef.current[id2] !== isVisible) {
            sectionVisibilityRef.current[id2] = isVisible;
            didChange = true;
          }
        }

        if (didChange) {
          const nextVisible = { ...sectionVisibilityRef.current };
          setVisibleSections(nextVisible);

          // Pick the first visible section in document order as the active one.
          const nextActive = SECTION_NAV.find((s) => nextVisible[s.id])?.id ?? activeSectionRef.current;
          setActiveSection(nextActive);
        }
      },
      {
        root: null,
        // Top-biased root margin so a section becomes "active" slightly before center.
        rootMargin: "-30% 0px -60% 0px",
        threshold: 0.01,
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If loading profiles from context OR tier data, show loading spinner first
  if (profilesLoading || loading) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        </div>
      </PageTransition>
    );
  }

  /**
   * Admin-only access control (checked AFTER loading completes).
   * Non-admins are silently redirected to dashboard (per requirements).
   */
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <PageTransition>
      <div className="relative container mx-auto px-0 xs:px-1 sm:px-2 md:px-4 py-2 sm:py-4 md:py-8 scroll-smooth print:bg-white">


        {/* Header */}
        <div className="relative mb-8">
          <div className="flex items-center mb-4">
            <Link
              to="/dashboard"
              className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4 print:hidden"
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              {t("general.back") || "Back"}
            </Link>

            <div className="flex items-center flex-wrap gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold dark:text-white flex items-center">
                <svg
                  className="w-7 h-7 mr-2 text-amber-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {"Founder Timing Decision System Report"}
              </h1>

              {/* Premium badge/indicator */}
              <div className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                {"Founder Edition"}
              </div>
            </div>
          </div>

          {!error && chartMeta && (
            <p className="text-gray-600 dark:text-gray-400">
              {`Strategic Business Intelligence for ${chartMeta.name}`}
            </p>
          )}
        </div>

        {error ? (
          // Error state
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
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
              {/* Top section: chart + profile sidebar (matches `result.tsx` grid structure) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-6">
                {/* Chart visualization */}
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
                          className="flex-grow overflow-auto p-0"
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

                {/* Profile information */}
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

                    {/* PDF Export Button */}
                    <div className="mt-6 print:hidden">
                      <button
                        type="button"
                        onClick={handlePrintExport}
                        className="w-full px-4 py-2 text-white font-medium rounded-lg transition-all
                          bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700
                          focus:ring-4 focus:ring-indigo-300 focus:outline-none
                          flex items-center justify-center"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z"
                          />
                        </svg>
                        {"Print / Export"}
                      </button>
                    </div>

                    {/* Back to dashboard link (explicitly required in sidebar) */}
                    <div className="mt-3">
                      <Link
                        to="/dashboard"
                        className="w-full px-4 py-2 text-white font-medium rounded-lg transition-all 
                              bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                              focus:ring-4 focus:ring-blue-300 focus:outline-none block text-center
                              flex items-center justify-center"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                          />
                        </svg>
                        {t("dashboard.title") || "Back to Dashboard"}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom section: Analysis shell ONLY (no analysis components yet) */}
              <div className="mt-8">
                <div className="flex flex-col justify-center items-center">
                  <h2 className="text-2xl sm:text-4xl mb-2 font-bold dark:text-white flex items-center text-center pt-4">
                    {"Analysis"}
                  </h2>
                  <p className="text-sm sm:text-lg mb-6 dark:text-white text-center italic">
                    {"Founder-focused strategic insights will appear here."}
                  </p>
                </div>

                <div className="space-y-8">
                  {/* 01. Wealth Code DNA - first analysis section (below chart) */}
                  {analysisBody}

                  {/* Analysis components will be added here in a future iteration. */}
                </div>
              </div>
            </>
          )
        )}

        {/* Chart Settings Modal (kept for parity with `result.tsx`) */}
        <ChartSettingsModal pageType="result" />
      </div>
    </PageTransition>
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

