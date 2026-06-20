/**
 * PeoplePalaceGrid — Five-palace selector strip (mirrors MonthGrid pattern).
 */

import React from "react";
import { C } from "./shared/constants";
import type { PeoplePalacePillData } from "./shared/helpers/peoplePalaceAnalysis";
import type { PeoplePalaceKey } from "../../utils/forecast/peoplePalaceData";

interface PeoplePalaceGridProps {
  pills: ReadonlyArray<PeoplePalacePillData>;
  selectedPalaceKey: PeoplePalaceKey;
  onSelect: (palaceKey: PeoplePalaceKey) => void;
}

const PeoplePalaceGrid: React.FC<PeoplePalaceGridProps> = ({
  pills,
  selectedPalaceKey,
  onSelect,
}) => (
  <div
    className="rounded-2xl p-4"
    style={{ background: C.white, border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}
  >
    <p className="text-xs font-bold uppercase tracking-widest mb-3 px-1" style={{ color: C.muted }}>
      Relationship Palaces at a Glance
    </p>
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
      {pills.map((pill) => {
        const isSelected = pill.palaceKey === selectedPalaceKey;
        const accent = pill.hasLu ? "#16a34a" : pill.hasJi ? C.coral : C.navy;

        return (
          <button
            key={pill.palaceKey}
            type="button"
            onClick={() => { onSelect(pill.palaceKey); }}
            aria-pressed={isSelected}
            aria-label={`${pill.shortLabel}: ${pill.mainStarLabel}`}
            className="flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 border transition-all duration-200 focus:outline-none focus-visible:ring-2"
            style={{
              borderColor: isSelected ? accent : `${C.border}80`,
              background: isSelected ? `${accent}10` : "transparent",
              transform: isSelected ? "scale(1.02)" : undefined,
              boxShadow: isSelected ? "0 4px 14px rgba(0,0,0,0.06)" : undefined,
            }}
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: accent }}
              aria-hidden="true"
            />
            <span className="text-[11px] font-bold leading-none" style={{ color: isSelected ? accent : C.navy }}>
              {pill.shortLabel}
            </span>
            <span className="text-[9px] font-medium leading-tight text-center" style={{ color: C.muted }}>
              {pill.mainStarLabel}
            </span>
            {pill.activationCount > 0 && (
              <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: accent }}>
                {pill.hasLu ? "Lu" : `${pill.activationCount} act.`}
              </span>
            )}
          </button>
        );
      })}
    </div>
  </div>
);

export default PeoplePalaceGrid;
