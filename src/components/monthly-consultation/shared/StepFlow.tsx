/**
 * Numbered step flows for Health protocol and Rarity action steps.
 */

import React from "react";
import { C } from "../../alignment-advantage/shared/constants";

export interface StepFlowItem {
  label?: string;
  text: string;
}

export interface StepFlowProps {
  steps: StepFlowItem[];
  /** horizontal = Health week signals; vertical = protocol / rarity */
  orientation?: "horizontal" | "vertical";
  accent?: string;
}

/**
 * Visual numbered step sequence.
 */
export const StepFlow: React.FC<StepFlowProps> = ({
  steps,
  orientation = "vertical",
  accent = C.coral,
}) => {
  if (orientation === "horizontal") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {steps.map((step, index) => (
          <div
            key={`${step.label ?? ""}-${step.text}`}
            className="rounded-2xl p-3 relative"
            style={{
              background: "rgba(255,255,255,0.78)",
              border: `1px solid ${C.border}`,
            }}
          >
            <span
              className="absolute -top-2 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: accent, color: "#fff" }}
            >
              {step.label ?? `W${String(index + 1)}`}
            </span>
            <p className="text-xs leading-snug mt-2" style={{ color: C.navy }}>
              {step.text}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <ol className="space-y-2">
      {steps.map((step, index) => (
        <li
          key={`${String(index)}-${step.text}`}
          className="rounded-2xl px-3.5 py-3 flex gap-3 items-start"
          style={{
            background: "rgba(255,255,255,0.78)",
            border: `1px solid ${C.border}`,
          }}
        >
          <span
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
            style={{ background: `${accent}18`, color: accent }}
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0 pt-1">
            {step.label !== undefined && step.label.length > 0 && (
              <p
                className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
                style={{ color: accent }}
              >
                {step.label}
              </p>
            )}
            <p className="text-sm leading-snug" style={{ color: C.navy }}>
              {step.text}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
};
