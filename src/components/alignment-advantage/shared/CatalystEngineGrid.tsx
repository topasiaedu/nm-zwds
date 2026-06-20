import React from "react";
import { C } from "./constants";
import type { CatalystKind, CoreCatalystActivation } from "./catalystGuidance";
import { getCatalystActionBrief, getCatalystTileLabel } from "./catalystGuidance";

interface CatalystEngineGridProps {
  activations: ReadonlyArray<CoreCatalystActivation>;
}

const TILE_STYLES: Record<CatalystKind, { activeBg: string; color: string; dark: string }> = {
  lu: { activeBg: "#f0fdf4", color: "#16a34a", dark: "#14532d" },
  quan: { activeBg: "#eff6ff", color: "#2563eb", dark: "#1e3a8a" },
  ke: { activeBg: "#fffbeb", color: "#d97706", dark: "#78350f" },
  ji: { activeBg: "#fff1ee", color: C.coral, dark: C.coralDark },
};

const CatalystIcon: React.FC<{ kind: CatalystKind; className?: string }> = ({ kind, className = "w-full h-full" }) => {
  if (kind === "lu") {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="50" cy="50" r="42" strokeWidth="3" />
        <circle cx="50" cy="50" r="28" strokeWidth="2" />
        <circle cx="50" cy="50" r="8" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />
        <line x1="50" y1="42" x2="50" y2="24" strokeWidth="2" />
        <line x1="50" y1="58" x2="50" y2="76" strokeWidth="2" />
        <line x1="42" y1="50" x2="24" y2="50" strokeWidth="2" />
        <line x1="58" y1="50" x2="76" y2="50" strokeWidth="2" />
      </svg>
    );
  }
  if (kind === "quan") {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M 10 72 H 90 V 86 H 10 Z" fill="currentColor" fillOpacity="0.1" strokeWidth="2" />
        <path d="M 10 72 L 10 40 L 30 58 L 50 14 L 70 58 L 90 40 L 90 72" strokeWidth="2.5" />
        <circle cx="50" cy="12" r="6" fill="currentColor" fillOpacity="0.35" stroke="none" />
      </svg>
    );
  }
  if (kind === "ke") {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M 50 90 Q 18 55, 26 20 Q 50 10, 74 20 Q 82 55, 50 90 Z" strokeWidth="2.5" />
        <line x1="50" y1="90" x2="50" y2="36" strokeWidth="1.5" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="40" cy="40" r="28" strokeWidth="2.5" />
      <line x1="62" y1="62" x2="88" y2="88" strokeWidth="6" />
    </svg>
  );
};

/** Compact actionable cards for active catalysts only. */
export const CatalystEngineGrid: React.FC<CatalystEngineGridProps> = ({ activations }) => {
  if (activations.length === 0) {
    return (
      <p className="text-xs leading-snug" style={{ color: C.muted }}>
        No growth catalysts are active for you right now. Use your player type and formation above when deciding.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {activations.map((activation) => {
        const brief = getCatalystActionBrief(activation);
        const style = TILE_STYLES[activation.kind];
        const label = getCatalystTileLabel(activation.kind);

        return (
          <div
            key={`${activation.kind}-${activation.palace}-${activation.starName}`}
            className="rounded-2xl p-4"
            style={{ background: style.activeBg, border: `1px solid ${style.color}22` }}
          >
            <div className="grid grid-cols-[40px_1fr] gap-3">
              <div className="w-10 h-10 mt-0.5" style={{ color: style.color }}>
                <CatalystIcon kind={activation.kind} />
              </div>
              <div>
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-1.5">
                  <p className="text-sm font-bold leading-tight" style={{ color: style.dark, fontFamily: "Georgia,'Times New Roman',serif" }}>
                    {label.short}
                  </p>
                  <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: style.color }}>
                    {brief.zoneLabel}
                  </span>
                </div>
                <p className="text-xs font-semibold leading-snug mb-2" style={{ color: C.navy }}>
                  {brief.directive}
                </p>
                <div className="space-y-1">
                  {brief.moves.map((move) => (
                    <p key={move} className="text-[11px] leading-snug pl-2.5 relative" style={{ color: C.muted }}>
                      <span className="absolute left-0 top-[0.45em] w-1 h-1 rounded-full" style={{ background: style.color }} />
                      {move}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
