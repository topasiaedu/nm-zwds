/**
 * People Palace Data: Alignment Advantage Report
 *
 * Framing and playbook copy for the five relationship palaces in Chapter 03.
 */

/** Keys for the five relationship palaces covered in Chapter 03. */
export type PeoplePalaceKey = "兄弟" | "夫妻" | "交友" | "父母" | "子女";

/** Display order for the people-palace chapter. */
export const PEOPLE_PALACE_ORDER: PeoplePalaceKey[] = [
  "兄弟",
  "夫妻",
  "交友",
  "父母",
  "子女",
];

/** Short pill labels for the palace selector grid. */
export const PEOPLE_PALACE_SHORT_LABELS: Record<PeoplePalaceKey, string> = {
  "兄弟": "Siblings",
  "夫妻": "Spouse",
  "交友": "Friends",
  "父母": "Parents",
  "子女": "Children",
};

/** Chapter opener: strategic framing for business owners. */
export const PEOPLE_STACK_INTRO =
  "In business, you operate through five relationship layers: peers, partner, allies, sponsors, and successors. " +
  "This chapter maps how your chart wires each layer, where to invest attention, and what to watch this cycle.";

/** Explains how priority scores should be read (not pass/fail). */
export const PEOPLE_PRIORITY_SCORE_INTRO =
  "Scores rank your five relationship domains on a 60 to 100 scale. They are relative, not a pass or fail grade. " +
  "Every palace stays active in your life. A lower score simply shows where focused effort will compound fastest.";

/** Rank-based focus labels (growth-oriented, not punitive). */
export const PEOPLE_FOCUS_BY_RANK: Record<number, string> = {
  1: "Lead focus",
  2: "Strong channel",
  3: "Steady base",
  4: "Growth opportunity",
  5: "Build next",
};

export interface PeoplePalaceFraming {
  displayLabel: string;
  sectionTitle: string;
  intro: string;
  starBlockLabel: string;
  strategicAngle: string;
  /** Actionable guidance when no main star sits here (no chart-reading copy). */
  emptyPalaceGuidance: string;
  whatStarsMean: string;
  /** One-line takeaway for the scannable result panel. */
  bottomLine: string;
  /** Plain-English business scope for this palace. */
  strategicRole: string;
}

/** Playbook fields mirroring the Ch 04 monthly briefing structure. */
export interface PeoplePalacePlaybook {
  keyActions: [string, string, string];
  watchOut: [string, string];
  successMetrics: [string, string];
  reflectionQuestions: [string, string];
}

export const PEOPLE_PALACE_FRAMING: Record<PeoplePalaceKey, PeoplePalaceFraming> = {
  "兄弟": {
    displayLabel: "Siblings Palace",
    sectionTitle: "Siblings Palace",
    intro: "Peers, colleagues, and collaborators at your level.",
    starBlockLabel: "Your peer dynamic is shaped by",
    strategicRole: "Colleagues, collaborators, and peers who operate at your level.",
    strategicAngle: "Peers amplify your leverage when roles are clear. Seek collaborators who match your pace.",
    emptyPalaceGuidance:
      "Collaborative partnerships stay unclear until you design them. Write down who owns what and how credit is shared before loyalty becomes a liability.",
    whatStarsMean: "Who shows up as your equals: competitive, collaborative, or quietly supportive.",
    bottomLine: "Clear roles with peers turn rivalry into shared leverage.",
  },
  "夫妻": {
    displayLabel: "Spouse Palace",
    sectionTitle: "Spouse Palace",
    intro: "Spouse, primary partner, and one-to-one strategic bonds.",
    starBlockLabel: "Your partnership dynamic is shaped by",
    strategicRole: "Spouse, primary partner, and one-to-one decision partners.",
    strategicAngle: "Partner with what this domain asks for. Do not outsource your strategic gaps.",
    emptyPalaceGuidance:
      "One-to-one relationships run on how you handle risk and accountability. Agree who decides what each week and protect your bandwidth.",
    whatStarsMean: "Who you draw in, how you negotiate closeness, and what you need from a partner.",
    bottomLine: "The right partner amplifies your leverage, not your blind spots.",
  },
  "交友": {
    displayLabel: "Friends Palace",
    sectionTitle: "Friends Palace",
    intro: "Network, alliances, and your wider professional orbit.",
    starBlockLabel: "Your social orbit is shaped by",
    strategicRole: "Referral nodes, professional allies, and your broader network.",
    strategicAngle: "Your network reflects your positioning. Invest attention and time where it compounds.",
    emptyPalaceGuidance:
      "Your professional circle works best when you go deep with fewer nodes. Limit introductions, tie favors to measurable results, and let execution define your name.",
    whatStarsMean: "The friends and collaborators who enter your circle and how they experience you.",
    bottomLine: "Your network quality tracks how consistently you deliver on commitments.",
  },
  "父母": {
    displayLabel: "Parents Palace",
    sectionTitle: "Parents Palace",
    intro: "Mentors, sponsors, senior leaders, and upstream authority.",
    starBlockLabel: "Your authority relationships are shaped by",
    strategicRole: "Mentors, sponsors, and people who control access to opportunities above you.",
    strategicAngle: "The right sponsor accelerates your timeline. Know who backs you and how you leverage senior figures.",
    emptyPalaceGuidance:
      "Relationships with upstream authority work best when you do not depend on a single node. Diversify your sponsors and keep boundaries absolute.",
    whatStarsMean: "How you relate to bosses, mentors, parents, and other senior figures.",
    bottomLine: "Choose mentors and sponsors who raise your ceiling, not your comfort zone.",
  },
  "子女": {
    displayLabel: "Children Palace",
    sectionTitle: "Children Palace",
    intro: "Children, junior talent, and long-term projects you are building.",
    starBlockLabel: "Your nurturing style is shaped by",
    strategicRole: "Your children, junior team members, and long-term initiatives.",
    strategicAngle: "What you invest in scales in this pattern. Structure beats endless indulgence.",
    emptyPalaceGuidance:
      "What you build with junior talent responds to deadlines as much as resources. Limit runway, track milestones clearly, and reward finished execution over effort.",
    whatStarsMean: "How you teach, protect, and help people or projects reach maturity.",
    bottomLine: "What you build needs structure as much as resources.",
  },
};

export const PEOPLE_PALACE_PLAYBOOK: Record<PeoplePalaceKey, PeoplePalacePlaybook> = {
  "兄弟": {
    keyActions: [
      "If you share a business with a peer or sibling, put in writing who does what, who owns what share, and how either of you can exit. Verbal deals between equals fall apart when real money shows up.",
      "Once a month, spend 15 minutes with any peer you share money or clients with: who brought in what, who paid for what. Do this before bad feelings build up.",
      "When you disagree with a peer, talk it through within 48 hours. Problems you avoid do not go away. They wait until the worst possible moment.",
    ],
    watchOut: [
      "Paying for a peer's mistakes again and again because you do not want to seem small-minded",
      "Competing with a peer for approval instead of competing for the same business result",
    ],
    successMetrics: [
      "Said no to a coworker asking you to do their job",
      "Addressed one major source of tension with a peer",
    ],
    reflectionQuestions: [
      "Which of my peers actually makes me better at my job?",
      "Am I treating this person as a teammate or a competitor?",
    ],
  },
  "夫妻": {
    keyActions: [
      "Block a fixed 30-minute slot each week with your business partner or spouse for money, decisions, and boundaries. Protect that slot before you protect anything else on your calendar.",
      "For any commitment over $10k or three months of your time, both of you must agree in writing before work starts. One person saying yes and the other staying quiet is how partnerships break.",
      "Tension in a one-to-one relationship is active. Schedule a direct talk about the one issue you have been avoiding. Waiting makes it personal.",
    ],
    watchOut: [
      "Avoiding a hard conversation because the relationship feels fragile this week",
      "Letting your partner cover a problem you know is yours because speaking up feels harder",
    ],
    successMetrics: [
      "Had a clear, honest conversation about money and goals",
      "Set a clear rule for how you make big decisions together",
    ],
    reflectionQuestions: [
      "Is my partner helping me grow, or holding me back?",
      "What hard conversation am I avoiding right now?",
    ],
  },
  "交友": {
    keyActions: [
      "List ten people who could realistically send you a paying client this year. Message the top three this month with a clear ask, not a vague catch-up.",
      "Before you say yes to an introduction, referral, or joint project, ask: what do they bring that I cannot get on my own, and what am I giving up? If you cannot answer the second part, wait 72 hours.",
      "You are influencing how your friend and partner circle runs right now. Set terms on any joint effort before charm pushes past what you actually want.",
    ],
    watchOut: [
      "Letting the most charming person in the room set the terms while you carry the work",
      "Thinking someone is a good partner because you get along, not because you want the same outcome",
    ],
    successMetrics: [
      "Asked for and received a direct referral or introduction",
      "Cut out one networking commitment that was wasting your time",
    ],
    reflectionQuestions: [
      "Who in my network can actually help me get to the next level?",
      "Which friendships have expired and need to be let go?",
    ],
  },
  "父母": {
    keyActions: [
      "Pick the one mentor, board member, or senior family figure whose opinion actually changes your decisions. Book one focused conversation with them this quarter and bring a written list of what you want to discuss.",
      "Put every family loan, gift, or informal money arrangement in writing with a payback or review date. Family money without paperwork becomes family conflict later.",
      "Make one specific ask this quarter of someone above you: an introduction, a door opened, or a decision unblocked. Being respected does not help you if you never ask for anything concrete.",
    ],
    watchOut: [
      "Saying yes to a boss, mentor, or parent out of guilt when it actually hurts your business",
      "Chasing approval from someone senior when what you need is a straight no and honest feedback",
    ],
    successMetrics: [
      "Asked a boss or mentor a highly specific, strategic question",
      "Set a clear boundary regarding family financial support",
    ],
    reflectionQuestions: [
      "Am I too afraid of my boss to do my best work?",
      "What would change if I treated my mentors like peers instead of teachers?",
    ],
  },
  "子女": {
    keyActions: [
      "For each child, junior hire, or person you are training, set one clear goal for the next 90 days. Check progress on a fixed date, not when someone chases you.",
      "Cap how much time and money you put into any one person or project each week. Endless support without structure creates dependence, not growth.",
      "Celebrate finished results in public and be specific about what they did. Praise effort in private. People learn from what you reward, not from what you say you value.",
    ],
    watchOut: [
      "Pouring too much time and money into people or projects you care about because saying no feels cruel",
      "Offering warmth and encouragement with no deadlines until everyone is busy and nothing gets done",
    ],
    successMetrics: [
      "Set a strict deadline for a junior team member and held them to it",
      "Stopped funding or spending time on a failing project",
    ],
    reflectionQuestions: [
      "Am I helping my team grow, or just doing their work for them?",
      "What failing project or bad employee do I need to cut loose?",
    ],
  },
};

export interface LuActivationSummary {
  headline: string;
  meaning: string;
  practicalTip: string;
}

export const LU_ACTIVATION_BY_PALACE: Record<PeoplePalaceKey, LuActivationSummary> = {
  "兄弟": {
    headline: "Strongest leverage node: Peers & Co-investors",
    meaning: "Your chart routes the highest-yield opportunities and operational support through peer networks and co-founders.",
    practicalTip: "Formalize equity and capital contributions early to protect the relationship.",
  },
  "夫妻": {
    headline: "Strongest leverage node: Primary Partner",
    meaning: "Your chart routes the most natural strategic leverage and stability through your spouse or primary co-founder.",
    practicalTip: "Establish a 'two-yes' rule for any major capital deployment.",
  },
  "交友": {
    headline: "Strongest leverage node: Professional Network",
    meaning: "Your chart routes the most lucrative deal flow, referrals, and joint ventures through your wider professional orbit.",
    practicalTip: "Cap low-ROI social commitments to protect your networking capital.",
  },
  "父母": {
    headline: "Strongest leverage node: Sponsors & Board",
    meaning: "Your chart routes the most direct access to capital and high-level approval through mentors and sponsors.",
    practicalTip: "Bring structured solutions to your mentors, not just updates.",
  },
  "子女": {
    headline: "Strongest leverage node: Junior Talent & Assets",
    meaning: "Your chart routes the highest long-term ROI through the junior talent you develop and the scalable assets you build.",
    practicalTip: "Set strict, 90-day measurable KPIs for any project you fund.",
  },
};

export const PEOPLE_SYNTHESIS: Record<"north" | "south" | "aux" | "mixed", string> = {
  north:
    "Across your five relationship palaces, authority-oriented stars lead. " +
    "The people in your life tend to be decisive and strategic. Clear roles and shared mission keep these bonds productive.",
  south:
    "Across your five relationship palaces, resource-oriented stars lead. " +
    "The people in your life tend to be action-focused and pragmatic. High-trust, high-execution environments suit you best.",
  aux:
    "Across your five relationship palaces, auxiliary stars lead. " +
    "Your relationships are specialised and enabling: supporters and collaborators who amplify your vision from supporting roles.",
  mixed:
    "Across your five relationship palaces, star patterns are balanced and diverse. " +
    "You attract both strategic thinkers and execution-focused allies. That is a structural advantage across every relationship type.",
};

/** Ideal collaborator traits by dominant people-palace pattern. */
export const IDEAL_COLLABORATOR_BY_SYNTHESIS: Record<"north" | "south" | "aux" | "mixed", string> = {
  north:
    "Look for decisive operators who respect hierarchy, move fast on agreed goals, and do not need constant reassurance.",
  south:
    "Look for resourceful executors who convert ideas into revenue, handle ambiguity, and stay loyal under pressure.",
  aux:
    "Look for specialist partners who own a lane, deliver without drama, and strengthen your blind spots quietly.",
  mixed:
    "Look for versatile partners who can switch between strategy and execution, and who complement your top-priority relationship palace.",
};

/** Phase-specific people priority by Da Yun season key. */
export const PHASE_PEOPLE_PRIORITY: Record<
  string,
  { palaceKey: PeoplePalaceKey; headline: string; action: string }
> = {
  spring: {
    palaceKey: "交友",
    headline: "Prioritize Network & Alliances this cycle",
    action: "Expand alliances, referrals, and joint ventures. Your network is the primary growth lever in the Expansion phase.",
  },
  summer: {
    palaceKey: "父母",
    headline: "Prioritize Sponsors & Board this cycle",
    action: "Invest in sponsors, mentors, and upstream authority. The Visibility phase rewards those who have high-level backing.",
  },
  autumn: {
    palaceKey: "夫妻",
    headline: "Prioritize Primary Partnership this cycle",
    action: "Align with your core partner on risk tolerance and capital protection. Consolidation requires a unified strategic front.",
  },
  winter: {
    palaceKey: "子女",
    headline: "Prioritize Junior Talent & Assets this cycle",
    action: "Structure what you are building for the long term: junior talent, scalable IP, and maturing operational projects.",
  },
};
