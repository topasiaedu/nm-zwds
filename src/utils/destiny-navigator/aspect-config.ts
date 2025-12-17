/**
 * Configuration for life aspect selections in Destiny Navigator
 * Maps user-facing aspects to their corresponding ZWDS palace names
 */

import { AspectConfig } from "../../types/destiny-navigator";

/**
 * Array of all available life aspects with their configuration
 * Each aspect maps to a specific palace in the ZWDS chart
 * Ordered according to the traditional 12 palace sequence
 */
export const ASPECT_CONFIGS: AspectConfig[] = [
  {
    key: "life",
    label: "Self & Identity",
    icon: "⭐",
    description: "Discover your core essence and life purpose",
    palaceName: "命宫"
  },
  {
    key: "siblings",
    label: "Siblings & Peers",
    icon: "👫",
    description: "Explore relationships with siblings and peers",
    palaceName: "兄弟"
  },
  {
    key: "relationships",
    label: "Love & Marriage",
    icon: "💞",
    description: "Discover insights about your romantic connections",
    palaceName: "夫妻"
  },
  {
    key: "children",
    label: "Children & Creativity",
    icon: "👶",
    description: "Understand your relationship with children and creative expression",
    palaceName: "子女"
  },
  {
    key: "wealth",
    label: "Wealth & Resources",
    icon: "💰",
    description: "Understand your financial prosperity potential",
    palaceName: "财帛"
  },
  {
    key: "health",
    label: "Health & Wellbeing",
    icon: "❤️‍🩹",
    description: "Assess your physical and mental vitality",
    palaceName: "疾厄"
  },
  {
    key: "travel",
    label: "Travel & Change",
    icon: "✈️",
    description: "Explore opportunities for relocation and transformation",
    palaceName: "迁移"
  },
  {
    key: "social",
    label: "Friends & Networks",
    icon: "👥",
    description: "Analyze your social circles and beneficial connections",
    palaceName: "交友"
  },
  {
    key: "career",
    label: "Career & Status",
    icon: "💼",
    description: "Explore your professional path and achievements",
    palaceName: "官禄"
  },
  {
    key: "home",
    label: "Property & Assets",
    icon: "🏠",
    description: "Examine your living environment and material foundation",
    palaceName: "田宅"
  },
  {
    key: "fortune",
    label: "Happiness & Spirit",
    icon: "🌟",
    description: "Understand your spiritual wellbeing and inner joy",
    palaceName: "福德"
  },
  {
    key: "parents",
    label: "Parents & Mentors",
    icon: "👨‍👩‍👦",
    description: "Explore relationships with parents and authority figures",
    palaceName: "父母"
  }
];

/**
 * Get aspect configuration by key
 * @param key - The aspect key to look up
 * @returns The aspect configuration or undefined if not found
 */
export const getAspectConfig = (key: string): AspectConfig | undefined => {
  return ASPECT_CONFIGS.find(aspect => aspect.key === key);
};

/**
 * Get aspect configuration by palace name
 * @param palaceName - The Chinese palace name (e.g., "官禄")
 * @returns The aspect configuration or undefined if not found
 */
export const getAspectByPalace = (palaceName: string): AspectConfig | undefined => {
  return ASPECT_CONFIGS.find(aspect => aspect.palaceName === palaceName);
};
