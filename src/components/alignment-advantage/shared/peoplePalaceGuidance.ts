import type { PeoplePalaceKey } from "../../../utils/forecast/people/peoplePalaceData";
import type { CatalystKind } from "./catalystGuidance";
import type { PeoplePalaceReading } from "./helpers/peoplePalaceAnalysis";
import { buildPalaceActivationTiles } from "./helpers/peoplePalaceAnalysis";

type ActionTriple = [string, string, string];
type WatchPair = [string, string];

/** Base executive actions per relationship palace. Plain language only. */
const PEOPLE_PALACE_BASE_ACTIONS: Record<PeoplePalaceKey, ActionTriple> = {
  "兄弟": [
    "If you share a business with a peer or sibling, put in writing who does what, who owns what share, and how either of you can exit. Verbal deals between equals fall apart when real money shows up.",
    "Once a month, spend 15 minutes with any peer you share money or clients with: who brought in what, who paid for what. Do this before bad feelings build up.",
    "When you disagree with a peer, talk it through within 48 hours. Problems you avoid do not go away. They wait until the worst possible moment.",
  ],
  "夫妻": [
    "Block a fixed 30-minute slot each week with your business partner or spouse for money, decisions, and boundaries. Protect that slot before you protect anything else on your calendar.",
    "For any major financial commitment or project that ties up three months of your time, both of you must agree in writing before work starts. One person saying yes and the other staying quiet is how partnerships break.",
    "Write a one-page list of who owns what in the business, start to finish. Review it when either of you feels overworked or unappreciated.",
  ],
  "交友": [
    "Pick three people you would actually want to build something with: co-create a project, share a client relationship, or open a new market together. Reach out to each with one concrete collaboration idea, not a vague catch-up.",
    "Before you start any joint project, write one sentence on the outcome you both want and who owns what. If either person cannot say that clearly, pause. Do not begin until you can.",
    "For every active collaboration, name the other person's role and your role out loud. Shared effort without named ownership is how joint work turns into quiet resentment.",
  ],
  "父母": [
    "Pick the one mentor, board member, or senior family figure whose opinion actually changes your decisions. Book one focused conversation with them this quarter and bring a written list of what you want to discuss.",
    "Put every family loan, gift, or informal money arrangement in writing with a payback or review date. Family money without paperwork becomes family conflict later.",
    "Make one specific ask this quarter of someone above you: an introduction, a door opened, or a decision unblocked. Being respected does not help you if you never ask for anything concrete.",
  ],
  "子女": [
    "For each child, junior hire, or person you are training, set one clear goal for the next 90 days. Check progress on a fixed date, not when someone chases you.",
    "Cap how much time and money you put into any one person or project each week. Endless support without structure creates dependence, not growth.",
    "Celebrate finished results in public and be specific about what they did. Praise effort in private. People learn from what you reward, not from what you say you value.",
  ],
};

/** Base watch-outs per relationship palace. */
const PEOPLE_PALACE_BASE_WATCH: Record<PeoplePalaceKey, WatchPair> = {
  "兄弟": [
    "Paying for a peer's mistakes again and again because you do not want to seem small-minded",
    "Competing with a peer for approval instead of competing for the same business result",
  ],
  "夫妻": [
    "Agreeing in the meeting and resenting the decision later because you wanted to keep the peace",
    "Letting your partner cover a problem you know is yours because speaking up feels harder",
  ],
  "交友": [
    "Building a large circle of friendly contacts who never send you business, referrals, or real help",
    "Thinking someone is a good partner because you get along, not because you want the same outcome",
  ],
  "父母": [
    "Saying yes to a boss, mentor, or parent out of guilt when it actually hurts your business",
    "Chasing approval from someone senior when what you need is a straight no and honest feedback",
  ],
  "子女": [
    "Pouring too much time and money into people or projects you care about because saying no feels cruel",
    "Offering warmth and encouragement with no deadlines until everyone is busy and nothing gets done",
  ],
};

/** Third action override when a catalyst is active in this palace. */
const PALACE_ACTIVATION_ACTION: Record<
  PeoplePalaceKey,
  Partial<Record<CatalystKind, string>>
> = {
  "兄弟": {
    lu: "A peer is opening doors for you right now. Accept the help, but write down what you owe back before you use up the goodwill.",
    quan: "Power struggles with peers are live right now. Agree who leads each shared decision before someone else takes charge by default.",
    ke: "Your reputation with peers is visible right now. One public win with a business partner or sibling ally beats three private promises.",
    ji: "Tension with a peer is showing up. Address the specific issue in writing within 48 hours. Unspoken problems get expensive when money is involved.",
  },
  "夫妻": {
    lu: "Your partner is bringing resources your way now. Say clearly what you need from them this quarter instead of assuming they already know.",
    quan: "Who has the final say in this partnership matters right now. Confirm who decides on money, hiring, and client commitments before you act.",
    ke: "People are watching how you show up as a partner. Make sure what you say in public matches what you agreed in private.",
    ji: "Tension in a one-to-one relationship is active. Schedule a direct talk about the one issue you have been avoiding. Waiting makes it personal.",
  },
  "交友": {
    lu: "Your network is opening doors right now. Follow up on every warm introduction within 48 hours while people still remember making it.",
    quan: "You have more pull in how this collaboration runs right now. Agree who decides, who delivers, and who gets credit before the work starts.",
    ke: "People in your network are watching what you deliver, not what you promise. Finish one visible win with a partner before asking for the next favour.",
    ji: "A friendship, referral, or partnership is under strain. Clarify expectations in writing before the next ask, not after the next letdown.",
  },
  "父母": {
    lu: "Support from above is available now. Make one concrete ask of a mentor or boss and attach a clear outcome you want.",
    quan: "Bosses and mentors expect you to lead right now, not just follow. Bring a recommendation to your next senior conversation, not only questions.",
    ke: "Mentors and bosses are watching your track record right now. Send a short update on what you finished before you ask for the next introduction.",
    ji: "Tension with a boss, mentor, or family money is active. Put agreements and boundaries in writing now. Verbal deals with senior figures fail under pressure.",
  },
  "子女": {
    lu: "What you are building with your team or family is resourced right now. Invest in structure and deadlines, not more comfort, while support is available.",
    quan: "Junior staff and people you train respond to clear leadership from you right now. Set firm standards before you take on anyone else to develop.",
    ke: "People you develop are building their name through you. Link their public wins to specific standards you set, not vague encouragement.",
    ji: "Someone you are training is hitting friction. Talk about performance or scope directly while the issue is still small. Softening the message now makes the next talk harder.",
  },
};

/** First watch-out override when a catalyst is active. */
const PALACE_ACTIVATION_WATCH: Record<
  PeoplePalaceKey,
  Partial<Record<CatalystKind, string>>
> = {
  "兄弟": {
    quan: "Letting a peer run the show because speaking up feels awkward between equals",
    ji: "Assuming tension with a peer will fix itself because you used to get along",
  },
  "夫妻": {
    quan: "Going along with your partner's call because it is faster, then resenting a result you did not shape",
    ji: "Avoiding a hard conversation because the relationship feels fragile while tension is active",
  },
  "交友": {
    lu: "Saying yes to every social opening because help feels plentiful and saying no feels cheap",
    quan: "Letting the most charming person in the room set the terms while you carry the work",
    ji: "Staying in a partnership that drains you because leaving feels like burning a bridge",
  },
  "父母": {
    lu: "Taking money or favours from a boss or mentor without asking what they expect in return",
    quan: "Agreeing with a mentor to keep the peace instead of sharing your own view",
  },
  "子女": {
    quan: "Hovering over junior staff because being in charge feels productive when they need room to own the work",
    ji: "Shielding someone you train from consequences that would actually help them learn",
  },
};

/** Business read: lead star in a specific palace (plain language). */
const PALACE_STAR_CONTEXT: Partial<Record<string, string>> = {
  "交友:贪狼":
    "Your friend and partner circle runs on charm and variety. Keep the people who follow through on results, not the ones who only keep things fun.",
  "交友:廉贞":
    "Allies see you as intense and firm about your standards. They stay when the rules are clear. They drift when the relationship runs on mood instead of agreed terms.",
  "交友:紫微":
    "Your network revolves around your standards. People stay when they know their role. They leave when everything becomes a loyalty test.",
  "夫妻:天同":
    "Partners see you as steady and easy to be with. The relationship works when comfort does not replace honest talks about money and decisions.",
  "夫妻:廉贞":
    "One-to-one bonds run hot and committed with you. Agree who decides what early, or passion turns into control.",
  "兄弟:廉贞":
    "Peers see you as competitive and hard to please. Shared businesses work when roles are written down, not assumed from history.",
  "兄弟:七杀":
    "Peer relationships with you move fast and can break hard. Write down ownership and exit terms before speed creates damage you cannot undo.",
  "父母:天梁":
    "Mentors and bosses see you as someone who seeks guidance but must still deliver. They back you when you arrive with a plan, not just a request for help.",
  "父母:太阳":
    "Senior figures see you as visible and keen for recognition. They support you when you show results before you ask for backing.",
  "子女:天机":
    "People you train need clear deadlines from you, not more ideas. They grow when you stop adding options and start holding them to dates.",
  "子女:天同":
    "Those you develop feel warmth from you first. They actually grow when you hold back comfort and enforce a standard they need.",
};

const PALACE_STAR_FALLBACK: Record<PeoplePalaceKey, string> = {
  "兄弟":
    "Peers and business partners at your level experience you through {star}. Written roles matter more here than shared history or loyalty speeches.",
  "夫妻":
    "Partners experience you through {star}. One-to-one relationships work when money, decisions, and boundaries are stated clearly, not guessed.",
  "交友":
    "Friends and collaborators experience you through {star}. Your network is only as strong as the people you hold to results, not just good vibes.",
  "父母":
    "Bosses and mentors experience you through {star}. They help you when you bring finished outcomes, not just availability.",
  "子女":
    "Children, junior staff, and people you train experience you through {star}. What they become reflects the standards you enforce, not only the praise you give.",
};

const ACTIVATION_PRIORITY: CatalystKind[] = ["ji", "quan", "lu", "ke"];

function resolvePrimaryActivation(reading: PeoplePalaceReading): CatalystKind | null {
  const tiles = buildPalaceActivationTiles(reading);
  for (const kind of ACTIVATION_PRIORITY) {
    const tile = tiles.find((entry) => entry.kind === kind && entry.active);
    if (tile !== undefined) return kind;
  }
  for (const tile of tiles) {
    if (tile.active) return tile.kind;
  }
  return null;
}

/** Returns three concrete actions for this palace briefing. */
export function getPeoplePalaceActions(reading: PeoplePalaceReading): ActionTriple {
  const actions: ActionTriple = [...PEOPLE_PALACE_BASE_ACTIONS[reading.palaceKey]];
  const activation = resolvePrimaryActivation(reading);
  if (activation !== null) {
    const override = PALACE_ACTIVATION_ACTION[reading.palaceKey][activation];
    if (override !== undefined) {
      actions[2] = override;
    }
  }
  return actions;
}

/** Returns two watch-outs for this palace briefing. */
export function getPeoplePalaceWatchOuts(reading: PeoplePalaceReading): WatchPair {
  const watch: WatchPair = [...PEOPLE_PALACE_BASE_WATCH[reading.palaceKey]];
  const activation = resolvePrimaryActivation(reading);
  if (activation !== null) {
    const override = PALACE_ACTIVATION_WATCH[reading.palaceKey][activation];
    if (override !== undefined) {
      watch[0] = override;
    }
  }
  return watch;
}

/** One-line business read for stars in this palace. */
export function getPeoplePalaceStarContext(reading: PeoplePalaceReading): string {
  const lead = reading.mainStars[0];
  if (lead === undefined) {
    return reading.framing.emptyPalaceGuidance;
  }

  const keyed = PALACE_STAR_CONTEXT[`${reading.palaceKey}:${lead.starName}`];
  if (keyed !== undefined) {
    return keyed;
  }

  const template = PALACE_STAR_FALLBACK[reading.palaceKey];
  return template.replace("{star}", lead.pinyin);
}

/** Short label for active activation tile (shown under activations row). */
export function getPalaceActivationHint(reading: PeoplePalaceReading): string | null {
  const activation = resolvePrimaryActivation(reading);
  if (activation === null) return null;

  const hints: Record<CatalystKind, string> = {
    lu: "Support and opportunities are flowing through this relationship right now. Put the terms in writing.",
    quan: "You have more say in this area right now. Agree who decides what before someone else assumes it.",
    ke: "Your reputation in this area is on display. Show results before you ask for more.",
    ji: "Tension is building here. Talk about it directly while friction is still manageable.",
  };

  return hints[activation];
}
