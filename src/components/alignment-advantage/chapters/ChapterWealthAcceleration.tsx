import React from "react";
import { Landmark, Briefcase, Activity, ArrowUpRight, ArrowDownRight, CircleDollarSign, LineChart, Target, Zap, Shield } from "lucide-react";
import { SectionWatermark } from "../shared/SectionWatermark";
import { SectionHeader } from "../shared/SectionHeader";
import { TwelvePalaceMiniGrid } from "../shared/TwelvePalaceMiniGrid";
import { C } from "../shared/constants";
import type { ChartData } from "../../../utils/zwds/types";
import {
  WEALTH_TYPE,
  FOCUS_ON,
  STOP_DOING,
  IDEAL_COLLABORATOR,
  ALTERNATIVE_PATH,
  PHASE_ALIGNMENT_MATRIX,
  type PhaseAlignmentSeasonKey,
} from "../../../utils/forecast/wealthContentData";
import type { WealthCodeKey } from "../../../utils/zwds/analysis_constants/wealth_code_mapping";

const DAYUN_TO_PHASE: Record<string, PhaseAlignmentSeasonKey> = {
  spring: "expansion",
  summer: "visibility",
  autumn: "consolidation",
  winter: "foundation",
};

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

  // Select an icon based on category
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
    <section id="wealth" className="scroll-mt-16 mb-32 pt-16 relative overflow-hidden bg-[#fdf6ee] rounded-[40px] p-10 md:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-[#e8ddd0]/80">
      <SectionWatermark type="waves" />
      <SectionHeader
        graphicType="wealth"
        chapter="Chapter 03 · Wealth Acceleration"
        title="Your Wealth Blueprint"
        subtitle="Your dominant wealth archetype, capital allocation strategy, and the timing-wealth intersection for this cycle."
      />

      {/* ── Revenue Engine Map (Visual Dashboard) ── */}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="p-8 rounded-3xl" style={{ background: C.white, border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] mb-3" style={{ color: C.muted }}>
                  Dominant Wealth Archetype
                </p>
                <p className="text-3xl font-bold mb-4" style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}>
                  {strategicData.wealthProfile.dominantArchetype}
                </p>
                <p className="text-sm leading-relaxed mb-6" style={{ color: C.navy }}>
                  {strategicData.wealthProfile.summaryText}
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

            <div className="space-y-6">
              <div className="p-6 rounded-3xl h-full flex flex-col justify-center" style={{ background: C.navy, boxShadow: "0 8px 32px rgba(26,30,63,0.15)" }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Archetype Profile
                </p>
                <div className="inline-flex rounded-full px-4 py-2 text-sm font-bold mb-6 self-start" style={{ background: `${C.coral}25`, color: C.coral, border: `1px solid ${C.coral}40` }}>
                  {strategicData.wealthProfile.profileType}
                </div>
                <p className="text-sm leading-relaxed italic" style={{ color: "rgba(255,255,255,0.8)" }}>
                  &ldquo;{wtProfile.tagline}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wealth-relevant palace snapshot */}
      <div className="mb-12">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6 text-center" style={{ color: C.muted }}>
          Structural Indicators: Wealth, Property, and Career Palaces
        </p>
        <TwelvePalaceMiniGrid chartData={chartData} highlightPalaces={["财帛", "田宅", "官禄"]} />
      </div>

      {/* ── Wealth code score bars ── */}
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
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: C.border }}>
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

      {/* ── Capital Allocation Dashboard (The Playbook) ── */}
      {wealthKey && (
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${C.navy}10`, border: `1px solid ${C.navy}20` }}>
              <CircleDollarSign size={24} color={C.navy} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: C.navy }}>
                The Playbook
              </p>
              <h3 className="text-2xl font-bold" style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}>
                Capital Allocation Dashboard
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* BUY (Focus On) */}
            <div className="pt-6" style={{ borderTop: `2px solid #16a34a` }}>
              <div className="flex items-center gap-2 mb-6">
                <ArrowUpRight size={18} color="#16a34a" />
                <p className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "#16a34a" }}>
                  Buy / Allocate
                </p>
              </div>
              <div className="space-y-5">
                {FOCUS_ON[wealthKey].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5" style={{ background: "#dcfce7", color: "#16a34a" }}>
                      {i + 1}
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: C.navy }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* HOLD (Ideal Collaborator / Strengths) */}
            <div className="pt-6" style={{ borderTop: `2px solid ${C.gold}` }}>
              <div className="flex items-center gap-2 mb-6">
                <Shield size={18} color={C.gold} />
                <p className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: C.gold }}>
                  Hold / Partner
                </p>
              </div>
              <div className="mb-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: C.muted }}>Ideal Collaborator</p>
                <p className="text-sm font-bold mb-4" style={{ color: C.navy }}>{IDEAL_COLLABORATOR[wealthKey].type}</p>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: C.muted }}>Look For</p>
                {IDEAL_COLLABORATOR[wealthKey].lookFor.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: C.gold }} />
                    <p className="text-sm leading-relaxed" style={{ color: C.navy }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SELL (Stop Doing) */}
            <div className="pt-6" style={{ borderTop: `2px solid ${C.coral}` }}>
              <div className="flex items-center gap-2 mb-6">
                <ArrowDownRight size={18} color={C.coral} />
                <p className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: C.coral }}>
                  Sell / Divest
                </p>
              </div>
              <div className="space-y-5">
                {STOP_DOING[wealthKey].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5" style={{ background: `${C.coral}18`, color: C.coral }}>
                      {i + 1}
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: C.navy }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Phase × Wealth intersection ── */}
      {strategicData.dayun !== null && (() => {
        const phaseKey: PhaseAlignmentSeasonKey = DAYUN_TO_PHASE[strategicData.dayun?.season ?? ""] ?? "expansion";
        const alignEntry = wealthKey !== undefined ? (PHASE_ALIGNMENT_MATRIX[phaseKey]?.[wealthKey] ?? null) : null;
        const topActions = strategicData.dayun.keyActions.slice(0, 3);
        const altPath = ALTERNATIVE_PATH[strategicData.dayun?.season ?? "expansion"] ?? ALTERNATIVE_PATH.expansion;

        return (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${C.navy}10`, border: `1px solid ${C.navy}20` }}>
                <Zap size={24} color={C.navy} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: C.navy }}>
                  Timing Intersection
                </p>
                <h3 className="text-2xl font-bold" style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}>
                  Phase × Wealth Alignment
                </h3>
              </div>
            </div>

            {alignEntry !== null && (
              <div className="p-8 rounded-3xl" style={{ background: C.white, border: `1px solid ${C.border}60` }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: C.navy }}>
                  Current Phase: {phaseKey.charAt(0).toUpperCase() + phaseKey.slice(1)}
                </p>
                <p className="text-base leading-relaxed" style={{ color: C.navy }}>{alignEntry.copy}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topActions.length > 0 && (
                <div className="p-8 rounded-3xl" style={{ background: C.navy }}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Key Actions This Phase
                  </p>
                  <div className="space-y-5">
                    {topActions.map((action: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5" style={{ background: "rgba(255,255,255,0.1)", color: C.white }}>
                          {idx + 1}
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {alignEntry !== null && alignEntry.watchOut.length > 0 && (
                  <div className="p-6 rounded-3xl" style={{ background: C.white, border: `1px solid ${C.coral}40` }}>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: C.coral }}>
                      Risk Mitigation
                    </p>
                    <div className="space-y-4">
                      {alignEntry.watchOut.map((item: string, i: number) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: C.coral }} />
                          <p className="text-sm leading-relaxed" style={{ color: C.navy }}>{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-6 rounded-3xl" style={{ background: `${C.gold}10`, border: `1px solid ${C.gold}30` }}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: C.gold }}>
                    Alternative Path (If Misaligned)
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: C.navy }}>{altPath}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
};
