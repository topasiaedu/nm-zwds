import React from "react";
import { C } from "./constants";

export type AxisAnswer = boolean | null;

export const AxisCard: React.FC<{
  title:       string;
  description: string;
  value:       string;
  answer?:     AxisAnswer;
  showStatus?: boolean;
  variant?:    "default" | "checklist";
}> = ({ title, description, value, answer, showStatus = true, variant = "default" }) => {
  const aligned    = answer === true;
  const notAligned = answer === false;

  const isChecklist = variant === "checklist";

  const borderColor = isChecklist
    ? (aligned ? "#16a34a40" : notAligned ? "#e8642d40" : `${C.border}60`)
    : (aligned ? "#16a34a55" : notAligned ? "#e8642d55" : C.border);

  const bgColor = isChecklist
    ? "transparent"
    : (aligned ? "#f0fff4" : notAligned ? "#fff7f5" : C.cream);

  return (
    <div
      {...(isChecklist ? { "data-aa-checklist-row": "" } : {})}
      className={`p-5 transition-all duration-300 ${isChecklist ? "flex flex-col md:flex-row gap-6 items-start md:items-center rounded-none border-b" : "flex flex-col gap-4 rounded-2xl border"}`}
      style={isChecklist
        ? { borderBottom: `1px solid ${borderColor}`, background: bgColor }
        : { border: `1px solid ${borderColor}`, background: bgColor }}
    >
      <div className={`flex items-start justify-between gap-2 ${isChecklist ? "w-full md:w-1/4 shrink-0" : ""}`}>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: C.muted }}>
            {title}
          </p>
          <p className="text-sm font-bold leading-tight" style={{ color: C.navy }}>{value}</p>
        </div>
      </div>

      <p className={`text-xs leading-relaxed ${isChecklist ? "flex-1" : "flex-1"}`} style={{ color: C.muted }}>{description}</p>

      {showStatus && (
        <div
          className={`rounded-xl py-2 px-6 text-xs font-bold text-center ${isChecklist ? "w-full md:w-auto shrink-0 mt-0" : "mt-auto"}`}
          style={{
            background: aligned ? "#dcfce7" : notAligned ? "#fff1ee" : `${C.cream}cc`,
            color: aligned ? "#16a34a" : notAligned ? C.coral : C.muted,
          }}
        >
          {aligned ? "Aligned ✓" : notAligned ? "Caution" : "-"}
        </div>
      )}
    </div>
  );
};
