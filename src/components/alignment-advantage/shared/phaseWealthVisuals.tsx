import React from "react";
import { C } from "./constants";
import type { PhaseAlignmentSeasonKey } from "../../../utils/forecast/wealthContentData";

/** Two circles intersecting — timing meets wealth archetype. */
export const PhaseIntersectionSvg: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" aria-hidden="true">
    <circle cx="44" cy="60" r="32" stroke={C.navy} strokeWidth="1.5" fill={`${C.navy}08`} />
    <circle cx="76" cy="60" r="32" stroke={C.coral} strokeWidth="1.5" fill={`${C.coral}10`} />
    <path
      d="M60 36 Q68 60 60 84 Q52 60 60 36 Z"
      fill={C.gold}
      fillOpacity="0.35"
      stroke={C.gold}
      strokeWidth="1"
    />
    <circle cx="60" cy="60" r="4" fill={C.coral} fillOpacity="0.85" />
  </svg>
);

/** Season-specific phase illustration for the active cycle. */
export const SeasonPhaseSvg: React.FC<{
  season: PhaseAlignmentSeasonKey | string;
  className?: string;
}> = ({ season, className = "w-full h-full" }) => {
  if (season === "expansion" || season === "spring") {
    return (
      <svg className={className} viewBox="0 0 120 120" fill="none" aria-hidden="true">
        <path d="M60 96 V44" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
        <path d="M60 44 Q44 56 38 72" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M60 44 Q76 56 82 72" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="60" cy="36" r="8" fill="#16a34a" fillOpacity="0.25" stroke="#16a34a" strokeWidth="1.5" />
        <path d="M24 96 H96" stroke={C.border} strokeWidth="1" />
      </svg>
    );
  }
  if (season === "visibility" || season === "summer") {
    return (
      <svg className={className} viewBox="0 0 120 120" fill="none" aria-hidden="true">
        <circle cx="60" cy="52" r="20" stroke={C.coral} strokeWidth="1.5" fill={`${C.coral}15`} />
        <path d="M60 20 V32 M60 72 V84 M28 52 H40 M80 52 H92" stroke={C.coral} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M36 28 L44 36 M84 28 L76 36 M36 76 L44 68 M84 76 L76 68" stroke={C.coral} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
        <path d="M32 96 Q60 78 88 96" stroke={C.navy} strokeWidth="1.5" strokeOpacity="0.35" />
      </svg>
    );
  }
  if (season === "consolidation" || season === "autumn") {
    return (
      <svg className={className} viewBox="0 0 120 120" fill="none" aria-hidden="true">
        <rect x="28" y="68" width="18" height="22" rx="2" stroke="#d97706" strokeWidth="1.5" fill={`#d9770615`} />
        <rect x="42" y="58" width="18" height="32" rx="2" stroke="#d97706" strokeWidth="1.5" fill={`#d9770622`} />
        <rect x="56" y="48" width="18" height="42" rx="2" stroke="#d97706" strokeWidth="1.5" fill={`#d9770630`} />
        <rect x="70" y="38" width="18" height="52" rx="2" stroke={C.navy} strokeWidth="1.5" fill={`${C.navy}10`} />
        <path d="M24 90 H96" stroke={C.border} strokeWidth="1" />
        <path d="M34 62 L86 42" stroke="#d97706" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.5" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <rect x="30" y="72" width="60" height="16" rx="2" stroke="#2563eb" strokeWidth="1.5" fill={`#2563eb12`} />
      <rect x="38" y="56" width="44" height="16" rx="2" stroke="#2563eb" strokeWidth="1.5" fill={`#2563eb18`} />
      <rect x="46" y="40" width="28" height="16" rx="2" stroke="#2563eb" strokeWidth="1.5" fill={`#2563eb22`} />
      <path d="M24 88 H96" stroke={C.border} strokeWidth="1" strokeDasharray="4 4" />
    </svg>
  );
};

/** Checklist / action steps motif. */
export const PhaseActionsSvg: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg className={className} viewBox="0 0 80 80" fill="none" aria-hidden="true">
    <rect x="12" y="16" width="56" height="48" rx="4" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
    <path d="M22 30 L28 36 L40 24" stroke={C.coral} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="46" y1="30" x2="60" y2="30" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M22 44 L28 50 L40 38" stroke={C.coral} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" />
    <line x1="46" y1="44" x2="60" y2="44" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="24" cy="58" r="3" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
    <line x1="46" y1="58" x2="60" y2="58" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/** Shield / guard motif for risk mitigation. */
export const RiskShieldSvg: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M24 6 L38 12 V24 C38 32 32 38 24 42 C16 38 10 32 10 24 V12 Z" stroke={C.coral} strokeWidth="1.5" fill={`${C.coral}12`} />
    <path d="M18 24 L22 28 L30 20" stroke={C.coral} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Fork / alternate route motif. */
export const AltPathSvg: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M24 40 V22" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M24 22 Q14 18 10 10" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M24 22 Q34 18 38 10" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="10" cy="10" r="3" fill={C.gold} fillOpacity="0.35" />
    <circle cx="38" cy="10" r="3" fill={C.gold} fillOpacity="0.35" />
  </svg>
);

export const PHASE_LABELS: Record<PhaseAlignmentSeasonKey, string> = {
  expansion: "Expansion",
  visibility: "Visibility",
  consolidation: "Consolidation",
  foundation: "Foundation",
};

export function resolvePhaseKey(season: string | null | undefined): PhaseAlignmentSeasonKey {
  const map: Record<string, PhaseAlignmentSeasonKey> = {
    spring: "expansion",
    summer: "visibility",
    autumn: "consolidation",
    winter: "foundation",
  };
  if (season !== null && season !== undefined && map[season] !== undefined) {
    return map[season];
  }
  return "expansion";
}
