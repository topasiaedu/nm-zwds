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
  "In your career and business, you operate through five relationship layers: peers, partners, allies, sponsors, and junior talent. " +
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
      "Force your peers to put their commitments in writing. If you share projects, clients, or resources, document exactly who owns what and how either of you can walk away.",
      "Stop doing your coworkers' jobs. If a peer drops the ball, let the ball drop. Covering for them only trains them to be lazy.",
      "Audit your peer collaborations. If a partnership is costing you more time than it delivers value, step away before you invest more.",
    ],
    watchOut: [
      "Paying for a peer's mistakes because you are afraid of looking difficult.",
      "Treating a coworker like a friend when they are actually competing with you for the same promotion or client.",
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
      "Set a hard rule with your primary partner or spouse: no major financial or time commitments without two 'yes' votes. One person deciding and the other staying quiet is how partnerships die.",
      "Stop avoiding the hard conversation about money. Sit down soon and explicitly state your financial goals and risk limits. If you aren't aligned, you are dragging each other down.",
      "Renegotiate any 50/50 split where you are doing 80% of the work. If your partner won't step up, step away from the joint project.",
    ],
    watchOut: [
      "Staying silent about a bad decision because you don't want to start a fight.",
      "Outsourcing your financial or strategic thinking entirely to your partner.",
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
      "Stop going to networking events that don't produce real opportunities. Cut your social calendar in half and only meet with people who can actually accelerate your career or business.",
      "Stop doing free favors. If someone in your network asks to 'pick your brain', ask for a specific, high-value introduction in return, or simply say no. Protect your time.",
      "Identify the three people in your network who actually send you high-quality opportunities or referrals. Take them to dinner. Ignore the rest.",
    ],
    watchOut: [
      "Wasting hours giving free advice to 'friends' who will never reciprocate or advance your goals.",
      "Saying yes to every introduction and filling your calendar with useless coffee chats.",
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
      "Stop asking your mentors for general advice. Bring them a specific, high-stakes problem, present your proposed solution, and ask them to tear it apart.",
      "Ask your boss or sponsor exactly what you need to do to get your next promotion or raise. Get the metrics in writing, hit them, and hold them to the agreement.",
      "Cut off family members or senior figures who use money to control you. If a loan or gift comes with strings attached, give it back.",
    ],
    watchOut: [
      "Waiting for a boss or mentor to notice your hard work instead of explicitly asking for the reward.",
      "Taking advice from senior people who haven't actually built what you are trying to build.",
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
      "Stop micromanaging your team. Give them a clear deadline and a specific outcome, then step back. If they drop the ball, let them face the consequences. Stop being their safety net.",
      "Cut resources or funding to any side project or junior initiative that hasn't hit its targets in the last 90 days. Stop throwing good time and money after bad ideas.",
      "Identify your single best junior operator and give them a project that scares them. The fastest way to build leverage is to force your best people to step up.",
    ],
    watchOut: [
      "Doing the work yourself because 'it's faster' instead of forcing your team to learn.",
      "Keeping low-performers around because you feel bad letting them go.",
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
    headline: "Strongest leverage node: Peers & Collaborators",
    meaning: "Your chart routes the highest-yield opportunities and operational support through your peers and colleagues.",
    practicalTip: "Formalize who owns what in any joint project early to protect the relationship.",
  },
  "夫妻": {
    headline: "Strongest leverage node: Primary Partner",
    meaning: "Your chart routes the most natural strategic leverage and stability through your spouse or primary partner.",
    practicalTip: "Establish a 'two-yes' rule for any major financial or time commitment.",
  },
  "交友": {
    headline: "Strongest leverage node: Professional Network",
    meaning: "Your chart routes the most lucrative deal flow, referrals, and opportunities through your wider professional orbit.",
    practicalTip: "Cap low-ROI social commitments to protect your networking bandwidth.",
  },
  "父母": {
    headline: "Strongest leverage node: Sponsors & Mentors",
    meaning: "Your chart routes the most direct access to capital and high-level approval through mentors and sponsors.",
    practicalTip: "Bring structured solutions to your mentors, not just updates.",
  },
  "子女": {
    headline: "Strongest leverage node: Junior Talent & Projects",
    meaning: "Your chart routes the highest long-term ROI through the junior talent you develop and the projects you build.",
    practicalTip: "Set strict, 90-day measurable targets for any project you fund or manage.",
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
    headline: "Prioritize Sponsors & Mentors this cycle",
    action: "Invest in sponsors, mentors, and upstream authority. The Visibility phase rewards those who have high-level backing.",
  },
  autumn: {
    palaceKey: "夫妻",
    headline: "Prioritize Primary Partnership this cycle",
    action: "Align with your core partner on risk tolerance and resource protection. Consolidation requires a unified strategic front.",
  },
  winter: {
    palaceKey: "子女",
    headline: "Prioritize Junior Talent & Projects this cycle",
    action: "Structure what you are building for the long term: junior talent, scalable projects, and maturing operations.",
  },
};
