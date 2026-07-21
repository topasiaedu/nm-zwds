/**
 * Four-cell month contract card: Move / By When / Success / Avoid.
 */

import React from "react";
import type { MonthContract } from "../../../utils/forecast/monthlyConsultation";
import { C } from "../../alignment-advantage/shared/constants";

export interface ContractCardProps {
  contract: MonthContract;
  /** Compact layout for Letter close. */
  compact?: boolean;
}

interface ContractCell {
  label: string;
  value: string;
  accent: string;
  icon: React.ReactNode;
}

/**
 * Visual month-contract grid shared by Cover and Letter chapters.
 */
export const ContractCard: React.FC<ContractCardProps> = ({
  contract,
  compact = false,
}) => {
  const cells: ContractCell[] = [
    {
      label: "Primary move",
      value: contract.primaryMove,
      accent: C.coral,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
      ),
    },
    {
      label: "By when",
      value: contract.deadline,
      accent: C.gold,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3M5 11h14M6 5h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2z" />
      ),
    },
    {
      label: "Done looks like",
      value: contract.successMeasure,
      accent: "#047857",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 13l4 4L19 7" />
      ),
    },
    {
      label: "Do not",
      value: contract.antiPattern,
      accent: "#c2410c",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
      ),
    },
  ];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2.5 ${compact ? "" : ""}`}>
      {cells.map((cell) => (
        <div
          key={cell.label}
          className="rounded-2xl p-3.5 flex gap-3"
          style={{
            background: "rgba(255,255,255,0.78)",
            border: `1px solid ${C.border}`,
            borderLeft: `4px solid ${cell.accent}`,
          }}
        >
          <span
            className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: `${cell.accent}18`, color: cell.accent }}
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
