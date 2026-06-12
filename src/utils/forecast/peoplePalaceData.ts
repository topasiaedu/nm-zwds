/**
 * People Palace Data: Alignment Advantage Report
 *
 * Provides framing context for the three relationship palaces shown in
 * Chapter 05 · People Intelligence:
 *   - 夫妻 (Spouse Palace)   → Partnership & business co-founder dynamics
 *   - 交友 (Friends Palace)  → Network, alliances, and team energy
 *   - 父母 (Parents Palace)  → Mentors, authority figures, and advisors
 *
 * The per-star descriptions come from `starBriefDescriptions.ts` (keyed by the
 * star's Chinese name). This file provides only the palace-level framing —
 * the intro sentence and business interpretation title.
 *
 * The `noStarFallback` field is shown when a palace has no main stars placed
 * (which is a valid ZWDS configuration, not an error).
 */

export interface PeoplePalaceFraming {
  /** Short title for the palace section, e.g. "Partnership Energy". */
  sectionTitle: string;
  /**
   * One-sentence framing that sets up the palace for a reader unfamiliar with
   * ZWDS: explains what this palace reveals in a business context.
   */
  intro: string;
  /**
   * Label for the star list block, e.g. "Your partners are shaped by". */
  starBlockLabel: string;
  /**
   * What the synthesis of stars in this palace means strategically.
   * Shown as a callout at the end of the palace section.
   */
  strategicAngle: string;
  /**
   * Fallback shown when the palace has no main stars.
   * This is a valid chart configuration: empty palaces borrow energy from
   * the opposite palace and their absence is itself meaningful.
   */
  noStarFallback: string;
}

/**
 * Framing data for the three relationship palaces.
 * Keys are the Chinese palace names as stored in `Palace.name`.
 */
export const PEOPLE_PALACE_FRAMING: Record<"夫妻" | "交友" | "父母", PeoplePalaceFraming> = {

  "夫妻": {
    sectionTitle:   "Co-Founder & Joint Venture Dynamics",
    intro:
      "Reveals the qualities you naturally attract in a partner and what kind of dynamic defines your key alliances.",
    starBlockLabel: "Your partner archetype is shaped by",
    strategicAngle:
      "Seek someone who embodies these qualities, not someone who compensates for your weaknesses.",
    noStarFallback:
      "No main stars placed: partnership energy is shaped by the opposite palace (Career). Alliances work best when grounded in shared professional direction.",
  },

  "交友": {
    sectionTitle:   "Market & Audience Capture",
    intro:
      "Reveals what kind of team dynamic you naturally create and who shows up to support you.",
    starBlockLabel: "Your network and team are shaped by",
    strategicAngle:
      "Build your most important relationships through shared work: this is the energy you radiate to your orbit.",
    noStarFallback:
      "No main stars placed: network energy is shaped by the opposite palace. Alliances form organically through professional contexts, not social circles.",
  },

  "父母": {
    sectionTitle:   "Investor & Mentor Leverage",
    intro:
      "Reveals how you relate to authority figures and what kind of mentor is most aligned with your path.",
    starBlockLabel: "Your mentor and authority dynamic is shaped by",
    strategicAngle:
      "Use this to identify the type of advisor or sponsor who will create the greatest impact for you.",
    noStarFallback:
      "No main stars placed: mentorship energy is nuanced and context-driven. Build a diverse advisor council rather than relying on a single guide.",
  },
};

/**
 * A short synthesis note appended at the bottom of the People Intelligence
 * chapter based on the dominant star roles across all three people palaces.
 * Keyed by the majority role: "north", "south", "aux", or "mixed".
 */
export const PEOPLE_SYNTHESIS: Record<"north" | "south" | "aux" | "mixed", string> = {
  north:
    "Your stakeholder profile is highly structured and authority-driven: the people drawn to you tend to be " +
    "visionary, decisive, and strategic. Your inner circle operates best when everyone has clear roles and a shared mission.",
  south:
    "Your stakeholder profile is dynamic and relationship-driven: the people drawn to you tend to be " +
    "resourceful, emotionally attuned, and action-oriented. Your inner circle operates best in high-trust, high-execution environments.",
  aux:
    "Your stakeholder profile is specialized and context-driven: the people drawn to you tend to be " +
    "supportive, enabling, and collaborative. Your strongest relationships emerge when you give others the space to amplify your vision.",
  mixed:
    "Your stakeholder profile is balanced and diverse: your inner circle naturally attracts " +
    "both strategic thinkers and execution-focused operators. This is a structural advantage for building multi-functional teams.",
};
