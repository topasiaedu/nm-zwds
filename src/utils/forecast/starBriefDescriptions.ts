/**
 * Star Brief Descriptions: Alignment Advantage Report
 *
 * Maps each of the 18 ZWDS star names to:
 *  - `pinyin` : full Pinyin display name (e.g. "Zi Wei", "Qi Sha")
 *  - `brief`  : 1–2 sentence business-context description
 *  - `role`   : "north" | "south" | "aux" for visual classification
 *
 * Keys match the star names as stored in `Palace.mainStar[].name` and
 * `Palace.minorStars[].name` by the ZWDS calculator:
 *   - 14 main stars  → simplified Chinese (from constants.ts MAIN_STARS_TABLE)
 *   - 4 support stars → traditional Chinese (from calculator.ts step 9)
 *
 * All star names rendered to the user should use the `pinyin` field, not raw
 * Chinese characters, per the project naming convention.
 */

export interface StarBrief {
  /** Full Pinyin name for display, e.g. "Zi Wei", "Qi Sha". */
  pinyin: string;
  /** Short star title used as a visual label, e.g. "Emperor Star". */
  title:  string;
  /** Three keyword traits for visual display: concise, 1–2 words each. */
  keywords: [string, string, string];
  /** One-sentence (≤ 15 words) business-context description for the report. */
  brief:  string;
  /** Northern (Zi Wei lineage), Southern (Tian Fu lineage), or auxiliary. */
  role:   "north" | "south" | "aux";
}

export const STAR_BRIEF: Record<string, StarBrief> = {

  // ── Northern Main Stars (Zi Wei lineage) ──────────────────────────────────

  "紫微": {
    pinyin:   "Zi Wei",
    title:    "Emperor Star",
    keywords: ["Authority", "Command", "Leadership"],
    brief:    "Your presence sets direction: people follow you without being asked.",
    role:     "north",
  },
  "天机": {
    pinyin:   "Tian Ji",
    title:    "Intelligence Star",
    keywords: ["Strategy", "Adaptability", "Analysis"],
    brief:    "You see patterns others miss and find solutions nobody else considers.",
    role:     "north",
  },
  "太阳": {
    pinyin:   "Tai Yang",
    title:    "Sun Star",
    keywords: ["Influence", "Visibility", "Generosity"],
    brief:    "Opportunity flows toward you through warmth and genuine contribution.",
    role:     "north",
  },
  "武曲": {
    pinyin:   "Wu Qu",
    title:    "Finance Star",
    keywords: ["Discipline", "Finance", "Execution"],
    brief:    "Your instinct for resources and structured execution maximises every input.",
    role:     "north",
  },
  "天同": {
    pinyin:   "Tian Tong",
    title:    "Harmony Star",
    keywords: ["Harmony", "Trust", "Collaboration"],
    brief:    "You build trust effortlessly and create environments where people thrive.",
    role:     "north",
  },
  "廉贞": {
    pinyin:   "Lian Zhen",
    title:    "Authority Star",
    keywords: ["Principles", "Structure", "Conviction"],
    brief:    "Rules and systems are your operating language: you thrive with clear codes.",
    role:     "north",
  },

  // ── Southern Main Stars (Tian Fu lineage) ────────────────────────────────

  "天府": {
    pinyin:   "Tian Fu",
    title:    "Treasury Star",
    keywords: ["Stability", "Accumulation", "Conservation"],
    brief:    "Your greatest wealth comes from preservation and compounding over time.",
    role:     "south",
  },
  "太阴": {
    pinyin:   "Tai Yin",
    title:    "Moon Star",
    keywords: ["Intuition", "Sensitivity", "Subtlety"],
    brief:    "Your edge is reading the room before anyone else does.",
    role:     "south",
  },
  "贪狼": {
    pinyin:   "Tan Lang",
    title:    "Desire Star",
    keywords: ["Charisma", "Versatility", "Magnetism"],
    brief:    "You attract opportunities and relationships effortlessly at full expression.",
    role:     "south",
  },
  "巨门": {
    pinyin:   "Ju Men",
    title:    "Communication Star",
    keywords: ["Communication", "Investigation", "Persuasion"],
    brief:    "Your power is uncovering what others overlook and communicating it with conviction.",
    role:     "south",
  },
  "天相": {
    pinyin:   "Tian Xiang",
    title:    "Minister Star",
    keywords: ["Reliability", "Precision", "Support"],
    brief:    "The person everyone depends on when execution and precision matter most.",
    role:     "south",
  },
  "天梁": {
    pinyin:   "Tian Liang",
    title:    "Elder Star",
    keywords: ["Wisdom", "Protection", "Advisory"],
    brief:    "You carry an authority others seek for guidance: naturally protective and principled.",
    role:     "south",
  },
  "七杀": {
    pinyin:   "Qi Sha",
    title:    "General Star",
    keywords: ["Boldness", "Independence", "Drive"],
    brief:    "Built for forging new paths: limitations are challenges to break through.",
    role:     "south",
  },
  "破军": {
    pinyin:   "Po Jun",
    title:    "Warrior Star",
    keywords: ["Revolution", "Reform", "Disruption"],
    brief:    "Designed to tear down what is outdated and rebuild something better.",
    role:     "south",
  },

  // ── Auxiliary Support Stars ───────────────────────────────────────────────

  "左輔": {
    pinyin:   "Zuo Fu",
    title:    "Left Support",
    keywords: ["Collaboration", "Backing", "Amplification"],
    brief:    "Strengthens the support and mentors you attract in any area it occupies.",
    role:     "aux",
  },
  "右弼": {
    pinyin:   "You Bi",
    title:    "Right Support",
    keywords: ["Hidden Aid", "Alliance", "Reinforcement"],
    brief:    "Draws capable allies who reinforce your position quietly and without fanfare.",
    role:     "aux",
  },
  "文昌": {
    pinyin:   "Wen Chang",
    title:    "Literary Star",
    keywords: ["Credentials", "Clarity", "Expression"],
    brief:    "Boosts intellectual credibility and reputation through writing and formal recognition.",
    role:     "aux",
  },
  "文曲": {
    pinyin:   "Wen Qu",
    title:    "Arts Star",
    keywords: ["Persuasion", "Creativity", "Influence"],
    brief:    "Enhances persuasion and creative intelligence: powerful for influence-based roles.",
    role:     "aux",
  },
};
