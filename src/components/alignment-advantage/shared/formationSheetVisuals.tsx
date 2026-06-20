import React from "react";
import { C } from "./constants";
import type { FormationProfile } from "../../../utils/forecast/structure/formationProfiles";
import type { SpecialFormationKey, FormationKey } from "../../../utils/zwds/analysis/structureAnalysis";
import { firstSentences } from "./textHelpers";

/** Executive brief derived from formation profile — terse, action-oriented. */
export interface FormationExecutiveBrief {
  directive: string;
  moves: [string, string];
}

const FORMATION_EXECUTIVE_BRIEFS: Partial<
  Record<FormationKey | SpecialFormationKey, FormationExecutiveBrief>
> = {
  powerCommander: {
    directive: "You are built for bold moves and fresh starts. Playing it safe for too long will stall you.",
    moves: [
      "If you see a real opening to win within the next 12 months, act now instead of waiting for perfect timing",
      "Pick projects where you replace the old way of doing things, not small tweaks to what already exists",
    ],
  },
  bigLandlord: {
    directive: "You grow by owning more: property, businesses, or assets under your control, not by going deeper into one narrow lane.",
    moves: [
      "Look for deals where you buy, acquire, or take a controlling stake in something tangible",
      "It is okay to run several ventures at once; spreading ownership fits you better than all-in on one bet",
    ],
  },
  riskyTrading: {
    directive: "You earn through active buying, selling, and deal-making. Sitting on one long hold with no action will underperform.",
    moves: [
      "Keep several smaller deals in play so wins in one area can cover losses in another",
      "Move when the market or demand is shifting; that timing window is where you make money",
    ],
  },
  tripletalent: {
    directive: "You win by becoming the go-to expert in one field and staying there for years.",
    moves: [
      "Choose one industry or skill and build a reputation as the person people call first",
      "Say no to side projects that pull you away from the main lane where your name should be known",
    ],
  },
  nobleSupport: {
    directive: "Your edge is people: mentors, backers, and partners who open doors for you.",
    moves: [
      "Before you commit to a big move, confirm you have someone credible backing or introducing you",
      "Spend real time on relationships and referrals; that network is how opportunities reach you",
    ],
  },
  wealthSupport: {
    directive: "You do well when you protect steady income and let supporters help you compound what already works.",
    moves: [
      "Build systems and income that keep running even when you are not pushing every day",
      "Favor stable, low-drama deals over flashy bets that could unsettle what you already have",
    ],
  },
  wealthStabilization: {
    directive: "You make money by making what you already have run better, not by chasing risky new bets.",
    moves: [
      "Before launching anything new, cut waste and tighten how your current business operates",
      "Track success by steady gains over the next 1–2 years, not by hunting for one big overnight win",
    ],
  },
  steadyPillar: {
    directive: "You outperform when you plan carefully and deliver reliably, not when you react to chaos.",
    moves: [
      "Choose work with clear structure and predictable steps, not constant firefighting",
      "Sell your strength as someone who thinks things through and follows through, not the fastest mover in the room",
    ],
  },
  hiddenJade: {
    directive: "Your results often arrive later, but they tend to last if you stay through the hard early stretch.",
    moves: [
      "Pick roles where being sharp and clear-minded matters more than looking impressive on day one",
      "Do not abandon the path in year one because progress feels slow; your payoff often comes after that",
    ],
  },
  reversedSunMoon: {
    directive: "You work best on flexible hours, overseas clients, or cross-timezone setups, not a rigid 9-to-5 desk routine.",
    moves: [
      "Target international markets, remote work, or schedules you can set yourself",
      "Turn down roles that lock you into fixed office hours if your best output happens at other times",
    ],
  },
  starlessDestiny: {
    directive: "You thrive when you step away from hometown comfort and build on your own, without leaning on family or old connections.",
    moves: [
      "Look seriously at opportunities in a new city, country, or market where you start with a clean slate",
      "Choose work where you prove yourself from zero; inherited name or local ties will not carry you here",
    ],
  },
};

/** Plain-language fallback when no formation-specific brief exists. */
function buildFallbackBrief(profile: FormationProfile): FormationExecutiveBrief {
  const directive = firstSentences(profile.tagline, 1)
    .replace(/^You are designed for /i, "You do best when ")
    .replace(/^You are built for /i, "You do best when ")
    .replace(/^You are naturally /i, "You are ")
    .replace(/^You are /i, "You ");

  return {
    directive,
    moves: [
      firstSentences(profile.greenFlags[0], 1),
      firstSentences(profile.greenFlags[1], 1),
    ],
  };
}

export function getFormationExecutiveBrief(
  profile: FormationProfile,
  formationKey?: FormationKey | SpecialFormationKey | string,
): FormationExecutiveBrief {
  if (formationKey !== undefined) {
    const override = FORMATION_EXECUTIVE_BRIEFS[formationKey as FormationKey | SpecialFormationKey];
    if (override !== undefined) return override;
  }

  return buildFallbackBrief(profile);
}

export function getPlayerTypeDirective(_description: string, isSpeed: boolean): string {
  if (isSpeed) {
    return "You win by moving quickly on opportunities before others do. Waiting too long or playing it too safe will cost you.";
  }
  return "You win by sticking with one direction and improving it over time. Chasing every new trend will dilute your results.";
}

/** Speed player: radiating momentum arcs. */
export const SpeedPlayerSvg: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" aria-hidden="true">
    <circle cx="60" cy="60" r="52" stroke={C.coral} strokeWidth="1" strokeOpacity="0.25" />
    <circle cx="60" cy="60" r="36" stroke={C.coral} strokeWidth="1.5" strokeOpacity="0.4" />
    <path d="M60 24 L60 48 M60 72 L60 96 M24 60 L48 60 M72 60 L96 60" stroke={C.coral} strokeWidth="2" strokeLinecap="round" />
    <path d="M38 38 L52 52 M82 38 L68 52 M38 82 L52 68 M82 82 L68 68" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
    <circle cx="60" cy="60" r="8" fill={C.coral} fillOpacity="0.85" />
  </svg>
);

/** Endurance player: compounding steps ascending. */
export const EndurancePlayerSvg: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" aria-hidden="true">
    <rect x="18" y="78" width="22" height="18" rx="2" fill={`${C.navy}15`} stroke={C.navy} strokeWidth="1.5" />
    <rect x="38" y="62" width="22" height="34" rx="2" fill={`${C.navy}22`} stroke={C.navy} strokeWidth="1.5" />
    <rect x="58" y="46" width="22" height="50" rx="2" fill={`${C.gold}25`} stroke={C.gold} strokeWidth="1.5" />
    <rect x="78" y="30" width="22" height="66" rx="2" fill={`${C.coral}18`} stroke={C.coral} strokeWidth="1.5" />
    <path d="M22 96 H98" stroke={C.border} strokeWidth="1" strokeDasharray="4 4" />
    <path d="M28 72 L52 56 L72 40 L92 26" stroke={C.coral} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 5" strokeOpacity="0.6" />
  </svg>
);

/** Wealth stabilization: fortress / compound vault. */
const WealthStabilizationSvg: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" aria-hidden="true">
    <path d="M30 88 V52 L60 28 L90 52 V88 Z" stroke={C.navy} strokeWidth="2" fill={`${C.navy}08`} />
    <rect x="48" y="68" width="24" height="20" rx="2" stroke={C.gold} strokeWidth="1.5" fill={`${C.gold}15`} />
    <path d="M42 52 H78" stroke={C.navy} strokeWidth="1" strokeOpacity="0.3" />
    <path d="M38 64 H82" stroke={C.navy} strokeWidth="1" strokeOpacity="0.3" />
    <circle cx="60" cy="78" r="4" fill={C.gold} fillOpacity="0.6" />
  </svg>
);

/** Starless destiny: horizon path leaving origin. */
const StarlessDestinySvg: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" aria-hidden="true">
    <circle cx="28" cy="82" r="10" stroke={C.coral} strokeWidth="1.5" fill={`${C.coral}12`} />
    <path d="M38 76 Q70 60 92 38" stroke={C.coral} strokeWidth="2" strokeLinecap="round" strokeDasharray="6 4" />
    <path d="M88 32 L96 40 M96 40 L88 48" stroke={C.coral} strokeWidth="2" strokeLinecap="round" />
    <circle cx="94" cy="36" r="6" fill={C.coral} fillOpacity="0.25" stroke={C.coral} strokeWidth="1" />
    <path d="M16 96 H104" stroke={C.border} strokeWidth="1" />
  </svg>
);

/** Power commander: breakthrough arrow. */
const PowerCommanderSvg: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" aria-hidden="true">
    <rect x="22" y="40" width="8" height="48" rx="1" fill={`${C.navy}20`} />
    <path d="M42 64 H88 L72 48 M88 64 L72 80" stroke={C.coral} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Generic endurance formation: layered shield rings. */
const EnduranceFormationSvg: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" aria-hidden="true">
    <ellipse cx="60" cy="62" rx="40" ry="36" stroke={C.navy} strokeWidth="1.5" fill={`${C.navy}06`} />
    <ellipse cx="60" cy="62" rx="28" ry="24" stroke={C.gold} strokeWidth="1.5" fill={`${C.gold}10`} />
    <ellipse cx="60" cy="62" rx="14" ry="12" stroke={C.coral} strokeWidth="1.5" fill={`${C.coral}12`} />
  </svg>
);

/** Generic speed formation: burst star. */
const SpeedFormationSvg: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" aria-hidden="true">
    <path d="M60 20 L66 48 L94 48 L72 64 L80 92 L60 76 L40 92 L48 64 L26 48 L54 48 Z" stroke={C.coral} strokeWidth="1.5" fill={`${C.coral}12`} />
  </svg>
);

/** Generic special formation: twin orbit nodes. */
const SpecialFormationSvg: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" aria-hidden="true">
    <ellipse cx="60" cy="60" rx="44" ry="20" stroke={C.navy} strokeWidth="1" strokeOpacity="0.35" transform="rotate(-24 60 60)" />
    <circle cx="38" cy="52" r="10" fill={`${C.coral}20`} stroke={C.coral} strokeWidth="1.5" />
    <circle cx="82" cy="68" r="10" fill={`${C.navy}15`} stroke={C.navy} strokeWidth="1.5" />
  </svg>
);

const FORMATION_ILLUSTRATIONS: Partial<Record<FormationKey | SpecialFormationKey, React.FC<{ className?: string }>>> = {
  wealthStabilization: WealthStabilizationSvg,
  starlessDestiny: StarlessDestinySvg,
  powerCommander: PowerCommanderSvg,
  tripletalent: EnduranceFormationSvg,
  nobleSupport: EnduranceFormationSvg,
  wealthSupport: WealthStabilizationSvg,
  bigLandlord: EnduranceFormationSvg,
  riskyTrading: SpeedFormationSvg,
  steadyPillar: SpecialFormationSvg,
  hiddenJade: SpecialFormationSvg,
  reversedSunMoon: SpecialFormationSvg,
};

export const FormationIllustration: React.FC<{
  formationKey?: FormationKey | SpecialFormationKey | string;
  playerType?: "speed" | "endurance" | "special";
  className?: string;
}> = ({ formationKey, playerType = "endurance", className = "w-full h-full" }) => {
  if (formationKey !== undefined) {
    const Specific = FORMATION_ILLUSTRATIONS[formationKey as FormationKey | SpecialFormationKey];
    if (Specific !== undefined) {
      return <Specific className={className} />;
    }
  }
  if (playerType === "speed") return <SpeedFormationSvg className={className} />;
  if (playerType === "special") return <SpecialFormationSvg className={className} />;
  return <EnduranceFormationSvg className={className} />;
};
