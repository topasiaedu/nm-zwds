import React from "react";
import { createRoot } from "react-dom/client";
// @ts-ignore
import html2pdf from "html2pdf.js";
import PdfDocument, { PdfChartData } from "../components/PdfDocument";
import { LanguageProvider } from "../context/LanguageContext";

// Re-export PdfChartData for external use
export type { PdfChartData };

/**
 * Progress callback type for PDF export
 */
export type PdfExportProgressCallback = (progress: {
  step: string;
  percentage: number;
  isComplete: boolean;
  error?: string;
}) => void;

/**
 * Options for PDF export
 */
export interface PdfExportOptions {
  includeAnalysis?: boolean;
  pageBreaks?: boolean;
  quality?: number;
  scale?: number;
  format?: "a4" | "letter" | "legal";
  orientation?: "portrait" | "landscape";
}

/**
 * Default PDF export options
 */
const DEFAULT_OPTIONS: PdfExportOptions = {
  includeAnalysis: true,
  pageBreaks: true,
  quality: 0.95,
  scale: 1.5,
  format: "a4",
  orientation: "portrait",
};

/**
 * Enhanced PDF export function with professional document generation
 * @param chartData - The chart data to export
 * @param calculatedChartData - The calculated chart data
 * @param formatDate - Date formatting function
 * @param language - Current language setting
 * @param onProgress - Progress callback function
 * @param options - Export options
 */
export const exportChartAsPdf = async (
  chartData: PdfChartData,
  calculatedChartData: any,
  formatDate: (date: string) => string,
  language: string,
  onProgress: PdfExportProgressCallback,
  options: PdfExportOptions = {}
): Promise<void> => {
  const finalOptions = { ...DEFAULT_OPTIONS, ...options };
  
  try {
    // Step 1: Initialize
    onProgress({
      step: language === "zh" ? "准备图表数据..." : "Preparing chart data...",
      percentage: 10,
      isComplete: false,
    });

    // Create a temporary container for rendering
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "absolute";
    tempContainer.style.top = "-9999px";
    tempContainer.style.left = "-9999px";
    tempContainer.style.width = "210mm";
    tempContainer.style.visibility = "hidden";
    document.body.appendChild(tempContainer);

    // Step 2: Create PDF document component
    onProgress({
      step: language === "zh" ? "生成封面页..." : "Generating cover page...",
      percentage: 25,
      isComplete: false,
    });

    const root = createRoot(tempContainer);
    
    // Create the PDF document element
    const pdfDocumentElement = React.createElement(
      LanguageProvider,
      null,
      React.createElement(PdfDocument, {
        chartData,
        calculatedChartData,
        formatDate,
        includeAnalysis: finalOptions.includeAnalysis,
        pageBreaks: finalOptions.pageBreaks,
      })
    );

    root.render(pdfDocumentElement);

    // Wait for rendering to complete
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Step 3: Prepare chart visualization
    onProgress({
      step: language === "zh" ? "渲染图表可视化..." : "Rendering chart visualization...",
      percentage: 50,
      isComplete: false,
    });

    // Wait for chart rendering
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Step 4: Configure PDF options
    onProgress({
      step: language === "zh" ? "优化打印..." : "Optimizing for print...",
      percentage: 70,
      isComplete: false,
    });

    const pdfOptions = {
      margin: 0, // CRITICAL: Set to 0 to prevent blank pages
      filename: `${chartData.name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "_")}_zwds_chart.pdf`,
      pagebreak: { mode: 'css' }, // Let CSS handle page breaks
      image: { 
        type: "jpeg", 
        quality: finalOptions.quality 
      },
      html2canvas: { 
        scale: finalOptions.scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        letterRendering: true,
      },
      jsPDF: { 
        unit: "mm", 
        format: finalOptions.format, 
        orientation: finalOptions.orientation,
      },
    };

    // Step 5: Generate PDF
    onProgress({
      step: language === "zh" ? "最终化PDF..." : "Finalizing PDF...",
      percentage: 85,
      isComplete: false,
    });

    // Generate and download PDF
    const pdfElement = tempContainer.firstElementChild as HTMLElement;
    
    await html2pdf()
      .from(pdfElement)
      .set(pdfOptions)
      .toPdf()
      .get("pdf")
      .then((pdf: any) => {
        // Add metadata
        pdf.setProperties({
          title: `${chartData.name} - Zi Wei Dou Shu Chart`,
          subject: "紫微斗数 Chart Analysis",
          author: "ZWDS Chart System",
          keywords: "紫微斗数, astrology, chart, analysis",
          creator: "ZWDS Chart System",
          producer: "ZWDS Chart System",
        });
        
        return pdf;
      })
      .save()
      .then(() => {
        onProgress({
          step: language === "zh" ? "导出完成!" : "Export complete!",
          percentage: 100,
          isComplete: true,
        });
      });

    // Cleanup
    root.unmount();
    document.body.removeChild(tempContainer);

  } catch (error) {
    console.error("PDF export error:", error);
    onProgress({
      step: language === "zh" ? "导出失败" : "Export failed",
      percentage: 0,
      isComplete: true,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

/**
 * Utility function to check if PDF export is supported
 */
export const isPdfExportSupported = (): boolean => {
  try {
    return typeof html2pdf !== "undefined" && typeof document !== "undefined";
  } catch {
    return false;
  }
};

/**
 * Utility function to estimate PDF size
 */
export const estimatePdfSize = (
  chartData: PdfChartData,
  includeAnalysis: boolean = true
): { pages: number; estimatedSizeMB: number } => {
  const basePages = 2; // Cover + Chart
  const analysisPages = includeAnalysis ? 6 : 0; // Analysis sections
  const totalPages = basePages + analysisPages;
  
  // Rough estimate: 0.3MB per page on average
  const estimatedSizeMB = totalPages * 0.3;
  
  return {
    pages: totalPages,
    estimatedSizeMB: Math.round(estimatedSizeMB * 100) / 100,
  };
};

/**
 * Legacy export function for backward compatibility
 */
export const exportChartAsPdfLegacy = (
  printRef: React.RefObject<HTMLDivElement>,
  chartData: PdfChartData | null,
  language: string,
  onExportStart: () => void,
  onExportEnd: () => void,
  showAlert: (message: string, type: "info" | "success" | "warning" | "error") => void
): void => {
  if (!printRef.current) {
    onExportEnd();
    showAlert(
      language === "en" ? "PDF export failed: No content to export" : "PDF导出失败：没有可导出的内容",
      "error"
    );
    return;
  }

  onExportStart();

  const options = {
    margin: 1,
    filename: `${chartData?.name || "chart"}_zwds_chart.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  html2pdf()
    .from(printRef.current)
    .set(options)
    .save()
    .then(() => {
      onExportEnd();
      showAlert(
        language === "en" ? "PDF downloaded successfully!" : "PDF下载成功！",
        "success"
      );
    })
    .catch((error: any) => {
      onExportEnd();
      showAlert(
        language === "en" ? "PDF export failed" : "PDF导出失败",
        "error"
      );
      console.error("PDF export error:", error);
    });
}; 

 