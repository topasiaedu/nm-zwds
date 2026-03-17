/**
 * Destiny Alert Map — Star × Transformation Constants
 *
 * Key format: `"starName_transformation"` using traditional Chinese characters.
 * Example: "廉貞_化祿", "天機_化權", "紫微_化科", "太陽_化忌"
 *
 * Each entry has:
 *   line1 — Theme: what this star's energy means under this transformation
 *   line2 — Reality: how it shows up practically
 *   line3 — Directive: what to do or watch out for (rendered bold/italic in UI)
 */

export type DestinyAlertStarEntry = {
  /** The star carrying this transformation (Chinese name, e.g. "廉貞") */
  starName: string;
  /** The transformation type (e.g. "化祿") */
  transformation: string;
  /** Line 1 — Theme */
  line1: string;
  /** Line 2 — Reality */
  line2: string;
  /** Line 3 — Directive (rendered bold in UI) */
  line3: string;
};

export const DESTINY_ALERT_STAR_CONSTANTS: Record<string, DestinyAlertStarEntry> = {

  // ────────────────────────────────────────────────────────────
  // 化祿 (10 stars)
  // ────────────────────────────────────────────────────────────

  "廉貞_化祿": {
    starName: "廉貞",
    transformation: "化祿",
    line1: "Your passionate, magnetic nature becomes a wealth attractor.",
    line2: "Desire and drive pull opportunities and people into your orbit.",
    line3: "Channel intensity into a clear direction — and watch money follow.",
  },
  "天機_化祿": {
    starName: "天機",
    transformation: "化祿",
    line1: "Your strategic mind flows into an abundance-generating frequency.",
    line2: "Clever planning and adaptability open doors others don't notice.",
    line3: "Trust your instincts when pivoting — this is your lucky gear.",
  },
  "天同_化祿": {
    starName: "天同",
    transformation: "化祿",
    line1: "Your peaceful, pleasure-seeking nature draws comfort and ease.",
    line2: "Life rewards your gentleness with steady, low-stress flow.",
    line3: "Let yourself receive — you don't have to hustle to prosper here.",
  },
  "太陰_化祿": {
    starName: "太陰",
    transformation: "化祿",
    line1: "The Moon's subtle wealth energy is fully activated and flowing.",
    line2: "Wealth arrives quietly through emotional intelligence and intuition.",
    line3: "Pay attention to behind-the-scenes opportunities — they're golden.",
  },
  "貪狼_化祿": {
    starName: "貪狼",
    transformation: "化祿",
    line1: "Your charisma and magnetic desire become a prosperity engine.",
    line2: "People want what you have — talent, charm, and opportunity multiply.",
    line3: "Own your magnetism fully — your personality is your biggest asset.",
  },
  "武曲_化祿": {
    starName: "武曲",
    transformation: "化祿",
    line1: "The General's financial discipline unlocks a strong abundance flow.",
    line2: "Decisive action and structured effort generate tangible, solid returns.",
    line3: "Make your financial moves now — execution is rewarded generously.",
  },
  "太陽_化祿": {
    starName: "太陽",
    transformation: "化祿",
    line1: "The Sun shines fully — your generosity attracts reciprocal abundance.",
    line2: "Public-facing roles and giving nature create strong opportunity cycles.",
    line3: "Step into visibility — your light draws in what you need.",
  },
  "巨門_化祿": {
    starName: "巨門",
    transformation: "化祿",
    line1: "Your communication gift becomes a channel for flow and prosperity.",
    line2: "Words, teaching, and investigation now carry real material rewards.",
    line3: "Speak your expertise freely — your voice opens financial doors.",
  },
  "天梁_化祿": {
    starName: "天梁",
    transformation: "化祿",
    line1: "The Elder's wisdom and protective energy generate quiet abundance.",
    line2: "Your steady guidance and experience are valued by those around you.",
    line3: "Mentor generously — your authority naturally attracts loyalty and gain.",
  },
  "破軍_化祿": {
    starName: "破軍",
    transformation: "化祿",
    line1: "Your pioneering, boundary-breaking energy generates a wealth surge.",
    line2: "Bold moves and unconventional starts create real material momentum.",
    line3: "Break the old mold willingly — your next chapter is more prosperous.",
  },

  // ────────────────────────────────────────────────────────────
  // 化權 (10 stars)
  // ────────────────────────────────────────────────────────────

  "破軍_化權": {
    starName: "破軍",
    transformation: "化權",
    line1: "Your destructive-creative force gains forceful authority and drive.",
    line2: "You become an unstoppable agent of transformation and bold execution.",
    line3: "Lead from the front — your power to disrupt is a strategic weapon.",
  },
  "天梁_化權": {
    starName: "天梁",
    transformation: "化權",
    line1: "The Elder's wisdom crystallises into commanding authority.",
    line2: "People look to you for final judgment — your word carries serious weight.",
    line3: "Own your authority role fully — hesitation here costs influence.",
  },
  "天機_化權": {
    starName: "天機",
    transformation: "化權",
    line1: "The Strategist's mind sharpens into decisive, assertive power.",
    line2: "Your plans don't just refine — they command results from others.",
    line3: "Stop planning, start directing — your strategy deserves to be executed.",
  },
  "天同_化權": {
    starName: "天同",
    transformation: "化權",
    line1: "The Idealist's gentle nature gains unexpected forceful drive.",
    line2: "You'll feel pulled to assert yourself in situations that once felt comfortable.",
    line3: "Use this ambition surge wisely — don't let power make you rigid.",
  },
  "太陰_化權": {
    starName: "太陰",
    transformation: "化權",
    line1: "The Moon's quiet influence transforms into hidden controlling power.",
    line2: "You gain authority through emotional intelligence and strategic subtlety.",
    line3: "Handle your influence responsibly — your emotional pull is now very strong.",
  },
  "貪狼_化權": {
    starName: "貪狼",
    transformation: "化權",
    line1: "The Wolf's desire amplifies into commanding charisma and ambition.",
    line2: "Your magnetism now carries real authority — people follow your lead.",
    line3: "Channel this drive into one clear goal — scattered ambition dilutes power.",
  },
  "武曲_化權": {
    starName: "武曲",
    transformation: "化權",
    line1: "The General's discipline becomes a powerful command force.",
    line2: "Financial decisions and leadership moves carry decisive, lasting impact.",
    line3: "Be direct, be firm — authority without hesitation is your mode now.",
  },
  "太陽_化權": {
    starName: "太陽",
    transformation: "化權",
    line1: "The Sun's outward energy becomes bold visibility and public authority.",
    line2: "You step into leadership roles naturally — the spotlight is yours.",
    line3: "Take the stage without apology — your time to lead publicly has arrived.",
  },
  "巨門_化權": {
    starName: "巨門",
    transformation: "化權",
    line1: "The Gate's investigative nature gains the power to demand truth.",
    line2: "Your words carry authority — debates, negotiations, and confrontations swing your way.",
    line3: "Ask the hard questions — your right to know is fully backed now.",
  },
  "紫微_化權": {
    starName: "紫微",
    transformation: "化權",
    line1: "The Emperor's natural authority becomes an undeniable force of command.",
    line2: "Leadership feels natural and effortless — your presence commands rooms.",
    line3: "Step fully into your authority — this is the energy of kings, use it.",
  },

  // ────────────────────────────────────────────────────────────
  // 化科 (9 stars)
  // ────────────────────────────────────────────────────────────

  "武曲_化科": {
    starName: "武曲",
    transformation: "化科",
    line1: "The General's decisiveness earns recognition for financial acumen.",
    line2: "Your reputation for practical results and money sense grows significantly.",
    line3: "Document your achievements — this is the time to build your résumé.",
  },
  "紫微_化科": {
    starName: "紫微",
    transformation: "化科",
    line1: "The Emperor's presence earns recognition through quiet authority.",
    line2: "People notice your standards, depth, and integrity before you speak.",
    line3: "Invest in how you present yourself — reputation compounds over time.",
  },
  "文昌_化科": {
    starName: "文昌",
    transformation: "化科",
    line1: "The Scholar's gift shines — academic and written excellence is amplified.",
    line2: "Exams, credentials, and intellectual output are strongly favoured now.",
    line3: "Pursue certificates, publish, or study — your mind is at peak performance.",
  },
  "天機_化科": {
    starName: "天機",
    transformation: "化科",
    line1: "The Strategist's sharp mind gains recognition for intelligence and adaptability.",
    line2: "Others acknowledge your thinking ability — ideas become reputation.",
    line3: "Share your insights publicly — your analytical edge is now your brand.",
  },
  "右弼_化科": {
    starName: "右弼",
    transformation: "化科",
    line1: "Your supportive, resource-attracting energy gains graceful recognition.",
    line2: "Quiet backing and behind-the-scenes talent are finally noticed.",
    line3: "Let others see what you contribute — your work deserves its credit.",
  },
  "天梁_化科": {
    starName: "天梁",
    transformation: "化科",
    line1: "The Elder's wisdom earns a respected, refined public reputation.",
    line2: "Your experience and judgment are formally acknowledged by peers.",
    line3: "Seek mentorship roles or titles — your authority gains official weight.",
  },
  "太陰_化科": {
    starName: "太陰",
    transformation: "化科",
    line1: "The Moon's quiet depth earns elegant, understated recognition.",
    line2: "Your emotional intelligence and subtlety are seen as rare and valued.",
    line3: "Let your sensitivity be a strength — refinement is your calling card.",
  },
  "文曲_化科": {
    starName: "文曲",
    transformation: "化科",
    line1: "The Artist's creative expression gains recognition and emotional resonance.",
    line2: "Creative and artistic talent earns appreciation, awards, or visibility.",
    line3: "Put your art or craft out into the world — your expression has reach now.",
  },
  "左輔_化科": {
    starName: "左輔",
    transformation: "化科",
    line1: "Your collaborative support energy generates auspicious recognition.",
    line2: "Being the dependable helper brings unexpected rewards and praise.",
    line3: "Be the person who shows up — your reliability becomes reputation.",
  },

  // ────────────────────────────────────────────────────────────
  // 化忌 (10 stars)
  // ────────────────────────────────────────────────────────────

  "太陽_化忌": {
    starName: "太陽",
    transformation: "化忌",
    line1: "Your generosity and outward giving are creating a slow drain.",
    line2: "You may be over-giving in public roles while neglecting your own reserves.",
    line3: "Set limits on what you give freely — protect your own energy first.",
  },
  "太陰_化忌": {
    starName: "太陰",
    transformation: "化忌",
    line1: "The Moon's emotional sensitivity becomes a source of inner turbulence.",
    line2: "Emotional wounds, financial anxieties, or hidden worries surface now.",
    line3: "Tend your inner world carefully — what's unprocessed will demand attention.",
  },
  "廉貞_化忌": {
    starName: "廉貞",
    transformation: "化忌",
    line1: "Your passionate intensity creates friction, risk of obsession or excess.",
    line2: "Unchecked desire leads to poor decisions, scandals, or legal entanglements.",
    line3: "Pause before acting on impulse — restraint now is protection.",
  },
  "巨門_化忌": {
    starName: "巨門",
    transformation: "化忌",
    line1: "The Gate's investigative energy turns inward as misunderstanding and conflict.",
    line2: "Communication breaks down — gossip, disputes, or reputation damage lurks.",
    line3: "Choose your words with precision — assumptions cause unnecessary battles.",
  },
  "天機_化忌": {
    starName: "天機",
    transformation: "化忌",
    line1: "The Strategist's adaptable mind gets stuck in anxiety and overthinking loops.",
    line2: "Plans shift too rapidly or collapse — indecision becomes a trap.",
    line3: "Slow down your mental chatter — one solid plan beats ten half-formed ones.",
  },
  "文曲_化忌": {
    starName: "文曲",
    transformation: "化忌",
    line1: "Creative and emotional expression encounter blocks and misinterpretation.",
    line2: "Artistic efforts fall flat or emotional outbursts damage key relationships.",
    line3: "Process feelings before expressing them — timing matters as much as content.",
  },
  "天同_化忌": {
    starName: "天同",
    transformation: "化忌",
    line1: "The Idealist's peace-seeking nature becomes passive avoidance of problems.",
    line2: "Comfort-seeking leads to neglecting real responsibilities or opportunities.",
    line3: "Step out of comfort zones deliberately — ease here is a trap, not a reward.",
  },
  "文昌_化忌": {
    starName: "文昌",
    transformation: "化忌",
    line1: "The Scholar's sharp expression turns into errors, failed exams, or miscommunication.",
    line2: "Written contracts, documentation, and academic pursuits carry hidden risks.",
    line3: "Review everything twice before signing or submitting — details matter critically.",
  },
  "武曲_化忌": {
    starName: "武曲",
    transformation: "化忌",
    line1: "The General's financial precision meets friction, loss, or blocked resources.",
    line2: "Money decisions face obstacles — investments, deals, or cash flow hit walls.",
    line3: "Hold financial decisions under scrutiny — this is not the time for big bets.",
  },
  "貪狼_化忌": {
    starName: "貪狼",
    transformation: "化忌",
    line1: "The Wolf's desire energy turns obsessive, scattered, or self-destructive.",
    line2: "Chasing too many things — or the wrong things — creates waste and regret.",
    line3: "Name your true desire and focus there — dissipation is your only real enemy.",
  },
};
