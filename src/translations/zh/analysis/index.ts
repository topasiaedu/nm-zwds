import summary from "./summary";
import watchout from "./watchout";

// In the future, we can import other analysis-related translations here
// import career from "./career";
// import health from "./health";
// etc.

const analysis = {
  analysis: {
    // Temp
    career: {
      title: "职业分析",
    },
    lifeAreasRadarChart: "生活领域雷达图",
    fourKeyPalace: "四化分析",
    lifeAreasExplanation: "生活领域解释",

    title: "分析",
    // Combine all analysis-related translations
    // ...fourKeyPalace,
    // ...career,
    // ...health,
    ...summary,
    ...watchout,
    // etc.
  },
};

export default analysis;
