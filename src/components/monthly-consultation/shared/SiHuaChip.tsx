/**
 * Colour-coded Lu / Quan / Ke / Ji chips and glyph badges for Monthly Consultation.
 */

import React from "react";
import type { SiHuaKind } from "../../../utils/forecast/monthlyConsultation";
import { SI_HUA_LABEL } from "../../../utils/forecast/monthlyConsultation/englishLabels";
import { C } from "../../alignment-advantage/shared/constants";

/** Palette for each Si Hua kind. */
export const SI_HUA_COLOR: Record<SiHuaKind, string> = {
  "化禄": "#16a34a",
  "化权": "#2563eb",
  "化科": "#ca8a04",
  "化忌": "#dc2626",
};

export interface SiHuaChipProps {
  kind: SiHuaKind;
  /** Optional trailing label (e.g. star + landing). */
  label?: string;
  size?: "sm" | "md";
}

/**
 * Compact colour chip for one Si Hua activation.
 */
export const SiHuaChip: React.FC<SiHuaChipProps> = ({
  kind,
  label,
  size = "sm",
}) => {
  const color = SI_HUA_COLOR[kind];
  const name = SI_HUA_LABEL[kind];
  const pad = size === "md" ? "px-3 py-1.5 text-xs" : "px-2 py-1 text-[10px]";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-wider ${pad}`}
      style={{
        color,
        background: `${color}18`,
        border: `1px solid ${color}44`,
      }}
    >
      <SiHuaGlyph kind={kind} size={size === "md" ? 14 : 11} />
      <span>{name}</span>
      {label !== undefined && label.length > 0 && (
        <span className="font-semibold normal-case tracking-normal" style={{ color: C.navy }}>
          {label}
        </span>
      )}
    </span>
  );
};

export interface SiHuaGlyphProps {
  kind: SiHuaKind;
  size?: number;
}

/**
 * Simple SVG glyph for Lu (circle), Quan (triangle), Ke (star), Ji (warning).
 */
export const SiHuaGlyph: React.FC<SiHuaGlyphProps> = ({ kind, size = 28 }) => {
  const color = SI_HUA_COLOR[kind];
  if (kind === "化禄") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8" fill="none" stroke={color} strokeWidth="2.2" />
        <circle cx="12" cy="12" r="3.5" fill={color} />
      </svg>
    );
  }
  if (kind === "化权") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4l8 14H4L12 4z" fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === "化科") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 3l2.2 6.8H21l-5.5 4 2.1 6.7L12 16.8 6.4 20.5l2.1-6.7L3 9.8h6.8L12 3z"
          fill={color}
        />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 9v4m0 4h.01M10.3 4.3L3.6 18a2 2 0 001.7 3h13.4a2 2 0 001.7-3L13.7 4.3a2 2 0 00-3.4 0z"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/**
 * Infer Si Hua kind from an activation card title like "Tian Tong, Ji".
 */
export const kindFromActivationTitle = (title: string): SiHuaKind | null => {
  const lower = title.toLowerCase();
  if (lower.includes(", lu") || lower.endsWith(" lu")) {
    return "化禄";
  }
  if (lower.includes(", quan") || lower.endsWith(" quan")) {
    return "化权";
  }
  if (lower.includes(", ke") || lower.endsWith(" ke")) {
    return "化科";
  }
  if (lower.includes(", ji") || lower.endsWith(" ji")) {
    return "化忌";
  }
  return null;
};
