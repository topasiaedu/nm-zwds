/**
 * Four-cell month contract: Do this / By when (yellow), Success (green), Do not (red).
 */

import React from "react";
import type { MonthContract } from "../../../utils/forecast/monthlyConsultation";
import { C } from "../../alignment-advantage/shared/constants";

const YELLOW = C.gold;
const GREEN = "#047857";
const RED = "#c2410c";

export interface ContractCardProps {
  contract: MonthContract;
  /** Compact layout for Letter close. */
  compact?: boolean;
}

interface ContractCell {
  label: string;
  value: string;
  accent: string;
  tint: string;
  icon: React.ReactNode;
}

/**
 * Strip chart-anchor tags so the action line stays clean.
 */
const shortDoThis = (primaryMove: string): string => {
  const withoutTag = primaryMove.split(" · ")[0]?.trim() ?? primaryMove;
  const cleaned = withoutTag.replace(/^Do this:\s*/i, "").trim();
  if (cleaned.length === 0) {
    return primaryMove.trim();
  }
  return cleaned;
};

/**
 * Visual month-contract grid shared by Cover and Letter.
 */
export const ContractCard: React.FC<ContractCardProps> = ({
  contract,
  compact = false,
}) => {
  const cells: ContractCell[] = [
    {
      label: "Do this",
      value: shortDoThis(contract.primaryMove),
      accent: YELLOW,
      tint: `${YELLOW}18`,
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"
        />
      ),
    },
    {
      label: "By when",
      value: contract.deadline,
      accent: YELLOW,
      tint: `${YELLOW}18`,
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M8 7V3m8 4V3M5 11h14M6 5h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2z"
        />
      ),
    },
    {
      label: "Success",
      value: contract.successMeasure,
      accent: GREEN,
      tint: "#ecfdf5",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M5 13l4 4L19 7"
        />
      ),
    },
    {
      label: "Do not",
      value: contract.antiPattern,
      accent: RED,
      tint: "#fff7ed",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M6 18L18 6M6 6l12 12"
        />
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {cells.map((cell) => (
        <div
          key={cell.label}
          className="rounded-2xl p-3.5 flex gap-3"
          style={{
            background: cell.tint,
            border: `1px solid ${cell.accent}44`,
            borderLeft: `4px solid ${cell.accent}`,
          }}
        >
          <span
            className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: `${cell.accent}22`, color: cell.accent }}
            aria-hidden="true"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {cell.icon}
            </svg>
          </span>
          <div className="min-w-0">
            <p
              className="text-[10px] font-bold uppercase tracking-wider mb-1"
              style={{ color: cell.accent }}
            >
              {cell.label}
            </p>
            <p
              className={`font-semibold leading-snug ${compact ? "text-xs" : "text-sm"}`}
              style={{ color: C.navy }}
            >
              {cell.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
