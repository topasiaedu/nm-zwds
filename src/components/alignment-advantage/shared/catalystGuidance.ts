/** Core-triad catalyst activation with palace context for Ch01 guidance. */
export type CoreTriadPalace = "命宫" | "财帛" | "官禄";

export type CatalystKind = "lu" | "quan" | "ke" | "ji";

export interface CoreCatalystActivation {
  kind: CatalystKind;
  palace: CoreTriadPalace;
  starName: string;
}

export interface CatalystActionBrief {
  title: string;
  zoneLabel: string;
  directive: string;
  moves: [string, string];
}

const CORE_PALACE_LABELS: Record<CoreTriadPalace, string> = {
  "命宫": "Personal brand",
  "财帛": "Money & resources",
  "官禄": "Career & business",
};

const CATALYST_TILE_LABELS: Record<CatalystKind, { short: string; headline: string }> = {
  lu: { short: "Resource Magnet", headline: "Flow & Expansion" },
  quan: { short: "Command & Control", headline: "Authority & Scale" },
  ke: { short: "Influence", headline: "Reputation & Brand" },
  ji: { short: "Obsessive Focus", headline: "Friction & Mastery" },
};

/** Maps simplified or traditional transformation strings to a catalyst kind. */
export function normalizeCatalystKind(transformation: string): CatalystKind | null {
  if (transformation === "化禄" || transformation === "化祿") return "lu";
  if (transformation === "化权" || transformation === "化權") return "quan";
  if (transformation === "化科") return "ke";
  if (transformation === "化忌") return "ji";
  return null;
}

/** Palace-specific business guidance for each catalyst in the core triad. */
const CATALYST_PALACE_BRIEFS: Record<CatalystKind, Record<CoreTriadPalace, CatalystActionBrief>> = {
  lu: {
    "命宫": {
      title: "Resource Magnet",
      zoneLabel: CORE_PALACE_LABELS["命宫"],
      directive: "People warm to you personally right now. Deals and introductions follow when you show up as yourself.",
      moves: [
        "Accept networking invites, but cap unpaid favours so generosity does not drain you",
        "Lead with value in conversations before you ask for anything back",
      ],
    },
    "财帛": {
      title: "Resource Magnet",
      zoneLabel: CORE_PALACE_LABELS["财帛"],
      directive: "Money comes in more easily when you stay visible and price with confidence.",
      moves: [
        "Review pricing, add a premium tier, or ask happy clients for referrals this quarter",
        "Build a 3-month cash buffer before you spend on expansion",
      ],
    },
    "官禄": {
      title: "Resource Magnet",
      zoneLabel: CORE_PALACE_LABELS["官禄"],
      directive: "Work pays you back faster now. Sponsors, stretch projects, and visible wins find you.",
      moves: [
        "Pitch for the lead role or high-visibility project while support is available",
        "Track results weekly so others can vouch for you when opportunities open",
      ],
    },
  },
  quan: {
    "命宫": {
      title: "Command & Control",
      zoneLabel: CORE_PALACE_LABELS["命宫"],
      directive: "Others look to you to decide. Your yes and no carry real weight in the room.",
      moves: [
        "Take the chair on decisions that have been stalling; do not defer when people wait on you",
        "Write who owns what so authority does not turn into doing everyone else's job",
      ],
    },
    "财帛": {
      title: "Command & Control",
      zoneLabel: CORE_PALACE_LABELS["财帛"],
      directive: "You have leverage over budgets and terms. Good time to restructure how money moves.",
      moves: [
        "Cut low-return spending and redirect budget toward what already produces",
        "Set deposits, payment milestones, and late fees before starting new work",
      ],
    },
    "官禄": {
      title: "Command & Control",
      zoneLabel: CORE_PALACE_LABELS["官禄"],
      directive: "Your professional authority is up. Promotions, chair roles, and green lights land on you.",
      moves: [
        "Put your name forward for the lead seat and state the outcome you will deliver",
        "Cap your scope in writing so more authority does not become unlimited workload",
      ],
    },
  },
  ke: {
    "命宫": {
      title: "Influence",
      zoneLabel: CORE_PALACE_LABELS["命宫"],
      directive: "Your personal name opens doors before the pitch. Trust follows you in the room.",
      moves: [
        "Show up publicly: talks, content, panels, or credentials that people can find",
        "Treat every public promise as part of your brand; one broken word costs more than usual",
      ],
    },
    "财帛": {
      title: "Influence",
      zoneLabel: CORE_PALACE_LABELS["财帛"],
      directive: "Clients pay for your reputation, not just the deliverable. Your name is part of the product.",
      moves: [
        "Package offers with proof: case studies, testimonials, or certifications",
        "Stop underpricing; charge for the trust people already place in you",
      ],
    },
    "官禄": {
      title: "Influence",
      zoneLabel: CORE_PALACE_LABELS["官禄"],
      directive: "Your professional reputation is working for you. Being visible builds the business.",
      moves: [
        "Be the face of your company: media, awards, flagship client stories, or industry presence",
        "Invest in one reputation move this quarter instead of staying invisible behind the team",
      ],
    },
  },
  ji: {
    "命宫": {
      title: "Obsessive Focus",
      zoneLabel: CORE_PALACE_LABELS["命宫"],
      directive: "One personal issue keeps pulling your attention. It can drain you or sharpen you if you handle it.",
      moves: [
        "Name the problem you keep circling; either schedule time to fix it or decide to drop it",
        "Do not let one worry eat all your mental bandwidth; set a weekly time box for it",
      ],
    },
    "财帛": {
      title: "Obsessive Focus",
      zoneLabel: CORE_PALACE_LABELS["财帛"],
      directive: "A money knot needs attention. Ignoring it will cost more than facing it.",
      moves: [
        "Audit the account or client that keeps leaking; tighten contracts and follow up on payments",
        "Avoid signing or spending under pressure; sleep on big financial calls",
      ],
    },
    "官禄": {
      title: "Obsessive Focus",
      zoneLabel: CORE_PALACE_LABELS["官禄"],
      directive: "Work friction is loud right now. The hard problem can become mastery if you give it a finish line.",
      moves: [
        "Turn the toughest work issue into a dedicated project with a clear deadline and owner",
        "Put roles and expectations in writing; most fights here come from unspoken assumptions",
      ],
    },
  },
};

export function getCatalystTileLabel(kind: CatalystKind): { short: string; headline: string } {
  return CATALYST_TILE_LABELS[kind];
}

export function getCatalystActionBrief(activation: CoreCatalystActivation): CatalystActionBrief {
  return CATALYST_PALACE_BRIEFS[activation.kind][activation.palace];
}

/** Builds activations from Life, Wealth, and Career palace stars. */
export function buildCoreCatalystActivations(
  palaces: ReadonlyArray<{ name: string; mainStar?: ReadonlyArray<{ name: string; transformations?: string[] }>; minorStars?: ReadonlyArray<{ name: string; transformations?: string[] }> }>,
): CoreCatalystActivation[] {
  const results: CoreCatalystActivation[] = [];
  const coreNames: CoreTriadPalace[] = ["命宫", "财帛", "官禄"];

  for (const palace of palaces) {
    if (!coreNames.includes(palace.name as CoreTriadPalace)) continue;
    const palaceKey = palace.name as CoreTriadPalace;
    const stars = [...(palace.mainStar ?? []), ...(palace.minorStars ?? [])];

    for (const star of stars) {
      for (const transformation of star.transformations ?? []) {
        const kind = normalizeCatalystKind(transformation);
        if (kind !== null) {
          results.push({ kind, palace: palaceKey, starName: star.name });
        }
      }
    }
  }

  return results;
}
