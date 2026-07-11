/**
 * Wealth Code Analysis Component
 * Displays comprehensive wealth-building profile based on stars in Wealth Palace
 */

import React from "react";
import {
  Coins,
  Handshake,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { lightPanelClass } from "../../styles/chartUi";
import {
  analysisPanelTitleClass,
} from "../../styles/typographyUi";
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
import {
  AnalysisSectionHeader,
  AnalysisSectionHeaderSimple,
} from "./shared/AnalysisSectionHeader";
import { WealthCodeInsightsCards } from "./shared/WealthCodeInsightsCards";
import { WealthCodeCareerPaths } from "./shared/WealthCodeCareerPaths";
import { renderInsightTextWithHighlights } from "./shared/personalityTextHighlight";

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

/** Fixed slide order numbers (01–04) per archetype — matches CAE deck layout. */
const WEALTH_CODE_DISPLAY_NUMBERS: Record<WealthCodeKey, string> = {
  investmentBrain: "01",
  brandingMagnet: "02",
  strategyPlanner: "03",
  collaborator: "04",
};

/** Ascending deck order: top-left → top-right → bottom-left → bottom-right. */
const WEALTH_CODE_DISPLAY_ORDER: readonly WealthCodeKey[] = [
  "investmentBrain",
  "brandingMagnet",
  "strategyPlanner",
  "collaborator",
] as const;

/** PPT-style persona taglines shown under each archetype title. */
const WEALTH_CODE_CARD_TAGLINES: Record<WealthCodeKey, string> = {
  investmentBrain:
    "Calm, high-conviction, ROI-driven, strategic thinker, resource allocator.",
  brandingMagnet:
    "Expressive, magnetic, persuasive, public-facing, natural storyteller.",
  strategyPlanner:
    "Structured, analytical, long-term thinker, detail-oriented, obsessed with systems & control.",
  collaborator:
    "Loyal, empathetic, team-driven, emotionally intelligent, nurturing.",
};

type WealthCodeScoreCardProps = {
  code: WealthCodeScore;
  isTopRank: boolean;
  maxScore: number;
  forPdfCapture?: boolean;
};

/**
 * Single wealth-code score card — PPT-inspired layout with score data retained.
 */
const WealthCodeScoreCard: React.FC<WealthCodeScoreCardProps> = ({
  code,
  isTopRank,
  maxScore,
  forPdfCapture,
}) => {
  const colorConfig = WEALTH_CODE_COLORS[code.key];
  const widthPercent = (code.score / maxScore) * 100;
  const IconComponent = WEALTH_CODE_ICONS[code.key];
  const hoverClass = forPdfCapture
    ? ""
    : "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl";

  const getScoreDescriptor = (scorePercent: number): string => {
    if (scorePercent >= 80) return "Exceptional";
    if (scorePercent >= 65) return "Strong";
    if (scorePercent >= 50) return "Moderate";
    return "Developing";
  };

  const cardBody = (
    <>
      <div
        className="absolute left-0 top-0 z-10 flex h-12 min-w-[3.25rem] items-center justify-center rounded-br-2xl px-3 shadow-md"
        style={{
          background: `linear-gradient(135deg, ${colorConfig.primary} 0%, ${colorConfig.secondary} 100%)`,
        }}
      >
        <span className="font-serif text-lg font-bold italic leading-none text-white">
          {WEALTH_CODE_DISPLAY_NUMBERS[code.key]}
        </span>
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(145deg, ${colorConfig.light} 0%, rgba(255,255,255,0.98) 48%)`,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-5 p-6 pt-10 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex shrink-0 justify-center sm:justify-start sm:self-center">
          <div className="relative flex h-[4.75rem] w-[4.75rem] items-center justify-center">
            <div
              className="absolute inset-0 rounded-full opacity-20"
              style={{ backgroundColor: colorConfig.primary }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-[0.35rem] rounded-full border-2 bg-white/80 shadow-inner"
              style={{ borderColor: `${colorConfig.primary}33` }}
              aria-hidden="true"
            />
            <div
              className="relative flex h-14 w-14 items-center justify-center rounded-full shadow-md"
              style={{
                background: `linear-gradient(135deg, ${colorConfig.primary} 0%, ${colorConfig.secondary} 100%)`,
              }}
            >
              <IconComponent className="h-7 w-7 text-white" aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h4
                className={analysisPanelTitleClass}
                style={{ color: colorConfig.primary }}
              >
                {code.label}
              </h4>
              <p
                className="mt-1 text-xs font-bold uppercase tracking-wider"
                style={{ color: colorConfig.primary }}
              >
                {getScoreDescriptor(widthPercent)}
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1.5">
              {isTopRank ? (
                <div
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${colorConfig.primary}, ${colorConfig.secondary})`,
                  }}
                >
                  <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                  Top
                </div>
              ) : null}
              <div className="flex items-baseline justify-end gap-1.5 whitespace-nowrap">
                <span
                  className="font-serif text-3xl font-black leading-none tabular-nums"
                  style={{ color: colorConfig.primary }}
                >
                  {code.score.toFixed(1)}
                </span>
                <span className="text-xs font-medium text-gray-500">
                  / {maxScore}
                </span>
              </div>
            </div>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            {WEALTH_CODE_CARD_TAGLINES[code.key]}
          </p>

          <div className="mt-5">
            <div className="mb-1.5 flex justify-between text-[10px] font-semibold uppercase tracking-wide text-gray-500">
              <span>Energy level</span>
              <span>{Math.round(widthPercent)}%</span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full shadow-inner"
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
      </div>
    </>
  );

  if (isTopRank) {
    const useAnimatedBorder = !forPdfCapture;

    return (
      <div className="relative overflow-visible rounded-3xl">
        {useAnimatedBorder ? (
          <>
            <span
              className="zwds-wealth-top-border-ripple absolute inset-0 rounded-3xl border-2"
              style={{ borderColor: colorConfig.primary }}
              aria-hidden="true"
            />
            <span
              className="zwds-wealth-top-border-ripple zwds-wealth-top-border-ripple-delay absolute inset-0 rounded-3xl border-2"
              style={{ borderColor: colorConfig.primary }}
              aria-hidden="true"
            />
          </>
        ) : null}

        <article
          className={[
            "relative z-10 overflow-hidden rounded-3xl border-2 bg-white shadow-xl",
            lightPanelClass,
            hoverClass,
          ].join(" ")}
          style={{
            borderColor: colorConfig.primary,
            boxShadow: `0 16px 40px ${colorConfig.primary}28`,
          }}
          aria-label={`${code.label}, top wealth code score`}
        >
          {cardBody}
        </article>
      </div>
    );
  }

  return (
    <article
      className={[
        "relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg",
        lightPanelClass,
        hoverClass,
      ].join(" ")}
      aria-label={code.label}
    >
      {cardBody}
    </article>
  );
};

type WealthCodeDominantHeroProps = {
  profile: WealthCodeAnalysisResult;
  forPdfCapture?: boolean;
};

/**
 * Combined dominant archetype hero — badge, title, insight copy, and primary score.
 */
const WealthCodeDominantHero: React.FC<WealthCodeDominantHeroProps> = ({
  profile,
  forPdfCapture,
}) => {
  if (!profile.hasRecognizedStars) {
    return null;
  }

  const dominantCode = profile.codes.reduce((top, entry) =>
    entry.score > top.score ? entry : top
  );

  const heroBackgroundStyle: React.CSSProperties = forPdfCapture
    ? {
        backgroundImage: [
          "radial-gradient(ellipse at 28% 18%, rgba(107, 91, 149, 0.14) 0%, transparent 52%)",
          "radial-gradient(ellipse at 88% 78%, rgba(254, 142, 1, 0.08) 0%, transparent 48%)",
          "linear-gradient(135deg, #EDE8F5 0%, #FAF7FD 42%, #FFFFFF 100%)",
        ].join(", "),
      }
    : {};

  return (
    <section
      aria-labelledby="wealth-code-dominant-hero-title"
      className="relative overflow-hidden rounded-2xl border border-brand-purple/20 bg-gradient-to-br from-[#EDE8F5] via-[#FAF7FD] to-white dark:border-brand-purple/30 dark:from-brand-purple/20 dark:via-surface-darkSecondary/80 dark:to-surface-darkSecondary/60"
      style={heroBackgroundStyle}
    >
      {forPdfCapture ? null : (
        <>
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_28%_18%,rgba(107,91,149,0.14),transparent_55%)] dark:hidden"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_88%_78%,rgba(254,142,1,0.08),transparent_50%)] dark:hidden"
            aria-hidden="true"
          />
        </>
      )}
      <Sparkles
        className="pointer-events-none absolute right-6 top-5 h-4 w-4 text-brand-purple/25 dark:text-accent-goldDark/45"
        aria-hidden="true"
      />
      <Sparkles
        className="pointer-events-none absolute bottom-8 left-8 h-3 w-3 text-[var(--color-accent-gradient-5)]/30 dark:text-accent-goldDark/40"
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="min-w-0 flex-1 lg:max-w-[62%]">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-purple px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white dark:bg-accent-goldDark sm:text-xs">
            <Sparkles className="h-3 w-3 shrink-0" aria-hidden="true" />
            Dominant Wealth Code
          </span>

          <h3
            id="wealth-code-dominant-hero-title"
            className="mt-4 font-serif text-3xl font-bold leading-tight text-navy dark:text-cream sm:text-4xl"
          >
            {profile.dominantArchetype}
          </h3>

          <p className="mt-4 text-sm leading-relaxed text-theme-fg-secondary dark:text-cream/85 sm:text-base">
            {renderInsightTextWithHighlights(profile.summaryText)}
          </p>
        </div>

        <div className="mx-auto w-full max-w-[11rem] shrink-0 lg:mx-0">
          <div className="rounded-2xl border border-[var(--color-accent-gradient-5)]/25 bg-white px-6 py-5 text-center shadow-lg shadow-[var(--color-accent-gradient-5)]/10 dark:border-accent-gold/25 dark:bg-surface-darkElevated dark:shadow-black/30">
            <Star
              className="mx-auto h-4 w-4 fill-current text-[var(--color-accent-gradient-5)] dark:text-accent-gold"
              aria-hidden="true"
            />
            <p className="mt-2 font-serif text-4xl font-black leading-none tabular-nums text-brand-purple dark:text-accent-gold">
              {dominantCode.score.toFixed(1)}
            </p>
            <div
              className="mx-auto mt-3 h-px w-10 bg-theme-border-subtle dark:bg-theme-border-strong"
              aria-hidden="true"
            />
            <p className="mt-3 text-xs font-medium text-theme-fg-secondary dark:text-cream/75">
              Primary Score
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Scoreboard grid for wealth codes — layout refresh; archetype colors unchanged.
 */
const ModernBarChart: React.FC<{
  codes: WealthCodeScore[];
  forPdfCapture?: boolean;
}> = ({ codes, forPdfCapture }) => {
  const maxScore = 10;

  const orderIndex = (key: WealthCodeKey): number =>
    WEALTH_CODE_DISPLAY_ORDER.indexOf(key);

  const sortedCodes = [...codes].sort(
    (a, b) => orderIndex(a.key) - orderIndex(b.key)
  );

  const topScore = sortedCodes.reduce(
    (highest, entry) => Math.max(highest, entry.score),
    0
  );

  return (
    <section>
      <div
        className={
          forPdfCapture ? "grid grid-cols-2 gap-8" : "grid grid-cols-1 gap-8 md:grid-cols-2"
        }
      >
        {sortedCodes.map((code) => (
          <WealthCodeScoreCard
            key={code.key}
            code={code}
            isTopRank={code.score === topScore && topScore > 0}
            maxScore={maxScore}
            forPdfCapture={forPdfCapture}
          />
        ))}
      </div>
    </section>
  );
};

/**
 * Core strengths + watch patterns — white list cards.
 */
const ModernInsights: React.FC<{
  strengths: string[];
  blindSpots: string[];
  forPdfCapture?: boolean;
}> = ({ strengths, blindSpots, forPdfCapture }) => {
  if (strengths.length === 0 && blindSpots.length === 0) {
    return null;
  }

  const strengthItems = strengths.map((label, idx) => ({
    id: `wealth-strength-${idx}`,
    label,
  }));
  const watchItems = blindSpots.map((label, idx) => ({
    id: `wealth-watch-${idx}`,
    label,
  }));

  return (
    <section aria-label="Wealth profile insights">
      <WealthCodeInsightsCards
        strengths={strengthItems}
        blindSpots={watchItems}
        forPdfCapture={forPdfCapture}
      />
    </section>
  );
};

/**
 * Career alignment — white list cards matching wealth insights layout.
 */
const ModernCareerPaths: React.FC<{
  idealRoles: CareerRecommendation[];
  nonIdealRoles: CareerRecommendation[];
  forPdfCapture?: boolean;
}> = ({ idealRoles, nonIdealRoles, forPdfCapture }) => {
  if (idealRoles.length === 0 && nonIdealRoles.length === 0) {
    return null;
  }

  return (
    <section aria-label="Career alignment">
      <WealthCodeCareerPaths
        idealRoles={idealRoles}
        nonIdealRoles={nonIdealRoles}
        forPdfCapture={forPdfCapture}
      />
    </section>
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
        <div className="mb-8 w-full border-t border-gray-400 dark:border-gray-600"></div>
      ) : null}

      {/* Section header lives inside ModernBarChart / empty-state fallback below */}
      {resolvedHeader.badgeText ? null : (
        <AnalysisSectionHeaderSimple
          title={resolvedHeader.title}
          subtitle={resolvedHeader.subtitle}
        />
      )}

      {/* Content */}
      {wealthProfile.hasRecognizedStars ? (
        <>
          <div data-pdf-break-anchor="wealth-chart">
            {resolvedHeader.badgeText ? (
              <AnalysisSectionHeader
                sectionLabel="Wealth profile"
                badgeText={resolvedHeader.badgeText}
                title={resolvedHeader.title}
                subtitle={resolvedHeader.subtitle}
                icon={TrendingUp}
                pdfBreakAnchor="wealth-header"
                forPdfCapture={forPdfCapture}
              />
            ) : null}

            <div className="space-y-24 pt-8">
              <div data-pdf-break-anchor="wealth-hero">
                <WealthCodeDominantHero profile={wealthProfile} forPdfCapture={forPdfCapture} />
              </div>

              <ModernBarChart
                codes={wealthProfile.codes}
                forPdfCapture={forPdfCapture}
              />

              <ModernInsights
                strengths={wealthProfile.strengths}
                blindSpots={wealthProfile.blindSpots}
                forPdfCapture={forPdfCapture}
              />

              <ModernCareerPaths
                idealRoles={wealthProfile.idealRoles}
                nonIdealRoles={wealthProfile.nonIdealRoles}
                forPdfCapture={forPdfCapture}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          {resolvedHeader.badgeText ? (
            <AnalysisSectionHeader
              sectionLabel="Wealth profile"
              badgeText={resolvedHeader.badgeText}
              title={resolvedHeader.title}
              subtitle={resolvedHeader.subtitle}
              icon={TrendingUp}
              forPdfCapture={forPdfCapture}
            />
          ) : null}
          <EmptyState />
        </>
      )}
    </div>
  );
};

export default WealthCode;
