import React, { useState, createContext, useContext } from "react";

/**
 * Theme context for light/dark mode
 */
type Theme = "light" | "dark";
type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

/**
 * Wealth Code type keys
 */
type WealthCodeKey = "investmentBrain" | "brandingMagnet" | "strategyPlanner" | "collaborator";

/**
 * Individual wealth code score
 */
type WealthCodeScore = {
  key: WealthCodeKey;
  label: string;
  score: number; // 0–10
};

/**
 * Star wealth profile showing contribution from individual stars
 */
type StarWealthProfile = {
  name: string;
  chineseName: string;
  primaryWealthCode: WealthCodeKey;
  scores: WealthCodeScore[];
  shortNote: string;
};

/**
 * Complete wealth profile for a client
 */
type WealthProfile = {
  clientName: string;
  dominantArchetype: string;
  summaryText: string;
  codes: WealthCodeScore[];
  stars: StarWealthProfile[];
  strengths: string[];
  blindSpots: string[];
  idealRoles: Array<{ role: string; reason: string }>;
  nonIdealRoles: Array<{ role: string; reason: string }>;
  profileType: "specialized" | "balanced" | "hybrid";
};

/**
 * Dayun season type
 */
type DayunSeason = "spring" | "summer" | "autumn" | "winter";

/**
 * Dayun 10-year cycle information
 */
type DayunCycle = {
  startYear: number;
  endYear: number;
  currentYear: number;
  palace: string;
  palaceChinese: string;
  season: DayunSeason;
  seasonTitle: string;
  coreMessage: string;
  keyActions: string[];
  watchOut: string[];
};

/**
 * Dayun cycle information extended
 */
type DayunCycleExtended = DayunCycle & {
  previousCycle?: { years: string; season: DayunSeason; palace: string };
  nextCycle?: { years: string; season: DayunSeason; palace: string };
  successMetrics: string[];
  reflectionQuestions: string[];
  phase: "building" | "peak" | "integration";
};

/**
 * Short label for each wealth code type
 */
const WEALTH_CODE_SHORT: Record<WealthCodeKey, string> = {
  investmentBrain: "IB",
  brandingMagnet: "BM",
  strategyPlanner: "SP",
  collaborator: "CO",
};

/**
 * Color mapping for each wealth code type with premium gradients
 */
const WEALTH_CODE_COLORS: Record<
  WealthCodeKey,
  { primary: string; light: string; bg: string; gradient: string; heroGradient: string }
> = {
  investmentBrain: {
    primary: "#DC2626",
    light: "#FEE2E2",
    bg: "bg-gradient-to-br from-red-50 to-orange-50",
    gradient: "from-red-500 to-orange-500",
    heroGradient: "from-red-600 via-red-500 to-orange-500",
  },
  brandingMagnet: {
    primary: "#9333EA",
    light: "#F3E8FF",
    bg: "bg-gradient-to-br from-purple-50 to-pink-50",
    gradient: "from-purple-500 to-pink-500",
    heroGradient: "from-purple-600 via-purple-500 to-pink-500",
  },
  strategyPlanner: {
    primary: "#D97706",
    light: "#FEF3C7",
    bg: "bg-gradient-to-br from-amber-50 to-yellow-50",
    gradient: "from-amber-500 to-yellow-500",
    heroGradient: "from-amber-600 via-amber-500 to-yellow-500",
  },
  collaborator: {
    primary: "#059669",
    light: "#D1FAE5",
    bg: "bg-gradient-to-br from-green-50 to-emerald-50",
    gradient: "from-green-500 to-emerald-500",
    heroGradient: "from-green-600 via-green-500 to-emerald-500",
  },
};

/**
 * Mock data for development testing
 */
const MOCK_WEALTH_PROFILE: WealthProfile = {
  clientName: "Alex Chen",
  dominantArchetype: "Strategy Planner",
  summaryText:
    "Natural ability to see the big picture and build systematic frameworks for long-term success. Strong at identifying patterns, anticipating challenges, and creating actionable roadmaps. Excel in roles requiring vision, structure, and strategic planning.",
  codes: [
    { key: "strategyPlanner", label: "Strategy Planner", score: 8.5 },
    { key: "brandingMagnet", label: "Branding Magnet", score: 7.2 },
    { key: "collaborator", label: "Collaborator", score: 6.0 },
    { key: "investmentBrain", label: "Investment Brain", score: 4.8 },
  ],
  stars: [
    {
      name: "Purple Star",
      chineseName: "紫微",
      primaryWealthCode: "strategyPlanner",
      scores: [
        { key: "strategyPlanner", label: "Strategy Planner", score: 9.0 },
        { key: "brandingMagnet", label: "Branding Magnet", score: 6.5 },
        { key: "collaborator", label: "Collaborator", score: 7.0 },
        { key: "investmentBrain", label: "Investment Brain", score: 5.5 },
      ],
      shortNote: "Leadership and systematic thinking for long-term planning",
    },
    {
      name: "Greedy Wolf",
      chineseName: "貪狼",
      primaryWealthCode: "brandingMagnet",
      scores: [
        { key: "strategyPlanner", label: "Strategy Planner", score: 6.0 },
        { key: "brandingMagnet", label: "Branding Magnet", score: 9.5 },
        { key: "collaborator", label: "Collaborator", score: 7.5 },
        { key: "investmentBrain", label: "Investment Brain", score: 6.0 },
      ],
      shortNote: "Natural charisma and ability to attract opportunities through personal brand",
    },
    {
      name: "Heavenly Mansion",
      chineseName: "天府",
      primaryWealthCode: "collaborator",
      scores: [
        { key: "strategyPlanner", label: "Strategy Planner", score: 7.5 },
        { key: "brandingMagnet", label: "Branding Magnet", score: 5.0 },
        { key: "collaborator", label: "Collaborator", score: 8.5 },
        { key: "investmentBrain", label: "Investment Brain", score: 6.5 },
      ],
      shortNote: "Resource management and team coordination strengths",
    },
    {
      name: "Military Star",
      chineseName: "武曲",
      primaryWealthCode: "investmentBrain",
      scores: [
        { key: "strategyPlanner", label: "Strategy Planner", score: 5.5 },
        { key: "brandingMagnet", label: "Branding Magnet", score: 4.0 },
        { key: "collaborator", label: "Collaborator", score: 3.5 },
        { key: "investmentBrain", label: "Investment Brain", score: 7.5 },
      ],
      shortNote: "Financial acumen and analytical approach to wealth building",
    },
  ],
  strengths: [
    "Strategic Vision",
    "Systems Thinking",
    "Long-term Focus",
    "Pattern Recognition",
  ],
  blindSpots: [
    "Over-planning",
    "Analysis Paralysis",
    "Delegation Challenges",
    "Risk Aversion",
  ],
  idealRoles: [
    { role: "CEO / Founder", reason: "Your strategic vision and systematic approach to building scalable businesses" },
    { role: "Strategy Director", reason: "Natural ability to create and execute long-term roadmaps" },
    { role: "Business Development Lead", reason: "Excel at identifying growth opportunities and planning market expansion" },
    { role: "Management Consultant", reason: "Strong at analyzing complex problems and designing strategic solutions" },
    { role: "Product Strategy Lead", reason: "Ability to envision product roadmaps that align with market needs" },
    { role: "Operations Director", reason: "Excel at building systems and processes for organizational efficiency" },
  ],
  nonIdealRoles: [
    { role: "Day Trader", reason: "Requires quick, instinctive decisions rather than strategic planning" },
    { role: "Sales Associate", reason: "Focused on immediate transactions rather than long-term strategy" },
    { role: "Data Entry Specialist", reason: "Your strategic mind needs complex challenges, not repetitive tasks" },
    { role: "Solo Freelancer", reason: "Your systems-thinking thrives in team/organizational contexts" },
  ],
  profileType: "specialized",
};

/**
 * Season color configuration
 */
const SEASON_COLORS: Record<DayunSeason, { gradient: string; primary: string; bg: string }> = {
  spring: {
    gradient: "from-green-500 to-emerald-500",
    primary: "#10b981",
    bg: "from-green-50 to-emerald-50",
  },
  summer: {
    gradient: "from-amber-500 to-yellow-500",
    primary: "#f59e0b",
    bg: "from-amber-50 to-yellow-50",
  },
  autumn: {
    gradient: "from-orange-500 to-red-500",
    primary: "#f97316",
    bg: "from-orange-50 to-red-50",
  },
  winter: {
    gradient: "from-blue-500 to-cyan-500",
    primary: "#3b82f6",
    bg: "from-blue-50 to-cyan-50",
  },
};

/**
 * Season icons
 */
const SEASON_ICONS: Record<DayunSeason, string> = {
  spring: "🌱",
  summer: "☀️",
  autumn: "🍂",
  winter: "❄️",
};

/**
 * Mock Dayun data
 */
const MOCK_DAYUN: DayunCycleExtended = {
  startYear: 2020,
  endYear: 2029,
  currentYear: 2025,
  palace: "Spouse Palace",
  palaceChinese: "夫妻宮",
  season: "autumn",
  seasonTitle: "Cut, Secure, Protect",
  coreMessage: "This palace isn't only about your romantic partner—it's about partnerships and the people closest to you that affect your direction, including at work. Spouse Palace sits directly opposite Career Palace, so they're always connected. Autumn here is about cutting emotional noise and realigning strategy.",
  keyActions: [
    "Cut unnecessary drama and bring issues to light",
    "Realign key partnerships or make tough calls if needed",
    "Clear emotional clutter that's affecting your decisions",
    "Address unspoken frustrations before they escalate",
  ],
  watchOut: [
    "Unspoken frustrations leaking into your work decisions",
    "Tolerating partnerships rather than truly collaborating",
    "Dragging unresolved tensions into the next phase",
    "Keeping issues under the rug instead of addressing them",
  ],
  previousCycle: {
    years: "2010-2019",
    season: "winter",
    palace: "Career Palace",
  },
  nextCycle: {
    years: "2030-2039",
    season: "summer",
    palace: "Wealth Palace",
  },
  successMetrics: [
    "Resolved 2-3 major partnership issues openly",
    "Established clear boundaries and roles",
    "Cut ties with draining relationships",
    "Strengthened core partnerships through honest dialogue",
  ],
  reflectionQuestions: [
    "Are your key partnerships helping you grow or stuck in old patterns?",
    "What emotional clutter are you avoiding addressing?",
    "Which relationships need realignment vs ending?",
    "Are you operating from resentment or genuine collaboration?",
  ],
  phase: "peak",
};

/**
 * Theme toggle button
 */
const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <button
      onClick={toggleTheme}
      className={`fixed top-6 right-6 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 ${
        theme === "dark"
          ? "bg-gray-800 text-yellow-400 border border-gray-700"
          : "bg-white text-gray-800 border border-gray-200"
      }`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
};

/**
 * Premium hero card with dominant archetype - theme aware
 */
const PremiumHeroCard: React.FC<{ profile: WealthProfile }> = ({ profile }) => {
  const dominantCode = profile.codes[0];
  const colorConfig = WEALTH_CODE_COLORS[dominantCode.key];
  const { theme } = useContext(ThemeContext);

  return (
    <div className="relative overflow-hidden rounded-2xl mb-6 shadow-xl">
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorConfig.gradient}`} style={{ opacity: theme === "dark" ? 0.95 : 0.9 }} />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: theme === "dark" 
          ? `radial-gradient(circle at 20% 50%, rgba(255,255,255,.05) 1px, transparent 1px),
             radial-gradient(circle at 80% 80%, rgba(255,255,255,.05) 1px, transparent 1px)`
          : `radial-gradient(circle at 20% 50%, rgba(255,255,255,.15) 1px, transparent 1px),
             radial-gradient(circle at 80% 80%, rgba(255,255,255,.15) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />
      
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
                  <span className="text-3xl font-bold" style={{ color: colorConfig.primary }}>
                    {dominantCode.score.toFixed(1)}
                  </span>
                </div>
                <div className="text-white text-xs font-semibold drop-shadow">Primary Score</div>
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
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className={`rounded-2xl shadow-lg border p-8 mb-6 ${
      theme === "dark"
        ? "bg-gray-800 border-gray-700"
        : "bg-white border-gray-100"
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Wealth Code Analysis
        </h3>
        <div className={`text-xs px-3 py-1.5 rounded-full ${
          theme === "dark"
            ? "text-gray-400 bg-gray-700"
            : "text-gray-500 bg-gray-50"
        }`}>
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
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorConfig.gradient} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}
                    >
                      <span className="text-white text-xs font-bold">{shortLabel}</span>
                    </div>
                    {idx === 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-xs">★</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{code.label}</div>
                    <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                      {widthPercent >= 80 ? "Exceptional" : widthPercent >= 65 ? "Strong" : widthPercent >= 50 ? "Moderate" : "Developing"}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold" style={{ color: colorConfig.primary }}>
                    {code.score.toFixed(1)}
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className={`h-4 rounded-full overflow-hidden shadow-inner ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                }`}>
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
 * Mini horizontal bar for star contributions
 */
const MiniBarChart: React.FC<{ scores: WealthCodeScore[] }> = ({ scores }) => {
  const maxScore = 10;
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className="space-y-1.5">
      {scores.map((score) => {
        const colorConfig = WEALTH_CODE_COLORS[score.key];
        const shortLabel = WEALTH_CODE_SHORT[score.key];
        const widthPercent = (score.score / maxScore) * 100;
        return (
          <div key={score.key} className="flex items-center gap-2">
            <div className={`w-8 text-xs font-semibold ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              {shortLabel}
            </div>
            <div className={`flex-1 rounded-full h-2 overflow-hidden ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${widthPercent}%`,
                  backgroundColor: colorConfig.primary,
                }}
              />
            </div>
            <div className="w-8 text-xs font-semibold text-right" style={{ color: colorConfig.primary }}>
              {score.score.toFixed(1)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Premium star analysis with glassmorphism design
 */
const PremiumStarAnalysis: React.FC<{ stars: StarWealthProfile[] }> = ({ stars }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`rounded-2xl shadow-lg border p-8 mb-6 ${
      theme === "dark"
        ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
        : "bg-gradient-to-br from-slate-50 to-gray-100 border-gray-200"
    }`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
              <span className="text-white text-sm">✦</span>
            </div>
            <h3 className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Star Influence Breakdown
            </h3>
          </div>
          <p className={`text-sm ml-11 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            See how each of your {stars.length} key stars contributes to your wealth profile
          </p>
        </div>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow ${
          theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-white text-gray-500"
        }`}>
          <span className="font-light text-lg">{isOpen ? "−" : "+"}</span>
        </div>
      </button>

      {isOpen && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {stars.map((star, idx) => {
            const colorConfig = WEALTH_CODE_COLORS[star.primaryWealthCode];
            const shortLabel = WEALTH_CODE_SHORT[star.primaryWealthCode];
            
            return (
              <div
                key={idx}
                className={`rounded-xl p-5 shadow-sm border hover:shadow-md transition-shadow ${
                  theme === "dark"
                    ? "bg-gray-750 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{star.name}</span>
                      <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{star.chineseName}</span>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-lg text-xs font-bold shadow-sm bg-gradient-to-br ${colorConfig.gradient} text-white`}
                  >
                    {shortLabel}
                  </div>
                </div>
                <MiniBarChart scores={star.scores} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/**
 * Modern insights cards with gradient accents
 */
const ModernInsights: React.FC<{ strengths: string[]; blindSpots: string[] }> = ({ strengths, blindSpots }) => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Strengths */}
      <div className={`relative overflow-hidden rounded-2xl p-6 border shadow-md ${
        theme === "dark"
          ? "bg-gradient-to-br from-emerald-900/30 to-green-900/30 border-green-700/50"
          : "bg-gradient-to-br from-emerald-50 to-green-50 border-green-200"
      }`}>
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl ${
          theme === "dark"
            ? "bg-gradient-to-br from-green-400/5 to-emerald-400/5"
            : "bg-gradient-to-br from-green-400/10 to-emerald-400/10"
        }`} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white text-sm">+</span>
            </div>
            <h3 className={`font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Core Strengths</h3>
          </div>
          <ul className="space-y-2.5">
            {strengths.map((strength, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <div className="w-5 h-5 mt-0.5 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Blind Spots */}
      <div className={`relative overflow-hidden rounded-2xl p-6 border shadow-md ${
        theme === "dark"
          ? "bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-700/50"
          : "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200"
      }`}>
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl ${
          theme === "dark"
            ? "bg-gradient-to-br from-amber-400/5 to-orange-400/5"
            : "bg-gradient-to-br from-amber-400/10 to-orange-400/10"
        }`} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white text-sm">!</span>
            </div>
            <h3 className={`font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Areas to Watch</h3>
          </div>
          <ul className="space-y-2.5">
            {blindSpots.map((blindSpot, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <div className="w-5 h-5 mt-0.5 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>{blindSpot}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

/**
 * Modern career paths section
 */
const ModernCareerPaths: React.FC<{ profile: WealthProfile }> = ({ profile }) => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className={`rounded-2xl shadow-lg border p-8 mb-6 ${
      theme === "dark"
        ? "bg-gray-800 border-gray-700"
        : "bg-white border-gray-100"
    }`}>
      <h3 className={`text-lg font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Career Alignment</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ideal Roles */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-md flex items-center justify-center shadow-sm">
              <span className="text-white text-xs">✓</span>
            </div>
            <h4 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Best Fit Roles</h4>
          </div>
          <div className="space-y-2">
            {profile.idealRoles.slice(0, 6).map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 group">
                <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full group-hover:h-8 transition-all" />
                <span className={`text-sm transition-colors ${
                  theme === "dark"
                    ? "text-gray-300 group-hover:text-white"
                    : "text-gray-700 group-hover:text-gray-900"
                }`}>{item.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Non-Ideal Roles */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-500 rounded-md flex items-center justify-center shadow-sm">
              <span className="text-white text-xs">-</span>
            </div>
            <h4 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Less Aligned Roles</h4>
          </div>
          <div className="space-y-2">
            {profile.nonIdealRoles.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 group opacity-60 hover:opacity-80 transition-opacity">
                <div className="w-1 h-6 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full" />
                <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{item.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Dayun Season Hero Card - Season takes center stage
 */
const DayunSeasonHero: React.FC<{ dayun: DayunCycle }> = ({ dayun }) => {
  const { theme } = useContext(ThemeContext);
  const seasonColor = SEASON_COLORS[dayun.season];
  const seasonIcon = SEASON_ICONS[dayun.season];
  
  const yearsElapsed = dayun.currentYear - dayun.startYear;
  const totalYears = dayun.endYear - dayun.startYear + 1;
  const progress = (yearsElapsed / totalYears) * 100;

  return (
    <div className="relative overflow-hidden rounded-2xl mb-6 shadow-xl">
      {/* Season Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${seasonColor.gradient}`} style={{ opacity: theme === "dark" ? 0.95 : 0.9 }} />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: theme === "dark" 
          ? `radial-gradient(circle at 20% 50%, rgba(255,255,255,.05) 1px, transparent 1px),
             radial-gradient(circle at 80% 80%, rgba(255,255,255,.05) 1px, transparent 1px)`
          : `radial-gradient(circle at 20% 50%, rgba(255,255,255,.15) 1px, transparent 1px),
             radial-gradient(circle at 80% 80%, rgba(255,255,255,.15) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />
      
      {/* Content */}
      <div className="relative px-8 py-10">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 border border-white/20">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-white text-xs font-bold uppercase tracking-wider drop-shadow-lg">
                Your Current Season
              </span>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="text-6xl drop-shadow-lg">{seasonIcon}</div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-1 tracking-tight drop-shadow-lg uppercase">
                  {dayun.season}
                </h1>
                <p className="text-xl text-white font-semibold drop-shadow-md">
                  {dayun.seasonTitle}
                </p>
              </div>
            </div>
            
            <p className="text-white text-sm leading-relaxed drop-shadow-md mb-4">
              {dayun.coreMessage}
            </p>
            
            {/* Palace Context */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
              <span className="text-white text-lg font-bold">宮</span>
              <div>
                <span className="text-white font-semibold text-sm">{dayun.palace}</span>
                <span className="text-white/70 text-xs ml-2">{dayun.palaceChinese}</span>
              </div>
            </div>
          </div>
          
          {/* Timeline Badge */}
          <div className="flex-shrink-0">
            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-2xl min-w-[140px]">
              <div className="text-center mb-4">
                <div className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">
                  10-Year Cycle
                </div>
                <div className="text-white text-lg font-bold">
                  {dayun.startYear}-{dayun.endYear}
                </div>
              </div>
              
              <div className="bg-black/20 rounded-lg p-3 border border-white/20">
                <div className="text-white/80 text-xs mb-2 text-center">
                  Year {yearsElapsed + 1} of {totalYears}
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-white text-xs font-bold text-center mt-2">
                  {Math.round(progress)}%
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
 * Dayun Guidance Cards
 */
const DayunGuidanceCards: React.FC<{ dayun: DayunCycle }> = ({ dayun }) => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* What To Do Card */}
      <div className={`rounded-2xl shadow-lg border p-6 ${
        theme === "dark"
          ? "bg-gradient-to-br from-emerald-900/30 to-green-900/30 border-green-700/50"
          : "bg-gradient-to-br from-emerald-50 to-green-50 border-green-200"
      }`}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white text-lg font-bold">✓</span>
          </div>
          <h4 className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            What To Do This Cycle
          </h4>
        </div>
        <ul className="space-y-3">
          {dayun.keyActions.map((action, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="w-6 h-6 mt-0.5 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-white text-xs font-bold">{idx + 1}</span>
              </div>
              <span className={`text-sm font-medium leading-relaxed ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                {action}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Watch Out Card */}
      <div className={`rounded-2xl shadow-lg border p-6 ${
        theme === "dark"
          ? "bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-700/50"
          : "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200"
      }`}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white text-lg font-bold">!</span>
          </div>
          <h4 className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Watch Out For
          </h4>
        </div>
        <ul className="space-y-3">
          {dayun.watchOut.map((warning, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="w-6 h-6 mt-0.5 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <span className={`text-sm font-medium leading-relaxed ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                {warning}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/**
 * Cycle Timeline Component - Past, Current, Future
 */
const CycleTimeline: React.FC<{ dayun: DayunCycleExtended }> = ({ dayun }) => {
  const { theme } = useContext(ThemeContext);
  
  const cycles = [
    dayun.previousCycle && {
      ...dayun.previousCycle,
      label: "Previous",
      isCurrent: false,
    },
    {
      years: `${dayun.startYear}-${dayun.endYear}`,
      season: dayun.season,
      palace: dayun.palace,
      label: "Current",
      isCurrent: true,
    },
    dayun.nextCycle && {
      ...dayun.nextCycle,
      label: "Next",
      isCurrent: false,
    },
  ].filter(Boolean);

  return (
    <div className={`rounded-2xl shadow-lg border p-6 mb-6 ${
      theme === "dark"
        ? "bg-gray-800 border-gray-700"
        : "bg-white border-gray-100"
    }`}>
      <h4 className={`text-lg font-bold mb-5 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
        Your Dayun Journey
      </h4>
      
      <div className="space-y-4">
        {cycles.map((cycle, idx) => {
          if (!cycle) return null;
          const seasonColor = SEASON_COLORS[cycle.season as DayunSeason];
          const seasonIcon = SEASON_ICONS[cycle.season as DayunSeason];
          
          return (
            <div key={idx} className="relative">
              {idx < cycles.length - 1 && (
                <div className={`absolute left-6 top-12 w-0.5 h-8 ${
                  theme === "dark" ? "bg-gray-600" : "bg-gray-300"
                }`} />
              )}
              
              <div className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                cycle.isCurrent
                  ? `${theme === "dark" ? "bg-gray-700" : "bg-gradient-to-r " + seasonColor.bg} border-2`
                  : `${theme === "dark" ? "bg-gray-700/30" : "bg-gray-50"} border`
              } ${theme === "dark" ? "border-gray-600" : "border-gray-200"}`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${seasonColor.gradient} flex items-center justify-center shadow-md flex-shrink-0 ${
                  !cycle.isCurrent && "opacity-50"
                }`}>
                  <span className="text-white text-xl">{seasonIcon}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}>
                      {cycle.label}
                    </span>
                    {cycle.isCurrent && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r ${seasonColor.gradient} text-white`}>
                        Active
                      </span>
                    )}
                  </div>
                  <div className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {cycle.years} • {cycle.season.toUpperCase()}
                  </div>
                  <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    {cycle.palace}
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
 * Phase Intensity Chart Component
 */
const PhaseIntensityChart: React.FC<{ dayun: DayunCycleExtended }> = ({ dayun }) => {
  const { theme } = useContext(ThemeContext);
  const seasonColor = SEASON_COLORS[dayun.season];
  
  const currentYear = dayun.currentYear - dayun.startYear + 1;
  const years = Array.from({ length: 10 }, (_, i) => i + 1);
  
  // Calculate intensity curve (bell curve peaking at years 5-6)
  const getIntensity = (year: number) => {
    const normalizedYear = (year - 5.5) / 2.5;
    return Math.exp(-(normalizedYear * normalizedYear));
  };

  const phases = [
    { years: "1-3", label: "Building", description: "Foundation phase" },
    { years: "4-6", label: "Peak", description: "Maximum energy" },
    { years: "7-10", label: "Integration", description: "Consolidation" },
  ];

  return (
    <div className={`rounded-2xl shadow-lg border p-6 mb-6 ${
      theme === "dark"
        ? "bg-gray-800 border-gray-700"
        : "bg-white border-gray-100"
    }`}>
      <h4 className={`text-lg font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
        10-Year Energy Curve
      </h4>
      <p className={`text-sm mb-5 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
        Not all years carry the same intensity. You&apos;re currently in the <strong>{dayun.phase}</strong> phase.
      </p>
      
      {/* Intensity Chart */}
      <div className="mb-6">
        <div className="relative flex items-end justify-between gap-2 mb-3 px-2" style={{ height: '200px' }}>
          {years.map((year) => {
            const intensity = getIntensity(year);
            // Create clear visual differences: 30% min for building, 100% for peak, 50% for integration
            let heightPx;
            if (year <= 3) {
              heightPx = 60 + (year * 15); // 75px, 90px, 105px
            } else if (year >= 4 && year <= 6) {
              heightPx = 150 + ((year - 4) * 20); // 150px, 170px, 190px (peak)
            } else {
              heightPx = 150 - ((year - 6) * 15); // 135px, 120px, 105px, 90px
            }
            
            const isCurrent = year === currentYear;
            
            return (
              <div key={year} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                <div className="relative w-full flex items-end justify-center" style={{ height: '100%' }}>
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 relative ${
                      isCurrent
                        ? `bg-gradient-to-t ${seasonColor.gradient} shadow-xl`
                        : theme === "dark"
                        ? "bg-gray-600"
                        : "bg-gray-300"
                    }`}
                    style={{ 
                      height: `${heightPx}px`
                    }}
                  >
                    {isCurrent && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full bg-gradient-to-r ${seasonColor.gradient} text-white shadow-md`}>
                          Year {year}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <span className={`text-xs ${isCurrent ? "font-bold" : ""} ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`} style={{ color: isCurrent ? seasonColor.primary : undefined }}>
                  {year}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Phase Labels */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {phases.map((phase, idx) => {
            const isActive = phase.label.toLowerCase() === dayun.phase;
            return (
              <div
                key={idx}
                className={`text-center p-4 rounded-xl border-2 transition-all ${
                  isActive
                    ? `border-2 shadow-md ${theme === "dark" ? "bg-gray-700 border-gray-500" : "bg-white border-gray-300"}`
                    : theme === "dark"
                    ? "bg-gray-700/30 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                }`}
                style={isActive ? { borderColor: seasonColor.primary } : undefined}
              >
                <div className={`text-sm font-bold mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Years {phase.years}
                </div>
                <div className={`text-xs font-semibold mb-1 ${isActive ? "" : theme === "dark" ? "text-gray-400" : "text-gray-600"}`} 
                  style={isActive ? { color: seasonColor.primary } : undefined}>
                  {phase.label}
                </div>
                <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  {phase.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/**
 * Reflection Questions Component
 */
const ReflectionQuestions: React.FC<{ questions: string[] }> = ({ questions }) => {
  const { theme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`rounded-2xl shadow-lg border p-6 mb-6 ${
      theme === "dark"
        ? "bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-indigo-700/50"
        : "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200"
    }`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white text-lg">?</span>
          </div>
          <div>
            <h4 className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Reflection Questions
            </h4>
            <p className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Take a moment to examine your situation
            </p>
          </div>
        </div>
        <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          {isOpen ? "−" : "+"}
        </span>
      </button>

      {isOpen && (
        <div className="mt-5 space-y-3">
          {questions.map((question, idx) => (
            <div key={idx} className={`flex items-start gap-3 p-4 rounded-lg ${
              theme === "dark" ? "bg-gray-800/50" : "bg-white/60"
            } border ${theme === "dark" ? "border-gray-700" : "border-indigo-200"}`}>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-white text-xs font-bold">{idx + 1}</span>
              </div>
              <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                {question}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Main Wealth Code Preview Page Component with Theme Provider
 * Premium, modern design with wow factor and theme toggle
 */
const WealthCodePreviewPage: React.FC = () => {
  const [theme, setTheme] = useState<Theme>("light");
  const profile = MOCK_WEALTH_PROFILE;
  const dayun = MOCK_DAYUN;

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-50"
      }`}>
        <div className="max-w-5xl mx-auto">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* 1. Premium Hero - Immediate Wow Factor */}
          <PremiumHeroCard profile={profile} />

          {/* 2. Modern Bar Chart - Visual Comparison */}
          <ModernBarChart codes={profile.codes} />

          {/* 3. Premium Star Analysis - The Key Differentiator */}
          <PremiumStarAnalysis stars={profile.stars} />

          {/* 4. Modern Insights - Actionable */}
          <ModernInsights strengths={profile.strengths} blindSpots={profile.blindSpots} />

          {/* 5. Career Paths - Practical */}
          <ModernCareerPaths profile={profile} />

          {/* 6. Dayun 10-Year Cycle - Timing */}
          <div className="mt-8">
            {/* Season Hero - The Star of This Section */}
            <DayunSeasonHero dayun={dayun} />
            
            {/* Cycle Timeline - Past/Current/Future */}
            <CycleTimeline dayun={dayun} />
            
            {/* Phase Intensity Chart */}
            <PhaseIntensityChart dayun={dayun} />
            
            {/* Guidance Cards */}
            <DayunGuidanceCards dayun={dayun} />
            
            {/* Reflection Questions */}
            <ReflectionQuestions questions={dayun.reflectionQuestions} />
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default WealthCodePreviewPage;

