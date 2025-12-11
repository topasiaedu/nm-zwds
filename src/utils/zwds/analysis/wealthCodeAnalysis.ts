/**
 * Wealth Code Analysis
 * Analyzes stars in the Wealth Palace to determine natural wealth-building strengths
 */

import { ChartData, Palace } from "../types";
import {
  WealthCodeKey,
  WealthCodeScore,
  StarWealthData,
  CareerRecommendation,
  getStarWealthData,
  isRecognizedWealthStar,
  WEALTH_CODE_LABELS,
} from "../analysis_constants/wealth_code_mapping";

/**
 * Profile type based on score distribution
 */
export type WealthProfileType = "specialized" | "balanced" | "hybrid";

/**
 * Individual star's contribution to wealth profile
 */
export interface StarWealthProfile {
  name: string;
  chineseName: string;
  primaryWealthCode: WealthCodeKey;
  scores: WealthCodeScore[];
  shortNote: string;
}

/**
 * Complete wealth profile analysis result
 */
export interface WealthProfile {
  clientName: string;
  dominantArchetype: string;
  summaryText: string;
  codes: WealthCodeScore[];
  stars: StarWealthProfile[];
  strengths: string[];
  blindSpots: string[];
  idealRoles: CareerRecommendation[];
  nonIdealRoles: CareerRecommendation[];
  profileType: WealthProfileType;
  hasRecognizedStars: boolean;
}

/**
 * Helper function to find palace by name
 */
const findPalaceByName = (chartData: ChartData, palaceName: string): Palace | null => {
  return chartData.palaces.find((palace) => palace.name === palaceName) || null;
};

/**
 * Summary text templates for each dominant archetype
 */
const ARCHETYPE_SUMMARIES: Record<WealthCodeKey, string> = {
  strategyPlanner:
    "Natural ability to see the big picture and build systematic frameworks for long-term success. Strong at identifying patterns, anticipating challenges, and creating actionable roadmaps. Excel in roles requiring vision, structure, and strategic planning.",
  investmentBrain:
    "Win through logic, long-term planning, and capital efficiency. Don't chase money randomly — you want structure, clarity, and control. Build wealth through disciplined decisions, asset accumulation, and proven systems that last.",
  brandingMagnet:
    "Monetize visibility, charisma, and social attention. Your brand is your power — the world pays those who are seen and remembered. Natural ability to attract opportunities through presence, influence, and magnetic personality.",
  collaborator:
    "Win through deep trust and team power. Not here to do it alone — you shine in partnerships, service-based roles, and people-oriented paths. Loyal, emotionally intelligent, and relationship-driven wealth builder.",
};

/**
 * Strength patterns for each wealth code
 */
const WEALTH_CODE_STRENGTHS: Record<WealthCodeKey, string[]> = {
  strategyPlanner: [
    "Strategic Vision",
    "Systems Thinking",
    "Long-term Focus",
    "Pattern Recognition",
    "Structured Planning",
    "Process Design",
  ],
  investmentBrain: [
    "Financial Discipline",
    "Asset Management",
    "Risk Assessment",
    "Cash Flow Control",
    "Long-term Investing",
    "Resource Allocation",
  ],
  brandingMagnet: [
    "Personal Magnetism",
    "Social Influence",
    "Public Speaking",
    "Visibility Creation",
    "Relationship Building",
    "Charismatic Leadership",
  ],
  collaborator: [
    "Team Coordination",
    "Emotional Intelligence",
    "Loyalty & Trust",
    "Partnership Building",
    "Support Excellence",
    "Relationship Nurturing",
  ],
};

/**
 * Blind spot patterns for each wealth code
 */
const WEALTH_CODE_BLINDSPOTS: Record<WealthCodeKey, string[]> = {
  strategyPlanner: [
    "Over-planning",
    "Analysis Paralysis",
    "Delegation Challenges",
    "Perfectionism",
  ],
  investmentBrain: [
    "Risk Aversion",
    "Slow to Adapt",
    "Over-Caution",
    "Missing Fast Opportunities",
  ],
  brandingMagnet: [
    "Substance over Style",
    "Consistency Challenges",
    "Burnout from Visibility",
    "Over-Extension",
  ],
  collaborator: [
    "Over-Dependence",
    "Boundary Issues",
    "People-Pleasing",
    "Difficulty Going Solo",
  ],
};

/**
 * Calculate profile type based on score distribution
 */
function determineProfileType(scores: WealthCodeScore[]): WealthProfileType {
  if (scores.length < 2) return "specialized";

  const [highest, secondHighest] = scores;

  // Specialized: One code dominates (>7.5, others <6)
  if (highest.score > 7.5 && secondHighest.score < 6) {
    return "specialized";
  }

  // Balanced: All codes relatively even (within 2 points of each other)
  const maxScore = highest.score;
  const minScore = Math.min(...scores.map((s) => s.score));
  if (maxScore - minScore <= 2) {
    return "balanced";
  }

  // Hybrid: 2 codes are strong (both > 6.5, gap < 2.5)
  if (
    highest.score > 6.5 &&
    secondHighest.score > 6.5 &&
    highest.score - secondHighest.score < 2.5
  ) {
    return "hybrid";
  }

  return "specialized";
}

/**
 * Aggregate scores from multiple stars
 * Uses weighted average to prevent artificially high scores
 */
function aggregateScores(
  starProfiles: StarWealthData[]
): WealthCodeScore[] {
  const codeKeys: WealthCodeKey[] = [
    "investmentBrain",
    "brandingMagnet",
    "strategyPlanner",
    "collaborator",
  ];

  const aggregated = codeKeys.map((key) => {
    // Get all scores for this wealth code from all stars
    const scoresForCode = starProfiles.flatMap((star) =>
      star.scores.filter((s) => s.key === key).map((s) => s.score)
    );

    if (scoresForCode.length === 0) {
      return {
        key,
        label: WEALTH_CODE_LABELS[key],
        score: 0,
      };
    }

    // Use weighted average: first star has full weight, additional stars have diminishing weight
    // This prevents artificially inflating scores when multiple stars of same type exist
    let totalScore = 0;
    let totalWeight = 0;

    scoresForCode.forEach((score, index) => {
      const weight = 1 / (index + 1); // 1, 0.5, 0.33, 0.25, etc.
      totalScore += score * weight;
      totalWeight += weight;
    });

    const averageScore = totalScore / totalWeight;

    // Cap at 10
    const finalScore = Math.min(averageScore, 10);

    return {
      key,
      label: WEALTH_CODE_LABELS[key],
      score: Number.parseFloat(finalScore.toFixed(1)),
    };
  });

  // Sort by score descending
  return aggregated.sort((a, b) => b.score - a.score);
}

/**
 * Collect all unique career recommendations from stars
 */
function aggregateCareers(
  starProfiles: StarWealthData[],
  type: "ideal" | "nonIdeal"
): CareerRecommendation[] {
  const careerMap = new Map<string, CareerRecommendation>();

  starProfiles.forEach((star) => {
    const careers =
      type === "ideal" ? star.idealCareers : star.nonIdealCareers;
    careers.forEach((career) => {
      // Use role as key to prevent duplicates
      if (!careerMap.has(career.role)) {
        careerMap.set(career.role, career);
      }
    });
  });

  return Array.from(careerMap.values());
}

/**
 * Main analysis function: Analyze Wealth Code from chart data
 */
export function analyzeWealthCode(chartData: ChartData): WealthProfile {
  const clientName = chartData.input.name || "Client";

  // Extract Wealth Palace by name (财帛)
  const wealthPalace = findPalaceByName(chartData, "财帛");

  // Handle case: Wealth Palace not found
  if (!wealthPalace) {
    return {
      clientName,
      dominantArchetype: "Unknown",
      summaryText:
        "Unable to locate Wealth Palace in your chart. Please ensure your birth information is correct.",
      codes: [],
      stars: [],
      strengths: [],
      blindSpots: [],
      idealRoles: [],
      nonIdealRoles: [],
      profileType: "specialized",
      hasRecognizedStars: false,
    };
  }

  // Helper function to collect stars from a palace
  const collectStarsFromPalace = (palace: Palace): { name: string; type: string }[] => {
    const stars: { name: string; type: string }[] = [];

    // Main stars
    if (palace.mainStar && Array.isArray(palace.mainStar)) {
      palace.mainStar.forEach((star) => {
        stars.push({ name: star.name, type: "main" });
      });
    }

    // Minor stars
    if (palace.minorStars && Array.isArray(palace.minorStars)) {
      palace.minorStars.forEach((star) => {
        stars.push({ name: star.name, type: "minor" });
      });
    }

    // Auxiliary stars
    if (palace.auxiliaryStars && Array.isArray(palace.auxiliaryStars)) {
      palace.auxiliaryStars.forEach((star) => {
        stars.push({ name: star.name, type: "auxiliary" });
      });
    }

    return stars;
  };

  // Collect all stars from Wealth Palace
  let allStars = collectStarsFromPalace(wealthPalace);

  // Edge case: If Wealth Palace is empty, borrow from Well-being Palace (福德)
  if (allStars.length === 0) {
    const wellBeingPalace = findPalaceByName(chartData, "福德");
    
    if (wellBeingPalace) {
      allStars = collectStarsFromPalace(wellBeingPalace);
    }
  }

  // Filter to only recognized stars and get their wealth data
  const recognizedStarData: StarWealthData[] = [];
  const starProfiles: StarWealthProfile[] = [];

  allStars.forEach((star) => {
    if (isRecognizedWealthStar(star.name)) {
      const starData = getStarWealthData(star.name);
      if (starData) {
        recognizedStarData.push(starData);
        starProfiles.push({
          name: starData.englishName,
          chineseName: starData.chineseName,
          primaryWealthCode: starData.primaryWealthCode,
          scores: starData.scores,
          shortNote: starData.shortNote,
        });
      }
    }
  });

  // Handle case: No recognized stars
  if (recognizedStarData.length === 0) {
    return {
      clientName,
      dominantArchetype: "Unknown",
      summaryText:
        "No recognized wealth-building stars found in your Wealth Palace. This section analyzes major stars that directly influence your natural money-making approach.",
      codes: [],
      stars: [],
      strengths: [],
      blindSpots: [],
      idealRoles: [],
      nonIdealRoles: [],
      profileType: "specialized",
      hasRecognizedStars: false,
    };
  }

  // Aggregate scores from all recognized stars
  const aggregatedCodes = aggregateScores(recognizedStarData);

  // Determine dominant archetype (highest score)
  const dominantCode = aggregatedCodes[0];
  const dominantArchetype = dominantCode.label;

  // Get summary text
  const summaryText = ARCHETYPE_SUMMARIES[dominantCode.key];

  // Determine profile type
  const profileType = determineProfileType(aggregatedCodes);

  // Select strengths and blind spots based on top 2 wealth codes
  const topTwoCodes = aggregatedCodes.slice(0, 2);
  const strengths: string[] = [];
  const blindSpots: string[] = [];

  topTwoCodes.forEach((code) => {
    const codeStrengths = WEALTH_CODE_STRENGTHS[code.key];
    const codeBlindSpots = WEALTH_CODE_BLINDSPOTS[code.key];

    // Add up to 2 strengths from each top code
    strengths.push(...codeStrengths.slice(0, 2));
    // Add up to 2 blind spots from each top code
    blindSpots.push(...codeBlindSpots.slice(0, 2));
  });

  // Aggregate career recommendations
  const idealRoles = aggregateCareers(recognizedStarData, "ideal");
  const nonIdealRoles = aggregateCareers(recognizedStarData, "nonIdeal");

  return {
    clientName,
    dominantArchetype,
    summaryText,
    codes: aggregatedCodes,
    stars: starProfiles,
    strengths: strengths.slice(0, 4), // Limit to 4 strengths
    blindSpots: blindSpots.slice(0, 4), // Limit to 4 blind spots
    idealRoles: idealRoles.slice(0, 6), // Limit to 6 ideal roles
    nonIdealRoles: nonIdealRoles.slice(0, 4), // Limit to 4 non-ideal roles
    profileType,
    hasRecognizedStars: true,
  };
}

/**
 * Export analysis result type for use in components
 */
export type WealthCodeAnalysisResult = WealthProfile;
