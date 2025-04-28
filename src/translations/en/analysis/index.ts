import fourKeyPalace from "./fourKeyPalace";
import lifeAreas from "./lifeAreas";
import career from "./career";
import health from "./health";

const analysis = {
  analysis: {
    title: "Analysis",
    // Combine all analysis-related translations
    ...fourKeyPalace,
    ...lifeAreas,
    ...career,
    ...health,
    // etc.
  },
};

export default analysis;
