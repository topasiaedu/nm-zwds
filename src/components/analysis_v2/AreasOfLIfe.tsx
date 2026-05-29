/**
 * AreasOfLife — Destiny Scoreboard (Section 06)
 *
 * Radar overview + per-pillar score cards with expandable readings.
 */

import React, { useMemo, useState } from "react";
import {
  Briefcase,
  ChartColumn,
  ChevronDown,
  ChevronUp,
  Coins,
  HeartHandshake,
  HeartPulse,
  LayoutGrid,
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
  getScoreBadgeClasses,
  type ChartDataType,
  type LifeAreaResult,
} from "../../utils/zwds/analysis";
import { BrandGradientText } from "../BrandGradientText";
import { brandGradientTextClass } from "../../styles/typographyUi";
import { pdfCaptureNumericBadgeStyle } from "./shared/pdfCaptureNumericBadgeStyle";

const AREA_PREVIEW_CHAR_LIMIT = 300;

const LIFE_AREA_ICONS: Record<string, LucideIcon> = {
  "💞": HeartHandshake,
  "❤️‍🩹": HeartPulse,
  "💼": Briefcase,
  "💰": Coins,
  "👥": Users,
};

/** Per-pillar accent — left border + icon chip (distinct from generic indigo). */
const AREA_ACCENTS: Record<
  string,
  { from: string; to: string; border: string }
> = {
  "财帛": { from: "#d97706", to: "#f59e0b", border: "#fcd34d" },
  "官禄": { from: "#2563eb", to: "#3b82f6", border: "#93c5fd" },
  "疾厄": { from: "#e11d48", to: "#f43f5e", border: "#fda4af" },
  "夫妻": { from: "#db2777", to: "#ec4899", border: "#f9a8d4" },
  "交友": { from: "#7c3aed", to: "#8b5cf6", border: "#c4b5fd" },
};

const DEFAULT_AREA_ACCENT = { from: "#6366f1", to: "#8b5cf6", border: "#a5b4fc" };

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

type DestinyScoreboardHeroProps = {
  forPdfCapture?: boolean;
};

const DestinyScoreboardHero: React.FC<DestinyScoreboardHeroProps> = ({
  forPdfCapture,
}) => (
  <div
    data-pdf-break-anchor="destiny-scoreboard-hero"
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

    <div className="relative z-10 flex flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-12">
      <div className="min-w-0 flex-1">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
          <LayoutGrid className="h-3.5 w-3.5 text-accent-gold" aria-hidden="true" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/90">
            Section 06
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
            06
          </span>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl md:text-4xl">
            Destiny Scoreboard
          </h2>
        </div>
        <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-white/90 sm:text-lg">
          Your personal scorecard across the five destiny pillars — see the shape
          of your chart at a glance, then dive into each area.
        </p>
      </div>
      <div
        className={`flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-lg sm:h-24 sm:w-24 ${
          forPdfCapture ? "" : "backdrop-blur-md"
        }`}
      >
        <ChartColumn className="h-10 w-10 text-white sm:h-12 sm:w-12" aria-hidden="true" />
      </div>
    </div>
    <div
      className="relative z-10 h-1.5 bg-gradient-to-r from-accent-goldDark via-accent-coralDark to-indigo-400 dark:from-amber-200 dark:via-white dark:to-amber-100"
      aria-hidden="true"
    />
  </div>
);

type ScorePillarChipProps = {
  area: LifeAreaResult;
  isTopPillar?: boolean;
  forPdfCapture?: boolean;
};

const ScorePillarChip: React.FC<ScorePillarChipProps> = ({ area, isTopPillar = false }) => {
  const accent = AREA_ACCENTS[area.area] ?? DEFAULT_AREA_ACCENT;
  const Icon = LIFE_AREA_ICONS[area.icon];

  return (
    <div
      className="flex min-w-[140px] flex-1 flex-col rounded-xl border bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
      style={{ borderColor: accent.border, borderLeftWidth: 4, borderLeftColor: accent.from }}
    >
      <div className="flex items-center gap-2">
        {Icon ? (
          <Icon className="h-4 w-4 flex-shrink-0" style={{ color: accent.from }} aria-hidden="true" />
        ) : (
          <span className="text-base" role="img" aria-label={area.displayName}>
            {area.icon}
          </span>
        )}
        {isTopPillar ? (
          <span
            className={`truncate text-xs font-bold uppercase tracking-wide ${brandGradientTextClass}`}
          >
            {area.displayName}
          </span>
        ) : (
          <span className="truncate text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">
            {area.displayName}
          </span>
        )}
      </div>
      <p
        className={`mt-2 text-2xl font-black ${
          isTopPillar ? brandGradientTextClass : getScoreBadgeClasses(area.score)
        }`}
      >
        {area.score}%
      </p>
    </div>
  );
};

type LifeAreaCardProps = {
  area: LifeAreaResult;
  description: string;
  expanded: boolean;
  onToggle: () => void;
  forPdfCapture?: boolean;
  pdfPageBreakBefore?: boolean;
};

const LifeAreaCard: React.FC<LifeAreaCardProps> = ({
  area,
  description,
  expanded,
  onToggle,
  forPdfCapture,
  pdfPageBreakBefore,
}) => {
  const accent = AREA_ACCENTS[area.area] ?? DEFAULT_AREA_ACCENT;
  const Icon = LIFE_AREA_ICONS[area.icon];
  const hoverClass = forPdfCapture ? "" : "transition-shadow duration-300 hover:shadow-md";
  const isExpanded = Boolean(forPdfCapture || expanded);
  const showReadMore = !forPdfCapture && areaExceedsPreviewLimit(description);

  return (
    <article
      data-pdf-break-anchor={`area-card-${area.area}`}
      {...(pdfPageBreakBefore ? { "data-pdf-page-break-before": "" } : {})}
      className={`overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 ${hoverClass}`}
      style={{ borderLeftWidth: 4, borderLeftColor: accent.from }}
    >
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
              }}
            >
              {Icon ? (
                <Icon className="h-5 w-5 text-white" aria-hidden="true" />
              ) : (
                <span className="text-lg" role="img" aria-label={area.displayName}>
                  {area.icon}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-gray-900 dark:text-white">
                {area.displayName}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {area.stars.length} star{area.stars.length === 1 ? "" : "s"} influencing this pillar
              </p>
            </div>
          </div>
          <div
            className="flex flex-shrink-0 items-center rounded-full px-3 py-1"
            style={{
              background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
            }}
          >
            <span className="text-sm font-bold text-white">{area.score}%</span>
          </div>
        </div>

        {/* Score bar */}
        <div className="mt-4">
          <div
            className="h-2 overflow-hidden rounded-full"
            style={{ background: "rgba(0,0,0,0.08)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${area.score}%`,
                background: `linear-gradient(90deg, ${accent.from}, ${accent.to})`,
                transition: forPdfCapture ? "none" : "width 0.6s ease",
              }}
            />
          </div>
        </div>

        {description ? (
          <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-700">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
              Reading
            </p>
            <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {getPreviewAreaText(description, isExpanded)}
            </p>
            {showReadMore ? (
              <button
                type="button"
                onClick={onToggle}
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                {expanded ? (
                  <>
                    Show less
                    <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                  </>
                ) : (
                  <>
                    Read more
                    <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
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

  return (
    <div className="p-6">
      <div {...(forPdfCapture ? { "data-pdf-page-break-before": "" } : {})}>
        <DestinyScoreboardHero forPdfCapture={forPdfCapture} />
      </div>

      {lifeAreaAnalysis.length > 0 ? (
        <div
          className={`mb-8 flex gap-3 overflow-x-auto pb-1 ${forPdfCapture ? "flex-wrap" : ""}`}
        >
          {lifeAreaAnalysis.map((area) => (
            <ScorePillarChip
              key={`chip-${area.area}`}
              area={area}
              isTopPillar={area.area === topPillarAreaKey}
              forPdfCapture={forPdfCapture}
            />
          ))}
        </div>
      ) : null}

      <div
        className={
          forPdfCapture ? "grid grid-cols-1 gap-6" : "grid grid-cols-1 gap-8 lg:grid-cols-12"
        }
      >
        <div
          data-pdf-break-anchor="areas-radar-chart"
          className={
            forPdfCapture ? "" : "lg:col-span-5 lg:sticky lg:top-24 lg:self-start"
          }
        >
          <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
            <div className="border-b border-gray-100 bg-gradient-to-r from-indigo-50/80 to-violet-50/50 px-5 py-4 dark:border-gray-700 dark:from-indigo-950/40 dark:to-violet-950/30">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm">
                  <ChartColumn className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-indigo-700 dark:text-indigo-300">
                    At a glance
                  </p>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Life areas radar
                  </h3>
                </div>
              </div>
            </div>
            <div className={`p-4 ${forPdfCapture ? "h-[250px]" : "h-80 md:h-96"}`}>
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
                      stroke="#6366f1"
                      fill="#8b5cf6"
                      fillOpacity={0.5}
                      strokeWidth={3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("analysis.noDataAvailable") || "No data available"}
                  </p>
                </div>
              )}
            </div>
          </article>
        </div>

        <div
          className={
            forPdfCapture
              ? "space-y-4"
              : "space-y-4 lg:col-span-7 lg:max-h-[720px] lg:overflow-y-auto lg:pr-1"
          }
        >
          {lifeAreaAnalysis.length > 0 ? (
            lifeAreaAnalysis.map((area, index) => (
              <LifeAreaCard
                key={area.area}
                area={area}
                description={getCombinedDescription(area)}
                expanded={Boolean(expandedAreas[area.area])}
                onToggle={() => toggleArea(area.area)}
                forPdfCapture={forPdfCapture}
                pdfPageBreakBefore={Boolean(
                  forPdfCapture &&
                    (index === 1 || index === lifeAreaAnalysis.length - 1)
                )}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <ChartColumn
                className="mx-auto mb-4 h-12 w-12 text-gray-400"
                aria-hidden="true"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("analysis.noAnalysisAvailable") || "No analysis available"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AreasOfLife;
