/**
 * AreasOfLife — Destiny Scoreboard (Section 06)
 *
 * Editorial pillar pills + radar overview + per-pillar flat reading panels.
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Briefcase,
  ChartColumn,
  ChevronDown,
  ChevronRight,
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
  type ChartDataType,
  type LifeAreaResult,
} from "../../utils/zwds/analysis";
import { BrandGradientText } from "../BrandGradientText";
import { analysisPanelTitleClass } from "../../styles/typographyUi";
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

/** Per-pillar semantic accent — left border + pill tint. */
const AREA_ACCENTS: Record<string, { accent: string; watermark: string }> = {
  "财帛": { accent: "#d97706", watermark: "财" },
  "官禄": { accent: "#2563eb", watermark: "禄" },
  "疾厄": { accent: "#e11d48", watermark: "厄" },
  "夫妻": { accent: "#db2777", watermark: "缘" },
  "交友": { accent: "#7c3aed", watermark: "友" },
};

const DEFAULT_AREA_ACCENT = { accent: "#6B5B95", watermark: "★" };

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
 * Flat editorial pillar pill — bordered, accent on active / top pillar.
 */
const ScorePillarPill: React.FC<ScorePillarPillProps> = ({
  area,
  isActive,
  isTopPillar,
  onSelect,
  forPdfCapture,
}) => {
  const { accent } = AREA_ACCENTS[area.area] ?? DEFAULT_AREA_ACCENT;
  const Icon = LIFE_AREA_ICONS[area.icon];
  const hoverClass = forPdfCapture ? "" : "group cursor-pointer transition-all duration-200";

  return (
    <button
      type="button"
      role="tab"
      onClick={onSelect}
      disabled={forPdfCapture}
      aria-selected={isActive}
      aria-label={`${area.displayName}, ${area.score}% — ${isActive ? "currently viewing" : "view reading"}`}
      className={[
        "relative flex min-w-[9.5rem] flex-1 flex-col border-l-4 py-3 pl-4 pr-3 text-left sm:min-w-[10.5rem]",
        hoverClass,
        isActive
          ? "border-y border-r border-theme-border bg-surface-cream/80 shadow-sm dark:bg-surface-dark/60"
          : "border-y border-r border-transparent bg-transparent opacity-80 hover:border-theme-border/70 hover:bg-surface-cream/50 hover:opacity-100 hover:shadow-sm dark:hover:bg-surface-dark/40",
      ].join(" ")}
      style={{ borderLeftColor: accent }}
    >
      {isActive && !forPdfCapture ? (
        <span
          className="absolute bottom-0 left-0 right-0 h-0.5"
          style={{ backgroundColor: accent }}
          aria-hidden="true"
        />
      ) : null}
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {Icon ? (
            <Icon
              className="h-3.5 w-3.5 shrink-0"
              style={{ color: accent }}
              aria-hidden="true"
            />
          ) : (
            <span className="text-sm" role="img" aria-label={area.displayName}>
              {area.icon}
            </span>
          )}
          <BrandGradientText
            as="span"
            className="truncate text-[10px] font-bold uppercase tracking-[0.18em] sm:text-xs"
          >
            {area.displayName}
          </BrandGradientText>
        </div>
        {!forPdfCapture ? (
          <ChevronRight
            className={[
              "mt-0.5 h-3.5 w-3.5 shrink-0 transition-colors",
              isActive
                ? "text-brand-purple dark:text-accent-gold"
                : "text-theme-fg-secondary/40 group-hover:text-brand-purple dark:group-hover:text-accent-gold",
            ].join(" ")}
            aria-hidden="true"
          />
        ) : null}
      </div>
      <p
        className="mt-1.5 font-serif text-2xl font-black tabular-nums leading-none"
        style={{ color: isActive || isTopPillar ? accent : undefined }}
      >
        <span className={isActive || isTopPillar ? "" : "text-theme-fg"}>
          {area.score}
        </span>
        <span className="ml-0.5 text-sm font-semibold text-theme-fg-secondary">%</span>
      </p>
      {!forPdfCapture ? (
        <p
          className={[
            "mt-1.5 text-[9px] font-bold uppercase tracking-[0.16em]",
            isActive
              ? "text-brand-purple dark:text-accent-gold"
              : "text-theme-fg-secondary/60 group-hover:text-theme-fg-secondary",
          ].join(" ")}
        >
          {isActive ? "Now viewing" : "Tap to explore"}
        </p>
      ) : null}
    </button>
  );
};

type LifeAreaPanelProps = {
  area: LifeAreaResult;
  description: string;
  expanded: boolean;
  onToggle: () => void;
  forPdfCapture?: boolean;
  pdfPageBreakBefore?: boolean;
};

/**
 * Flat editorial reading panel — left accent border + watermark (FourKeyPalace pattern).
 */
const LifeAreaPanel: React.FC<LifeAreaPanelProps> = ({
  area,
  description,
  expanded,
  onToggle,
  forPdfCapture,
  pdfPageBreakBefore,
}) => {
  const { accent, watermark } = AREA_ACCENTS[area.area] ?? DEFAULT_AREA_ACCENT;
  const Icon = LIFE_AREA_ICONS[area.icon];
  const isExpanded = Boolean(forPdfCapture || expanded);
  const showReadMore = !forPdfCapture && areaExceedsPreviewLimit(description);

  return (
    <article
      data-pdf-break-anchor={`area-card-${area.area}`}
      {...(pdfPageBreakBefore ? { "data-pdf-page-break-before": "" } : {})}
      className="relative py-4 pr-4 sm:pr-5"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-1 select-none font-serif text-[88px] font-black leading-none sm:text-[100px]"
        style={{
          color: accent,
          opacity: 0.07,
          lineHeight: 1,
        }}
      >
        {watermark}
      </div>

      <div className="relative z-10">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-accent-gold/60 bg-navy shadow-sm dark:bg-navy">
              {Icon ? (
                <Icon
                  className="h-6 w-6 text-accent-goldDark dark:text-accent-gold"
                  aria-hidden="true"
                />
              ) : (
                <span className="text-lg" role="img" aria-label={area.displayName}>
                  {area.icon}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-theme-fg-secondary">
                Destiny pillar
              </p>
              <BrandGradientText
                as="h4"
                className={`mt-1 ${analysisPanelTitleClass}`}
              >
                {area.displayName}
              </BrandGradientText>
              <p className="mt-1 text-xs text-theme-fg-secondary">
                {area.stars.length} star{area.stars.length === 1 ? "" : "s"} influencing this pillar
              </p>
            </div>
          </div>
          <span
            className="shrink-0 rounded-full border px-3 py-1 font-serif text-lg font-black tabular-nums"
            style={{
              borderColor: accent,
              color: accent,
              backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)`,
            }}
          >
            {area.score}%
          </span>
        </div>

        {description ? (
          <div className="mt-5 border-t border-theme-border/60 pt-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-theme-fg-secondary">
              Reading
            </p>
            <p className="mt-3 font-serif text-sm leading-relaxed text-theme-fg-secondary sm:text-base">
              {getPreviewAreaText(description, isExpanded)}
            </p>
            {showReadMore ? (
              <button
                type="button"
                onClick={onToggle}
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-purple transition-colors hover:text-brand-purpleDeep dark:text-accent-gold dark:hover:text-accent-goldDark"
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
        {!forPdfCapture ? (
          <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-theme-fg-secondary sm:text-left">
            Select a pillar to explore its reading
          </p>
        ) : null}
        <div
          className={[
            "flex gap-0 border-b border-theme-border/50",
            forPdfCapture ? "flex-wrap" : "flex-wrap sm:flex-nowrap",
          ].join(" ")}
          role="tablist"
          aria-label="Destiny pillars"
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
