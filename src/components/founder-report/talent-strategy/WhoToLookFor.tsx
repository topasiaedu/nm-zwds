import React from "react";
import type {
  CareerGroupDetail,
  CareerGroupKey,
  CareerGroupScore,
} from "../../../utils/zwds/analysis/careerPalaceAnalysis";
import { getCareerGroupDetails } from "../../../utils/zwds/analysis/careerPalaceAnalysis";
import SectionCard from "./SectionCard";

type WhoToLookForProps = {
  missingGroups: CareerGroupDetail[];
  groupScores: CareerGroupScore[];
  hasRecognizedStars: boolean;
};

type RoleCard = {
  key: CareerGroupKey;
  emoji: string;
  title: string;
  focus: string;
  traits: string[];
};

const ROLE_CARD_MAP: Record<CareerGroupKey, RoleCard[]> = {
  architect: [
    {
      key: "architect",
      emoji: "🏗️",
      title: "Operations Manager",
      focus: "Owns daily execution, process, and delivery cadence.",
      traits: ["Organized", "Disciplined", "Calm under pressure", "Process-minded", "Reliable"],
    },
    {
      key: "architect",
      emoji: "🧭",
      title: "Strategy Manager",
      focus: "Turns big goals into clear priorities and plans.",
      traits: ["Strategic", "Structured", "Clear-thinking", "Long-term oriented", "Analytical"],
    },
    {
      key: "architect",
      emoji: "✅",
      title: "Project Manager",
      focus: "Keeps timelines, owners, and milestones on track.",
      traits: ["Detail-oriented", "Accountable", "Predictable", "Methodical", "Coordinated"],
    },
    {
      key: "architect",
      emoji: "📋",
      title: "Process Improvement Manager",
      focus: "Optimizes workflows and removes operational friction.",
      traits: ["Systematic", "Practical", "Consistent", "Quality-focused", "Solution-driven"],
    },
  ],
  guardian: [
    {
      key: "guardian",
      emoji: "🛡️",
      title: "Finance Manager",
      focus: "Controls budgets, cashflow, and monthly reporting.",
      traits: ["Careful", "Steady", "Trustworthy", "Risk-aware", "Financially responsible"],
    },
    {
      key: "guardian",
      emoji: "📊",
      title: "Financial Analyst",
      focus: "Builds models and insights for better decisions.",
      traits: ["Analytical", "Detail-oriented", "Logical", "Precise", "Objective"],
    },
    {
      key: "guardian",
      emoji: "🔍",
      title: "Risk Manager",
      focus: "Identifies exposure and sets protection controls.",
      traits: ["Cautious", "Structured", "Prudent", "Reliable", "Disciplined"],
    },
    {
      key: "guardian",
      emoji: "🧾",
      title: "Controller",
      focus: "Ensures clean books, compliance, and accuracy.",
      traits: ["Meticulous", "Consistent", "Accountable", "Process-driven", "Trustworthy"],
    },
  ],
  catalyst: [
    {
      key: "catalyst",
      emoji: "🚀",
      title: "Sales Manager",
      focus: "Drives pipeline, closes deals, and hits targets.",
      traits: ["Confident", "Persuasive", "Energetic", "Resilient", "Goal-driven"],
    },
    {
      key: "catalyst",
      emoji: "🤝",
      title: "Business Development Manager",
      focus: "Opens new markets, partners, and channels.",
      traits: ["Outgoing", "Proactive", "Bold", "Networked", "Opportunity-seeking"],
    },
    {
      key: "catalyst",
      emoji: "📣",
      title: "Marketing Manager",
      focus: "Creates demand through campaigns and messaging.",
      traits: ["Creative", "Decisive", "Experiment-driven", "Confident", "Data-aware"],
    },
    {
      key: "catalyst",
      emoji: "🧲",
      title: "Partnerships Manager",
      focus: "Builds alliances that accelerate growth.",
      traits: ["Charismatic", "Persuasive", "Collaborative", "Strategic", "High-energy"],
    },
  ],
  anchor: [
    {
      key: "anchor",
      emoji: "🤝",
      title: "Chief of Staff",
      focus: "Stabilizes execution across teams and priorities.",
      traits: ["Supportive", "Reliable", "Cooperative", "Calm", "Service-minded"],
    },
    {
      key: "anchor",
      emoji: "🧑‍💼",
      title: "Human Resources Manager",
      focus: "Strengthens people systems and team health.",
      traits: ["Empathetic", "Patient", "Trustworthy", "Fair", "People-focused"],
    },
    {
      key: "anchor",
      emoji: "💬",
      title: "Customer Success Manager",
      focus: "Keeps clients happy, retained, and supported.",
      traits: ["Patient", "Helpful", "Consistent", "Relationship-driven", "Calm"],
    },
    {
      key: "anchor",
      emoji: "🧷",
      title: "Executive Assistant",
      focus: "Keeps schedules, details, and follow-through tight.",
      traits: ["Dependable", "Detail-oriented", "Supportive", "Discreet", "Organized"],
    },
  ],
};

function buildRoleCards(
  missingGroups: CareerGroupDetail[],
  groupScores: CareerGroupScore[]
): RoleCard[] {
  const missingKeys = getCareerGroupDetails()
    .map((group) => group.key)
    .filter((key) => missingGroups.some((group) => group.key === key));

  if (missingKeys.length === 0) return [];

  if (missingKeys.length === 1) {
    return ROLE_CARD_MAP[missingKeys[0]].slice(0, 4);
  }

  if (missingKeys.length === 2) {
    return [
      ...ROLE_CARD_MAP[missingKeys[0]].slice(0, 2),
      ...ROLE_CARD_MAP[missingKeys[1]].slice(0, 2),
    ];
  }

  if (missingKeys.length === 3) {
    const weakestKey = [...groupScores]
      .filter((score) => missingKeys.includes(score.key))
      .sort((a, b) => a.score - b.score)[0]?.key;
    const extraKey = weakestKey ?? missingKeys[0];
    return [
      ...ROLE_CARD_MAP[missingKeys[0]].slice(0, 1),
      ...ROLE_CARD_MAP[missingKeys[1]].slice(0, 1),
      ...ROLE_CARD_MAP[missingKeys[2]].slice(0, 1),
      ...ROLE_CARD_MAP[extraKey].slice(1, 2),
    ];
  }

  return missingKeys.slice(0, 4).flatMap((key) => ROLE_CARD_MAP[key].slice(0, 1));
}

const WhoToLookFor: React.FC<WhoToLookForProps> = ({
  missingGroups,
  groupScores,
  hasRecognizedStars,
}) => {
  const roleCards = buildRoleCards(missingGroups, groupScores);
  return (
    <SectionCard title="Who to Look For" subtitle="Role-focused profiles based on your Career Palace gaps">
      {!hasRecognizedStars ? (
        <div className="text-sm text-gray-600 dark:text-gray-400 text-center py-8">
          No recognized Career Palace stars found for this section.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roleCards.map((card, idx) => (
              <div
                key={`${card.key}-${idx}`}
                className="relative rounded-2xl shadow-lg border bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow overflow-hidden"
              >
                {/* Decorative gradient corner */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-100/40 to-purple-100/40 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-bl-full" />
                
                {/* Header with emoji */}
                <div className="relative text-center mb-5">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg mb-3">
                    <span className="text-3xl">{card.emoji}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {card.focus}
                  </p>
                </div>

                {/* Traits section */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-4 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                      Key Traits
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {card.traits.slice(0, 6).map((trait) => (
                      <span
                        key={trait}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-200 dark:border-indigo-800"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Roles section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                      Role Focus
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{card.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {card.focus}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </SectionCard>
  );
};

export default WhoToLookFor;
