import React from "react";
import { Lightbulb, Sparkles } from "lucide-react";
import { renderGrowthTipTextWithHighlights } from "./personalityTextHighlight";
import { lightPanelClass } from "../../../styles/chartUi";

export type GrowthTipItem = {
  id: string;
  label: string;
};

type GrowthTipsTimelineProps = {
  tips: readonly GrowthTipItem[];
  forPdfCapture?: boolean;
};

type GrowthStepTheme = {
  accent: string;
  cardBg: string;
};

const GROWTH_STEP_THEMES: GrowthStepTheme[] = [
  { accent: "#6B5B95", cardBg: "#F3EFF8" },
  { accent: "#D97706", cardBg: "#FFF8F0" },
  { accent: "#7B5FC4", cardBg: "#EDE8F5" },
  { accent: "#2D7A4D", cardBg: "#F3FAF6" },
];

/** Fixed chart height: all bars share this baseline. */
const CHART_BAR_AREA_HEIGHT_PX = 128;

const COLUMN_CLASS =
  "min-w-[8.75rem] max-w-[12.5rem] flex-1 snap-center sm:min-w-[9.5rem]";

const getGrowthStepTheme = (index: number): GrowthStepTheme =>
  GROWTH_STEP_THEMES[index % GROWTH_STEP_THEMES.length];

const getBarHeightPx = (index: number, total: number): number => {
  if (total <= 1) {
    return CHART_BAR_AREA_HEIGHT_PX;
  }
  const minRatio = 0.38;
  const maxRatio = 1;
  const progress = index / (total - 1);
  const ratio = minRatio + progress * (maxRatio - minRatio);
  return Math.round(CHART_BAR_AREA_HEIGHT_PX * ratio);
};

type GrowthInsightCardProps = {
  label: string;
  stepNumber: string;
  theme: GrowthStepTheme;
};

/**
 * Insight copy shown above the bar chart.
 */
const GrowthInsightCard: React.FC<GrowthInsightCardProps> = ({
  label,
  stepNumber,
  theme,
}) => {
  const cardStyle = {
    "--growth-accent": theme.accent,
    "--growth-card-bg": theme.cardBg,
    "--growth-card-border": `${theme.accent}22`,
  } as React.CSSProperties;

  return (
    <article
      className={[
        "h-full w-full rounded-xl border p-3 shadow-sm sm:p-4",
        lightPanelClass,
        "[background-color:var(--growth-card-bg)] [border-color:var(--growth-card-border)]",
      ].join(" ")}
      style={cardStyle}
    >
      <div className="flex items-center gap-1.5">
        <Lightbulb
          className="h-3.5 w-3.5 shrink-0 [color:var(--growth-accent)]"
          aria-hidden="true"
        />
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] [color:var(--growth-accent)] sm:text-[10px]">
          Growth insight {stepNumber}
        </p>
      </div>
      <p className="mt-2 font-serif text-xs leading-relaxed text-theme-fg-secondary sm:text-sm">
        {renderGrowthTipTextWithHighlights(label)}
      </p>
    </article>
  );
};

/**
 * Editorial section header for the growth path timeline.
 */
const GrowthPathHeader: React.FC = () => (
  <div className="mb-8 border-l-4 border-brand-purple pl-4">
    <h3 className="font-serif text-xl font-bold text-navy sm:text-2xl">
      Your Growth Path
    </h3>
    <p className="mt-2 text-sm text-theme-fg-secondary sm:text-base">
      Chart-guided steps to lean into your strengths and navigate your edges with intention.
    </p>
  </div>
);

type GrowthBarChartProps = {
  tips: readonly GrowthTipItem[];
  forPdfCapture?: boolean;
};

/**
 * Bar chart with a single shared baseline: cards sit in a row above the bars.
 */
const GrowthBarChart: React.FC<GrowthBarChartProps> = ({ tips, forPdfCapture }) => {
  if (forPdfCapture) {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
        {tips.map((tip, index) => {
          const stepNumber = String(index + 1).padStart(2, "0");
          const theme = getGrowthStepTheme(index);
          const barHeightPx = getBarHeightPx(index, tips.length);

          return (
            <div key={tip.id} className="flex flex-col">
              <GrowthInsightCard label={tip.label} stepNumber={stepNumber} theme={theme} />
              <div
                className="mt-4 flex items-end border-b border-theme-border-subtle"
                style={{ height: `${CHART_BAR_AREA_HEIGHT_PX}px` }}
              >
                <div
                  className="mx-auto w-full max-w-[3.25rem] rounded-t-lg shadow-sm"
                  style={{
                    height: `${barHeightPx}px`,
                    background: `linear-gradient(to top, ${theme.accent}, ${theme.accent}CC)`,
                  }}
                  aria-hidden="true"
                />
              </div>
              <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-theme-fg-secondary">
                Step {stepNumber}
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={[
        "overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:thin]",
        "snap-x snap-mandatory",
      ].join(" ")}
    >
      <div className="inline-flex min-w-full flex-col gap-4 sm:min-w-0">
        {/* Insight cards: variable height, does not affect bar baseline */}
        <div className="flex items-stretch gap-3 sm:justify-center sm:gap-4 md:gap-5">
          {tips.map((tip, index) => {
            const stepNumber = String(index + 1).padStart(2, "0");
            const theme = getGrowthStepTheme(index);

            return (
              <div key={`card-${tip.id}`} className={COLUMN_CLASS}>
                <GrowthInsightCard
                  label={tip.label}
                  stepNumber={stepNumber}
                  theme={theme}
                />
              </div>
            );
          })}
        </div>

        {/* Bars: one shared row, all anchored to the bottom edge */}
        <div
          className="flex items-end gap-3 border-b-2 border-theme-border-subtle sm:justify-center sm:gap-4 md:gap-5"
          style={{ height: `${CHART_BAR_AREA_HEIGHT_PX}px` }}
          role="img"
          aria-label="Growth path bar chart"
        >
          {tips.map((tip, index) => {
            const theme = getGrowthStepTheme(index);
            const barHeightPx = getBarHeightPx(index, tips.length);

            return (
              <div
                key={`bar-${tip.id}`}
                className={`${COLUMN_CLASS} flex justify-center`}
              >
                <div
                  className="w-full max-w-[3.25rem] rounded-t-lg shadow-sm sm:max-w-[3.75rem]"
                  style={{
                    height: `${barHeightPx}px`,
                    background: `linear-gradient(to top, ${theme.accent}, ${theme.accent}CC)`,
                  }}
                  aria-hidden="true"
                />
              </div>
            );
          })}
        </div>

        {/* Step labels: aligned under each bar */}
        <div className="flex gap-3 sm:justify-center sm:gap-4 md:gap-5">
          {tips.map((tip, index) => {
            const stepNumber = String(index + 1).padStart(2, "0");

            return (
              <p
                key={`label-${tip.id}`}
                className={`${COLUMN_CLASS} text-center text-[10px] font-bold uppercase tracking-[0.16em] text-theme-fg-secondary sm:text-xs`}
              >
                Step {stepNumber}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/**
 * Ascending bar chart: insight cards above, bars sharing one baseline.
 */
export const GrowthTipsTimeline: React.FC<GrowthTipsTimelineProps> = ({
  tips,
  forPdfCapture,
}) => {
  if (tips.length === 0) {
    return (
      <p className="text-center text-sm text-theme-fg-secondary">
        No tip data available
      </p>
    );
  }

  return (
    <section aria-label="Growth tips timeline">
      <GrowthPathHeader />

      <div className="relative mx-auto max-w-6xl">
        <Sparkles
          className="pointer-events-none absolute right-2 top-2 h-4 w-4 text-[var(--color-accent-gradient-5)]/45"
          aria-hidden="true"
        />

        <div
          className={[
            "rounded-2xl border border-theme-border-subtle bg-white/60 px-3 pb-5 pt-4",
            lightPanelClass,
            "sm:px-6 sm:pb-6 sm:pt-5",
          ].join(" ")}
        >
          <GrowthBarChart tips={tips} forPdfCapture={forPdfCapture} />
        </div>
      </div>
    </section>
  );
};
