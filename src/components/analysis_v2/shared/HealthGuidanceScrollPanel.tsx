/**
 * Scrollable health guidance panel (focus-area cards).
 */

import React from "react";
import type { LucideIcon } from "lucide-react";
import {
  HealthGuidanceTimeline,
  type HealthGuidanceTip,
} from "./HealthGuidanceTimeline";

const SCROLL_PANEL_CLASS = [
  "min-w-0 w-full",
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
};

/**
 * Scrollable guidance list without side pagination indicators.
 */
export const HealthGuidanceScrollPanel: React.FC<HealthGuidanceScrollPanelProps> = ({
  tips,
  getTipIcon,
  getPreviewText,
  tipExceedsPreviewLimit,
  isTipExpanded,
  onToggleTip,
}) => {
  return (
    <div
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
  );
};
