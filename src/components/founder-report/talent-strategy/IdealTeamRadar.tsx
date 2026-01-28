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
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Radar Chart */}
          <div className="lg:col-span-3">
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
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 10]} 
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                    tickCount={6}
                    tickFormatter={(value: number) => {
                      // Convert 0-10 scale to 0-100 for display
                      return `${Math.round(value * 10)}`;
                    }}
                  />
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
          </div>

          {/* Right: Context and Guide */}
          <div className="lg:col-span-2 flex flex-col justify-center space-y-4">
            <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{"📊"}</span>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{"How to Read This"}</h4>
              </div>
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 font-bold flex-shrink-0">{"↑"}</span>
                  <div>
                    <span className="font-semibold">{"Higher scores"}</span>
                    {" = Higher hiring priority. These are the roles your team needs most to complement your leadership style."}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 font-bold flex-shrink-0">{"↓"}</span>
                  <div>
                    <span className="font-semibold">{"Lower scores"}</span>
                    {" = Lower priority. You may already have natural strength in these areas or they're less critical for your current stage."}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{"💡"}</span>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{"Action Step"}</h4>
              </div>
              <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                {"Focus on the highest-scoring roles first — they're calculated based on your Career Palace gaps. Build a balanced team across all dimensions."}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-600 dark:text-gray-400 text-center py-8">
          No recognized Career Palace stars found for this section.
        </div>
      )}
    </SectionCard>
  );
};

export default IdealTeamRadar;
