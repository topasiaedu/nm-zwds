/**
 * Chart color tokens — frozen client semantics vs brand UI chrome.
 * Do not change 四化 hues (green/blue/yellow/red) or timing colors (orange/amber).
 */

import { palette } from "./colorTokens";

/** Four transformations (四化) — client-required hues */
export type TransformationType = "祿" | "權" | "科" | "忌";

export type TransformationSemanticColors = {
  textClass: string;
  textClassSelected: string;
  textClassOnDark: string;
  ringClass: string;
  bgClass: string;
  bgClassSelected: string;
  lineColor: string;
  shadowColor: string;
  borderRgba: string;
};

/**
 * Frozen 四化 palette — green / blue / yellow / red only.
 */
export const chartTransformationSemantic: Record<
  TransformationType,
  TransformationSemanticColors
> = {
  "祿": {
    textClass: "text-green-500",
    textClassSelected: "text-green-300",
    textClassOnDark: "text-green-500",
    ringClass: "ring-green-500",
    bgClass: "bg-green-500/10",
    bgClassSelected: "bg-green-500/10",
    lineColor: "rgba(16, 185, 129, 0.7)",
    shadowColor: "rgba(16, 185, 129, 0.3)",
    borderRgba: "rgba(16, 185, 129, 0.7)",
  },
  "權": {
    textClass: "text-blue-500",
    textClassSelected: "text-blue-300",
    textClassOnDark: "text-blue-500",
    ringClass: "ring-blue-500",
    bgClass: "bg-blue-500/10",
    bgClassSelected: "bg-blue-500/10",
    lineColor: "rgba(56, 189, 248, 0.85)",
    shadowColor: "rgba(56, 189, 248, 0.4)",
    borderRgba: "rgba(56, 189, 248, 0.85)",
  },
  "科": {
    textClass: "text-yellow-500",
    textClassSelected: "text-yellow-300",
    textClassOnDark: "text-yellow-500",
    ringClass: "ring-yellow-500",
    bgClass: "bg-yellow-500/10",
    bgClassSelected: "bg-yellow-500/10",
    lineColor: "rgba(245, 158, 11, 0.7)",
    shadowColor: "rgba(245, 158, 11, 0.3)",
    borderRgba: "rgba(245, 158, 11, 0.7)",
  },
  "忌": {
    textClass: "text-red-500",
    textClassSelected: "text-red-300",
    textClassOnDark: "text-red-500",
    ringClass: "ring-red-500",
    bgClass: "bg-red-500/10",
    bgClassSelected: "bg-red-500/10",
    lineColor: "rgba(239, 68, 68, 0.7)",
    shadowColor: "rgba(239, 68, 68, 0.3)",
    borderRgba: "rgba(239, 68, 68, 0.7)",
  },
};

const transformationFallback = {
  lineColor: "rgba(107, 114, 128, 0.7)",
  shadowColor: "rgba(107, 114, 128, 0.3)",
  borderRgba: "rgba(107, 114, 128, 0.7)",
  ringClass: "",
};

/**
 * Line colors for transformation connector SVG paths.
 */
export function getTransformationLineColors(type: TransformationType): {
  lineColor: string;
  shadowColor: string;
} {
  const entry = chartTransformationSemantic[type];
  return {
    lineColor: entry.lineColor,
    shadowColor: entry.shadowColor,
  };
}

/**
 * Ring class for target palace highlight by transformation type.
 */
export function getTransformationRingClass(type: TransformationType): string {
  return chartTransformationSemantic[type].ringClass;
}

/**
 * Inline border rgba for target palace box-shadow.
 */
export function getTransformationBorderRgba(type: TransformationType): string {
  return chartTransformationSemantic[type].borderRgba;
}

/**
 * Brand purple UI chrome — selection, center panel accents (not 四化 semantics).
 */
export const chartBrandChrome = {
  brandPurple: palette.brand.purple,
  brandPurpleDeep: palette.brand.purpleDeep,
  brandPurpleRgb: "107, 91, 149",
  brandPurpleDeepRgb: "74, 63, 107",
  selectionGradientLight: `linear-gradient(135deg, ${palette.brand.purple}, ${palette.brand.purpleDeep})`,
  selectionGradientDark: `linear-gradient(135deg, rgba(107, 91, 149, 0.85), rgba(74, 63, 107, 0.85))`,
  selectionRingClass: "ring-brand-purple",
  /** Gradient applied via inline style when selected — no light tint class (avoids white-on-tint) */
  selectionBgClass: "",
  selectionGlow: "0 0 15px rgba(107, 91, 149, 0.25)",
  selectionBoxShadow: "0 0 0 2px rgba(107, 91, 149, 0.5)",
  selectionBoxShadowPulse: [
    "0 0 0 2px rgba(107, 91, 149, 0.5)",
    "0 0 0 3px rgba(107, 91, 149, 0.4)",
    "0 0 0 2px rgba(107, 91, 149, 0.5)",
  ] as const,
  daxianRingShadow: "0 0 0 2px rgba(107, 91, 149, 0.7)",
  daMingTagBgClass: "bg-brand-purple/15 dark:bg-brand-purple/30",
  daMingTagTextClass: "text-brand-purpleDeep dark:text-brand-purpleLight",
  centerPanelBorderClass: "border-brand-purple/40 dark:border-brand-purpleDeep/50",
  centerPanelBgClass: "bg-white dark:bg-surface-darkElevated",
  centerPanelHeaderClass: "bg-gradient-brand-purple text-cream",
  centerPanelBodyClass: "bg-white dark:bg-surface-darkElevated",
  centerPanelLabelClass: "zwds-center-label",
  centerPanelValueClass: "zwds-center-value",
  centerPanelShadow: "0 4px 16px rgba(107, 91, 149, 0.15)",
  highlightBorderColor: "#ef4444",
  /** Palace cell surfaces — high contrast inside the chart grid */
  palaceSurfaceClass: "bg-white dark:bg-gray-800",
  palaceBorderClass: "border-gray-200 dark:border-gray-600",
} as const;

/**
 * Detect dark theme via class strategy (matches ThemeToggle / color-scheme.css).
 */
export function isChartDarkMode(): boolean {
  if (typeof document === "undefined") {
    return false;
  }
  return document.documentElement.classList.contains("dark");
}
