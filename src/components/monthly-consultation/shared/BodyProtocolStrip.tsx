/**
 * Single protocol strip for Body chapter "What to do" list.
 * Left coral rail + hairline-separated directives (Option C).
 */

import React from "react";
import { C } from "../../alignment-advantage/shared/constants";

export interface BodyProtocolStripProps {
  items: string[];
}

/**
 * Map a protocol line to a short label badge for scannability.
 */
const protocolBadge = (text: string): string => {
  const lower = text.toLowerCase();
  if (lower.includes("sleep") || lower.includes("rest") || lower.includes("night")) {
    return "Rest";
  }
  if (
    lower.includes("walk")
    || lower.includes("stretch")
    || lower.includes("move")
    || lower.includes("exercise")
  ) {
    return "Move";
  }
  if (
    lower.includes("checkup")
    || lower.includes("book")
    || lower.includes("doctor")
    || lower.includes("health")
  ) {
    return "Check";
  }
  if (
    lower.includes("caffeine")
    || lower.includes("stimulant")
    || lower.includes("screen")
    || lower.includes("cut")
    || lower.includes("reduce")
  ) {
    return "Limit";
  }
  if (lower.includes("water") || lower.includes("drink") || lower.includes("eat")) {
    return "Fuel";
  }
  return "Care";
};

/**
 * One contiguous protocol block — reads as a single body protocol.
 */
export const BodyProtocolStrip: React.FC<BodyProtocolStripProps> = ({
  items,
}) => {
  const rows = items.slice(0, 4);
  if (rows.length === 0) {
    return null;
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.85)",
        border: `1px solid ${C.border}`,
        borderLeft: `4px solid ${C.coral}`,
      }}
    >
      {rows.map((text, index) => {
        const badge = protocolBadge(text);
        const isLast = index === rows.length - 1;
        return (
          <div
            key={`${String(index)}-${text}`}
            className="flex gap-3 items-start px-4 py-3.5"
            style={{
              borderBottom: isLast ? "none" : `1px solid ${C.border}`,
            }}
          >
            <span
              className="shrink-0 min-w-[3.25rem] px-2 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold uppercase tracking-wider"
              style={{
                background: `${C.coral}14`,
                color: C.coral,
              }}
              aria-hidden="true"
            >
              {badge}
            </span>
            <p
              className="text-sm font-medium leading-snug pt-1.5"
              style={{ color: C.navy }}
            >
              {text}
            </p>
          </div>
        );
      })}
    </div>
  );
};
