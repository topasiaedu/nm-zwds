import type { PhaseAlignmentSeasonKey } from "../../../utils/forecast/wealth/index";
import type { WealthCodeKey } from "../../../utils/zwds/analysis_constants/wealth_code_mapping";

type PhaseWealthActionMap = Record<
  PhaseAlignmentSeasonKey,
  Record<WealthCodeKey, [string, string, string]>
>;

/** Concrete, phase-consistent actions for each phase x wealth archetype combination. */
const PHASE_WEALTH_ACTIONS: PhaseWealthActionMap = {

  expansion: {
    investmentBrain: [
      "Pick one high-conviction bet this quarter and put real capital behind it. Small positions spread across many ideas produce average returns.",
      "Write down your entry price and exit rule before you deploy. Decide both before emotions are involved, not after.",
      "Exit your two smallest positions that are not producing. The freed capital belongs in your best idea, not scattered.",
    ],
    brandingMagnet: [
      "Pick one offer and set a public launch date within 60 days. Tell your audience now. Commitment creates urgency.",
      "Build one clear path to purchase: one landing page, one call-to-action, one way to pay. Do not launch more until this one converts.",
      "Show up publicly at least twice a week this quarter. The market rewards visible momentum, not a quiet rebrand.",
    ],
    strategyPlanner: [
      "Take the plan sitting in your notes and give it a hard launch date within 90 days. A plan with no date is an intention.",
      "Assign one named person to own the top priority. If everyone is responsible, nobody is.",
      "Ship a working version before you feel ready. Real feedback from the market in week six beats a polished plan in month six.",
    ],
    collaborator: [
      "Write down two people who can open a door you cannot open alone. Message both of them this week, not when the timing feels perfect.",
      "Propose one joint offer with one partner. Write the terms clearly: who brings what, who earns what, and for how long.",
      "Reply to every warm introduction within 24 hours. Interest fades fast and a slow response signals low priority.",
    ],
  },

  visibility: {
    investmentBrain: [
      "Take partial profits on your top performer this quarter before the cycle turns. Harvest before you compound.",
      "Rank every position by actual return, not potential. Cut the bottom performer and move that capital into what is working.",
      "Do not open new speculative positions right now. Scaling what already works beats hunting for something new.",
    ],
    brandingMagnet: [
      "Raise your prices on the next sale. This is the season the market pays full price. Discounting right now leaves money on the table.",
      "Contact the people already watching you directly. Email, call, or message. Convert warm attention before you chase cold audiences.",
      "Stop creating new content angles until your current offer is selling consistently. More content does not fix a weak conversion.",
    ],
    strategyPlanner: [
      "Find the one skill or service generating your highest return right now and double down on it before this window closes.",
      "Write two or three professional wins as short case studies this quarter. You will need this proof when the next expansion push starts.",
      "Finish improving one core delivery process before approving anything new. Scaling a broken process multiplies the problem.",
    ],
    collaborator: [
      "Call your top three referral partners this month, not to ask for anything, just to offer value and stay top of mind.",
      "Put revenue-sharing terms in writing with any active partner. Trust is high right now and verbal agreements become disputes later.",
      "Ask your best partner directly: who else should you be talking to? One warm introduction from them is worth ten cold outreaches.",
    ],
  },

  consolidation: {
    investmentBrain: [
      "Pull your portfolio and ask one question about each position: would you enter this again today at this size? Exit the ones where the answer is no.",
      "Sit on cash if nothing meets your criteria this quarter. Deploying into a weak thesis because idle cash feels uncomfortable is how losses happen.",
      "Do not open new speculative positions during consolidation. The phase rewards patience, not trading frequency.",
    ],
    brandingMagnet: [
      "List every marketing channel or networking effort you are active on and cut any that has not produced a real result in the last 90 days. Focused effort beats scattered presence.",
      "Fix one problem in your delivery or professional reputation that you have been deferring. A reputation breaks faster in a quiet market than a busy one.",
      "Say no to any visibility opportunity that does not lead directly to your goals. Exposure without a clear outcome is just noise right now.",
    ],
    strategyPlanner: [
      "Look at your last three months of income or projects. Find the two where you are working the hardest for the lowest return and fix the terms or step away before next quarter.",
      "Identify the one task that completely falls apart unless you personally oversee it. Build a system so someone else can do it, or kill the task entirely. Stop being the bottleneck.",
      "Stop assuming your team or partners are aligned. Ask them point-blank what is slowing them down or wasting money right now. If they don't have an answer, they aren't paying attention.",
    ],
    collaborator: [
      "Review every active partnership and ask one honest question about each: is this producing results, or just comfortable to maintain? Exit the ones that drain time without return.",
      "Do not sign any new long-term deals this quarter. Clarify and strengthen the agreements you already have.",
      "Ask each key ally what they need from you right now. Relationships maintained during quiet seasons are the ones that deliver in busy ones.",
    ],
  },

  foundation: {
    investmentBrain: [
      "Build a watchlist of three to five specific deals you want to execute when the next expansion cycle opens. Research while prices are lower.",
      "Move excess capital into liquid reserves. Dry powder that is ready to deploy is not idle, it is loaded.",
      "Spend one focused hour each week going deep on one market or sector. Conviction that pays off in growth season is built in quiet season.",
    ],
    brandingMagnet: [
      "Write ten pieces of content now that you will publish when visibility season returns. Build the stockpile while the pressure is off.",
      "Write one sentence describing who you help and what result they get. If it takes more than one sentence, your positioning is not sharp enough yet.",
      "Send one useful message to your existing audience this month with no sales pitch attached. Relationships cool in quiet seasons if you go dark.",
    ],
    strategyPlanner: [
      "Document the three core processes your daily work runs on. If they exist only in your head, you have a single point of failure waiting to surface.",
      "Write a 12-month plan and attach a committed start date to each initiative. A plan with no dates attached is a wish list.",
      "Identify the one pricing, hiring, or delivery gap that will slow you down when the next busy season arrives. Fix it now while you have the capacity.",
    ],
    collaborator: [
      "Choose two relationships that will matter when you expand again and schedule a regular touchpoint now, not when you need something from them.",
      "List three people you want to partner with next cycle and start warming those conversations this month with no agenda yet.",
      "Reach out to three dormant contacts with nothing to ask. Relationships that only activate when you need them are transactional, not strategic.",
    ],
  },
};

const PHASE_FALLBACK_ACTIONS: Record<PhaseAlignmentSeasonKey, [string, string, string]> = {
  expansion: [
    "Pick one growth initiative with a hard deadline within 90 days and name one person responsible for it.",
    "Put real time or budget behind the top priority. Partial effort spread across many things produces average results on everything.",
    "Check weekly whether momentum is building. If it is not moving after four weeks, change the approach, not the deadline.",
  ],
  visibility: [
    "Monetise what is already working before you build anything new.",
    "Raise prices or tighten offer scope where you are undercharging for the value you deliver.",
    "Collect written proof from happy clients or colleagues this quarter. You will need it when the next expansion push starts.",
  ],
  consolidation: [
    "Look at your top three income sources or projects and find the one where you are working the hardest for the lowest return. Fix the terms or scope before you add anything new.",
    "Stop starting new things just because you are bored. Force yourself to fix the broken operations in your current projects before you launch anything else.",
    "Stop ignoring the friction in your team or partnerships. Force the uncomfortable conversation today about who is dropping the ball, and set a hard deadline to fix it.",
  ],
  foundation: [
    "Document the two or three core processes your work depends on. If they only exist in someone's head, that is a risk.",
    "Fix one structural weakness that would slow you down in a busier season.",
    "Protect cash and capacity so you can move decisively when the cycle shifts.",
  ],
};

/** Returns three concrete actions for the current phase and wealth archetype. */
export function getPhaseWealthActions(
  phaseKey: PhaseAlignmentSeasonKey,
  wealthKey: WealthCodeKey | undefined,
): [string, string, string] {
  if (wealthKey !== undefined) {
    const specific = PHASE_WEALTH_ACTIONS[phaseKey][wealthKey];
    if (specific !== undefined) return specific;
  }
  return PHASE_FALLBACK_ACTIONS[phaseKey];
}
