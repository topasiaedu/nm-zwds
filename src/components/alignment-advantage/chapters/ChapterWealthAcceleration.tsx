import React from "react";
import { Landmark, Briefcase, Activity, LineChart, Target } from "lucide-react";
import { SectionHeader } from "../shared/SectionHeader";
import { ReportSheet } from "../shared/ReportSheet";
import { firstSentences } from "../shared/textHelpers";
import { TwelvePalaceMiniGrid } from "../shared/TwelvePalaceMiniGrid";
import { C } from "../shared/constants";
import { PhaseWealthAlignmentSheet } from "./PhaseWealthAlignmentSheet";
import { resolvePhaseKey } from "../shared/phaseWealthVisuals";
import type { ChartData } from "../../../utils/zwds/types";
import {
  WEALTH_TYPE,
  PHASE_ALIGNMENT_MATRIX,
} from "../../../utils/forecast/wealthContentData";
import type { WealthCodeKey } from "../../../utils/zwds/analysis_constants/wealth_code_mapping";

interface ChapterWealthAccelerationProps {
  chartData: ChartData;
  strategicData: any;
}

export const ChapterWealthAcceleration: React.FC<ChapterWealthAccelerationProps> = ({
  chartData,
  strategicData,
}) => {
  const wealthKey = strategicData.wealthProfile.codes[0]?.key as WealthCodeKey | undefined;
  const wtProfile = wealthKey !== undefined ? WEALTH_TYPE[wealthKey] : undefined;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Earned Income": return <Briefcase size={24} color={C.coral} />;
      case "Passive Returns": return <Activity size={24} color={C.coral} />;
      case "Equity Growth": return <LineChart size={24} color={C.coral} />;
      case "Strategic Windfalls": return <Target size={24} color={C.coral} />;
      default: return <Landmark size={24} color={C.coral} />;
    }
  };

  return (
    <div id="wealth" className="scroll-mt-16 mb-8">
    <ReportSheet watermark="waves">
      <SectionHeader
        graphicType="wealth"
        chapter="Chapter 02 · Wealth Acceleration"
        title="Your Wealth Blueprint"
        subtitle="Your dominant wealth archetype and the timing-wealth intersection for this cycle."
      />

      {/* ── 1. Chart: wealth-relevant palace snapshot ── */}
      <div className="mb-12">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6 text-center" style={{ color: C.muted }}>
          Structural Indicators: Wealth, Property, and Career Palaces
        </p>
        <TwelvePalaceMiniGrid chartData={chartData} highlightPalaces={["财帛", "田宅", "官禄"]} />
      </div>

      {/* ── 2. Stats: wealth code score bars ── */}
      <div className="mb-16">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6" style={{ color: C.muted }}>
          Wealth Code Distribution
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {strategicData.wealthProfile.codes.map((code: any, i: number) => {
            const pct = Math.round((code.score / 10) * 100);
            const isDominant = i === 0;
            return (
              <div key={code.key}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {isDominant && (
                      <span className="rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide" style={{ background: `${C.coral}18`, color: C.coral, border: `1px solid ${C.coral}30` }}>
                        Primary
                      </span>
                    )}
                    <p className="text-sm font-semibold" style={{ color: C.navy }}>{code.label}</p>
                  </div>
                  <p className="text-sm font-bold" style={{ color: isDominant ? C.coral : C.navy }}>
                    {code.score.toFixed(1)}
                  </p>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: C.border }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      background: isDominant ? `linear-gradient(90deg, ${C.navy}, ${C.coral})` : `linear-gradient(90deg, ${C.navy}88, ${C.navy}55)`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 3. Explanation: revenue engine map & archetype profile ── */}
      {wtProfile && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${C.coral}15`, border: `1px solid ${C.coral}30` }}>
              {getCategoryIcon(wtProfile.category)}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: C.coral }}>
                Revenue Engine Map
              </p>
              <h3 className="text-2xl font-bold" style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}>
                {wtProfile.category}
              </h3>
            </div>
          </div>

          <div className="p-8 rounded-3xl" style={{ background: C.white, border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] mb-3" style={{ color: C.muted }}>
              Dominant Wealth Archetype
            </p>
            <p className="text-3xl font-bold mb-4" style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}>
              {strategicData.wealthProfile.dominantArchetype}
            </p>
            <p className="text-sm leading-relaxed mb-6" style={{ color: C.navy }}>
              {firstSentences(String(strategicData.wealthProfile.summaryText), 2)}
            </p>

            <div className="w-full h-px mb-6" style={{ background: `linear-gradient(90deg, ${C.border}, transparent)` }} />

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: C.muted }}>
              What this looks like in practice
            </p>
            <div className="flex flex-wrap gap-2">
              {wtProfile.examples.map((ex) => (
                <span
                  key={ex}
                  className="rounded-full px-4 py-2 text-xs font-medium"
                  style={{ background: `${C.navy}08`, color: C.navy, border: `1px solid ${C.border}60` }}
                >
                  {ex}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

    </ReportSheet>

      {/* ── Phase × Wealth intersection ── */}
      {strategicData.dayun !== null && (() => {
        const phaseKey = resolvePhaseKey(strategicData.dayun?.season ?? null);
        const alignEntry = wealthKey !== undefined ? (PHASE_ALIGNMENT_MATRIX[phaseKey]?.[wealthKey] ?? null) : null;

        return (
          <PhaseWealthAlignmentSheet
            phaseKey={phaseKey}
            alignEntry={alignEntry}
            wealthKey={wealthKey}
            wealthArchetype={strategicData.wealthProfile.dominantArchetype}
          />
        );
      })()}
    </div>
  );
};
