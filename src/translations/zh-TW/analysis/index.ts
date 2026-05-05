import summary from "./summary";
import watchout from "./watchout";
import health from "./health";

const analysis = {
  analysis: {
    career: {
      title: "事業分析",
    },
    lifeAreasRadarChart: "生活領域雷達圖",
    fourKeyPalace: "四化分析",
    lifeAreasExplanation: "生活領域解釋",
    title: "分析",
    ...health,
    ...summary,
    ...watchout,
  },
};

export default analysis;
