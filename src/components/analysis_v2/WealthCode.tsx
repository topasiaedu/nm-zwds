/**
 * Wealth Code Analysis Component
 * Displays comprehensive wealth-building profile based on stars in Wealth Palace
 */

import React from "react";
import {
  AlertTriangle,
  BarChart3,
  Check,
  Coins,
  Handshake,
  Minus,
  Plus,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { BrandGradientText } from "../BrandGradientText";
import { ChartData } from "../../utils/zwds/types";
import {
  analyzeWealthCode,
  WealthCodeAnalysisResult,
} from "../../utils/zwds/analysis/wealthCodeAnalysis";
import {
  WealthCodeKey,
  WealthCodeScore,
  CareerRecommendation,
} from "../../utils/zwds/analysis_constants/wealth_code_mapping";
import { pdfCaptureNumericBadgeStyle } from "./shared/pdfCaptureNumericBadgeStyle";

/**
 * Props for the WealthCode component
 */
interface WealthCodeProps {
  chartData: ChartData;
  /**
   * Optional header overrides.
   *
   * - If omitted, the component renders the legacy Wealth Code title/subtitle.
   * - If provided, the component renders the given title/subtitle and can show a badge pill.
   */
  header?: WealthCodeHeaderConfig;
  /**
   * Whether to show the internal top divider line.
   * Defaults to `true` to preserve legacy appearance (e.g. on `result.tsx`).
   */
  showTopDivider?: boolean;
  /**
   * Optional physical palace number override (1–12).
   * When provided, analyses this palace instead of the natal Wealth Palace (财帛).
   * Used for timeframe-based analysis (Liu Nian, Liu Month, Da Yun).
   */
  palaceOverride?: number;
  /** Static mode for PDF capture. */
  forPdfCapture?: boolean;
}

/**
 * Header configuration for the Wealth Code section.
 */
interface WealthCodeHeaderConfig {
  /** Optional badge text shown before the title (e.g. "01"). */
  badgeText?: string;
  /** Section title text. */
  title: string;
  /** Section subtitle text. */
  subtitle: string;
}

/**
 * Default header copy to preserve legacy UI.
 */
const DEFAULT_HEADER: WealthCodeHeaderConfig = {
  title: "WEALTH CODE ANALYSIS",
  subtitle: "Your Natural Wealth-Building Strengths",
};

/**
 * Color configuration for each wealth code type
 */
const WEALTH_CODE_COLORS: Record<
  WealthCodeKey,
  { primary: string; secondary: string; light: string; gradient: string; heroGradient: string }
> = {
  investmentBrain: {
    primary: "#DC2626",
    secondary: "#FB923C",
    light: "#FEE2E2",
    gradient: "from-red-500 to-orange-500",
    heroGradient: "from-red-600 via-red-500 to-orange-500",
  },
  brandingMagnet: {
    primary: "#9333EA",
    secondary: "#EC4899",
    light: "#F3E8FF",
    gradient: "from-purple-500 to-pink-500",
    heroGradient: "from-purple-600 via-purple-500 to-pink-500",
  },
  strategyPlanner: {
    primary: "#D97706",
    secondary: "#EAB308",
    light: "#FEF3C7",
    gradient: "from-amber-500 to-yellow-500",
    heroGradient: "from-amber-600 via-amber-500 to-yellow-500",
  },
  collaborator: {
    primary: "#059669",
    secondary: "#10B981",
    light: "#D1FAE5",
    gradient: "from-green-500 to-emerald-500",
    heroGradient: "from-green-600 via-green-500 to-emerald-500",
  },
};

/**
 * Icons for wealth codes
 */
const WEALTH_CODE_ICONS: Record<WealthCodeKey, LucideIcon> = {
  investmentBrain: Coins,
  brandingMagnet: Sparkles,
  strategyPlanner: Target,
  collaborator: Handshake,
};

type WealthCodeHeroProps = {
  badgeText: string;
  title: string;
  subtitle: string;
  forPdfCapture?: boolean;
};

/**
 * Section hero — purple/indigo in light mode; warm orange in dark (matches sections 01, 03–06).
 */
const WealthCodeHero: React.FC<WealthCodeHeroProps> = ({
  badgeText,
  title,
  subtitle,
  forPdfCapture,
}) => {
  return (
    <div
      data-pdf-break-anchor="wealth-header"
      {...(forPdfCapture ? { "data-pdf-page-break-before": "" } : {})}
      className="relative mb-10 overflow-hidden rounded-3xl border-2 border-brand-purple/25 shadow-2xl dark:border-accent-gold/70 dark:shadow-[0_12px_48px_rgba(251,146,60,0.28)] dark:ring-2 dark:ring-accent-gold/40"
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-brand-purpleDeep via-brand-purple to-indigo-700 dark:from-orange-600 dark:via-amber-600 dark:to-orange-700"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-[0.18] dark:opacity-[0.28]"
        style={{
          backgroundImage: `radial-gradient(circle at 18% 40%, rgba(255,255,255,0.35) 1px, transparent 1px),
            radial-gradient(circle at 82% 70%, rgba(255,255,255,0.2) 1px, transparent 1px)`,
          backgroundSize: "42px 42px",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -right-8 -top-10 h-48 w-48 rounded-full bg-accent-gold/20 blur-3xl dark:bg-amber-300/30"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-12 -left-6 h-40 w-40 rounded-full bg-indigo-400/25 blur-3xl dark:bg-orange-400/20"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-12">
        <div className="min-w-0 flex-1">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
            <TrendingUp className="h-3.5 w-3.5 text-accent-gold" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/90">
              Wealth profile
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span
              style={
                forPdfCapture
                  ? pdfCaptureNumericBadgeStyle("#4A3F6B")
                  : {
                      background: "rgba(255, 255, 255, 0.95)",
                      color: "#4A3F6B",
                      height: "40px",
                      minWidth: "52px",
                      padding: "0 14px",
                      borderRadius: "12px",
                      fontSize: "20px",
                      fontWeight: "800",
                      lineHeight: 1,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }
              }
            >
              {badgeText}
            </span>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl md:text-4xl">
              {title}
            </h2>
          </div>
          <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-white/90 sm:text-lg">
            {subtitle}
          </p>
        </div>
        <div
          className={`flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-lg sm:h-24 sm:w-24 ${
            forPdfCapture ? "" : "backdrop-blur-md"
          }`}
        >
          <Coins className="h-10 w-10 text-white sm:h-12 sm:w-12" aria-hidden="true" />
        </div>
      </div>
      <div
        className="relative z-10 h-1.5 bg-gradient-to-r from-accent-goldDark via-accent-coralDark to-indigo-400 dark:from-amber-200 dark:via-white dark:to-amber-100"
        aria-hidden="true"
      />
    </div>
  );
};

/**
 * Premium hero card with dominant archetype
 */
const PremiumHeroCard: React.FC<{ profile: WealthCodeAnalysisResult; forPdfCapture?: boolean }> = ({
  profile,
  forPdfCapture,
}) => {
  if (!profile.hasRecognizedStars) return null;

  const dominantCode = profile.codes[0];
  const colorConfig = WEALTH_CODE_COLORS[dominantCode.key];

  return (
    <div className="relative overflow-hidden rounded-2xl mb-6 shadow-xl">
      {/* Gradient Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${colorConfig.primary} 0%, ${colorConfig.secondary} 50%, ${colorConfig.secondary}dd 100%)`,
          opacity: 0.9,
        }}
      />

      {/* Pattern Overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,.15) 1px, transparent 1px),
             radial-gradient(circle at 80% 80%, rgba(255,255,255,.15) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Content */}
      <div className="relative px-6 sm:px-8 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-start justify-between gap-6 sm:gap-4">
          <div className="flex-1 w-full">
            <div
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 border border-white/20 ${
                forPdfCapture ? "bg-black/40" : "bg-black/20 backdrop-blur-sm"
              }`}
            >
              <div className={`w-2 h-2 rounded-full bg-white ${forPdfCapture ? "" : "animate-pulse"}`} />
              <span className="text-white text-xs font-bold uppercase tracking-wider drop-shadow-lg">
                Dominant Wealth Code
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight drop-shadow-lg">
              {profile.dominantArchetype}
            </h1>
            <p className="text-white text-sm leading-relaxed max-w-xl drop-shadow-md">
              {profile.summaryText}
            </p>
          </div>

          {/* Score Badge */}
          <div className="flex-shrink-0">
            <div
              className={`rounded-2xl p-6 border border-white/30 shadow-2xl ${
                forPdfCapture ? "bg-black/45" : "bg-black/20 backdrop-blur-md"
              }`}
            >
              <div className="text-center">
                <div
                  className={
                    forPdfCapture
                      ? "w-20 h-20 mx-auto rounded-xl bg-white shadow-lg mb-3"
                      : "w-20 h-20 mx-auto rounded-xl bg-white shadow-lg flex items-center justify-center mb-3"
                  }
                  style={
                    forPdfCapture
                      ? {
                          display: "block",
                          textAlign: "center",
                          lineHeight: "80px",
                          overflow: "hidden",
                        }
                      : undefined
                  }
                >
                  <span
                    className="text-3xl font-bold"
                    style={
                      forPdfCapture
                        ? {
                            color: colorConfig.primary,
                            display: "inline-block",
                            lineHeight: "80px",
                            verticalAlign: "middle",
                          }
                        : { color: colorConfig.primary }
                    }
                  >
                    {dominantCode.score.toFixed(1)}
                  </span>
                </div>
                <div className="text-white text-xs font-semibold drop-shadow">
                  Primary Score
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Scoreboard grid for wealth codes — layout refresh; archetype colors unchanged.
 */
const ModernBarChart: React.FC<{
  codes: WealthCodeScore[];
  dominantArchetype?: string;
  forPdfCapture?: boolean;
}> = ({ codes, dominantArchetype, forPdfCapture }) => {
  const maxScore = 10;
  const hoverClass = forPdfCapture ? "" : "transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5";

  const getScoreDescriptor = (scorePercent: number): string => {
    if (scorePercent >= 80) return "Exceptional";
    if (scorePercent >= 65) return "Strong";
    if (scorePercent >= 50) return "Moderate";
    return "Developing";
  };

  return (
    <section className="mb-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-md">
            <BarChart3 className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-300">
              Score breakdown
            </p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Wealth Code Analysis
            </h3>
            {dominantArchetype ? (
              <BrandGradientText as="p" className="mt-1 text-lg font-bold sm:text-xl">
                {dominantArchetype}
              </BrandGradientText>
            ) : null}
          </div>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
          <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
          Scale 0–10
        </div>
      </div>

      <div
        className={
          forPdfCapture ? "grid grid-cols-2 gap-4" : "grid grid-cols-1 gap-4 md:grid-cols-2"
        }
      >
        {codes.map((code, idx) => {
          const colorConfig = WEALTH_CODE_COLORS[code.key];
          const widthPercent = (code.score / maxScore) * 100;
          const IconComponent = WEALTH_CODE_ICONS[code.key];
          const isTopRank = idx === 0;

          return (
            <article
              key={code.key}
              className={`relative overflow-hidden rounded-2xl border bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 ${hoverClass}`}
              style={{ borderColor: `${colorConfig.primary}55` }}
            >
              <div
                className="pointer-events-none absolute inset-0 dark:hidden"
                style={{
                  background: `linear-gradient(145deg, ${colorConfig.light} 0%, rgba(255,255,255,0.97) 55%)`,
                }}
                aria-hidden="true"
              />
              <div
                className="absolute inset-x-0 top-0 z-[1] h-1"
                style={{
                  background: `linear-gradient(90deg, ${colorConfig.primary}, ${colorConfig.secondary})`,
                }}
                aria-hidden="true"
              />

              <div className="relative z-10 p-5">
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${colorConfig.primary} 0%, ${colorConfig.secondary} 100%)`,
                    }}
                  >
                    <IconComponent className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-base font-bold text-gray-900 dark:text-white">
                      {code.label}
                    </h4>
                    <p
                      className="mt-0.5 text-xs font-semibold uppercase tracking-wide"
                      style={{ color: colorConfig.primary }}
                    >
                      {getScoreDescriptor(widthPercent)}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    {isTopRank ? (
                      <div
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm"
                        style={{
                          background: `linear-gradient(135deg, ${colorConfig.primary}, ${colorConfig.secondary})`,
                        }}
                      >
                        <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                        Top
                      </div>
                    ) : null}
                    <div className="flex flex-col items-end">
                      <span
                        className="text-3xl font-black leading-none tabular-nums"
                        style={{ color: colorConfig.primary }}
                      >
                        {code.score.toFixed(1)}
                      </span>
                      <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                        / {maxScore}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-1.5 flex justify-between text-[10px] font-medium text-gray-500 dark:text-gray-400">
                    <span>Energy level</span>
                    <span>{Math.round(widthPercent)}%</span>
                  </div>
                  <div
                    className="h-2.5 overflow-hidden rounded-full shadow-inner"
                    style={{ backgroundColor: `${colorConfig.primary}22` }}
                  >
                    <div
                      className={`h-full rounded-full ${forPdfCapture ? "" : "transition-all duration-700 ease-out"}`}
                      style={{
                        width: `${widthPercent}%`,
                        background: `linear-gradient(90deg, ${colorConfig.primary}, ${colorConfig.secondary})`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

/**
 * Modern insights cards with gradient accents
 */
const ModernInsights: React.FC<{
  strengths: string[];
  blindSpots: string[];
  forPdfCapture?: boolean;
}> = ({ strengths, blindSpots, forPdfCapture }) => {
  if (strengths.length === 0 && blindSpots.length === 0) return null;

  return (
    <div className={forPdfCapture ? "grid grid-cols-2 gap-4 mb-6" : "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"}>
      {/* Strengths */}
      {strengths.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl p-6 border shadow-md bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border-green-200 dark:border-green-700/50">
          {forPdfCapture ? null : (
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl bg-gradient-to-br from-green-400/10 to-emerald-400/10 dark:from-green-400/5 dark:to-emerald-400/5" />
          )}
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="rounded-lg flex items-center justify-center shadow-lg"
                style={{
                  width: "36px",
                  height: "36px",
                  background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                  border: "2px solid rgba(5, 150, 105, 0.3)"
                }}
              >
                <Plus className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">
                Core Strengths
              </h3>
            </div>
            <ul className="space-y-2.5">
              {strengths.map((strength, idx) => (
                <li
                  key={`${strength}-${idx}`}
                  className="flex items-start gap-2.5"
                >
                  <div
                    className="rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
                    style={{
                      width: "24px",
                      height: "24px",
                      marginTop: "2px",
                      background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                      border: "2px solid rgba(5, 150, 105, 0.3)"
                    }}
                  >
                    <Check className="w-3 h-3 text-white" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                    {strength}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Blind Spots */}
      {blindSpots.length > 0 && (
        <div
          {...(forPdfCapture ? { "data-pdf-page-break-before": "" } : {})}
          className="relative overflow-hidden rounded-2xl p-6 border shadow-md bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border-amber-200 dark:border-amber-700/50"
        >
          {forPdfCapture ? null : (
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl bg-gradient-to-br from-amber-400/10 to-orange-400/10 dark:from-amber-400/5 dark:to-orange-400/5" />
          )}
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="rounded-lg flex items-center justify-center shadow-lg"
                style={{
                  width: "36px",
                  height: "36px",
                  background: "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)",
                  border: "2px solid rgba(217, 119, 6, 0.3)"
                }}
              >
                <AlertTriangle className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">
                Areas to Watch
              </h3>
            </div>
            <ul className="space-y-2.5">
              {blindSpots.map((blindSpot, idx) => (
                <li
                  key={`${blindSpot}-${idx}`}
                  className="flex items-start gap-2.5"
                >
                  <div
                    className="rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
                    style={{
                      width: "24px",
                      height: "24px",
                      marginTop: "2px",
                      background: "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)",
                      border: "2px solid rgba(217, 119, 6, 0.3)"
                    }}
                  >
                    <AlertTriangle className="w-3 h-3 text-white" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                    {blindSpot}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Modern career paths section
 */
const ModernCareerPaths: React.FC<{
  idealRoles: CareerRecommendation[];
  nonIdealRoles: CareerRecommendation[];
  forPdfCapture?: boolean;
}> = ({ idealRoles, nonIdealRoles, forPdfCapture }) => {
  if (idealRoles.length === 0 && nonIdealRoles.length === 0) return null;

  return (
    <div className="rounded-2xl shadow-lg border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 p-8 mb-6">
      <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">
        Career Alignment
      </h3>

      <div
        className={
          forPdfCapture
            ? "flex flex-col gap-8"
            : "grid grid-cols-1 lg:grid-cols-2 gap-6"
        }
      >
        {/* Ideal Roles */}
        {idealRoles.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-md flex items-center justify-center shadow-sm">
                <Check className="w-3 h-3 text-white" aria-hidden="true" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Ideal Career
              </h4>
            </div>
            <div className="space-y-3">
              {idealRoles.map((item, idx) => (
                <div
                  key={`${item.role}-${idx}`}
                  className={`p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 ${forPdfCapture ? "" : "hover:shadow-sm transition-shadow"}`}
                >
                  <div className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                    {item.role}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {item.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Non-Ideal Roles */}
        {nonIdealRoles.length > 0 && (
          <div {...(forPdfCapture ? { "data-pdf-page-break-before": "" } : {})}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-500 rounded-md flex items-center justify-center shadow-sm">
                <Minus className="w-3 h-3 text-white" aria-hidden="true" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Non-Ideal Career
              </h4>
            </div>
            <div className="space-y-3">
              {nonIdealRoles.map((item, idx) => (
                <div
                  key={`${item.role}-${idx}`}
                  className={`p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600 opacity-70 ${forPdfCapture ? "" : "hover:opacity-90 transition-opacity"}`}
                >
                  <div className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                    {item.role}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {item.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Empty state when no recognized stars
 */
const EmptyState: React.FC = () => {
  return (
    <div className="rounded-2xl shadow-lg border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 p-12 mb-6 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
        <Coins className="w-8 h-8 text-gray-700 dark:text-gray-100" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
        No Wealth Code Data Available
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
        No wealth archetype data available. This analysis identifies your natural business model
        based on Wealth Palace stars.
      </p>
    </div>
  );
};

/**
 * Main Wealth Code Component
 */
const WealthCode: React.FC<WealthCodeProps> = ({
  chartData,
  header,
  showTopDivider,
  palaceOverride,
  forPdfCapture,
}) => {
  // Analyze wealth code
  const wealthProfile = analyzeWealthCode(chartData, palaceOverride);
  const resolvedHeader: WealthCodeHeaderConfig = header ?? DEFAULT_HEADER;
  const shouldShowTopDivider = showTopDivider ?? true;

  return (
    <div className="p-6">
      {/* Divider */}
      {shouldShowTopDivider ? (
        <div className="w-full border-t border-gray-400 dark:border-gray-600 mb-6"></div>
      ) : null}

      {/* Section Title */}
      {resolvedHeader.badgeText ? (
        <WealthCodeHero
          badgeText={resolvedHeader.badgeText}
          title={resolvedHeader.title}
          subtitle={resolvedHeader.subtitle}
          forPdfCapture={forPdfCapture}
        />
      ) : (
        <div className="text-center mb-8">
          <h2 className="text-4xl mb-2 dark:text-white font-bold">
            {resolvedHeader.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {resolvedHeader.subtitle}
          </p>
        </div>
      )}

      {/* Content */}
      {wealthProfile.hasRecognizedStars ? (
        <>
          {/* 1. Premium Hero - Immediate Wow Factor */}
          <div data-pdf-break-anchor="wealth-hero">
            <PremiumHeroCard profile={wealthProfile} forPdfCapture={forPdfCapture} />
          </div>

          {/* 2. Modern Bar Chart - Visual Comparison */}
          <div data-pdf-break-anchor="wealth-chart">
            <ModernBarChart
              codes={wealthProfile.codes}
              dominantArchetype={wealthProfile.dominantArchetype}
              forPdfCapture={forPdfCapture}
            />
          </div>

          {/* 3. Modern Insights - Actionable */}
          <ModernInsights
            strengths={wealthProfile.strengths}
            blindSpots={wealthProfile.blindSpots}
            forPdfCapture={forPdfCapture}
          />

          {/* 5. Career Paths - Practical */}
          <ModernCareerPaths
            idealRoles={wealthProfile.idealRoles}
            nonIdealRoles={wealthProfile.nonIdealRoles}
            forPdfCapture={forPdfCapture}
          />
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default WealthCode;
