import React from "react";
import { Lightbulb, Sparkles } from "lucide-react";
import { renderGrowthTipTextWithHighlights } from "./personalityTextHighlight";

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

const getGrowthStepTheme = (index: number): GrowthStepTheme =>
  GROWTH_STEP_THEMES[index % GROWTH_STEP_THEMES.length];

type TimelineStepBadgeProps = {
  stepNumber: string;
  accent: string;
};

/**
 * Circular step marker shown beside each timeline card.
 */
const TimelineStepBadge: React.FC<TimelineStepBadgeProps> = ({ stepNumber, accent }) => (
  <span
    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
    style={{ backgroundColor: accent }}
    aria-hidden="true"
  >
    {stepNumber}
  </span>
);

type TimelineTipCardProps = {
  label: string;
  stepNumber: string;
  theme: GrowthStepTheme;
  align?: "left" | "right";
};

/**
 * Themed insight card for a single growth tip.
 */
const TimelineTipCard: React.FC<TimelineTipCardProps> = ({
  label,
  stepNumber,
  theme,
  align,
}) => {
  const alignmentClass =
    align === "right" ? "md:ml-auto md:text-right" : align === "left" ? "md:mr-auto" : "";

  return (
    <article
      className={`max-w-md rounded-2xl border p-4 shadow-sm sm:p-5 ${alignmentClass}`}
      style={{
        borderColor: `${theme.accent}22`,
        backgroundColor: theme.cardBg,
      }}
    >
      <div
        className={`flex items-center gap-2 ${align === "right" ? "md:justify-end" : ""}`}
      >
        <Lightbulb
          className="h-4 w-4 shrink-0"
          style={{ color: theme.accent }}
          aria-hidden="true"
        />
        <p
          className="text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color: theme.accent }}
        >
          Growth insight {stepNumber}
        </p>
      </div>

      <p className="mt-3 font-serif text-sm leading-relaxed text-theme-fg-secondary sm:text-[15px]">
        {renderGrowthTipTextWithHighlights(label)}
      </p>
    </article>
  );
};

/**
 * Editorial section header for the growth path timeline.
 */
const GrowthPathHeader: React.FC = () => (
  <div className="mb-8 border-l-4 border-brand-purple pl-4 dark:border-accent-goldDark/70">
    <h3 className="font-serif text-xl font-bold text-navy dark:text-cream sm:text-2xl">
      Your Growth Path
    </h3>
    <p className="mt-2 text-sm text-theme-fg-secondary sm:text-base">
      Chart-guided steps to lean into your strengths and navigate your edges with intention.
    </p>
  </div>
);

/**
 * Alternating vertical timeline for growth tips — themed cards on a center spine.
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

  const timelineLayoutClass = forPdfCapture ? "space-y-8" : "space-y-0";

  return (
    <section aria-label="Growth tips timeline">
      <GrowthPathHeader />

      <div className="relative mx-auto max-w-4xl">
        <div
          className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-brand-purple/35 via-brand-purple/15 to-transparent md:left-1/2 md:-translate-x-1/2"
          aria-hidden="true"
        />

        <ol className={`relative ${timelineLayoutClass}`}>
          {tips.map((tip, index) => {
            const isContentLeft = index % 2 === 0;
            const stepNumber = String(index + 1).padStart(2, "0");
            const isLast = index === tips.length - 1;
            const theme = getGrowthStepTheme(index);

            return (
              <li
                key={tip.id}
                className={`relative ${isLast ? "pb-0" : "pb-12"}`}
              >
                {/* Mobile — single column with left spine */}
                <div className="flex gap-4 pl-10 md:hidden">
                  <span
                    className="absolute left-[11px] top-5 h-3.5 w-3.5 rounded-full ring-4 ring-surface-cream dark:ring-surface-dark"
                    style={{ backgroundColor: theme.accent }}
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex items-center gap-3">
                      <TimelineStepBadge stepNumber={stepNumber} accent={theme.accent} />
                    </div>
                    <TimelineTipCard
                      label={tip.label}
                      stepNumber={stepNumber}
                      theme={theme}
                    />
                  </div>
                </div>

                {/* Desktop — alternating two-column layout around center spine */}
                <div className="hidden md:grid md:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] md:items-center md:gap-8">
                  <div className="col-start-1 flex justify-end">
                    {isContentLeft ? (
                      <TimelineTipCard
                        label={tip.label}
                        stepNumber={stepNumber}
                        theme={theme}
                        align="right"
                      />
                    ) : (
                      <TimelineStepBadge stepNumber={stepNumber} accent={theme.accent} />
                    )}
                  </div>

                  <div className="col-start-2 flex justify-center">
                    <span
                      className="z-10 h-4 w-4 shrink-0 rounded-full ring-4 ring-surface-cream dark:ring-surface-dark"
                      style={{ backgroundColor: theme.accent }}
                      aria-hidden="true"
                    />
                  </div>

                  <div className="col-start-3 flex justify-start">
                    {isContentLeft ? (
                      <TimelineStepBadge stepNumber={stepNumber} accent={theme.accent} />
                    ) : (
                      <TimelineTipCard
                        label={tip.label}
                        stepNumber={stepNumber}
                        theme={theme}
                        align="left"
                      />
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <Sparkles
          className="pointer-events-none absolute bottom-4 right-0 h-4 w-4 text-[var(--color-accent-gradient-5)]/50"
          aria-hidden="true"
        />
      </div>
    </section>
  );
};
