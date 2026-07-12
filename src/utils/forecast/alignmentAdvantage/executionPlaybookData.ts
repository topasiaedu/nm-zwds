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
      "Ask for a raise, negotiate a better bonus structure, or push for a title change that reflects the work you actually do.",
      "Stop planning and finally launch that side hustle or pitch that new project at work.",
      "Take credit for your work. Make sure the people who control your pay know exactly what you contributed.",
      "Look at your current job objectively: if you aren't learning or earning more, start planning your exit.",
      "Use your track record to negotiate better terms on your next contract or job offer.",
      "Step into the spotlight. Stop hiding behind your team or your boss.",
    ],
    watchOut: [
      "Taking on more work without getting paid more for it.",
      "Doing all the hard work but letting someone else take the credit.",
      "Waiting for someone to offer you a promotion instead of asking for it.",
      "Staying in a comfortable job that is slowly killing your career growth.",
      "Using 'I have 10 years of experience' as an excuse to avoid learning new skills.",
      "Staying quiet during a month where you should be demanding more.",
    ],
    successMetrics: [
      "Secured a raise, promotion, or new job offer",
      "Key decision-makers know exactly what you achieved this month",
      "Launched the project or side hustle you've been delaying",
      "Connected with three people who can advance your career",
      "Decided whether to stay or leave your current role",
    ],
    reflectionQuestions: [
      "Am I getting paid what I'm actually worth to this company?",
      "Why am I afraid to ask for more money or a better title?",
      "Am I acting like a leader, or just a really good employee?",
      "If I stay in this exact job for 3 more years, will I regret it?",
      "What would I ask for today if I knew my boss would say yes?",
    ],
  },
  "迁移": {
    keyActions: [
      "Go to an event outside your usual industry. Meet people who don't do what you do.",
      "Test a completely new way of finding clients or job opportunities.",
      "Consider moving to a new city, switching departments, or changing your physical environment.",
      "Reach out to someone in a different country or market to explore opportunities.",
      "Take a calculated risk that disrupts your normal routine.",
      "Change your scenery. Work from a different location to break out of a rut.",
    ],
    watchOut: [
      "Trying to expand into new areas when your current job or business is falling apart.",
      "Treating business travel as a vacation instead of a chance to network.",
      "Staying in a declining industry or city just because it's familiar.",
      "Waiting for the 'perfect time' to make a move.",
      "Playing it safe when the market is rewarding people who take risks.",
      "Moving or expanding just for the sake of it, without a clear reason why.",
    ],
    successMetrics: [
      "Attended an event or meeting completely outside your comfort zone",
      "Tested a new way to get clients or job leads",
      "Made a connection in a new city or market",
      "Changed your physical work environment",
      "Took one calculated risk you've been avoiding",
    ],
    reflectionQuestions: [
      "What industry or market am I ignoring because I don't understand it?",
      "Is my current city or company capping my potential?",
      "What is it costing me to stay exactly where I am?",
      "Where could I go that would force me to level up?",
      "Am I using 'stability' as an excuse to avoid change?",
    ],
  },
  "交友": {
    keyActions: [
      "Pick three people who already have what you want, and ask them for a focused 15-minute call.",
      "Stop doing useless coffee chats. Only meet with people who align with your goals.",
      "Ask a happy client or a former boss for a direct referral or introduction.",
      "Host a small dinner or meetup to connect the smartest people you know.",
      "Reach out to an old colleague who is doing well and propose a way to help them.",
      "Turn casual networking into real, written agreements or job leads.",
    ],
    watchOut: [
      "Spending time with old friends who complain constantly and drag you down.",
      "Doing favors for people who never help you in return.",
      "Watching others get promoted through connections while you just work harder.",
      "Hoping people will offer you opportunities without you actually asking.",
      "Hanging out with the exact same group of people you did five years ago.",
      "Trying to do everything yourself instead of asking for help.",
    ],
    successMetrics: [
      "Asked for and received a direct referral or introduction",
      "Cut out one networking commitment that was wasting your time",
      "Reconnected with a high-value former colleague",
      "Hosted or organized a meetup of smart people",
      "Turned a casual contact into a real opportunity",
    ],
    reflectionQuestions: [
      "Who in my network can actually help me get to the next level?",
      "Am I building real alliances, or just collecting LinkedIn connections?",
      "What opportunities am I missing because I won't ask for help?",
      "How can I become the most valuable person in my network?",
      "Which relationships are exhausting me?",
    ],
  },
  "财帛": {
    keyActions: [
      "Review your bank statements and cancel subscriptions or services you don't use.",
      "Sell off investments that are losing money or shut down side projects that don't pay.",
      "Take a skill you already have and turn it into a paid service or consulting offer.",
      "Raise your prices if you freelance, or ask for a bonus if you are employed.",
      "Move cash out of low-interest accounts and put it somewhere it will actually grow.",
      "Ask your network for better financial opportunities or investment advice.",
    ],
    watchOut: [
      "Leaving money in accounts that don't even beat inflation.",
      "Holding onto a bad investment or a failing side hustle because of pride.",
      "Having valuable skills but being too afraid to charge money for them.",
      "Waiting to win the lottery instead of actively managing your money.",
      "Buying things to look rich instead of buying assets that make you rich.",
      "Charging too little because you are afraid the client will say no.",
    ],
    successMetrics: [
      "Canceled useless subscriptions and cut wasted spending",
      "Moved money into a better investment or savings account",
      "Priced and launched a new skill or service",
      "Successfully raised your rates or negotiated a bonus",
      "Sold off a losing investment or shut down a dead project",
    ],
    reflectionQuestions: [
      "What am I paying for every month that I don't actually use?",
      "When was the last time I asked for more money?",
      "What is one thing I know how to do that people would pay for today?",
      "Am I actively managing my money, or just hoping I have enough?",
      "Where am I leaving money on the table because I'm afraid to ask?",
    ],
  },
  "田宅": {
    keyActions: [
      "Fix the broken things in your house or apartment. Your environment affects your mindset.",
      "Look into refinancing your mortgage or renegotiating your rent.",
      "Upgrade your laptop, your chair, or the software you use every day to work faster.",
      "Organize your digital files, secure your passwords, and back up your work.",
      "Research the real estate market in your area, even if you aren't ready to buy yet.",
      "Use the equity in your home or your savings to fund a smart career move.",
    ],
    watchOut: [
      "Buying a new house or car before you have your daily cash flow under control.",
      "Ignoring home maintenance until it becomes a massive, expensive emergency.",
      "Working on a slow computer or in a messy room and wondering why you are unproductive.",
      "Leaving your savings in a regular bank account instead of using it as leverage.",
      "Ignoring tension with your roommates or family that makes your home stressful.",
      "Assuming you can't afford property without actually running the numbers.",
    ],
    successMetrics: [
      "Fixed or upgraded your primary workspace",
      "Organized your digital life and secured your assets",
      "Researched property or rental prices in your target area",
      "Addressed a maintenance issue at home",
      "Explored options to refinance or lower your housing costs",
    ],
    reflectionQuestions: [
      "Does my home and workspace make me feel energized or exhausted?",
      "Is my daily equipment (laptop, phone, chair) slowing me down?",
      "Are my living arrangements causing me unnecessary stress?",
      "What is one upgrade I could make to my environment that would pay for itself?",
      "Am I using my savings effectively, or just letting it sit there?",
    ],
  },
  "福德": {
    keyActions: [
      "Hire a therapist, a coach, or an advisor to point out the blind spots you can't see.",
      "Take a weekend completely off work just to plan your next 12 months.",
      "Look at your past decisions: where did you lose money or opportunity because you were scared?",
      "Start sleeping 8 hours, eat better, and exercise. You can't perform if you are exhausted.",
      "Say 'yes' to one big scary opportunity, and say 'no' to three things that waste your time.",
      "Stop overthinking and just make the decision you've been putting off.",
    ],
    watchOut: [
      "Working 14-hour days without taking time to actually think about your strategy.",
      "Making big money or career choices when you are tired, angry, or stressed.",
      "Acting like there is never enough money or time, which makes you desperate.",
      "Repeating the same self-sabotaging mistakes because you won't ask for help.",
      "Letting other people's emergencies ruin your schedule.",
      "Working harder on the wrong thing instead of stopping to find the right thing.",
    ],
    successMetrics: [
      "Booked a session with a coach, therapist, or mentor",
      "Took a full weekend off to plan and reflect",
      "Said 'no' to three time-wasting requests",
      "Made the hard decision you were procrastinating on",
      "Improved your sleep or exercise routine for one full week",
    ],
    reflectionQuestions: [
      "What bad habit is secretly ruining my success?",
      "Do I trust my gut, or do I constantly second-guess myself?",
      "Am I making decisions out of confidence, or out of fear?",
      "What would change if I actually believed I was going to succeed?",
      "Where am I wasting energy that I should be spending on my goals?",
    ],
  },
  "夫妻": {
    keyActions: [
      "Sit down with your partner and clearly state your financial goals for the year. Stop guessing.",
      "If you have a business partner, put your agreements, splits, and exit plans in writing.",
      "Address the tension with your spouse or co-founder today. Do not let it fester.",
      "Agree on a budget limit (e.g., 'we must discuss any purchase over $1,000').",
      "Stop being passive-aggressive. State exactly what you expect from your closest relationships.",
      "Make decisions based on facts and numbers, not just how you feel about the person.",
    ],
    watchOut: [
      "Making a huge career change or spending a lot of money without telling your partner.",
      "Doing your business partner's work for them because you hate conflict.",
      "Staying silent when you are angry, which will eventually destroy the relationship.",
      "Letting a fight at home ruin your focus at work.",
      "Staying in a bad partnership just because it's easier than leaving.",
      "Bringing old arguments into new decisions.",
    ],
    successMetrics: [
      "Had a clear, honest conversation about money and goals with your partner",
      "Put a professional partnership agreement in writing",
      "Addressed one major source of tension directly",
      "Set a clear rule for how you and your partner make big decisions",
      "Stopped a passive-aggressive habit",
    ],
    reflectionQuestions: [
      "Is my partner helping me grow, or holding me back?",
      "What hard conversation am I avoiding right now?",
      "Are we acting like a team, or just two people living/working together?",
      "Is my anger at home affecting my performance at work?",
      "If this relationship doesn't change, what will happen in 5 years?",
    ],
  },
  "兄弟": {
    keyActions: [
      "Stop doing your coworkers' jobs for them. Let them fail if they don't do the work.",
      "Find colleagues who are smarter than you and figure out how you can help each other.",
      "Set strict rules for family members who constantly ask you for money or favors.",
      "Cut out the 'friends' who only call you when they need something.",
      "Decide exactly who is in your inner circle, and ignore everyone else's opinions.",
      "Focus on having three great professional connections rather than fifty shallow ones.",
    ],
    watchOut: [
      "Competing with your coworkers to look good instead of teaming up to get results.",
      "Paying for things or doing favors until you secretly resent the person.",
      "Hanging out with people just because you went to school together 10 years ago.",
      "Keeping lazy or negative people around because you feel bad for them.",
      "Letting casual acquaintances waste your most valuable asset: your time.",
      "Listening to career advice from people who aren't where you want to be.",
    ],
    successMetrics: [
      "Said no to a coworker asking you to do their job",
      "Set a clear boundary with a family member about money or time",
      "Reached out to a highly competent colleague to collaborate",
      "Ignored unsolicited advice from someone outside your inner circle",
      "Cut ties with a connection that only drains you",
    ],
    reflectionQuestions: [
      "Which of my peers actually makes me better at my job?",
      "Who am I keeping in my life out of guilt?",
      "What would happen if I stopped doing favors for people who don't appreciate it?",
      "Am I surrounding myself with people who challenge me?",
      "Which friendships have expired and need to be let go?",
    ],
  },
  "子女": {
    keyActions: [
      "Give your team or your kids clear deadlines and expectations. Stop hand-holding.",
      "Stop throwing money or time at projects (or people) that aren't improving. Cut them off.",
      "Update your will, check your life insurance, and organize your long-term savings.",
      "Teach a junior employee how to do your routine tasks so you can focus on bigger things.",
      "Praise people when they actually finish the job, not just when they try hard.",
      "Decide what skills or assets you want to build that will pay off in 10 years.",
    ],
    watchOut: [
      "Being so nice to your team that they become completely dependent on you.",
      "Refusing to fire a bad employee or cancel a bad project because it feels mean.",
      "Fixing your team's mistakes yourself instead of making them do it.",
      "Managing people based on your mood instead of the metrics.",
      "Having no plan for your savings or your family's future if something happens to you.",
      "Putting off hard decisions about your team until it's a crisis.",
    ],
    successMetrics: [
      "Set a strict deadline for a junior team member and held them to it",
      "Stopped funding or spending time on a failing project",
      "Updated your long-term savings or estate plan",
      "Taught someone else how to do one of your weekly tasks",
      "Praised a completed result publicly",
    ],
    reflectionQuestions: [
      "Am I helping my team grow, or just doing their work for them?",
      "What failing project or bad employee do I need to cut loose?",
      "Is my family financially protected if something happens to me?",
      "What tasks am I doing that a junior employee should be doing?",
      "What am I building today that will matter in a decade?",
    ],
  },
  "父母": {
    keyActions: [
      "Ask your boss or mentor exactly what it takes to get to the next level. Be specific.",
      "If you help your parents financially, decide on a fixed monthly amount and stick to it.",
      "Stop asking your mentors for general advice. Bring them a problem and a proposed solution.",
      "Realize you are an adult. Stop blaming your childhood or your old bosses for your current problems.",
      "Set boundaries with authority figures who demand too much of your personal time.",
      "Look at the data. Stop believing the outdated rules your industry or family taught you.",
    ],
    watchOut: [
      "Taking on a terrible project just because your boss asked you to, hurting your own career.",
      "Asking a mentor for 'a quick chat' without having specific questions prepared.",
      "Telling yourself you can't succeed because of where you came from.",
      "Complaining about your boss instead of figuring out how to manage them.",
      "Being too afraid of authority to speak up or share your ideas.",
      "Acting like a student when you should be acting like a peer.",
    ],
    successMetrics: [
      "Asked a boss or mentor a highly specific, strategic question",
      "Set a clear boundary regarding family financial support",
      "Caught yourself blaming the past and changed your mindset",
      "Pushed back respectfully on an unreasonable request from authority",
      "Presented a solution to your boss instead of just a problem",
    ],
    reflectionQuestions: [
      "What old rule about my career am I still following that isn't true anymore?",
      "Am I using my background as an excuse to play small?",
      "Am I too afraid of my boss to do my best work?",
      "What would change if I treated my mentors like peers instead of teachers?",
      "Am I waiting for someone to give me permission to succeed?",
    ],
  },
  "命宫": {
    keyActions: [
      "Buy that course, hire that coach, or learn that software. Invest money in your own brain.",
      "Update your resume, your LinkedIn, and how you introduce yourself to sound more expensive.",
      "Look at your daily routine. Stop doing the three things that waste the most time.",
      "Stop waiting for someone to pick you. Choose yourself and make the move.",
      "Use this month to get organized and prepared before things get crazy.",
      "Treat yourself like your most important asset. Spend time and money on your own upkeep.",
    ],
    watchOut: [
      "Helping everyone else achieve their goals while ignoring your own.",
      "Saying 'I don't have the money' to learn a skill that would double your income.",
      "Complaining about your salary but refusing to learn anything new.",
      "Waiting for the 'perfect time' to start looking for a new job or launch a project.",
      "Refusing to slow down and organize your life because you are addicted to being busy.",
      "Using old skills to try and solve new problems.",
    ],
    successMetrics: [
      "Spent money or dedicated time to learning a new, valuable skill",
      "Updated your professional profiles to reflect your true value",
      "Cut out one daily habit that was wasting your time",
      "Organized your workspace and schedule",
      "Took one action toward your biggest goal without asking for permission",
    ],
    reflectionQuestions: [
      "When was the last time I spent money to make myself smarter or faster?",
      "What new skill do I need to reach my next income goal?",
      "If I don't change my habits now, what will my life look like in 5 years?",
      "What would I do today if I made my own success the absolute priority?",
      "Am I actually moving forward, or just running on a treadmill?",
    ],
  },
  "疾厄": {
    keyActions: [
      "Go to the doctor, the dentist, or the physio. Stop ignoring the pain in your back or your gut.",
      "Get 8 hours of sleep, drink water, and eat real food. You cannot outwork a bad diet.",
      "Take a few days off where you do absolutely nothing related to work.",
      "Treat your body like a machine that makes you money. If it breaks, you go broke.",
      "Build a normal routine. Stop relying on adrenaline and coffee to get through the day.",
      "Use this month to rest so you have the energy to dominate next month.",
    ],
    watchOut: [
      "Ignoring headaches, exhaustion, or pain because you are 'too busy'.",
      "Packing your schedule so full that you don't have time to eat lunch.",
      "Telling yourself you will finally sleep after this one big project is done.",
      "Drinking four coffees a day instead of just going to bed earlier.",
      "Burning out so badly that you miss the next big opportunity.",
      "Making a lot of money but destroying your health in the process.",
    ],
    successMetrics: [
      "Booked and attended a health checkup or appointment",
      "Got 7-8 hours of sleep for a full week",
      "Took a full day off to rest and recover",
      "Cut back on caffeine or junk food",
      "Listened to your body and stopped working when you were exhausted",
    ],
    reflectionQuestions: [
      "What physical pain or warning sign am I ignoring right now?",
      "Am I actually resting, or just passing out from exhaustion?",
      "Can my body survive working like this for another 5 years?",
      "What is the cost of slowing down now versus ending up in the hospital later?",
      "Am I taking care of my body as well as I take care of my career?",
    ],
  },
};
