import React, { useState, useEffect, useRef } from "react";
import { analyzeHealth, getStarsInPalace } from "../../utils/zwds/analysis";
import { useLanguage } from "../../context/LanguageContext";
import AnimatedWrapper from "../analysis/AnimatedWrapper";
import { motion } from "framer-motion";
import maleSvgContent from "../../assets/male-svg";
/**
 * Props interface for the HealthAnalysis component
 */
interface HealthAnalysisProps {
  chartData: any;
}

/**
 * Maps Chinese body part names to SVG part identifiers
 */
const bodyPartMapping: Record<string, string[]> = {
  头: ["head"],
  眼: ["eyes"],
  耳: ["left-ear", "right-ear"],
  左耳: ["left-ear"],
  右耳: ["right-ear"],
  口: ["mouth"],
  鼻: ["nose"],
  心脏: ["heart"],
  肝脏: ["liver"],
  肺: ["lungs"],
  胃: ["stomach"],
  肠: ["intestine"],
  肾: ["kidney"],
  膀胱: ["bladder"],
  生殖器: ["genitals"],
  左手: ["left-arm"],
  右手: ["right-arm"],
  手: ["left-arm", "right-arm"],
  左脚: ["left-leg"],
  右脚: ["right-leg"],
  脚: ["left-leg", "right-leg"],
  关节: [
    "joint_1",
    "joint_2",
    "joint_3",
    "joint_4",
    "joint_5",
    "joint_6",
    "joint_7",
    "joint_8",
    "joint_9",
    "joint_10",
    "joint_11",
    "joint_12",
  ],
  神经系统: [
    "joint_1",
    "joint_2",
    "joint_3",
    "joint_4",
    "joint_5",
    "joint_6",
    "joint_7",
    "joint_8",
    "heart",
    "lungs",
  ],
  膝盖: ["knee_1", "knee_2"],
};

/**
 * Custom human body component that displays and manipulates the SVG content directly
 */
const HumanBodySVG: React.FC<{
  affectedParts: string[];
  gender: "male" | "female";
}> = ({ affectedParts, gender }) => {
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");

  // Convert Chinese body part names to SVG element identifiers
  const getAffectedSvgParts = (): string[] => {
    const svgParts: string[] = [];

    affectedParts.forEach((part) => {
      const mappedParts = bodyPartMapping[part];
      if (mappedParts) {
        svgParts.push(...mappedParts);
      }
    });

    return [...new Set(svgParts)]; // Remove duplicates
  };

  // Load the SVG content directly
  useEffect(() => {
    // This is a workaround - in a production app we'd import the SVG properly
    // We're using the content directly since we know it exists in the src/assets folder

    // This is the content of the male SVG file for demo purposes

    // Set the SVG content
    setSvgContent(maleSvgContent);
  }, [gender]);

  // When SVG content or affected parts change, manipulate the SVG elements
  useEffect(() => {
    if (svgContainerRef.current && svgContent) {
      // Parse the SVG content
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
      const svgElement = svgDoc.documentElement;

      // Apply styles to SVG
      svgElement.setAttribute("width", "100%");
      svgElement.setAttribute("height", "100%");

      // Hide all parts initially
      const allParts = svgElement.querySelectorAll(".part");
      allParts.forEach((part) => {
        part.setAttribute("style", "display: none;");
      });

      // Show and highlight affected parts
      const affectedSvgParts = getAffectedSvgParts();
      affectedSvgParts.forEach((partId) => {
        const parts = svgElement.querySelectorAll(`[data-part="${partId}"]`);
        parts.forEach((part) => {
          part.setAttribute(
            "style",
            "display: block; fill: #ef4444; fill-opacity: 0.5;"
          );
          part.classList.add("animate-pulse");
        });
      });

      // Update the container with the modified SVG
      svgContainerRef.current.innerHTML = svgElement.outerHTML;

      // Add animation via JavaScript since the SVG is statically inserted
      const animatePulse = () => {
        const parts =
          svgContainerRef.current?.querySelectorAll(".animate-pulse");
        if (parts && parts.length > 0) {
          parts.forEach((part) => {
            const opacity = 0.3 + 0.2 * Math.sin(Date.now() / 500);
            (part as SVGElement).setAttribute(
              "fill-opacity",
              opacity.toString()
            );
          });
        }

        requestAnimationFrame(animatePulse);
      };

      const animationFrame = requestAnimationFrame(animatePulse);

      // Clean up animation frame on unmount
      return () => {
        cancelAnimationFrame(animationFrame);
      };
    }
  }, [svgContent, affectedParts]);

  return <div ref={svgContainerRef} className="w-full h-full" />;
};

/**
 * HealthAnalysis component that analyzes and displays health implications
 * based on stars in the chart's health palace (疾厄宫) with a human body visualization
 */
const Health: React.FC<HealthAnalysisProps> = ({ chartData }) => {
  const { t, language } = useLanguage();
  const [affectedBodyParts, setAffectedBodyParts] = useState<string[]>([]);
  const [starsInHealthPalace, setStarsInHealthPalace] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [expandedTips, setExpandedTips] = useState<Record<number, boolean>>({});

  const toggleTip = (index: number) => {
    setExpandedTips((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    if (chartData) {
      try {
        // Get affected body parts
        const bodyParts = analyzeHealth(chartData);

        // Get stars in the health palace
        const stars = getStarsInPalace(chartData, "疾厄");

        // Check if we have any data
        if (bodyParts.length === 0 && stars.length === 0) {
          // Use sample data for testing if no real data is available
          setAffectedBodyParts(["头", "眼", "心脏", "肝脏", "神经系统"]);
          setStarsInHealthPalace(["太阳", "武曲", "廉贞"]);
          setError(true);
        } else {
          setAffectedBodyParts(bodyParts);
          setStarsInHealthPalace(stars.map((star) => star.star));
          setError(false);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error analyzing health data:", error);

        // Use sample data in case of error
        setAffectedBodyParts(["头", "眼", "心脏", "肝脏", "神经系统"]);
        setStarsInHealthPalace(["太阳", "武曲", "廉贞"]);
        setError(true);
        setLoading(false);
      }
    }
  }, [chartData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <AnimatedWrapper delay={0.2} threshold={0.25}>
      {/* Added divider */}
      <div className="w-full border-t border-gray-200 dark:border-gray-700 mb-6"></div>

      {/* Title */}
      <h2 className="text-2xl dark:text-white text-center font-bold">
        HEALTH CODE SCAN
      </h2>

      {/* Subtitle */}
      <p className="text-lg mb-6 dark:text-white text-center">
        Decode your body’s energetic blueprint — where vitality flows and where
        it breaks down.
      </p>
      <div className="p-6 dark:bg-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column - Health interpretations (swapped from right) */}
          <div className="flex flex-col space-y-6">
            {affectedBodyParts.length > 0 ? (
              <>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    {t("analysis.health.areasOfConcern") ||
                      "Areas of Health Concern"}
                  </h3>
                  {/* {affectedBodyParts.map((bodyPart, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 rounded-lg border-l-4 border-red-500 bg-red-50 dark:bg-red-900/10">
                      <span className="w-3 h-3 rounded-full bg-red-500 mr-3 animate-pulse"></span>
                      <span className="text-gray-800 dark:text-gray-200 font-medium">
                        {t(`analysis.health.${bodyPart}`)}
                      </span>
                    </div>
                  ))} */}

                  <div className="flex items-center p-3 rounded-lg border-l-4 border-red-500 bg-red-50 dark:bg-red-900/10">
                    <span className="w-3 h-3 rounded-full bg-red-500 mr-3 animate-pulse"></span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                      Stomach
                    </span>
                  </div>
                  <div className="flex items-center p-3 rounded-lg border-l-4 border-red-500 bg-red-50 dark:bg-red-900/10">
                    <span className="w-3 h-3 rounded-full bg-red-500 mr-3 animate-pulse"></span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                      Knee
                    </span>
                  </div>
                </div>

                {/* Modified Tips Section with individual See More functionality */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    Health Tips
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/10 rounded-r">
                      <div
                        className={`${!expandedTips[0] ? "line-clamp-4" : ""}`}>
                        <p className="text-gray-700 dark:text-gray-300">
                          The stomach is where you digest not just food, but the
                          pace of life and external pressure. The more you
                          suppress your emotions, the more likely your stomach
                          will protest—bloating, acid, and pain are often not
                          caused by what you eat, but by what&apos;s weighing on
                          your heart. Yes, regular meals and mindful chewing
                          matter, but what matters more is learning to express
                          discomfort, handle stress, and stop forcing yourself
                          to swallow too much. When you start honoring your own
                          rhythm, your stomach will settle too—helping you face
                          the world with greater strength.
                        </p>
                      </div>
                      <button
                        onClick={() => toggleTip(0)}
                        className="mt-2 text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors duration-200">
                        {expandedTips[0] ? "Show Less" : "See More"}
                      </button>
                    </div>
                    <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/10 rounded-r">
                      <div
                        className={`${!expandedTips[1] ? "line-clamp-4" : ""}`}>
                        <p className="text-gray-700 dark:text-gray-300">
                          Your knees carry your direction and drive—they
                          symbolize your willingness to move forward. When you
                          feel hesitant, fear change, or silently endure
                          pressure without asking for help, your knees are
                          likely to show signs of strain. Stop forcing yourself
                          to push through everything alone. Taking proper rest,
                          strengthening your lower body, and keeping warm can
                          help you walk farther and more steadily. True support
                          comes from allowing yourself to soften, not from
                          constantly pretending to be strong.
                        </p>
                      </div>
                      <button
                        onClick={() => toggleTip(1)}
                        className="mt-2 text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors duration-200">
                        {expandedTips[1] ? "Show Less" : "See More"}
                      </button>
                    </div>
                  </div>
                </div>
              </>
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
                  {t("analysis.health.noData")}
                </p>
              </div>
            )}
          </div>

          {/* Right column - Interactive human body (swapped from left) */}
          <motion.div
            className="relative flex items-center justify-center h-[500px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}>
            <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 rounded-lg h-full w-full">
              <HumanBodySVG
                affectedParts={affectedBodyParts}
                gender={
                  chartData?.input?.gender === "female" ? "female" : "male"
                }
              />
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export default Health;
