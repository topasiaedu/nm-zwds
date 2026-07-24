/**
 * Numbered action tiles and warning tiles for aspect / checklist chapters.
 */

import React from "react";
import { C } from "../../alignment-advantage/shared/constants";

export interface ActionTileProps {
  rank: number;
  text: string;
  tone?: "do" | "avoid";
}

/**
 * One ranked Do or Avoid tile with icon badge.
 */
export const ActionTile: React.FC<ActionTileProps> = ({
  rank,
  text,
  tone = "do",
}) => {
  const isDo = tone === "do";
  const accent = isDo ? "#047857" : "#c2410c";
  const bg = isDo ? "#ecfdf5" : "#fff7ed";
  const border = isDo ? "#a7f3d0" : "#fed7aa";
  const badge = isDo ? String(rank).padStart(2, "0") : "!";

  return (
    <div
      className="rounded-2xl px-3.5 py-3 flex gap-3 items-start"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      <span
        className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold"
        style={{ background: `${accent}22`, color: accent }}
        aria-hidden="true"
      >
        {badge}
      </span>
      <p className="text-sm leading-snug font-medium" style={{ color: C.navy }}>
        {text}
      </p>
    </div>
  );
};

export interface ActionTileListProps {
  items: string[];
  tone?: "do" | "avoid";
  max?: number;
}

/**
 * Vertical list of action / warning tiles.
 */
export const ActionTileList: React.FC<ActionTileListProps> = ({
  items,
  tone = "do",
  max = 3,
}) => (
  <div className="space-y-2">
    {items.slice(0, max).map((text, index) => (
      <ActionTile key={`${tone}-${text}`} rank={index + 1} text={text} tone={tone} />
    ))}
  </div>
);
