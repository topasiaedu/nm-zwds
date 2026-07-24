/**
 * Speech-bubble style script cards for Exact Words chapter.
 */

import React from "react";
import type { MonthScript } from "../../../utils/forecast/monthlyConsultation";
import { C } from "../../alignment-advantage/shared/constants";

export interface SpeechBubbleCardProps {
  script: MonthScript;
  index: number;
}

/**
 * Infer a short scenario chip from the situation string.
 */
const scenarioChip = (situation: string, index: number): string => {
  const lower = situation.toLowerCase();
  if (lower.includes("work") || lower.includes("boss") || lower.includes("career")) {
    return "At work";
  }
  if (
    lower.includes("partner")
    || lower.includes("relationship")
    || lower.includes("people")
    || lower.includes("friend")
  ) {
    return "People";
  }
  if (lower.includes("money") || lower.includes("spend") || lower.includes("pay")) {
    return "Money";
  }
  return `Script ${String(index + 1)}`;
};

/**
 * One script as a speech-bubble card with scenario chip.
 */
export const SpeechBubbleCard: React.FC<SpeechBubbleCardProps> = ({
  script,
  index,
}) => {
  const chip = scenarioChip(script.situation, index);
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "rgba(255,255,255,0.8)",
        border: `1px solid ${C.border}`,
        borderLeft: `4px solid ${C.coral}`,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="text-lg leading-none"
          style={{ color: C.coral }}
          aria-hidden="true"
        >
          “
        </span>
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{ background: `${C.coral}18`, color: C.coral }}
        >
          {chip}
        </span>
      </div>
      <p className="text-xs font-semibold mb-2" style={{ color: C.muted }}>
        {script.situation}
      </p>
      <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: C.gold }}>
        Say this
      </p>
      <p className="text-sm leading-snug font-medium" style={{ color: C.navy }}>
        “{script.sayThis}”
      </p>
    </div>
  );
};
