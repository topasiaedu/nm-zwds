/**
 * Memory-optimized PDF export utility for ZWDS charts.
 *
 * This version uses a UI-faithful capture flow:
 * - Cover + chart built with jsPDF primitives
 * - Analysis sections rendered with existing React components off-screen
 * - Multi-page tiling to avoid clipping/stretching for tall sections
 */

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import React from "react";
import ReactDOM from "react-dom/client";
import { PdfChartData } from "../components/PdfDocument";
import {
  PdfCaptureLanguageProvider,
  useLanguage,
  type Language,
} from "../context/LanguageContext";
import type { ChartData } from "../utils/zwds/types";
import Overview from "../components/analysis_v2/Overview";
import WealthCode from "../components/analysis_v2/WealthCode";
import Health from "../components/analysis_v2/Health";
import AreasOfLife from "../components/analysis_v2/AreasOfLIfe";
import FourKeyPalace from "../components/analysis_v2/FourKeyPalace";
import { DayunSection } from "../components/dayun";
import { LiuMonthCard } from "../components/liumonth";
import { NoblemanSection } from "../components/nobleman";
import { calculateCurrentDayunCycle } from "../utils/dayun/calculator";
import { calculateNoblemanData } from "../utils/nobleman/calculator";
import { getLiuMonthAnchorFromLocalDate } from "./destiny-navigator/palace-resolver";

// Re-export PdfChartData for external use
export type { PdfChartData };

export type PdfResultBlueprintMode = "dna" | "dayun" | "liunian" | "liumonth";

export interface PdfResultExportContext {
  blueprintMode: PdfResultBlueprintMode;
  /** Lunar month 1-12 for Liu Month wheel (same convention as `getLiuMonthAnchorFromLocalDate`). */
  selectedLiuMonth: number;
  /** Gregorian year for annual-flow palace on the chart. */
  liuMonthSolarYear: number;
  palaceOverrides: {
    life: number | null;
    wealth: number | null;
    health: number | null;
  };
  resolvePalaceName: (palaceNumber: number) => string;
  liuMonthCard: { palaceNumber: number; palaceName: string } | null;
}

export interface PdfExportOptions {
  includeAnalysis?: boolean;
  pageBreaks?: boolean;
  quality?: number;
  scale?: number;
  format?: "a4" | "letter" | "legal";
  orientation?: "portrait" | "landscape";
  isFreeResult?: boolean;
  resultExportContext?: PdfResultExportContext;
}

export type PdfExportProgressCallback = (progress: {
  step: string;
  percentage: number;
  isComplete: boolean;
  error?: string;
}) => void;

const DEFAULT_OPTIONS: PdfExportOptions = {
  includeAnalysis: true,
  pageBreaks: true,
  quality: 0.95,
  scale: 2,
  format: "a4",
  orientation: "portrait",
  isFreeResult: false,
};

const CAPTURE_WIDTH_PX = 794;
const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;
const PAGE_MARGIN_X_MM = 6;
const PAGE_MARGIN_Y_MM = 6;
const PAGE_DRAW_WIDTH_MM = PAGE_WIDTH_MM - PAGE_MARGIN_X_MM * 2;
const PAGE_DRAW_HEIGHT_MM = PAGE_HEIGHT_MM - PAGE_MARGIN_Y_MM * 2;
const TILE_OVERLAP_PX = 6;
const PDF_CAPTURE_ROOT_CLASS = "pdf-capture-root";
const PAGINATION_ANCHOR_TOLERANCE_RATIO = 0.16;
const MIN_PAGE_FILL_RATIO = 0.72;
const MIN_RESIDUAL_RATIO = 0.2;

/**
 * html2canvas often drops text and inline SVG inside `backdrop-filter` layers, and large
 * CSS `filter: blur()` regions mis-size the raster. Strip these in the **cloned** document only.
 */
function sanitizeDocumentCloneForRasterPdf(clonedDoc: Document): void {
  const patch = clonedDoc.createElement("style");
  patch.setAttribute("data-pdf-raster-sanitize", "true");
  patch.textContent = `
    * {
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
    }
  `;
  const head = clonedDoc.head;
  if (head !== null) {
    head.appendChild(patch);
  }

  const win = clonedDoc.defaultView;
  if (win === null) {
    return;
  }

  const all = clonedDoc.querySelectorAll("*");
  for (let i = 0; i < all.length; i += 1) {
    const node = all[i];
    if (!(node instanceof win.HTMLElement)) {
      continue;
    }
    let filterVal = node.style.filter;
    if (filterVal !== "" && filterVal.toLowerCase().includes("blur")) {
      node.style.filter = "none";
    } else {
      const computed = win.getComputedStyle(node);
      if (computed.filter !== "none" && computed.filter.toLowerCase().includes("blur")) {
        node.style.filter = "none";
      }
    }
  }
}

type CaptureAnchorRange = {
  anchorId: string;
  startY: number;
  endY: number;
};

type CaptureResult = {
  canvas: HTMLCanvasElement;
  anchors: CaptureAnchorRange[];
  /** Y offsets (px) into the captured canvas where a new PDF page must start (see `data-pdf-page-break-before`). */
  hardBreakYs: number[];
};

type PdfLayoutState = {
  cursorYMm: number;
  hasContentOnPage: boolean;
};

const WEALTH_HEADER = {
  badgeText: "02",
  title: "WEALTH CODE ANALYSIS",
  subtitle:
    "Decode your natural earning style and ideal business model aligned to your energy.",
} as const;

const defaultResultExportContext = (): PdfResultExportContext => {
  const anchor = getLiuMonthAnchorFromLocalDate();
  return {
    blueprintMode: "dna",
    selectedLiuMonth: anchor.lunarMonth,
    liuMonthSolarYear: anchor.solarYear,
    palaceOverrides: { life: null, wealth: null, health: null },
    resolvePalaceName: () => "",
    liuMonthCard: null,
  };
};

const mergeResultExportContext = (
  partial?: PdfResultExportContext
): PdfResultExportContext => {
  const base = defaultResultExportContext();
  return {
    ...base,
    ...partial,
    palaceOverrides: {
      ...base.palaceOverrides,
      ...partial?.palaceOverrides,
    },
  };
};

/**
 * Title block matching `/print/result` + in-app analysis header; rendered inside `PdfCaptureLanguageProvider`.
 */
const PdfReportIntroBlock: React.FC = () => {
  const { t } = useLanguage();
  return React.createElement(
    "div",
    { className: "text-center py-6 mb-2 border-b border-gray-300" },
    React.createElement(
      "h2",
      { className: "text-2xl font-bold text-gray-900" },
      t("analysis.title") || "PERSONALIZED LIFE REPORT"
    ),
    React.createElement(
      "p",
      { className: "mt-2 text-sm italic text-gray-600" },
      t("analysis.subtitle") ||
        "A custom breakdown of your chart's strengths, patterns, and strategic focus areas."
    )
  );
};

const setupChineseFonts = (doc: jsPDF): void => {
  doc.setFont("helvetica");
};

type JspdfTextOptions = NonNullable<Parameters<jsPDF["text"]>[3]>;

const addText = (
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  options?: JspdfTextOptions
): void => {
  try {
    doc.text(text, x, y, options);
  } catch {
    const fallbackText = text.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "?");
    doc.text(fallbackText, x, y, options);
  }
};

const assertChartData = (value: unknown): ChartData => {
  if (typeof value !== "object" || value === null) {
    throw new Error("Invalid chart data provided");
  }
  const record = value as Record<string, unknown>;
  if (!Array.isArray(record.palaces)) {
    throw new Error("Chart data missing palaces");
  }
  return value as ChartData;
};

const captureChartAsImage = async (
  setPdfModeCallback?: (enabled: boolean) => void
): Promise<string | null> => {
  const chartElement = document.querySelector(
    "[data-zwds-chart-container=\"true\"]"
  ) as HTMLElement | null;
    if (!chartElement) {
      return null;
    }

  const gridElement = chartElement.querySelector(
    ".grid.grid-cols-4.grid-rows-4"
  ) as HTMLElement | null;

  const originalChartStyles: Partial<CSSStyleDeclaration> = {
      width: chartElement.style.width,
      height: chartElement.style.height,
      minWidth: chartElement.style.minWidth,
      minHeight: chartElement.style.minHeight,
      maxWidth: chartElement.style.maxWidth,
      maxHeight: chartElement.style.maxHeight,
      aspectRatio: chartElement.style.aspectRatio,
    };
  const originalGridStyles: Partial<CSSStyleDeclaration> | null = gridElement
    ? {
      gap: gridElement.style.gap,
      padding: gridElement.style.padding,
      }
    : null;

  const restore = (): void => {
    Object.assign(chartElement.style, originalChartStyles);
    if (gridElement && originalGridStyles) {
      Object.assign(gridElement.style, originalGridStyles);
    }
    setPdfModeCallback?.(false);
  };

  try {
    setPdfModeCallback?.(true);
    chartElement.style.width = "800px";
    chartElement.style.height = "800px";
    chartElement.style.minWidth = "800px";
    chartElement.style.minHeight = "800px";
    chartElement.style.maxWidth = "800px";
    chartElement.style.maxHeight = "800px";
    chartElement.style.aspectRatio = "1";
    if (gridElement) {
      gridElement.style.gap = "4px";
      gridElement.style.padding = "4px";
    }

    await new Promise<void>((resolve) => window.setTimeout(resolve, 1300));

    const canvas = await html2canvas(chartElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: 800,
      height: 800,
      logging: false,
      removeContainer: false,
      onclone: (clonedDoc) => {
        clonedDoc.documentElement.classList.remove("dark");
        clonedDoc.body.classList.remove("dark");
        sanitizeDocumentCloneForRasterPdf(clonedDoc);
      },
    });

    restore();
    const imageData = canvas.toDataURL("image/png", 0.95);
    canvas.remove();
    return imageData;
  } catch (error) {
    console.error("captureChartAsImage:", error);
    restore();
    return null;
  }
};

const captureReactTreeAsCanvas = async (
  lang: Language,
  tree: React.ReactElement,
  waitMs: number,
  scale: number
): Promise<CaptureResult | null> => {
  const tempContainer = document.createElement("div");
  tempContainer.className = PDF_CAPTURE_ROOT_CLASS;
  tempContainer.style.position = "absolute";
  tempContainer.style.left = "-9999px";
  tempContainer.style.top = "-9999px";
  tempContainer.style.width = `${CAPTURE_WIDTH_PX}px`;
  tempContainer.style.height = "auto";
  tempContainer.style.backgroundColor = "#ffffff";
  tempContainer.style.overflow = "visible";
  tempContainer.style.textRendering = "geometricPrecision";
  tempContainer.style.lineHeight = "1.45";
  document.body.appendChild(tempContainer);

  const captureStyle = document.createElement("style");
  captureStyle.textContent = `
    .${PDF_CAPTURE_ROOT_CLASS},
    .${PDF_CAPTURE_ROOT_CLASS} * {
      -webkit-font-smoothing: antialiased !important;
      text-rendering: geometricPrecision !important;
      font-kerning: normal !important;
      font-feature-settings: "liga" 1, "kern" 1 !important;
    }
    .${PDF_CAPTURE_ROOT_CLASS} * {
      animation: none !important;
      transition: none !important;
      caret-color: transparent !important;
    }
    .${PDF_CAPTURE_ROOT_CLASS} [style*="position: sticky"],
    .${PDF_CAPTURE_ROOT_CLASS} [style*="position: fixed"] {
      position: static !important;
    }
  `;
  tempContainer.appendChild(captureStyle);

  const root = ReactDOM.createRoot(tempContainer);

  try {
    await new Promise<void>((resolve) => {
      root.render(
        React.createElement(PdfCaptureLanguageProvider, { language: lang }, tree)
      );
      window.setTimeout(resolve, waitMs);
    });

    if ("fonts" in document) {
      try {
        await (document.fonts as FontFaceSet).ready;
      } catch {
        // no-op
      }
    }

    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    const containerRect = tempContainer.getBoundingClientRect();
    const anchorElements = Array.from(
      tempContainer.querySelectorAll<HTMLElement>("[data-pdf-break-anchor]")
    );
    const anchors: CaptureAnchorRange[] = anchorElements
      .map((element) => {
        const rect = element.getBoundingClientRect();
        const startY = Math.max(0, Math.floor(rect.top - containerRect.top));
        const endY = Math.max(startY + 1, Math.ceil(rect.bottom - containerRect.top));
        const anchorId = element.getAttribute("data-pdf-break-anchor") || "unnamed-anchor";
        return { anchorId, startY, endY };
      })
      .filter((anchor) => anchor.endY > anchor.startY);

    const breakElements = Array.from(
      tempContainer.querySelectorAll<HTMLElement>("[data-pdf-page-break-before]")
    );
    const breakYRaw = breakElements.map((element) => {
      const rect = element.getBoundingClientRect();
      return Math.floor(rect.top - containerRect.top);
    });
    const hardBreakYs = [...new Set(breakYRaw.filter((y) => y >= 0))].sort((a, b) => a - b);

    const canvas = await html2canvas(tempContainer, {
      scale,
      backgroundColor: "#ffffff",
      logging: false,
      useCORS: true,
      allowTaint: true,
      width: CAPTURE_WIDTH_PX,
      height: tempContainer.scrollHeight,
      onclone: (clonedDoc) => {
        clonedDoc.documentElement.classList.remove("dark");
        clonedDoc.body.classList.remove("dark");
        sanitizeDocumentCloneForRasterPdf(clonedDoc);
      },
    });

    root.unmount();
    document.body.removeChild(tempContainer);
    return { canvas, anchors, hardBreakYs };
  } catch (error) {
    console.error("captureReactTreeAsCanvas:", error);
    try {
      root.unmount();
      if (tempContainer.parentNode) {
        document.body.removeChild(tempContainer);
      }
    } catch {
      // no-op
    }
    return null;
  }
};

const addPaginatedCanvasToPdf = (
  doc: jsPDF,
  canvas: HTMLCanvasElement,
  layoutState: PdfLayoutState,
  forcePageBreakBefore: boolean,
  anchors: CaptureAnchorRange[] = [],
  hardBreakYs: number[] = []
): number => {
  if (canvas.width <= 0 || canvas.height <= 0) {
    return 0;
  }

  const pxPerMm = canvas.width / PAGE_DRAW_WIDTH_MM;
  const sliceHeightPxBase = Math.max(1, Math.floor(PAGE_DRAW_HEIGHT_MM * pxPerMm));
  const tolerancePx = Math.max(
    24,
    Math.floor(sliceHeightPxBase * PAGINATION_ANCHOR_TOLERANCE_RATIO)
  );
  const minResidualPx = Math.max(1, Math.floor(sliceHeightPxBase * MIN_RESIDUAL_RATIO));
  const minSlicePx = Math.max(1, Math.floor(sliceHeightPxBase * 0.55));
  const devMode = process.env.NODE_ENV !== "production";
  let sourceY = 0;
  let tileCount = 0;

  const sortedHardBreaks = [...hardBreakYs].filter((y) => y >= 0 && y < canvas.height).sort((a, b) => a - b);

  /**
   * When raster Y reaches a hard break, start a fresh PDF page so the following tile aligns with print CSS.
   */
  const applyHardPageBreakIfAtMarker = (y: number): void => {
    const eps = 2;
    const hit = sortedHardBreaks.some((b) => Math.abs(b - y) <= eps);
    if (!hit) {
      return;
    }
    const atTop = layoutState.cursorYMm <= PAGE_MARGIN_Y_MM + 0.05;
    const needFresh = layoutState.hasContentOnPage || !atTop;
    if (needFresh) {
      doc.addPage();
      layoutState.cursorYMm = PAGE_MARGIN_Y_MM;
      layoutState.hasContentOnPage = false;
  }
};

/**
   * Ensures the next tile fits on the current PDF page, adding pages when needed.
   * Analysis tiles must never be drawn on the chart page: the caller primes a fresh page
   * before the first tile and `hasContentOnPage` tracks whether this layout pass has placed
   * raster content on the current page.
   */
  const ensurePageHasRoom = (tileHeightMm: number): void => {
    const remainingMm = PAGE_HEIGHT_MM - PAGE_MARGIN_Y_MM - layoutState.cursorYMm;
    const atPageTop = layoutState.cursorYMm <= PAGE_MARGIN_Y_MM + 0.05;
    const overflow = tileHeightMm > remainingMm + 0.01;

    let needsNewPage = false;
    if (overflow) {
      needsNewPage = !atPageTop || layoutState.hasContentOnPage;
    } else if (forcePageBreakBefore) {
      needsNewPage = !atPageTop || layoutState.hasContentOnPage;
    } else if (!layoutState.hasContentOnPage) {
      needsNewPage = false;
    }

    if (needsNewPage) {
      doc.addPage();
      layoutState.cursorYMm = PAGE_MARGIN_Y_MM;
    }
    layoutState.hasContentOnPage = true;
    forcePageBreakBefore = false;
  };

  while (sourceY < canvas.height) {
    applyHardPageBreakIfAtMarker(sourceY);

    const remaining = canvas.height - sourceY;
    let sliceHeight = Math.min(sliceHeightPxBase, remaining);

    if (sliceHeight < remaining) {
      const currentSourceY = sourceY;
      const targetCut = sourceY + sliceHeight;
      const anchorCandidates = anchors
        .flatMap((anchor) => [anchor.startY, anchor.endY].map((y) => ({ y, anchorId: anchor.anchorId })))
        .filter((candidate) => {
          const distance = Math.abs(candidate.y - targetCut);
          return (
            candidate.y > currentSourceY + Math.floor(minSlicePx * 0.7) &&
            candidate.y < currentSourceY + remaining &&
            distance <= tolerancePx
          );
        })
        .sort((left, right) => Math.abs(left.y - targetCut) - Math.abs(right.y - targetCut));

      if (anchorCandidates.length > 0) {
        sliceHeight = Math.max(minSlicePx, anchorCandidates[0].y - currentSourceY);
      }

      const residual = remaining - sliceHeight;
      const fillRatio = sliceHeight / sliceHeightPxBase;
      if (residual > 0 && residual < minResidualPx && fillRatio >= MIN_PAGE_FILL_RATIO) {
        sliceHeight = remaining;
      }
    }

    /**
     * Never emit a tile taller than one printable page; oversized tiles overflow jsPDF's page
     * and produce huge blank areas / clipped content on following pages.
     */
    sliceHeight = Math.min(sliceHeight, sliceHeightPxBase);

    let nextHardBreak: number | undefined;
    for (let i = 0; i < sortedHardBreaks.length; i += 1) {
      const breakpointY = sortedHardBreaks[i];
      if (breakpointY > sourceY + 1 && breakpointY < sourceY + sliceHeight) {
        nextHardBreak = breakpointY;
        break;
      }
    }

    let hardBreakSlice = false;
    if (nextHardBreak !== undefined) {
      const upToBreak = nextHardBreak - sourceY;
      if (upToBreak >= 1) {
        sliceHeight = Math.min(sliceHeight, upToBreak);
        hardBreakSlice = true;
      }
    }

    if (sliceHeight <= 0) {
      break;
    }

    const tileCanvas = document.createElement("canvas");
    tileCanvas.width = canvas.width;
    tileCanvas.height = sliceHeight;

    if (tileCanvas.height <= 0) {
      tileCanvas.remove();
      break;
    }

    const context = tileCanvas.getContext("2d");
    if (!context) {
      break;
    }

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, tileCanvas.width, tileCanvas.height);
    context.drawImage(
      canvas,
      0,
      sourceY,
      canvas.width,
      sliceHeight,
      0,
      0,
      tileCanvas.width,
      tileCanvas.height
    );

    const tileHeightMm = sliceHeight / pxPerMm;
    ensurePageHasRoom(tileHeightMm);
    const imageData = tileCanvas.toDataURL("image/png", 0.95);
    doc.addImage(
      imageData,
      "PNG",
      PAGE_MARGIN_X_MM,
      layoutState.cursorYMm,
      PAGE_DRAW_WIDTH_MM,
      tileHeightMm,
      undefined,
      "FAST"
    );
    layoutState.cursorYMm += tileHeightMm;
    layoutState.hasContentOnPage = true;

    tileCanvas.remove();
    tileCount += 1;

    if (devMode) {
      const fillRatio = Math.min(1, sliceHeight / sliceHeightPxBase);
      console.debug("[pdfExport] page slice", {
        pageIndex: tileCount,
        sourceY,
        sliceHeight,
        fillRatio,
      });
    }

    if (sliceHeight === remaining) {
      break;
    }
    if (hardBreakSlice) {
      sourceY += sliceHeight;
    } else {
      const overlapPx =
        sliceHeight >= sliceHeightPxBase * 0.92
          ? Math.max(2, TILE_OVERLAP_PX - 4)
          : Math.max(2, TILE_OVERLAP_PX - 2);
      sourceY += Math.max(1, sliceHeight - overlapPx);
    }
  }

  return tileCount;
};

type TrimCanvasResult = {
  canvas: HTMLCanvasElement;
  /** Rows cropped from the top; subtract from hard-break Y values. */
  topTrimPx: number;
};

const trimCanvasVerticalWhitespace = (sourceCanvas: HTMLCanvasElement): TrimCanvasResult => {
  const context = sourceCanvas.getContext("2d");
  if (!context) {
    return { canvas: sourceCanvas, topTrimPx: 0 };
  }
  const { width, height } = sourceCanvas;
  const imageData = context.getImageData(0, 0, width, height).data;

  const isRowMostlyWhite = (row: number): boolean => {
    let nonWhiteCount = 0;
    for (let x = 0; x < width; x += 1) {
      const index = (row * width + x) * 4;
      const r = imageData[index];
      const g = imageData[index + 1];
      const b = imageData[index + 2];
      const a = imageData[index + 3];
      if (a > 8 && (r < 246 || g < 246 || b < 246)) {
        nonWhiteCount += 1;
        if (nonWhiteCount > Math.max(3, Math.floor(width * 0.0025))) {
    return false;
  }
      }
    }
    return true;
  };

  let top = 0;
  while (top < height - 1 && isRowMostlyWhite(top)) {
    top += 1;
  }
  let bottom = height - 1;
  while (bottom > top && isRowMostlyWhite(bottom)) {
    bottom -= 1;
  }

  const contentHeight = bottom - top + 1;
  if (contentHeight <= 0 || contentHeight >= height) {
    return { canvas: sourceCanvas, topTrimPx: 0 };
  }

  const trimmedCanvas = document.createElement("canvas");
  trimmedCanvas.width = width;
  trimmedCanvas.height = contentHeight;
  const trimmedContext = trimmedCanvas.getContext("2d");
  if (!trimmedContext) {
    return { canvas: sourceCanvas, topTrimPx: 0 };
  }
  trimmedContext.fillStyle = "#ffffff";
  trimmedContext.fillRect(0, 0, width, contentHeight);
  trimmedContext.drawImage(
    sourceCanvas,
    0,
    top,
    width,
    contentHeight,
    0,
    0,
    width,
    contentHeight
  );
  return { canvas: trimmedCanvas, topTrimPx: top };
};

const isCaptureCanvasValid = (canvas: HTMLCanvasElement | null): canvas is HTMLCanvasElement => {
  if (!canvas) {
    return false;
  }
  return canvas.width > 0 && canvas.height > 0;
};

const addCoverPage = (
  doc: jsPDF,
  chartData: PdfChartData,
  formatDate: (date: string) => string,
  language: string
): void => {
  const zh = language === "zh";

  doc.setFontSize(24);
  doc.setTextColor(124, 58, 237);
  addText(doc, zh ? "紫微斗数图表分析" : "Zi Wei Dou Shu Chart Analysis", 105, 40, {
    align: "center",
  });

  doc.setFontSize(16);
  doc.setTextColor(107, 114, 128);
  addText(doc, zh ? "专业占星报告" : "Professional Astrological Report", 105, 55, {
    align: "center",
  });

    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(248, 250, 252);
  doc.roundedRect(30, 80, 150, 80, 3, 3, "FD");

    doc.setFontSize(14);
    doc.setTextColor(31, 41, 55);
  addText(doc, zh ? "个人信息" : "Profile Information", 105, 95, { align: "center" });

  const genderText = chartData.gender === "male" ? (zh ? "男" : "Male") : zh ? "女" : "Female";
  const profileLines = [
    { label: zh ? "姓名" : "Name", value: chartData.name, y: 110 },
    { label: zh ? "性别" : "Gender", value: genderText, y: 122 },
    { label: zh ? "出生日期" : "Birth Date", value: formatDate(chartData.birthDate), y: 134 },
    { label: zh ? "出生时间" : "Birth Time", value: chartData.birthTime, y: 146 },
  ] as const;

    doc.setFontSize(11);
  profileLines.forEach((line) => {
    doc.setTextColor(107, 114, 128);
    addText(doc, `${line.label}:`, 40, line.y);
       doc.setTextColor(31, 41, 55);
    addText(doc, line.value, 90, line.y);
  });

    doc.setFontSize(9);
    doc.setTextColor(156, 163, 175);
  addText(
    doc,
    `${zh ? "报告生成日期" : "Report Generated"}: ${new Date().toLocaleDateString()}`,
    105,
    200,
    { align: "center" }
  );
  addText(
    doc,
    zh ? "此报告为机密文件，仅供个人使用" : "This report is confidential and intended for personal use only.",
    105,
    210,
    { align: "center" }
  );
};

const addChartPage = async (
  doc: jsPDF,
  chartData: PdfChartData,
  formatDate: (date: string) => string,
  language: string,
  setPdfModeCallback?: (enabled: boolean) => void
): Promise<void> => {
  const zh = language === "zh";

     doc.addPage();
     doc.setFontSize(18);
     doc.setTextColor(31, 41, 55);
  addText(doc, zh ? "紫微斗数图表" : "Zi Wei Dou Shu Chart", 20, 30);

     doc.setFontSize(10);
     doc.setTextColor(107, 114, 128);
     addText(doc, `${chartData.name} • ${formatDate(chartData.birthDate)} • ${chartData.birthTime}`, 20, 45);

  const imageData = await captureChartAsImage(setPdfModeCallback);
  if (!imageData) {
    doc.setFontSize(12);
    doc.setTextColor(220, 38, 38);
    addText(
      doc,
      zh ? "图表截图失败，请在应用中查看。" : "Chart capture failed, please view in app.",
      105,
      120,
      { align: "center" }
    );
    return;
  }

  const imageSize = Math.min(PAGE_DRAW_WIDTH_MM, 170);
  const x = (PAGE_WIDTH_MM - imageSize) / 2;
  doc.addImage(imageData, "PNG", x, 55, imageSize, imageSize, undefined, "SLOW");
};

const appendMirroredAnalysisPages = async (
  doc: jsPDF,
  calculatedChartData: ChartData,
  language: string,
  ctx: PdfResultExportContext,
  qualityScale: number,
  onProgress: PdfExportProgressCallback
): Promise<void> => {
  const zh = language === "zh";
  const langCapture: Language = zh ? "zh" : "en";

  const layoutState: PdfLayoutState = {
    cursorYMm: PAGE_MARGIN_Y_MM,
    hasContentOnPage: false,
  };

  /**
   * Adds a fresh PDF page and resets the vertical cursor so analysis rasters never land on the chart page.
   */
  const beginAnalysisDocumentPages = (): void => {
       doc.addPage();
    layoutState.cursorYMm = PAGE_MARGIN_Y_MM;
    layoutState.hasContentOnPage = false;
  };

  const captureAndAdd = async (
    progressTextZh: string,
    progressTextEn: string,
    percentage: number,
    tree: React.ReactElement,
    waitMs: number,
    fallbackTextZh: string,
    fallbackTextEn: string,
    startOnNewPage: boolean = false
  ): Promise<void> => {
       onProgress({
      step: zh ? progressTextZh : progressTextEn,
      percentage,
         isComplete: false,
       });

    const captureResult = await captureReactTreeAsCanvas(
      langCapture,
      tree,
      waitMs,
      qualityScale
    );
    if (!captureResult || !isCaptureCanvasValid(captureResult.canvas)) {
       doc.addPage();
      doc.setFontSize(12);
      doc.setTextColor(220, 38, 38);
      addText(doc, zh ? fallbackTextZh : fallbackTextEn, 105, 40, { align: "center" });
      return;
    }

    const { canvas: trimmedCanvas, topTrimPx } = trimCanvasVerticalWhitespace(captureResult.canvas);
    const adjustedHardBreaks = captureResult.hardBreakYs
      .map((y) => y - topTrimPx)
      .filter((y) => y >= 0 && y < trimmedCanvas.height);
    const pageTiles = addPaginatedCanvasToPdf(
      doc,
      trimmedCanvas,
      layoutState,
      startOnNewPage,
      captureResult.anchors,
      adjustedHardBreaks
    );
    captureResult.canvas.remove();
    if (trimmedCanvas !== captureResult.canvas) {
      trimmedCanvas.remove();
    }
    if (pageTiles <= 0) {
       doc.addPage();
      doc.setFontSize(12);
      doc.setTextColor(220, 38, 38);
      addText(doc, zh ? fallbackTextZh : fallbackTextEn, 105, 40, { align: "center" });
    }
  };

  if (ctx.blueprintMode === "dayun") {
    const cycle = calculateCurrentDayunCycle(calculatedChartData);
    if (!cycle) {
         doc.addPage();
      doc.setFontSize(12);
      doc.setTextColor(107, 114, 128);
      addText(
        doc,
        zh ? "当前无法生成大运分析。" : "Da Yun section is unavailable for this chart.",
        105,
        40,
        { align: "center" }
      );
      return;
    }

    beginAnalysisDocumentPages();
    await captureAndAdd(
      "正在添加大运分析...",
      "Adding Da Yun analysis...",
      72,
      React.createElement(DayunSection, {
        chartData: calculatedChartData,
        showHeader: false,
      }),
      1400,
      "大运页面截图失败",
      "Da Yun capture failed",
      true
    );
    return;
  }

  if (ctx.blueprintMode === "liumonth") {
    if (!ctx.liuMonthCard) {
       doc.addPage();
      doc.setFontSize(12);
      doc.setTextColor(107, 114, 128);
      addText(
        doc,
        zh ? "流月数据不可用。" : "Liu month data is unavailable.",
        105,
        40,
        { align: "center" }
      );
      return;
    }

    beginAnalysisDocumentPages();
    await captureAndAdd(
      "正在添加流月简报...",
      "Adding Liu month briefing...",
      72,
      React.createElement(LiuMonthCard, {
        selectedMonth: ctx.selectedLiuMonth,
        solarYear: ctx.liuMonthSolarYear,
        palaceNumber: ctx.liuMonthCard.palaceNumber,
        palaceName: ctx.liuMonthCard.palaceName,
      }),
      1200,
      "流月页面截图失败",
      "Liu month capture failed",
      true
    );
    return;
  }

  const lifePalace = ctx.palaceOverrides.life ?? undefined;
  const wealthPalace = ctx.palaceOverrides.wealth ?? undefined;
  const healthPalace = ctx.palaceOverrides.health ?? undefined;

  beginAnalysisDocumentPages();

  await captureAndAdd(
    "正在添加总览...",
    "Adding overview...",
    66,
    React.createElement(
      React.Fragment,
      null,
      React.createElement(PdfReportIntroBlock, null),
      React.createElement(Overview, {
        chartData: calculatedChartData,
        palaceOverride: lifePalace,
        forPdfCapture: true,
      })
    ),
    900,
    "总览截图失败",
    "Overview capture failed",
    true
  );

  await captureAndAdd(
    "正在添加财富密码...",
    "Adding wealth code...",
    72,
    React.createElement(WealthCode, {
      chartData: calculatedChartData,
      header: WEALTH_HEADER,
      showTopDivider: false,
      palaceOverride: wealthPalace,
      forPdfCapture: true,
    }),
    2000,
    "财富分析截图失败",
    "Wealth section capture failed"
  );

  if (calculateNoblemanData(calculatedChartData)) {
    await captureAndAdd(
      "正在添加贵人分析...",
      "Adding nobleman analysis...",
      78,
      React.createElement(NoblemanSection, {
        chartData: calculatedChartData,
        forPdfCapture: true,
      }),
      1700,
      "贵人分析截图失败",
      "Nobleman capture failed"
    );
  }

  await captureAndAdd(
    "正在添加健康分析...",
    "Adding health analysis...",
    84,
    React.createElement(Health, {
      chartData: calculatedChartData,
      palaceOverride: healthPalace,
      forPdfCapture: true,
    }),
    2200,
    "健康分析截图失败",
    "Health capture failed"
  );

  await captureAndAdd(
    "正在添加关键宫位...",
    "Adding destiny alert map...",
    90,
    React.createElement(FourKeyPalace, {
      chartData: calculatedChartData,
      resolvePalaceName: ctx.resolvePalaceName,
      forPdfCapture: true,
    }),
    1200,
    "关键宫位截图失败",
    "Destiny alert capture failed"
  );

  await captureAndAdd(
    "正在添加人生领域...",
    "Adding life areas...",
    95,
    React.createElement(AreasOfLife, {
      chartData: calculatedChartData,
      palaceOverride: lifePalace,
      forPdfCapture: true,
    }),
    1500,
    "人生领域截图失败",
    "Life areas capture failed"
  );
};

export const exportChartAsPdf = async (
  chartData: PdfChartData,
  calculatedChartData: unknown,
  formatDate: (date: string) => string,
  language: string,
  onProgress: PdfExportProgressCallback,
  options: PdfExportOptions = {},
  setPdfModeCallback?: (enabled: boolean) => void
): Promise<void> => {
  const finalOptions = { ...DEFAULT_OPTIONS, ...options };
  const zh = language === "zh";

  try {
         onProgress({
      step: zh ? "正在准备您的报告..." : "Preparing your report...",
      percentage: 10,
           isComplete: false,
         });

    const chartDataSafe = assertChartData(calculatedChartData);

    const doc = new jsPDF({
      orientation: finalOptions.orientation ?? "portrait",
      unit: "mm",
      format: finalOptions.format ?? "a4",
      compress: true,
    });

    setupChineseFonts(doc);

       onProgress({
      step: zh ? "正在创建封面..." : "Creating cover page...",
      percentage: 24,
         isComplete: false,
       });

    addCoverPage(doc, chartData, formatDate, language);

       onProgress({
      step: zh ? "正在准备图表..." : "Preparing chart page...",
      percentage: 40,
         isComplete: false,
       });

    await addChartPage(doc, chartData, formatDate, language, setPdfModeCallback);

    if (!finalOptions.isFreeResult && finalOptions.includeAnalysis) {
      const ctx = mergeResultExportContext(finalOptions.resultExportContext);
      await appendMirroredAnalysisPages(
        doc,
        chartDataSafe,
        language,
        ctx,
        Math.max(2, finalOptions.scale ?? 2),
        onProgress
      );
    }

     onProgress({
      step: zh ? "正在完成 PDF..." : "Finalizing PDF...",
       percentage: 99,
       isComplete: false,
     });

     const pageCount = doc.getNumberOfPages();
    for (let index = 2; index <= pageCount; index += 1) {
      doc.setPage(index);
       doc.setFontSize(8);
       doc.setTextColor(107, 114, 128);
      addText(doc, `${zh ? "第" : "Page"} ${index}`, 105, 288, { align: "center" });
     }

     doc.setProperties({
       title: `${chartData.name} - ZWDS Chart`,
       subject: "ZWDS Chart Analysis",
       author: "ZWDS System",
       creator: "ZWDS System",
     });

     const safeName = chartData.name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "_");
    doc.save(`${safeName}_zwds.pdf`);

    onProgress({
      step: zh ? "完成！" : "Done!",
      percentage: 100,
      isComplete: true,
    });
   } catch (error) {
     console.error("PDF export error:", error);
     onProgress({
      step: zh ? "导出失败" : "Export failed",
       percentage: 0,
       isComplete: true,
       error: error instanceof Error ? error.message : "Unknown error occurred",
     });
  }
};

export const isPdfExportSupported = (): boolean => {
  try {
    return typeof jsPDF !== "undefined" && typeof document !== "undefined";
  } catch {
    return false;
  }
};

export const estimatePdfSize = (
  _chartData: PdfChartData,
  includeAnalysis: boolean = true,
  isFreeResult: boolean = false,
  resultExportContext?: PdfResultExportContext
): { pages: number; estimatedSizeMB: number; memoryUsageMB: number } => {
  const basePages = 2;
  let analysisPages = 0;

  if (!isFreeResult && includeAnalysis) {
    const ctx = mergeResultExportContext(resultExportContext);
    if (ctx.blueprintMode === "dayun" || ctx.blueprintMode === "liumonth") {
      analysisPages = 2;
    } else {
      analysisPages = 6;
    }
  }

  const totalPages = basePages + analysisPages;
  const estimatedSizeMB = totalPages * 0.45;
  const memoryUsageMB = totalPages * 4;
  
  return {
    pages: totalPages,
    estimatedSizeMB: Math.round(estimatedSizeMB * 100) / 100,
    memoryUsageMB: Math.round(memoryUsageMB * 100) / 100,
  };
};

export const exportChartAsPdfLegacy = (
  printRef: React.RefObject<HTMLDivElement>,
  chartData: PdfChartData | null,
  language: string,
  onExportStart: () => void,
  onExportEnd: () => void,
  showAlert: (message: string, type: "info" | "success" | "warning" | "error") => void
): void => {
  if (!chartData) {
    onExportEnd();
    showAlert(
      language === "en"
        ? "PDF export failed: No chart data available"
        : "PDF导出失败：没有图表数据",
      "error"
    );
    return;
  }

  onExportStart();

  try {
    const doc = new jsPDF("portrait", "mm", "a4");
    setupChineseFonts(doc);

    doc.setFontSize(16);
    addText(doc, `${chartData.name} - ZWDS Chart`, 20, 30);
    doc.setFontSize(12);
    addText(doc, `Birth Date: ${chartData.birthDate}`, 20, 50);
    addText(doc, `Birth Time: ${chartData.birthTime}`, 20, 65);
    addText(doc, `Gender: ${chartData.gender}`, 20, 80);

    doc.save(`${chartData.name}_zwds_chart.pdf`);

    onExportEnd();
    showAlert(language === "en" ? "PDF downloaded successfully!" : "PDF下载成功！", "success");
  } catch (error) {
    onExportEnd();
    showAlert(language === "en" ? "PDF export failed" : "PDF导出失败", "error");
    console.error("PDF export error:", error);
  }
}; 
 