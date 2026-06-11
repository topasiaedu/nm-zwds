import React from "react";
import { ChevronDown, ChevronUp, type LucideIcon } from "lucide-react";
import { BrandGradientText } from "../../BrandGradientText";
import { analysisCardTitleClass } from "../../../styles/typographyUi";
import { secondaryBrandGradientBgClass } from "../../../styles/typographyUi";

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
};

type HealthTimelineItemProps = {
  tip: HealthGuidanceTip;
  tipIndex: number;
  isPrimary: boolean;
  isLast: boolean;
  getTipIcon: (bodyPart: string, englishName?: string) => LucideIcon;
  getPreviewText: (description: string, expanded: boolean) => string;
  tipExceedsPreviewLimit: (description: string) => boolean;
  isTipExpanded: (index: number) => boolean;
  onToggleTip: (index: number) => void;
  forPdfCapture?: boolean;
};

/**
 * Single timeline row — flat on page surface, optional primary emphasis on first item.
 */
const HealthTimelineItem: React.FC<HealthTimelineItemProps> = ({
  tip,
  tipIndex,
  isPrimary,
  isLast,
  getTipIcon,
  getPreviewText,
  tipExceedsPreviewLimit,
  isTipExpanded,
  onToggleTip,
  forPdfCapture,
}) => {
  const TipIcon = getTipIcon(tip.bodyPart, tip.englishName);
  const expanded = isTipExpanded(tipIndex);

  return (
    <li className={`relative pl-10 ${isLast ? "pb-0" : "pb-10"}`}>
      <span
        className={`absolute left-[9px] top-1.5 z-10 h-3.5 w-3.5 rounded-full ring-4 ring-surface-cream dark:ring-surface-dark ${secondaryBrandGradientBgClass}`}
        aria-hidden="true"
      />

      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-accent-gold/60 bg-navy shadow-sm dark:bg-navy">
          <TipIcon
            className="h-4 w-4 text-accent-goldDark dark:text-accent-gold"
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-theme-fg-secondary">
            {isPrimary ? "Primary focus" : "Body area"}
          </p>
          {isPrimary ? (
            <BrandGradientText
              as="h4"
              className={`mt-0.5 ${analysisCardTitleClass}`}
            >
              {tip.englishName || tip.bodyPart}
            </BrandGradientText>
          ) : (
            <h4 className={`mt-0.5 ${analysisCardTitleClass} text-theme-fg`}>
              {tip.englishName || tip.bodyPart}
            </h4>
          )}
          <p className="mt-2 text-sm leading-relaxed text-theme-fg-secondary">
            {getPreviewText(tip.description, expanded)}
          </p>

          {!forPdfCapture && tipExceedsPreviewLimit(tip.description) ? (
            <button
              type="button"
              onClick={() => onToggleTip(tipIndex)}
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-purple transition-colors hover:text-brand-purple-deep dark:text-accent-gold dark:hover:text-accent-goldDark"
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
      </div>
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
};

/**
 * One vertical timeline column with spine.
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
}) => {
  if (tips.length === 0) {
    return null;
  }

  return (
    <ol className="relative list-none space-y-0 p-0">
      <div
        className="absolute bottom-2 left-[15px] top-2 w-px bg-theme-border-subtle"
        aria-hidden="true"
      />
      {tips.map((tip, columnIndex) => {
        const tipIndex = startIndex + columnIndex;
        return (
          <HealthTimelineItem
            key={tip.id}
            tip={tip}
            tipIndex={tipIndex}
            isPrimary={tipIndex === 0}
            isLast={columnIndex === tips.length - 1}
            getTipIcon={getTipIcon}
            getPreviewText={getPreviewText}
            tipExceedsPreviewLimit={tipExceedsPreviewLimit}
            isTipExpanded={isTipExpanded}
            onToggleTip={onToggleTip}
            forPdfCapture={forPdfCapture}
          />
        );
      })}
    </ol>
  );
};

/**
 * Health guidance timelines — single column on narrow viewports, two columns on md+.
 */
export const HealthGuidanceTimeline: React.FC<HealthGuidanceTimelineProps> = ({
  tips,
  getTipIcon,
  getPreviewText,
  tipExceedsPreviewLimit,
  isTipExpanded,
  onToggleTip,
  forPdfCapture,
}) => {
  if (tips.length === 0) {
    return null;
  }

  const splitIndex = Math.ceil(tips.length / 2);
  const leftTips = tips.slice(0, splitIndex);
  const rightTips = tips.slice(splitIndex);

  const columnProps = {
    getTipIcon,
    getPreviewText,
    tipExceedsPreviewLimit,
    isTipExpanded,
    onToggleTip,
    forPdfCapture,
  };

  const useTwoColumns = tips.length > 1;

  return (
    <section aria-label="Health guidance by body area">
      {useTwoColumns ? (
        <div
          className={
            forPdfCapture
              ? "grid grid-cols-2 gap-8"
              : "grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8"
          }
        >
          <HealthTimelineColumn tips={leftTips} startIndex={0} {...columnProps} />
          <HealthTimelineColumn tips={rightTips} startIndex={splitIndex} {...columnProps} />
        </div>
      ) : (
        <HealthTimelineColumn tips={tips} startIndex={0} {...columnProps} />
      )}
    </section>
  );
};
