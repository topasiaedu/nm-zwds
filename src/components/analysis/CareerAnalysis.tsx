/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo, useRef } from "react";
import { analyzeCareerLegacy as analyzeCareer, getStarsInPalace } from "../../utils/zwds/analysis";
import { useLanguage } from "../../context/LanguageContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import AnimatedWrapper from "./AnimatedWrapper";

/**
 * Props interface for the CareerAnalysis component
 */
interface CareerAnalysisProps {
  chartData: any;
}

/**
 * CareerAnalysis component that analyzes and displays career aptitudes
 * based on stars in the chart's career palace (官禄宫)
 */
const CareerAnalysis: React.FC<CareerAnalysisProps> = ({ chartData }) => {
  const { t, language } = useLanguage();
  const [careerAptitudes, setCareerAptitudes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDimensions = (): void => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  useEffect(() => {
    if (chartData) {
      try {
        
        // Get career aptitudes
        const aptitudes = analyzeCareer(chartData);
        
        // Get stars in the career palace
        const stars = getStarsInPalace(chartData, "官禄");
        
        // Check if we have any data
        if (aptitudes.length === 0 && stars.length === 0) {
          
          // Use sample data for testing if no real data is available
          setCareerAptitudes([
            "金融业", 
            "管理业", 
            "专业技能", 
            "房地产", 
            "医疗管理",
            "投资理财"
          ]);
          setError(true);
        } else {
          setCareerAptitudes(aptitudes);
          setError(false);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error analyzing career data:", error);
        
        // Use sample data in case of error
        setCareerAptitudes([
          "金融业", 
          "管理业", 
          "专业技能", 
          "房地产", 
          "医疗管理",
          "投资理财"
        ]);
        setError(true);
        setLoading(false);
      }
    }
  }, [chartData]);

  // Group career aptitudes by category
  const { careerBarData, careersInCategories, categories } = useMemo(() => {
    if (careerAptitudes.length === 0) return { careerBarData: [], careersInCategories: {}, categories: {} };

    // Define career categories for grouping with functional categories
    const categories: Record<string, string[]> = {
      "Visionaries 灵感者": [
        "艺术创作", "创意产业", "装潢设计", "策划设计", "文化创意", "表演艺术", "摄影", "舞蹈", "音乐制作",
        "文学创作", "艺术设计", "礼品设计", "文创产品", "编剧写作", "礼仪顾问", "园艺设计", "作家",
        "珠宝", "钟表", "珍贵细致物品", "广告营销", "纸业", "出版印刷", "车辆改装"
      ],
      "Lifekeepers 生命守护者": [
        "医疗管理", "医疗手术", "中医药", "药品销售", "医护人员", "养老服务", "社工", "长照服务", "志工组织",
        "美容保健", "美容护理", "美容美发", "地下医疗", "月子中心", "命理咨询", "家庭服务", "清洁服务"
      ],
      "Educators 教育者": [
        "教育培训", "教育辅导", "幼教", "讲师", "教学辅助", "宗教传教", "图书馆管理", "演讲者", "演讲",
        "研究单位", "翻译", "争议解决专家"
      ],
      "Strategists 策略者": [
        "管理业", "高阶主管", "行政官员", "行政", "策略顾问", "行政助理", "品牌顾问", "辅助人员", "助理",
        "顾问", "辅助岗位", "人事行政", "方向指导", "辅助决策", "计划执行", "中间人", "幕后策划", "团队协调",
        "问题解决顾问", "创业顾问", "饭店管理", "餐饮顾问"
      ],
      "Architects 架构者": [
        "软件工程", "工程设备", "AI开发", "技术研发", "工程顾问", "工程拆除", "装修工程", "机械制造",
        "高级品", "研究分析", "专业技能", "特殊技能", "重工业", "金属业", "采矿业", "生产制造",
        "能源事业", "光电产业", "交通工具", "房地产", "建材"
      ],
      "Stewards 执行者": [
        "仓储物流", "船务公司", "救灾重建", "服务业", "软性服务", "餐饮业", "饭店前台", "接待", "旅馆业",
        "清洁行业", "小吃餐饮", "种植业", "畜牧业", "农业行政", "肉品加工", "屠宰业", "营养品销售",
        "自由职业", "轻松工作", "文书处理", "语言沟通", "跳蚤市场", "衣食住行行业"
      ],
      "Guardians 守护者": [
        "军警系统", "政治工作", "外交", "公职", "稳定性企业", "政府单位"
      ],
      "Vanguards 先锋者": [
        "直播主", "公关", "星探", "网红经济", "媒体公关", "宣传传播", "新闻传播", "网评员", "市场开发",
        "酒吧", "情色行业", "中介买卖", "名牌销售", "水果批发", "批发行", "服饰零售", "女性产品",
        "化妆品", "床具销售", "小孩用品", "原料买卖", "饮料业", "国际贸易", "百货公司", "高级汽车", "出租业"
      ],
      "Advisors 筹策者": [
        "金融业", "财经业", "银行", "保险", "投资理财", "资产管理", "会计", "企业财务顾问", "财务",
        "律师", "法务助理"
      ]
    }
    

    // Keep track of which careers belong to each category
    const categorizedCareers: Record<string, string[]> = {};
    
    // Count careers by category and store career lists
    careerAptitudes.forEach(career => {
      let assigned = false;
      
      // Try to assign to defined categories
      for (const [category, careers] of Object.entries(categories)) {
        if (careers.includes(career)) {
          if (!categorizedCareers[category]) {
            categorizedCareers[category] = [];
          }
          categorizedCareers[category].push(career);
          assigned = true;
          break;
        }
      }
      
      // If not assigned to any specific category, put in "其他"
      if (!assigned) {
        if (!categorizedCareers["其他"]) {
          categorizedCareers["其他"] = [];
        }
        categorizedCareers["其他"].push(career);
      }
    });

    // Generate colors based on category - using a professional color palette that's distinct
    const colors = {
      "Visionaries 灵感者": "#FF6B6B",   // Coral red
      "Lifekeepers 生命守护者": "#4ECDC4", // Teal
      "Educators 教育者": "#F9C80E",     // Yellow
      "Strategists 策略者": "#7367F0",   // Purple
      "Architects 架构者": "#43A047",    // Green
      "Stewards 执行者": "#3F51B5",      // Indigo
      "Guardians 守护者": "#FF9800",     // Orange
      "Vanguards 先锋者": "#9C27B0",     // Deep purple
      "Advisors 筹策者": "#1976D2"       // Blue
    };

    // Create direct display values for categories
    const displayCategories: Record<string, string> = {
      "Visionaries 灵感者": language === "en" ? "Visionaries" : "灵感者",
      "Lifekeepers 生命守护者": language === "en" ? "Lifekeepers" : "生命守护者",
      "Educators 教育者": language === "en" ? "Educators" : "教育者",
      "Strategists 策略者": language === "en" ? "Strategists" : "策略者",
      "Architects 架构者": language === "en" ? "Architects" : "架构者",
      "Stewards 执行者": language === "en" ? "Stewards" : "执行者",
      "Guardians 守护者": language === "en" ? "Guardians" : "守护者",
      "Vanguards 先锋者": language === "en" ? "Vanguards" : "先锋者",
      "Advisors 筹策者": language === "en" ? "Advisors" : "筹策者",
      "其他": language === "en" ? "Others" : "其他"
    };

    const data = Object.entries(categorizedCareers)
      .map(([category, careers]) => ({
        category: category === "其他" ? displayCategories["其他"] : displayCategories[category] || category.split(" ")[0],
        englishCategory: category,
        value: careers.length,
        color: category === "其他" ? "#9E9E9E" : colors[category as keyof typeof colors] || "#9E9E9E"
      }))
      .sort((a, b) => b.value - a.value); // Sort by count descending
    
    return { 
      careerBarData: data, 
      careersInCategories: categorizedCareers,
      categories
    };
  }, [careerAptitudes, language]);

  // Translate career name
  const translateCareer = (careerName: string): string => {
    const translationKey = `analysis.career.${careerName}`;
    const translated = t(translationKey);
    
    // If the translation key returns the same value, it means there's no translation
    // In that case, return the original career name
    if (translated === translationKey) {
      return careerName;
    }
    
    return translated;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <AnimatedWrapper threshold={0.1}>
      <div className="rounded-2xl shadow-lg overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700" ref={containerRef}>
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <svg 
              className="w-6 h-6 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
            </svg>
            {t("analysis.career.title")}
            {error && (
              <span className="ml-2 text-xs bg-yellow-400/70 text-black px-2 py-1 rounded backdrop-blur-sm">
                {t("analysis.career.demoData")}
              </span>
            )}
          </h2>
        </div>

        <div className="p-6">
          {careerAptitudes.length > 0 ? (
            <div className="h-96">
              {careerBarData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={careerBarData}
                    layout="horizontal"
                    margin={{
                      top: 10,
                      right: 20,
                      bottom: 40,
                      left: containerWidth < 500 ? 80 : 120,
                    }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      type="number" 
                      stroke="#718096"
                      style={{ fontSize: containerWidth < 500 ? 10 : 12 }}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="category"
                      stroke="#718096"
                      width={containerWidth < 500 ? 70 : 110}
                      style={{ fontSize: containerWidth < 500 ? 10 : 12 }}
                      tick={{fill: "#718096"}}
                    />
                    <Tooltip
                      // eslint-disable-next-line react/prop-types
                      content={(props) => {
                        if (!props.active || !props.payload || !props.payload[0]) {
                          return null;
                        }
                        
                        const data = props.payload[0].payload as any;
                        const value = data.value;
                        const color = data.color;
                        const englishCategory = data.englishCategory || "";
                        
                        const careersInThisCategory = englishCategory === "其他" 
                          ? careerAptitudes.filter(career => {
                            for (const [, careerList] of Object.entries(categories)) {
                                if (careerList.includes(career)) {
                                  return false;
                                }
                              }
                              return true;
                            })
                          : careersInCategories[englishCategory] || [];

                        const displayCategory = englishCategory === "其他" 
                          ? (language === "en" ? "Others" : "其他")
                          : (language === "en" 
                            ? englishCategory.split(" ")[0]
                            : englishCategory.split(" ")[1]
                          );

                        return (
                          <div className="backdrop-blur-md bg-gray-800/80 text-white p-3 rounded-md shadow-lg text-sm max-w-xs border border-gray-700/50">
                            <div className="font-bold border-b border-gray-600/50 pb-1 mb-2">
                              <div className="flex items-center mb-1.5">
                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }}></span>
                                <span>{displayCategory}</span>
                                <span className="ml-auto">
                                  {value} {value > 1 ? (language === "en" ? "options" : "选项") : (language === "en" ? "option" : "选项")}
                                </span>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 gap-1 mt-1">
                              {careersInThisCategory.map((career, i) => {
                                const translatedCareer = translateCareer(career);
                                
                                return (
                                  <div key={i} className="flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: color }}></span>
                                    <span>{language === "en" ? translatedCareer : career}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {careerBarData.map((entry, index) => (
                        <Cell key={`cell-${entry.category}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  {t("analysis.career.noData")}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg 
                className="mx-auto h-12 w-12 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                {t("analysis.career.noData")}
              </p>
            </div>
          )}
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export default CareerAnalysis; 