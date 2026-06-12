import React from "react";
import { useLanguage } from "../../../context/LanguageContext";
import type { ChartData, Palace } from "../../../utils/zwds/types";
import { STAR_BRIEF } from "../../../utils/forecast/starBriefDescriptions";
import {
  C,
  PALACE_ENGLISH,
  TRANSFORMATION_ENGLISH,
  classifyMainStar,
  BRANCH_TO_AREA,
} from "./constants";

export const TwelvePalaceMiniGrid: React.FC<{ chartData: ChartData; highlightPalaces?: string[] }> = ({ chartData, highlightPalaces }) => {
  const { t } = useLanguage();
  const lifePalaceNum = chartData.lifePalace;

  /** Single cell: either a palace or the center */
  const Cell: React.FC<{ palace: Palace }> = ({ palace }) => {
    const isLife  = palace.number === lifePalaceNum;
    const isHighlighted = highlightPalaces ? highlightPalaces.includes(palace.name) : isLife;
    const isBody  = palace.name === chartData.palaces[chartData.bodyPalace - 1]?.name;
    let mainStars = palace.mainStar ?? [];
    let minorStars = palace.minorStars ?? [];

    const englishName = PALACE_ENGLISH[palace.name] ?? "Palace";

    return (
      <div
        style={{
          gridArea: BRANCH_TO_AREA[palace.earthlyBranch] ?? "p_yin",
          background: isHighlighted ? C.cream : C.white,
          border: `1px solid ${isHighlighted ? C.coral : `${C.border}80`}`,
          borderRadius: 2, // Very sharp for authentic grid look
          padding: "8px",
          minHeight: 90,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
          opacity: highlightPalaces && !isHighlighted ? 0.35 : 1,
          transition: "opacity 0.3s ease",
        }}
      >
        {/* Authentic Watermark */}
        <div className="absolute bottom-0 right-1 text-[40px] font-bold opacity-[0.04] pointer-events-none leading-none select-none" style={{ color: C.navy, fontFamily: "serif" }}>
          {palace.name}
        </div>

        {/* Top: Stars */}
        <div className="relative z-10 flex flex-col gap-0.5">
          {minorStars.map((star) => {
            return (
              <div key={star.name} className="flex items-center gap-1 flex-wrap">
                <span
                  className="text-[9px] font-medium tracking-wide"
                  style={{
                    color: C.navy,
                    fontFamily: "Georgia, serif"
                  }}
                >
                  {STAR_BRIEF[star.name]?.pinyin ?? star.name}
                </span>
                {star.transformations?.map((trans, idx) => {
                  const transEng = TRANSFORMATION_ENGLISH[trans];
                  return transEng ? (
                    <span key={idx} style={{ color: C.gold, fontSize: 7, fontWeight: "bold" }}>[{transEng}]</span>
                  ) : null;
                })}
              </div>
            );
          })}
          {mainStars.map((star) => {
            const ns = classifyMainStar(star.name);
            
            return (
              <div key={star.name} className="flex items-center gap-1 flex-wrap">
                <span
                  className="text-[9px] font-bold tracking-wide"
                  style={{
                    color: ns === "north" ? "#1e3a8a" : ns === "south" ? "#9f1239" : C.navy,
                    fontFamily: "Georgia, serif"
                  }}
                >
                  {STAR_BRIEF[star.name]?.pinyin ?? star.name}
                </span>
                {star.transformations?.map((trans, idx) => {
                  const transEng = TRANSFORMATION_ENGLISH[trans];
                  return transEng ? (
                    <span key={idx} style={{ color: C.gold, fontSize: 7, fontWeight: "bold" }}>[{transEng}]</span>
                  ) : null;
                })}
              </div>
            );
          })}
        </div>

        {/* Bottom: Palace Name & Badges */}
        <div className="relative z-10 mt-auto flex flex-col items-end text-right pt-2">
          <div className="flex gap-1 mb-0.5">
            {isLife && (
              <span className="text-[5px] bg-[#e8642d] text-white px-1 uppercase font-bold tracking-wider">Life</span>
            )}
            {isBody && (
              <span className="text-[5px] bg-[#151833] text-white px-1 uppercase font-bold tracking-wider">Body</span>
            )}
          </div>
          <span className="text-[8px] font-bold text-[#151833] uppercase tracking-wider">
            {englishName}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateAreas: `
          "p_si   p_wu   p_wei  p_shen"
          "p_chen center center p_you"
          "p_mao  center center p_xu"
          "p_yin  p_chou p_zi   p_hai"
        `,
        gridTemplateColumns: "repeat(4, 1fr)",
        gridTemplateRows: "repeat(4, auto)",
        gap: 4,
        padding: 4,
        background: `${C.border}30`,
        borderRadius: 4,
      }}
    >
      {/* 12 palace cells */}
      {chartData.palaces.map((palace) => (
        <Cell key={palace.number} palace={palace} />
      ))}

      {/* Center: person info */}
      <div
        style={{
          gridArea: "center",
          background: C.white,
          border: `1px solid ${C.border}80`,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ background: C.navy, padding: "8px 0", textAlign: "center" }}>
          <p className="text-sm font-bold tracking-wider" style={{ color: C.cream, textTransform: "uppercase" }}>
            {chartData.input.name}
          </p>
        </div>
        
        {/* Body */}
        <div className="flex flex-col gap-1.5 p-3 text-[9px] flex-1 overflow-y-auto hide-scrollbar" style={{ color: C.navy }}>
          <div className="flex">
            <span className="w-20 font-semibold shrink-0" style={{ color: C.muted }}>Solar Date:</span>
            <span>
              {chartData.input.year} Year {chartData.input.month} Month {chartData.input.day} Day {chartData.input.hour} Hour
            </span>
          </div>
          <div className="flex">
            <span className="w-20 font-semibold shrink-0" style={{ color: C.muted }}>Lunar Date:</span>
            <span>
              {t(`zwds.stems.${chartData.heavenlyStem}`)} {t(`zwds.branches.${chartData.earthlyBranch}`)}{chartData.lunarDate.year} Year {chartData.lunarDate.month} Month {chartData.lunarDate.day} Day {chartData.input.hour} Hour
            </span>
          </div>
          <div className="flex">
            <span className="w-20 font-semibold shrink-0" style={{ color: C.muted }}>Five Element:</span>
            <span>{t(`zwds.fiveElements.${chartData.fiveElements}`)}</span>
          </div>
          <div className="flex">
            <span className="w-20 font-semibold shrink-0" style={{ color: C.muted }}>Gender:</span>
            <span>{chartData.input.gender === "male" ? "Male" : "Female"}</span>
          </div>
          <div className="flex">
            <span className="w-20 font-semibold shrink-0" style={{ color: C.muted }}>Age:</span>
            <span>{new Date().getFullYear() - chartData.lunarDate.year + 1}</span>
          </div>
          <div className="flex">
            <span className="w-20 font-semibold shrink-0" style={{ color: C.muted }}>Chinese Zodiac:</span>
            <span>
              {["🐭", "🐂", "🐯", "🐰", "🐲", "🐍", "🐴", "🐑", "🐵", "🐔", "🐶", "🐷"][(chartData.lunarDate.year - 4) % 12]}{" "}
              {["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Sheep", "Monkey", "Rooster", "Dog", "Pig"][(chartData.lunarDate.year - 4) % 12]}
            </span>
          </div>
          <div className="flex">
            <span className="w-20 font-semibold shrink-0" style={{ color: C.muted }}>Western Zodiac:</span>
            <span>
              {(() => {
                const month = chartData.input.month;
                const day = chartData.input.day;
                if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "♈ Aries";
                if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "♉ Taurus";
                if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return "♊ Gemini";
                if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return "♋ Cancer";
                if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "♌ Leo";
                if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "♍ Virgo";
                if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return "♎ Libra";
                if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return "♏ Scorpio";
                if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return "♐ Sagittarius";
                if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "♑ Capricorn";
                if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "♒ Aquarius";
                return "♓ Pisces";
              })()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
