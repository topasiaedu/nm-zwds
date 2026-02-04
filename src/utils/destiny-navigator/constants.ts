/**
 * Shared constants for destiny navigator utilities
 * Focus category mappings for star keywords to actionable priorities
 */

export interface FocusCategory {
  id: string;
  label: string;
  description: string;
}

export const FOCUS_CATEGORIES: Record<string, FocusCategory> = {
  leadership: {
    id: "leadership",
    label: "Leadership Positioning",
    description: "Build authority and command presence"
  },
  systems: {
    id: "systems",
    label: "Build Systems & Structure",
    description: "Create organized frameworks"
  },
  wealth: {
    id: "wealth",
    label: "Financial Growth",
    description: "Expand resources and assets"
  },
  execution: {
    id: "execution",
    label: "Disciplined Execution",
    description: "Consistent action and follow-through"
  },
  strategy: {
    id: "strategy",
    label: "Strategic Planning",
    description: "Long-term thinking and foresight"
  },
  harmony: {
    id: "harmony",
    label: "Relationship Harmony",
    description: "Build balanced connections"
  },
  expression: {
    id: "expression",
    label: "Creative Expression",
    description: "Authentic self-expression"
  },
  support: {
    id: "support",
    label: "Team Collaboration",
    description: "Strengthen partnerships"
  }
};

export const KEYWORD_TO_FOCUS_MAP: Record<string, string> = {
  // Leadership keywords
  "authority": "leadership",
  "leadership": "leadership",
  "command": "leadership",
  "premium": "leadership",
  "hierarchy": "leadership",
  "visibility": "leadership",
  "presence": "leadership",
  "influence": "leadership",
  "radiance": "leadership",
  "generosity": "leadership",
  
  // Systems keywords
  "systems": "systems",
  "structure": "systems",
  "discipline": "systems",
  "precision": "systems",
  "operations": "systems",
  "logic": "systems",
  "documentation": "systems",
  
  // Wealth keywords
  "wealth": "wealth",
  "resources": "wealth",
  "accumulation": "wealth",
  "passive-income": "wealth",
  "security": "wealth",
  "stability": "wealth",
  "conservation": "wealth",
  "foundations": "wealth",
  
  // Execution keywords
  "execution": "execution",
  "action": "execution",
  "speed": "execution",
  "courage": "execution",
  "brave": "execution",
  "risk": "execution",
  "disruption": "execution",
  "rebuild": "execution",
  "transformation": "execution",
  "breakthrough": "execution",
  "pioneering": "execution",
  
  // Strategy keywords
  "strategy": "strategy",
  "planning": "strategy",
  "intellect": "strategy",
  "foresight": "strategy",
  "brain": "strategy",
  "movement": "strategy",
  "adaptability": "strategy",
  "persuasion": "strategy",
  "communication": "strategy",
  "calculated": "strategy",
  
  // Harmony keywords
  "harmony": "harmony",
  "peace": "harmony",
  "balance": "harmony",
  "diplomacy": "harmony",
  "childlike": "harmony",
  "ease": "harmony",
  "blessing": "harmony",
  "elegant": "harmony",
  "emotional-intelligence": "harmony",
  "refinement": "harmony",
  
  // Expression keywords
  "expression": "expression",
  "charisma": "expression",
  "creativity": "expression",
  "articulation": "expression",
  "desire": "expression",
  "attraction": "expression",
  "luxury": "expression",
  "branding": "expression",
  "artistry": "expression",
  
  // Support keywords
  "support": "support",
  "assistance": "support",
  "collaboration": "support",
  "helper": "support",
  "amplifier": "support",
  "loyalty": "support",
  "trust": "support",
  "wisdom": "support",
  "protection": "support",
  "longevity": "support",
  "service": "support",
  "noble-person": "support",
  "teaching": "support",
  "presentation": "support",
  "backing": "support",
  "secrets": "support",
  "depth": "support",
  "legacy": "support"
};
