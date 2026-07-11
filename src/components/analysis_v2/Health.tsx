import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  analyzeHealthFromChart,
  HealthAnalysisResult,
} from "../../utils/zwds/health_analyzer";

import AnimatedWrapper from "../analysis/AnimatedWrapper";
import {
  AlertTriangle,
  Bone,
  Brain,
  Droplets,
  Ear,
  Eye,
  Footprints,
  Hand,
  Heart,
  MessageCircle,
  Pill,
  Sparkles,
  Wind,
  type LucideIcon,
} from "lucide-react";
import maleSvgContent from "../../assets/male-svg";
import { ChartData } from "../../utils/zwds/types";
import { AnalysisSectionHeader } from "./shared/AnalysisSectionHeader";
import { HealthGuidanceScrollPanel } from "./shared/HealthGuidanceScrollPanel";
import { HealthGuidanceTimeline } from "./shared/HealthGuidanceTimeline";

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

type HealthBodyMapBlockProps = {
  affectedParts: string[];
  getPartLabel: (part: string) => string;
  gender: "male" | "female";
  forPdfCapture?: boolean;
};

/**
 * Flat body map — no card shell; pills for highlighted zones.
 */
const HealthBodyMapBlock: React.FC<HealthBodyMapBlockProps> = ({
  affectedParts,
  getPartLabel,
  gender,
  forPdfCapture,
}) => {
  return (
    <section
      className="flex h-full flex-col justify-center text-center"
      aria-label="Energetic stress zones"
      data-pdf-break-anchor="health-body-map"
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-theme-fg-secondary">
        Energetic stress zones
      </p>
      <div
        className="mx-auto mt-4 w-full max-w-[280px]"
        style={forPdfCapture ? { height: "420px" } : { height: "320px" }}
      >
        <HumanBodySVG
          affectedParts={affectedParts}
          gender={gender}
          forPdfCapture={forPdfCapture}
        />
      </div>
      {affectedParts.length > 0 ? (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {affectedParts.map((part) => (
            <span
              key={part}
              className="rounded-full border border-brand-purple/25 bg-surface-cream/95 px-3 py-1 text-xs font-semibold text-brand-purple dark:border-accent-gold/30 dark:bg-surface-dark/95 dark:text-accent-gold"
            >
              {getPartLabel(part)}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-xs text-theme-fg-secondary">
          No stress zones highlighted in this reading.
        </p>
      )}
    </section>
  );
};

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
            "display: block; fill: #D91744; fill-opacity: 0.5;"
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

  const gender: "male" | "female" =
    chartData?.input?.gender === "female" ? "female" : "male";
  const affectedParts = healthAnalysis?.affectedBodyParts ?? [];
  const healthTips = healthAnalysis?.healthTips ?? [];
  const hasAffected = affectedParts.length > 0;

  const guidanceTips = healthTips.map((tip, index) => ({
    id: `${tip.bodyPart}-${index}`,
    bodyPart: tip.bodyPart,
    englishName: tip.englishName,
    description: tip.description,
  }));

  const resolveBodyPartLabel = (part: string): string => {
    const matchingTip = healthTips.find((tip) => tip.bodyPart === part);
    return matchingTip?.englishName ?? part;
  };

  const guidanceTimeline = forPdfCapture ? (
    <HealthGuidanceTimeline
      tips={guidanceTips}
      getTipIcon={getHealthTipIcon}
      getPreviewText={getPreviewTipText}
      tipExceedsPreviewLimit={tipExceedsPreviewLimit}
      isTipExpanded={tipIsExpanded}
      onToggleTip={toggleTip}
      forPdfCapture={forPdfCapture}
    />
  ) : (
    <HealthGuidanceScrollPanel
      tips={guidanceTips}
      getTipIcon={getHealthTipIcon}
      getPreviewText={getPreviewTipText}
      tipExceedsPreviewLimit={tipExceedsPreviewLimit}
      isTipExpanded={tipIsExpanded}
      onToggleTip={toggleTip}
    />
  );

  const healthScanContent =
    hasAffected && healthTips.length > 0 ? (
      <div
        className={
          forPdfCapture
            ? "grid grid-cols-[minmax(0,7fr)_minmax(0,3fr)] items-center gap-8"
            : "grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:items-center"
        }
        {...(forPdfCapture ? { "data-pdf-page-break-before": "" } : {})}
        data-pdf-break-anchor="health-analysis-tips"
      >
        <div className="min-w-0">
          {!forPdfCapture ? (
            <div className="mb-4 border-l-4 border-brand-purple pl-4 dark:border-accent-goldDark/70">
              <h3 className="font-serif text-xl font-bold text-navy dark:text-cream sm:text-2xl">
                Body Area Guidance
              </h3>
              <p className="mt-1 text-sm text-theme-fg-secondary">
                {guidanceTips.length > 1
                  ? `Scroll to explore all ${guidanceTips.length} focus areas`
                  : "Energetic interpretation for your highlighted zone"}
              </p>
            </div>
          ) : null}

          {guidanceTimeline}
        </div>

        <div className={forPdfCapture ? "" : "lg:sticky lg:top-20 lg:self-center"}>
          <HealthBodyMapBlock
            affectedParts={affectedParts}
            getPartLabel={resolveBodyPartLabel}
            gender={gender}
            forPdfCapture={forPdfCapture}
          />
        </div>
      </div>
    ) : (
      <div className="py-10 text-center">
        <Sparkles
          className="mx-auto h-8 w-8 text-accent-gold/60"
          aria-hidden="true"
        />
        <p className="mt-4 text-lg font-bold text-theme-fg">
          No health concerns detected
        </p>
        <p className="mt-2 text-sm text-theme-fg-secondary">
          Your chart shows no significant health indicators at this time.
        </p>
        {healthAnalysis && healthAnalysis.starsInHealthPalace.length > 0 ? (
          <p className="mt-4 text-xs text-theme-fg-secondary/80">
            Stars in palace: {healthAnalysis.starsInHealthPalace.join(", ")}
          </p>
        ) : null}
      </div>
    );

  const mainInner = (
    <div className="p-6">
      <div {...(forPdfCapture ? { "data-pdf-page-break-before": "" } : {})}>
        <AnalysisSectionHeader
          sectionLabel="Vitality profile"
          badgeText="04"
          title="Health Code Scan"
          subtitle="Decode your body's energetic blueprint — where vitality flows and where it breaks down."
          icon={Heart}
          backgroundImage="/images/chart/men.png"
          backgroundPosition="right 40%"
          pdfBreakAnchor="health-hero"
          forPdfCapture={forPdfCapture}
        />
      </div>

      {healthScanContent}
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
