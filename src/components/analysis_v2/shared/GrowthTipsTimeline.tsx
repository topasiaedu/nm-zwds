import React from "react";
import { Sparkles } from "lucide-react";
import { renderGrowthTipTextWithHighlights } from "./personalityTextHighlight";
import { PptHighlightGroupHeader } from "./PptHighlightCards";

export type GrowthTipItem = {
  id: string;
  label: string;
};

type GrowthTipsTimelineProps = {
  tips: readonly GrowthTipItem[];
  forPdfCapture?: boolean;
};

type TimelineStepPillProps = {
  stepNumber: string;
};

/** Navy circle pill with gold border and step number — matches NoblemanLifeAreaRow. */
const navyGoldCircleClass =
  "border-2 border-accent-gold/60 bg-navy shadow-sm dark:bg-navy";

/**
 * Step marker pill — navy background, gold border, gold number text.
 */
const TimelineStepPill: React.FC<TimelineStepPillProps> = ({ stepNumber }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold tracking-wide text-accent-goldDark dark:text-accent-gold ${navyGoldCircleClass}`}
    >
      {stepNumber}
    </span>
  );
};

type TimelineTipContentProps = {
  label: string;
  align?: "left" | "right";
  className?: string;
};

/**
 * Flat tip copy on the page surface — no card background.
 */
const TimelineTipContent: React.FC<TimelineTipContentProps> = ({
  label,
  align,
  className = "",
}) => {
  const alignmentClass =
    align === "right"
      ? "md:text-right md:pr-2"
      : align === "left"
        ? "md:text-left md:pl-2"
        : "";

  return (
    <p
      className={`max-w-md font-serif text-sm leading-relaxed text-theme-fg sm:text-base ${alignmentClass} ${className}`.trim()}
    >
      {renderGrowthTipTextWithHighlights(label)}
    </p>
  );
};

/**
 * Alternating vertical timeline for growth tips — flat on page background.
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

  const timelineLayoutClass = forPdfCapture
    ? "space-y-8"
    : "space-y-0";

  return (
    <section aria-label="Growth tips timeline">
      <PptHighlightGroupHeader
        variant="brand"
        beforeText="Your"
        emphasisText="growth path"
      />

      <div className="relative mx-auto max-w-4xl">
        <div
          className="absolute bottom-0 left-4 top-0 w-px bg-theme-border-subtle md:left-1/2 md:-translate-x-1/2"
          aria-hidden="true"
        />

        <ol className={`relative ${timelineLayoutClass}`}>
          {tips.map((tip, index) => {
            const isContentLeft = index % 2 === 0;
            const stepNumber = String(index + 1).padStart(2, "0");
            const isLast = index === tips.length - 1;

            return (
              <li
                key={tip.id}
                className={`relative ${isLast ? "pb-0" : "pb-12"}`}
              >
                {/* Mobile — single column with left spine */}
                <div className="flex gap-4 pl-10 md:hidden">
                  <span
                    className={`absolute left-[11px] top-2 h-3.5 w-3.5 rounded-full ring-4 ring-surface-cream dark:ring-surface-dark ${navyGoldCircleClass}`}
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <TimelineStepPill stepNumber={stepNumber} />
                    <TimelineTipContent label={tip.label} className="mt-3" />
                  </div>
                </div>

                {/* Desktop — alternating two-column layout around center spine */}
                <div className="hidden md:grid md:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] md:items-center md:gap-8">
                  <div
                    className={
                      isContentLeft
                        ? "col-start-1 flex justify-end"
                        : "col-start-1 flex justify-end"
                    }
                  >
                    {isContentLeft ? (
                      <TimelineTipContent label={tip.label} align="right" />
                    ) : (
                      <TimelineStepPill stepNumber={stepNumber} />
                    )}
                  </div>

                  <div className="col-start-2 flex justify-center">
                    <span
                      className={`z-10 h-4 w-4 shrink-0 rounded-full ring-4 ring-surface-cream dark:ring-surface-dark ${navyGoldCircleClass}`}
                      aria-hidden="true"
                    />
                  </div>

                  <div
                    className={
                      isContentLeft
                        ? "col-start-3 flex justify-start"
                        : "col-start-3 flex justify-start"
                    }
                  >
                    {isContentLeft ? (
                      <TimelineStepPill stepNumber={stepNumber} />
                    ) : (
                      <TimelineTipContent label={tip.label} align="left" />
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <Sparkles
          className="pointer-events-none absolute bottom-4 right-0 h-4 w-4 text-accent-gold/40"
          aria-hidden="true"
        />
      </div>
    </section>
  );
};
