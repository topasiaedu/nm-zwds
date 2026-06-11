/**
 * Structure Content Data — Formation Profiles and Structure Labels
 *
 * Display-layer copy for the Speed Player / Endurance Player framework
 * and all 9 named formations. Consumed by the Alignment Advantage web page
 * and the Strategic Playbook PDF.
 *
 * Source: Cae Goh "The Alignment Advantage" webinar script and
 *         "Design Your Destiny" workshop slides.
 */

import type {
  FormationKey,
  SpecialFormationKey,
  StructureType,
} from "../zwds/analysis/structureAnalysis";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface FormationProfile {
  /** Chinese display name, e.g. "杀破狼". */
  chineseName: string;
  /** Full Chinese style name with 格/formation suffix, e.g. "杀破狼格". */
  chineseStyle: string;
  /** English name used in the webinar, e.g. "Power Commander". */
  englishName: string;
  /** Webinar sub-label for this formation, e.g. "Breakthrough Warrior". */
  subtitle: string;
  /** Speed, Endurance, or Special category. */
  playerType: "speed" | "endurance" | "special";
  /** One-sentence value proposition for this formation. */
  tagline: string;
  /** Three concise key traits shown as bullets. */
  keyTraits: [string, string, string];
  /** One-line description of roles / contexts this formation thrives in. */
  suitableFor: string;
  /** What this formation should lean into — strategic strength to amplify. */
  strategyAdvice: string;
  /** What drains this formation — the misalignment to avoid. */
  avoidAdvice: string;
  /**
   * Three conditions that indicate a decision is well-aligned with this
   * formation — "green flag" signals to proceed.
   */
  greenFlags: [string, string, string];
  /**
   * Three conditions that indicate a decision is misaligned with this
   * formation — "red flag" signals to reconsider or walk away.
   */
  redFlags: [string, string, string];
  /**
   * Formation-specific heuristic for evaluating a high-stakes decision.
   * One sentence that captures the core evaluation rule for this formation.
   */
  decisionRule: string;
}

export interface StructureLabel {
  label: string;
  description: string;
  /** Emoji icon for quick visual identification. */
  icon: string;
  /** Tailwind gradient classes for the hero card background. */
  gradient: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Speed / Endurance Player Labels
// ─────────────────────────────────────────────────────────────────────────────

export const STRUCTURE_LABELS: Record<StructureType, StructureLabel> = {
  speed: {
    label:       "Speed Player",
    description: "Wired for rapid acceleration, fast wins, and high-intensity moves. Your edge is momentum — the faster you move, the stronger your results.",
    icon:        "⚡",
    gradient:    "from-orange-500 to-red-600",
  },
  endurance: {
    label:       "Endurance Player",
    description: "Wired for steady compounding, long-term consistency, and deep mastery. Your edge is resilience — the longer you commit, the stronger your results.",
    icon:        "🏔️",
    gradient:    "from-amber-600 to-yellow-700",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Formation Profiles
// ─────────────────────────────────────────────────────────────────────────────

export const FORMATION_PROFILES: Record<FormationKey | SpecialFormationKey, FormationProfile> = {

  // ── Speed Player Formations ───────────────────────────────────────────────

  powerCommander: {
    chineseName:    "杀破狼",
    chineseStyle:   "杀破狼格",
    englishName:    "Power Commander",
    subtitle:       "Breakthrough Warrior",
    playerType:     "speed",
    tagline:        "You are built for disruption, bold moves, and rebuilding things better — restlessness in stability is not a flaw, it is your signal to move.",
    keyTraits:      [
      "Bold, action-driven — you charge first and refine later",
      "Breakthrough-focused — you thrive on breaking old patterns",
      "High-risk, high-reward — you win big or learn big",
    ],
    suitableFor:    "Entrepreneur, sales leader, trading, crisis management, trendy AI and tech ventures",
    strategyAdvice: "Lean into rapid pivots, aggressive expansion, and first-mover opportunities. Launch before it is perfect.",
    avoidAdvice:    "Avoid slow-build endurance strategies — long-term retainers, incremental improvement, and 'wait and see' approaches will suffocate your formation.",
    greenFlags: [
      "The opportunity is time-sensitive and requires fast, decisive action",
      "First-mover advantage is on the table — speed determines the outcome",
      "The move involves breaking an old structure and building something new",
    ],
    redFlags: [
      "The path forward requires slow, steady incremental progress with no clear breakthrough moments",
      "Success depends entirely on one long-term relationship or a single deep partnership",
      "The situation punishes pivoting and rewards staying the course at all costs",
    ],
    decisionRule: "Ask: is there a clear breakthrough moment within 12 months? If yes, move — if the timeline stretches beyond that without a bold inflection point, this is not your play.",
  },

  bigLandlord: {
    chineseName:    "日月照壁",
    chineseStyle:   "日月照壁格",
    englishName:    "Big Landlord",
    subtitle:       "Empire Builder",
    playerType:     "speed",
    tagline:        "You are designed to acquire and consolidate quickly — not one business, but a portfolio of assets and ventures under your command.",
    keyTraits:      [
      "Strong real estate and asset fortune",
      "Solid backing — rarely without resources",
      "High chance to inherit or accumulate land and fixed assets",
    ],
    suitableFor:    "Landlords, investors, anyone managing fixed assets, multi-venture operators",
    strategyAdvice: "Build through acquisitions and multiple irons in the fire. Your power compounds when you own more, not when you go deeper into one thing.",
    avoidAdvice:    "Avoid trying to focus on a single venture — constraint and focus strategies designed for mastery-type formations will underperform for you.",
    greenFlags: [
      "The move allows you to acquire or control a tangible asset — property, business stake, or territory",
      "Multiple parallel opportunities exist that can be pursued simultaneously without diluting capital",
      "The deal involves consolidation — bringing things under one command structure",
    ],
    redFlags: [
      "The opportunity requires exclusive focus and the deliberate abandonment of all other ventures",
      "Returns depend on depth of execution in one narrow lane over many years",
      "The deal involves giving up ownership or control of assets already in your portfolio",
    ],
    decisionRule: "Ask: does this move expand your asset base or consolidate what you control? If yes, proceed — if it shrinks your portfolio or creates dependency on a single income source, reconsider.",
  },

  riskyTrading: {
    chineseName:    "机动格",
    chineseStyle:   "机动进取格",
    englishName:    "Risky Trading",
    subtitle:       "Strategic Gambler",
    playerType:     "speed",
    tagline:        "You win through calculated bets, market timing, and deal-making — volume, opportunity, and strategic speculation are your natural language.",
    keyTraits:      [
      "Wins through calculated bets and precise timing",
      "Thrives on active transactions and deal flow",
      "Opportunistic — fast decisions, high execution",
    ],
    suitableFor:    "Active traders, deal-makers, high-volume sales, transactional businesses",
    strategyAdvice: "Stay in motion — keep deal flow high, act on windows fast, and treat every transaction as practice for the next one.",
    avoidAdvice:    "Avoid buy-and-hold passive strategies — sitting still drains your formation. You need action to generate results.",
    greenFlags: [
      "High transaction volume is possible — the more deals in play, the better your odds",
      "Timing is the primary edge — acting in the right window is more important than the deal structure",
      "The market or sector is volatile enough to reward calculated risk-takers",
    ],
    redFlags: [
      "The opportunity is locked up in a single long-term bet with no liquidity or exit options",
      "Success requires patient waiting with no active deal flow during the hold period",
      "The risk profile is binary with no room for incremental bets or position adjustments",
    ],
    decisionRule: "Ask: can you make multiple smaller bets within this space rather than one large irreversible bet? If yes, move — if this is an all-in single-shot opportunity, proceed with extreme caution.",
  },

  // ── Endurance Player Formations ───────────────────────────────────────────

  tripletalent: {
    chineseName:    "三奇嘉会",
    chineseStyle:   "三奇嘉会格",
    englishName:    "Triple Talent",
    subtitle:       "Sustainable Excellence",
    playerType:     "endurance",
    tagline:        "You are built for mastery — outstanding intelligence combined with strong achievement potential makes depth your greatest wealth accelerator.",
    keyTraits:      [
      "Outstanding intelligence and analytical capability",
      "Strong achievement potential — top of your field over time",
      "Academic and professional excellence — you win by going deepest",
    ],
    suitableFor:    "Scholars, elite professionals, expert consultants, high-level educators",
    strategyAdvice: "Go deep, not wide. Compound your expertise over years. The longer you stay in one lane, the wider your advantage becomes.",
    avoidAdvice:    "Avoid chasing multiple ventures simultaneously — diluting your focus across many things is the fastest way to underperform your formation.",
    greenFlags: [
      "The move deepens your expertise and reinforces your reputation in a specific domain",
      "Long-term mastery is rewarded — success compounds the longer you stay committed",
      "The opportunity builds intellectual capital that becomes increasingly defensible over time",
    ],
    redFlags: [
      "The path requires constant context-switching across multiple different domains simultaneously",
      "Speed and volume matter more than depth and precision in this opportunity",
      "The market rewards being first rather than being best — execution pace trumps quality",
    ],
    decisionRule: "Ask: will being the deepest expert in this space give you a structural edge in 3–5 years? If yes, move — if the advantage is purely speed-based and expertise compounds slowly, this is not your optimal play.",
  },

  nobleSupport: {
    chineseName:    "辅弼拱主",
    chineseStyle:   "辅弼拱主格",
    englishName:    "Noble Support",
    subtitle:       "Relationship Leverage",
    playerType:     "endurance",
    tagline:        "You are naturally supported — the right mentors, backers, and collaborators show up for you when you position yourself well.",
    keyTraits:      [
      "Well-supported — many helpful people appear at key moments",
      "Noble aura — you are respected and trusted easily",
      "Things flow smoothly in life when you build the right inner circle",
    ],
    suitableFor:    "Partnership-driven businesses, network-reliant roles, anyone building through relationships and referrals",
    strategyAdvice: "Invest deeply in your network — seek mentors, build strategic alliances, and let relationships be your primary wealth vehicle.",
    avoidAdvice:    "Avoid going it alone. Solo strategies and independent execution strip this formation of its core advantage.",
    greenFlags: [
      "The opportunity is supported by a strong mentor, backer, or strategic ally already in your corner",
      "Your network has warm connections in this space — relationships reduce friction and increase access",
      "The move strengthens your inner circle and positions you within a well-connected ecosystem",
    ],
    redFlags: [
      "You would be entering entirely new territory with no existing relationships or advocates",
      "The opportunity requires you to operate independently without collaboration or external support",
      "Success depends on competing directly against people with stronger individual skills in isolation",
    ],
    decisionRule: "Ask: do you have at least one high-quality champion, mentor, or ally who will actively support this move? If yes, proceed — if you are going in alone with no relational support, build that foundation first.",
  },

  wealthSupport: {
    chineseName:    "府相朝垣",
    chineseStyle:   "府相朝垣格",
    englishName:    "Wealth Support",
    subtitle:       "Fortress Builder",
    playerType:     "endurance",
    tagline:        "You are designed for stable fortune — you rarely lack resources, attract natural support, and can be provided for even without constant active effort.",
    keyTraits:      [
      "Stable fortune — rarely lacks resources or backing",
      "Natural support system — benefactors appear in life",
      "Can be provided for even without constant active hustle",
    ],
    suitableFor:    "Anyone prioritising long-term security, those who attract sponsors and silent backers",
    strategyAdvice: "Build systems that run without you — optimize, protect, and compound existing assets rather than launching new initiatives.",
    avoidAdvice:    "Avoid aggressive bets and expansion strategies — your formation rewards preservation and stability, not disruption.",
    greenFlags: [
      "The move protects and strengthens an existing asset base rather than replacing it",
      "Natural supporters and silent backers are already positioned around this opportunity",
      "Long-term stability is on offer — the risk profile is low and the compounding period is long",
    ],
    redFlags: [
      "The move requires dismantling or exiting from stable current assets to fund a speculative bet",
      "Success depends on aggressive expansion into unknown territory with no existing support structure",
      "The opportunity rewards high-risk, high-volatility positioning that conflicts with stability-first design",
    ],
    decisionRule: "Ask: does this move preserve and compound existing stability, or does it introduce unnecessary volatility? If it compounds stability, proceed — if it creates vulnerability in what is already working, protect your base first.",
  },

  wealthStabilization: {
    chineseName:    "稳固格",
    chineseStyle:   "稳固积累格",
    englishName:    "Wealth Stabilization",
    subtitle:       "Steady Accumulator",
    playerType:     "endurance",
    tagline:        "You are designed for fortress-style wealth — steady beats flashy, preservation beats speculation, and small consistent gains compound into empires.",
    keyTraits:      [
      "Wins through preservation and optimization, not bold bets",
      "Steady beats flashy — consistency is your competitive advantage",
      "Incremental improvements compound powerfully over decades",
    ],
    suitableFor:    "Long-term investors, operations builders, system optimizers, steady-growth businesses",
    strategyAdvice: "Focus on optimizing what you have — tighten systems, reduce waste, and protect your base. Let compounding do the heavy lifting.",
    avoidAdvice:    "Avoid copying aggressive Speed Player moves — the anxiety and pace of rapid pivots will erode your formation's natural advantage.",
    greenFlags: [
      "The move improves efficiency, reduces cost, or streamlines an existing system you already control",
      "Returns accumulate slowly and steadily — patience is rewarded over time",
      "Low downside risk with predictable, measurable progress milestones",
    ],
    redFlags: [
      "The timeline is aggressive and requires rapid expansion before a foundation is built",
      "The outcome is highly volatile — potential upside is large but requires tolerating deep uncertainty",
      "The opportunity requires abandoning systems that are currently performing in favor of untested alternatives",
    ],
    decisionRule: "Ask: can this move be measured and optimized incrementally over 12–24 months? If yes, proceed — if success is an all-or-nothing inflection point that requires betting against stability, wait for a more aligned opportunity.",
  },

  // ── Special Formations ────────────────────────────────────────────────────

  steadyPillar: {
    chineseName:    "机月同梁",
    chineseStyle:   "机月同梁格",
    englishName:    "Steady Pillar",
    subtitle:       "Ji Yue Tong Liang",
    playerType:     "special",
    tagline:        "You are a calm, detailed, strategy-first thinker who prefers stability over risk and builds breakthroughs through stepping outside your comfort zone.",
    keyTraits:      [
      "Calm, steady, detail-focused thinker",
      "Prefers stability and structure over risk and chaos",
      "Breakthroughs come from deliberate steps beyond the comfort zone",
    ],
    suitableFor:    "Strategist, planner, educator, back-end operations specialist",
    strategyAdvice: "Use your analytical depth as your edge — build thorough plans, execute systematically, and let your reliability become your reputation.",
    avoidAdvice:    "Avoid making impulsive moves out of frustration — your formation rewards patience, not reaction.",
    greenFlags: [
      "The move rewards careful planning and systematic execution over reactive speed",
      "A stable, structured environment is available — you are not being asked to build order from chaos",
      "Your reputation for reliability and detail is the edge that wins this opportunity",
    ],
    redFlags: [
      "The decision requires an immediate, gut-feel commitment without time to analyse properly",
      "The environment is chaotic and constantly shifting — no stable structure exists to operate within",
      "Success depends on high-risk speculation rather than disciplined, step-by-step execution",
    ],
    decisionRule: "Ask: can you analyse and plan this fully before committing? If yes, move — if the opportunity requires a fast, underprepared leap where speed beats thoroughness, it is not aligned with your operating style.",
  },

  hiddenJade: {
    chineseName:    "石中隐玉",
    chineseStyle:   "石中隐玉格",
    englishName:    "Hidden Jade",
    subtitle:       "Shi Zhong Yin Yu",
    playerType:     "special",
    tagline:        "Your potential is hidden beneath hardship — a rough start and a sweet ending. The challenges you face are the polishing of your greatest strengths.",
    keyTraits:      [
      "Rough start, suffer at first — but a sweet and lasting ending",
      "Sharp tongue, deep thinker — communicates with precision",
      "Hidden potential that reveals itself through pressure and hardship",
    ],
    suitableFor:    "Any path that rewards depth, communication, and late-stage success",
    strategyAdvice: "Trust the process — your results arrive later than others but they are more enduring. Do not abandon your path during the difficult early stages.",
    avoidAdvice:    "Avoid comparing your early-stage results to others in better-timed cycles — your window arrives, and it is worth waiting for.",
    greenFlags: [
      "The opportunity rewards depth of communication and the ability to uncover hidden information",
      "Late-stage returns are on offer — the compounding period is long and patient capital wins",
      "Your ability to articulate complex ideas precisely gives you a structural edge in this space",
    ],
    redFlags: [
      "Immediate results are expected and delays will be penalised — your window is very short",
      "The opportunity requires projecting image and polish before substance has been proven",
      "First impressions and surface-level presentation determine outcome before depth can be demonstrated",
    ],
    decisionRule: "Ask: will your depth, communication, and track record be visible and rewarded within the next 1–2 years? If yes, move — if the environment rewards fast optics over proven substance, wait until your window opens.",
  },

  reversedSunMoon: {
    chineseName:    "日月反背",
    chineseStyle:   "日月反背格",
    englishName:    "Reversed Sun & Moon",
    subtitle:       "Ri Yue Fan Bei",
    playerType:     "special",
    tagline:        "Your energy runs on an unconventional clock — cross-timezone, night-shift, and overseas environments are where your natural rhythms align best.",
    keyTraits:      [
      "Energy often out of sync with conventional daytime rhythms",
      "Constant rush, easily lacks inner balance without structure",
      "Naturally drawn to or involved in cross-timezone work",
    ],
    suitableFor:    "Night shifts, overseas markets, US or international client work, rotational and remote roles",
    strategyAdvice: "Lean into international, remote, or non-conventional schedules where your reversed energy rhythm becomes an advantage.",
    avoidAdvice:    "Avoid forcing yourself into rigid 9-to-5 structures — operating against your natural rhythm depletes energy and reduces output.",
    greenFlags: [
      "The opportunity is international, remote, or operates across time zones — unconventional schedules become advantages",
      "The move allows you to set your own operating hours and rhythm rather than conforming to standard structures",
      "Cross-border or cross-cultural markets are involved where your natural affinity for non-local contexts applies",
    ],
    redFlags: [
      "The role demands strict conventional hours with no flexibility for your natural reversed energy rhythm",
      "Local, domestic, and time-zone-locked operations are the core of the business model",
      "Success is measured against conventional daytime-hours benchmarks that your energy rhythm does not match",
    ],
    decisionRule: "Ask: does this opportunity accommodate non-conventional schedules and cross-timezone operations? If yes, proceed — if it locks you into rigid conventional rhythms that suppress your natural energy, renegotiate the terms or look for a different structure.",
  },

  starlessDestiny: {
    chineseName:    "命无正曜",
    chineseStyle:   "命无正曜格",
    englishName:    "Starless Destiny",
    subtitle:       "Ming Wu Zheng Yao",
    playerType:     "special",
    tagline:        "You are designed to thrive away from your roots — independence, self-reliance, and building from scratch in new environments are your greatest strengths.",
    keyTraits:      [
      "Must leave hometown to fully thrive — roots are a starting point, not a ceiling",
      "Often felt unsupported early in life — learned independence the hard way",
      "Self-made strength — built through experience, not inheritance",
    ],
    suitableFor:    "Overseas roles, freelancers, migrant entrepreneurs, digital nomads, self-made founders",
    strategyAdvice: "Embrace mobility and self-sufficiency — the further you venture from your starting point, the more your formation activates.",
    avoidAdvice:    "Avoid staying too close to home or relying on family support systems — comfort zones suppress this formation's full potential.",
    greenFlags: [
      "The opportunity is in a new market, city, or country — distance from your roots is a structural advantage",
      "Independence and self-reliance are rewarded — there is no expectation of inherited advantage or family backing",
      "The move requires building from scratch, which is exactly where this formation performs best",
    ],
    redFlags: [
      "The opportunity depends heavily on existing local relationships, family connections, or established hometown credibility",
      "The business model rewards staying in one place and deepening roots over time",
      "The role requires operating within a structured system of hierarchy and established support rather than independent resourcefulness",
    ],
    decisionRule: "Ask: does this move take you further from your comfort zone and into more independent territory? If yes, proceed — if it keeps you comfortable, close to home, or reliant on familiar support, this formation performs better when stretched further.",
  },
};
