import React from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import type { RadarDatum } from "../../../utils/zwds/analysis/talentStrategyData";
import SectionCard from "./SectionCard";

type RechartsPayload<T> = { payload: T };

const TalentRadarTooltip: React.FC<{
  active?: boolean;
  payload?: Array<RechartsPayload<RadarDatum>>;
}> = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl p-4 max-w-xs">
      <div className="font-bold text-gray-900 dark:text-white mb-1">{`${d.icon} ${d.role}`}</div>
      <div className="text-xs text-gray-600 dark:text-gray-300">
        {`Hiring priority: ${d.ideal.toFixed(1)}/10`}
      </div>
    </div>
  );
};

type IdealTeamRadarProps = {
  radarData: RadarDatum[];
  hasRecognizedStars: boolean;
  usedSpousePalace: boolean;
};

const IdealTeamRadar: React.FC<IdealTeamRadarProps> = ({
  radarData,
  hasRecognizedStars,
  usedSpousePalace,
}) => {
  return (
    <SectionCard title="Ideal Team Composition" subtitle="Key roles to build your optimal team">
      {hasRecognizedStars ? (
        <>
          <div className="w-full h-80 md:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <defs>
                  <linearGradient id="talentStrategyIdealGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.85} />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.85} />
                  </linearGradient>
                </defs>
                <PolarGrid stroke="#64748b" opacity={0.35} />
                <PolarAngleAxis
                  dataKey="role"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  tickFormatter={(value: string) => {
                    const match = radarData.find((d) => d.role === value);
                    return match ? `${match.icon} ${value}` : value;
                  }}
                />
                <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <RechartsTooltip content={<TalentRadarTooltip />} />
                <Radar
                  name="Ideal"
                  dataKey="ideal"
                  stroke="#4f46e5"
                  fill="url(#talentStrategyIdealGradient)"
                  fillOpacity={0.42}
                  strokeWidth={4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          {usedSpousePalace ? (
            <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
              Career Palace is empty. Using Spouse Palace stars to derive hiring priorities.
            </div>
          ) : null}
        </>
      ) : (
        <div className="text-sm text-gray-600 dark:text-gray-400 text-center py-8">
          No recognized Career Palace stars found for this section.
        </div>
      )}
    </SectionCard>
  );
};

export default IdealTeamRadar;
