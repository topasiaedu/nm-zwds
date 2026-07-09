/**
 * Scrollable health guidance panel with in-view dot indicators.
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  HealthGuidanceTimeline,
  type HealthGuidanceTip,
} from "./HealthGuidanceTimeline";

const HEALTH_ACCENT = "#D91744";
const SCROLL_ACTIVATION_OFFSET_PX = 72;
const SCROLL_END_THRESHOLD_PX = 12;

const SCROLL_PANEL_CLASS = [
  "min-w-0 flex-1",
  "max-h-[min(32rem,72vh)] overflow-y-auto overscroll-contain",
  "pr-1 [-webkit-overflow-scrolling:touch]",
  "[scrollbar-width:thin] [scrollbar-color:rgba(107,91,149,0.35)_transparent]",
].join(" ");

type HealthGuidanceScrollPanelProps = {
  tips: readonly HealthGuidanceTip[];
  getTipIcon: (bodyPart: string, englishName?: string) => LucideIcon;
  getPreviewText: (description: string, expanded: boolean) => string;
  tipExceedsPreviewLimit: (description: string) => boolean;
  isTipExpanded: (index: number) => boolean;
  onToggleTip: (index: number) => void;
  /** Re-run scroll tracking when card heights change (e.g. expand/collapse). */
  layoutVersion?: string;
};

/**
 * Returns card elements sorted by index inside the scroll container.
 */
const getOrderedCardElements = (scrollRoot: HTMLElement): HTMLElement[] => {
  return Array.from(
    scrollRoot.querySelectorAll<HTMLElement>("[data-health-card-index]")
  ).sort((left, right) => {
    const leftIndex = Number(left.dataset.healthCardIndex ?? "0");
    const rightIndex = Number(right.dataset.healthCardIndex ?? "0");
    return leftIndex - rightIndex;
  });
};

/**
 * Picks the card aligned with the top focus line, or the last card near scroll end.
 */
const computeActiveCardIndex = (
  scrollRoot: HTMLElement,
  cardElements: HTMLElement[]
): number => {
  if (cardElements.length === 0) {
    return 0;
  }

  const { scrollTop, scrollHeight, clientHeight } = scrollRoot;
  const isAtBottom =
    scrollHeight - scrollTop - clientHeight <= SCROLL_END_THRESHOLD_PX;

  if (isAtBottom) {
    const lastCard = cardElements[cardElements.length - 1];
    const lastIndex = Number(lastCard.dataset.healthCardIndex ?? "0");
    return Number.isNaN(lastIndex) ? cardElements.length - 1 : lastIndex;
  }

  const activationLine =
    scrollRoot.getBoundingClientRect().top + SCROLL_ACTIVATION_OFFSET_PX;

  let activeIndex = Number(cardElements[0].dataset.healthCardIndex ?? "0");
  if (Number.isNaN(activeIndex)) {
    activeIndex = 0;
  }

  for (const card of cardElements) {
    const index = Number(card.dataset.healthCardIndex ?? "0");
    if (Number.isNaN(index)) {
      continue;
    }

    const { top, bottom } = card.getBoundingClientRect();

    if (top <= activationLine && bottom > activationLine) {
      return index;
    }

    if (top <= activationLine) {
      activeIndex = index;
    }
  }

  return activeIndex;
};

/**
 * Tracks the active guidance card from scroll position (stable on wide layouts).
 */
const useActiveScrollCardIndex = (
  scrollRootRef: React.RefObject<HTMLDivElement | null>,
  cardCount: number,
  layoutVersion: string
): number => {
  const [activeIndex, setActiveIndex] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const scrollRoot = scrollRootRef.current;
    if (!scrollRoot || cardCount <= 1) {
      setActiveIndex(0);
      return undefined;
    }

    const syncActiveIndex = (): void => {
      const cardElements = getOrderedCardElements(scrollRoot);
      if (cardElements.length === 0) {
        return;
      }

      const nextIndex = computeActiveCardIndex(scrollRoot, cardElements);
      setActiveIndex((previous) => (previous === nextIndex ? previous : nextIndex));
    };

    const scheduleSync = (): void => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        syncActiveIndex();
      });
    };

    scheduleSync();

    scrollRoot.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync);

    const resizeObserver = new ResizeObserver(scheduleSync);
    resizeObserver.observe(scrollRoot);
    getOrderedCardElements(scrollRoot).forEach((card) => resizeObserver.observe(card));

    return () => {
      scrollRoot.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      resizeObserver.disconnect();

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [scrollRootRef, cardCount, layoutVersion]);

  return activeIndex;
};

type ScrollDotIndicatorProps = {
  count: number;
  activeIndex: number;
  tips: readonly HealthGuidanceTip[];
  onSelect: (index: number) => void;
};

/**
 * Vertical dot rail in a dedicated left gutter beside the scroll panel.
 */
const ScrollDotIndicator: React.FC<ScrollDotIndicatorProps> = ({
  count,
  activeIndex,
  tips,
  onSelect,
}) => {
  if (count <= 1) {
    return null;
  }

  return (
    <div
      className="flex shrink-0 flex-col items-center justify-center gap-2 self-center rounded-full bg-white/70 px-1.5 py-3 shadow-sm backdrop-blur-sm dark:bg-surface-dark/70"
      role="tablist"
      aria-label="Health guidance cards"
    >
      {Array.from({ length: count }, (_, index) => {
        const isActive = index === activeIndex;
        const label = tips[index]?.englishName ?? tips[index]?.bodyPart ?? `Area ${index + 1}`;

        return (
          <button
            key={`health-scroll-dot-${index}`}
            type="button"
            className={[
              "rounded-full transition-all duration-300",
              isActive
                ? "h-2.5 w-2.5 shadow-sm"
                : "h-2 w-2 bg-brand-purple/25 hover:bg-brand-purple/45 dark:bg-accent-gold/25 dark:hover:bg-accent-gold/45",
            ].join(" ")}
            style={isActive ? { backgroundColor: HEALTH_ACCENT } : undefined}
            onClick={() => onSelect(index)}
            aria-label={`View ${label}`}
            aria-current={isActive ? "true" : undefined}
            role="tab"
          />
        );
      })}
    </div>
  );
};

/**
 * Scrollable guidance list with active-card dot indicators.
 */
export const HealthGuidanceScrollPanel: React.FC<HealthGuidanceScrollPanelProps> = ({
  tips,
  getTipIcon,
  getPreviewText,
  tipExceedsPreviewLimit,
  isTipExpanded,
  onToggleTip,
  layoutVersion = "",
}) => {
  const scrollRootRef = useRef<HTMLDivElement>(null);
  const activeIndex = useActiveScrollCardIndex(scrollRootRef, tips.length, layoutVersion);

  const scrollToCard = useCallback((index: number) => {
    const scrollRoot = scrollRootRef.current;
    if (!scrollRoot) {
      return;
    }

    const target = scrollRoot.querySelector<HTMLElement>(
      `[data-health-card-index="${index}"]`
    );

    if (!target) {
      return;
    }

    const rootTop = scrollRoot.getBoundingClientRect().top;
    const targetTop = target.getBoundingClientRect().top;
    const nextScrollTop =
      scrollRoot.scrollTop + (targetTop - rootTop) - SCROLL_ACTIVATION_OFFSET_PX + 12;

    scrollRoot.scrollTo({
      top: Math.max(0, nextScrollTop),
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="flex items-center gap-4">
      <ScrollDotIndicator
        count={tips.length}
        activeIndex={activeIndex}
        tips={tips}
        onSelect={scrollToCard}
      />

      <div
        ref={scrollRootRef}
        className={SCROLL_PANEL_CLASS}
        tabIndex={0}
        aria-label="Scrollable health guidance by body area"
      >
        <HealthGuidanceTimeline
          tips={tips}
          getTipIcon={getTipIcon}
          getPreviewText={getPreviewText}
          tipExceedsPreviewLimit={tipExceedsPreviewLimit}
          isTipExpanded={isTipExpanded}
          onToggleTip={onToggleTip}
        />
      </div>
    </div>
  );
};
