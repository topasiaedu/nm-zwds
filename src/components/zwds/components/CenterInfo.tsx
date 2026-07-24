import React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Droplets, CalendarDays, Flame, Gem, Leaf, Moon, Mountain, Sparkles, Sun, User } from "lucide-react";
import { ChartData } from "../../../utils/zwds/types";
import { useLanguage } from "../../../context/LanguageContext";
import ZodiacIcons from "../icons";
import WesternZodiacIcons, { type WesternZodiacKey } from "../icons/western";
import ZodiacIconWrapper from "./ZodiacIconWrapper";
import { getChartAvatarSrc } from "../utils/chartAvatar";
import {
  formatChartLunarDate,
  formatChartSolarDate,
} from "../utils/chartDateLabels";
import {
  chartCenterBlueprintClass,
  chartCenterContentClass,
  chartCenterDateIconClass,
  chartCenterDateIconWrapClass,
  chartCenterDateLabelClass,
  chartCenterDateRowClass,
  chartCenterDateRowIconWrapClass,
  chartCenterDateValueClass,
  chartCenterDatesPanelClass,
  chartCenterDividerClass,
  chartCenterElementClass,
  chartCenterEmblemRingClass,
  chartCenterHeroClass,
  chartCenterHeroWrapClass,
  chartCenterNameClass,
  chartCenterPanelClass,
  chartCenterZodiacCardClass,
  chartCenterZodiacCardIconSlotClass,
  chartCenterZodiacCardLabelClass,
  chartCenterZodiacCardValueClass,
  chartCenterZodiacGridClass,
} from "../../../styles/chartUi";

interface CenterInfoProps {
  chartData: ChartData;
  isPdfExport?: boolean;
}

const ZODIAC_KEYS_EN = [
  "rat",
  "ox",
  "tiger",
  "rabbit",
  "dragon",
  "snake",
  "horse",
  "sheep",
  "monkey",
  "rooster",
  "dog",
  "pig",
] as const;

const ZODIAC_KEYS_ZH = [
  "鼠",
  "牛",
  "虎",
  "兔",
  "龙",
  "蛇",
  "马",
  "羊",
  "猴",
  "鸡",
  "狗",
  "猪",
] as const;

const WESTERN_ZODIAC_NAMES_ZH: Record<WesternZodiacKey, string> = {
  aries: "白羊座",
  taurus: "金牛座",
  gemini: "雙子座",
  cancer: "巨蟹座",
  leo: "獅子座",
  virgo: "處女座",
  libra: "天秤座",
  scorpio: "天蠍座",
  sagittarius: "射手座",
  capricorn: "摩羯座",
  aquarius: "水瓶座",
  pisces: "雙魚座",
};

/**
 * Resolve western zodiac key from solar month/day.
 */
function getWesternZodiacKey(month: number, day: number): WesternZodiacKey {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return "gemini";
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return "cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return "libra";
  if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return "scorpio";
  if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return "sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "aquarius";
  return "pisces";
}

/**
 * Pick a Lucide icon that matches the five-element bureau.
 */
function getFiveElementIcon(fiveElementsKey: string): LucideIcon {
  if (fiveElementsKey.includes("木") || fiveElementsKey.toLowerCase().includes("wood")) {
    return Leaf;
  }
  if (fiveElementsKey.includes("火") || fiveElementsKey.toLowerCase().includes("fire")) {
    return Flame;
  }
  if (fiveElementsKey.includes("金") || fiveElementsKey.toLowerCase().includes("metal")) {
    return Gem;
  }
  if (fiveElementsKey.includes("土") || fiveElementsKey.toLowerCase().includes("earth")) {
    return Mountain;
  }
  return Droplets;
}

/**
 * Center panel — destiny blueprint hero + zodiac cards.
 */
const CenterInfo: React.FC<CenterInfoProps> = ({ chartData, isPdfExport = false }) => {
  const { t, language } = useLanguage();
  const { input } = chartData;

  const centerInfoVariants = isPdfExport
    ? undefined
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: 0.6 },
        },
      };

  const chineseZodiacIndex = (chartData.lunarDate.year - 4) % 12;
  const chineseZodiacKey = ZODIAC_KEYS_EN[chineseZodiacIndex];
  const chineseZodiacIconKey =
    chineseZodiacKey === "sheep" ? "goat" : chineseZodiacKey;
  const ChineseZodiacIcon = ZodiacIcons[chineseZodiacIconKey];

  const westernZodiacKey = getWesternZodiacKey(input.month, input.day);
  const WesternZodiacIcon = WesternZodiacIcons[westernZodiacKey];

  const fiveElementsKey = chartData.fiveElements ?? "";
  const fiveElementLabel = fiveElementsKey
    ? t(`zwds.fiveElements.${fiveElementsKey}`)
    : "";
  const FiveElementIcon = getFiveElementIcon(fiveElementsKey);

  const age = new Date().getFullYear() - chartData.lunarDate.year + 1;
  const avatarSrc = getChartAvatarSrc(input.gender, age);

  const genderLabel =
    language === "en"
      ? t(`myChart.fields.${input.gender === "female" ? "female" : "male"}`)
      : (chartData.yinYang === "Yin" ? t("zwds.chart.陰") || "陰" : t("zwds.chart.陽") || "陽") +
        (input.gender === "female" ? t("zwds.chart.女") || "女" : t("zwds.chart.男") || "男");

  const chineseZodiacLabel =
    language === "en"
      ? t(`zwds.zodiac.${chineseZodiacKey}`)
      : t(`zwds.zodiac.${ZODIAC_KEYS_ZH[chineseZodiacIndex]}`) ||
        ZODIAC_KEYS_ZH[chineseZodiacIndex];

  const westernZodiacLabel =
    t(`zwds.westernZodiac.${westernZodiacKey}`) ||
    WESTERN_ZODIAC_NAMES_ZH[westernZodiacKey];

  const blueprintTitle =
    language === "en" ? "Destiny Blueprint" : t("zwds.chart.命主") || "命盤";

  const ageLabel = language === "en" ? "Age" : "年齡";
  const ageValue =
    language === "en" ? String(age) : `${age}${t("zwds.chart.歲") || "歲"}`;

  return (
    <motion.div
      className={chartCenterPanelClass}
      variants={centerInfoVariants}
      initial={isPdfExport ? false : "hidden"}
      animate={isPdfExport ? false : "visible"}
    >
      <div className={chartCenterContentClass}>
        {/* Hero — vertically centered in the 2×2 cell; layout/size unchanged */}
        <div className={chartCenterHeroWrapClass}>
          <div className={chartCenterHeroClass}>
          <div className="relative">
            <Sparkles
              className="absolute -left-2 -top-1 hidden h-3 w-3 text-[#C5A059] sm:block sm:h-3.5 sm:w-3.5"
              aria-hidden="true"
            />
            <Sparkles
              className="absolute -right-2 top-0 hidden h-2.5 w-2.5 text-[#C5A059]/80 sm:block sm:h-3 sm:w-3"
              aria-hidden="true"
            />
            <div className={chartCenterEmblemRingClass}>
              <img
                src={avatarSrc}
                alt={
                  input.name
                    ? `${input.name} avatar`
                    : t("result.chart") || "Chart avatar"
                }
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <Sparkles
              className="absolute -bottom-1 -right-1.5 hidden h-3 w-3 text-[#C5A059] sm:block sm:h-3.5 sm:w-3.5"
              aria-hidden="true"
            />
          </div>

          <motion.h2
            className={chartCenterNameClass}
            initial={isPdfExport ? false : { opacity: 0 }}
            animate={isPdfExport ? false : { opacity: 1 }}
            transition={isPdfExport ? { duration: 0 } : { duration: 0.5 }}
          >
            {input.name || t("result.chart")}
          </motion.h2>

          <div className="mt-0.5 sm:mt-1 flex w-full items-center justify-center gap-1 sm:gap-1.5">
            <span className="h-px max-w-[2.5rem] flex-1 bg-[#C5A059]/50" aria-hidden="true" />
            <span className={`${chartCenterBlueprintClass} shrink-0 px-1`}>
              {blueprintTitle}
            </span>
            <span className="h-px max-w-[2.5rem] flex-1 bg-[#C5A059]/50" aria-hidden="true" />
          </div>

          {fiveElementLabel && (
            <div className={chartCenterElementClass}>
              <FiveElementIcon
                className="h-3.5 w-3.5 text-[#C5A059] sm:h-4 sm:w-4"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span>{fiveElementLabel}</span>
            </div>
          )}

          <div className={chartCenterDividerClass} aria-hidden="true" />

          <div className={chartCenterZodiacGridClass}>
            <div className={chartCenterZodiacCardClass}>
              <div className={chartCenterZodiacCardIconSlotClass}>
                <div className={`${chartCenterDateIconWrapClass} h-5 w-5 xs:h-6 xs:w-6 sm:h-7 sm:w-7`}>
                  <User
                    className={chartCenterDateIconClass}
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div className={chartCenterZodiacCardLabelClass}>
                {t("chartInfo.gender") || t("myChart.fields.gender") || "Gender"}
              </div>
              <div className={chartCenterZodiacCardValueClass}>{genderLabel}</div>
            </div>

            <div className={chartCenterZodiacCardClass}>
              <div className={chartCenterZodiacCardIconSlotClass}>
                <div className={`${chartCenterDateIconWrapClass} h-5 w-5 xs:h-6 xs:w-6 sm:h-7 sm:w-7`}>
                  <CalendarDays
                    className={chartCenterDateIconClass}
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div className={chartCenterZodiacCardLabelClass}>{ageLabel}</div>
              <div className={chartCenterZodiacCardValueClass}>{ageValue}</div>
            </div>
          </div>

          <div className={chartCenterDatesPanelClass}>
            <div className={chartCenterDateRowClass}>
              <div className={chartCenterDateRowIconWrapClass}>
                <Sun
                  className={chartCenterDateIconClass}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </div>
              <div className={chartCenterDateLabelClass}>
                {t("chartInfo.solarDate")}
              </div>
              <p className={chartCenterDateValueClass}>
                {formatChartSolarDate(chartData, t, language)}
              </p>
            </div>

            <div
              className={`${chartCenterDateRowClass} border-t border-[#E5DDD0]/80 pt-1 dark:border-gray-600/80`}
            >
              <div className={chartCenterDateRowIconWrapClass}>
                <Moon
                  className={chartCenterDateIconClass}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </div>
              <div className={chartCenterDateLabelClass}>
                {t("chartInfo.lunarDate") || t("zwds.chart.阴历")}
              </div>
              <p className={chartCenterDateValueClass}>
                {formatChartLunarDate(chartData, t, language)}
              </p>
            </div>
          </div>

          <div className={chartCenterZodiacGridClass}>
            <div className={chartCenterZodiacCardClass}>
              <div className={chartCenterZodiacCardIconSlotClass}>
                <ZodiacIconWrapper
                  Icon={ChineseZodiacIcon}
                  invertToGold
                  className="h-full w-full scale-110"
                />
              </div>
              <div className={chartCenterZodiacCardLabelClass}>
                <span className="sm:hidden">
                  {language === "en"
                    ? "Chinese"
                    : t("zwds.chart.生肖") || "生肖"}
                </span>
                <span className="hidden sm:inline">
                  {t("chartInfo.shengXiao") || t("zwds.chart.生肖")}
                </span>
              </div>
              <div className={chartCenterZodiacCardValueClass}>{chineseZodiacLabel}</div>
            </div>

            <div className={chartCenterZodiacCardClass}>
              <div className={chartCenterZodiacCardIconSlotClass}>
                <ZodiacIconWrapper
                  Icon={WesternZodiacIcon}
                  invertToGoldSoft
                  className="h-full w-full"
                />
              </div>
              <div className={chartCenterZodiacCardLabelClass}>
                <span className="sm:hidden">
                  {language === "en"
                    ? "Western"
                    : t("zwds.chart.westernZodiacShort") || "星座"}
                </span>
                <span className="hidden sm:inline">
                  {t("zwds.chart.westernZodiac") ||
                    (language === "en" ? "Western Zodiac" : "星座")}
                </span>
              </div>
              <div className={chartCenterZodiacCardValueClass}>{westernZodiacLabel}</div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CenterInfo;
