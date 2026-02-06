import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  analyzeHealthFromChart,
  HealthAnalysisResult,
} from "../../utils/zwds/health_analyzer";

import AnimatedWrapper from "../analysis/AnimatedWrapper";
import { motion } from "framer-motion";
import maleSvgContent from "../../assets/male-svg";
import { ChartData } from "../../utils/zwds/types";
import GradientSectionHeader from "./shared/GradientSectionHeader";

/**
 * Props interface for the HealthAnalysis component
 */
interface HealthAnalysisProps {
  chartData: ChartData;
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
  骨: ["spine", "ribs"],
  血液: ["heart", "lungs"],
  筋骨: ["left-arm", "right-arm", "left-leg", "right-leg"],
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

  /**
   * Convert Chinese body part names to SVG element identifiers.
   */
  const getAffectedSvgParts = useCallback((): string[] => {
    const svgParts: string[] = [];

    affectedParts.forEach((part) => {
      const mappedParts = bodyPartMapping[part];
      if (mappedParts) {
        svgParts.push(...mappedParts);
      }
    });

    return [...new Set(svgParts)]; // Remove duplicates
  }, [affectedParts]);

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
  }, [svgContent, affectedParts, getAffectedSvgParts]);

  return <div ref={svgContainerRef} className="w-full h-full" />;
};

/**
 * HealthAnalysis component that analyzes and displays health implications
 * based on stars in the chart's health palace (疾厄宫) with a human body visualization
 */
const Health: React.FC<HealthAnalysisProps> = ({ chartData }) => {

  const [healthAnalysis, setHealthAnalysis] =
    useState<HealthAnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
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
        setLoading(true);
        setError("");

        // Analyze health using the new utility
        const analysisResult = analyzeHealthFromChart(chartData);
        setHealthAnalysis(analysisResult);

      
      } catch (error) {
        console.error("Error analyzing health data:", error);
        setError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );

        // Set empty result instead of sample data
        setHealthAnalysis({
          affectedBodyParts: [],
          healthTips: [],
          starsInHealthPalace: [],
          usedParentsPalace: false,
        });
      } finally {
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

  if (error) {
    return (
      <div className="p-6 dark:bg-gray-900">
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-red-400"
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
          <p className="mt-2 text-red-500 dark:text-red-400">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <AnimatedWrapper delay={0.2} threshold={0.25}>
      <div className="p-6 dark:bg-gray-900">
        {/* Section Header */}
        <GradientSectionHeader
          badgeText="04"
          title="HEALTH CODE SCAN"
          subtitle="Decode your body's energetic blueprint — where vitality flows and where it breaks down."
          showDivider={true}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Health interpretations */}
          <div className="flex flex-col space-y-6 order-2 lg:order-1 col-span-2">
            {healthAnalysis && healthAnalysis.affectedBodyParts.length > 0 ? (
              <div className="rounded-2xl shadow-lg border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">🏥</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Health Analysis & Tips
                  </h3>
                </div>
                <div className="space-y-6">
                  {healthAnalysis.healthTips.map((tip, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-red-200 dark:border-red-700 bg-gradient-to-br from-red-50/50 to-orange-50/50 dark:from-red-900/10 dark:to-orange-900/10 p-5 hover:shadow-lg transition-shadow">
                      {/* Body Part Header with Icon */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-md">
                          <span className="w-3 h-3 rounded-full bg-white"></span>
                        </div>
                        <span className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                          {tip.englishName || tip.bodyPart}
                        </span>
                      </div>
                      
                      {/* Tip Description */}
                      <div
                        className={`${
                          !expandedTips[index] ? "line-clamp-3" : ""
                        }`}>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pl-11">
                          {tip.description}
                        </p>
                      </div>

                      <button
                        onClick={() => toggleTip(index)}
                        className="mt-3 ml-11 text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 uppercase tracking-wider">
                        {expandedTips[index] ? "Show Less ↑" : "See More ↓"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl shadow-lg border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 p-8 text-center">
                <div className="flex flex-col items-center justify-center py-8">
                  <span className="text-6xl mb-4">✨</span>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    No health concerns detected
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your chart shows no significant health indicators at this time.
                  </p>
                  {healthAnalysis && healthAnalysis.starsInHealthPalace.length > 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
                      Stars in palace: {healthAnalysis.starsInHealthPalace.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right column - Interactive human body */}
          <motion.div
            className="relative order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}>
            <div className="w-full max-w-md mx-auto">
              <div className="rounded-2xl shadow-lg border bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🧍</span>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white">
                    Body Map
                  </h4>
                </div>
                <HumanBodySVG
                  affectedParts={healthAnalysis?.affectedBodyParts || []}
                  gender={
                    chartData?.input?.gender === "female" ? "female" : "male"
                  }
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export default Health;
