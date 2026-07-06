/**
 * Structure Content Data: Formation Profiles and Structure Labels
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
} from "../../zwds/analysis/structureAnalysis";

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
  /** What this formation should lean into: strategic strength to amplify. */
  strategyAdvice: string;
  /** What drains this formation: the misalignment to avoid. */
  avoidAdvice: string;
  /**
   * Three conditions that indicate a decision is well-aligned with this
   * formation: "green flag" signals to proceed.
   */
  greenFlags: [string, string, string];
  /**
   * Three conditions that indicate a decision is misaligned with this
   * formation: "red flag" signals to reconsider or walk away.
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
    description: "Wired for rapid acceleration, fast wins, and high-intensity moves. Your edge is momentum: the faster you move, the stronger your results.",
    icon:        "⚡",
    gradient:    "from-orange-500 to-red-600",
  },
  endurance: {
    label:       "Endurance Player",
    description: "Wired for steady compounding, long-term consistency, and deep mastery. Your edge is resilience: the longer you commit, the stronger your results.",
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
    tagline:        "You are built for disruption and bold moves. Feeling restless isn't a flaw—it's your signal to take action.",
    keyTraits:      [
      "Bold and action-driven: you act first and fix things later",
      "Thrives on breaking old rules and building something new",
      "High-risk, high-reward: you win big or learn big",
    ],
    suitableFor:    "Founders, sales leaders, crisis managers, and fast-moving tech ventures",
    strategyAdvice: "Move fast, take risks, and be the first to act. Launch before you feel ready.",
    avoidAdvice:    "Avoid slow, boring jobs. Waiting around for things to happen will kill your momentum.",
    greenFlags: [
      "The opportunity requires fast, decisive action right now",
      "You can be the first one to do this. Speed is all that matters",
      "You get to tear down something old and build something better",
    ],
    redFlags: [
      "The job requires slow, boring, day-to-day progress with no big wins",
      "Your success depends entirely on keeping one person happy for years",
      "You are punished for changing your mind or trying new things",
    ],
    decisionRule: "Ask yourself: is there a huge win possible in the next 12 months? If yes, do it. If it takes 5 years to see any results, walk away.",
  },

  bigLandlord: {
    chineseName:    "日月照壁",
    chineseStyle:   "日月照壁格",
    englishName:    "Big Landlord",
    subtitle:       "Empire Builder",
    playerType:     "speed",
    tagline:        "You are built to own things. You shouldn't just have one job or one business—you need a portfolio of assets.",
    keyTraits:      [
      "Strong luck with real estate and physical assets",
      "Solid backing: you rarely run out of resources",
      "High chance to inherit or accumulate property",
    ],
    suitableFor:    "Real estate investors, portfolio managers, and multi-business owners",
    strategyAdvice: "Buy assets and run multiple projects at once. You win by owning more things, not by working harder on just one.",
    avoidAdvice:    "Don't put all your eggs in one basket. Forcing yourself to focus on just one thing will hold you back.",
    greenFlags: [
      "You get to own a real asset: property, equity, or a piece of a business",
      "You can run this project at the same time as your other projects",
      "You get to combine multiple small things into one big empire",
    ],
    redFlags: [
      "You have to quit everything else just to focus on this one thing",
      "You only make money if you do the exact same task for years",
      "You have to sell or give up control of something you already own",
    ],
    decisionRule: "Ask yourself: does this give me ownership of a new asset? If yes, do it. If it just gives me a salary and no ownership, walk away.",
  },

  riskyTrading: {
    chineseName:    "机动格",
    chineseStyle:   "机动进取格",
    englishName:    "Risky Trading",
    subtitle:       "Strategic Gambler",
    playerType:     "speed",
    tagline:        "You win by making smart bets and timing the market. You are a deal-maker who thrives on action.",
    keyTraits:      [
      "Wins through calculated bets and precise timing",
      "Thrives on active transactions and fast deal flow",
      "Opportunistic: you make fast decisions and execute immediately",
    ],
    suitableFor:    "Active traders, deal-makers, high-volume sales, and transactional businesses",
    strategyAdvice: "Keep moving. Make lots of deals, act fast, and don't get emotionally attached to any single project.",
    avoidAdvice:    "Don't just buy and hold. Sitting still and waiting for things to grow will drive you crazy.",
    greenFlags: [
      "You can make a lot of small bets or deals quickly",
      "Timing is everything. Being fast is more important than being perfect",
      "The market is chaotic, which means there is money to be made",
    ],
    redFlags: [
      "Your money or time is locked up for years with no way out",
      "You just have to sit and wait for years to see a return",
      "It's an all-or-nothing gamble with no way to hedge your bets",
    ],
    decisionRule: "Ask yourself: can I make a lot of fast trades or deals here? If yes, do it. If my money is stuck for 5 years, walk away.",
  },

  // ── Endurance Player Formations ───────────────────────────────────────────

  tripletalent: {
    chineseName:    "三奇嘉会",
    chineseStyle:   "三奇嘉会格",
    englishName:    "Triple Talent",
    subtitle:       "Sustainable Excellence",
    playerType:     "endurance",
    tagline:        "You are built for mastery. Your biggest advantage is becoming the absolute best at one specific thing.",
    keyTraits:      [
      "Outstanding intelligence and analytical capability",
      "Strong achievement potential: you will reach the top of your field",
      "Academic and professional excellence: you win by going deepest",
    ],
    suitableFor:    "Scholars, elite professionals, expert consultants, and high-level educators",
    strategyAdvice: "Go deep, not wide. Pick one lane and stay in it. The longer you do it, the more you will get paid.",
    avoidAdvice:    "Don't try to be good at everything. Chasing ten different side hustles will ruin your focus.",
    greenFlags: [
      "The job makes you an even bigger expert in your specific field",
      "You get paid more the longer you stay committed to it",
      "You are learning skills that are very hard for other people to copy",
    ],
    redFlags: [
      "You have to constantly switch between completely different tasks",
      "The boss only cares about how fast you work, not how good the work is",
      "The market only rewards the first person to launch, even if the product is garbage",
    ],
    decisionRule: "Ask yourself: will this make me the top expert in my field in 5 years? If yes, do it. If it's just a quick cash grab, walk away.",
  },

  nobleSupport: {
    chineseName:    "辅弼拱主",
    chineseStyle:   "辅弼拱主格",
    englishName:    "Noble Support",
    subtitle:       "Relationship Leverage",
    playerType:     "endurance",
    tagline:        "You win through your network. The right mentors, backers, and partners will always show up when you need them.",
    keyTraits:      [
      "Well-supported: helpful people appear exactly when you need them",
      "Noble aura: you are respected and trusted easily",
      "Things flow smoothly when you build the right inner circle",
    ],
    suitableFor:    "Partnership-driven businesses, network-reliant roles, and anyone building through referrals",
    strategyAdvice: "Invest in your relationships. Find mentors, build alliances, and let your network make you money.",
    avoidAdvice:    "Don't try to do everything yourself. Working completely alone is the worst thing you can do.",
    greenFlags: [
      "You already have a mentor or backer ready to support you in this",
      "You already know people in this industry who can open doors for you",
      "This move puts you in a room with highly connected, powerful people",
    ],
    redFlags: [
      "You are walking into a brand new industry where you know absolutely nobody",
      "You have to work completely alone with zero help from a team",
      "You have to beat people based purely on solo technical skills",
    ],
    decisionRule: "Ask yourself: do I have at least one powerful person backing me on this? If yes, do it. If I am completely alone, find a partner first.",
  },

  wealthSupport: {
    chineseName:    "府相朝垣",
    chineseStyle:   "府相朝垣格",
    englishName:    "Wealth Support",
    subtitle:       "Fortress Builder",
    playerType:     "endurance",
    tagline:        "You are built for stability. You naturally attract resources and don't need to hustle 24/7 to make money.",
    keyTraits:      [
      "Stable fortune: you rarely lack resources or backing",
      "Natural support system: benefactors appear in your life",
      "You can be provided for even without constant active hustle",
    ],
    suitableFor:    "Anyone prioritizing long-term security, and those who attract sponsors and silent backers",
    strategyAdvice: "Protect what you have. Optimize your current income instead of constantly starting new projects.",
    avoidAdvice:    "Don't make wild bets. Risking everything on a crazy new idea will backfire on you.",
    greenFlags: [
      "This move protects the money and assets you already have",
      "You have silent partners or backers who are ready to fund this",
      "It's a low-risk, long-term play that guarantees stability",
    ],
    redFlags: [
      "You have to sell your stable assets to fund a risky gamble",
      "You have to aggressively expand into a market you know nothing about",
      "It's a highly volatile market where you could lose everything overnight",
    ],
    decisionRule: "Ask yourself: does this make my life more stable? If yes, do it. If it introduces unnecessary chaos, walk away.",
  },

  wealthStabilization: {
    chineseName:    "稳固格",
    chineseStyle:   "稳固积累格",
    englishName:    "Wealth Stabilization",
    subtitle:       "Steady Accumulator",
    playerType:     "endurance",
    tagline:        "You win by being consistent. Small, boring, daily improvements will make you incredibly wealthy over time.",
    keyTraits:      [
      "Wins through preservation and optimization, not bold bets",
      "Steady beats flashy: consistency is your competitive advantage",
      "Incremental improvements compound powerfully over decades",
    ],
    suitableFor:    "Long-term investors, operations builders, system optimizers, and steady-growth businesses",
    strategyAdvice: "Focus on efficiency. Cut costs, improve your systems, and let time do the heavy lifting.",
    avoidAdvice:    "Stop trying to copy fast-moving entrepreneurs. Trying to pivot every week will just burn you out.",
    greenFlags: [
      "This move makes your current business or job much more efficient",
      "The money grows slowly but surely, and patience is rewarded",
      "There is very little risk of losing money, and you can track your progress easily",
    ],
    redFlags: [
      "You are forced to expand rapidly before your systems are ready",
      "The potential payout is huge, but you might lose everything",
      "You have to throw away a system that works to try something completely untested",
    ],
    decisionRule: "Ask yourself: can I grow this slowly and safely over the next 2 years? If yes, do it. If it's an all-or-nothing gamble, walk away.",
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
    strategyAdvice: "Use your analytical depth as your edge: build thorough plans, execute systematically, and let your reliability become your reputation.",
    avoidAdvice:    "Avoid making impulsive moves out of frustration: your formation rewards patience, not reaction.",
    greenFlags: [
      "The move rewards careful planning and systematic execution over reactive speed",
      "A stable, structured environment is available: you are not being asked to build order from chaos",
      "Your reputation for reliability and detail is the edge that wins this opportunity",
    ],
    redFlags: [
      "The decision requires an immediate, gut-feel commitment without time to analyse properly",
      "The environment is chaotic and constantly shifting: no stable structure exists to operate within",
      "Success depends on high-risk speculation rather than disciplined, step-by-step execution",
    ],
    decisionRule: "Ask: can you analyse and plan this fully before committing? If yes, move. If the opportunity requires a fast, underprepared leap where speed beats thoroughness, it is not aligned with your operating style.",
  },

  hiddenJade: {
    chineseName:    "石中隐玉",
    chineseStyle:   "石中隐玉格",
    englishName:    "Hidden Jade",
    subtitle:       "Shi Zhong Yin Yu",
    playerType:     "special",
    tagline:        "Your potential is hidden beneath hardship: a rough start and a sweet ending. The challenges you face are the polishing of your greatest strengths.",
    keyTraits:      [
      "Rough start, suffer at first: but a sweet and lasting ending",
      "Sharp tongue, deep thinker: communicates with precision",
      "Hidden potential that reveals itself through pressure and hardship",
    ],
    suitableFor:    "Any path that rewards depth, communication, and late-stage success",
    strategyAdvice: "Trust the process: your results arrive later than others but they are more enduring. Do not abandon your path during the difficult early stages.",
    avoidAdvice:    "Avoid comparing your early-stage results to others in better-timed cycles: your window arrives, and it is worth waiting for.",
    greenFlags: [
      "The opportunity rewards depth of communication and the ability to uncover hidden information",
      "Late-stage returns are on offer: the compounding period is long and patient capital wins",
      "Your ability to articulate complex ideas precisely gives you a structural edge in this space",
    ],
    redFlags: [
      "Immediate results are expected and delays will be penalised: your window is very short",
      "The opportunity requires projecting image and polish before substance has been proven",
      "First impressions and surface-level presentation determine outcome before depth can be demonstrated",
    ],
    decisionRule: "Ask: will your depth, communication, and track record be visible and rewarded within the next 1–2 years? If yes, move. If the environment rewards fast optics over proven substance, wait until your window opens.",
  },

  reversedSunMoon: {
    chineseName:    "日月反背",
    chineseStyle:   "日月反背格",
    englishName:    "Reversed Sun & Moon",
    subtitle:       "Ri Yue Fan Bei",
    playerType:     "special",
    tagline:        "Your productivity runs on an unconventional clock: cross-timezone, night-shift, and overseas environments are where your natural rhythms align best.",
    keyTraits:      [
      "Energy often out of sync with conventional daytime rhythms",
      "Constant rush, easily lacks inner balance without structure",
      "Naturally drawn to or involved in cross-timezone work",
    ],
    suitableFor:    "Night shifts, overseas markets, US or international client work, rotational and remote roles",
    strategyAdvice: "Lean into international, remote, or non-conventional schedules where your reversed operating rhythm becomes an advantage.",
    avoidAdvice:    "Avoid forcing yourself into rigid 9-to-5 structures: operating against your natural rhythm depletes capacity and reduces output.",
    greenFlags: [
      "The opportunity is international, remote, or operates across time zones: unconventional schedules become advantages",
      "The move allows you to set your own operating hours and rhythm rather than conforming to standard structures",
      "Cross-border or cross-cultural markets are involved where your natural affinity for non-local contexts applies",
    ],
    redFlags: [
      "The role demands strict conventional hours with no flexibility for your natural reversed operating rhythm",
      "Local, domestic, and time-zone-locked operations are the core of the business model",
      "Success is measured against conventional daytime-hours benchmarks that your energy rhythm does not match",
    ],
    decisionRule: "Ask: does this opportunity accommodate non-conventional schedules and cross-timezone operations? If yes, proceed. If it locks you into rigid conventional rhythms that suppress your natural capacity, renegotiate the terms or look for a different structure.",
  },

  starlessDestiny: {
    chineseName:    "命无正曜",
    chineseStyle:   "命无正曜格",
    englishName:    "Starless Destiny",
    subtitle:       "Ming Wu Zheng Yao",
    playerType:     "special",
    tagline:        "You are designed to thrive away from your roots: independence, self-reliance, and building from scratch in new environments are your greatest strengths.",
    keyTraits:      [
      "Must leave hometown to fully thrive: roots are a starting point, not a ceiling",
      "Often felt unsupported early in life: learned independence the hard way",
      "Self-made strength: built through experience, not inheritance",
    ],
    suitableFor:    "Overseas roles, freelancers, migrant entrepreneurs, digital nomads, self-made founders",
    strategyAdvice: "Embrace mobility and self-sufficiency: the further you venture from your starting point, the more your formation activates.",
    avoidAdvice:    "Avoid staying too close to home or relying on family support systems: comfort zones suppress this formation's full potential.",
    greenFlags: [
      "The opportunity is in a new market, city, or country: distance from your roots is a structural advantage",
      "Independence and self-reliance are rewarded: there is no expectation of inherited advantage or family backing",
      "The move requires building from scratch, which is exactly where this formation performs best",
    ],
    redFlags: [
      "The opportunity depends heavily on existing local relationships, family connections, or established hometown credibility",
      "The business model rewards staying in one place and deepening roots over time",
      "The role requires operating within a structured system of hierarchy and established support rather than independent resourcefulness",
    ],
    decisionRule: "Ask: does this move take you further from your comfort zone and into more independent territory? If yes, proceed. If it keeps you comfortable, close to home, or reliant on familiar support, this formation performs better when stretched further.",
  },
};
