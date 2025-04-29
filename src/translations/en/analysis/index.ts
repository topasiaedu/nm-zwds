import fourKeyPalace from "./fourKeyPalace";
import lifeAreas from "./lifeAreas";
import career from "./career";
import health from "./health";
import summary from "./summary";
import watchout from "./watchout";

const analysis = {
  analysis: {
    title: "Analysis",
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
