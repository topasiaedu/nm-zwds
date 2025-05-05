// @ts-ignore
import html2pdf from "html2pdf.js";

/**
 * Interface for chart data
 */
export interface ChartData {
  id: string;
  name: string;
  birthDate: string;
  birthTime: string;
  gender: string;
  createdAt: string;
}

/**
 * Check if an element's height exceeds the available page height
 * @param element - The HTML element to check
 * @param pageHeight - The available page height in pixels
 * @returns boolean indicating if the element needs to be split
 */
const shouldSplitElement = (element: HTMLElement, pageHeight: number): boolean => {
  const rect = element.getBoundingClientRect();
  return rect.height > pageHeight;
};

/**
 * Apply light mode styles to ensure PDF is rendered in light mode regardless of app theme
 * @param doc - The document to apply styles to
 */
const forceLightMode = (doc: Document): void => {
  // Add inline styles to force light mode for the export
  const printContainer = doc.querySelector(".print-container");
  if (printContainer) {
    // Force light mode colors
    (printContainer as HTMLElement).style.setProperty("color", "#000", "important");
    (printContainer as HTMLElement).style.setProperty("background-color", "#fff", "important");
    
    // Apply to all child elements
    const allElements = printContainer.querySelectorAll("*");
    allElements.forEach(el => {
      // Skip SVG paths and specific elements that shouldn't inherit text color
      if (el.tagName.toLowerCase() === "path" || 
          el.tagName.toLowerCase() === "circle" ||
          el.tagName.toLowerCase() === "rect") {
        return;
      }
      
      const element = el as HTMLElement;
      
      // Check for dark mode text colors and replace with light mode equivalents
      const computedStyle = window.getComputedStyle(element);
      const color = computedStyle.color;
      const backgroundColor = computedStyle.backgroundColor;
      
      // If it's a very dark color (likely text in dark mode), make it black
      if (color && color.includes("rgba(255,") || color.includes("rgb(255,")) {
        element.style.setProperty("color", "#000", "important");
      }
      
      // If it's a very dark background, make it white or light
      if (backgroundColor && 
          (backgroundColor.includes("rgba(0,") || 
           backgroundColor.includes("rgb(0,") ||
           backgroundColor.includes("rgba(17,") || 
           backgroundColor.includes("rgb(17,"))) {
        element.style.setProperty("background-color", "#fff", "important");
      }
    });
    
    // Handle specific elements like headings and text
    const headings = printContainer.querySelectorAll("h1, h2, h3, h4, h5, h6, strong, .font-bold");
    headings.forEach(heading => {
      (heading as HTMLElement).style.setProperty("color", "#000", "important");
    });
    
    // Handle SVG text elements for charts
    const svgTexts = printContainer.querySelectorAll("svg text, svg .chart-text");
    svgTexts.forEach(text => {
      (text as SVGElement).style.setProperty("fill", "#000", "important");
    });
    
    // Content boxes
    const contentBoxes = printContainer.querySelectorAll(".content-box");
    contentBoxes.forEach(box => {
      (box as HTMLElement).style.setProperty("background-color", "#fff", "important");
      (box as HTMLElement).style.setProperty("border-color", "#e5e7eb", "important");
    });
  }
};

/**
 * Exports the chart data as a PDF
 * @param printRef - Reference to the element to be exported
 * @param chartData - The chart data object
 * @param language - Current language
 * @param onExportStart - Callback called when export starts
 * @param onExportEnd - Callback called when export ends
 */
export const exportChartAsPdf = (
  printRef: React.RefObject<HTMLDivElement>,
  chartData: ChartData | null,
  language: string,
  onExportStart: () => void,
  onExportEnd: () => void
): void => {
  // Show export in progress
  onExportStart();

  // Show a user-friendly message about PDF generation
  if (language === "en") {
    alert("Preparing your professional report. This may take a moment...");
  } else {
    alert("正在准备您的专业报告，这可能需要一点时间...");
  }

  // Give time for the content to render - longer for complex charts
  setTimeout(() => {
    if (printRef.current) {
      try {
        // Configure pdf options for better chart rendering
        const options = {
          margin: 0,
          filename: `${chartData?.name || "chart"}_zwds_report.pdf`,
          image: { type: "jpeg", quality: 1.0 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
            letterRendering: true,
            allowTaint: true,
            onclone: (clonedDoc: Document) => {
              try {
                // Force light mode for export
                forceLightMode(clonedDoc);
                
                // Define available page height (A4 page height minus margins)
                const availablePageHeight = 960; // ~297mm (A4 height) - margins in px at 96dpi
                
                // Process all pages for better layout
                const pages = clonedDoc.querySelectorAll(".print-page");
                pages.forEach(page => {
                  // Let Tailwind CSS handle the styling, just ensure we have proper page breaks
                  (page as HTMLElement).style.pageBreakAfter = "always";
                  (page as HTMLElement).style.breakAfter = "page";
                });
                
                // Special handling for chart containers
                const chartContainers = clonedDoc.querySelectorAll(".zwds-chart-container, .radar-chart-container");
                chartContainers.forEach(container => {
                  const containerElement = container as HTMLElement;
                  containerElement.style.pageBreakInside = "avoid";
                  containerElement.style.breakInside = "avoid";
                  containerElement.style.overflow = "visible";
                });
                
                // Make sure SVGs render correctly
                const svgs = clonedDoc.querySelectorAll("svg");
                svgs.forEach(svg => {
                  svg.style.overflow = "visible";
                  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
                });
                
                // Special handling for content boxes that exceed page height
                const contentBoxes = clonedDoc.querySelectorAll(".content-box");
                contentBoxes.forEach(box => {
                  const boxElement = box as HTMLElement;
                  
                  // Allow large content boxes to naturally break across pages
                  if (shouldSplitElement(boxElement, availablePageHeight)) {
                    if (boxElement.classList.contains("life-areas-explanation-container") || 
                        boxElement.classList.contains("career-analysis-container") ||
                        boxElement.classList.contains("watchout-analysis-container")) {
                      boxElement.style.pageBreakInside = "auto";
                      boxElement.style.breakInside = "auto";
                      
                      // Add page break hints before headings for natural content flow
                      const headings = boxElement.querySelectorAll("h3, h4");
                      Array.from(headings).forEach((heading, idx) => {
                        if (idx > 0) {
                          (heading as HTMLElement).style.pageBreakBefore = "auto";
                          (heading as HTMLElement).style.breakBefore = "auto";
                          // Add margin to make breaks more natural
                          (heading as HTMLElement).style.marginTop = "1.5rem";
                        }
                      });
                    }
                  } else {
                    // Smaller content boxes should stay together
                    boxElement.style.pageBreakInside = "avoid";
                    boxElement.style.breakInside = "avoid";
                  }
                });
                
                // Handle ZWDS chart elements to ensure they render properly
                const zwdsElements = clonedDoc.querySelectorAll(".palace-box, .palace-content, .palace-star");
                zwdsElements.forEach(element => {
                  (element as HTMLElement).style.overflow = "visible";
                });
                
                // Keep tables and images intact
                const tables = clonedDoc.querySelectorAll("table");
                tables.forEach(table => {
                  (table as HTMLElement).style.pageBreakInside = "avoid";
                  (table as HTMLElement).style.breakInside = "avoid";
                });
                
                const images = clonedDoc.querySelectorAll("img");
                images.forEach(img => {
                  (img as HTMLElement).style.pageBreakInside = "avoid";
                  (img as HTMLElement).style.breakInside = "avoid";
                });
              } catch (e) {
                console.error("Error in onclone handler:", e);
              }
            }
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
            compress: true,
            pagesplit: true,
            hotfixes: ["px_scaling"]
          },
          pagebreak: {
            mode: ["css", "legacy"],
            avoid: ["table", "img", ".zwds-chart-container", ".radar-chart-container"]
          },
        };

        // Generate and download PDF
        html2pdf()
          .from(printRef.current)
          .set(options)
          .toPdf() // Convert to PDF
          .get("pdf")
          .then((pdf: any) => {
            // Ensure PDF is fully rendered before saving
            try {
              pdf.setProperties({
                title: `${chartData?.name} - 紫微斗数命盘分析`,
                subject: "紫微斗数命盘分析",
                creator: "紫微斗数 Analysis",
                author: "紫微斗数 Analysis"
              });
              
              // Add page numbers to all pages except cover
              const totalPages = pdf.internal.getNumberOfPages();
              for (let i = 2; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(9);
                pdf.setTextColor(150, 150, 150);
                pdf.text(
                  `${i-1}/${totalPages-1}`, 
                  pdf.internal.pageSize.getWidth() / 2, 
                  pdf.internal.pageSize.getHeight() - 10, 
                  { align: "center" }
                );
              }
              
              return pdf;
            } catch (e) {
              console.error("Error setting PDF properties:", e);
              return pdf;
            }
          })
          .save()
          .then(() => {
            // Reset states after PDF is generated
            setTimeout(() => {
              onExportEnd();
            }, 1000);
          })
          .catch((error: any) => {
            console.error("PDF generation failed:", error);
            onExportEnd();
            
            // Show error notification to user
            if (language === "en") {
              alert("Failed to generate PDF. Please try again.");
            } else {
              alert("导出PDF失败。请重试。");
            }
          });
      } catch (error) {
        console.error("Error in export process:", error);
        onExportEnd();
        
        // Show error notification to user
        if (language === "en") {
          alert("An error occurred during export. Please try again.");
        } else {
          alert("导出过程中发生错误。请重试。");
        }
      }
    } else {
      onExportEnd();
    }
  }, 3000); // Give more time for the content to render
}; 