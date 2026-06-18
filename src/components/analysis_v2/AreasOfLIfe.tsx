/**
 * AreasOfLife — Destiny Scoreboard (Section 06)
 *
 * Editorial pillar pills + radar overview + per-pillar flat reading panels.
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Briefcase,
  ChartColumn,
  Check,
  ChevronUp,
  ArrowRight,
  Coins,
  FileText,
  Hand,
  HeartHandshake,
  HeartPulse,
  LayoutGrid,
  MousePointerClick,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { useLanguage } from "../../context/LanguageContext";
import {
  calculateLifeAreaScores,
  analyzeLifeAreas,
  type ChartDataType,
  type LifeAreaResult,
} from "../../utils/zwds/analysis";
import { AnalysisSectionHeader } from "./shared/AnalysisSectionHeader";
import { SubsectionSparkleDivider } from "./shared/SubsectionSparkleDivider";

const AREA_PREVIEW_CHAR_LIMIT = 300;

const LIFE_AREA_ICONS: Record<string, LucideIcon> = {
  "💞": HeartHandshake,
  "❤️‍🩹": HeartPulse,
  "💼": Briefcase,
  "💰": Coins,
  "👥": Users,
};

/** Per-pillar semantic accent — card tint, bar, header gradient, and watermark. */
const AREA_ACCENTS: Record<
  string,
  {
    accent: string;
    cardBg: string;
    barTrack: string;
    headerFrom: string;
    headerTo: string;
    watermark: string;
  }
> = {
  "财帛": {
    accent: "#D97706",
    cardBg: "#FFF8F0",
    barTrack: "#FCEBD5",
    headerFrom: "#D97706",
    headerTo: "#F59E0B",
    watermark: "财",
  },
  "官禄": {
    accent: "#3F7BB8",
    cardBg: "#F2F7FD",
    barTrack: "#DCE9F8",
    headerFrom: "#4F8FD4",
    headerTo: "#6BAADC",
    watermark: "禄",
  },
  "疾厄": {
    accent: "#D91744",
    cardBg: "#FFF8F4",
    barTrack: "#FCE0E0",
    headerFrom: "#D91744",
    headerTo: "#E84A6F",
    watermark: "厄",
  },
  "夫妻": {
    accent: "#C45A8A",
    cardBg: "#FDF2F7",
    barTrack: "#F8DCE8",
    headerFrom: "#C45A8A",
    headerTo: "#D97AAC",
    watermark: "缘",
  },
  "交友": {
    accent: "#7B5FC4",
    cardBg: "#F3EFF8",
    barTrack: "#EDE8F5",
    headerFrom: "#8B6FC8",
    headerTo: "#A67ED9",
    watermark: "友",
  },
};

const DEFAULT_AREA_ACCENT = {
  accent: "#6B5B95",
  cardBg: "#F3EFF8",
  barTrack: "#EDE8F5",
  headerFrom: "#6B5B95",
  headerTo: "#8B7BA8",
  watermark: "★",
};

const normalizeStarName = (name: string): string => {
  const charMap: Record<string, string> = {
    辅: "輔",
  };

  return name
    .split("")
    .map((char) => charMap[char] || char)
    .join("");
};

const getPreviewAreaText = (description: string, expanded: boolean): string => {
  if (expanded || description.length <= AREA_PREVIEW_CHAR_LIMIT) {
    return description;
  }

  const slice = description.slice(0, AREA_PREVIEW_CHAR_LIMIT);
  const lastSpace = slice.lastIndexOf(" ");
  const cut =
    lastSpace > AREA_PREVIEW_CHAR_LIMIT * 0.75
      ? slice.slice(0, lastSpace)
      : slice;

  return `${cut.trimEnd()}…`;
};

const areaExceedsPreviewLimit = (description: string): boolean =>
  description.length > AREA_PREVIEW_CHAR_LIMIT;

type ScorePillarPillProps = {
  area: LifeAreaResult;
  isActive: boolean;
  isTopPillar: boolean;
  onSelect: () => void;
  forPdfCapture?: boolean;
};

/**
 * Scrollable pillar card — white panel with themed accent, score bar, and status.
 */
const ScorePillarPill: React.FC<ScorePillarPillProps> = ({
  area,
  isActive,
  isTopPillar,
  onSelect,
  forPdfCapture,
}) => {
  const theme = AREA_ACCENTS[area.area] ?? DEFAULT_AREA_ACCENT;
  const Icon = LIFE_AREA_ICONS[area.icon];
  const hoverClass = forPdfCapture
    ? ""
    : "cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md";

  return (
    <button
      type="button"
      role="tab"
      onClick={onSelect}
      disabled={forPdfCapture}
      aria-selected={isActive}
      aria-label={`${area.displayName}, ${area.score}% — ${isActive ? "currently viewing" : "tap to view reading"}`}
      className={[
        "relative min-w-0 w-full rounded-2xl border-2 p-3 text-left shadow-sm sm:p-4",
        hoverClass,
        isActive
          ? "border-solid shadow-md"
          : "border-theme-border-subtle bg-white hover:border-brand-purple/40 hover:bg-[#FAF7FD] dark:border-theme-border-strong dark:bg-surface-elevated/90 dark:hover:bg-surface-elevated",
      ].join(" ")}
      style={
        isActive
          ? {
              borderColor: `${theme.accent}55`,
              backgroundColor: theme.cardBg,
              boxShadow: `0 8px 24px ${theme.accent}18`,
            }
          : undefined
      }
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          style={{
            backgroundColor: isActive ? theme.accent : `${theme.accent}18`,
          }}
        >
          {Icon ? (
            <Icon
              className="h-4 w-4"
              style={{ color: isActive ? "#FFFFFF" : theme.accent }}
              aria-hidden="true"
            />
          ) : (
            <span className="text-sm" role="img" aria-label={area.displayName}>
              {area.icon}
            </span>
          )}
        </div>

        {isTopPillar ? (
          <span
            className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white"
            style={{ backgroundColor: theme.accent }}
          >
            Top
          </span>
        ) : null}
      </div>

      <p className="mt-3 text-[9px] font-bold uppercase leading-snug tracking-[0.14em] text-theme-fg-secondary sm:text-[10px] sm:tracking-[0.18em]">
        {area.displayName}
      </p>

      <p
        className="mt-1 font-serif text-2xl font-bold tabular-nums leading-none sm:text-3xl"
        style={{ color: theme.accent }}
      >
        {area.score}
        <span className="ml-0.5 text-base font-semibold text-theme-fg-secondary">%</span>
      </p>

      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full"
        style={{ backgroundColor: theme.barTrack }}
      >
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${area.score}%`, backgroundColor: theme.accent }}
        />
      </div>

      {!forPdfCapture ? (
        <div
          className="mt-3 inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.14em] sm:text-[10px]"
          style={{ color: isActive ? theme.accent : undefined }}
        >
          {isActive ? (
            <>
              <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>Now viewing</span>
            </>
          ) : (
            <>
              <Hand className="h-3.5 w-3.5 shrink-0 text-brand-purple dark:text-accent-gold" aria-hidden="true" />
              <span className="text-brand-purple dark:text-accent-gold">Tap to view</span>
            </>
          )}
        </div>
      ) : null}
    </button>
  );
};

/**
 * Prominent callout explaining that pillar cards are interactive selectors.
 */
const PillarSelectionCallout: React.FC = () => (
  <div className="mb-4 rounded-2xl border border-brand-purple/25 bg-gradient-to-r from-[#EDE8F5] via-[#FAF7FD] to-white p-4 shadow-sm dark:border-accent-gold/25 dark:from-brand-purple/20 dark:via-surface-darkSecondary/80 dark:to-surface-darkSecondary/60 sm:p-5">
    <div className="flex items-start gap-3 sm:gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-purple text-white shadow-sm dark:bg-accent-goldDark">
        <MousePointerClick className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <h3 className="font-serif text-xl font-bold text-navy dark:text-cream sm:text-2xl">
          Explore Your Pillars
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-theme-fg-secondary sm:text-base">
          <span className="font-bold text-brand-purple dark:text-accent-gold">
            Tap any pillar card below
          </span>{" "}
          to switch the reading. Each card reveals a different area of your destiny scoreboard.
        </p>
      </div>
    </div>
  </div>
);

type LifeAreaPanelProps = {
  area: LifeAreaResult;
  description: string;
  expanded: boolean;
  onToggle: () => void;
  forPdfCapture?: boolean;
  pdfPageBreakBefore?: boolean;
};

/**
 * Themed reading panel — gradient header, score bar, nested reading box.
 */
const LifeAreaPanel: React.FC<LifeAreaPanelProps> = ({
  area,
  description,
  expanded,
  onToggle,
  forPdfCapture,
  pdfPageBreakBefore,
}) => {
  const theme = AREA_ACCENTS[area.area] ?? DEFAULT_AREA_ACCENT;
  const Icon = LIFE_AREA_ICONS[area.icon];
  const isExpanded = Boolean(forPdfCapture || expanded);
  const showReadMore = !forPdfCapture && areaExceedsPreviewLimit(description);
  const starLabel =
    area.stars.length === 1
      ? "1 star influencing this pillar"
      : `${area.stars.length} stars influencing this pillar`;

  return (
    <article
      data-pdf-break-anchor={`area-card-${area.area}`}
      {...(pdfPageBreakBefore ? { "data-pdf-page-break-before": "" } : {})}
      className="relative overflow-hidden rounded-2xl border shadow-sm"
      style={{
        borderColor: `${theme.accent}22`,
        backgroundColor: theme.cardBg,
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 right-3 select-none font-serif text-[5rem] font-black leading-none sm:bottom-4 sm:right-4 sm:text-[5.5rem]"
        style={{
          color: theme.accent,
          opacity: 0.07,
        }}
      >
        {theme.watermark}
      </div>

      <div
        className="relative flex items-center justify-between gap-4 px-5 py-4"
        style={{
          background: `linear-gradient(135deg, ${theme.headerFrom}, ${theme.headerTo})`,
        }}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
            {Icon ? (
              <Icon className="h-5 w-5 text-white" aria-hidden="true" />
            ) : (
              <span className="text-base text-white" role="img" aria-label={area.displayName}>
                {area.icon}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
              Destiny Pillar
            </p>
            <h4 className="font-serif text-lg font-bold leading-tight text-white sm:text-xl">
              {area.displayName}
            </h4>
          </div>
        </div>

        <p className="shrink-0 font-serif text-3xl font-bold tabular-nums text-white sm:text-4xl">
          {area.score}
          <span className="text-lg font-semibold text-white/90">%</span>
        </p>
      </div>

      <div className="relative z-10 p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: theme.accent }}
            aria-hidden="true"
          />
          <p
            className="text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: theme.accent }}
          >
            {starLabel}
          </p>
          <Sparkles
            className="ml-auto h-3.5 w-3.5 shrink-0 text-[var(--color-accent-gradient-5)]/55"
            aria-hidden="true"
          />
        </div>

        <div
          className="mt-3 h-2 overflow-hidden rounded-full"
          style={{ backgroundColor: theme.barTrack }}
        >
          <div
            className="h-full rounded-full transition-[width] duration-500 ease-out"
            style={{ width: `${area.score}%`, backgroundColor: theme.accent }}
          />
        </div>

        {description ? (
          <div className="mt-5 rounded-xl border border-theme-border-subtle bg-white/90 p-5 shadow-sm dark:border-theme-border-strong dark:bg-surface-elevated/90 sm:p-6">
            <div className="flex items-center gap-2">
              <FileText
                className="h-4 w-4 shrink-0"
                style={{ color: theme.accent }}
                aria-hidden="true"
              />
              <p
                className="text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: theme.accent }}
              >
                Reading
              </p>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-theme-fg-secondary sm:text-[15px]">
              {getPreviewAreaText(description, isExpanded)}
            </p>

            {showReadMore ? (
              <button
                type="button"
                onClick={onToggle}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] transition-opacity hover:opacity-80"
                style={{ color: theme.accent }}
              >
                {expanded ? (
                  <>
                    Show less
                    <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                  </>
                ) : (
                  <>
                    See more
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </>
                )}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
};

const AreasOfLife: React.FC<{
  chartData: ChartDataType;
  palaceOverride?: number;
  forPdfCapture?: boolean;
}> = ({ chartData, palaceOverride, forPdfCapture }) => {
  const { t, language } = useLanguage();
  const [expandedAreas, setExpandedAreas] = useState<Record<string, boolean>>({});
  const [selectedAreaKey, setSelectedAreaKey] = useState<string | null>(null);
  const hasInitializedSelection = useRef(false);

  const toggleArea = (areaId: string) => {
    setExpandedAreas((prev) => ({
      ...prev,
      [areaId]: !prev[areaId],
    }));
  };

  const lifeAreaScores = useMemo(() => {
    const rows = calculateLifeAreaScores(chartData, language, palaceOverride);
    if (!forPdfCapture || language !== "en") {
      return rows;
    }
    const shortLabels: Record<string, string> = {
      财帛: "Finance",
      官禄: "Career",
      疾厄: "Health",
      夫妻: "Love",
      交友: "Social",
    };
    return rows.map((row) => ({
      ...row,
      area: shortLabels[row.originalName] ?? row.area,
    }));
  }, [chartData, language, palaceOverride, forPdfCapture]);

  const lifeAreaAnalysis = useMemo(() => {
    return analyzeLifeAreas(chartData, language, palaceOverride);
  }, [chartData, language, palaceOverride]);

  const topPillarAreaKey = useMemo(() => {
    if (lifeAreaAnalysis.length === 0) {
      return null;
    }
    const top = lifeAreaAnalysis.reduce((best, current) =>
      current.score > best.score ? current : best
    );
    return top.area;
  }, [lifeAreaAnalysis]);

  useEffect(() => {
    if (lifeAreaAnalysis.length === 0 || hasInitializedSelection.current) {
      return;
    }
    const defaultKey = topPillarAreaKey ?? lifeAreaAnalysis[0]?.area ?? null;
    setSelectedAreaKey(defaultKey);
    hasInitializedSelection.current = true;
  }, [lifeAreaAnalysis, topPillarAreaKey]);

  const selectedArea = useMemo(() => {
    if (lifeAreaAnalysis.length === 0) {
      return null;
    }
    const match = lifeAreaAnalysis.find((area) => area.area === selectedAreaKey);
    return match ?? lifeAreaAnalysis[0] ?? null;
  }, [lifeAreaAnalysis, selectedAreaKey]);

  const getCombinedDescription = (area: LifeAreaResult): string => {
    if (!area.stars || area.stars.length === 0) {
      return "";
    }

    return area.stars
      .map((star) => {
        const starDescription =
          language === "en"
            ? getStarDescription(area.area, star.name, star.description)
            : star.description;

        return starDescription;
      })
      .join(" ");
  };

  const getStarDescription = (
    areaKey: string,
    starName: string,
    fallback: string
  ): string => {
    const exactMatch = t(
      `analysis.areas.${areaKey}.stars.${starName}.description`
    );
    if (exactMatch !== `analysis.areas.${areaKey}.stars.${starName}.description`) {
      return exactMatch;
    }

    const normalizedName = normalizeStarName(starName);
    if (normalizedName !== starName) {
      const normalizedMatch = t(
        `analysis.areas.${areaKey}.stars.${normalizedName}.description`
      );
      if (
        normalizedMatch !==
        `analysis.areas.${areaKey}.stars.${normalizedName}.description`
      ) {
        return normalizedMatch;
      }
    }

    return fallback;
  };

  const pillarPills =
    lifeAreaAnalysis.length > 0 ? (
      <div className="mb-8">
        {!forPdfCapture ? <PillarSelectionCallout /> : null}
        <div
          className={
            forPdfCapture
              ? "grid w-full grid-cols-2 gap-3"
              : "grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
          }
          role="tablist"
          aria-label="Destiny pillars — tap a card to change the reading below"
        >
          {lifeAreaAnalysis.map((area) => (
            <ScorePillarPill
              key={`pill-${area.area}`}
              area={area}
              isActive={selectedArea?.area === area.area}
              isTopPillar={area.area === topPillarAreaKey}
              onSelect={() => setSelectedAreaKey(area.area)}
              forPdfCapture={forPdfCapture}
            />
          ))}
        </div>
      </div>
    ) : null;

  const radarBlock = (
    <div
      data-pdf-break-anchor="areas-radar-chart"
      className={
        forPdfCapture ? "" : "lg:col-span-5 lg:sticky lg:top-24 lg:self-start"
      }
    >
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-theme-fg-secondary">
          At a glance
        </p>
        <div className="mt-1 flex items-center gap-2">
          <ChartColumn
            className="h-4 w-4 text-brand-purple dark:text-accent-gold"
            aria-hidden="true"
          />
          <h3 className="text-sm font-bold uppercase tracking-wide text-theme-fg sm:text-base">
            Life areas radar
          </h3>
        </div>
        <div className={`mt-4 ${forPdfCapture ? "h-[250px]" : "h-72 md:h-80"}`}>
          {lifeAreaScores.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                data={lifeAreaScores}
                margin={
                  forPdfCapture
                    ? { top: 12, right: 30, bottom: 12, left: 30 }
                    : { top: 8, right: 8, bottom: 8, left: 8 }
                }
              >
                <PolarGrid stroke="#94a3b8" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="area"
                  tick={{
                    fill: "#64748b",
                    fontSize: forPdfCapture ? 11 : 12,
                    fontWeight: 600,
                  }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#6B5B95"
                  fill="#8B1167"
                  fillOpacity={0.35}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-theme-fg-secondary">
                {t("analysis.noDataAvailable") || "No data available"}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );

  const areaPanels =
    lifeAreaAnalysis.length > 0 ? (
      forPdfCapture ? (
        <div className="space-y-8">
          {lifeAreaAnalysis.map((area, index) => (
            <LifeAreaPanel
              key={area.area}
              area={area}
              description={getCombinedDescription(area)}
              expanded={Boolean(expandedAreas[area.area])}
              onToggle={() => toggleArea(area.area)}
              forPdfCapture={forPdfCapture}
              pdfPageBreakBefore={Boolean(
                index === 1 || index === lifeAreaAnalysis.length - 1
              )}
            />
          ))}
        </div>
      ) : selectedArea ? (
        <div role="tabpanel" aria-label={selectedArea.displayName}>
          <LifeAreaPanel
            key={selectedArea.area}
            area={selectedArea}
            description={getCombinedDescription(selectedArea)}
            expanded={Boolean(expandedAreas[selectedArea.area])}
            onToggle={() => toggleArea(selectedArea.area)}
            forPdfCapture={forPdfCapture}
          />
        </div>
      ) : null
    ) : (
      <div className="py-10 text-center">
        <ChartColumn
          className="mx-auto h-10 w-10 text-theme-fg-secondary/50"
          aria-hidden="true"
        />
        <p className="mt-4 text-sm text-theme-fg-secondary">
          {t("analysis.noAnalysisAvailable") || "No analysis available"}
        </p>
      </div>
    );

  return (
    <div className="p-6">
      <div {...(forPdfCapture ? { "data-pdf-page-break-before": "" } : {})}>
        <AnalysisSectionHeader
          sectionLabel="Life pillars"
          badgeText="06"
          title="Destiny Scoreboard"
          subtitle="Your personal scorecard across the five destiny pillars — see the shape of your chart at a glance, then dive into each area."
          icon={LayoutGrid}
          backgroundImage="/images/chart/trophy.png"
          backgroundPosition="right 40%"
          pdfBreakAnchor="destiny-scoreboard-hero"
          forPdfCapture={forPdfCapture}
        />
        <SubsectionSparkleDivider />
      </div>

      {pillarPills}

      <div
        className={
          forPdfCapture ? "grid grid-cols-1 gap-8" : "grid grid-cols-1 gap-8 lg:grid-cols-12"
        }
      >
        {radarBlock}
        <div className={forPdfCapture ? "" : "lg:col-span-7"}>{areaPanels}</div>
      </div>
    </div>
  );
};

export default AreasOfLife;
