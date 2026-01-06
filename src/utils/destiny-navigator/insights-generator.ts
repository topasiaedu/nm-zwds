/**
 * Mock Insights Generator
 * Generates contextually relevant AI-style insights based on aspect, timeframe, and chart data
 */

import { ChartData, Palace } from "../zwds/types";
import { LifeAspect, TimeFrame } from "../../types/destiny-navigator";

/**
 * Insight data structure
 */
export interface InsightData {
  title: string;
  summary: string;
  keyInsights: string[];
  actionPoints: string[];
  palaceStars: string[];
}

/**
 * Generate mock insights based on user's selection
 * @param aspect - The life aspect selected
 * @param timeframe - The timeframe selected
 * @param palaceNumber - The palace number being analyzed
 * @param chartData - Complete chart data
 * @returns Contextually relevant insight data
 */
export function generateMockInsights(
  aspect: LifeAspect,
  timeframe: TimeFrame,
  palaceNumber: number | null,
  chartData: ChartData
): InsightData {
  if (!palaceNumber) {
    return getDefaultInsights(aspect, timeframe);
  }

  const palace = chartData.palaces[palaceNumber - 1];
  const stars = getStarsInPalace(palace);

  // Generate insights based on aspect and timeframe combination
  const key = `${aspect}-${timeframe}` as const;
  
  switch (key) {
    // Career combinations
    case "career-natal":
      return generateCareerNatalInsights(palace, stars);
    case "career-dayun":
      return generateCareerDayunInsights(palace, stars, chartData);
    case "career-liunian":
      return generateCareerLiuNianInsights(palace, stars);
    case "career-liumonth":
      return generateCareerLiuMonthInsights(palace, stars);

    // Wealth combinations
    case "wealth-natal":
      return generateWealthNatalInsights(palace, stars);
    case "wealth-dayun":
      return generateWealthDayunInsights(palace, stars, chartData);
    case "wealth-liunian":
      return generateWealthLiuNianInsights(palace, stars);
    case "wealth-liumonth":
      return generateWealthLiuMonthInsights(palace, stars);

    // Relationships combinations
    case "relationships-natal":
      return generateRelationshipsNatalInsights(palace, stars);
    case "relationships-dayun":
      return generateRelationshipsDayunInsights(palace, stars, chartData);
    case "relationships-liunian":
      return generateRelationshipsLiuNianInsights(palace, stars);
    case "relationships-liumonth":
      return generateRelationshipsLiuMonthInsights(palace, stars);

    // Health combinations
    case "health-natal":
      return generateHealthNatalInsights(palace, stars);
    case "health-dayun":
      return generateHealthDayunInsights(palace, stars, chartData);
    case "health-liunian":
      return generateHealthLiuNianInsights(palace, stars);
    case "health-liumonth":
      return generateHealthLiuMonthInsights(palace, stars);

    // Social combinations
    case "social-natal":
      return generateSocialNatalInsights(palace, stars);
    case "social-dayun":
      return generateSocialDayunInsights(palace, stars, chartData);
    case "social-liunian":
      return generateSocialLiuNianInsights(palace, stars);
    case "social-liumonth":
      return generateSocialLiuMonthInsights(palace, stars);

    // Home combinations
    case "home-natal":
      return generateHomeNatalInsights(palace, stars);
    case "home-dayun":
      return generateHomeDayunInsights(palace, stars, chartData);
    case "home-liunian":
      return generateHomeLiuNianInsights(palace, stars);
    case "home-liumonth":
      return generateHomeLiuMonthInsights(palace, stars);

    default:
      return getDefaultInsights(aspect, timeframe);
  }
}

/**
 * Extract star names from a palace
 */
function getStarsInPalace(palace: Palace): string[] {
  const stars: string[] = [];
  
  if (palace.mainStar) {
    stars.push(...palace.mainStar.map(s => s.name));
  }
  if (palace.minorStars) {
    stars.push(...palace.minorStars.map(s => s.name));
  }
  
  return stars;
}

// ===== CAREER INSIGHTS =====

function generateCareerNatalInsights(palace: Palace, stars: string[]): InsightData {
  const hasZiwei = stars.some(s => s.includes("紫微"));
  const hasTianJi = stars.some(s => s.includes("天机"));
  
  return {
    title: "Your Innate Career Blueprint",
    summary: hasZiwei 
      ? "Your natural career path is one of leadership and authority. You possess inherent qualities that draw people to follow your vision."
      : "Your professional foundation reveals unique strengths that shape your career trajectory throughout life.",
    keyInsights: [
      hasZiwei ? "Natural leadership abilities position you for executive roles" : "Strategic thinking is your strongest professional asset",
      hasTianJi ? "Analytical skills and adaptability serve you well in dynamic environments" : "Steady persistence leads to long-term career success",
      `The presence of ${stars.join(", ") || "key stars"} suggests strong professional potential`,
      "Your career success comes through authentic expression of your talents"
    ],
    actionPoints: [
      "Seek roles that allow you to leverage your natural strengths",
      "Build a professional network aligned with your values",
      "Focus on long-term career development rather than quick wins",
      "Consider mentorship opportunities to accelerate growth"
    ],
    palaceStars: stars
  };
}

function generateCareerDayunInsights(palace: Palace, stars: string[], chartData: ChartData): InsightData {
  const ageRange = palace.majorLimit ? `${palace.majorLimit.startAge}-${palace.majorLimit.endAge}` : "current";
  
  return {
    title: "Career Growth in Your Current Decade Cycle",
    summary: `You are in a pivotal 10-year phase (ages ${ageRange}) where your professional path takes on new dimensions and opportunities for advancement.`,
    keyInsights: [
      "This decade brings enhanced visibility in your chosen field",
      "Leadership opportunities emerge naturally during this cycle",
      "Strategic partnerships formed now have lasting impact",
      "Recognition from authority figures is highly favorable"
    ],
    actionPoints: [
      "Take on projects with long-term strategic value",
      "Document your achievements for future opportunities",
      "Build relationships with mentors and influential figures",
      "Invest in skill development that compounds over time"
    ],
    palaceStars: stars
  };
}

function generateCareerLiuNianInsights(palace: Palace, stars: string[]): InsightData {
  const currentYear = new Date().getFullYear();
  
  return {
    title: `Career Opportunities in ${currentYear}`,
    summary: "This year's energies create specific windows for professional advancement. Timing your actions to align with these influences maximizes success.",
    keyInsights: [
      "Q1-Q2: Focus on building foundations and strategic planning",
      "Q2-Q3: Prime time for launching new initiatives or seeking promotions",
      "Q3-Q4: Networking and relationship building yield best results",
      "Year-end: Harvest the results of earlier efforts and plan ahead"
    ],
    actionPoints: [
      "Update your resume and professional portfolio this quarter",
      "Schedule important meetings or presentations during favorable months",
      "Reach out to dormant professional connections",
      "Consider taking on a visible project that showcases your skills"
    ],
    palaceStars: stars
  };
}

function generateCareerLiuMonthInsights(palace: Palace, stars: string[]): InsightData {
  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  
  return {
    title: `Career Focus for ${currentMonth}`,
    summary: "This month's energy pattern suggests specific areas where your professional efforts will yield the best returns.",
    keyInsights: [
      "Early month: Set clear intentions and prioritize key projects",
      "Mid-month: Collaborative efforts and team dynamics are highlighted",
      "Late month: Focus on completion and preparing for next phase",
      "Throughout: Maintain consistent communication with stakeholders"
    ],
    actionPoints: [
      "Schedule your most important meetings in the first half of the month",
      "Dedicate time for focused, deep work on complex projects",
      "Follow up on pending decisions or approvals",
      "Plan next month's priorities before month-end"
    ],
    palaceStars: stars
  };
}

// ===== WEALTH INSIGHTS =====

function generateWealthNatalInsights(palace: Palace, stars: string[]): InsightData {
  return {
    title: "Your Innate Wealth Blueprint",
    summary: "Your natural approach to finances is grounded in specific patterns that influence how you accumulate and manage resources throughout life.",
    keyInsights: [
      "Steady accumulation rather than risky ventures suits your nature best",
      "Partnerships and collaborations enhance your earning potential",
      "Property and tangible assets provide long-term security",
      "Financial wisdom grows with experience and patient learning"
    ],
    actionPoints: [
      "Build emergency reserves as your first financial priority",
      "Explore investment opportunities with trusted advisors",
      "Consider real estate as part of your wealth-building strategy",
      "Develop multiple income streams for financial stability"
    ],
    palaceStars: stars
  };
}

function generateWealthDayunInsights(palace: Palace, stars: string[], chartData: ChartData): InsightData {
  return {
    title: "Wealth Expansion in This Decade Cycle",
    summary: "The current 10-year period brings specific opportunities for financial growth and wealth accumulation through strategic actions.",
    keyInsights: [
      "Major financial opportunities arise through professional advancement",
      "This cycle favors building wealth infrastructure over quick gains",
      "Strategic investments made now compound significantly",
      "Financial partnerships formed in this period are particularly favorable"
    ],
    actionPoints: [
      "Review and optimize your investment portfolio",
      "Consider increasing retirement contributions during high-earning years",
      "Explore passive income opportunities that align with your skills",
      "Build relationships with financial mentors and advisors"
    ],
    palaceStars: stars
  };
}

function generateWealthLiuNianInsights(palace: Palace, stars: string[]): InsightData {
  return {
    title: "Financial Opportunities This Year",
    summary: "This year's financial energies create specific windows for wealth-building activities. Strategic timing enhances results.",
    keyInsights: [
      "First half: Focus on increasing income and negotiating better terms",
      "Mid-year: Favorable for major purchases or investment decisions",
      "Second half: Consolidate gains and optimize existing resources",
      "Year-round: Maintain disciplined saving and budgeting habits"
    ],
    actionPoints: [
      "Schedule salary negotiations or rate increases in favorable months",
      "Review subscriptions and recurring expenses for optimization",
      "Research investment opportunities that align with your goals",
      "Set specific savings targets and track progress monthly"
    ],
    palaceStars: stars
  };
}

function generateWealthLiuMonthInsights(palace: Palace, stars: string[]): InsightData {
  return {
    title: "Monthly Financial Focus",
    summary: "This month's energy supports specific financial activities. Align your money moves with these favorable patterns.",
    keyInsights: [
      "Early month: Review budget and adjust spending categories",
      "Mid-month: Good timing for negotiating deals or contracts",
      "Late month: Focus on bill payments and financial organization",
      "Throughout: Track daily expenses to identify saving opportunities"
    ],
    actionPoints: [
      "Make one significant financial decision this month",
      "Automate one new savings or investment contribution",
      "Review and pay bills on time to maintain good credit",
      "Research one new financial learning topic or strategy"
    ],
    palaceStars: stars
  };
}

// ===== RELATIONSHIPS INSIGHTS =====

function generateRelationshipsNatalInsights(palace: Palace, stars: string[]): InsightData {
  return {
    title: "Your Relationship Blueprint",
    summary: "Your innate approach to partnerships reveals specific patterns in how you connect, commit, and grow with others.",
    keyInsights: [
      "Deep, meaningful connections matter more than superficial interactions",
      "Loyalty and trust form the foundation of your relationships",
      "You seek partners who support your personal growth journey",
      "Long-term commitment comes naturally when values align"
    ],
    actionPoints: [
      "Communicate your needs and boundaries clearly with partners",
      "Invest time in relationships that feel mutually supportive",
      "Practice vulnerability to deepen emotional connections",
      "Honor your intuition about people and partnerships"
    ],
    palaceStars: stars
  };
}

function generateRelationshipsDayunInsights(palace: Palace, stars: string[], chartData: ChartData): InsightData {
  return {
    title: "Relationship Dynamics in This Decade",
    summary: "The current 10-year cycle brings significant developments in your partnership journey and relationship patterns.",
    keyInsights: [
      "This cycle brings opportunities for deepening existing bonds",
      "New relationships formed now have lasting significance",
      "Healing old relationship patterns creates space for growth",
      "Partnership opportunities align with your life purpose"
    ],
    actionPoints: [
      "Be open to meeting people in unexpected contexts",
      "Work on personal growth to attract aligned partnerships",
      "Address unresolved issues from past relationships",
      "Cultivate qualities you seek in a partner within yourself"
    ],
    palaceStars: stars
  };
}

function generateRelationshipsLiuNianInsights(palace: Palace, stars: string[]): InsightData {
  return {
    title: "Relationship Focus This Year",
    summary: "This year's relationship energies highlight specific areas for growth, connection, and partnership development.",
    keyInsights: [
      "Spring: New connections and social opportunities increase",
      "Summer: Deepening of existing relationships and commitments",
      "Fall: Reassessment and realignment of partnership dynamics",
      "Winter: Integration and preparation for next relationship phase"
    ],
    actionPoints: [
      "Attend social events or join groups aligned with your interests",
      "Have important relationship conversations during favorable months",
      "Practice active listening and empathy with your partner",
      "Create shared experiences that strengthen your bond"
    ],
    palaceStars: stars
  };
}

function generateRelationshipsLiuMonthInsights(palace: Palace, stars: string[]): InsightData {
  return {
    title: "Monthly Relationship Guidance",
    summary: "This month's energy supports specific relationship activities and opportunities for connection.",
    keyInsights: [
      "Early month: Initiate important relationship conversations",
      "Mid-month: Quality time and shared activities strengthen bonds",
      "Late month: Reflect on relationship patterns and needs",
      "Throughout: Practice gratitude and appreciation daily"
    ],
    actionPoints: [
      "Plan at least one meaningful date or quality time activity",
      "Express appreciation to your partner or close friends",
      "Address any small issues before they become larger problems",
      "Make time for both connection and personal space"
    ],
    palaceStars: stars
  };
}

// ===== HEALTH INSIGHTS =====

function generateHealthNatalInsights(palace: Palace, stars: string[]): InsightData {
  return {
    title: "Your Health & Vitality Blueprint",
    summary: "Your innate constitution and energy patterns provide a roadmap for maintaining optimal wellness throughout life.",
    keyInsights: [
      "Prevention and regular maintenance serve you better than reactive treatment",
      "Mind-body connection strongly influences your physical wellbeing",
      "Consistent routines and habits support your natural energy rhythms",
      "Stress management is key to maintaining overall health balance"
    ],
    actionPoints: [
      "Establish a consistent sleep schedule that works for your body",
      "Find physical activities you genuinely enjoy and can sustain",
      "Schedule regular health checkups and preventive screenings",
      "Develop stress-reduction practices that fit your lifestyle"
    ],
    palaceStars: stars
  };
}

function generateHealthDayunInsights(palace: Palace, stars: string[], chartData: ChartData): InsightData {
  return {
    title: "Health Focus for This Decade",
    summary: "The current 10-year cycle highlights specific areas of health that benefit from extra attention and care.",
    keyInsights: [
      "This cycle favors building sustainable health habits",
      "Energy levels and vitality respond well to consistent routines",
      "Mind-body practices yield particularly strong results now",
      "Investments in health infrastructure pay long-term dividends"
    ],
    actionPoints: [
      "Establish one new health habit that you can maintain long-term",
      "Address any chronic issues with professional guidance",
      "Build physical strength and flexibility for aging well",
      "Create a supportive environment that reinforces healthy choices"
    ],
    palaceStars: stars
  };
}

function generateHealthLiuNianInsights(palace: Palace, stars: string[]): InsightData {
  return {
    title: "Health Priorities This Year",
    summary: "This year's energy patterns suggest specific health focus areas and favorable timing for wellness initiatives.",
    keyInsights: [
      "Spring: Excellent time for detox, renewal, and fresh starts",
      "Summer: Build strength, endurance, and outdoor activity",
      "Fall: Focus on immune support and seasonal transitions",
      "Winter: Rest, recovery, and internal restoration"
    ],
    actionPoints: [
      "Schedule annual physical and dental checkups",
      "Start or refine one key exercise routine",
      "Improve nutrition by adding more whole foods",
      "Prioritize sleep quality and consistent bedtime"
    ],
    palaceStars: stars
  };
}

function generateHealthLiuMonthInsights(palace: Palace, stars: string[]): InsightData {
  return {
    title: "Monthly Health Guidance",
    summary: "This month's energy supports specific wellness activities and health optimization efforts.",
    keyInsights: [
      "Early month: Set health intentions and plan activities",
      "Mid-month: Focus on consistent execution of health habits",
      "Late month: Review progress and adjust strategies",
      "Throughout: Listen to your body's signals and needs"
    ],
    actionPoints: [
      "Try one new healthy recipe or meal prep strategy",
      "Schedule any needed medical appointments",
      "Track energy levels to identify patterns",
      "Practice mindfulness or meditation daily"
    ],
    palaceStars: stars
  };
}

// ===== SOCIAL INSIGHTS =====

function generateSocialNatalInsights(palace: Palace, stars: string[]): InsightData {
  return {
    title: "Your Social Nature & Friendships",
    summary: "Your natural approach to friendships and social connections reveals how you build and maintain your support network.",
    keyInsights: [
      "Quality of connections matters far more than quantity",
      "You attract friends who share your values and vision",
      "Loyal friendships formed early often last a lifetime",
      "You serve as a trusted advisor within your social circles"
    ],
    actionPoints: [
      "Invest time in friendships that feel mutually enriching",
      "Be selective about who gets access to your time and energy",
      "Organize gatherings that bring your circles together",
      "Express appreciation to friends who support your growth"
    ],
    palaceStars: stars
  };
}

function generateSocialDayunInsights(palace: Palace, stars: string[], chartData: ChartData): InsightData {
  return {
    title: "Social Dynamics This Decade",
    summary: "The current 10-year cycle brings evolution in your social circles and friendship patterns.",
    keyInsights: [
      "Your social network naturally expands through professional growth",
      "New friendships formed now align with your life direction",
      "Some relationships naturally complete while others deepen",
      "You attract friends who support your next-level growth"
    ],
    actionPoints: [
      "Join communities or groups aligned with your interests",
      "Be open to friendships with people from diverse backgrounds",
      "Let go of relationships that no longer serve mutual growth",
      "Cultivate friendships that inspire and challenge you"
    ],
    palaceStars: stars
  };
}

function generateSocialLiuNianInsights(palace: Palace, stars: string[]): InsightData {
  return {
    title: "Social Opportunities This Year",
    summary: "This year's social energies create specific opportunities for expanding and deepening your connections.",
    keyInsights: [
      "New friendships blossom through shared activities and interests",
      "Existing friendships deepen through meaningful experiences",
      "Social networks open doors to unexpected opportunities",
      "Community involvement brings personal satisfaction"
    ],
    actionPoints: [
      "Say yes to social invitations even when you feel hesitant",
      "Host a gathering or event for your social circles",
      "Reconnect with friends you've lost touch with",
      "Join at least one new social group or community"
    ],
    palaceStars: stars
  };
}

function generateSocialLiuMonthInsights(palace: Palace, stars: string[]): InsightData {
  return {
    title: "Monthly Social Focus",
    summary: "This month's energy favors specific social activities and connection opportunities.",
    keyInsights: [
      "Early month: Reach out to reconnect with friends",
      "Mid-month: Attend social events and group activities",
      "Late month: One-on-one deep conversations strengthen bonds",
      "Throughout: Balance social time with personal restoration"
    ],
    actionPoints: [
      "Schedule at least two social activities this month",
      "Send messages to three friends you haven't talked to recently",
      "Be fully present during social interactions (minimize phone use)",
      "Introduce friends from different circles to each other"
    ],
    palaceStars: stars
  };
}

// ===== HOME INSIGHTS =====

function generateHomeNatalInsights(palace: Palace, stars: string[]): InsightData {
  return {
    title: "Your Home & Foundation Blueprint",
    summary: "Your innate relationship with home, property, and roots shapes how you create stability and security in life.",
    keyInsights: [
      "Home serves as your sanctuary and energy recharge space",
      "Property ownership provides both financial and emotional security",
      "You invest in creating comfortable, harmonious living spaces",
      "Family roots and traditions hold meaningful significance"
    ],
    actionPoints: [
      "Create spaces in your home that support your wellbeing",
      "Consider property investment as part of long-term planning",
      "Establish routines that make your home feel nurturing",
      "Honor your need for a stable, secure home base"
    ],
    palaceStars: stars
  };
}

function generateHomeDayunInsights(palace: Palace, stars: string[], chartData: ChartData): InsightData {
  return {
    title: "Home & Property in This Decade",
    summary: "The current 10-year cycle brings significant developments in your home situation and property matters.",
    keyInsights: [
      "Major home transitions or property decisions are favored",
      "Investments in property yield long-term benefits",
      "Creating your ideal living environment takes priority",
      "Home-based opportunities or businesses show promise"
    ],
    actionPoints: [
      "Assess whether your current living situation serves your growth",
      "Research property markets if considering purchase or sale",
      "Invest in home improvements that enhance daily living",
      "Consider how your home supports your life goals"
    ],
    palaceStars: stars
  };
}

function generateHomeLiuNianInsights(palace: Palace, stars: string[]): InsightData {
  return {
    title: "Home Focus This Year",
    summary: "This year's energies support specific home-related activities, from organization to major transitions.",
    keyInsights: [
      "Excellent year for home improvements and renovations",
      "Property transactions are favored during key months",
      "Organizing and decluttering creates space for growth",
      "Home becomes a hub for social and family activities"
    ],
    actionPoints: [
      "Tackle one major home organization or improvement project",
      "Research mortgage rates if considering property purchase",
      "Create dedicated spaces for work, rest, and creativity",
      "Enhance your home's energy with plants, art, or updates"
    ],
    palaceStars: stars
  };
}

function generateHomeLiuMonthInsights(palace: Palace, stars: string[]): InsightData {
  return {
    title: "Monthly Home Guidance",
    summary: "This month's energy supports specific home-related activities and property matters.",
    keyInsights: [
      "Early month: Plan home projects and set organizational goals",
      "Mid-month: Execute home improvements and decluttering",
      "Late month: Enjoy your refreshed space and plan next steps",
      "Throughout: Create daily habits that maintain order and peace"
    ],
    actionPoints: [
      "Complete one room organization or cleaning project",
      "Address any needed home repairs or maintenance",
      "Add something beautiful or functional to your living space",
      "Establish a daily tidying routine that works for you"
    ],
    palaceStars: stars
  };
}

// ===== DEFAULT FALLBACK =====

function getDefaultInsights(aspect: LifeAspect, timeframe: TimeFrame): InsightData {
  const aspectLabels: Record<LifeAspect, string> = {
    life: "Self & Identity",
    siblings: "Siblings & Peers",
    relationships: "Love & Marriage",
    children: "Children & Creativity",
    wealth: "Wealth & Resources",
    health: "Health & Wellbeing",
    travel: "Travel & Change",
    social: "Friends & Networks",
    career: "Career & Status",
    home: "Property & Assets",
    fortune: "Happiness & Spirit",
    parents: "Parents & Mentors"
  };

  const timeframeLabels: Record<TimeFrame, string> = {
    natal: "Core Blueprint",
    dayun: "Decade Cycle",
    liunian: "Annual Forecast",
    liumonth: "Monthly Rhythm"
  };

  return {
    title: `${aspectLabels[aspect]} - ${timeframeLabels[timeframe]}`,
    summary: "Analyzing your chart to provide personalized insights for this life area...",
    keyInsights: [
      "Your unique chart configuration reveals important patterns",
      "The stars in this palace influence this area of life",
      "Timing and cycles play a crucial role in manifestation",
      "Understanding these energies helps you navigate more effectively"
    ],
    actionPoints: [
      "Reflect on how this area currently manifests in your life",
      "Consider how past patterns inform future opportunities",
      "Explore different timeframes to see how energies shift",
      "Use these insights as guidance for conscious decision-making"
    ],
    palaceStars: []
  };
}
