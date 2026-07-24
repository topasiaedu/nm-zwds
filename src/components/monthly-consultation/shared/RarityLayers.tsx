/**
 * Decade / Month / Signal layers for the Rarity chapter.
 * Lifetime count + similar-month dates live in the hero strip.
 */

import React from "react";
import { C } from "../../alignment-advantage/shared/constants";

export interface RarityLayerItem {
  label: string;
  value: string;
}

export interface RarityPriorOccurrence {
  solarYear: number;
  lunarMonth: number;
}

export interface RarityLayersProps {
  layers: RarityLayerItem[];
  priorCount: number;
  /** Earlier months with the same fingerprint (shown under the count). */
  priorOccurrences?: RarityPriorOccurrence[];
}

const LAYER_COLORS = [C.navy, C.coral, C.gold] as const;

/**
 * Format one prior month for the lifetime strip.
 */
const formatPriorMonth = (entry: RarityPriorOccurrence): string =>
  `M${String(entry.lunarMonth)} ${String(entry.solarYear)}`;

/**
 * Strip parenthetical asides so layer cards stay scannable.
 */
const stripParenthetical = (value: string): string =>
  value.replace(/\s*\([^)]*\)/g, "").trim();

/**
 * Visual lifetime-stat (with similar months) + three personal layers in one row.
 */
export const RarityLayers: React.FC<RarityLayersProps> = ({
  layers,
  priorCount,
  priorOccurrences = [],
}) => (
  <div className="space-y-3">
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{
        background: `linear-gradient(135deg, ${C.coral}18, ${C.gold}22)`,
        border: `1px solid ${C.border}`,
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-6">
        <div className="text-center sm:text-left">
          <p
            className="text-4xl font-bold leading-none"
            style={{
              color: C.coral,
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            {priorCount === 0 ? "First" : `×${String(priorCount)}`}
          </p>
          <p className="text-xs mt-1.5 font-semibold" style={{ color: C.muted }}>
            {priorCount === 0
              ? "time this exact mix has shown up in your whole life"
              : "similar months like this throughout your whole life"}
          </p>
        </div>
      </div>

      {priorCount > 0 && priorOccurrences.length > 0 && (
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-wider mb-2"
            style={{ color: C.coral }}
          >
            Recent examples from your life
          </p>
          <div className="flex flex-wrap gap-2">
            {priorOccurrences.map((entry) => (
              <span
                key={`${String(entry.solarYear)}-${String(entry.lunarMonth)}`}
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  border: `1px solid ${C.border}`,
                  color: C.navy,
                }}
              >
                {formatPriorMonth(entry)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
      {layers.slice(0, 3).map((layer, index) => {
        const accent = LAYER_COLORS[index] ?? C.navy;
        const displayValue = stripParenthetical(layer.value);
        return (
          <div
            key={`${layer.label}-${layer.value}`}
            className="rounded-2xl px-3.5 py-3.5 min-w-0"
            style={{
              background: "rgba(255,255,255,0.78)",
              border: `1px solid ${C.border}`,
              borderTop: `3px solid ${accent}`,
            }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: accent }}
            >
              {layer.label}
            </p>
            <p
              className="text-sm font-semibold leading-snug mt-1.5"
              style={{ color: C.navy }}
            >
              {displayValue}
            </p>
          </div>
        );
      })}
    </div>
  </div>
);
