/**
 * Wealth Code Analysis Component
 * Displays comprehensive wealth-building profile based on stars in Wealth Palace
 */

import React from "react";
import {
  Check,
  Coins,
  Handshake,
  Minus,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { BrandGradientText } from "../BrandGradientText";
import {
  analysisHeroTitleClass,
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
import { SubsectionSparkleDivider } from "./shared/SubsectionSparkleDivider";
import {
  BRAND_EDITORIAL_HIGHLIGHT_THEME,
  PptHighlightCard,
  PptHighlightColumn,
  PptHighlightGroupHeader,
  ROTATING_HIGHLIGHT_THEMES,
} from "./shared/PptHighlightCards";
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

  return (
    <article
      className={`relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg dark:border-gray-700/60 dark:bg-gray-800/95 ${hoverClass}`}
    >
      <div
        className="absolute left-0 top-0 z-20 flex h-12 min-w-[3.25rem] items-center justify-center rounded-br-2xl px-3 shadow-md"
        style={{
          background: `linear-gradient(135deg, ${colorConfig.primary} 0%, ${colorConfig.secondary} 100%)`,
        }}
      >
        <span className="font-serif text-lg font-bold italic leading-none text-white">
          {WEALTH_CODE_DISPLAY_NUMBERS[code.key]}
        </span>
      </div>

      <div
        className="pointer-events-none absolute inset-0 dark:hidden"
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
              className="absolute inset-[0.35rem] rounded-full border-2 bg-white/80 shadow-inner dark:bg-gray-900/40"
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
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  / {maxScore}
                </span>
              </div>
            </div>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {WEALTH_CODE_CARD_TAGLINES[code.key]}
          </p>

          <div className="mt-5">
            <div className="mb-1.5 flex justify-between text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
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
    </article>
  );
};

type WealthCodeSubsectionHeaderProps = {
  title: string;
};

/**
 * Sub-section title + gradient divider — sits below the main section header, above score cards.
 */
const WealthCodeSubsectionHeader: React.FC<WealthCodeSubsectionHeaderProps> = ({ title }) => {
  return (
    <div className="text-center">
      <BrandGradientText
        as="h3"
        className="mx-auto inline-block w-fit text-2xl font-bold sm:text-3xl"
      >
        {title}
      </BrandGradientText>
      <SubsectionSparkleDivider className="mx-auto mb-0 mt-5 flex w-full max-w-md items-center gap-3 px-2" />
    </div>
  );
};

/**
 * Dominant archetype summary — flat editorial block (not a card); follows subsection h3.
 */
const PremiumHeroCard: React.FC<{ profile: WealthCodeAnalysisResult; forPdfCapture?: boolean }> = ({
  profile,
  forPdfCapture,
}) => {
  if (!profile.hasRecognizedStars) return null;

  const dominantCode = profile.codes.reduce((top, entry) =>
    entry.score > top.score ? entry : top
  );
  const colorConfig = WEALTH_CODE_COLORS[dominantCode.key];

  return (
    <section aria-labelledby="wealth-code-primary-insight">
      <div
        className="border-l-4 py-1 pl-6 sm:pl-8"
        style={{ borderColor: colorConfig.primary }}
      >
        <h4 id="wealth-code-primary-insight">
          <BrandGradientText
            as="span"
            className="text-sm font-bold uppercase tracking-[0.2em] sm:text-base"
          >
            Primary insight
          </BrandGradientText>
        </h4>
        <p className="mt-3 text-base font-medium leading-relaxed text-theme-fg-secondary sm:text-lg">
          {renderInsightTextWithHighlights(profile.summaryText)}
        </p>
        <div className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-theme-fg-secondary">
            Primary score
          </p>
          <p
            className="mt-1 font-serif text-3xl font-black leading-none tabular-nums"
            style={{ color: colorConfig.primary }}
          >
            {dominantCode.score.toFixed(1)}
            <span className="ml-1 text-sm font-semibold text-theme-fg-secondary">/ 10</span>
          </p>
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
 * Core strengths + watch patterns — PPT editorial columns with flat trait chips.
 */
const ModernInsights: React.FC<{
  strengths: string[];
  blindSpots: string[];
  forPdfCapture?: boolean;
}> = ({ strengths, blindSpots, forPdfCapture }) => {
  if (strengths.length === 0 && blindSpots.length === 0) return null;

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
      <div
        className={
          forPdfCapture
            ? "grid grid-cols-2 gap-8"
            : "grid grid-cols-1 gap-8 md:grid-cols-2"
        }
      >
        {strengthItems.length > 0 ? (
          <PptHighlightColumn
            header={{
              variant: "brand",
              beforeText: "What powers",
              emphasisText: "you",
              afterText: "",
            }}
            items={strengthItems}
            themes={[BRAND_EDITORIAL_HIGHLIGHT_THEME]}
            icon={Check}
            plainHighlight
            emptyMessage=""
            forPdfCapture={forPdfCapture}
          />
        ) : null}
        {watchItems.length > 0 ? (
          <div
            {...(forPdfCapture ? { "data-pdf-page-break-before": "" } : {})}
          >
            <PptHighlightColumn
              header={{
                variant: "muted",
                beforeText: "Patterns to",
                emphasisText: "watch",
                afterText: "",
              }}
              items={watchItems}
              themes={[BRAND_EDITORIAL_HIGHLIGHT_THEME]}
              icon={Minus}
              plainHighlight
              emptyMessage=""
              forPdfCapture={forPdfCapture}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
};

/**
 * Lowercases the first character for sentence flow after an em dash.
 */
const formatCareerReasonLead = (reason: string): string => {
  if (reason.length === 0) {
    return reason;
  }
  return `${reason.charAt(0).toLowerCase()}${reason.slice(1)}`;
};

/**
 * Career alignment — PPT-style highlight cards in a two-column layout.
 */
const ModernCareerPaths: React.FC<{
  idealRoles: CareerRecommendation[];
  nonIdealRoles: CareerRecommendation[];
  forPdfCapture?: boolean;
}> = ({ idealRoles, nonIdealRoles, forPdfCapture }) => {
  if (idealRoles.length === 0 && nonIdealRoles.length === 0) return null;

  const columnGridClass = forPdfCapture
    ? "grid grid-cols-2 gap-8"
    : "grid grid-cols-1 gap-8 lg:grid-cols-2";

  return (
    <section className="relative" aria-label="Career alignment">
      <Sparkles
        className="pointer-events-none absolute bottom-8 left-0 h-4 w-4 text-accent-gold/40"
        aria-hidden="true"
      />
      <Sparkles
        className="pointer-events-none absolute right-2 top-16 h-3 w-3 text-accent-gold/35"
        aria-hidden="true"
      />

      <div className={columnGridClass}>
        {idealRoles.length > 0 ? (
          <div>
            <PptHighlightGroupHeader
              variant="brand"
              beforeText="These careers are"
              emphasisText="for you"
            />
            <div className="flex flex-col gap-4">
              {idealRoles.map((item, idx) => (
                <PptHighlightCard
                  key={`${item.role}-${idx}`}
                  theme={BRAND_EDITORIAL_HIGHLIGHT_THEME}
                  icon={Check}
                  leadIn="Thrive as"
                  highlight={item.role}
                  trailing={`— ${formatCareerReasonLead(item.reason)}`}
                  forPdfCapture={forPdfCapture}
                  variant="flat"
                />
              ))}
            </div>
          </div>
        ) : null}

        {nonIdealRoles.length > 0 ? (
          <div>
            <PptHighlightGroupHeader
              variant="muted"
              beforeText="Roles to"
              emphasisText="reconsider"
            />
            <div className="flex flex-col gap-4">
              {nonIdealRoles.map((item, idx) => (
                <PptHighlightCard
                  key={`${item.role}-${idx}`}
                  theme={BRAND_EDITORIAL_HIGHLIGHT_THEME}
                  icon={Minus}
                  leadIn="May not suit"
                  highlight={item.role}
                  trailing={`— ${formatCareerReasonLead(item.reason)}`}
                  forPdfCapture={forPdfCapture}
                  variant="flat"
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
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
              <WealthCodeSubsectionHeader title={wealthProfile.dominantArchetype} />

              <div data-pdf-break-anchor="wealth-hero">
                <PremiumHeroCard profile={wealthProfile} forPdfCapture={forPdfCapture} />
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
