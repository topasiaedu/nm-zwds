/**
 * Ordered list of all supported feature flag keys.
 */
export const FEATURE_KEYS = [
  "hasFullAnalysis",
  "hasPDFWithAnalysis",
  "hasAIAssistant",
  "hasDestinyNavigatorTool",
  "hasFounderReport",
  "hasExperimentalCharts",
  "hasHourAdjustment",
  "hasUnlimitedProfiles",
  "hasUserManagement",
  "hasNumerologyAnalytics",
  "hasSystemSettings",
  "canManageUserTiers",
  "canManageFeatureFlags",
  "canPauseUsers",
] as const

// Step: Build a union type for every valid feature flag key.
/**
 * Union of all feature flag keys used by the app.
 */
export type FeatureKey = (typeof FEATURE_KEYS)[number]

// Step: Define the feature flags shape for user and admin access control.
/**
 * Feature flags map keyed by feature name with boolean enablement.
 */
export type FeatureFlags = Partial<Record<FeatureKey, boolean>>

// Step: Provide program presets with explicit values for every feature.
/**
 * Feature flag presets for each tier and program.
 */
export const PROGRAM_TEMPLATES: Record<
  "tier1" | "tier2" | "tier3" | "founder" | "beta" | "admin",
  FeatureFlags
> = {
  tier1: {
    hasFullAnalysis: false,
    hasPDFWithAnalysis: false,
    hasAIAssistant: false,
    hasDestinyNavigatorTool: false,
    hasFounderReport: false,
    hasExperimentalCharts: false,
    hasHourAdjustment: false,
    hasUnlimitedProfiles: true,
    hasUserManagement: false,
    hasNumerologyAnalytics: false,
    hasSystemSettings: false,
    canManageUserTiers: false,
    canManageFeatureFlags: false,
    canPauseUsers: false,
  },
  tier2: {
    hasFullAnalysis: true,
    hasPDFWithAnalysis: true,
    hasAIAssistant: true,
    hasDestinyNavigatorTool: false,
    hasFounderReport: false,
    hasExperimentalCharts: false,
    hasHourAdjustment: false,
    hasUnlimitedProfiles: true,
    hasUserManagement: false,
    hasNumerologyAnalytics: false,
    hasSystemSettings: false,
    canManageUserTiers: false,
    canManageFeatureFlags: false,
    canPauseUsers: false,
  },
  founder: {
    hasFullAnalysis: false,
    hasPDFWithAnalysis: false,
    hasAIAssistant: false,
    hasDestinyNavigatorTool: false,
    hasFounderReport: true,
    hasExperimentalCharts: false,
    hasHourAdjustment: false,
    hasUnlimitedProfiles: true,
    hasUserManagement: false,
    hasNumerologyAnalytics: false,
    hasSystemSettings: false,
    canManageUserTiers: false,
    canManageFeatureFlags: false,
    canPauseUsers: false,
  },
  tier3: {
    // Tier3 repurposed as experimental/beta tier
    hasFullAnalysis: true,
    hasPDFWithAnalysis: true,
    hasAIAssistant: true,
    hasDestinyNavigatorTool: true,
    hasFounderReport: true,
    hasExperimentalCharts: true,
    hasHourAdjustment: true,
    hasUnlimitedProfiles: true,
    hasUserManagement: false,
    hasNumerologyAnalytics: false,
    hasSystemSettings: false,
    canManageUserTiers: false,
    canManageFeatureFlags: false,
    canPauseUsers: false,
  },
  beta: {
    hasFullAnalysis: true,
    hasPDFWithAnalysis: true,
    hasAIAssistant: true,
    hasDestinyNavigatorTool: true,
    hasFounderReport: true,
    hasExperimentalCharts: true,
    hasHourAdjustment: true,
    hasUnlimitedProfiles: true,
    hasUserManagement: false,
    hasNumerologyAnalytics: false,
    hasSystemSettings: false,
    canManageUserTiers: false,
    canManageFeatureFlags: false,
    canPauseUsers: false,
  },
  admin: {
    hasFullAnalysis: true,
    hasPDFWithAnalysis: true,
    hasAIAssistant: true,
    hasDestinyNavigatorTool: true,
    hasFounderReport: true,
    hasExperimentalCharts: true,
    hasHourAdjustment: true,
    hasUnlimitedProfiles: true,
    hasUserManagement: true,
    hasNumerologyAnalytics: true,
    hasSystemSettings: true,
    canManageUserTiers: true,
    canManageFeatureFlags: true,
    canPauseUsers: true,
  },
}

// Step: Map every feature key to a human-friendly description.
/**
 * Human-readable descriptions for each feature flag.
 */
export const FEATURE_DESCRIPTIONS: Record<FeatureKey, string> = {
  hasFullAnalysis: "Analysis sections in chart and result pages.",
  hasPDFWithAnalysis: "PDF exports include analysis components.",
  hasAIAssistant: "AI Wealth Navigator chat assistant.",
  hasDestinyNavigatorTool: "Destiny Navigator standalone tool.",
  hasFounderReport: "Founder Timing Decision System Report.",
  hasExperimentalCharts: "Experimental chart interface and layouts.",
  hasHourAdjustment: "Hour adjustment debug controls.",
  hasUnlimitedProfiles: "No limit on profile creation.",
  hasUserManagement: "Access to the user management panel.",
  hasNumerologyAnalytics: "Access to the numerology analytics dashboard.",
  hasSystemSettings: "System configuration access.",
  canManageUserTiers: "Permission to change other users' tiers.",
  canManageFeatureFlags: "Permission to edit feature flags.",
  canPauseUsers: "Permission to pause or resume memberships.",
}

// Step: Provide display metadata for each program tier.
/**
 * Display metadata for program tiers used in the UI.
 */
export const PROGRAM_INFO: Record<
  "tier1" | "tier2" | "founder" | "beta" | "admin",
  {
    name: string
    description: string
    color: string
    icon: string
  }
> = {
  tier1: {
    name: "Basic",
    description: "Free access with essential chart generation only.",
    color: "gray",
    icon: "sparkles",
  },
  tier2: {
    name: "DYD Program",
    description: "Core analysis features with PDF exports and AI support.",
    color: "indigo",
    icon: "compass",
  },
  founder: {
    name: "Founder Program",
    description: "Adds Destiny Navigator and Founder Report access.",
    color: "emerald",
    icon: "crown",
  },
  beta: {
    name: "Beta Program",
    description: "All user features plus experimental tools for testing.",
    color: "amber",
    icon: "flask",
  },
  admin: {
    name: "Admin",
    description: "Full access to all user and administrative features.",
    color: "rose",
    icon: "shield",
  },
}
