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

  /**
   * Detailed explanations for each leadership archetype.
   * Helps users understand what their archetype means in practice.
   */
  const archetypeExplanations: Record<string, string> = {
    architect: "You're a builder of systems and frameworks. You naturally see the big picture and break down complex problems into structured solutions. As a founder, you excel at creating processes, building roadmaps, and designing scalable operations. Your strength is turning chaos into order.",
    guardian: "You're wired for financial discipline and risk management. You naturally focus on profitability, cost control, and sustainable growth. As a founder, you excel at protecting resources, optimizing margins, and making data-driven decisions. Your strength is keeping the business financially healthy and stable.",
    catalyst: "You're a natural growth driver and momentum creator. You thrive on expansion, sales, and bringing energy to the team. As a founder, you excel at launching initiatives, closing deals, and pushing boundaries. Your strength is accelerating growth and creating movement when others get stuck.",
    anchor: "You're a stabilizing force who values people and culture. You naturally build trust, resolve conflicts, and create cohesive teams. As a founder, you excel at employee retention, building loyalty, and maintaining morale during turbulent times. Your strength is holding the team together and preventing attrition."
  };

  return (
    <div className="p-6 dark:bg-gray-900">
      <div className="w-full border-t border-gray-400 dark:border-gray-600 mb-6"></div>

      {/* Section Header */}
      <div
        className="relative rounded-3xl overflow-hidden mb-10"
        style={{
          background: "linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)",
          padding: "32px 40px",
          boxShadow: "0 10px 40px rgba(251, 146, 60, 0.3)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "40px",
            fontSize: "48px",
            opacity: 0.2,
          }}
        >
          👥
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            left: "60px",
            fontSize: "24px",
            opacity: 0.15,
          }}
        >
          ⭐
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <span
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                color: "#ea580c",
                padding: "4px 12px",
                borderRadius: "8px",
                fontSize: "18px",
                fontWeight: "800",
              }}
            >
              03
            </span>
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "800",
                color: "#ffffff",
                textShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              A+ Talent Strategy
            </h2>
          </div>
          <p
            style={{
              color: "#fff",
              fontSize: "15px",
              fontWeight: "500",
              marginTop: "8px",
              opacity: 0.95,
            }}
          >
            Uncover your leadership DNA and who to hire to fill your blind spots
          </p>
        </div>
      </div>

      {/* Leadership DNA */}
      <div className="mb-12 rounded-2xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8">
        <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">
          {"Your Leadership DNA"}
        </h3>
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
              <div className="space-y-6">
                {sortedGroups.map((group, idx) => {
                const groupDetail = careerProfile.presentGroups.find((g) => g.key === group.key);
                const label = groupDetail?.label ?? group.key;
                const icon = archetypeIcons[group.key] ?? "📊";
                const descriptor = archetypeDescriptors[group.key] ?? "";
                const explanation = archetypeExplanations[group.key] ?? "";
                const scorePercentage = Math.min(100, (group.score / 10) * 100);
                
                return (
                  <div key={group.key} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/10 dark:to-purple-900/10 p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl flex-shrink-0 mt-1">{icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-gray-900 dark:text-white text-base uppercase tracking-wide">
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
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                            {"• " + descriptor}
                          </span>
                        </div>
                        
                        {/* Explanation text */}
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                          {explanation}
                        </p>
                        
                        <div className="flex items-center gap-3">
                          <div className="h-2.5 flex-1 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-500"
                              style={{ 
                                width: `${scorePercentage}%`,
                                backgroundImage: "linear-gradient(to right, #6366f1, #8b5cf6)"
                              }}
                            />
                          </div>
                          <span className="text-sm font-bold text-gray-700 dark:text-gray-300 flex-shrink-0 w-8 text-right">
                            {group.score.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
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

