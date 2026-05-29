import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  analyzeHealthFromChart,
  HealthAnalysisResult,
} from "../../utils/zwds/health_analyzer";

import AnimatedWrapper from "../analysis/AnimatedWrapper";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bone,
  Brain,
  ChevronDown,
  ChevronUp,
  Droplets,
  Ear,
  Eye,
  Footprints,
  Hand,
  Heart,
  Hospital,
  MessageCircle,
  Pill,
  Sparkles,
  UserRound,
  Wind,
  type LucideIcon,
} from "lucide-react";
import maleSvgContent from "../../assets/male-svg";
import { ChartData } from "../../utils/zwds/types";
import { pdfCaptureNumericBadgeStyle } from "./shared/pdfCaptureNumericBadgeStyle";

/**
 * Props interface for the HealthAnalysis component
 */
interface HealthAnalysisProps {
  chartData: ChartData;
  /** Optional physical palace number (1–12) for timeframe-based analysis. */
  palaceOverride?: number;
  /** When true, skip motion wrappers and expand all tips for PDF/html2canvas capture. */
  forPdfCapture?: boolean;
}

type BodyPartIconRule = {
  keywords: string[];
  icon: LucideIcon;
};

const BODY_PART_ICON_RULES: BodyPartIconRule[] = [
  { keywords: ["heart", "心", "血"], icon: Heart },
  { keywords: ["eye", "眼"], icon: Eye },
  { keywords: ["ear", "耳"], icon: Ear },
  { keywords: ["mouth", "口"], icon: MessageCircle },
  { keywords: ["nose", "lung", "肺", "鼻"], icon: Wind },
  { keywords: ["brain", "head", "神经", "头"], icon: Brain },
  { keywords: ["arm", "hand", "手"], icon: Hand },
  { keywords: ["leg", "foot", "knee", "脚", "膝"], icon: Footprints },
  { keywords: ["bone", "joint", "筋骨", "骨", "关节"], icon: Bone },
  { keywords: ["kidney", "liver", "bladder", "肾", "肝", "膀胱"], icon: Droplets },
  { keywords: ["stomach", "intestine", "gut", "胃", "肠"], icon: Pill },
];

const getHealthTipIcon = (bodyPart: string, englishName?: string): LucideIcon => {
  const sourceText = `${bodyPart} ${englishName ?? ""}`.toLowerCase();
  const matchedRule = BODY_PART_ICON_RULES.find((rule) =>
    rule.keywords.some((keyword) => sourceText.includes(keyword.toLowerCase()))
  );

  return matchedRule?.icon ?? AlertTriangle;
};

type HealthCodeScanHeroProps = {
  forPdfCapture?: boolean;
};

/**
 * Section 04 hero — matches Personality Blueprint / Nobleman (purple light, orange dark).
 */
const HealthCodeScanHero: React.FC<HealthCodeScanHeroProps> = ({ forPdfCapture }) => (
  <div
    data-pdf-break-anchor="health-hero"
    className="relative mb-10 overflow-hidden rounded-3xl border-2 border-brand-purple/25 shadow-2xl dark:border-accent-gold/70 dark:shadow-[0_12px_48px_rgba(251,146,60,0.28)] dark:ring-2 dark:ring-accent-gold/40"
  >
    <div
      className="absolute inset-0 bg-gradient-to-br from-brand-purpleDeep via-brand-purple to-indigo-700 dark:from-orange-600 dark:via-amber-600 dark:to-orange-700"
      aria-hidden="true"
    />
    <div
      className="absolute inset-0 opacity-[0.18] dark:opacity-[0.28]"
      style={{
        backgroundImage: `radial-gradient(circle at 18% 40%, rgba(255,255,255,0.35) 1px, transparent 1px),
            radial-gradient(circle at 82% 70%, rgba(255,255,255,0.2) 1px, transparent 1px)`,
        backgroundSize: "42px 42px",
      }}
      aria-hidden="true"
    />
    <div
      className="absolute -right-8 -top-10 h-48 w-48 rounded-full bg-accent-gold/20 blur-3xl dark:bg-amber-300/30"
      aria-hidden="true"
    />
    <div
      className="absolute -bottom-12 -left-6 h-40 w-40 rounded-full bg-indigo-400/25 blur-3xl dark:bg-orange-400/20"
      aria-hidden="true"
    />

    <div className="relative z-10 flex flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-12">
      <div className="min-w-0 flex-1">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
          <Heart className="h-3.5 w-3.5 text-accent-gold" aria-hidden="true" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/90">
            Section 04
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span
            style={
              forPdfCapture
                ? pdfCaptureNumericBadgeStyle("#4A3F6B")
                : {
                    background: "rgba(255, 255, 255, 0.95)",
                    color: "#4A3F6B",
                    height: "40px",
                    minWidth: "52px",
                    padding: "0 14px",
                    borderRadius: "12px",
                    fontSize: "20px",
                    fontWeight: "800",
                    lineHeight: 1,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }
            }
          >
            04
          </span>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl md:text-4xl">
            Health Code Scan
          </h2>
        </div>
        <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-white/90 sm:text-lg">
          Decode your body&apos;s energetic blueprint — where vitality flows and where it
          breaks down.
        </p>
      </div>
      <div
        className={`flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-lg sm:h-24 sm:w-24 ${
          forPdfCapture ? "" : "backdrop-blur-md"
        }`}
      >
        <Hospital className="h-10 w-10 text-white sm:h-12 sm:w-12" aria-hidden="true" />
      </div>
    </div>
    <div
      className="relative z-10 h-1.5 bg-gradient-to-r from-accent-goldDark via-accent-coralDark to-indigo-400 dark:from-amber-200 dark:via-white dark:to-amber-100"
      aria-hidden="true"
    />
  </div>
);

/** Visible character count for collapsed health tip descriptions. */
const TIP_PREVIEW_CHAR_LIMIT = 300;

/**
 * Returns truncated tip text with ellipsis when collapsed and over the preview limit.
 */
const getPreviewTipText = (description: string, expanded: boolean): string => {
  if (expanded || description.length <= TIP_PREVIEW_CHAR_LIMIT) {
    return description;
  }

  const slice = description.slice(0, TIP_PREVIEW_CHAR_LIMIT);
  const lastSpace = slice.lastIndexOf(" ");
  const cut =
    lastSpace > TIP_PREVIEW_CHAR_LIMIT * 0.75
      ? slice.slice(0, lastSpace)
      : slice;

  return `${cut.trimEnd()}…`;
};

const tipExceedsPreviewLimit = (description: string): boolean =>
  description.length > TIP_PREVIEW_CHAR_LIMIT;

const TIP_ACCENTS = [
  { from: "#e11d48", to: "#ea580c" },
  { from: "#dc2626", to: "#d97706" },
  { from: "#be123c", to: "#f97316" },
] as const;

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
  forPdfCapture?: boolean;
}> = ({ affectedParts, gender, forPdfCapture }) => {
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
          if (!forPdfCapture) {
            part.classList.add("animate-pulse");
          }
        });
      });

      // Update the container with the modified SVG
      svgContainerRef.current.innerHTML = svgElement.outerHTML;

      if (forPdfCapture) {
        return undefined;
      }

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
  }, [svgContent, affectedParts, getAffectedSvgParts, forPdfCapture]);

  return <div ref={svgContainerRef} className="w-full h-full" />;
};

/**
 * HealthAnalysis component that analyzes and displays health implications
 * based on stars in the chart's health palace (疾厄宫) with a human body visualization
 */
const Health: React.FC<HealthAnalysisProps> = ({
  chartData,
  palaceOverride,
  forPdfCapture,
}) => {

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
        const analysisResult = analyzeHealthFromChart(chartData, palaceOverride);
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
  }, [chartData, palaceOverride]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="py-8 text-center">
          <AlertTriangle
            className="mx-auto h-12 w-12 text-red-400"
            aria-hidden="true"
          />
          <p className="mt-2 text-red-500 dark:text-red-400">Error: {error}</p>
        </div>
      </div>
    );
  }

  const tipIsExpanded = (index: number): boolean =>
    Boolean(forPdfCapture || expandedTips[index]);

  const affectedCount = healthAnalysis?.affectedBodyParts.length ?? 0;
  const hoverTipClass = forPdfCapture ? "" : "transition-shadow duration-300 hover:shadow-md";

  const bodyMapCard = (
    <article
      className={`overflow-hidden rounded-2xl border border-rose-200/70 bg-white shadow-md dark:border-rose-900/50 dark:bg-gray-800 ${hoverTipClass}`}
      style={forPdfCapture ? { padding: "16px" } : undefined}
    >
      <div className="border-b border-rose-100 bg-gradient-to-r from-rose-50/80 to-orange-50/50 px-5 py-4 dark:border-rose-900/40 dark:from-rose-950/40 dark:to-orange-950/20">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-600 shadow-sm">
            <UserRound className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-rose-700 dark:text-rose-300">
              Body map
            </p>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
              Energetic stress zones
            </h4>
          </div>
        </div>
      </div>
      <div className="p-5">
        <div
          className="mx-auto w-full max-w-[280px]"
          style={forPdfCapture ? { height: "420px" } : { height: "320px" }}
        >
          <HumanBodySVG
            affectedParts={healthAnalysis?.affectedBodyParts ?? []}
            gender={chartData?.input?.gender === "female" ? "female" : "male"}
            forPdfCapture={forPdfCapture}
          />
        </div>
        {affectedCount > 0 ? (
          <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-700">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Highlighted
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {healthAnalysis?.affectedBodyParts.map((part) => (
                <span
                  key={part}
                  className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-800 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-200"
                >
                  {part}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
            No stress zones highlighted in this reading.
          </p>
        )}
      </div>
    </article>
  );

  const tipsContent =
    healthAnalysis && healthAnalysis.affectedBodyParts.length > 0 ? (
      <div
        {...(forPdfCapture ? { "data-pdf-page-break-before": "" } : {})}
        data-pdf-break-anchor="health-analysis-tips"
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-600 shadow-md">
            <Hospital className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-rose-700 dark:text-rose-300">
              Care guidance
            </p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Health analysis &amp; tips
            </h3>
          </div>
        </div>

        <div className="space-y-4">
          {healthAnalysis.healthTips.map((tip, index) => {
            const TipIcon = getHealthTipIcon(tip.bodyPart, tip.englishName);
            const accent = TIP_ACCENTS[index % TIP_ACCENTS.length];
            const isFeatured = index === 0 && healthAnalysis.healthTips.length > 1;

            return (
              <article
                key={`${tip.bodyPart}-${index}`}
                className={`overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800/80 ${hoverTipClass} ${
                  isFeatured ? "sm:p-1" : ""
                }`}
                style={{ borderLeftWidth: "4px", borderLeftColor: accent.from }}
              >
                <div className={isFeatured ? "p-5 sm:p-6" : "p-4"}>
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-white shadow-sm"
                      style={{
                        background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
                      }}
                    >
                      <TipIcon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: accent.from }}
                      >
                        {isFeatured ? "Primary focus" : "Body area"}
                      </p>
                      <h4
                        className={`font-bold text-gray-900 dark:text-white ${
                          isFeatured ? "text-lg sm:text-xl" : "text-base"
                        }`}
                      >
                        {tip.englishName || tip.bodyPart}
                      </h4>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    {getPreviewTipText(tip.description, tipIsExpanded(index))}
                  </p>

                  {!forPdfCapture && tipExceedsPreviewLimit(tip.description) ? (
                    <button
                      type="button"
                      onClick={() => toggleTip(index)}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-rose-600 transition-colors hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
                    >
                      {expandedTips[index] ? (
                        <>
                          Show less
                          <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                        </>
                      ) : (
                        <>
                          Read more
                          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                        </>
                      )}
                    </button>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    ) : (
      <div className="rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 p-8 text-center dark:border-emerald-900/40 dark:from-emerald-950/30 dark:via-gray-800 dark:to-teal-950/20">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
          <Sparkles className="h-8 w-8 text-white" aria-hidden="true" />
        </div>
        <p className="text-lg font-bold text-gray-900 dark:text-white">
          No health concerns detected
        </p>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Your chart shows no significant health indicators at this time.
        </p>
        {healthAnalysis && healthAnalysis.starsInHealthPalace.length > 0 ? (
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
            Stars in palace: {healthAnalysis.starsInHealthPalace.join(", ")}
          </p>
        ) : null}
      </div>
    );

  const mainInner = (
    <div className="p-6">
      <div {...(forPdfCapture ? { "data-pdf-page-break-before": "" } : {})}>
        <HealthCodeScanHero forPdfCapture={forPdfCapture} />
      </div>

      <div
        className={
          forPdfCapture ? "space-y-8" : "grid grid-cols-1 gap-8 lg:grid-cols-12"
        }
      >
        {forPdfCapture ? (
          <div data-pdf-break-anchor="health-body-map">{bodyMapCard}</div>
        ) : null}

        <div
          className={
            forPdfCapture ? "space-y-6" : "order-2 space-y-6 lg:order-1 lg:col-span-8"
          }
        >
          {tipsContent}
        </div>

        {forPdfCapture ? null : (
          <motion.div
            className="order-1 lg:order-2 lg:col-span-4"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="lg:sticky lg:top-24" data-pdf-break-anchor="health-body-map">
              {bodyMapCard}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );

  if (forPdfCapture) {
    return mainInner;
  }

  return (
    <AnimatedWrapper delay={0.2} threshold={0.25}>
      {mainInner}
    </AnimatedWrapper>
  );
};

export default Health;
