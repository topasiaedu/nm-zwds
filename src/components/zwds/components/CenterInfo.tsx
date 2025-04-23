import React from "react";
import { motion } from "framer-motion";
import { HiCalendar } from "react-icons/hi";
import { ChartData } from "../../../utils/zwds/types";
import { useLanguage } from "../../../context/LanguageContext";
import { EARTHLY_BRANCHES } from "../../../utils/zwds/constants";

interface CenterInfoProps {
  chartData: ChartData;
}

/**
 * Component to display the center information section of the ZWDS chart
 */
const CenterInfo: React.FC<CenterInfoProps> = ({ chartData }) => {
  const { t, language } = useLanguage();
  const { input } = chartData;

  /**
   * Animation variants for center info section
   */
  const centerInfoVariants = {
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
      className="col-span-2 row-span-2 border border-indigo-400/40 dark:border-indigo-500/40 bg-white/95 dark:bg-indigo-900/30 flex flex-col h-full w-full rounded-lg shadow-md overflow-hidden"
      variants={centerInfoVariants}
      style={{
        boxShadow: "0 4px 16px rgba(79, 70, 229, 0.1)",
      }}>
      
      {/* Content container */}
      <div className="flex flex-col h-full">
        {/* Name with animation */}
        <motion.div 
          className="text-base sm:text-lg font-medium py-2 px-3 sm:px-4 text-indigo-900 dark:text-indigo-100 text-center bg-gradient-to-r from-indigo-100/90 to-purple-100/90 dark:from-indigo-800/70 dark:to-purple-900/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}>
          {input.name || "Chart"}
        </motion.div>
        
        {/* Compact "LABEL: VALUE" layout */}
        <div className="flex-grow overflow-auto p-2 sm:p-3 bg-gradient-to-br from-white to-indigo-50/30 dark:from-indigo-900/10 dark:to-purple-900/20">
          <div className="flex flex-col space-y-2 text-sm">
            {/* Solar Birthday */}
            <div className="flex items-start">
              <span className="text-indigo-700 dark:text-indigo-300 font-medium min-w-[85px] sm:min-w-[95px]">
                {language === "en" && t("zwds.chart.阳历") ? t("zwds.chart.阳历") : "陽曆生日"}:
              </span>
              <span className="text-zinc-700 dark:text-zinc-200">
                {input.year}{language === "en" ? " " : "年 "}{input.month}{language === "en" ? " " : "月 "}{input.day}{language === "en" ? "" : "日"} {input.hour}{language === "en" ? "" : "時"}
              </span>
            </div>
            
            {/* Lunar Birthday */}
            <div className="flex items-start">
              <span className="text-indigo-700 dark:text-indigo-300 font-medium min-w-[85px] sm:min-w-[95px]">
                {language === "en" && t("zwds.chart.阴历") ? t("zwds.chart.阴历") : "農曆生日"}:
              </span>
              <span className="text-zinc-700 dark:text-zinc-200 flex flex-wrap items-center">
                <span className="mr-1">
                  {language === "en" && t(`zwds.stems.${chartData.heavenlyStem}`) ? t(`zwds.stems.${chartData.heavenlyStem}`) : chartData.heavenlyStem}
                  {language === "en" ? " " : ""}
                  {language === "en" && t(`zwds.branches.${chartData.earthlyBranch}`) ? t(`zwds.branches.${chartData.earthlyBranch}`) : chartData.earthlyBranch}
                  {language === "en" ? " Year" : "年"}
                </span>
                <span className="mr-1">
                  {chartData.palaces?.find(p => p.annualFlow?.year === input.year)?.annualFlow?.heavenlyStem ?? ""}
                  {EARTHLY_BRANCHES[chartData.monthBranch] ?? ""}
                  {language === "en" ? " Month" : "月"}
                </span>
                <span>
                  {(() => {
                    const lunarDay = Math.max(1, (input.day % 30) || 30);
                    const lunarDayStrings = ["初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十", 
                                          "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十", 
                                          "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"];
                    return lunarDayStrings[lunarDay - 1];
                  })()}
                </span>
                <span className="text-zinc-600 dark:text-zinc-300 ml-1">
                  {language === "en" && ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"][Math.floor(((input.hour + 1) % 24) / 2)]
                    ? t(`zwds.branches.${["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"][Math.floor(((input.hour + 1) % 24) / 2)]}`)
                    : ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"][Math.floor(((input.hour + 1) % 24) / 2)]}
                  {language === "en" ? " Hour" : "時"}
                </span>
              </span>
            </div>

            {/* Five Elements */}
            <div className="flex items-start">
              <span className="text-indigo-700 dark:text-indigo-300 font-medium min-w-[85px] sm:min-w-[95px]">
                {language === "en" && t("zwds.chart.五行") ? t("zwds.chart.五行") : "五行"}:
              </span>
              <span className="text-zinc-700 dark:text-zinc-200">
                {language === "en" && chartData.fiveElements && t(`zwds.fiveElements.${chartData.fiveElements}`) 
                  ? t(`zwds.fiveElements.${chartData.fiveElements}`) 
                  : chartData.fiveElements}
              </span>
            </div>
            
            {/* Gender */}
            <div className="flex items-start">
              <span className="text-indigo-700 dark:text-indigo-300 font-medium min-w-[85px] sm:min-w-[95px]">
                {language === "en" ? "Gender" : "性別"}:
              </span>
              <span className="text-zinc-700 dark:text-zinc-200">
                {language === "en" 
                  ? (input.gender === "female" ? "Female" : "Male") 
                  : (chartData.yinYang === "Yin" ? "陰" : "陽") + (input.gender === "female" ? "女" : "男")}
              </span>
            </div>
            
            {/* Age */}
            <div className="flex items-start">
              <span className="text-indigo-700 dark:text-indigo-300 font-medium min-w-[85px] sm:min-w-[95px]">
                {language === "en" ? "Age" : "年齡"}:
              </span>
              <span className="text-zinc-700 dark:text-zinc-200">
                {new Date().getFullYear() - input.year}{language === "en" ? "" : "歲"}
              </span>
            </div>
            
            {/* Chinese Zodiac */}
            <div className="flex items-start">
              <span className="text-indigo-700 dark:text-indigo-300 font-medium min-w-[85px] sm:min-w-[95px]">
                {language === "en" ? "Chinese Zodiac" : "生肖"}:
              </span>
              <span className="flex items-center text-zinc-700 dark:text-zinc-200">
                <span className="text-lg mr-1">
                  {["🐭","🐂","🐯","🐰","🐲","🐍","🐴","🐑","🐵","🐔","🐶","🐷"][(input.year - 4) % 12]}
                </span>
                {["鼠","牛","虎","兔","龍","蛇","馬","羊","猴","雞","狗","豬"][(input.year - 4) % 12]}
              </span>
            </div>
            
            {/* Western Zodiac */}
            <div className="flex items-start">
              <span className="text-indigo-700 dark:text-indigo-300 font-medium min-w-[85px] sm:min-w-[95px]">
                {language === "en" ? "Western Zodiac" : "星座"}:
              </span>
              <span className="flex items-center text-zinc-700 dark:text-zinc-200">
                <span className="text-lg mr-1">
                  {(() => {
                    const month = input.month;
                    const day = input.day;
                    
                    if ((month === 3 && day >= 21) || (month === 4 && day <= 19))
                      return "♈";
                    if ((month === 4 && day >= 20) || (month === 5 && day <= 20))
                      return "♉";
                    if ((month === 5 && day >= 21) || (month === 6 && day <= 21))
                      return "♊";
                    if ((month === 6 && day >= 22) || (month === 7 && day <= 22))
                      return "♋";
                    if ((month === 7 && day >= 23) || (month === 8 && day <= 22))
                      return "♌";
                    if ((month === 8 && day >= 23) || (month === 9 && day <= 22))
                      return "♍";
                    if ((month === 9 && day >= 23) || (month === 10 && day <= 23))
                      return "♎";
                    if ((month === 10 && day >= 24) || (month === 11 && day <= 22))
                      return "♏";
                    if ((month === 11 && day >= 23) || (month === 12 && day <= 21))
                      return "♐";
                    if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
                      return "♑";
                    if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
                      return "♒";
                    return "♓"; // Feb 19 - Mar 20
                  })()}
                </span>
                {(() => {
                  const month = input.month;
                  const day = input.day;
                  
                  if ((month === 3 && day >= 21) || (month === 4 && day <= 19))
                    return "白羊座";
                  if ((month === 4 && day >= 20) || (month === 5 && day <= 20))
                    return "金牛座";
                  if ((month === 5 && day >= 21) || (month === 6 && day <= 21))
                    return "雙子座";
                  if ((month === 6 && day >= 22) || (month === 7 && day <= 22))
                    return "巨蟹座";
                  if ((month === 7 && day >= 23) || (month === 8 && day <= 22))
                    return "獅子座";
                  if ((month === 8 && day >= 23) || (month === 9 && day <= 22))
                    return "處女座";
                  if ((month === 9 && day >= 23) || (month === 10 && day <= 23))
                    return "天秤座";
                  if ((month === 10 && day >= 24) || (month === 11 && day <= 22))
                    return "天蠍座";
                  if ((month === 11 && day >= 23) || (month === 12 && day <= 21))
                    return "射手座";
                  if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
                    return "摩羯座";
                  if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
                    return "水瓶座";
                  return "雙魚座"; // Feb 19 - Mar 20
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