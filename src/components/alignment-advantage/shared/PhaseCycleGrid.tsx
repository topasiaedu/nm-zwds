import React from "react";
import { C } from "./constants";
import type { PhaseAlignmentSeasonKey } from "../../../utils/forecast/wealthContentData";
import { SeasonPhaseSvg } from "./phaseWealthVisuals";

export interface PhaseTileConfig {
  key: PhaseAlignmentSeasonKey;
  label: string;
  tagline: string;
  color: string;
}

export const PHASE_TILES: PhaseTileConfig[] = [
  {
    key: "expansion",
    label: "Expansion",
    tagline: "Launch, expand, and capture new ground",
    color: "#16a34a",
  },
  {
    key: "visibility",
    label: "Visibility",
    tagline: "Be seen, build brand, and push presence",
    color: C.coral,
  },
  {
    key: "consolidation",
    label: "Consolidation",
    tagline: "Audit, refine, and tighten what works",
    color: "#d97706",
  },
  {
    key: "foundation",
    label: "Foundation",
    tagline: "Protect the base and build long-term stability",
    color: "#2563eb",
  },
];

interface PhaseCycleGridProps {
  activePhaseKey: PhaseAlignmentSeasonKey;
}

/** 2×2 business-cycle grid — active phase highlighted. */
export const PhaseCycleGrid: React.FC<PhaseCycleGridProps> = ({ activePhaseKey }) => (
  <div className="grid grid-cols-2 gap-3">
    {PHASE_TILES.map((phase) => {
      const isActive = phase.key === activePhaseKey;

      return (
        <div
          key={phase.key}
          className="rounded-2xl p-4 flex flex-col items-center text-center transition-all min-h-[148px]"
          style={{
            background: isActive ? `${phase.color}14` : C.white,
            border: `2px solid ${isActive ? phase.color : `${C.border}60`}`,
            boxShadow: isActive ? `0 8px 28px ${phase.color}22` : "none",
            opacity: isActive ? 1 : 0.48,
          }}
        >
          <div className="w-[72px] h-[72px] mb-3">
            <SeasonPhaseSvg season={phase.key} />
          </div>
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-1"
            style={{ color: isActive ? phase.color : C.muted }}
          >
            {phase.label}
          </p>
          <p className="text-[10px] leading-snug max-w-[140px]" style={{ color: isActive ? C.navy : C.muted }}>
            {phase.tagline}
          </p>
          {isActive && (
            <span
              className="mt-2.5 rounded-full px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-wider"
              style={{ background: phase.color, color: C.white }}
            >
              You are here
            </span>
          )}
        </div>
      );
    })}
  </div>
);
