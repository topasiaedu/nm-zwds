/**
 * Nobleman Profile Constants
 * 
 * Contains all nobleman profile definitions, star mappings, and palace objectives
 * based on the ZWDS nobleman identification system.
 */

import type { NoblemanType, NoblemanProfile } from "../types/nobleman";

/**
 * Map nobleman types to their corresponding image filenames
 */
export const NOBLEMAN_TYPE_TO_IMAGE: Record<NoblemanType, string> = {
  older_female: "Nurturing Mentor.png",
  male: "Path Opener.png",
  stable_resource: "Foundation Builder.png",
  younger_junior: "Innovator.png",
  same_generation: "Growth Partner.png",
  authority_high_status: "Authority Figure.png",
  practical_leader: "Execution Doer.png",
  bold_aggressive: "Breakthrough Catalyst.png",
  charismatic_expressive: "Connector.png",
  refined_educated: "Strategist.png",
};

/**
 * Get the image path for a nobleman type
 * 
 * @param noblemanType - The nobleman type identifier
 * @returns Full path to the nobleman image
 */
export function getNoblemanImage(noblemanType: NoblemanType): string {
  const filename = NOBLEMAN_TYPE_TO_IMAGE[noblemanType];
  return `/assets/nobleman/${filename}`;
}

/**
 * Map star names (Chinese) to nobleman types
 * Each star has specific characteristics that define the type of nobleman they represent
 */
export const STAR_TO_NOBLEMAN_TYPE: Record<string, NoblemanType> = {
  // Older Female Nobleman - Tai Yin (Moon)
  "太陰": "older_female",
  "太阴": "older_female", // Simplified
  
  // Male Nobleman - Tai Yang (Sun)
  "太陽": "male",
  "太阳": "male", // Simplified
  
  // Stable & Resource Nobleman - Tian Fu / Tian Liang
  "天府": "stable_resource",
  "天梁": "stable_resource",
  
  // Younger / Junior Nobleman - Tian Tong
  "天同": "younger_junior",
  
  // Same-Generation Nobleman - Tian Ji
  "天機": "same_generation",
  "天机": "same_generation", // Simplified
  
  // Authority / High-Status Nobleman - Zi Wei / Lian Zhen / Tian Xiang
  "紫微": "authority_high_status",
  "廉貞": "authority_high_status",
  "廉贞": "authority_high_status", // Simplified
  "天相": "authority_high_status",
  
  // Practical Leader Nobleman - Wu Qu
  "武曲": "practical_leader",
  
  // Bold & Aggressive Nobleman - Qi Sha / Po Jun
  "七殺": "bold_aggressive",
  "七杀": "bold_aggressive", // Simplified
  "破軍": "bold_aggressive",
  "破军": "bold_aggressive", // Simplified
  
  // Charismatic & Expressive Nobleman - Tan Lang / Ju Men
  "貪狼": "charismatic_expressive",
  "贪狼": "charismatic_expressive", // Simplified
  "巨門": "charismatic_expressive",
  "巨门": "charismatic_expressive", // Simplified
  
  // Refined & Educated Nobleman - Zuo Fu / You Bi / Wen Chang / Wen Qu
  "左輔": "refined_educated",
  "左辅": "refined_educated", // Simplified
  "右弼": "refined_educated",
  "文昌": "refined_educated",
  "文曲": "refined_educated",
};

/**
 * Complete nobleman profile definitions
 * Based on teaching materials with exact characteristics
 */
export const NOBLEMAN_PROFILES: Record<NoblemanType, NoblemanProfile> = {
  older_female: {
    type: "Older Female Nobleman",
    characteristics: "Mature woman, gentle but wise, soft approach, nurturing, emotionally supportive. This is the type of person who gives you calmness and clarity through emotional balance, patience, and guidance.",
    stars: "Tai Yin",
  },
  
  male: {
    type: "Male Nobleman",
    characteristics: "Strong masculine energy, protective, generous, helps through action and leadership. Decisive, bold, action-taker who gives direction, strategy, or leadership. This is someone who 'opens the road' for you.",
    stars: "Tai Yang",
  },
  
  stable_resource: {
    type: "Stable & Resource Nobleman",
    characteristics: "Reliable, someone who provides stability, resources, systems, or long-term support. Grounded, financially steady, they support you through stability, structure, or systems. This is the kind of Nobleman who helps you build long-term foundations.",
    stars: "Tian Fu, Tian Liang",
  },
  
  younger_junior: {
    type: "Younger / Junior Nobleman",
    characteristics: "Fresh ideas, youthful energy, pushes you through new ways of thinking. Brings modern thinking and creativity. They help you see what you've been missing because your perspective may be outdated.",
    stars: "Tian Tong",
  },
  
  same_generation: {
    type: "Same-Generation Nobleman",
    characteristics: "Peer, colleague, grows together with you; supportive through shared goals. Someone who grows alongside you and pushes you through collaboration. Not above you, not below you — same level.",
    stars: "Tian Ji",
  },
  
  authority_high_status: {
    type: "Authority / High-Status Nobleman",
    characteristics: "Boss, manager, or senior leader; authoritative, strategic decision-maker. They guide you through strategy, decisions, and opportunities. If you see these stars, your Nobleman is someone with power or status who can open doors through their influence and network.",
    stars: "Zi Wei, Lian Zhen, Tian Xiang",
  },
  
  practical_leader: {
    type: "Practical Leader Nobleman",
    characteristics: "Finance/operations/management figure; disciplined, resourceful, excels in control & execution. Very execution-focused. They help you get things DONE through practical systems and processes.",
    stars: "Wu Qu",
  },
  
  bold_aggressive: {
    type: "Bold & Aggressive Nobleman",
    characteristics: "Fast, decisive; pushes you to break limits and make disruptive moves. They move fast and push you to break limits. When they appear, big shifts happen. This is a breakthrough-type Nobleman.",
    stars: "Qi Sha, Po Jun",
  },
  
  charismatic_expressive: {
    type: "Charismatic & Expressive Nobleman",
    characteristics: "Social, persuasive, talkative; strong in networking, pitching, negotiating, public presence. Great at negotiation and public presence. They open doors for you through people and communication.",
    stars: "Tan Lang, Ju Men",
  },
  
  refined_educated: {
    type: "Refined & Educated Nobleman",
    characteristics: "Knowledge-based, well-read, skillful in writing, planning, documentation, strategy, creativity. They help you through clarity, structure, or expertise with highly refined skills and education.",
    stars: "Zuo Fu, You Bi, Wen Chang, Wen Qu",
  },
};

/**
 * Palace to life objective mapping
 * Based on teaching slide 1: "Identify Your Objective"
 */
export const PALACE_OBJECTIVES: Record<string, string> = {
  // Mentor, Support, Growth, Breakthrough
  "命宫": "Personal Growth & Breakthrough",
  "命宮": "Personal Growth & Breakthrough",
  "迁移": "Mentor & Support",
  "遷移": "Mentor & Support",
  
  // Inner Peace, Happiness in Life
  "疾厄": "Health & Wellness",
  "福德": "Inner Peace & Happiness",
  
  // Career, Promotion & Achievements
  "官禄": "Career & Achievements",
  "官祿": "Career & Achievements",
  
  // Wealth, Assets & Investment
  "财帛": "Wealth & Investment",
  "財帛": "Wealth & Investment",
  "田宅": "Property & Assets",
  
  // Collaboration, Partnership, Colleagues
  "交友": "Collaboration & Partnership",
  
  // Relationship w/ Bosses, Managers, Elders
  "父母": "Authority Relationships",
  
  // Love Relationships, Peach Blossom Luck
  "夫妻": "Love & Marriage",
  
  // Family Relationship and Bonding
  "兄弟": "Family & Siblings",
  "子女": "Children & Family",
};

/**
 * 4 key life areas for "Other Life Areas" section
 * These are the most commonly sought objectives
 */
export const KEY_LIFE_AREAS = [
  {
    palaceName: "官禄",
    palaceNameTraditional: "官祿",
    objective: "Career Growth",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    palaceName: "财帛",
    palaceNameTraditional: "財帛",
    objective: "Wealth Building",
    gradient: "from-amber-800 to-orange-800",
  },
  {
    palaceName: "疾厄",
    palaceNameTraditional: "疾厄",
    objective: "Health & Wellness",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    palaceName: "命宫",
    palaceNameTraditional: "命宮",
    objective: "Personal Growth",
    gradient: "from-purple-500 to-pink-500",
  },
] as const;

/**
 * English palace name translations
 * Used for display purposes
 */
export const PALACE_NAME_TRANSLATIONS: Record<string, string> = {
  "命宫": "Life Palace",
  "命宮": "Life Palace",
  "兄弟": "Siblings Palace",
  "夫妻": "Spouse Palace",
  "子女": "Children Palace",
  "财帛": "Wealth Palace",
  "財帛": "Wealth Palace",
  "疾厄": "Health Palace",
  "迁移": "Travel Palace",
  "遷移": "Travel Palace",
  "交友": "Friends Palace",
  "官禄": "Career Palace",
  "官祿": "Career Palace",
  "田宅": "Property Palace",
  "福德": "Wellbeing Palace",
  "父母": "Parents Palace",
};
