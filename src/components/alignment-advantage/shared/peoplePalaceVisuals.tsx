import React from "react";
import { C } from "./constants";
import type { PeoplePalaceKey } from "../../../utils/forecast/people/peoplePalaceData";
import type { CatalystKind } from "./catalystGuidance";

/** Custom relationship glyph for each people palace. */
export const PalaceRelationshipSvg: React.FC<{
  palaceKey: PeoplePalaceKey;
  className?: string;
}> = ({ palaceKey, className = "w-full h-full" }) => {
  if (palaceKey === "兄弟") {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none" aria-hidden="true">
        <circle cx="28" cy="34" r="12" stroke={C.navy} strokeWidth="1.5" fill={`${C.navy}08`} />
        <circle cx="52" cy="34" r="12" stroke={C.coral} strokeWidth="1.5" fill={`${C.coral}10`} />
        <path d="M20 58 Q28 46 36 58" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M44 58 Q52 46 60 58" stroke={C.coral} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M36 34 H44" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 3" />
      </svg>
    );
  }

  if (palaceKey === "夫妻") {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none" aria-hidden="true">
        <circle cx="32" cy="38" r="14" stroke={C.navy} strokeWidth="1.5" fill={`${C.navy}08`} />
        <circle cx="48" cy="38" r="14" stroke={C.coral} strokeWidth="1.5" fill={`${C.coral}10`} />
        <path d="M32 52 Q40 62 48 52" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M40 24 V30" stroke={C.coral} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="40" cy="20" r="3" fill={C.coral} fillOpacity="0.6" />
      </svg>
    );
  }

  if (palaceKey === "交友") {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none" aria-hidden="true">
        <circle cx="40" cy="28" r="10" stroke={C.coral} strokeWidth="1.5" fill={`${C.coral}12`} />
        <circle cx="22" cy="50" r="8" stroke={C.navy} strokeWidth="1.5" fill={`${C.navy}08`} />
        <circle cx="58" cy="50" r="8" stroke={C.navy} strokeWidth="1.5" fill={`${C.navy}08`} />
        <circle cx="40" cy="62" r="7" stroke={C.navy} strokeWidth="1.5" fill={`${C.navy}06`} />
        <path d="M34 36 L26 44 M46 36 L54 44 M36 36 L38 56 M44 36 L42 56" stroke={C.border} strokeWidth="1.2" />
      </svg>
    );
  }

  if (palaceKey === "父母") {
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none" aria-hidden="true">
        <path d="M40 18 L56 34 H48 V52 H32 V34 H24 Z" stroke={C.coral} strokeWidth="1.5" fill={`${C.coral}10`} strokeLinejoin="round" />
        <path d="M20 58 H60" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M28 58 V48 M40 58 V44 M52 58 V48" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
        <circle cx="40" cy="64" r="4" stroke={C.gold} strokeWidth="1.2" fill={`${C.gold}20`} />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <path d="M40 20 V52" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M40 36 Q28 42 24 52" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M40 36 Q52 42 56 52" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="40" cy="16" r="6" fill="#16a34a" fillOpacity="0.2" stroke="#16a34a" strokeWidth="1.5" />
      <path d="M22 58 H58" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
      <circle cx="40" cy="62" r="5" stroke={C.coral} strokeWidth="1.2" fill={`${C.coral}15`} />
    </svg>
  );
};

/** Catalyst icon for palace activation tiles. */
export const PalaceCatalystSvg: React.FC<{ kind: CatalystKind; className?: string }> = ({
  kind,
  className = "w-full h-full",
}) => {
  if (kind === "lu") {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden="true">
        <circle cx="24" cy="24" r="18" strokeWidth="1.8" />
        <circle cx="24" cy="24" r="4" fill="currentColor" fillOpacity="0.2" strokeWidth="1.5" />
        <path d="M24 10 V18 M24 30 V38 M10 24 H18 M30 24 H38" strokeWidth="1.5" />
      </svg>
    );
  }
  if (kind === "quan") {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden="true">
        <path d="M8 34 H40 V40 H8 Z" fill="currentColor" fillOpacity="0.1" strokeWidth="1.5" />
        <path d="M8 34 L8 18 L16 26 L24 8 L32 26 L40 18 L40 34" strokeWidth="2" />
      </svg>
    );
  }
  if (kind === "ke") {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden="true">
        <path d="M24 42 Q10 26 14 10 Q24 6 34 10 Q38 26 24 42 Z" strokeWidth="1.8" />
        <path d="M24 42 V20" strokeWidth="1.2" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden="true">
      <circle cx="20" cy="20" r="12" strokeWidth="1.8" />
      <path d="M30 30 L40 40" strokeWidth="3" />
    </svg>
  );
};

export const PALACE_CATALYST_TILE_STYLES: Record<
  CatalystKind,
  { activeBg: string; color: string; dark: string }
> = {
  lu: { activeBg: "#f0fdf4", color: "#16a34a", dark: "#14532d" },
  quan: { activeBg: "#eff6ff", color: "#2563eb", dark: "#1e3a8a" },
  ke: { activeBg: "#fffbeb", color: "#d97706", dark: "#78350f" },
  ji: { activeBg: "#fff1ee", color: C.coral, dark: C.coralDark },
};
