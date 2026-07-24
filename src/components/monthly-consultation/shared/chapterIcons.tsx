/**
 * Soft illustration icons and mid-chapter accents for Monthly Consultation.
 */

import React from "react";
import { C } from "../../alignment-advantage/shared/constants";

export type ChapterIconKind =
  | "cover"
  | "rarity"
  | "activations"
  | "stars"
  | "convergence"
  | "archetype"
  | "scorecard"
  | "career"
  | "wealth"
  | "relationships"
  | "health"
  | "weeks"
  | "failure"
  | "scripts"
  | "decisions"
  | "nobleman"
  | "actions"
  | "continuity"
  | "letter";

/** Illustration variants used inside chapter content (not background). */
export type ChapterIllustrationKind =
  | "convergence-ring"
  | "area-icon"
  | "week-timeline";

/** Scorecard / aspect area keys for area-icon illustrations. */
export type AreaIconKind = "career" | "wealth" | "relationships" | "health";

const paths: Record<ChapterIconKind, React.ReactNode> = {
  cover: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 3v18M3 12h18M7 7l10 10M17 7L7 17" />
  ),
  rarity: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 2l2.2 6.8H21l-5.5 4 2.1 6.7L12 15.8 6.4 19.5l2.1-6.7L3 8.8h6.8L12 2z" />
  ),
  activations: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
  ),
  stars: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 3l1.8 5.5H19l-4.4 3.2 1.7 5.3L12 14.8 7.7 17l1.7-5.3L5 8.5h5.2L12 3z" />
  ),
  convergence: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M4 6h16M4 12h10M4 18h7M18 10v8m0 0l-3-3m3 3l3-3" />
  ),
  archetype: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 21a9 9 0 100-18 9 9 0 000 18zm0-14v5l3 2" />
  ),
  scorecard: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M4 19V5m0 14h16M8 17V9m4 8V7m4 10v-6" />
  ),
  career: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M4 7h16v12H4V7zm4-3h8v3H8V4z" />
  ),
  wealth: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 3v18m-6-4a6 6 0 0112 0M8 9a4 4 0 018 0" />
  ),
  relationships: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M16 11a4 4 0 10-8 0 4 4 0 008 0zM4 20a6 6 0 0116 0" />
  ),
  health: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 21s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.5-7 10-7 10z" />
  ),
  weeks: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M8 7V3m8 4V3M5 11h14M6 5h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2z" />
  ),
  failure: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 9v4m0 4h.01M10.3 4.3L3.6 18a2 2 0 001.7 3h13.4a2 2 0 001.7-3L13.7 4.3a2 2 0 00-3.4 0z" />
  ),
  scripts: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M8 10h8M8 14h5M7 4h10a2 2 0 012 2v14l-4-2-4 2-4-2-4 2V6a2 2 0 012-2z" />
  ),
  decisions: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  ),
  nobleman: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  ),
  actions: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M5 13l4 4L19 7" />
  ),
  continuity: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M8 7V3m8 4V3M5 11h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  ),
  letter: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  ),
};

/**
 * Clamp a numeric score into the inclusive 0–100 range for ring rendering.
 */
const clampScore = (score: number): number => Math.max(0, Math.min(100, score));

/**
 * SVG donut ring for convergence score display.
 */
const ConvergenceScoreRing: React.FC<{ score: number; label: string }> = ({ score, label }) => {
  const clamped = clampScore(score);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative w-36 h-36 shrink-0 mx-auto sm:mx-0">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90" aria-hidden="true">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={`${C.border}`}
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={C.coral}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={String(circumference)}
          strokeDashoffset={String(dashOffset)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-3xl font-bold leading-none" style={{ color: C.navy }}>
          {String(clamped)}
        </p>
        <p className="text-[10px] mt-1 uppercase tracking-wider" style={{ color: C.muted }}>
          out of 100
        </p>
        <p className="text-xs font-semibold mt-1 px-2" style={{ color: C.coral }}>
          {label}
        </p>
      </div>
    </div>
  );
};

/** Small inline icon for scorecard area rows. */
const AreaIconSvg: React.FC<{ area: AreaIconKind }> = ({ area }) => {
  const size = 18;
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: C.coral, strokeWidth: 1.7 };

  if (area === "career") {
    return (
      <svg {...common} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16v12H4V7zm4-3h8v3H8V4z" />
      </svg>
    );
  }
  if (area === "wealth") {
    return (
      <svg {...common} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m-6-4a6 6 0 0112 0" />
      </svg>
    );
  }
  if (area === "relationships") {
    return (
      <svg {...common} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11a4 4 0 10-8 0M4 20a6 6 0 0116 0" />
      </svg>
    );
  }
  return (
    <svg {...common} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.5-7 10-7 10z" />
    </svg>
  );
};

/** Horizontal week ruler with W1–W4 markers. */
const WeekTimelineRuler: React.FC = () => (
  <div className="relative py-2" aria-hidden="true">
    <div className="h-px w-full" style={{ background: `${C.border}` }} />
    <div className="flex justify-between mt-2 px-1">
      {["W1", "W2", "W3", "W4"].map((week) => (
        <div key={week} className="flex flex-col items-center gap-1">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: C.coral, boxShadow: `0 0 0 3px ${C.coral}22` }}
          />
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: C.muted }}>
            {week}
          </span>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Mid-chapter accent illustrations (score ring, area icons, week timeline).
 */
export const ChapterIllustration: React.FC<{
  kind: ChapterIllustrationKind;
  score?: number;
  label?: string;
  area?: AreaIconKind;
}> = ({ kind, score = 0, label = "", area = "career" }) => {
  if (kind === "convergence-ring") {
    return <ConvergenceScoreRing score={score} label={label} />;
  }
  if (kind === "area-icon") {
    return <AreaIconSvg area={area} />;
  }
  if (kind === "week-timeline") {
    return <WeekTimelineRuler />;
  }
  return null;
};

/**
 * Soft circular chapter icon badge.
 */
export const ChapterIconBadge: React.FC<{ kind: ChapterIconKind; size?: number }> = ({
  kind,
  size = 56,
}) => (
  <div
    className="shrink-0 rounded-[18px] flex items-center justify-center"
    style={{
      width: size,
      height: size,
      background: `linear-gradient(145deg, ${C.coral}22, ${C.gold}33)`,
      border: `1px solid ${C.border}`,
      boxShadow: `0 8px 20px ${C.coral}14`,
    }}
    aria-hidden="true"
  >
    <svg
      fill="none"
      stroke={C.navy}
      viewBox="0 0 24 24"
      width={Math.round(size * 0.46)}
      height={Math.round(size * 0.46)}
    >
      {paths[kind]}
    </svg>
  </div>
);

/**
 * Soft decorative dots wash for warm page atmosphere.
 */
export const SoftAtmosphere: React.FC = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]"
  >
    <div
      className="absolute -top-16 -right-10 w-56 h-56 rounded-full opacity-40"
      style={{ background: `radial-gradient(circle, ${C.coral}33, transparent 70%)` }}
    />
    <div
      className="absolute -bottom-20 -left-12 w-64 h-64 rounded-full opacity-35"
      style={{ background: `radial-gradient(circle, ${C.gold}40, transparent 70%)` }}
    />
  </div>
);

/**
 * Small coral bullet used in tip lists (Sparkle-adjacent accent).
 */
export const TipBullet: React.FC = () => (
  <span
    aria-hidden="true"
    className="shrink-0 mt-1.5 inline-block w-1.5 h-1.5 rounded-full"
    style={{ background: C.coral }}
  />
);

export interface InlineSvgProps {
  size?: number;
  color?: string;
}

/**
 * Warning-triangle SVG used in Failure chapter banner.
 */
export const InlineSvgWarning: React.FC<InlineSvgProps> = ({
  size = 22,
  color = C.coral,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 9v4m0 4h.01M10.3 4.3L3.6 18a2 2 0 001.7 3h13.4a2 2 0 001.7-3L13.7 4.3a2 2 0 00-3.4 0z" />
  </svg>
);

/**
 * Flag SVG used for red-flag cards in Failure chapter.
 */
export const InlineSvgFlag: React.FC<InlineSvgProps> = ({
  size = 18,
  color = C.coral,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 21V4m0 0h10l-2 4 2 4H5" />
  </svg>
);

/** Week-quality icon variants for WeekTile banners. */
export type WeekQualityIconKind = "push" | "careful" | "steady";

/**
 * Map a week quality label to an icon kind.
 */
export const weekQualityIconKind = (quality: string): WeekQualityIconKind => {
  const q = quality.toLowerCase();
  if (q.includes("push") || q.includes("best")) {
    return "push";
  }
  if (q.includes("careful") || q.includes("prepare")) {
    return "careful";
  }
  return "steady";
};

/**
 * Small white-on-banner SVG for week quality (arrow up / shield / arrow right).
 */
export const InlineSvgWeekQuality: React.FC<{
  kind: WeekQualityIconKind;
  size?: number;
  color?: string;
}> = ({ kind, size = 14, color = "#ffffff" }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: color,
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };
  if (kind === "push") {
    return (
      <svg {...common}>
        <path d="M12 19V5M7 10l5-5 5 5" />
      </svg>
    );
  }
  if (kind === "careful") {
    return (
      <svg {...common}>
        <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  );
};
