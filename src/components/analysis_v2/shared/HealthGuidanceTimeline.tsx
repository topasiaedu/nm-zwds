import React from "react";
import { ArrowRight, ChevronUp, Sparkles, type LucideIcon } from "lucide-react";
import { lightPanelClass } from "../../../styles/chartUi";

export type HealthGuidanceTip = {
  id: string;
  bodyPart: string;
  englishName: string;
  description: string;
};

type HealthGuidanceTimelineProps = {
  tips: readonly HealthGuidanceTip[];
  getTipIcon: (bodyPart: string, englishName?: string) => LucideIcon;
  getPreviewText: (description: string, expanded: boolean) => string;
  tipExceedsPreviewLimit: (description: string) => boolean;
  isTipExpanded: (index: number) => boolean;
  onToggleTip: (index: number) => void;
  forPdfCapture?: boolean;
  /** Registers each card element for scroll-position tracking. */
  registerCardRef?: (index: number, element: HTMLElement | null) => void;
};

const HEALTH_ACCENT = "#D91744";
const HEALTH_ICON_RING = "#FDE8E4";

type HealthTimelineItemProps = {
  tip: HealthGuidanceTip;
  tipIndex: number;
  isPrimary: boolean;
  getTipIcon: (bodyPart: string, englishName?: string) => LucideIcon;
  getPreviewText: (description: string, expanded: boolean) => string;
  tipExceedsPreviewLimit: (description: string) => boolean;
  isTipExpanded: (index: number) => boolean;
  onToggleTip: (index: number) => void;
  forPdfCapture?: boolean;
  registerCardRef?: (index: number, element: HTMLElement | null) => void;
};

/**
 * Single health guidance card — cream panel, icon badge, watermark, see-more CTA.
 */
const HealthTimelineItem: React.FC<HealthTimelineItemProps> = ({
  tip,
  tipIndex,
  isPrimary,
  getTipIcon,
  getPreviewText,
  tipExceedsPreviewLimit,
  isTipExpanded,
  onToggleTip,
  forPdfCapture,
  registerCardRef,
}) => {
  const TipIcon = getTipIcon(tip.bodyPart, tip.englishName);
  const expanded = isTipExpanded(tipIndex);
  const displayName = tip.englishName || tip.bodyPart;
  const showToggle = !forPdfCapture && tipExceedsPreviewLimit(tip.description);
  const hoverClass = forPdfCapture
    ? ""
    : "transition-shadow duration-300 hover:shadow-md";

  return (
    <li className="list-none">
      <article
        ref={(element) => registerCardRef?.(tipIndex, element)}
        data-health-card-index={tipIndex}
        className={`relative overflow-hidden rounded-2xl border border-[#F0E4DC] bg-[#FFF8F4] shadow-sm ${lightPanelClass} ${hoverClass}`}
      >
        <div
          className="pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 opacity-[0.07]"
          aria-hidden="true"
        >
          <TipIcon className="h-36 w-36 sm:h-44 sm:w-44" style={{ color: HEALTH_ACCENT }} />
        </div>

        <div className="relative flex items-start gap-5 p-5 sm:gap-6 sm:p-6">
          <div className="relative shrink-0">
            <Sparkles
              className="pointer-events-none absolute -left-1.5 -top-1 h-3 w-3 text-[#F5B942]"
              aria-hidden="true"
            />
            <Sparkles
              className="pointer-events-none absolute -bottom-0.5 -right-1 h-2.5 w-2.5 text-[#F5B942]/80"
              aria-hidden="true"
            />
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full sm:h-[4.5rem] sm:w-[4.5rem]"
              style={{ backgroundColor: HEALTH_ICON_RING }}
            >
              <TipIcon
                className="h-8 w-8 sm:h-9 sm:w-9"
                style={{ color: HEALTH_ACCENT }}
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="min-w-0 flex-1 pr-2 sm:pr-4">
            {isPrimary ? (
              <p
                className="text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: `${HEALTH_ACCENT}CC` }}
              >
                Primary Focus
              </p>
            ) : null}

            <h4 className="mt-0.5 font-serif text-xl font-bold uppercase tracking-wide text-navy sm:text-2xl">
              {displayName}
            </h4>

            <p className="mt-3 text-sm leading-relaxed text-theme-fg-secondary sm:text-[15px]">
              {getPreviewText(tip.description, expanded)}
            </p>

            {showToggle ? (
              <button
                type="button"
                onClick={() => onToggleTip(tipIndex)}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] transition-opacity hover:opacity-80"
                style={{ color: HEALTH_ACCENT }}
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
        </div>
      </article>
    </li>
  );
};

type HealthTimelineColumnProps = {
  tips: readonly HealthGuidanceTip[];
  startIndex: number;
  getTipIcon: (bodyPart: string, englishName?: string) => LucideIcon;
  getPreviewText: (description: string, expanded: boolean) => string;
  tipExceedsPreviewLimit: (description: string) => boolean;
  isTipExpanded: (index: number) => boolean;
  onToggleTip: (index: number) => void;
  forPdfCapture?: boolean;
  registerCardRef?: (index: number, element: HTMLElement | null) => void;
};

/**
 * Vertical stack of health guidance cards.
 */
const HealthTimelineColumn: React.FC<HealthTimelineColumnProps> = ({
  tips,
  startIndex,
  getTipIcon,
  getPreviewText,
  tipExceedsPreviewLimit,
  isTipExpanded,
  onToggleTip,
  forPdfCapture,
  registerCardRef,
}) => {
  if (tips.length === 0) {
    return null;
  }

  return (
    <ol className="m-0 flex list-none flex-col gap-5 p-0">
      {tips.map((tip, columnIndex) => {
        const tipIndex = startIndex + columnIndex;
        return (
          <HealthTimelineItem
            key={tip.id}
            tip={tip}
            tipIndex={tipIndex}
            isPrimary={tipIndex === 0}
            getTipIcon={getTipIcon}
            getPreviewText={getPreviewText}
            tipExceedsPreviewLimit={tipExceedsPreviewLimit}
            isTipExpanded={isTipExpanded}
            onToggleTip={onToggleTip}
            forPdfCapture={forPdfCapture}
            registerCardRef={registerCardRef}
          />
        );
      })}
    </ol>
  );
};

/**
 * Vertical stack of health guidance cards — single column for scrollable panels.
 */
export const HealthGuidanceTimeline: React.FC<HealthGuidanceTimelineProps> = ({
  tips,
  getTipIcon,
  getPreviewText,
  tipExceedsPreviewLimit,
  isTipExpanded,
  onToggleTip,
  forPdfCapture,
  registerCardRef,
}) => {
  if (tips.length === 0) {
    return null;
  }

  return (
    <section aria-label="Health guidance by body area">
      <HealthTimelineColumn
        tips={tips}
        startIndex={0}
        getTipIcon={getTipIcon}
        getPreviewText={getPreviewText}
        tipExceedsPreviewLimit={tipExceedsPreviewLimit}
        isTipExpanded={isTipExpanded}
        onToggleTip={onToggleTip}
        forPdfCapture={forPdfCapture}
        registerCardRef={registerCardRef}
      />
    </section>
  );
};
