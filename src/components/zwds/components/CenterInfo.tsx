import React from "react";
import { motion } from "framer-motion";
import { ChartData } from "../../../utils/zwds/types";
import { useLanguage } from "../../../context/LanguageContext";
import { EARTHLY_BRANCHES } from "../../../utils/zwds/constants";
import { chartBrandChrome } from "../../../styles/chartSemanticColors";

interface CenterInfoProps {
  chartData: ChartData;
  isPdfExport?: boolean; // Optional prop to disable animations for PDF export
}

/**
 * Component to display the center information section of the ZWDS chart
 */
const CenterInfo: React.FC<CenterInfoProps> = ({ chartData, isPdfExport = false }) => {
  const { t, language } = useLanguage();
  const { input } = chartData;

  /**
   * Animation variants for center info section
   */
  const centerInfoVariants = isPdfExport ? undefined : {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <motion.div
      className={`zwds-center-info col-span-2 row-span-2 border ${chartBrandChrome.centerPanelBorderClass} ${chartBrandChrome.centerPanelBgClass} flex flex-col h-full w-full rounded-lg shadow-md overflow-hidden relative`}
      variants={centerInfoVariants}
      initial={isPdfExport ? false : "hidden"}
      animate={isPdfExport ? false : "visible"}
      style={{
        boxShadow: chartBrandChrome.centerPanelShadow,
      }}>
      {/* Background Logo Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="flex flex-col items-center">
          <div className="flex items-center opacity-[0.15] dark:opacity-[0.12] transform scale-150">
            <span className="text-2xl font-bold px-3 py-1 rounded-lg bg-gradient-brand-purple text-cream uppercase tracking-wider">
              CAE
            </span>
          </div>
        </div>
      </div>

      {/* Content container */}
      <div className="flex flex-col h-full z-10 relative">
        {/* Name with animation */}
        <motion.div
          className={`text-base sm:text-lg font-medium py-2 px-3 sm:px-4 text-cream text-center ${chartBrandChrome.centerPanelHeaderClass}`}
          initial={isPdfExport ? false : { opacity: 0 }}
          animate={isPdfExport ? false : { opacity: 1 }}
          transition={isPdfExport ? { duration: 0 } : { duration: 0.5 }}>
          {input.name || t("result.chart")}
        </motion.div>

        {/* Compact "LABEL: VALUE" layout */}
        <div className={`flex-grow overflow-auto p-2 sm:p-3 ${chartBrandChrome.centerPanelBodyClass}`}>
          <div className="flex flex-col space-y-2 text-sm text-xs sm:text-sm">
            {/* Solar Birthday */}
            <div className="flex flex-col xs:flex-row items-start">
              <span className={`${chartBrandChrome.centerPanelLabelClass} font-medium w-full xs:w-auto xs:min-w-[85px] sm:min-w-[95px] mb-0.5 xs:mb-0`}>
                {t("chartInfo.solarDate")}:
              </span>
              <span className={`${chartBrandChrome.centerPanelValueClass} pl-2 xs:pl-0`}>
                {input.year} {language === "en" ? t("zwds.chart.年") : "年"}{" "}
                {input.month} {language === "en" ? t("zwds.chart.月") : "月"}{" "}
                {input.day} {language === "en" ? t("zwds.chart.日") : "日"}{" "}
                {input.hour} {language === "en" ? t("zwds.chart.时") : "時"}
              </span>
            </div>

            {/* Lunar Birthday */}
            <div className="flex flex-col xs:flex-row items-start">
              <span className={`${chartBrandChrome.centerPanelLabelClass} font-medium w-full xs:w-auto xs:min-w-[85px] sm:min-w-[95px] mb-0.5 xs:mb-0`}>
                {t("chartInfo.lunarDate") || t("zwds.chart.阴历")}:
              </span>
              <span className={`${chartBrandChrome.centerPanelValueClass} flex flex-wrap items-center pl-2 xs:pl-0`}>
                <span className="mr-1">
                  {t(`zwds.stems.${chartData.heavenlyStem}`)}
                  {language === "en" ? " " : ""}
                  {t(`zwds.branches.${chartData.earthlyBranch}`)}
                  {chartData.lunarDate.year}{" "}
                  {language === "en" ? t("zwds.chart.年") : "年"}
                </span>
                <span className="mr-1">
                  {chartData.palaces?.find(
                    (p) => p.annualFlow?.year === input.year
                  )?.annualFlow?.heavenlyStem ?? ""}
                  {t(
                    `zwds.monthBranches.${
                      EARTHLY_BRANCHES[chartData.lunarDate.month - 1]
                    }`
                  ) || ""}{" "}
                  {language === "en" ? t("zwds.chart.月") : "月"}
                </span>
                <span>
                  {(() => {
                    const lunarDayStrings = [
                      "初一",
                      "初二",
                      "初三",
                      "初四",
                      "初五",
                      "初六",
                      "初七",
                      "初八",
                      "初九",
                      "初十",
                      "十一",
                      "十二",
                      "十三",
                      "十四",
                      "十五",
                      "十六",
                      "十七",
                      "十八",
                      "十九",
                      "二十",
                      "廿一",
                      "廿二",
                      "廿三",
                      "廿四",
                      "廿五",
                      "廿六",
                      "廿七",
                      "廿八",
                      "廿九",
                      "三十",
                    ];
                    return (
                      t(
                        `zwds.lunarDays.${
                          lunarDayStrings[chartData.lunarDate.day - 1]
                        }`
                      ) || lunarDayStrings[chartData.lunarDate.day - 1]
                    );
                  })()}{" "}
                  {language === "en" ? t("zwds.chart.日") : "日"}
                </span>
                <span className={`${chartBrandChrome.centerPanelValueClass} opacity-80 ml-1`}>
                  {t(
                    `zwds.dayBranches.${
                      [
                        "子",
                        "丑",
                        "寅",
                        "卯",
                        "辰",
                        "巳",
                        "午",
                        "未",
                        "申",
                        "酉",
                        "戌",
                        "亥",
                      ][Math.floor(((input.hour + 1) % 24) / 2)]
                    }`
                  )}{" "}
                  {language === "en" ? t("zwds.chart.时") : "時"}
                </span>
              </span>
            </div>

            {/* Five Elements */}
            <div className="flex flex-col xs:flex-row items-start">
              <span className={`${chartBrandChrome.centerPanelLabelClass} font-medium w-full xs:w-auto xs:min-w-[85px] sm:min-w-[95px] mb-0.5 xs:mb-0`}>
                {t("chartInfo.fiveElement") || t("zwds.chart.五行")}:
              </span>
              <span className={`${chartBrandChrome.centerPanelValueClass} pl-2 xs:pl-0`}>
                {chartData.fiveElements
                  ? t(`zwds.fiveElements.${chartData.fiveElements}`)
                  : ""}
              </span>
            </div>

            {/* Gender */}
            <div className="flex flex-col xs:flex-row items-start">
              <span className={`${chartBrandChrome.centerPanelLabelClass} font-medium w-full xs:w-auto xs:min-w-[85px] sm:min-w-[95px] mb-0.5 xs:mb-0`}>
                {t("chartInfo.gender")}:
              </span>
              <span className={`${chartBrandChrome.centerPanelValueClass} pl-2 xs:pl-0`}>
                {language === "en"
                  ? t(
                      `myChart.fields.${
                        input.gender === "female" ? "female" : "male"
                      }`
                    )
                  : (chartData.yinYang === "Yin"
                      ? t("zwds.chart.陰") || "陰"
                      : t("zwds.chart.陽") || "陽") +
                    (input.gender === "female"
                      ? t("zwds.chart.女") || "女"
                      : t("zwds.chart.男") || "男")}
              </span>
            </div>

            {/* Age */}
            <div className="flex flex-col xs:flex-row items-start">
              <span className={`${chartBrandChrome.centerPanelLabelClass} font-medium w-full xs:w-auto xs:min-w-[85px] sm:min-w-[95px] mb-0.5 xs:mb-0`}>
                {t("zwds.chart.age") || (language === "en" ? "Age" : "年齡")}:
              </span>
              <span className={`${chartBrandChrome.centerPanelValueClass} pl-2 xs:pl-0`}>
                {new Date().getFullYear() - chartData.lunarDate.year + 1}
                {language === "en" ? "" : t("zwds.chart.歲") || "歲"}
              </span>
            </div>

            {/* Chinese Zodiac */}
            <div className="flex flex-col xs:flex-row items-start">
              <span className={`${chartBrandChrome.centerPanelLabelClass} font-medium w-full xs:w-auto xs:min-w-[85px] sm:min-w-[95px] mb-0.5 xs:mb-0`}>
                {t("chartInfo.shengXiao") || t("zwds.chart.生肖")}:
              </span>
              <span className={`${chartBrandChrome.centerPanelValueClass} flex items-center pl-2 xs:pl-0`}>
                <span className="text-lg mr-1">
                  {
                    [
                      "🐭",
                      "🐂",
                      "🐯",
                      "🐰",
                      "🐲",
                      "🐍",
                      "🐴",
                      "🐑",
                      "🐵",
                      "🐔",
                      "🐶",
                      "🐷",
                    ][(chartData.lunarDate.year - 4) % 12]
                  }
                </span>
                {language === "en"
                  ? t(
                      `zwds.zodiac.${
                        [
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
                        ][(chartData.lunarDate.year - 4) % 12]
                      }`
                    )
                  : t(
                      `zwds.zodiac.${
                        [
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
                        ][(chartData.lunarDate.year - 4) % 12]
                      }`
                    ) ||
                    [
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
                    ][(chartData.lunarDate.year - 4) % 12]}
              </span>
            </div>

            {/* Western Zodiac */}
            <div className="flex flex-col xs:flex-row items-start">
              <span className={`${chartBrandChrome.centerPanelLabelClass} font-medium w-full xs:w-auto xs:min-w-[85px] sm:min-w-[95px] mb-0.5 xs:mb-0`}>
                {t("zwds.chart.westernZodiac") ||
                  (language === "en" ? "Western Zodiac" : "星座")}
                :
              </span>
              <span className={`${chartBrandChrome.centerPanelValueClass} flex items-center pl-2 xs:pl-0`}>
                <span className="text-lg mr-1">
                  {(() => {
                    const month = input.month;
                    const day = input.day;

                    if (
                      (month === 3 && day >= 21) ||
                      (month === 4 && day <= 19)
                    )
                      return "♈";
                    if (
                      (month === 4 && day >= 20) ||
                      (month === 5 && day <= 20)
                    )
                      return "♉";
                    if (
                      (month === 5 && day >= 21) ||
                      (month === 6 && day <= 21)
                    )
                      return "♊";
                    if (
                      (month === 6 && day >= 22) ||
                      (month === 7 && day <= 22)
                    )
                      return "♋";
                    if (
                      (month === 7 && day >= 23) ||
                      (month === 8 && day <= 22)
                    )
                      return "♌";
                    if (
                      (month === 8 && day >= 23) ||
                      (month === 9 && day <= 22)
                    )
                      return "♍";
                    if (
                      (month === 9 && day >= 23) ||
                      (month === 10 && day <= 23)
                    )
                      return "♎";
                    if (
                      (month === 10 && day >= 24) ||
                      (month === 11 && day <= 22)
                    )
                      return "♏";
                    if (
                      (month === 11 && day >= 23) ||
                      (month === 12 && day <= 21)
                    )
                      return "♐";
                    if (
                      (month === 12 && day >= 22) ||
                      (month === 1 && day <= 19)
                    )
                      return "♑";
                    if (
                      (month === 1 && day >= 20) ||
                      (month === 2 && day <= 18)
                    )
                      return "♒";
                    return "♓"; // Feb 19 - Mar 20
                  })()}
                </span>
                {(() => {
                  const month = input.month;
                  const day = input.day;
                  const zodiacKey = (() => {
                    if (
                      (month === 3 && day >= 21) ||
                      (month === 4 && day <= 19)
                    )
                      return "aries";
                    if (
                      (month === 4 && day >= 20) ||
                      (month === 5 && day <= 20)
                    )
                      return "taurus";
                    if (
                      (month === 5 && day >= 21) ||
                      (month === 6 && day <= 21)
                    )
                      return "gemini";
                    if (
                      (month === 6 && day >= 22) ||
                      (month === 7 && day <= 22)
                    )
                      return "cancer";
                    if (
                      (month === 7 && day >= 23) ||
                      (month === 8 && day <= 22)
                    )
                      return "leo";
                    if (
                      (month === 8 && day >= 23) ||
                      (month === 9 && day <= 22)
                    )
                      return "virgo";
                    if (
                      (month === 9 && day >= 23) ||
                      (month === 10 && day <= 23)
                    )
                      return "libra";
                    if (
                      (month === 10 && day >= 24) ||
                      (month === 11 && day <= 22)
                    )
                      return "scorpio";
                    if (
                      (month === 11 && day >= 23) ||
                      (month === 12 && day <= 21)
                    )
                      return "sagittarius";
                    if (
                      (month === 12 && day >= 22) ||
                      (month === 1 && day <= 19)
                    )
                      return "capricorn";
                    if (
                      (month === 1 && day >= 20) ||
                      (month === 2 && day <= 18)
                    )
                      return "aquarius";
                    return "pisces"; // Feb 19 - Mar 20
                  })();

                  const zodiacNames = {
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

                  return (
                    t(`zwds.westernZodiac.${zodiacKey}`) ||
                    zodiacNames[zodiacKey]
                  );
                })()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CenterInfo;
