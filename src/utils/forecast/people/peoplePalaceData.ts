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
      "Stop doing your coworkers' jobs for them. Let them fail if they don't do the work.",
      "Find colleagues who are smarter than you and figure out how you can help each other.",
      "Address friction with key colleagues immediately. Unspoken tension ruins your focus.",
    ],
    watchOut: [
      "Doing favors or covering for someone until you secretly resent them.",
      "Competing with your peers to look good instead of teaming up to get results.",
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
      "Sit down with your partner and clearly state your financial goals for the year. Stop guessing.",
      "Agree on a budget limit (e.g., 'we must discuss any purchase over $1,000').",
      "Schedule a dedicated time to talk about the one big decision you've been avoiding.",
    ],
    watchOut: [
      "Making a huge career change or spending a lot of money without telling your partner.",
      "Expecting your partner to fix your own bad habits or bad moods.",
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
      "Pick three people who already have what you want, and ask them for a focused 15-minute call.",
      "Stop doing useless coffee chats. Only meet with people who align with your goals.",
      "Before saying yes to a favor, decide exactly what you are getting out of it.",
    ],
    watchOut: [
      "Hanging out with people just because you went to school together 10 years ago.",
      "Letting loud, demanding people waste your time while you do all the work.",
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
      "Ask your boss or mentor exactly what it takes to get to the next level. Be specific.",
      "If you help your parents financially, decide on a fixed monthly amount and stick to it.",
      "Stop asking your mentors for general advice. Bring them a problem and a proposed solution.",
    ],
    watchOut: [
      "Taking on a terrible project just because your boss asked you to, hurting your own career.",
      "Asking a mentor for 'a quick chat' without having specific questions prepared.",
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
      "Give your team or your kids clear deadlines and expectations. Stop hand-holding.",
      "Stop throwing money or time at projects (or people) that aren't improving. Cut them off.",
      "Praise people when they actually finish the job, not just when they try hard.",
    ],
    watchOut: [
      "Being so nice to your team that they become completely dependent on you.",
      "Refusing to cancel a bad project or fire a bad employee because it feels mean.",
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
