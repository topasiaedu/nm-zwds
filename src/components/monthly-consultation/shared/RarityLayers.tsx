/**
 * Stacked Decade / Month / Signal layers for the Rarity chapter.
 */

import React from "react";
import { C } from "../../alignment-advantage/shared/constants";

export interface RarityLayerItem {
  label: string;
  value: string;
}

export interface RarityLayersProps {
  layers: RarityLayerItem[];
  priorCount: number;
}

const LAYER_COLORS = [C.navy, C.coral, C.gold] as const;

/**
 * Visual lifetime-stat + three personal layers.
 */
export const RarityLayers: React.FC<RarityLayersProps> = ({
  layers,
  priorCount,
}) => (
  <div className="space-y-3">
    <div
      className="rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4"
      style={{
        background: `linear-gradient(135deg, ${C.coral}18, ${C.gold}22)`,
        border: `1px solid ${C.border}`,
      }}
    >
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
            ? "time this exact mix has lined up for you"
            : "earlier months like this in your life"}
        </p>
      </div>
    </div>

    <div className="space-y-2">
      {layers.slice(0, 3).map((layer, index) => {
        const accent = LAYER_COLORS[index] ?? C.navy;
        return (
          <div
            key={`${layer.label}-${layer.value}`}
            className="rounded-2xl px-4 py-3 flex items-start gap-3"
            style={{
              background: "rgba(255,255,255,0.78)",
              border: `1px solid ${C.border}`,
              borderLeft: `4px solid ${accent}`,
            }}
          >
            <span
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
              style={{ background: `${accent}18`, color: accent }}
              aria-hidden="true"
            >
              {String(index + 1)}
            </span>
            <div className="min-w-0">
              <p
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: accent }}
              >
                {layer.label}
              </p>
              <p className="text-sm font-semibold leading-snug mt-0.5" style={{ color: C.navy }}>
                {layer.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
