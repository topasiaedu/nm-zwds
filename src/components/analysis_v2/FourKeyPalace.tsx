/**
 * FourKeyPalace — Destiny Alert Map (Section 05)
 *
 * 2×2 grid of natal transformations (祿 / 權 / 科 / 忌) — flat accent panels.
 * Semantic accent colors per type: green, blue, amber, red (left border + pill).
 */

import React from "react";
import {
  AlertTriangle,
  Compass,
  Crown,
  Gem,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { ChartData } from "../../utils/zwds/types";
import { analyzeDestinyAlert } from "../../utils/zwds/analysis";
import type { PalaceAlertData } from "../../utils/zwds/analysis/destinyAlertAnalysis";
import { BrandGradientText } from "../BrandGradientText";
import { analysisPanelTitleClass } from "../../styles/typographyUi";
import { AnalysisSectionHeader } from "./shared/AnalysisSectionHeader";
import { SubsectionSparkleDivider } from "./shared/SubsectionSparkleDivider";

/**
 * Per-transformation accent — left border + pill only (semantic hues unchanged).
 */
type TransformationConfig = {
  heroQuestion: string;
  icon: LucideIcon;
  accentColor: string;
  transformationChar: string;
};

const TRANSFORMATION_CONFIG: Record<string, TransformationConfig> = {
  "化祿": {
    heroQuestion: "Where does wealth flow?",
    icon: Wallet,
    accentColor: "#059669",
    transformationChar: "祿",
  },
  "化權": {
    heroQuestion: "Where does power rise?",
    icon: Crown,
    accentColor: "#2563eb",
    transformationChar: "權",
  },
  "化科": {
    heroQuestion: "Where does your fame rise?",
    icon: Gem,
    accentColor: "#d97706",
    transformationChar: "科",
  },
  "化忌": {
    heroQuestion: "Where is energy blocked?",
    icon: AlertTriangle,
    accentColor: "#dc2626",
    transformationChar: "忌",
  },
};

const normaliseTransformation = (t: string): string => {
  if (t === "化禄") return "化祿";
  if (t === "化权") return "化權";
  return t;
};

const STAR_NAME_TO_PINYIN: Record<string, string> = {
  "紫微": "Zi Wei",
  "天機": "Tian Ji",
  "太陽": "Tai Yang",
  "武曲": "Wu Qu",
  "天同": "Tian Tong",
  "廉貞": "Lian Zhen",
  "天府": "Tian Fu",
  "太陰": "Tai Yin",
  "貪狼": "Tan Lang",
  "巨門": "Ju Men",
  "天相": "Tian Xiang",
  "天梁": "Tian Liang",
  "七殺": "Qi Sha",
  "破軍": "Po Jun",
  "文昌": "Wen Chang",
  "文曲": "Wen Qu",
  "左輔": "Zuo Fu",
  "右弼": "You Bi",
  "天机": "Tian Ji",
  "太阳": "Tai Yang",
  "廉贞": "Lian Zhen",
  "太阴": "Tai Yin",
  "贪狼": "Tan Lang",
  "巨门": "Ju Men",
  "七杀": "Qi Sha",
  "破军": "Po Jun",
  "左辅": "Zuo Fu",
};

const getStarPinyin = (chineseName: string): string =>
  STAR_NAME_TO_PINYIN[chineseName] ?? chineseName;

type FourKeyPalaceProps = {
  chartData: ChartData;
  resolvePalaceName?: (palaceNumber: number) => string;
  forPdfCapture?: boolean;
};

type DestinyAlertCardProps = {
  alert: PalaceAlertData;
  config: TransformationConfig;
  displayPalace: string;
  pdfPageBreakBefore?: boolean;
};

const DestinyAlertCard: React.FC<DestinyAlertCardProps> = ({
  alert,
  config,
  displayPalace,
  pdfPageBreakBefore,
}) => {
  const HeaderIcon = config.icon;

  return (
    <article
      {...(pdfPageBreakBefore ? { "data-pdf-page-break-before": "" } : {})}
      className="relative border-l-4 py-4 pl-5 pr-4 sm:pl-6 sm:pr-5"
      style={{ borderColor: config.accentColor }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-1 select-none text-[100px] font-black leading-none sm:text-[110px]"
        style={{
          color: config.accentColor,
          opacity: 0.08,
          lineHeight: 1,
        }}
      >
        {config.transformationChar}
      </div>

      <div className="relative z-10">
      <div className="flex items-start gap-3">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 shadow-sm"
          style={{
            backgroundColor: config.accentColor,
            borderColor: config.accentColor,
          }}
        >
          <HeaderIcon
            className="h-7 w-7 text-white"
            aria-hidden="true"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black uppercase leading-snug tracking-wide text-theme-fg sm:text-base">
            {config.heroQuestion}
          </p>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-2">
            <BrandGradientText
              as="h3"
              className={analysisPanelTitleClass}
            >
              {displayPalace}
            </BrandGradientText>
            <span
              className="rounded-full border px-3 py-1 text-sm font-semibold"
              style={{
                borderColor: config.accentColor,
                color: config.accentColor,
                backgroundColor: `color-mix(in srgb, ${config.accentColor} 14%, transparent)`,
              }}
            >
              {getStarPinyin(alert.starName)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 text-sm leading-relaxed text-theme-fg-secondary">
        <p>{alert.line1}</p>
        <p>{alert.line2}</p>
        <BrandGradientText as="p" variant="secondary" className="font-semibold italic">
          {alert.line3}
        </BrandGradientText>
      </div>
      </div>
    </article>
  );
};

const FourKeyPalace: React.FC<FourKeyPalaceProps> = ({
  chartData,
  resolvePalaceName,
  forPdfCapture,
}) => {
  const analysisResult = analyzeDestinyAlert(chartData);

  const sectionShell = (content: React.ReactNode) => (
    <div className="p-6">
      <div {...(forPdfCapture ? { "data-pdf-page-break-before": "" } : {})}>
        <AnalysisSectionHeader
          sectionLabel="Transformation signals"
          badgeText="05"
          title="Destiny Alert Map"
          subtitle="Four signals showing where your life force is most activated — wealth, power, fame, and friction."
          icon={Compass}
          pdfBreakAnchor="destiny-alert-hero"
          forPdfCapture={forPdfCapture}
        />
        <SubsectionSparkleDivider />
      </div>
      {content}
    </div>
  );

  if (analysisResult.alerts.length === 0) {
    return sectionShell(
      <p className="py-8 text-center text-gray-500 dark:text-gray-400">
        No transformation data available.
      </p>
    );
  }

  return sectionShell(
    <div
      data-pdf-break-anchor="four-key-grid"
      className={
        forPdfCapture
          ? "grid grid-cols-1 gap-8"
          : "grid grid-cols-1 gap-8 sm:grid-cols-2"
      }
    >
      {analysisResult.alerts.map((alert, index) => {
        const key = normaliseTransformation(alert.transformation);
        const config = TRANSFORMATION_CONFIG[key] ?? TRANSFORMATION_CONFIG["化忌"];
        const displayPalace =
          (resolvePalaceName ? resolvePalaceName(alert.palaceNumber) : "") ||
          alert.palace;

        return (
          <DestinyAlertCard
            key={`${alert.palaceNumber}-${alert.transformation}`}
            alert={alert}
            config={config}
            displayPalace={displayPalace}
            pdfPageBreakBefore={Boolean(forPdfCapture && index === 2)}
          />
        );
      })}
    </div>
  );
};

export default FourKeyPalace;
