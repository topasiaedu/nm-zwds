/**
 * Founder Timing Decision System Report — Section 03: Talent Strategy
 *
 * Renders 3 data-driven views:
 * 1) Ideal Team Composition Radar
 * 2) Who to Look For (Career Palace gap cards)
 * 3) Leadership Quadrant (Career Palace)
 */
import React, { useMemo } from "react";
import type { ChartData } from "../../utils/zwds/types";
import { analyzeCareerPalaceGroups } from "../../utils/zwds/analysis/careerPalaceAnalysis";
import { buildCareerQuadrant, buildRadarData } from "../../utils/zwds/analysis/talentStrategyData";
import IdealTeamRadar from "./talent-strategy/IdealTeamRadar";
import LeadershipQuadrant from "./talent-strategy/LeadershipQuadrant";
import WhoToLookFor from "./talent-strategy/WhoToLookFor";

export interface TalentStrategyProps {
  chartData: ChartData;
}

export const TalentStrategy: React.FC<TalentStrategyProps> = ({ chartData }) => {
  const careerProfile = useMemo(() => analyzeCareerPalaceGroups(chartData), [chartData]);
  const radarData = useMemo(() => buildRadarData(careerProfile), [careerProfile]);
  const quadrantData = useMemo(() => buildCareerQuadrant(careerProfile), [careerProfile]);
  const primaryGroup = careerProfile.groupScores
    .slice()
    .sort((a, b) => b.score - a.score)
    .find((g) => g.score > 0);
  const primaryLabel = primaryGroup ? careerProfile.presentGroups.find((g) => g.key === primaryGroup.key)?.label : null;
  const secondaryLabels = careerProfile.presentGroups
    .filter((group) => group.key !== primaryGroup?.key)
    .map((group) => group.label);

  return (
    <div className="p-6 dark:bg-gray-900">
      <div className="w-full border-t border-gray-400 dark:border-gray-600 mb-6"></div>

      <div className="text-center mb-8">
        <h2 className="text-4xl dark:text-white font-bold mb-2">{"A+ TALENT STRATEGY"}</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {"Who to Hire, Team Fit, Career Palace Analysis"}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
            <span className="font-bold text-indigo-900 dark:text-indigo-200">{"Primary"}</span>
            <span className="text-gray-700 dark:text-gray-300">{primaryLabel ?? "Not detected"}</span>
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <span className="font-bold text-gray-900 dark:text-white">{"Secondary"}</span>
            <span className="text-gray-700 dark:text-gray-300">
              {secondaryLabels.length > 0 ? secondaryLabels.join(" + ") : "None"}
            </span>
          </span>
          {careerProfile.usedSpousePalace ? (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <span className="font-bold text-gray-900 dark:text-white">{"Fallback"}</span>
              <span className="text-gray-700 dark:text-gray-300">{"Spouse Palace used"}</span>
            </span>
          ) : null}
        </div>
      </div>

      <IdealTeamRadar
        radarData={radarData}
        hasRecognizedStars={careerProfile.hasRecognizedStars}
        usedSpousePalace={careerProfile.usedSpousePalace}
      />

      <div className="mt-6">
        <WhoToLookFor
          missingGroups={careerProfile.missingGroups}
          groupScores={careerProfile.groupScores}
          hasRecognizedStars={careerProfile.hasRecognizedStars}
        />
      </div>

      <div className="mt-6">
        <LeadershipQuadrant
          quadrantData={quadrantData}
          hasRecognizedStars={careerProfile.hasRecognizedStars}
        />
      </div>
    </div>
  );
};

export default TalentStrategy;

