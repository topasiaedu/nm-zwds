import React from "react";
import { useLanguage } from "../../../context/LanguageContext";
import type { ChartData, Palace } from "../../../utils/zwds/types";
import { STAR_BRIEF } from "../../../utils/forecast/starBriefDescriptions";
import {
  C,
  PALACE_ENGLISH,
  getTransformationColor,
  getTransformationShortLabel,
  BRANCH_TO_AREA,
} from "./constants";

const CHINESE_ZODIAC_EMOJI = [
  "🐭", "🐂", "🐯", "🐰", "🐲", "🐍", "🐴", "🐑", "🐵", "🐔", "🐶", "🐷",
] as const;

const CHINESE_ZODIAC_NAMES = [
  "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
  "Horse", "Sheep", "Monkey", "Rooster", "Dog", "Pig",
] as const;

/**
 * Resolve western zodiac display label from solar month/day.
 */
function getWesternZodiacLabel(month: number, day: number): string {
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
}

interface CenterInfoRowProps {
  label: string;
  children: React.ReactNode;
}

/**
 * Center field — always label-above-value (AA center cell is a narrow 2×2 grid area).
 */
const CenterInfoRow: React.FC<CenterInfoRowProps> = ({ label, children }) => (
  <div className="flex min-w-0 flex-col gap-0.5">
    <span
      className="shrink-0 text-[8px] font-semibold uppercase tracking-wide sm:text-[9px]"
      style={{ color: C.muted }}
    >
      {label}
    </span>
    <span className="min-w-0 break-words whitespace-normal leading-snug">
      {children}
    </span>
  </div>
);

export const TwelvePalaceMiniGrid: React.FC<{ chartData: ChartData; highlightPalaces?: string[] }> = ({ chartData, highlightPalaces }) => {
  const { t } = useLanguage();
  const lifePalaceNum = chartData.lifePalace;
  const chineseZodiacIndex = (chartData.lunarDate.year - 4) % 12;
  const age = new Date().getFullYear() - chartData.lunarDate.year + 1;

  /** Single cell: either a palace or the center */
  const Cell: React.FC<{ palace: Palace }> = ({ palace }) => {
    const isLife  = palace.number === lifePalaceNum;
    const isHighlighted = highlightPalaces ? highlightPalaces.includes(palace.name) : isLife;
    const isBody  = palace.name === chartData.palaces[chartData.bodyPalace - 1]?.name;
    const mainStars = palace.mainStar ?? [];
    const minorStars = palace.minorStars ?? [];

    const englishName = PALACE_ENGLISH[palace.name] ?? "Palace";

    return (
      <div
        data-aa-palace-cell=""
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
                  const label = getTransformationShortLabel(trans);
                  const color = getTransformationColor(trans);
                  return label && color ? (
                    <span key={idx} style={{ color, fontSize: 7, fontWeight: "bold" }}>{label}</span>
                  ) : null;
                })}
              </div>
            );
          })}
          {mainStars.map((star) => {
            return (
              <div key={star.name} className="flex items-center gap-1 flex-wrap">
                <span
                  className="text-[9px] font-bold tracking-wide"
                  style={{
                    color: C.navy,
                    fontFamily: "Georgia, serif"
                  }}
                >
                  {STAR_BRIEF[star.name]?.pinyin ?? star.name}
                </span>
                {star.transformations?.map((trans, idx) => {
                  const label = getTransformationShortLabel(trans);
                  const color = getTransformationColor(trans);
                  return label && color ? (
                    <span key={idx} style={{ color, fontSize: 7, fontWeight: "bold" }}>{label}</span>
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
      data-aa-mini-grid=""
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
        data-aa-mini-grid-center=""
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
        <div
          data-aa-mini-grid-center-header=""
          style={{ background: C.navy, padding: "8px 0", textAlign: "center" }}
        >
          <p className="text-sm font-bold tracking-wider" style={{ color: C.cream, textTransform: "uppercase" }}>
            {chartData.input.name}
          </p>
        </div>
        
        {/* Body — stacked label-above-value (center cell is always narrow) */}
        <div
          className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-1.5 text-[9px] hide-scrollbar sm:p-3"
          style={{ color: C.navy }}
          data-aa-center-info="true"
        >
          <CenterInfoRow label="Solar Date:">
            {chartData.input.year} Year {chartData.input.month} Month {chartData.input.day} Day {chartData.input.hour} Hour
          </CenterInfoRow>
          <CenterInfoRow label="Lunar Date:">
            {t(`zwds.stems.${chartData.heavenlyStem}`)} {t(`zwds.branches.${chartData.earthlyBranch}`)}
            {chartData.lunarDate.year} Year {chartData.lunarDate.month} Month {chartData.lunarDate.day} Day {chartData.input.hour} Hour
          </CenterInfoRow>
          <CenterInfoRow label="Five Element:">
            {t(`zwds.fiveElements.${chartData.fiveElements}`)}
          </CenterInfoRow>
          <CenterInfoRow label="Gender:">
            {chartData.input.gender === "male" ? "Male" : "Female"}
          </CenterInfoRow>
          <CenterInfoRow label="Age:">{age}</CenterInfoRow>
          <CenterInfoRow label="Chinese Zodiac:">
            {CHINESE_ZODIAC_EMOJI[chineseZodiacIndex]} {CHINESE_ZODIAC_NAMES[chineseZodiacIndex]}
          </CenterInfoRow>
          <CenterInfoRow label="Western Zodiac:">
            {getWesternZodiacLabel(chartData.input.month, chartData.input.day)}
          </CenterInfoRow>
        </div>
      </div>
    </div>
  );
};
