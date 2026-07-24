/**
 * 12-arc SVG year donut highlighting the current lunar month.
 */

import React from "react";
import type { YearClimateRow } from "../../../utils/forecast/monthlyConsultation";
import { C } from "../../alignment-advantage/shared/constants";

export interface YearRadialMapProps {
  months: YearClimateRow[];
}

const SIZE = 220;
const CX = SIZE / 2;
const CY = SIZE / 2;
const OUTER_R = 92;
const INNER_R = 54;
const GAP_DEG = 2;

/**
 * Convert polar degrees (0 = top, clockwise) to cartesian on the SVG canvas.
 */
const polarToCart = (
  radius: number,
  angleDeg: number
): { x: number; y: number } => {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CX + radius * Math.cos(rad),
    y: CY + radius * Math.sin(rad),
  };
};

/**
 * Build an SVG donut-arc path for one of twelve equal month wedges.
 */
const arcPath = (startDeg: number, endDeg: number): string => {
  const outerStart = polarToCart(OUTER_R, startDeg);
  const outerEnd = polarToCart(OUTER_R, endDeg);
  const innerEnd = polarToCart(INNER_R, endDeg);
  const innerStart = polarToCart(INNER_R, startDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${String(outerStart.x)} ${String(outerStart.y)}`,
    `A ${String(OUTER_R)} ${String(OUTER_R)} 0 ${String(largeArc)} 1 ${String(outerEnd.x)} ${String(outerEnd.y)}`,
    `L ${String(innerEnd.x)} ${String(innerEnd.y)}`,
    `A ${String(INNER_R)} ${String(INNER_R)} 0 ${String(largeArc)} 0 ${String(innerStart.x)} ${String(innerStart.y)}`,
    "Z",
  ].join(" ");
};

/**
 * Resolve fill / opacity for a month arc based on current / past / future.
 */
const arcStyle = (
  row: YearClimateRow,
  currentMonth: number
): { fill: string; opacity: number } => {
  if (row.isCurrent) {
    return { fill: C.coral, opacity: 1 };
  }
  if (row.lunarMonth < currentMonth) {
    return { fill: C.navy, opacity: 0.28 };
  }
  return { fill: C.gold, opacity: 0.55 };
};

/**
 * SVG year ring with 12 lunar-month arcs and a small legend.
 */
export const YearRadialMap: React.FC<YearRadialMapProps> = ({ months }) => {
  const sorted = [...months].sort((a, b) => a.lunarMonth - b.lunarMonth);
  const current = sorted.find((m) => m.isCurrent);
  const currentMonth = current !== undefined ? current.lunarMonth : 1;
  const slice = 360 / 12;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${String(SIZE)} ${String(SIZE)}`}
        aria-label="Year climate map"
        role="img"
      >
        {sorted.slice(0, 12).map((row) => {
          const index = row.lunarMonth - 1;
          const start = index * slice + GAP_DEG / 2;
          const end = (index + 1) * slice - GAP_DEG / 2;
          const style = arcStyle(row, currentMonth);
          const mid = (start + end) / 2;
          const labelPos = polarToCart((OUTER_R + INNER_R) / 2, mid);
          return (
            <g key={row.lunarMonth}>
              <path
                d={arcPath(start, end)}
                fill={style.fill}
                opacity={style.opacity}
                stroke={row.isCurrent ? C.coralDark : "transparent"}
                strokeWidth={row.isCurrent ? 2 : 0}
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={row.isCurrent ? 11 : 9}
                fontWeight={row.isCurrent ? 700 : 600}
                fill={row.isCurrent ? "#fff" : C.navy}
              >
                {`M${String(row.lunarMonth)}`}
              </text>
            </g>
          );
        })}
        <circle cx={CX} cy={CY} r={INNER_R - 6} fill={C.cream} />
        <text
          x={CX}
          y={CY - 6}
          textAnchor="middle"
          fontSize={11}
          fontWeight={700}
          fill={C.navy}
        >
          Year
        </text>
        <text
          x={CX}
          y={CY + 10}
          textAnchor="middle"
          fontSize={10}
          fill={C.muted}
        >
          {`M${String(currentMonth)} now`}
        </text>
      </svg>
      <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-semibold">
        <span className="inline-flex items-center gap-1.5" style={{ color: C.navy }}>
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: C.navy, opacity: 0.28 }} />
          Past
        </span>
        <span className="inline-flex items-center gap-1.5" style={{ color: C.navy }}>
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: C.coral }} />
          Current
        </span>
        <span className="inline-flex items-center gap-1.5" style={{ color: C.navy }}>
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: C.gold, opacity: 0.55 }} />
          Ahead
        </span>
      </div>
    </div>
  );
};
