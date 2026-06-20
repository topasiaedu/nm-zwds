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
    intro: "Peers and siblings beside you, not above or below you.",
    starBlockLabel: "Your peer dynamic is shaped by",
    strategicRole: "Business partners and peers at your level, including siblings.",
    strategicAngle: "Peers amplify you when roles are clear. Seek equals who match your pace.",
    emptyPalaceGuidance:
      "Peer relationships stay unclear until you design them. Write down who owns what and how you split money before loyalty becomes a fight.",
    whatStarsMean: "Who shows up as your equals: competitive, collaborative, or quietly supportive.",
    bottomLine: "Clear roles with peers turn rivalry into shared wins.",
  },
  "夫妻": {
    displayLabel: "Spouse Palace",
    sectionTitle: "Spouse Palace",
    intro: "Spouse, partner, and one-to-one intimate bonds.",
    starBlockLabel: "Your partnership dynamic is shaped by",
    strategicRole: "Spouse, business partner, and one-to-one decision partners.",
    strategicAngle: "Partner with what this palace asks for. Do not outsource your gaps.",
    emptyPalaceGuidance:
      "One-to-one relationships run on how you handle closeness and accountability. Agree who decides what each week and protect your energy.",
    whatStarsMean: "Who you draw in, how you negotiate closeness, and what you need from a partner.",
    bottomLine: "The right partner amplifies your strengths, not your blind spots.",
  },
  "交友": {
    displayLabel: "Friends Palace",
    sectionTitle: "Friends Palace",
    intro: "Friends, allies, and your wider social network.",
    starBlockLabel: "Your social orbit is shaped by",
    strategicRole: "Friends, referral contacts, and people you collaborate with.",
    strategicAngle: "Your network reflects how you show up. Invest where work compounds.",
    emptyPalaceGuidance:
      "Your friend and partner circle works best when you go deep with fewer people. Limit introductions, tie favours to results, and let follow-through define your name.",
    whatStarsMean: "The friends and collaborators who enter your circle and how they experience you.",
    bottomLine: "Your network quality tracks how consistently you deliver on commitments.",
  },
  "父母": {
    displayLabel: "Parents Palace",
    sectionTitle: "Parents Palace",
    intro: "Parents, mentors, teachers, and supervisors.",
    starBlockLabel: "Your authority relationships are shaped by",
    strategicRole: "Parents, mentors, bosses, and people who approve decisions above you.",
    strategicAngle: "The right mentor speeds you up. Know who backs you and how you respond to senior figures.",
    emptyPalaceGuidance:
      "Relationships with people above you work best when you do not depend on just one person. Spread your asks and keep family money boundaries clear.",
    whatStarsMean: "How you relate to bosses, mentors, parents, and other senior figures.",
    bottomLine: "Choose mentors and bosses who raise your ceiling, not your comfort zone.",
  },
  "子女": {
    displayLabel: "Children Palace",
    sectionTitle: "Children Palace",
    intro: "Children, junior staff, and long-term projects you are building.",
    starBlockLabel: "Your nurturing style is shaped by",
    strategicRole: "Your children, junior staff, trainees, and long-term projects.",
    strategicAngle: "What you raise grows in this palace's pattern. Structure beats indulgence.",
    emptyPalaceGuidance:
      "What you build with people responds to deadlines as much as warmth. Limit hand-holding, track progress clearly, and celebrate finished work over comfort.",
    whatStarsMean: "How you teach, protect, and help people or projects reach maturity.",
    bottomLine: "What you raise needs structure as much as warmth.",
  },
};

export const PEOPLE_PALACE_PLAYBOOK: Record<PeoplePalaceKey, PeoplePalacePlaybook> = {
  "兄弟": {
    keyActions: [
      "Define roles, equity, and exit terms before co-founding with peers",
      "Rotate who leads shared projects and document the handoff each quarter",
      "Hold a quarterly 15-minute balance check-in on money and recognition",
    ],
    watchOut: [
      "Covering peer costs until resentment builds",
      "Competing for approval instead of measurable outcomes",
    ],
    successMetrics: [
      "Written scopes on every shared commitment",
      "Peer conflicts resolved within 48 hours",
    ],
    reflectionQuestions: [
      "Which peer compounds outcomes versus drains capacity?",
      "Am I treating this person as partner or competitor?",
    ],
  },
  "夫妻": {
    keyActions: [
      "Weekly 30-minute partnership sync on money, time, and decisions",
      "Write major commitments before acting; use a two-yes rule on big moves",
      "Set explicit boundaries on what each partner owns end to end",
    ],
    watchOut: [
      "Buying peace instead of naming issues early",
      "Expecting your partner to fix gaps you refuse to address",
    ],
    successMetrics: [
      "Two-yes rule held on every major decision this quarter",
      "Clear ownership map reviewed monthly",
    ],
    reflectionQuestions: [
      "Does this partnership amplify my strengths or outsource my gaps?",
      "What does this bond need from me operationally this month?",
    ],
  },
  "交友": {
    keyActions: [
      "Map your top 10 allies; drive one joint win with each per quarter",
      "Cap introductions and favours; pause 24 hours before new social yeses",
      "Track who refers business and reciprocate within two weeks",
    ],
    watchOut: [
      "Overfeeding the network before core priorities are funded",
      "Mistaking warmth and charm for strategic alignment",
    ],
    successMetrics: [
      "Two alliances with measurable revenue or referral outcomes per quarter",
      "One guilt-free no to low-alignment asks per week",
    ],
    reflectionQuestions: [
      "Who compounds my time versus consumes it?",
      "What do new contacts assume about me within 30 days?",
    ],
  },
  "父母": {
    keyActions: [
      "Monthly mentor or parent touchpoint with a named agenda",
      "Document every family loan, gift, or eldercare agreement in writing",
      "One specific sponsor ask per quarter with a defined outcome",
    ],
    watchOut: [
      "Saying yes out of guilt instead of strategy",
      "Chasing approval when you need direct feedback",
    ],
    successMetrics: [
      "Every mentor tie has a named outcome this cycle",
      "Family money boundaries reviewed and signed yearly",
    ],
    reflectionQuestions: [
      "Who accelerates my ceiling versus shrinks it?",
      "How do I respond when upstream approval is withheld?",
    ],
  },
  "子女": {
    keyActions: [
      "One protected hour per child or protégé weekly with a milestone focus",
      "Weekly cap on indulgence; tie rewards to completed milestones",
      "Quarterly showcase of what each protégé shipped, not just effort",
    ],
    watchOut: [
      "Over-scheduling what you nurture until everyone burns out",
      "Funding projects with warmth but no structure or deadline",
    ],
    successMetrics: [
      "Visible milestone tracker per protégé updated monthly",
      "Named growth outcome for each person you nurture this season",
    ],
    reflectionQuestions: [
      "Does this person need more structure or more warmth right now?",
      "Am I inviting growth or applying pressure disguised as care?",
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
    headline: "Strongest resource opening · Peers",
    meaning: "Your chart routes the most natural support and shared opportunity through peer and sibling bonds.",
    practicalTip: "Keep a clear ledger so generosity stays mutual.",
  },
  "夫妻": {
    headline: "Strongest resource opening · Partner",
    meaning: "Your chart routes the most natural support and decision leverage through your partner and one-to-one bonds.",
    practicalTip: "Set a generosity budget. Name issues early.",
  },
  "交友": {
    headline: "Strongest resource opening · Network",
    meaning: "Your chart routes the most natural referrals, introductions, and alliance openings through your wider network.",
    practicalTip: "Pause 24 hours before new social commitments.",
  },
  "父母": {
    headline: "Strongest resource opening · Mentors",
    meaning: "Your chart routes the most natural upstream support through parents, mentors, and sponsors.",
    practicalTip: "Document family loans and eldercare agreements in writing.",
  },
  "子女": {
    headline: "Strongest resource opening · Nurture",
    meaning: "Your chart routes the most natural long-term payoff through children, protégés, and what you bring to maturity.",
    practicalTip: "Cap indulgence. Schedule one-on-one time weekly.",
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
    headline: "Prioritise Friends Palace this cycle",
    action: "Expand alliances, referrals, and joint ventures. Your network is the growth lever in Expansion.",
  },
  summer: {
    palaceKey: "父母",
    headline: "Prioritise Parents Palace this cycle",
    action: "Invest in sponsors, mentors, and upstream authority. Visibility phase rewards who vouches for you.",
  },
  autumn: {
    palaceKey: "夫妻",
    headline: "Prioritise Spouse Palace this cycle",
    action: "Align with your core partner on boundaries and capital protection. Consolidation needs one clear decision partner.",
  },
  winter: {
    palaceKey: "子女",
    headline: "Prioritise Children Palace this cycle",
    action: "Structure what you are building for the long term: protégés, successors, and maturing projects.",
  },
};
