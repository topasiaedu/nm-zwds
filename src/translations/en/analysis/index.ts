import fourKeyPalace from "./fourKeyPalace";
import lifeAreas from "./lifeAreas";
import career from "./career";
import health from "./health";
import summary from "./summary";
import watchout from "./watchout";

const analysis = {
  analysis: {
    title: "PERSONALIZED LIFE REPORT",
    subtitle: "A custom breakdown of your chart’s strengths, patterns, and strategic focus areas.",
    // Combine all analysis-related translations
    ...fourKeyPalace,
    ...lifeAreas,
    ...career,
    ...health,
    ...summary,
    ...watchout,
    // etc.
  },
};

export default analysis;
