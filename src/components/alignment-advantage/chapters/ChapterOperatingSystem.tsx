import React, { useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import type { ChartData, Palace } from "../../../utils/zwds/types";
import type { StructureLabel } from "../../../utils/forecast/structureContentData";
import { C } from "../shared/constants";
import { SectionWatermark } from "../shared/SectionWatermark";
import { SectionHeader } from "../shared/SectionHeader";

const getPalaceByName = (palaces: Palace[], name: string) =>
  palaces.find((p) => p.name === name);

export const ChapterOperatingSystem: React.FC<{
  chartData: ChartData;
  strLabel: StructureLabel;
}> = ({ chartData, strLabel }) => {
  // 1. Calculate Radar Data
  const radarData = useMemo(() => {
    if (!chartData) return [];

    const lifePalace = getPalaceByName(chartData.palaces, "命宫");
    const innerPowerPalace = getPalaceByName(chartData.palaces, "福德");
    const healthPalace = getPalaceByName(chartData.palaces, "疾厄");

    const calculateScore = (palace?: Palace) => {
      const mainStars = palace?.mainStar?.length || 0;
      const minorStars = palace?.minorStars?.length || 0;
      // Base score 40, max 100
      let score = 40 + mainStars * 25 + minorStars * 10;
      return Math.min(100, Math.max(30, score));
    };

    return [
      {
        subject: "Identity & Drive",
        fullMark: 100,
        score: calculateScore(lifePalace),
      },
      {
        subject: "Mental Resilience",
        fullMark: 100,
        score: calculateScore(innerPowerPalace),
      },
      {
        subject: "Physical Output",
        fullMark: 100,
        score: calculateScore(healthPalace),
      },
    ];
  }, [chartData]);

  // 2. Dynamic Matrix Content based on Player Type
  const matrixContent = useMemo(() => {
    const isSpeed = strLabel.label.includes("Speed");

    if (isSpeed) {
      return {
        optimal:
          "High-velocity environments with short feedback loops. You thrive when you can launch, iterate, and pivot quickly. Look for roles or markets where first-mover advantage is rewarded.",
        burnout:
          "Bureaucracy, endless planning cycles, and maintenance mode. Being forced to sit still or manage slow, incremental improvements will drain your drive rapidly.",
        delegation:
          "Deep operational maintenance, long-term compliance, and repetitive administrative tasks. Outsource the 'keeping the lights on' work so you can stay focused on the next breakthrough.",
      };
    } else {
      return {
        optimal:
          "Structured environments that reward deep mastery and compounding returns. You thrive when you can build robust systems, optimize processes, and play long-term games.",
        burnout:
          "Constant context-switching, chaotic pivots, and environments that prioritize speed over quality. Forcing yourself to react instantly without a plan will deplete your resilience.",
        delegation:
          "High-frequency transactional tasks, cold outreach, and rapid prototyping. Outsource the chaotic 'first draft' work so you can focus on building the enduring architecture.",
      };
    }
  }, [strLabel.label]);

  return (
    <section
      id="operate"
      className="scroll-mt-16 mb-32 pt-16 relative overflow-hidden bg-white rounded-[40px] p-10 md:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-[#e8ddd0]/50"
    >
      <SectionWatermark type="nodes" />
      <SectionHeader
        graphicType="operate"
        chapter="Chapter 02 · Operating System"
        title="Executive Capacity"
        subtitle="Three core domains that reveal how you think, what drives you, and how you execute."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative z-10">
        {/* Left Column: Executive Bandwidth Radar (Visual) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-px" style={{ background: C.coral }} />
            <p
              className="text-[10px] font-bold uppercase tracking-[0.3em]"
              style={{ color: C.coral }}
            >
              Executive Bandwidth Radar
            </p>
          </div>

          <div
            className="flex-grow flex items-center justify-center rounded-3xl p-6"
            style={{
              background: `linear-gradient(135deg, ${C.navy}03, ${C.navy}08)`,
              border: `1px solid ${C.border}60`,
            }}
          >
            <div className="w-full aspect-square max-w-[320px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke={`${C.navy}20`} />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{
                      fill: C.navy,
                      fontSize: 10,
                      fontWeight: "bold",
                      fontFamily: "sans-serif",
                      letterSpacing: "0.1em",
                    }}
                  />
                  <Radar
                    name="Capacity"
                    dataKey="score"
                    stroke={C.coral}
                    strokeWidth={2}
                    fill={C.coral}
                    fillOpacity={0.15}
                  />
                </RadarChart>
              </ResponsiveContainer>
              {/* Center decorative dot */}
              <div
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{ background: C.coral }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Founder's Environment Matrix (Action) */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-px" style={{ background: C.coral }} />
            <p
              className="text-[10px] font-bold uppercase tracking-[0.3em]"
              style={{ color: C.coral }}
            >
              Strategic Environment Matrix
            </p>
          </div>

          <div className="space-y-8">
            {/* 1. Optimal Conditions */}
            <div className="flex gap-5">
              <div
                className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-lg font-bold"
                style={{
                  background: `${C.coral}15`,
                  color: C.coral,
                  fontFamily: "Georgia,'Times New Roman',serif",
                }}
              >
                1
              </div>
              <div>
                <h4
                  className="text-xl font-bold mb-2"
                  style={{
                    color: C.navy,
                    fontFamily: "Georgia,'Times New Roman',serif",
                  }}
                >
                  Optimal Conditions
                </h4>
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3"
                  style={{ color: "#16a34a" }}
                >
                  Where You Thrive
                </p>
                <p className="text-sm leading-relaxed" style={{ color: C.navy }}>
                  {matrixContent.optimal}
                </p>
              </div>
            </div>

            {/* 2. Burnout Triggers */}
            <div className="flex gap-5">
              <div
                className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-lg font-bold"
                style={{
                  background: `${C.coral}15`,
                  color: C.coral,
                  fontFamily: "Georgia,'Times New Roman',serif",
                }}
              >
                2
              </div>
              <div>
                <h4
                  className="text-xl font-bold mb-2"
                  style={{
                    color: C.navy,
                    fontFamily: "Georgia,'Times New Roman',serif",
                  }}
                >
                  Burnout Triggers
                </h4>
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3"
                  style={{ color: C.coral }}
                >
                  What Drains You
                </p>
                <p className="text-sm leading-relaxed" style={{ color: C.navy }}>
                  {matrixContent.burnout}
                </p>
              </div>
            </div>

            {/* 3. Delegation Mandate */}
            <div className="flex gap-5">
              <div
                className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-lg font-bold"
                style={{
                  background: `${C.coral}15`,
                  color: C.coral,
                  fontFamily: "Georgia,'Times New Roman',serif",
                }}
              >
                3
              </div>
              <div>
                <h4
                  className="text-xl font-bold mb-2"
                  style={{
                    color: C.navy,
                    fontFamily: "Georgia,'Times New Roman',serif",
                  }}
                >
                  Delegation Mandate
                </h4>
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3"
                  style={{ color: C.gold }}
                >
                  What You Must Outsource
                </p>
                <p className="text-sm leading-relaxed" style={{ color: C.navy }}>
                  {matrixContent.delegation}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
