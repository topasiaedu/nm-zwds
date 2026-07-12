import React from "react";
import { C } from "./constants";
import type { PalaceActivationTile } from "./helpers/peoplePalaceAnalysis";
import { PalaceCatalystSvg, PALACE_CATALYST_TILE_STYLES } from "./peoplePalaceVisuals";
import type { CatalystKind } from "./catalystGuidance";

/** Plain labels for activation tiles on palace briefing pages. */
const PLAIN_ACTIVATION_LABEL: Record<CatalystKind, string> = {
  lu: "Resources",
  quan: "Authority",
  ke: "Reputation",
  ji: "Pressure",
};

interface PeoplePalaceActivationGridProps {
  tiles: ReadonlyArray<PalaceActivationTile>;
  hint?: string | null;
}

/** Single-row catalyst strip for one relationship palace. */
export const PeoplePalaceActivationGrid: React.FC<PeoplePalaceActivationGridProps> = ({ tiles, hint }) => {
  const activeCount = tiles.filter((tile) => tile.active).length;

  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.24em] mb-3" style={{ color: C.coral }}>
        Activations In This Palace
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {tiles.map((tile) => {
          const style = PALACE_CATALYST_TILE_STYLES[tile.kind];
          const isActive = tile.active;

          return (
            <div
              key={tile.kind}
              className="rounded-xl px-3 py-3 flex flex-col items-center text-center gap-1.5"
              style={{
                background: isActive ? style.activeBg : `${C.navy}03`,
                border: isActive ? `1.5px solid ${style.color}45` : `1px solid ${C.border}50`,
                opacity: isActive ? 1 : 0.65,
              }}
            >
              <div className="w-8 h-8" style={{ color: isActive ? style.color : C.muted }}>
                <PalaceCatalystSvg kind={tile.kind} />
              </div>
              <p
                className="text-[10px] font-bold leading-tight"
                style={{
                  color: isActive ? style.dark : C.muted,
                  fontFamily: "Georgia,'Times New Roman',serif",
                }}
              >
                {PLAIN_ACTIVATION_LABEL[tile.kind]}
              </p>
              {isActive && tile.starLabel !== null ? (
                <p className="text-[9px] font-bold uppercase tracking-wide" style={{ color: style.color }}>
                  Active · {tile.starLabel}
                </p>
              ) : (
                <p className="text-[9px] font-medium uppercase tracking-wide" style={{ color: C.muted }}>
                  Off
                </p>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-xs mt-2.5 leading-relaxed" style={{ color: C.muted }}>
        {hint !== null && hint !== undefined
          ? hint
          : activeCount > 0
            ? `${activeCount} active in this palace.`
            : "Nothing active in this palace right now."}
      </p>
    </div>
  );
};
