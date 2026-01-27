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
  
  // Get sorted groups by score for Leadership DNA display
  const sortedGroups = useMemo(() => {
    return careerProfile.groupScores
      .filter((g) => g.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [careerProfile.groupScores]);

  // Check if all scores are the same (when user has equal representation)
  const allScoresEqual = useMemo(() => {
    if (sortedGroups.length <= 1) return false;
    const firstScore = sortedGroups[0].score;
    return sortedGroups.every((g) => g.score === firstScore);
  }, [sortedGroups]);

  // Archetype icons and descriptors
  const archetypeIcons: Record<string, string> = {
    architect: "🏗️",
    guardian: "🛡️",
    catalyst: "🚀",
    anchor: "⚓"
  };

  const archetypeDescriptors: Record<string, string> = {
    architect: "Systems & Strategy",
    guardian: "Financial Control",
    catalyst: "Growth & Sales",
    anchor: "Team Stability"
  };

  return (
    <div className="p-6 dark:bg-gray-900">
      <div className="w-full border-t border-gray-400 dark:border-gray-600 mb-6"></div>

      <div className="text-center mb-10">
        <h2 className="text-4xl dark:text-white font-bold mb-2">{"A+ TALENT STRATEGY"}</h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm max-w-3xl mx-auto leading-relaxed">
          {"Your Career Palace reveals your natural leadership style and ideal team composition. Founders often hire people like themselves, creating blind spots. This analysis shows exactly which personality types and skill sets you need to balance your natural tendencies and scale sustainably."}
        </p>
      </div>

      {/* Leadership DNA */}
      <div className="mb-12 rounded-2xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{"🧬"}</span>
            <h3 className="text-lg font-bold text-white">{"YOUR LEADERSHIP DNA"}</h3>
          </div>
        </div>
        <div className="p-6">
          {sortedGroups.length > 0 ? (
            <>
              {allScoresEqual && sortedGroups.length > 1 ? (
                <div className="mb-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">{"⚖️"}</span>
                    <div className="text-sm text-amber-900 dark:text-amber-200">
                      <span className="font-bold">{"Balanced Leadership: "}</span>
                      {`You have equal representation across your ${sortedGroups.length} detected archetypes. No single style dominates — hire based on your business needs rather than personal gaps.`}
                    </div>
                  </div>
                </div>
              ) : null}
              <div className="space-y-4">
                {sortedGroups.map((group, idx) => {
                const groupDetail = careerProfile.presentGroups.find((g) => g.key === group.key);
                const label = groupDetail?.label ?? group.key;
                const icon = archetypeIcons[group.key] ?? "📊";
                const descriptor = archetypeDescriptors[group.key] ?? "";
                const scorePercentage = Math.min(100, (group.score / 10) * 100);
                
                return (
                  <div key={group.key} className="flex items-center gap-3">
                    <span className="text-2xl flex-shrink-0">{icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">
                          {label}
                        </span>
                        {!allScoresEqual ? (
                          <span className={[
                            "text-xs font-semibold px-2 py-0.5 rounded-full",
                            idx === 0 
                              ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                          ].join(" ")}>
                            {idx === 0 ? "Primary" : "Supporting"}
                          </span>
                        ) : null}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {"• " + descriptor}
                        </span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${scorePercentage}%`,
                            backgroundImage: "linear-gradient(to right, #6366f1, #8b5cf6)"
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 flex-shrink-0 w-8 text-right">
                      {group.score.toFixed(1)}
                    </span>
                  </div>
                );
              })}
              </div>
            </>
          ) : (
            <div className="text-center py-4 text-sm text-gray-600 dark:text-gray-400">
              {"No leadership groups detected in Career Palace"}
            </div>
          )}
        </div>
      </div>

      <IdealTeamRadar
        radarData={radarData}
        hasRecognizedStars={careerProfile.hasRecognizedStars}
        usedSpousePalace={careerProfile.usedSpousePalace}
      />

      <div className="mt-12">
        <WhoToLookFor
          missingGroups={careerProfile.missingGroups}
          groupScores={careerProfile.groupScores}
          hasRecognizedStars={careerProfile.hasRecognizedStars}
        />
      </div>

      <div className="mt-12">
        <LeadershipQuadrant
          quadrantData={quadrantData}
          hasRecognizedStars={careerProfile.hasRecognizedStars}
        />
      </div>
    </div>
  );
};

export default TalentStrategy;

