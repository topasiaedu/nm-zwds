/**
 * Liu Month Forecast Data
 *
 * Palace metadata used to enrich the monthly Liu Month briefing card.
 * Extracted from the 12-month forecast PDF generation logic so it can
 * be shared with the web UI.
 */

/** Season types aligned with the Dayun season mapper */
export type LiuMonthSeason = "Spring" | "Summer" | "Autumn" | "Winter";

/**
 * Dimension bar score for a single life area.
 * Percentage is 0–100 representing energetic strength this month.
 */
export interface DimensionBar {
  /** Display label for this life area (e.g. "Career") */
  label: string;
  /** Percentage score (0–100) representing monthly energy for this dimension */
  pct: number;
  /** CSS hex color for the bar fill */
  color: string;
  /** Gradient CSS for the bar fill (richer rendering) */
  gradient: string;
  /** Emoji icon for the dimension */
  icon: string;
}

/** Per-palace static metadata for the monthly briefing */
export interface PalaceMonthData {
  /** Season this palace belongs to */
  season: LiuMonthSeason;
  /** Life area focus label */
  area: string;
  /** Priority theme for this month */
  priority: string;
  /**
   * The 4 life-dimension bars mirroring the original PDF scores:
   * Career / Wealth / Relationships / Health
   */
  dimensionBars: [DimensionBar, DimensionBar, DimensionBar, DimensionBar];
}

/**
 * Static metadata for each palace, keyed by simplified Chinese palace name.
 * Maps directly to the PALACE_DATA used in the 12-month forecast PDF generator.
 *
 * Dimension bar percentages reflect classical ZWDS energetic profiles:
 * - Spring palaces (官禄/迁移/交友): high expansion energy
 * - Summer palaces (财帛/田宅/福德): high harvest/activation energy
 * - Autumn palaces (夫妻/兄弟/子女/父母): caution / consolidation energy
 * - Winter palaces (命宫/疾厄): rebuilding / rest energy
 */
export const PALACE_MONTH_DATA: Record<string, PalaceMonthData> = {
  /** Career Palace — Spring peak season */
  "官禄": {
    season: "Spring",
    area: "Professional",
    priority: "Launch Initiatives",
    dimensionBars: [
      { label: "Career",        pct: 95, color: "#2563eb", gradient: "linear-gradient(90deg, #1e40af, #3b82f6)", icon: "💼" },
      { label: "Wealth",        pct: 75, color: "#059669", gradient: "linear-gradient(90deg, #047857, #10b981)", icon: "💰" },
      { label: "Relationships", pct: 60, color: "#e11d48", gradient: "linear-gradient(90deg, #9f1239, #f43f5e)", icon: "❤️" },
      { label: "Health",        pct: 55, color: "#7c3aed", gradient: "linear-gradient(90deg, #5b21b6, #8b5cf6)", icon: "💪" },
    ],
  },
  /** Travel / Expansion Palace — Spring peak season */
  "迁移": {
    season: "Spring",
    area: "Expansion",
    priority: "Step Beyond Comfort Zone",
    dimensionBars: [
      { label: "Career",        pct: 75, color: "#2563eb", gradient: "linear-gradient(90deg, #1e40af, #3b82f6)", icon: "💼" },
      { label: "Wealth",        pct: 65, color: "#059669", gradient: "linear-gradient(90deg, #047857, #10b981)", icon: "💰" },
      { label: "Relationships", pct: 85, color: "#e11d48", gradient: "linear-gradient(90deg, #9f1239, #f43f5e)", icon: "❤️" },
      { label: "Health",        pct: 70, color: "#7c3aed", gradient: "linear-gradient(90deg, #5b21b6, #8b5cf6)", icon: "💪" },
    ],
  },
  /** Friends / Network Palace — Spring peak season */
  "交友": {
    season: "Spring",
    area: "Network",
    priority: "Launch Initiatives",
    dimensionBars: [
      { label: "Career",        pct: 70, color: "#2563eb", gradient: "linear-gradient(90deg, #1e40af, #3b82f6)", icon: "💼" },
      { label: "Wealth",        pct: 65, color: "#059669", gradient: "linear-gradient(90deg, #047857, #10b981)", icon: "💰" },
      { label: "Relationships", pct: 95, color: "#e11d48", gradient: "linear-gradient(90deg, #9f1239, #f43f5e)", icon: "❤️" },
      { label: "Health",        pct: 60, color: "#7c3aed", gradient: "linear-gradient(90deg, #5b21b6, #8b5cf6)", icon: "💪" },
    ],
  },
  /** Wealth Palace — Summer harvest season */
  "财帛": {
    season: "Summer",
    area: "Financial",
    priority: "Monetize Resources",
    dimensionBars: [
      { label: "Career",        pct: 70, color: "#2563eb", gradient: "linear-gradient(90deg, #1e40af, #3b82f6)", icon: "💼" },
      { label: "Wealth",        pct: 95, color: "#059669", gradient: "linear-gradient(90deg, #047857, #10b981)", icon: "💰" },
      { label: "Relationships", pct: 55, color: "#e11d48", gradient: "linear-gradient(90deg, #9f1239, #f43f5e)", icon: "❤️" },
      { label: "Health",        pct: 60, color: "#7c3aed", gradient: "linear-gradient(90deg, #5b21b6, #8b5cf6)", icon: "💪" },
    ],
  },
  /** Property / Assets Palace — Summer harvest season */
  "田宅": {
    season: "Summer",
    area: "Assets",
    priority: "Optimize Foundations",
    dimensionBars: [
      { label: "Career",        pct: 60, color: "#2563eb", gradient: "linear-gradient(90deg, #1e40af, #3b82f6)", icon: "💼" },
      { label: "Wealth",        pct: 80, color: "#059669", gradient: "linear-gradient(90deg, #047857, #10b981)", icon: "💰" },
      { label: "Relationships", pct: 65, color: "#e11d48", gradient: "linear-gradient(90deg, #9f1239, #f43f5e)", icon: "❤️" },
      { label: "Health",        pct: 75, color: "#7c3aed", gradient: "linear-gradient(90deg, #5b21b6, #8b5cf6)", icon: "💪" },
    ],
  },
  /** Wellbeing / Fortune Palace — Summer harvest season */
  "福德": {
    season: "Summer",
    area: "Inner Power",
    priority: "Align Inner State",
    dimensionBars: [
      { label: "Career",        pct: 65, color: "#2563eb", gradient: "linear-gradient(90deg, #1e40af, #3b82f6)", icon: "💼" },
      { label: "Wealth",        pct: 70, color: "#059669", gradient: "linear-gradient(90deg, #047857, #10b981)", icon: "💰" },
      { label: "Relationships", pct: 75, color: "#e11d48", gradient: "linear-gradient(90deg, #9f1239, #f43f5e)", icon: "❤️" },
      { label: "Health",        pct: 90, color: "#7c3aed", gradient: "linear-gradient(90deg, #5b21b6, #8b5cf6)", icon: "💪" },
    ],
  },
  /** Spouse / Partnership Palace — Autumn caution season */
  "夫妻": {
    season: "Autumn",
    area: "Partnership",
    priority: "Clear Emotional Clutter",
    dimensionBars: [
      { label: "Career",        pct: 40, color: "#2563eb", gradient: "linear-gradient(90deg, #1e40af, #3b82f6)", icon: "💼" },
      { label: "Wealth",        pct: 40, color: "#059669", gradient: "linear-gradient(90deg, #047857, #10b981)", icon: "💰" },
      { label: "Relationships", pct: 75, color: "#e11d48", gradient: "linear-gradient(90deg, #9f1239, #f43f5e)", icon: "❤️" },
      { label: "Health",        pct: 50, color: "#7c3aed", gradient: "linear-gradient(90deg, #5b21b6, #8b5cf6)", icon: "💪" },
    ],
  },
  /** Siblings / Peer Circle Palace — Autumn caution season */
  "兄弟": {
    season: "Autumn",
    area: "Circle",
    priority: "Purge Connections",
    dimensionBars: [
      { label: "Career",        pct: 50, color: "#2563eb", gradient: "linear-gradient(90deg, #1e40af, #3b82f6)", icon: "💼" },
      { label: "Wealth",        pct: 50, color: "#059669", gradient: "linear-gradient(90deg, #047857, #10b981)", icon: "💰" },
      { label: "Relationships", pct: 70, color: "#e11d48", gradient: "linear-gradient(90deg, #9f1239, #f43f5e)", icon: "❤️" },
      { label: "Health",        pct: 55, color: "#7c3aed", gradient: "linear-gradient(90deg, #5b21b6, #8b5cf6)", icon: "💪" },
    ],
  },
  /** Children / Legacy Palace — Autumn caution season */
  "子女": {
    season: "Autumn",
    area: "Legacy",
    priority: "Structure Your Plans",
    dimensionBars: [
      { label: "Career",        pct: 45, color: "#2563eb", gradient: "linear-gradient(90deg, #1e40af, #3b82f6)", icon: "💼" },
      { label: "Wealth",        pct: 45, color: "#059669", gradient: "linear-gradient(90deg, #047857, #10b981)", icon: "💰" },
      { label: "Relationships", pct: 65, color: "#e11d48", gradient: "linear-gradient(90deg, #9f1239, #f43f5e)", icon: "❤️" },
      { label: "Health",        pct: 45, color: "#7c3aed", gradient: "linear-gradient(90deg, #5b21b6, #8b5cf6)", icon: "💪" },
    ],
  },
  /** Parents / Authority Palace — Autumn caution season */
  "父母": {
    season: "Autumn",
    area: "Patterns",
    priority: "Break Old Loops",
    dimensionBars: [
      { label: "Career",        pct: 45, color: "#2563eb", gradient: "linear-gradient(90deg, #1e40af, #3b82f6)", icon: "💼" },
      { label: "Wealth",        pct: 45, color: "#059669", gradient: "linear-gradient(90deg, #047857, #10b981)", icon: "💰" },
      { label: "Relationships", pct: 65, color: "#e11d48", gradient: "linear-gradient(90deg, #9f1239, #f43f5e)", icon: "❤️" },
      { label: "Health",        pct: 55, color: "#7c3aed", gradient: "linear-gradient(90deg, #5b21b6, #8b5cf6)", icon: "💪" },
    ],
  },
  /** Life / Self Palace — Winter rebuild season */
  "命宫": {
    season: "Winter",
    area: "Self",
    priority: "Invest in Yourself",
    dimensionBars: [
      { label: "Career",        pct: 60, color: "#2563eb", gradient: "linear-gradient(90deg, #1e40af, #3b82f6)", icon: "💼" },
      { label: "Wealth",        pct: 55, color: "#059669", gradient: "linear-gradient(90deg, #047857, #10b981)", icon: "💰" },
      { label: "Relationships", pct: 60, color: "#e11d48", gradient: "linear-gradient(90deg, #9f1239, #f43f5e)", icon: "❤️" },
      { label: "Health",        pct: 70, color: "#7c3aed", gradient: "linear-gradient(90deg, #5b21b6, #8b5cf6)", icon: "💪" },
    ],
  },
  /** Health Palace — Winter rebuild season */
  "疾厄": {
    season: "Winter",
    area: "Body",
    priority: "Restore Strength",
    dimensionBars: [
      { label: "Career",        pct: 40, color: "#2563eb", gradient: "linear-gradient(90deg, #1e40af, #3b82f6)", icon: "💼" },
      { label: "Wealth",        pct: 40, color: "#059669", gradient: "linear-gradient(90deg, #047857, #10b981)", icon: "💰" },
      { label: "Relationships", pct: 45, color: "#e11d48", gradient: "linear-gradient(90deg, #9f1239, #f43f5e)", icon: "❤️" },
      { label: "Health",        pct: 85, color: "#7c3aed", gradient: "linear-gradient(90deg, #5b21b6, #8b5cf6)", icon: "💪" },
    ],
  },
};

/**
 * Season visual configuration for the briefing card hero strip.
 * Uses inline CSS strings (not Tailwind) to avoid JIT purging.
 */
export interface SeasonStyle {
  /** CSS gradient for the hero header background */
  headerGradient: string;
  /** CSS gradient for the card body background */
  bodyGradient: string;
  /** CSS hex color for accent text and borders */
  accentColor: string;
  /** CSS hex color for the border */
  borderColor: string;
  /** CSS box-shadow for the card */
  cardShadow: string;
  /** Emoji icon */
  icon: string;
  /** Tagline (season theme) */
  tagline: string;
  /** One-sentence core seasonal message */
  coreMessage: string;
}

/**
 * Season styles keyed by season name.
 * headerGradient matches DayunSeasonHero exactly for visual consistency.
 */
export const SEASON_STYLES: Record<LiuMonthSeason, SeasonStyle> = {
  Spring: {
    headerGradient: "linear-gradient(135deg, #f97316 0%, #ef4444 100%)",
    bodyGradient: "linear-gradient(145deg, #fff7ed 0%, #ffedd5 100%)",
    accentColor: "#9a3412",
    borderColor: "#fed7aa",
    cardShadow: "0 4px 32px rgba(249,115,22,0.14)",
    icon: "🌱",
    tagline: "Expand, Grow, Move",
    coreMessage: "This is your green light season. The doors open easier. People say yes faster. Launch, expand, and move forward with confidence.",
  },
  Summer: {
    headerGradient: "linear-gradient(135deg, #f59e0b 0%, #eab308 100%)",
    bodyGradient: "linear-gradient(145deg, #fffbeb 0%, #fef3c7 100%)",
    accentColor: "#78350f",
    borderColor: "#fde68a",
    cardShadow: "0 4px 32px rgba(245,158,11,0.14)",
    icon: "☀️",
    tagline: "Activate, Leverage, Monetize",
    coreMessage: "This is your harvest season. Stop waiting and start activating what you already have. It's time to cash in, monetize, and collect the fruits of your work.",
  },
  Autumn: {
    headerGradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    bodyGradient: "linear-gradient(145deg, #f0fdf4 0%, #dcfce7 100%)",
    accentColor: "#064e3b",
    borderColor: "#86efac",
    cardShadow: "0 4px 32px rgba(16,185,129,0.14)",
    icon: "🍂",
    tagline: "Cut, Secure, Protect",
    coreMessage: "This is your safety net season. Cut emotional noise, patch up holes, and strengthen your foundation. Protect what you've built and prepare for what's next.",
  },
  Winter: {
    headerGradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
    bodyGradient: "linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%)",
    accentColor: "#1e3a8a",
    borderColor: "#93c5fd",
    cardShadow: "0 4px 32px rgba(37,99,235,0.14)",
    icon: "❄️",
    tagline: "Reskill, Prepare, Rebuild",
    coreMessage: "This is your reload season. Quietly sharpen your sword, rebuild your arsenal, and prepare yourself. When the season turns, you'll be ready to strike.",
  },
};

/**
 * Palace guidance content keyed by simplified Chinese palace name.
 * Contains key actions, watch outs, success metrics, and reflection questions.
 */
export interface PalaceGuidanceData {
  keyActions: string[];
  watchOut: string[];
  successMetrics: string[];
  reflectionQuestions: string[];
}

/**
 * Per-palace monthly guidance content.
 * Each palace has 6 key actions, 6 watch outs, 5 success metrics, 5 reflection questions.
 * The card UI trims to 4 / 4 / 4 / 2 to keep display tight and readable.
 */
export const PALACE_GUIDANCE_DATA: Record<string, PalaceGuidanceData> = {
  "官禄": {
    keyActions: [
      "Step into bigger roles and take ownership of larger responsibilities",
      "Upgrade yourself and reposition before the environment forces you to",
      "Build your visibility and actively seek recognition for your work",
      "Launch new initiatives and explore new opportunities within your field",
      "Fight for achievements and growth — don't play it safe",
      "Leverage your years of experience as your biggest advantage",
    ],
    watchOut: [
      "Playing too safe and staying in comfort zones",
      "Waiting passively for opportunities instead of creating them",
      "Letting younger colleagues overshadow you without stepping up",
      "Adapting to routines that no longer challenge you",
      "Using age as an excuse instead of catching up with trends",
      "Staying too quiet during this period — you'll waste your season",
    ],
    successMetrics: [
      "New role, promotion, or increased responsibilities secured",
      "Visibility and recognition increased within your field",
      "New skills or certifications acquired",
      "Successful launch of a new project or initiative",
      "Expanded professional network with key decision-makers",
    ],
    reflectionQuestions: [
      "Am I really playing at the level this season is calling for?",
      "What's stopping me from stepping into a bigger role right now?",
      "Am I using my experience as leverage, or as an excuse?",
      "If I stay in my current position for another 3 years, will I be satisfied?",
      "What would I do if I knew I couldn't fail?",
    ],
  },
  "迁移": {
    keyActions: [
      "Move, explore, and expand beyond your current environment",
      "Step out of your comfort zone and into new spaces",
      "Consider shifting markets, departments, or new opportunities",
      "Grow by changing your environment — new spaces bring new energy",
      "Build new networks and perspectives through movement",
      "Take calculated risks to explore new territories",
    ],
    watchOut: [
      "Staying too comfortable in the same environment",
      "Telling yourself 'later' when opportunities for change appear",
      "Letting comfort make you stagnant",
      "Waiting for 'perfect timing' that never comes",
      "Shrinking in when life is asking you to step outside",
      "Rocking the boat unnecessarily — not all movement is good",
    ],
    successMetrics: [
      "Successfully relocated or changed work environment",
      "New market or territory explored and developed",
      "Expanded geographical network or client base",
      "Comfort zone successfully stretched with measurable results",
      "New perspectives gained through environmental changes",
    ],
    reflectionQuestions: [
      "What would happen if I actually made that shift I've been considering?",
      "Is my current environment still supporting my growth, or holding me back?",
      "What am I really afraid of if I step outside my comfort zone?",
      "Where could I go or explore that would challenge me?",
      "Am I using 'stability' as an excuse to avoid necessary change?",
    ],
  },
  "交友": {
    keyActions: [
      "Reconnect and actively build your network — don't stay isolated",
      "Leverage your connections strategically for mutual growth",
      "Build influence through collaborations and partnerships",
      "Activate dormant relationships and create new ones",
      "Focus on social circle shifts and expanding your reach",
      "Turn networking into tangible business relationships",
    ],
    watchOut: [
      "Staying inward-focused with only your usual circle",
      "Letting your network become comfortable instead of expanding",
      "Watching others advance through connections while you stay isolated",
      "Assuming opportunities will come without reaching out",
      "Maintaining social circles that haven't changed in years",
      "Missing growth opportunities that come through people, not solo work",
    ],
    successMetrics: [
      "New strategic partnerships or collaborations formed",
      "Dormant relationships reactivated with tangible results",
      "Expanded network with at least 10 new meaningful connections",
      "Opportunities or doors opened through network activation",
      "Influence measurably increased within your circle or industry",
    ],
    reflectionQuestions: [
      "When was the last time I reached out to someone in my network?",
      "Who in my circle could I collaborate with for mutual growth?",
      "Am I building relationships, or just collecting contacts?",
      "What opportunities am I missing by staying isolated?",
      "How can I provide value to others in my network right now?",
    ],
  },
  "财帛": {
    keyActions: [
      "Activate your resources — cash in what you've built so far",
      "Review and optimize your investment portfolio strategically",
      "Monetize your skills — package and sell your expertise",
      "Stop parking money — restructure and take profits where due",
      "Leverage your networks for financial opportunities",
      "Turn accumulated skills and knowledge into income streams",
    ],
    watchOut: [
      "Parking money without reviewing performance",
      "Following outdated strategies or wrong mentors blindly",
      "Ignoring that you've been on the wrong financial path",
      "Sitting on valuable skills without packaging or monetizing them",
      "Waiting for miracles instead of making strategic moves",
      "Letting resources collect dust when they could be working for you",
    ],
    successMetrics: [
      "Investment portfolio reviewed and optimized",
      "New income stream created from existing skills or resources",
      "Profits taken strategically from performing investments",
      "Skills packaged and monetized",
      "Resources activated with clear ROI tracked",
    ],
    reflectionQuestions: [
      "What resources do I already have that I'm not using effectively?",
      "When was the last time I properly reviewed my financial strategy?",
      "What skills or knowledge could I monetize right now?",
      "Am I actively managing my wealth, or just hoping it grows?",
      "Who can I learn from to upgrade my financial approach?",
    ],
  },
  "田宅": {
    keyActions: [
      "Optimize and upgrade what you already own — make it work harder",
      "Do proper market research to understand current opportunities",
      "Renovate or improve properties to match market expectations",
      "Leverage your foundations for greater returns",
      "Review and potentially upgrade your property strategy",
      "Use what you've built as a springboard for expansion",
    ],
    watchOut: [
      "Leaving properties or assets untouched and underutilized",
      "Relying on outdated strategies without market research",
      "Using the same unproductive agents or methods for years",
      "Sitting on goldmines but treating them like rocks",
      "Complaining without actually working the assets you have",
      "Ignoring family tensions that weaken your foundation",
    ],
    successMetrics: [
      "Property or asset optimized with increased returns",
      "Market research completed and strategy updated",
      "Renovations or improvements completed",
      "Family foundation strengthened through better communication",
      "Assets leveraged to open new opportunities or income",
    ],
    reflectionQuestions: [
      "What do I own that's not working as hard as it could?",
      "Have I done recent market research on my properties or assets?",
      "Are my family relationships supporting or weakening my foundation?",
      "What upgrades or improvements would maximize my returns?",
      "Am I giving back to the people who support me?",
    ],
  },
  "福德": {
    keyActions: [
      "Activate your inner superpower — align your energy with your goals",
      "Sharpen your instincts and decision-making patterns",
      "Say 'yes' to the right opportunities and 'no' to draining distractions",
      "Build confidence to execute without second-guessing yourself",
      "Balance your inner state to attract outer wealth naturally",
      "Clear patterns that are blocking your outer results",
    ],
    watchOut: [
      "Constantly overthinking and doubting yourself",
      "Operating from fear instead of power",
      "Sabotaging your wealth through unbalanced inner patterns",
      "Ignoring that your outer wealth reflects your inner state",
      "Letting unclear patterns eat away your energy and clarity",
      "Working harder without addressing inner misalignment",
    ],
    successMetrics: [
      "Improved decision-making speed and confidence",
      "Reduced overthinking and increased execution",
      "Money flowing more smoothly with less effort",
      "Inner patterns identified and actively shifting",
      "Energy and clarity noticeably increased",
    ],
    reflectionQuestions: [
      "What inner patterns are sabotaging my external success?",
      "Do I trust my instincts, or constantly second-guess myself?",
      "Am I operating from fear or from power?",
      "What would change if I aligned my inner state with my wealth goals?",
      "Where am I leaking energy that could be directed toward my goals?",
    ],
  },
  "夫妻": {
    keyActions: [
      "Cut emotional noise and bring issues into the light",
      "Realign strategy with your key partnerships (work and personal)",
      "Address unspoken frustrations instead of letting them pile up",
      "Operate like a real team — align or make tough calls if needed",
      "Trim the fat and clear up mismatched expectations",
      "Focus on facts and strategy, not just feelings",
    ],
    watchOut: [
      "Carrying unspoken frustration and resentment in partnerships",
      "Saying 'it's fine' when it's clearly not",
      "Letting emotional clutter leak into your decisions",
      "Tolerating misalignment instead of addressing it",
      "Dragging unresolved tensions into the next phase",
      "Staying in old emotional loops that no longer serve you",
    ],
    successMetrics: [
      "Key partnership issues addressed and resolved",
      "Clear expectations set and communicated",
      "Alignment achieved or tough decisions made",
      "Emotional clutter reduced with better communication",
      "Partnerships operating more like effective teams",
    ],
    reflectionQuestions: [
      "Are my key partnerships helping me grow or keeping me stuck?",
      "What am I not saying that needs to be said?",
      "Am I operating like a team, or just tolerating each other?",
      "What emotional noise am I carrying that's clouding my clarity?",
      "If this partnership doesn't change, where will we be in 3 years?",
    ],
  },
  "兄弟": {
    keyActions: [
      "Clean up your circle — identify who's adding value vs. noise",
      "Filter your connections and prioritize real alliances",
      "Invest in people who challenge, support, and grow with you",
      "Cut the noise — stop pretending everyone belongs in your next season",
      "Build clarity around who belongs in your inner circle",
      "Focus on quality connections over quantity",
    ],
    watchOut: [
      "Keeping people around just because they're 'old friends'",
      "Tolerating gossip, complaints, and distractions in your circle",
      "Letting surface-level connections drain your focus and energy",
      "Staying sentimentally attached to relationships that don't serve you",
      "Allowing distracting voices to follow you into the next phase",
      "Confusing quantity of contacts with quality of relationships",
    ],
    successMetrics: [
      "Circle cleaned up with clearer boundaries",
      "Energy-draining connections reduced or eliminated",
      "Quality of relationships noticeably improved",
      "Real alliances identified and strengthened",
      "Focus and clarity improved through better circle management",
    ],
    reflectionQuestions: [
      "Who in my circle actually pushes me forward?",
      "Who am I keeping around out of obligation rather than value?",
      "What would happen if I let go of relationships that drain me?",
      "Am I surrounding myself with people who challenge me to grow?",
      "Which connections should not follow me into my next season?",
    ],
  },
  "子女": {
    keyActions: [
      "Stop letting worry run the show — focus on facts instead of fear",
      "Structure your legacy clearly — what are you actually building?",
      "Tighten up what matters and trim what's emotionally outdated",
      "Support wisely based on real needs, not emotional reactions",
      "Face emotional procrastination and create clear plans",
      "Define what you want to pass down or scale for the future",
    ],
    watchOut: [
      "Carrying others' problems like they're your own",
      "Worrying even when things are actually fine",
      "Getting stuck in emotional loops without real change",
      "Letting guilt, fear, or frustration drain your energy",
      "Leaving your legacy scattered without proper structure",
      "Emotionally procrastinating instead of facing reality",
    ],
    successMetrics: [
      "Emotional patterns identified and shifting",
      "Legacy or assets structured with clear plans",
      "Support provided based on needs, not emotional reactions",
      "Worry reduced with fact-based decision-making",
      "Clear direction established for what to pass down",
    ],
    reflectionQuestions: [
      "Am I supporting wisely or just reacting emotionally?",
      "What am I worrying about that isn't actually a real problem?",
      "Is my legacy clearly structured, or just vague hopes?",
      "What emotional patterns from the past am I still carrying?",
      "What do I actually want to leave behind or pass down?",
    ],
  },
  "父母": {
    keyActions: [
      "Face old patterns from your past instead of letting them control you",
      "Own your story — stop pointing back at childhood as an excuse",
      "Cut through fear-based thinking with clarity and responsibility",
      "Step up and take ownership of your direction moving forward",
      "Address how authority figures (bosses, mentors, parents) shape you",
      "Use truth and facts to break free from outdated narratives",
    ],
    watchOut: [
      "Carrying childhood narratives that no longer serve you",
      "Blaming your past or family for your current situation",
      "Reacting to life using fears formed decades ago",
      "Letting your past control your future decisions",
      "Running from your story instead of owning it",
      "Operating from fear instead of clarity and responsibility",
    ],
    successMetrics: [
      "Old patterns identified and actively breaking free from them",
      "Taking full ownership without blaming the past",
      "Fear-based thinking replaced with clarity-based decisions",
      "Relationships with authority figures improved or boundaries set",
      "Personal responsibility increased with reduced blame",
    ],
    reflectionQuestions: [
      "What old stories from my past am I still carrying?",
      "Am I using my upbringing as an excuse or as context for growth?",
      "How much of my current fear comes from things that happened long ago?",
      "What would change if I fully owned my story without blame?",
      "Am I stepping up, or waiting for someone else to fix things?",
    ],
  },
  "命宫": {
    keyActions: [
      "Invest in yourself — take that course, learn that skill, finally do your thing",
      "Rebuild your edge and upgrade your mind for your next chapter",
      "Rewire your habits and reprogram your patterns",
      "Focus on becoming more, not just doing more",
      "Use this window to strengthen your foundation before Spring",
      "Be your own hero instead of everyone else's",
    ],
    watchOut: [
      "Pouring into everyone else while forgetting to invest in yourself",
      "Postponing dreams and self-improvement under 'responsibility'",
      "Hitting the same ceiling year after year without upgrading",
      "Waiting for 'someday' that never comes",
      "Resisting the pause when you should be rebuilding",
      "Staying the same person fighting the same problems",
    ],
    successMetrics: [
      "New course, certification, or skill completed",
      "Meaningful self-investment made (education, health, growth)",
      "Habits rewired with measurable behavior changes",
      "Personal foundation noticeably strengthened",
      "Next-chapter version of yourself taking shape",
    ],
    reflectionQuestions: [
      "When was the last time I actually invested in myself, not others?",
      "What version of me does my next chapter require?",
      "If I don't grow now, where will I be in 10 years?",
      "What would I do for myself if I made myself a priority?",
      "Am I becoming more, or just staying busy?",
    ],
  },
  "疾厄": {
    keyActions: [
      "Slow down now before you're forced to stop completely",
      "Address health warnings before they become emergencies",
      "Repair, recalibrate, and restore your body intentionally",
      "Protect your health so you have strength when Spring arrives",
      "Build sustainable routines instead of compensating with willpower",
      "Treat this as your last warning window — use it wisely",
    ],
    watchOut: [
      "Running on empty and telling yourself 'I'll rest later'",
      "Ignoring signs like fatigue, pain, or sleep issues",
      "Waiting for health problems to become serious before acting",
      "Compensating exhaustion with caffeine instead of real rest",
      "Burning out and missing your next opportunity window",
      "Rebuilding wealth while destroying the body that carries it",
    ],
    successMetrics: [
      "Regular health checkups completed and issues addressed",
      "Sleep, nutrition, and exercise routines established",
      "Warning signs addressed before becoming serious problems",
      "Energy levels noticeably improved and sustained",
      "Body prepared and strong for the next growth cycle",
    ],
    reflectionQuestions: [
      "What health warning signs have I been ignoring?",
      "Am I truly resting, or just collapsing when I can't go on?",
      "Can my body actually handle what I'm planning for my future?",
      "What would happen if I slowed down now instead of waiting for a crash?",
      "Am I being wise or just proving I can push through anything?",
    ],
  },
};
