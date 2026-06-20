import React from "react";
import { C } from "./constants";

const SEASONS: Array<{ key: string; label: string; color: string }> = [
  { key: "spring", label: "Expansion", color: "#16a34a" },
  { key: "summer", label: "Visibility", color: C.coral },
  { key: "autumn", label: "Consolidation", color: "#d97706" },
  { key: "winter", label: "Foundation", color: "#2563eb" },
];

interface PhaseSeasonBandProps {
  activeSeason: string | null | undefined;
}

/** Horizontal phase strip with season glyphs and active-state highlight. */
export const PhaseSeasonBand: React.FC<PhaseSeasonBandProps> = ({ activeSeason }) => (
  <div className="grid grid-cols-4 gap-2 mb-0">
    {SEASONS.map((season) => {
      const isActive = activeSeason === season.key;
      return (
        <div
          key={season.key}
          className="rounded-2xl px-2 py-3 text-center transition-all"
          style={{
            background: isActive ? `${season.color}18` : `${C.navy}04`,
            border: `1px solid ${isActive ? `${season.color}50` : `${C.border}40`}`,
            opacity: isActive ? 1 : 0.5,
          }}
        >
          <SeasonBandGlyphInline seasonKey={season.key} color={season.color} active={isActive} />
          <p
            className="text-[8px] font-bold uppercase tracking-widest"
            style={{ color: isActive ? season.color : C.muted }}
          >
            {season.label}
          </p>
          {isActive && (
            <span
              className="inline-block w-1.5 h-1.5 rounded-full mt-1.5"
              style={{ background: season.color }}
            />
          )}
        </div>
      );
    })}
  </div>
);

const SeasonBandGlyphInline: React.FC<{ seasonKey: string; color: string; active: boolean }> = ({
  seasonKey,
  color,
  active,
}) => {
  const opacity = active ? 1 : 0.45;
  const className = "w-7 h-7 mx-auto mb-1.5";

  if (seasonKey === "spring") {
    return (
      <svg className={className} viewBox="0 0 32 32" fill="none" style={{ opacity }} aria-hidden="true">
        <path d="M16 26 V14 M16 14 L12 18 M16 14 L20 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (seasonKey === "summer") {
    return (
      <svg className={className} viewBox="0 0 32 32" fill="none" style={{ opacity }} aria-hidden="true">
        <circle cx="16" cy="16" r="6" stroke={color} strokeWidth="1.5" />
        <path d="M16 6 V9 M16 23 V26 M6 16 H9 M23 16 H26" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (seasonKey === "autumn") {
    return (
      <svg className={className} viewBox="0 0 32 32" fill="none" style={{ opacity }} aria-hidden="true">
        <rect x="8" y="18" width="5" height="8" rx="1" stroke={color} strokeWidth="1.2" />
        <rect x="13.5" y="14" width="5" height="12" rx="1" stroke={color} strokeWidth="1.2" />
        <rect x="19" y="10" width="5" height="16" rx="1" stroke={color} strokeWidth="1.2" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" style={{ opacity }} aria-hidden="true">
      <rect x="9" y="20" width="14" height="4" rx="1" stroke={color} strokeWidth="1.2" />
      <rect x="11" y="14" width="10" height="4" rx="1" stroke={color} strokeWidth="1.2" />
      <rect x="13" y="8" width="6" height="4" rx="1" stroke={color} strokeWidth="1.2" />
    </svg>
  );
};
