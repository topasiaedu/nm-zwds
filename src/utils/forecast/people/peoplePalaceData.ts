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
      "Audit your peer collaborations. If you share resources, credit, or side-project responsibilities, clarify who owns what in writing.",
      "Identify the peers who have access to the information or opportunities you need next. Propose a mutually beneficial exchange of value.",
      "Address friction with key colleagues or collaborators immediately. Unspoken tension in this domain directly erodes your daily execution.",
    ],
    watchOut: [
      "Subsidizing an underperforming peer's workload because you want to avoid a difficult conversation.",
      "Competing with peers for status instead of collaborating to capture larger opportunities.",
    ],
    successMetrics: [
      "Clear ownership established on every shared commitment",
      "Peer conflicts addressed and resolved within 48 hours",
    ],
    reflectionQuestions: [
      "Which peer compounds my outcomes versus drains my capacity?",
      "Am I treating this person as a collaborator or a competitor?",
    ],
  },
  "夫妻": {
    keyActions: [
      "Ensure your primary partner is fully aligned on your current risk tolerance and career or financial strategy.",
      "Establish a 'two-yes' rule for any major financial commitment or career pivot to protect your shared stability.",
      "Schedule a dedicated sync to address the one major transition or risk you have been avoiding discussing.",
    ],
    watchOut: [
      "Taking unilateral financial or career risks that destabilize your home-base.",
      "Outsourcing your personal blind spots to a partner instead of taking responsibility for them.",
    ],
    successMetrics: [
      "Two-yes rule held on every major decision this quarter",
      "Clear alignment achieved on the next 12-month trajectory",
    ],
    reflectionQuestions: [
      "Does this partnership amplify my strengths or enable my complacency?",
      "What does this bond need from me operationally this month?",
    ],
  },
  "交友": {
    keyActions: [
      "Audit your network for leverage. Identify three people who have access to the rooms you want to enter, and make a specific proposal.",
      "Cap your social and networking commitments. Treat your attention as capital and stop deploying it into low-ROI interactions.",
      "Before accepting a new collaboration, define exactly what leverage you are gaining and what time you are giving up.",
    ],
    watchOut: [
      "Deploying time into relationships based on history rather than current alignment.",
      "Allowing charismatic people to dictate your schedule while you carry the execution load.",
    ],
    successMetrics: [
      "Two alliances with measurable career or financial outcomes per quarter",
      "One guilt-free 'no' to low-alignment asks per week",
    ],
    reflectionQuestions: [
      "Who compounds my time versus consumes it?",
      "What do new contacts assume about my value within 30 days?",
    ],
  },
  "父母": {
    keyActions: [
      "Identify the sponsor or senior leader who has the political capital to unblock your next major move. Make a specific, concrete ask.",
      "Formalize any informal family financial arrangements or eldercare responsibilities with clear boundaries.",
      "Stop seeking approval and start seeking leverage. Bring solutions and structured requests to your mentors, not just updates.",
    ],
    watchOut: [
      "Saying yes to a boss or senior family figure out of obligation when it actively damages your own trajectory.",
      "Chasing mentorship when what you actually need is a direct introduction or an opportunity.",
    ],
    successMetrics: [
      "Every mentor tie has a named outcome this cycle",
      "Family financial boundaries reviewed and clearly communicated",
    ],
    reflectionQuestions: [
      "Who accelerates my ceiling versus shrinks it?",
      "How do I respond when upstream approval is withheld?",
    ],
  },
  "子女": {
    keyActions: [
      "Set strict, 90-day measurable milestones for any junior team members you manage or long-term projects you are building.",
      "Cap the time and resources you provide to underperforming projects or mentees. Cut your losses early.",
      "Reward execution, not just effort. Celebrate finished results to set the standard for those you lead.",
    ],
    watchOut: [
      "Deploying endless time into people or projects because cutting them off feels too harsh.",
      "Providing warmth and encouragement without deadlines, creating dependence rather than capability.",
    ],
    successMetrics: [
      "Visible milestone tracker per project or mentee updated monthly",
      "Named growth outcome for each initiative you nurture this season",
    ],
    reflectionQuestions: [
      "Does this person/project need more structure or more warmth right now?",
      "Am I inviting growth or enabling endless preparation?",
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
