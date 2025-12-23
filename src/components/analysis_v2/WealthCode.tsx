/**
 * Wealth Code Analysis Component
 * Displays comprehensive wealth-building profile based on stars in Wealth Palace
 */

import React from "react";
import { ChartData } from "../../utils/zwds/types";
import {
  analyzeWealthCode,
  WealthCodeAnalysisResult,
} from "../../utils/zwds/analysis/wealthCodeAnalysis";
import {
  WealthCodeKey,
  WealthCodeScore,
  CareerRecommendation,
} from "../../utils/zwds/analysis_constants/wealth_code_mapping";

/**
 * Props for the WealthCode component
 */
interface WealthCodeProps {
  chartData: ChartData;
}

/**
 * Color configuration for each wealth code type
 */
const WEALTH_CODE_COLORS: Record<
  WealthCodeKey,
  { primary: string; secondary: string; light: string; gradient: string; heroGradient: string }
> = {
  investmentBrain: {
    primary: "#DC2626",
    secondary: "#FB923C",
    light: "#FEE2E2",
    gradient: "from-red-500 to-orange-500",
    heroGradient: "from-red-600 via-red-500 to-orange-500",
  },
  brandingMagnet: {
    primary: "#9333EA",
    secondary: "#EC4899",
    light: "#F3E8FF",
    gradient: "from-purple-500 to-pink-500",
    heroGradient: "from-purple-600 via-purple-500 to-pink-500",
  },
  strategyPlanner: {
    primary: "#D97706",
    secondary: "#EAB308",
    light: "#FEF3C7",
    gradient: "from-amber-500 to-yellow-500",
    heroGradient: "from-amber-600 via-amber-500 to-yellow-500",
  },
  collaborator: {
    primary: "#059669",
    secondary: "#10B981",
    light: "#D1FAE5",
    gradient: "from-green-500 to-emerald-500",
    heroGradient: "from-green-600 via-green-500 to-emerald-500",
  },
};

/**
 * Short labels for wealth codes
 */
const WEALTH_CODE_SHORT: Record<WealthCodeKey, string> = {
  investmentBrain: "IB",
  brandingMagnet: "BM",
  strategyPlanner: "SP",
  collaborator: "CO",
};

/**
 * Icons for wealth codes
 */
const WEALTH_CODE_ICONS: Record<WealthCodeKey, string> = {
  investmentBrain: "💰",
  brandingMagnet: "✨",
  strategyPlanner: "🎯",
  collaborator: "🤝",
};

/**
 * Premium hero card with dominant archetype
 */
const PremiumHeroCard: React.FC<{ profile: WealthCodeAnalysisResult }> = ({
  profile,
}) => {
  if (!profile.hasRecognizedStars) return null;

  const dominantCode = profile.codes[0];
  const colorConfig = WEALTH_CODE_COLORS[dominantCode.key];

  return (
    <div className="relative overflow-hidden rounded-2xl mb-6 shadow-xl">
      {/* Gradient Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${colorConfig.primary} 0%, ${colorConfig.secondary} 50%, ${colorConfig.secondary}dd 100%)`,
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
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 border border-white/20">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-white text-xs font-bold uppercase tracking-wider drop-shadow-lg">
                Dominant Wealth Code
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight drop-shadow-lg">
              {profile.dominantArchetype}
            </h1>
            <p className="text-white text-sm leading-relaxed max-w-xl drop-shadow-md">
              {profile.summaryText}
            </p>
          </div>

          {/* Score Badge */}
          <div className="flex-shrink-0">
            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-2xl">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-xl bg-white shadow-lg flex items-center justify-center mb-3">
                  <span
                    className="text-3xl font-bold"
                    style={{ color: colorConfig.primary }}
                  >
                    {dominantCode.score.toFixed(1)}
                  </span>
                </div>
                <div className="text-white text-xs font-semibold drop-shadow">
                  Primary Score
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Modern horizontal bar chart with premium styling
 */
const ModernBarChart: React.FC<{ codes: WealthCodeScore[] }> = ({ codes }) => {
  const maxScore = 10;

  return (
    <div className="rounded-2xl shadow-lg border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 p-8 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Wealth Code Analysis
        </h3>
        <div className="text-xs px-3 py-1.5 rounded-full text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
          Scale 0-10
        </div>
      </div>

      <div className="space-y-6">
        {codes.map((code, idx) => {
          const colorConfig = WEALTH_CODE_COLORS[code.key];
          const shortLabel = WEALTH_CODE_SHORT[code.key];
          const widthPercent = (code.score / maxScore) * 100;

          return (
            <div key={code.key} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow"
                      style={{
                        background: `linear-gradient(135deg, ${colorConfig.primary} 0%, ${colorConfig.secondary} 100%)`,
                      }}
                    >
                      <span className="text-lg">
                        {WEALTH_CODE_ICONS[code.key]}
                      </span>
                    </div>
                    {idx === 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-xs">★</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {code.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {widthPercent >= 80
                        ? "Exceptional"
                        : widthPercent >= 65
                        ? "Strong"
                        : widthPercent >= 50
                        ? "Moderate"
                        : "Developing"}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: colorConfig.primary }}
                  >
                    {code.score.toFixed(1)}
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="h-4 rounded-full overflow-hidden shadow-inner bg-gray-100 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                    style={{
                      width: `${widthPercent}%`,
                      background: `linear-gradient(90deg, ${colorConfig.primary}, ${colorConfig.primary}dd)`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Modern insights cards with gradient accents
 */
const ModernInsights: React.FC<{
  strengths: string[];
  blindSpots: string[];
}> = ({ strengths, blindSpots }) => {
  if (strengths.length === 0 && blindSpots.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Strengths */}
      {strengths.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl p-6 border shadow-md bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border-green-200 dark:border-green-700/50">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl bg-gradient-to-br from-green-400/10 to-emerald-400/10 dark:from-green-400/5 dark:to-emerald-400/5" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div 
                className="rounded-lg flex items-center justify-center shadow-lg"
                style={{ 
                  width: "36px",
                  height: "36px",
                  background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                  border: "2px solid rgba(5, 150, 105, 0.3)"
                }}
              >
                <span style={{ color: "#ffffff", fontSize: "1.125rem", fontWeight: "bold", textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>+</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">
                Core Strengths
              </h3>
            </div>
            <ul className="space-y-2.5">
              {strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <div 
                    className="rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
                    style={{ 
                      width: "24px",
                      height: "24px",
                      marginTop: "2px",
                      background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                      border: "2px solid rgba(5, 150, 105, 0.3)"
                    }}
                  >
                    <span style={{ color: "#ffffff", fontSize: "0.75rem", fontWeight: "800", textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>✓</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                    {strength}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Blind Spots */}
      {blindSpots.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl p-6 border shadow-md bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border-amber-200 dark:border-amber-700/50">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl bg-gradient-to-br from-amber-400/10 to-orange-400/10 dark:from-amber-400/5 dark:to-orange-400/5" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div 
                className="rounded-lg flex items-center justify-center shadow-lg"
                style={{ 
                  width: "36px",
                  height: "36px",
                  background: "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)",
                  border: "2px solid rgba(217, 119, 6, 0.3)"
                }}
              >
                <span style={{ color: "#ffffff", fontSize: "1.125rem", fontWeight: "bold", textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>!</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">
                Areas to Watch
              </h3>
            </div>
            <ul className="space-y-2.5">
              {blindSpots.map((blindSpot, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <div 
                    className="rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
                    style={{ 
                      width: "24px",
                      height: "24px",
                      marginTop: "2px",
                      background: "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)",
                      border: "2px solid rgba(217, 119, 6, 0.3)"
                    }}
                  >
                    <span style={{ color: "#ffffff", fontSize: "0.75rem", fontWeight: "800", textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>!</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                    {blindSpot}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Modern career paths section
 */
const ModernCareerPaths: React.FC<{
  idealRoles: CareerRecommendation[];
  nonIdealRoles: CareerRecommendation[];
}> = ({ idealRoles, nonIdealRoles }) => {
  if (idealRoles.length === 0 && nonIdealRoles.length === 0) return null;

  return (
    <div className="rounded-2xl shadow-lg border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 p-8 mb-6">
      <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">
        Career Alignment
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ideal Roles */}
        {idealRoles.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-md flex items-center justify-center shadow-sm">
                <span className="text-white text-xs">✓</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Ideal Career
              </h4>
            </div>
            <div className="space-y-3">
              {idealRoles.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 hover:shadow-sm transition-shadow"
                >
                  <div className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                    {item.role}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {item.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Non-Ideal Roles */}
        {nonIdealRoles.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-500 rounded-md flex items-center justify-center shadow-sm">
                <span className="text-white text-xs">-</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Non-Ideal Career
              </h4>
            </div>
            <div className="space-y-3">
              {nonIdealRoles.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600 opacity-70 hover:opacity-90 transition-opacity"
                >
                  <div className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                    {item.role}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {item.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Empty state when no recognized stars
 */
const EmptyState: React.FC = () => {
  return (
    <div className="rounded-2xl shadow-lg border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 p-12 mb-6 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
        <span className="text-2xl">💰</span>
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
        No Wealth Code Data Available
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
        No recognized wealth-building stars found in your Wealth Palace. This
        section analyzes major stars that directly influence your natural
        money-making approach.
      </p>
    </div>
  );
};

/**
 * Main Wealth Code Component
 */
const WealthCode: React.FC<WealthCodeProps> = ({ chartData }) => {
  // Analyze wealth code
  const wealthProfile = analyzeWealthCode(chartData);

  return (
    <div className="p-6 dark:bg-gray-900">
      {/* Divider */}
      <div className="w-full border-t border-gray-400 dark:border-gray-600 mb-6"></div>

      {/* Section Title */}
      <div className="text-center mb-8">
        <h2 className="text-4xl mb-2 dark:text-white font-bold">
          WEALTH CODE ANALYSIS
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Your Natural Wealth-Building Strengths
        </p>
      </div>

      {/* Content */}
      {!wealthProfile.hasRecognizedStars ? (
        <EmptyState />
      ) : (
        <>
          {/* 1. Premium Hero - Immediate Wow Factor */}
          <PremiumHeroCard profile={wealthProfile} />

          {/* 2. Modern Bar Chart - Visual Comparison */}
          <ModernBarChart codes={wealthProfile.codes} />

          {/* 3. Modern Insights - Actionable */}
          <ModernInsights
            strengths={wealthProfile.strengths}
            blindSpots={wealthProfile.blindSpots}
          />

          {/* 5. Career Paths - Practical */}
          <ModernCareerPaths
            idealRoles={wealthProfile.idealRoles}
            nonIdealRoles={wealthProfile.nonIdealRoles}
          />
        </>
      )}
    </div>
  );
};

export default WealthCode;
