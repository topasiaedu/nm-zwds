import React, { useMemo, useState } from "react";
import type { ChartData } from "../../../utils/zwds/types";
import { getPalaceForAspectLiuMonth } from "../../../utils/destiny-navigator/palace-resolver";
import { PALACE_DATA, getSignalColor } from "../../../utils/forecast/alignmentTimingData";
import {
  PALACE_MONTH_DATA,
  PALACE_GUIDANCE_DATA,
  SEASON_STYLES,
} from "../../../utils/forecast/alignmentAdvantage/executionPlaybookData";
import MonthGrid from "../shared/MonthGrid";
import type { MonthPillData } from "../shared/MonthGrid";
import { C } from "../shared/constants";
import { SectionWatermark } from "../shared/SectionWatermark";
import { SectionHeader } from "../shared/SectionHeader";

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH_INDEX = new Date().getMonth();

const MONTH_NAMES_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function buildMonthPills(chartData: ChartData): MonthPillData[] {
  return Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    const palNum = getPalaceForAspectLiuMonth("life", chartData, m, CURRENT_YEAR);
    const palace = palNum !== null ? chartData.palaces[palNum - 1] : null;
    const pData = palace ? PALACE_DATA[palace.name] : null;
    const signal = pData ? getSignalColor(pData.stars) : "yellow";
    return {
      monthIndex: i,
      shortName: MONTH_NAMES_SHORT[i] ?? String(m),
      palaceName: palace?.name ?? "-",
      signal,
      stars: (pData?.stars ?? 4) as 3 | 4 | 5,
    };
  });
}

const Shimmer: React.FC<{ className: string }> = ({ className }) => (
  <div
    className={["animate-pulse rounded-xl", className].join(" ")}
    style={{ background: "rgba(0,0,0,0.05)" }}
  />
);

interface ChapterExecutionPlaybookProps {
  strategicData: any;
  chartData: ChartData;
  profile: any;
}

export const ChapterExecutionPlaybook: React.FC<ChapterExecutionPlaybookProps> = ({
  strategicData,
  chartData,
  profile,
}) => {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(CURRENT_MONTH_INDEX);

  const monthPills = useMemo(() => (chartData ? buildMonthPills(chartData) : []), [chartData]);

  const selectedPalaceNum = useMemo(
    () =>
      chartData
        ? getPalaceForAspectLiuMonth("life", chartData, selectedMonthIndex + 1, CURRENT_YEAR)
        : null,
    [chartData, selectedMonthIndex]
  );

  const selectedPalace = useMemo(
    () =>
      selectedPalaceNum !== null && chartData
        ? chartData.palaces[selectedPalaceNum - 1] ?? null
        : null,
    [chartData, selectedPalaceNum]
  );

  const birthYear = new Date(profile.birthday).getFullYear();
  const currentStart = strategicData.dayun?.startYear ?? CURRENT_YEAR;
  const currentEnd = strategicData.dayun?.endYear ?? CURRENT_YEAR + 10;

  const cycles = chartData.palaces
    .filter((p) => p.majorLimit !== undefined)
    .sort((a, b) => (a.majorLimit?.startAge ?? 0) - (b.majorLimit?.startAge ?? 0))
    .map((p) => ({
      name: p.name,
      startYear: birthYear + (p.majorLimit?.startAge ?? 0),
      endYear: birthYear + (p.majorLimit?.endAge ?? 0),
    }));

  return (
    <section
      id="timing"
      className="scroll-mt-16 mb-32 pt-16 relative overflow-hidden bg-white rounded-[40px] p-10 md:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-[#e8ddd0]/50"
    >
      <SectionWatermark type="timeline" />
      <SectionHeader
        graphicType="timing"
        chapter="Chapter 04 · Execution Playbook"
        title="Your 12-Month Roadmap"
        subtitle={`You are in your ${strategicData.phaseLabel} Phase. Select any month to see its strategic briefing.`}
      />

      {/* DaYun All-Cycles Timeline (Product Roadmap Style) */}
      {cycles.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: C.navy }}>
              Macro Trajectory
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: C.coral }} />
              <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: C.coral }}>
                You Are Here
              </span>
            </div>
          </div>

          {/* Timeline Bar */}
          <div className="relative h-12 flex items-stretch gap-[1px]">
            {(() => {
              const timelineStart = cycles[0].startYear;
              const timelineEnd = cycles[cycles.length - 1].endYear;
              const totalSpan = timelineEnd - timelineStart;

              return cycles.map((cycle) => {
                const widthPct = ((cycle.endYear - cycle.startYear) / totalSpan) * 100;
                const isCurrent = cycle.startYear === currentStart;
                const isPast = cycle.endYear <= CURRENT_YEAR;

                return (
                  <div
                    key={cycle.name}
                    title={`${cycle.startYear}-${cycle.endYear}`}
                    className="relative flex flex-col justify-end pb-2 group"
                    style={{
                      width: `${widthPct}%`,
                      borderBottom: `2px solid ${isCurrent ? C.coral : isPast ? `${C.navy}20` : `${C.border}60`}`,
                    }}
                  >
                    {isCurrent && (
                      <div className="absolute bottom-0 left-0 h-[2px] w-full" style={{ background: C.coral }} />
                    )}
                    <span
                      className="text-[8px] font-bold uppercase tracking-wider text-center transition-colors"
                      style={{ color: isCurrent ? C.coral : isPast ? `${C.navy}40` : C.muted }}
                    >
                      {cycle.startYear}
                    </span>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* Phase Banner */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#e8ddd0] pb-8">
        <div className="max-w-xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] mb-3" style={{ color: C.coral }}>
            Current Strategic Phase ({currentStart}-{currentEnd})
          </p>
          <p className="text-3xl font-bold mb-4" style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}>
            {strategicData.phaseLabel} Phase
          </p>
          {strategicData.dayun !== null && (
            <p className="text-sm leading-relaxed" style={{ color: C.navy, opacity: 0.8 }}>
              {SEASON_STYLES[strategicData.phaseLabel as keyof typeof SEASON_STYLES]?.coreMessage ?? strategicData.dayun.coreMessage}
            </p>
          )}
        </div>
      </div>

      {/* Month grid */}
      <div className="mb-12">
        <MonthGrid
          months={monthPills}
          selectedMonthIndex={selectedMonthIndex}
          onSelect={setSelectedMonthIndex}
        />
      </div>

      {/* Month detail: Strategic Briefing */}
      {selectedPalaceNum !== null && selectedPalace !== null ? (() => {
        const mData = PALACE_MONTH_DATA[selectedPalace.name];
        const gData = PALACE_GUIDANCE_DATA[selectedPalace.name];
        const monthNum = selectedMonthIndex + 1;
        const mName = new Date(CURRENT_YEAR, monthNum - 1).toLocaleString("default", { month: "long" });

        if (!mData || !gData) {
          return (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-400">Briefing unavailable for this period.</p>
            </div>
          );
        }

        return (
          <div className="space-y-10">
            {/* Header */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] mb-2" style={{ color: C.coral }}>
                Monthly Briefing · {mName} {CURRENT_YEAR}
              </p>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <p className="text-2xl font-bold" style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}>
                  {mData.area} Focus
                </p>
                <div className="px-4 py-2 border border-[#e8ddd0] rounded-full">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Theme: </span>
                  <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: C.navy }}>
                    {SEASON_STYLES[mData.season]?.tagline ?? ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Dimension bars */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 border-b border-[#e8ddd0] pb-2" style={{ color: C.navy }}>
                Capacity Allocation
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mData.dimensionBars.map((bar) => (
                  <div key={bar.label}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{bar.icon}</span>
                        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.navy }}>
                          {bar.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold" style={{ color: C.navy }}>{bar.pct}%</span>
                    </div>
                    <div className="h-[2px] w-full bg-[#f0e8e0]">
                      <div
                        className="h-full"
                        style={{
                          width: `${bar.pct}%`,
                          background: bar.pct >= 70 ? C.coral : C.navy,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Playbook Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Executive Action */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: C.navy }}>
                    <span className="text-white text-xs">▸</span>
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: C.navy }}>
                    Executive Action
                  </p>
                </div>
                <div className="space-y-4">
                  {gData.keyActions.slice(0, 3).map((action, idx) => (
                    <div key={idx} className="pb-3 border-b border-[#e8ddd0]/50 last:border-0">
                      <p className="text-sm leading-relaxed" style={{ color: C.navy }}>{action}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Mitigation */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center border" style={{ borderColor: C.coral, color: C.coral }}>
                    <span className="text-xs font-bold">!</span>
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: C.coral }}>
                    Risk Mitigation
                  </p>
                </div>
                <div className="space-y-4">
                  {gData.watchOut.slice(0, 3).map((warning, idx) => (
                    <div key={idx} className="pb-3 border-b border-[#e8ddd0]/50 last:border-0">
                      <p className="text-sm leading-relaxed text-gray-600">{warning}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Strategic Reflection */}
            <div className="pt-8 border-t border-[#e8ddd0]">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: C.navy }}>
                Strategic Reflection
              </p>
              <div className="space-y-4">
                {gData.reflectionQuestions.slice(0, 2).map((q, idx) => (
                  <p
                    key={idx}
                    className="text-sm italic text-gray-600 pl-4 py-1"
                    style={{ borderLeft: `2px solid ${C.coral}` }}
                  >
                    &quot;{q}&quot;
                  </p>
                ))}
              </div>
            </div>

          </div>
        );
      })() : (
        <Shimmer className="h-64 w-full" />
      )}
    </section>
  );
};
