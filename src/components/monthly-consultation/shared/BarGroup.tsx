/**
 * Recharts grouped bar chart for Scorecard Prior / Current / Next.
 */

import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DimensionScorecard } from "../../../utils/forecast/monthlyConsultation";
import { C } from "../../alignment-advantage/shared/constants";

export interface BarGroupProps {
  rows: DimensionScorecard[];
}

interface ChartRow {
  name: string;
  Prior: number;
  Current: number;
  Next: number;
}

/**
 * Grouped bars for four life areas across prior / current / next months.
 */
export const BarGroup: React.FC<BarGroupProps> = ({ rows }) => {
  const data: ChartRow[] = rows.map((row) => ({
    name: row.label,
    Prior: Math.max(0, Math.min(100, row.priorPct)),
    Current: Math.max(0, Math.min(100, row.pct)),
    Next: Math.max(0, Math.min(100, row.nextPct)),
  }));

  return (
    <div className="w-full h-64 rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.7)", border: `1px solid ${C.border}` }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={`${C.border}`} />
          <XAxis
            dataKey="name"
            tick={{ fill: C.muted, fontSize: 11 }}
            axisLine={{ stroke: C.border }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: C.muted, fontSize: 10 }}
            axisLine={{ stroke: C.border }}
          />
          <Tooltip
            contentStyle={{
              background: C.cream,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              fontSize: 12,
              color: C.navy,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11, color: C.muted }} />
          <Bar dataKey="Prior" fill={`${C.muted}`} radius={[4, 4, 0, 0]} />
          <Bar dataKey="Current" fill={C.coral} radius={[4, 4, 0, 0]} />
          <Bar dataKey="Next" fill={C.navy} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
