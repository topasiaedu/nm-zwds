/**
 * Liu Month Forecast Data
 *
 * Palace metadata used to enrich the monthly Liu Month briefing card.
 * Extracted from the 12-month forecast PDF generation logic so it can
 * be shared with the web UI.
 */

/** Timing phase types aligned with the Alignment Advantage framework display names. */
export type LiuMonthSeason = "Expansion" | "Visibility" | "Consolidation" | "Foundation";

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
  /** Career Palace: Spring peak season */
  "官禄": {
    season: "Expansion",
    area: "Professional",
    priority: "Launch Initiatives",
    dimensionBars: [
      { label: "Career",        pct: 95, color: "#2563eb", gradient: "linear-gradient(90deg, #1e40af, #3b82f6)", icon: "💼" },
      { label: "Wealth",        pct: 75, color: "#059669", gradient: "linear-gradient(90deg, #047857, #10b981)", icon: "💰" },
      { label: "Relationships", pct: 60, color: "#e11d48", gradient: "linear-gradient(90deg, #9f1239, #f43f5e)", icon: "❤️" },
      { label: "Health",        pct: 55, color: "#7c3aed", gradient: "linear-gradient(90deg, #5b21b6, #8b5cf6)", icon: "💪" },
    ],
  },
  /** Travel / Expansion Palace: Spring peak season */
  "迁移": {
    season: "Expansion",
    area: "Expansion",
    priority: "Step Beyond Comfort Zone",
    dimensionBars: [
      { label: "Career",        pct: 75, color: "#2563eb", gradient: "linear-gradient(90deg, #1e40af, #3b82f6)", icon: "💼" },
      { label: "Wealth",        pct: 65, color: "#059669", gradient: "linear-gradient(90deg, #047857, #10b981)", icon: "💰" },
      { label: "Relationships", pct: 85, color: "#e11d48", gradient: "linear-gradient(90deg, #9f1239, #f43f5e)", icon: "❤️" },
      { label: "Health",        pct: 70, color: "#7c3aed", gradient: "linear-gradient(90deg, #5b21b6, #8b5cf6)", icon: "💪" },
    ],
  },
  /** Friends / Network Palace: Spring peak season */
  "交友": {
    season: "Expansion",
    area: "Network",
    priority: "Launch Initiatives",
    dimensionBars: [
      { label: "Career",        pct: 70, color: "#2563eb", gradient: "linear-gradient(90deg, #1e40af, #3b82f6)", icon: "💼" },
      { label: "Wealth",        pct: 65, color: "#059669", gradient: "linear-gradient(90deg, #047857, #10b981)", icon: "💰" },
      { label: "Relationships", pct: 95, color: "#e11d48", gradient: "linear-gradient(90deg, #9f1239, #f43f5e)", icon: "❤️" },
      { label: "Health",        pct: 60, color: "#7c3aed", gradient: "linear-gradient(90deg, #5b21b6, #8b5cf6)", icon: "💪" },
    ],
  },
  /** Wealth Palace: Summer harvest season */
  "财帛": {
    season: "Visibility",
    area: "Financial",
    priority: "Monetize Resources",
    dimensionBars: [
      { label: "Career",        pct: 70, color: "#2563eb", gradient: "linear-gradient(90deg, #1e40af, #3b82f6)", icon: "💼" },
      { label: "Wealth",        pct: 95, color: "#059669", gradient: "linear-gradient(90deg, #047857, #10b981)", icon: "💰" },
      { label: "Relationships", pct: 55, color: "#e11d48", gradient: "linear-gradient(90deg, #9f1239, #f43f5e)", icon: "❤️" },
      { label: "Health",        pct: 60, color: "#7c3aed", gradient: "linear-gradient(90deg, #5b21b6, #8b5cf6)", icon: "💪" },
    ],
  },
  /** Property / Assets Palace: Summer harvest season */
  "田宅": {
    season: "Visibility",
    area: "Assets",
    priority: "Optimize Foundations",
    dimensionBars: [
      { label: "Career",        pct: 60, color: "#2563eb", gradient: "linear-gradient(90deg, #1e40af, #3b82f6)", icon: "💼" },
      { label: "Wealth",        pct: 80, color: "#059669", gradient: "linear-gradient(90deg, #047857, #10b981)", icon: "💰" },
      { label: "Relationships", pct: 65, color: "#e11d48", gradient: "linear-gradient(90deg, #9f1239, #f43f5e)", icon: "❤️" },
      { label: "Health",        pct: 75, color: "#7c3aed", gradient: "linear-gradient(90deg, #5b21b6, #8b5cf6)", icon: "💪" },
    ],
  },
  /** Wellbeing / Fortune Palace: Summer harvest season */
  "福德": {
    season: "Visibility",
    area: "Inner Power",
    priority: "Align Inner State",
    dimensionBars: [
      { label: "Career",        pct: 65, color: "#2563eb", gradient: "linear-gradient(90deg, #1e40af, #3b82f6)", icon: "💼" },
      { label: "Wealth",        pct: 70, color: "#059669", gradient: "linear-gradient(90deg, #047857, #10b981)", icon: "💰" },
      { label: "Relationships", pct: 75, color: "#e11d48", gradient: "linear-gradient(90deg, #9f1239, #f43f5e)", icon: "❤️" },
      { label: "Health",        pct: 90, color: "#7c3aed", gradient: "linear-gradient(90deg, #5b21b6, #8b5cf6)", icon: "💪" },
    ],
  },
  /** Spouse / Partnership Palace: Autumn caution season */
  "夫妻": {
    season: "Consolidation",
    area: "Partnership",
    priority: "Clear Emotional Clutter",
    dimensionBars: [
      { label: "Career",        pct: 40, color: "#2563eb", gradient: "linear-gradient(90deg, #1e40af, #3b82f6)", icon: "💼" },
      { label: "Wealth",        pct: 40, color: "#059669", gradient: "linear-gradient(90deg, #047857, #10b981)", icon: "💰" },
      { label: "Relationships", pct: 75, color: "#e11d48", gradient: "linear-gradient(90deg, #9f1239, #f43f5e)", icon: "❤️" },
      { label: "Health",        pct: 50, color: "#7c3aed", gradient: "linear-gradient(90deg, #5b21b6, #8b5cf6)", icon: "💪" },
    ],
  },
  /** Siblings / Peer Circle Palace: Autumn caution season */
  "兄弟": {
    season: "Consolidation",
    area: "Circle",
    priority: "Purge Connections",
    dimensionBars: [
      { label: "Career",        pct: 50, color: "#2563eb", gradient: "linear-gradient(90deg, #1e40af, #3b82f6)", icon: "💼" },
      { label: "Wealth",        pct: 50, color: "#059669", gradient: "linear-gradient(90deg, #047857, #10b981)", icon: "💰" },
      { label: "Relationships", pct: 70, color: "#e11d48", gradient: "linear-gradient(90deg, #9f1239, #f43f5e)", icon: "❤️" },
      { label: "Health",        pct: 55, color: "#7c3aed", gradient: "linear-gradient(90deg, #5b21b6, #8b5cf6)", icon: "💪" },
    ],
  },
  /** Children / Legacy Palace: Autumn caution season */
  "子女": {
    season: "Consolidation",
    area: "Legacy",
    priority: "Structure Your Plans",
    dimensionBars: [
      { label: "Career",        pct: 45, color: "#2563eb", gradient: "linear-gradient(90deg, #1e40af, #3b82f6)", icon: "💼" },
      { label: "Wealth",        pct: 45, color: "#059669", gradient: "linear-gradient(90deg, #047857, #10b981)", icon: "💰" },
      { label: "Relationships", pct: 65, color: "#e11d48", gradient: "linear-gradient(90deg, #9f1239, #f43f5e)", icon: "❤️" },
      { label: "Health",        pct: 45, color: "#7c3aed", gradient: "linear-gradient(90deg, #5b21b6, #8b5cf6)", icon: "💪" },
    ],
  },
  /** Parents / Authority Palace: Autumn caution season */
  "父母": {
    season: "Consolidation",
    area: "Patterns",
    priority: "Break Old Loops",
    dimensionBars: [
      { label: "Career",        pct: 45, color: "#2563eb", gradient: "linear-gradient(90deg, #1e40af, #3b82f6)", icon: "💼" },
      { label: "Wealth",        pct: 45, color: "#059669", gradient: "linear-gradient(90deg, #047857, #10b981)", icon: "💰" },
      { label: "Relationships", pct: 65, color: "#e11d48", gradient: "linear-gradient(90deg, #9f1239, #f43f5e)", icon: "❤️" },
      { label: "Health",        pct: 55, color: "#7c3aed", gradient: "linear-gradient(90deg, #5b21b6, #8b5cf6)", icon: "💪" },
    ],
  },
  /** Life / Self Palace: Winter rebuild season */
  "命宫": {
    season: "Foundation",
    area: "Self",
    priority: "Invest in Yourself",
    dimensionBars: [
      { label: "Career",        pct: 60, color: "#2563eb", gradient: "linear-gradient(90deg, #1e40af, #3b82f6)", icon: "💼" },
      { label: "Wealth",        pct: 55, color: "#059669", gradient: "linear-gradient(90deg, #047857, #10b981)", icon: "💰" },
      { label: "Relationships", pct: 60, color: "#e11d48", gradient: "linear-gradient(90deg, #9f1239, #f43f5e)", icon: "❤️" },
      { label: "Health",        pct: 70, color: "#7c3aed", gradient: "linear-gradient(90deg, #5b21b6, #8b5cf6)", icon: "💪" },
    ],
  },
  /** Health Palace: Winter rebuild season */
  "疾厄": {
    season: "Foundation",
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
  Expansion: {
    headerGradient: "linear-gradient(135deg, #f97316 0%, #ef4444 100%)",
    bodyGradient: "linear-gradient(145deg, #fff7ed 0%, #ffedd5 100%)",
    accentColor: "#9a3412",
    borderColor: "#fed7aa",
    cardShadow: "0 4px 32px rgba(249,115,22,0.14)",
    icon: "🚀",
    tagline: "Deploy Focus, Launch, Expand",
    coreMessage: "You are in an Expansion phase. Market resistance is low and ROI on aggressive action is high. Deploy your focus, launch new initiatives, and capture new opportunities.",
  },
  Visibility: {
    headerGradient: "linear-gradient(135deg, #f59e0b 0%, #eab308 100%)",
    bodyGradient: "linear-gradient(145deg, #fffbeb 0%, #fef3c7 100%)",
    accentColor: "#78350f",
    borderColor: "#fde68a",
    cardShadow: "0 4px 32px rgba(245,158,11,0.14)",
    icon: "✨",
    tagline: "Monetize Expertise, Expand Reach",
    coreMessage: "You are in a Visibility phase. Stop executing in the background. Leverage your track record to command a premium, build authority, and attract high-tier opportunities.",
  },
  Consolidation: {
    headerGradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    bodyGradient: "linear-gradient(145deg, #f0fdf4 0%, #dcfce7 100%)",
    accentColor: "#064e3b",
    borderColor: "#86efac",
    cardShadow: "0 4px 32px rgba(16,185,129,0.14)",
    icon: "🛡️",
    tagline: "Optimize Yield, Protect Bandwidth",
    coreMessage: "You are in a Consolidation phase. Cut operational bloat, eliminate low-ROI commitments, and strengthen your core foundation. Protect your margins and prepare for the next growth cycle.",
  },
  Foundation: {
    headerGradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
    bodyGradient: "linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%)",
    accentColor: "#1e3a8a",
    borderColor: "#93c5fd",
    cardShadow: "0 4px 32px rgba(37,99,235,0.14)",
    icon: "🏗️",
    tagline: "Upgrade Skills, Build Capacity",
    coreMessage: "You are in a Foundation phase. Quietly acquire new skills, upgrade your personal systems, and rebuild your biological capacity. Do not force expansion; engineer your leverage for the next cycle.",
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
      "Negotiate for a higher compensation package, better terms, or expanded responsibilities.",
      "Launch the side project, new service, or strategic initiative you have been planning.",
      "Position yourself for a promotion or leadership role by taking ownership of a high-visibility project.",
      "Audit your current role: if you are no longer growing or earning what you're worth, initiate a pivot.",
      "Leverage your track record to secure better terms on your next major contract or role.",
      "Step into the spotlight: ensure key decision-makers associate your name with real impact.",
    ],
    watchOut: [
      "Accepting increased responsibilities without a corresponding increase in compensation or leverage.",
      "Focusing only on executing tasks instead of making sure your work is visible.",
      "Waiting passively for opportunities instead of creating them.",
      "Letting comfort dictate your career trajectory.",
      "Using your years of experience as an excuse instead of adapting to new market demands.",
      "Staying quiet during a window designed for aggressive career expansion.",
    ],
    successMetrics: [
      "New role, promotion, or increased compensation secured",
      "Visibility and authority increased within your industry",
      "Successful launch of a high-leverage project or initiative",
      "Expanded professional network with key decision-makers",
      "Clear pivot strategy defined for underperforming roles",
    ],
    reflectionQuestions: [
      "Am I capturing the full financial value of the responsibilities I hold?",
      "What is stopping me from demanding a larger share of the upside?",
      "Am I operating strategically, or just staying busy?",
      "If I stay in my current position for another 3 years, what is the opportunity cost?",
      "What would I negotiate for if I knew they couldn't say no?",
    ],
  },
  "迁移": {
    keyActions: [
      "Expand into a new market, geography, or demographic to capture fresh opportunities.",
      "Attend high-level industry events to position yourself in front of new decision-makers.",
      "Test a new networking strategy or distribution channel outside your standard playbook.",
      "Consider relocating your focus or operations to a more advantageous environment.",
      "Build strategic alliances in departments or territories where you currently have zero footprint.",
      "Take calculated risks to disrupt your own career model before the market forces you to.",
    ],
    watchOut: [
      "Scaling into new areas before your core foundation is stable.",
      "Treating travel as a vacation instead of a strategic networking opportunity.",
      "Letting comfort keep you tied to a saturated or declining environment.",
      "Waiting for 'perfect timing' to launch an expansion initiative.",
      "Shrinking your footprint when the market is rewarding aggressive movement.",
      "Expanding without a clear thesis on how the new environment drives your goals.",
    ],
    successMetrics: [
      "Successfully penetrated a new market or demographic",
      "New networking channel tested and validated",
      "Expanded geographical network or client base",
      "Focus relocated to a higher-yield environment",
      "Strategic alliances formed in new territories",
    ],
    reflectionQuestions: [
      "What market or department am I ignoring because I don't understand it yet?",
      "Is my current environment still supporting my growth, or capping my potential?",
      "What is the opportunity cost of staying exactly where I am?",
      "Where could I deploy my focus that would force me to level up?",
      "Am I using 'stability' as an excuse to avoid necessary expansion?",
    ],
  },
  "交友": {
    keyActions: [
      "Identify the three people in your network who have access to the opportunities you need next.",
      "Propose a structured, mutually beneficial collaboration or referral agreement.",
      "Audit your professional circle and cut ties with low-value or draining commitments.",
      "Host a dinner or meetup to position yourself as a connector in your industry.",
      "Activate dormant relationships with a specific, high-value proposition.",
      "Turn casual networking into tangible, outcome-backed professional relationships.",
    ],
    watchOut: [
      "Deploying time into relationships based on history rather than strategic alignment.",
      "Allowing charismatic people to dictate your schedule while you carry the execution load.",
      "Watching others advance through connections while you rely solely on hard work.",
      "Assuming opportunities will materialize without making a direct ask.",
      "Maintaining social circles that haven't evolved as your career has.",
      "Missing growth opportunities that require coalition building.",
    ],
    successMetrics: [
      "New strategic partnerships or collaborations formalized",
      "Dormant relationships reactivated with tangible career or revenue outcomes",
      "Network audited and draining commitments eliminated",
      "Opportunities or doors opened through deliberate network activation",
      "Influence measurably increased within your target industry",
    ],
    reflectionQuestions: [
      "Who in my network has the leverage I need, and what can I offer them?",
      "Am I building strategic alliances, or just collecting contacts?",
      "What opportunities am I missing by trying to execute everything solo?",
      "How can I position myself as a high-value node in my network?",
      "Which relationships are costing me more energy than they generate?",
    ],
  },
  "财帛": {
    keyActions: [
      "Liquidate underperforming investments or side-projects and reallocate your focus.",
      "Raise your rates, negotiate a raise, or increase your product pricing.",
      "Launch the secondary income stream or side hustle you have been planning.",
      "Audit your personal finances: cut low-value expenses and eliminate bloat.",
      "Leverage your existing network to secure better terms on financial opportunities.",
      "Convert accumulated skills and knowledge into scalable income streams.",
    ],
    watchOut: [
      "Parking money in low-yield accounts without reviewing performance.",
      "Ignoring that you've been on the wrong financial path and refusing to cut losses.",
      "Sitting on valuable skills without packaging or monetizing them.",
      "Waiting for a windfall instead of engineering your own opportunities.",
      "Letting resources collect dust when they could be deployed for growth.",
      "Underpricing your expertise because you fear losing the opportunity.",
    ],
    successMetrics: [
      "Investment portfolio reviewed and capital reallocated",
      "New income stream launched or compensation successfully increased",
      "Profits taken strategically from performing assets",
      "Skills or knowledge packaged and monetized",
      "Personal finances audited and expenses reduced",
    ],
    reflectionQuestions: [
      "What resources do I own that are not generating an acceptable return?",
      "When was the last time I aggressively audited my compensation or pricing?",
      "What skills could I monetize immediately?",
      "Am I actively managing my finances, or just hoping they grow?",
      "Where am I leaving money on the table out of fear or complacency?",
    ],
  },
  "田宅": {
    keyActions: [
      "Review and optimize your property, living situation, or foundational assets.",
      "Refinance debt, renegotiate terms, or leverage existing equity to fund your next move.",
      "Invest in upgrading your core operational setup, like your home office or software tools.",
      "Secure your personal brand assets and foundational stability.",
      "Conduct a thorough market analysis to identify undervalued opportunities in your space.",
      "Use your established foundation as leverage for your next major strategic pivot.",
    ],
    watchOut: [
      "Making speculative new purchases before optimizing the cash flow of your current assets.",
      "Ignoring maintenance that quietly erodes the value of your base.",
      "Relying on outdated financial strategies without proper market research.",
      "Sitting on equity or savings without deploying them for leverage.",
      "Allowing foundational cracks in your personal life to go unaddressed.",
      "Ignoring family or living-situation tensions that threaten your core stability.",
    ],
    successMetrics: [
      "Asset portfolio or living situation optimized for increased yield or reduced cost",
      "Operational infrastructure or personal systems upgraded",
      "Debt refinanced or equity leveraged strategically",
      "Foundational assets secured",
      "Market research completed to inform next major acquisition",
    ],
    reflectionQuestions: [
      "What assets do I own that are not working as hard as they should?",
      "Is my operational foundation strong enough to support my next phase of growth?",
      "Are my key relationships supporting or threatening my core stability?",
      "What upgrades would maximize the value of my current setup?",
      "Am I leveraging my resources effectively, or just sitting on them?",
    ],
  },
  "福德": {
    keyActions: [
      "Hire a coach, therapist, or advisor to eliminate your strategic blind spots.",
      "Take a dedicated strategy weekend to map your next 12-month career and financial plan.",
      "Audit your decision-making patterns: where are you leaving opportunities on the table out of fear?",
      "Invest heavily in your physical and mental capacity to sustain peak performance.",
      "Say 'yes' to high-leverage opportunities and a ruthless 'no' to draining distractions.",
      "Clear the psychological bottlenecks that are capping your financial or career growth.",
    ],
    watchOut: [
      "Burning out by pouring into output without internal recovery and reflection.",
      "Making major financial or career decisions while mentally depleted.",
      "Operating from a scarcity mindset instead of an abundance mindset.",
      "Sabotaging your growth through unexamined psychological patterns.",
      "Letting unclear priorities eat away your capacity and focus.",
      "Working harder on execution without addressing strategic misalignment.",
    ],
    successMetrics: [
      "Strategic blind spots identified and addressed with professional guidance",
      "12-month career and financial plan finalized",
      "Decision-making speed and confidence measurably improved",
      "Psychological bottlenecks to growth cleared",
      "Mental capacity and focus noticeably increased",
    ],
    reflectionQuestions: [
      "What psychological patterns are sabotaging my success?",
      "Do I trust my strategic instincts, or constantly second-guess my decisions?",
      "Am I operating from a place of confidence or a place of fear?",
      "What would change if my internal state matched my ambitions?",
      "Where am I leaking capacity that should be directed toward my goals?",
    ],
  },
  "夫妻": {
    keyActions: [
      "Ensure your primary partner is aligned on your current risk tolerance and career trajectory.",
      "Clarify the terms, splits, and contributions of your key professional collaborations.",
      "Address bottlenecks with key collaborators immediately to protect your bandwidth.",
      "Establish a 'two-yes' rule for any major financial deployment or time commitment.",
      "Trim the fat and clear up mismatched expectations in your closest alliances.",
      "Focus on facts, agreements, and strategy, not just feelings and history.",
    ],
    watchOut: [
      "Taking unilateral financial risks that destabilize your home-base or primary partnership.",
      "Subsidizing an underperforming partner because you want to avoid a difficult conversation.",
      "Carrying unspoken frustration that eventually fractures the partnership.",
      "Letting emotional clutter dictate your strategic decisions.",
      "Tolerating misalignment instead of forcing a resolution or an exit.",
      "Dragging unresolved partnership tensions into your next phase of growth.",
    ],
    successMetrics: [
      "Alignment achieved on risk tolerance and career trajectory",
      "Partnership terms and expectations formalized",
      "Bottlenecks with key partners resolved",
      "Two-yes rule established for major commitments",
      "Emotional clutter eliminated through direct communication",
    ],
    reflectionQuestions: [
      "Is this partnership amplifying my growth or draining my capacity?",
      "What hard conversation am I avoiding that is costing me money or peace?",
      "Are we operating as a unified front, or just tolerating each other?",
      "What emotional noise is clouding my strategic judgment?",
      "If this partnership dynamics don't change, what is the long-term cost?",
    ],
  },
  "兄弟": {
    keyActions: [
      "Audit your peer collaborations and distance yourself from colleagues who drain your capacity.",
      "Identify peers who have complementary skills and propose a structured exchange.",
      "Set clear, written boundaries on family loans or informal financial arrangements.",
      "Consolidate your inner circle to only those who compound your outcomes.",
      "Build clarity around who belongs in your strategic brain trust.",
      "Focus ruthlessly on the quality of your professional connections over the quantity.",
    ],
    watchOut: [
      "Competing with peers for status instead of collaborating to capture larger opportunities.",
      "Covering peer costs or operational gaps until resentment builds.",
      "Keeping people in your inner circle just because of shared history.",
      "Tolerating low-performers or distractions in your immediate orbit.",
      "Letting surface-level connections consume your most valuable asset: your time.",
      "Allowing unaligned voices to influence your strategic decisions.",
    ],
    successMetrics: [
      "Inner circle audited and capacity-draining connections removed",
      "Structured exchanges of value established with key peers",
      "Boundaries set on informal financial arrangements",
      "Quality of strategic brain trust noticeably improved",
      "Focus and clarity enhanced through better circle management",
    ],
    reflectionQuestions: [
      "Who in my circle actually accelerates my trajectory?",
      "Who am I keeping around out of obligation rather than mutual value?",
      "What would happen to my output if I cut ties with my most draining connection?",
      "Am I surrounding myself with peers who challenge my thinking?",
      "Which connections have expired and should not follow me into my next phase?",
    ],
  },
  "子女": {
    keyActions: [
      "Set strict, 90-day measurable milestones for any junior talent or project you are managing.",
      "Cap the time and resources you provide to underperforming initiatives.",
      "Structure your long-term plans: update your investments, savings, and future goals.",
      "Delegate routine tasks to junior team members so you can focus on high-leverage strategy.",
      "Reward execution, not just effort. Celebrate finished results publicly.",
      "Define exactly what assets or skills you want to scale for the future.",
    ],
    watchOut: [
      "Providing warmth and encouragement without deadlines, creating dependence.",
      "Deploying endless time into people or projects because cutting them off feels too harsh.",
      "Carrying your team's problems like they are your own.",
      "Letting guilt or frustration dictate how you manage your subordinates.",
      "Leaving your long-term plans scattered without proper structure.",
      "Procrastinating on necessary project cancellations or team changes.",
    ],
    successMetrics: [
      "Measurable milestones established for all junior talent and projects",
      "Time and resources capped for underperforming initiatives",
      "Long-term investments and savings plans updated",
      "Routine tasks successfully delegated",
      "Clear direction established for scalable assets and skills",
    ],
    reflectionQuestions: [
      "Am I funding dependence or funding growth?",
      "What underperforming project or person do I need to cut off?",
      "Are my long-term plans clearly structured?",
      "What routine tasks am I hoarding that I should be delegating?",
      "What do I actually want to build that outlasts my direct involvement?",
    ],
  },
  "父母": {
    keyActions: [
      "Identify the sponsor or senior leader who can unblock your next major move and make a specific ask.",
      "Formalize any informal family financial arrangements or eldercare responsibilities.",
      "Stop seeking approval and start seeking leverage. Bring solutions to your mentors.",
      "Identify one historical pattern in your career that limits your growth and interrupt it.",
      "Address how authority figures shape your decision-making and set necessary boundaries.",
      "Use data and performance metrics to break free from outdated corporate or family narratives.",
    ],
    watchOut: [
      "Saying yes to a boss or senior family figure out of obligation when it damages your own trajectory.",
      "Chasing mentorship when what you actually need is a direct introduction or opportunity.",
      "Carrying outdated narratives about your capabilities that no longer serve you.",
      "Blaming your background or previous bosses for your current plateau.",
      "Letting fear of authority dictate your strategic decisions.",
      "Operating from a subordinate mindset instead of a peer mindset.",
    ],
    successMetrics: [
      "Specific ask made to a key sponsor or senior leader",
      "Informal family financial arrangements formalized",
      "Limiting historical career pattern identified and interrupted",
      "Boundaries set with authority figures where necessary",
      "Shifted from seeking approval to seeking strategic leverage",
    ],
    reflectionQuestions: [
      "What outdated narrative about my career am I still believing?",
      "Am I using my background as an excuse or as context for my unique edge?",
      "How much of my current strategy is dictated by fear of displeasing authority?",
      "What would change if I operated as a peer to my mentors rather than a subordinate?",
      "Am I stepping up to claim my leverage, or waiting for permission?",
    ],
  },
  "命宫": {
    keyActions: [
      "Invest time and money into acquiring a new high-leverage skill or certification.",
      "Rebuild your personal brand and positioning to command a higher market premium.",
      "Audit your daily habits: eliminate the routines that do not serve your goals.",
      "Take ownership of your trajectory: stop waiting for permission to make your next move.",
      "Use this window to strengthen your foundation before the next expansion phase.",
      "Position yourself as your most important asset and invest accordingly.",
    ],
    watchOut: [
      "Pouring into everyone else's projects while neglecting your own positioning.",
      "Postponing self-investment under the guise of 'responsibility' to others.",
      "Hitting the same compensation or growth ceiling year after year without upgrading your skills.",
      "Waiting for the 'perfect time' to rebrand or pivot.",
      "Resisting the necessary pause when you should be rebuilding your foundation.",
      "Applying outdated skills to new market problems.",
    ],
    successMetrics: [
      "Investment made in high-leverage skill acquisition or certification",
      "Personal brand and market positioning upgraded",
      "Daily habits audited and unproductive routines eliminated",
      "Personal foundation noticeably strengthened",
      "Next-phase strategic positioning finalized",
    ],
    reflectionQuestions: [
      "When was the last time I invested directly into my own capability?",
      "What upgraded version of myself does my next target require?",
      "If I don't upgrade my positioning now, what is the cost in 5 years?",
      "What would I execute if I made my own growth the absolute priority?",
      "Am I increasing my leverage, or just staying busy?",
    ],
  },
  "疾厄": {
    keyActions: [
      "Schedule comprehensive health screenings and address any biological warning signs.",
      "Optimize your sleep, nutrition, and exercise routines to maximize your daily output.",
      "Take a mandatory period of rest to rebuild your physical and mental reserves.",
      "Treat your body as your most valuable asset: invest in its maintenance and longevity.",
      "Build sustainable routines instead of compensating with sheer willpower.",
      "Use this consolidation window to ensure you have the stamina for the next expansion.",
    ],
    watchOut: [
      "Pushing through warning signals from your body, risking a catastrophic crash.",
      "Scheduling this month as densely as a peak-performance month.",
      "Running on empty and telling yourself you will rest after the next milestone.",
      "Compensating for exhaustion with stimulants instead of structural rest.",
      "Burning out and missing your next major opportunity window.",
      "Rebuilding your career or wealth while destroying the biological vehicle that carries it.",
    ],
    successMetrics: [
      "Health screenings completed and issues addressed",
      "Sleep, nutrition, and exercise protocols optimized for peak output",
      "Mandatory rest periods scheduled and honored",
      "Energy levels and cognitive stamina noticeably improved",
      "Biological foundation secured for the next growth cycle",
    ],
    reflectionQuestions: [
      "What physical warning signs have I been ignoring in the pursuit of output?",
      "Am I truly recovering, or just collapsing when I can no longer function?",
      "Can my current physical capacity sustain my 5-year ambitions?",
      "What is the ROI of slowing down now versus crashing later?",
      "Am I managing my biology as carefully as I manage my career?",
    ],
  },
};
