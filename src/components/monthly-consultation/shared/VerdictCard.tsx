/**
 * Decision verdict cards + summary count row for the Should I…? board.
 */

import React from "react";
import type {
  DecisionRow,
  DecisionVerdict,
} from "../../../utils/forecast/monthlyConsultation";
import { C } from "../../alignment-advantage/shared/constants";

/**
 * Four-way decision board labels.
 */
export const verdictLabel = (rating: DecisionVerdict): string => {
  if (rating === "hard-yes") {
    return "Hard Yes";
  }
  if (rating === "soft-yes") {
    return "Soft Yes";
  }
  if (rating === "wait") {
    return "Wait";
  }
  return "No";
};

/**
 * Colour for each decision verdict.
 */
export const verdictColor = (rating: DecisionVerdict): string => {
  if (rating === "hard-yes") {
    return "#16a34a";
  }
  if (rating === "soft-yes") {
    return "#65a30d";
  }
  if (rating === "wait") {
    return C.gold;
  }
  return C.coral;
};

export interface VerdictSummaryProps {
  decisions: DecisionRow[];
}

/**
 * Top summary row counting Hard Yes / Soft Yes / Wait / No.
 */
export const VerdictSummary: React.FC<VerdictSummaryProps> = ({ decisions }) => {
  const counts: Record<DecisionVerdict, number> = {
    "hard-yes": 0,
    "soft-yes": 0,
    wait: 0,
    no: 0,
  };
  for (const d of decisions) {
    counts[d.rating] += 1;
  }
  const slots: DecisionVerdict[] = ["hard-yes", "soft-yes", "wait", "no"];
  return (
    <div className="grid grid-cols-4 gap-2">
      {slots.map((slot) => {
        const color = verdictColor(slot);
        return (
          <div
            key={slot}
            className="rounded-xl px-2 py-2.5 text-center"
            style={{
              background: `${color}14`,
              border: `1px solid ${color}33`,
            }}
          >
            <p className="text-lg font-bold leading-none" style={{ color }}>
              {String(counts[slot])}
            </p>
            <p className="text-[9px] font-bold uppercase tracking-wider mt-1" style={{ color }}>
              {verdictLabel(slot)}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export interface VerdictCardProps {
  row: DecisionRow;
}

/**
 * Two-tone decision row: left stripe + question + why + tip.
 */
export const VerdictCard: React.FC<VerdictCardProps> = ({ row }) => {
  const color = verdictColor(row.rating);
  return (
    <div
      className="rounded-2xl overflow-hidden flex"
      style={{ border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.75)" }}
    >
      <div className="w-1.5 shrink-0" style={{ background: color }} aria-hidden="true" />
      <div className="flex-1 px-4 py-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold" style={{ color: C.navy }}>
            {row.decision}
          </p>
          <p className="text-xs mt-1 italic leading-snug" style={{ color: C.muted }}>
            {row.why}
          </p>
          <p className="text-xs mt-1.5 font-medium" style={{ color: C.navy }}>
            {row.coaching}
          </p>
        </div>
        <span
          className="text-[10px] font-bold uppercase tracking-wider shrink-0 px-2 py-1 rounded-full"
          style={{ color, background: `${color}18` }}
        >
          {verdictLabel(row.rating)}
        </span>
      </div>
    </div>
  );
};
