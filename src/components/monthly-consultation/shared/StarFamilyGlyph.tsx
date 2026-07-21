/**
 * Family-bucket SVG glyphs for natal / borrowed star rows in ChapterStars.
 */

import React from "react";
import { C } from "../../alignment-advantage/shared/constants";

/** Five visual families for main-star cues. */
export type StarFamily =
  | "emperor"
  | "treasury"
  | "catalyst"
  | "warrior"
  | "scholar";

const FAMILY_COLOR: Record<StarFamily, string> = {
  emperor: "#2563eb",
  treasury: "#047857",
  catalyst: C.coral,
  warrior: "#7c3aed",
  scholar: C.gold,
};

/**
 * Map an English (or Chinese) star name to a visual family bucket.
 * Defaults to "scholar" when the name is unknown.
 */
export const starFamilyGlyph = (starName: string): StarFamily => {
  const s = starName.toLowerCase();
  if (
    s.includes("zi wei") ||
    s.includes("tian ji") ||
    s.includes("tai yang") ||
    s.includes("tai yin") ||
    s.includes("紫微") ||
    s.includes("天机") ||
    s.includes("太阳") ||
    s.includes("太阴")
  ) {
    return "emperor";
  }
  if (
    s.includes("wu qu") ||
    s.includes("tian fu") ||
    s.includes("武曲") ||
    s.includes("天府")
  ) {
    return "treasury";
  }
  if (
    s.includes("qi sha") ||
    s.includes("pojun") ||
    s.includes("po jun") ||
    s.includes("七杀") ||
    s.includes("破军")
  ) {
    return "warrior";
  }
  if (
    s.includes("wen chang") ||
    s.includes("wen qu") ||
    s.includes("文昌") ||
    s.includes("文曲")
  ) {
    return "scholar";
  }
  if (
    s.includes("tan lang") ||
    s.includes("ju men") ||
    s.includes("tian liang") ||
    s.includes("lian zhen") ||
    s.includes("贪狼") ||
    s.includes("巨门") ||
    s.includes("天梁") ||
    s.includes("廉贞")
  ) {
    return "catalyst";
  }
  return "scholar";
};

/**
 * Resolve the accent colour for a star family (or by star name).
 */
export const starFamilyColor = (starName: string): string =>
  FAMILY_COLOR[starFamilyGlyph(starName)];

export interface StarFamilyGlyphProps {
  /** English or Chinese star name; family is derived automatically. */
  starName?: string;
  /** Explicit family override when the name is unavailable. */
  family?: StarFamily;
  size?: number;
  color?: string;
}

/**
 * Small inline SVG icon for one star family (crown, coin, flame, shield, brush).
 */
export const StarFamilyGlyph: React.FC<StarFamilyGlyphProps> = ({
  starName,
  family,
  size = 18,
  color,
}) => {
  const resolvedFamily: StarFamily =
    family ?? (starName !== undefined ? starFamilyGlyph(starName) : "scholar");
  const stroke = color ?? FAMILY_COLOR[resolvedFamily];
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke,
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  if (resolvedFamily === "emperor") {
    return (
      <svg {...common}>
        {/* Crown / sun */}
        <path d="M4 16l3-7 5 4 5-4 3 7H4z" />
        <path d="M4 16h16v2H4z" />
        <circle cx="12" cy="6" r="1.5" fill={stroke} stroke="none" />
      </svg>
    );
  }
  if (resolvedFamily === "treasury") {
    return (
      <svg {...common}>
        {/* Coin */}
        <circle cx="12" cy="12" r="8" />
        <path d="M12 7v10M9 9.5c1-.8 5-.8 6 0M9 14.5c1 .8 5 .8 6 0" />
      </svg>
    );
  }
  if (resolvedFamily === "catalyst") {
    return (
      <svg {...common}>
        {/* Flame */}
        <path d="M12 3c2 3-1 4.5 1 7.5 1.5 2 0 5.5-1 6.5-1-1-2.5-4.5-1-6.5C13 8 10 6 12 3z" />
        <path d="M12 17c-1.5 0-3-1.2-3-3.2 0-1.3.8-2.3 1.5-3" />
      </svg>
    );
  }
  if (resolvedFamily === "warrior") {
    return (
      <svg {...common}>
        {/* Shield */}
        <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
        <path d="M12 8v8M9 12h6" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      {/* Brush / scholar */}
      <path d="M6 18l2-2 9-9 2 2-9 9-2 2z" />
      <path d="M15 5l2 2M8 16l-2 4 4-2" />
    </svg>
  );
};
