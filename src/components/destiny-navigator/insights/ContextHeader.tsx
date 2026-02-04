/**
 * ContextHeader Component - Premium Design
 * 
 * Displays contextual information with premium gradient hero card.
 * Matches the visual style of WealthCode analysis component.
 */

import React from "react";
import { Crown, Users, Heart, Baby, TrendingUp, Activity, Plane, Users2, Briefcase, Home, Sparkles, LucideIcon } from "lucide-react";
import { LifeAspect, TimeFrame } from "../../../types/destiny-navigator";

/**
 * Component props interface
 */
interface ContextHeaderProps {
  /** The life aspect being analyzed */
  aspect: LifeAspect;
  /** The timeframe period for analysis */
  timeframe: TimeFrame;
  /** Quality score from 0-100 */
  qualityScore: number;
  /** Star density indicator from 0-10 */
  starDensity: number;
}

/**
 * Configuration for each life aspect
 */
interface AspectDisplayConfig {
  /** Icon component from Lucide React */
  icon: LucideIcon;
  /** Display label for the aspect */
  label: string;
}

/**
 * Quality status configuration
 */
interface QualityStatus {
  /** Display label for the quality level */
  label: string;
  /** Color theme identifier */
  color: "emerald" | "blue" | "amber" | "gray";
}

/**
 * Mapping of all 12 life aspects to their display configuration
 */
const ASPECT_CONFIG: Record<LifeAspect, AspectDisplayConfig> = {
  life: { icon: Crown, label: "Life & Identity" },
  siblings: { icon: Users, label: "Siblings & Peers" },
  relationships: { icon: Heart, label: "Love & Marriage" },
  children: { icon: Baby, label: "Children & Creativity" },
  wealth: { icon: TrendingUp, label: "Wealth & Resources" },
  health: { icon: Activity, label: "Health & Wellbeing" },
  travel: { icon: Plane, label: "Travel & Change" },
  social: { icon: Users2, label: "Friends & Networks" },
  career: { icon: Briefcase, label: "Career & Status" },
  home: { icon: Home, label: "Property & Assets" },
  fortune: { icon: Sparkles, label: "Happiness & Spirit" },
  parents: { icon: Users, label: "Parents & Mentors" }
};

/**
 * Mapping of timeframes to their display labels
 */
const TIMEFRAME_LABELS: Record<TimeFrame, string> = {
  natal: "Lifelong Patterns",
  dayun: "Next 10 Years",
  liunian: "This Year",
  liumonth: "This Month"
};

/**
 * Gradient color configurations (inline styles to avoid Tailwind purging)
 */
const GRADIENT_COLORS: Record<QualityStatus["color"], { primary: string; secondary: string }> = {
  emerald: { primary: "#10b981", secondary: "#059669" },
  blue: { primary: "#3b82f6", secondary: "#2563eb" },
  amber: { primary: "#f59e0b", secondary: "#d97706" },
  gray: { primary: "#6b7280", secondary: "#4b5563" }
};

/**
 * Determines the quality status based on the score
 * 
 * @param score - Quality score from 0-100
 * @returns Quality status configuration
 */
const getQualityStatus = (score: number): QualityStatus => {
  if (score >= 80) {
    return { label: "Exceptional", color: "emerald" };
  }
  if (score >= 65) {
    return { label: "Strong", color: "blue" };
  }
  if (score >= 50) {
    return { label: "Moderate", color: "amber" };
  }
  return { label: "Developing", color: "gray" };
};

/**
 * ContextHeader Component - Premium Hero Card
 * 
 * Displays a premium gradient hero card matching WealthCode aesthetic.
 */
export const ContextHeader: React.FC<ContextHeaderProps> = ({
  aspect,
  timeframe,
  qualityScore,
  starDensity
}) => {
  // Get aspect configuration
  const config = ASPECT_CONFIG[aspect];
  const Icon = config.icon;
  
  // Determine quality status
  const status = getQualityStatus(qualityScore);
  const colors = GRADIENT_COLORS[status.color];

  return (
    <div className="relative overflow-hidden rounded-2xl mb-6 shadow-xl">
      {/* Gradient Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.secondary}dd 100%)`,
          opacity: 0.9,
        }}
      />

      {/* Pattern Overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,.15) 1px, transparent 1px),
             radial-gradient(circle at 80% 80%, rgba(255,255,255,.15) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Content */}
      <div className="relative px-8 py-10">
        <div className="flex items-start justify-between flex-wrap gap-6">
          {/* Left Section */}
          <div className="flex-1 min-w-[300px]">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 border border-white/20">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-white text-xs font-bold uppercase tracking-wider drop-shadow-lg">
                {TIMEFRAME_LABELS[timeframe]}
              </span>
            </div>

            {/* Title with Icon */}
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: "rgba(255, 255, 255, 0.2)", border: "2px solid rgba(255, 255, 255, 0.3)" }}
              >
                <Icon className="w-6 h-6 text-white" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }} />
              </div>
              <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-lg">
                {config.label}
              </h1>
            </div>

            {/* Star Density Indicator */}
            <div className="flex items-center gap-3 mt-4">
              <span className="text-white/80 text-sm font-medium drop-shadow">Star Activity</span>
              <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-6 rounded-full transition-all"
                    style={{
                      background: i < starDensity 
                        ? "rgba(255, 255, 255, 0.9)"
                        : "rgba(255, 255, 255, 0.2)"
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Section - Score Card */}
          <div className="flex-shrink-0">
            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-2xl min-w-[140px]">
              <div className="text-center">
                {/* Score */}
                <div 
                  className="w-24 h-24 mx-auto rounded-xl flex items-center justify-center mb-3 shadow-lg"
                  style={{ background: "rgba(255, 255, 255, 0.95)" }}
                >
                  <span
                    className="text-4xl font-bold"
                    style={{ color: colors.primary }}
                  >
                    {qualityScore}
                  </span>
                </div>

                {/* Label */}
                <div className="text-white text-sm font-bold drop-shadow mb-1">
                  Quality Score
                </div>
                
                {/* Status Badge */}
                <div 
                  className="inline-flex px-3 py-1 rounded-full text-xs font-bold"
                  style={{ 
                    background: "rgba(255, 255, 255, 0.9)",
                    color: colors.primary
                  }}
                >
                  {status.label}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
