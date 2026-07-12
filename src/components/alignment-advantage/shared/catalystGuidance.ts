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
      directive: "People like you right now. Deals and introductions happen easily when you just show up.",
      moves: [
        "Say yes to networking invites, but stop doing free favors for people who don't pay you",
        "Ask for what you want directly. People are ready to say yes",
      ],
    },
    "财帛": {
      title: "Resource Magnet",
      zoneLabel: CORE_PALACE_LABELS["财帛"],
      directive: "Money is flowing easily. Stop undercharging and start asking for what you are worth.",
      moves: [
        "Raise your prices today, or ask your boss for a bonus",
        "Call your three best clients and ask them for a direct referral",
      ],
    },
    "官禄": {
      title: "Resource Magnet",
      zoneLabel: CORE_PALACE_LABELS["官禄"],
      directive: "Your work is getting noticed. This is the time to ask for a promotion or pitch a big project.",
      moves: [
        "Ask for the lead role on a project. Your boss or clients are ready to support you",
        "Write down your recent wins and make sure the right people see them",
      ],
    },
  },
  quan: {
    "命宫": {
      title: "Command & Control",
      zoneLabel: CORE_PALACE_LABELS["命宫"],
      directive: "People are waiting for you to lead. Stop asking for permission and start giving orders.",
      moves: [
        "Make the decision that everyone else is avoiding. Stop deferring to others",
        "Put your boundaries in writing so you don't end up doing everyone else's job",
      ],
    },
    "财帛": {
      title: "Command & Control",
      zoneLabel: CORE_PALACE_LABELS["财帛"],
      directive: "You have the power to negotiate. Dictate the terms and control how the money moves.",
      moves: [
        "Cut expenses that don't make you money. Be ruthless with your budget",
        "Demand deposits and set strict late fees before you start any new work",
      ],
    },
    "官禄": {
      title: "Command & Control",
      zoneLabel: CORE_PALACE_LABELS["官禄"],
      directive: "You have real authority at work right now. Use it to take control of your career.",
      moves: [
        "Tell your boss exactly what you want to be in charge of, and take ownership of the results",
        "Say no to tasks that are below your pay grade. Protect your time",
      ],
    },
  },
  ke: {
    "命宫": {
      title: "Influence",
      zoneLabel: CORE_PALACE_LABELS["命宫"],
      directive: "Your reputation precedes you. People trust you before you even open your mouth.",
      moves: [
        "Get on a stage, write an article, or post online. Let people see your expertise",
        "Do exactly what you promised to do. A broken promise right now will ruin your reputation",
      ],
    },
    "财帛": {
      title: "Influence",
      zoneLabel: CORE_PALACE_LABELS["财帛"],
      directive: "People are paying for your name, not just your work. Charge for the trust you have built.",
      moves: [
        "Stop competing on price. Show them your testimonials and charge a premium",
        "Make sure your LinkedIn or website looks as expensive as the fees you want to charge",
      ],
    },
    "官禄": {
      title: "Influence",
      zoneLabel: CORE_PALACE_LABELS["官禄"],
      directive: "Your brand is your biggest asset at work. Being visible is more important than working late.",
      moves: [
        "Stop hiding behind your team. Make sure your name is on the final presentation",
        "Apply for an industry award or speak at a conference. Build your public resume",
      ],
    },
  },
  ji: {
    "命宫": {
      title: "Obsessive Focus",
      zoneLabel: CORE_PALACE_LABELS["命宫"],
      directive: "You are overthinking a personal problem. Fix it today, or drop it completely.",
      moves: [
        "Name the thing that is stressing you out. Give yourself one hour to solve it, then move on",
        "Stop letting one bad interaction ruin your entire week",
      ],
    },
    "财帛": {
      title: "Obsessive Focus",
      zoneLabel: CORE_PALACE_LABELS["财帛"],
      directive: "You are stressing about money. Stop worrying and start looking at the actual numbers.",
      moves: [
        "Log into your bank account and look at exactly where your money is going. Stop guessing",
        "Do not make a huge financial decision today. Sleep on it for 48 hours",
      ],
    },
    "官禄": {
      title: "Obsessive Focus",
      zoneLabel: CORE_PALACE_LABELS["官禄"],
      directive: "Work is frustrating right now. Turn that frustration into a project and just finish it.",
      moves: [
        "Take the hardest task on your desk and finish it today. Stop procrastinating",
        "If you are fighting with a coworker, put the rules in writing. Stop arguing over unspoken assumptions",
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
