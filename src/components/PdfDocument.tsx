import React, { forwardRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import ZWDSChart from "./ZWDSChart";

/**
 * Interface for chart data used in PDF export
 */
export interface PdfChartData {
  id: string;
  name: string;
  birthDate: string;
  birthTime: string;
  gender: string;
  createdAt: string;
}

/**
 * Props for PdfDocument component
 */
interface PdfDocumentProps {
  chartData: PdfChartData;
  calculatedChartData: any;
  formatDate: (date: string) => string;
  includeAnalysis?: boolean;
  pageBreaks?: boolean;
}

/**
 * PdfDocument component for professional PDF export
 * Renders a complete document with cover page and chart
 */
const PdfDocument = forwardRef<HTMLDivElement, PdfDocumentProps>(
  ({ chartData, calculatedChartData, formatDate, includeAnalysis = true, pageBreaks = true }, ref) => {
    const { t } = useLanguage();

    // Professional PDF styles
    const pdfStyles = {
      container: {
        fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
        fontSize: "11px",
        lineHeight: "1.4",
        color: "#1f2937",
        backgroundColor: "#ffffff",
        width: "210mm",
        height: "594mm", // 2 pages × 297mm = 594mm
        margin: "0",
        padding: "0",
      },
      page: {
        width: "210mm",
        height: "297mm",
        margin: "0",
        padding: "15mm", // Internal padding only
        backgroundColor: "#ffffff",
        boxSizing: "border-box" as const,
        position: "relative" as const,
        display: "flex",
        flexDirection: "column" as const,
        // Remove ALL page break CSS - let html2pdf handle it
      },
      lastPage: {
        pageBreakAfter: "avoid" as const,
      },
      header: {
        borderBottom: "2px solid #e5e7eb",
        paddingBottom: "8px",
        marginBottom: "15px",
        flexShrink: 0, // Prevent header from shrinking
      },
      // Remove complex absolute footer positioning
      footer: {
        marginTop: "auto",
        borderTop: "1px solid #e5e7eb",
        paddingTop: "6px",
        fontSize: "9px",
        color: "#6b7280",
        textAlign: "center" as const,
        height: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      title: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#1f2937",
        marginBottom: "10px",
      },
      subtitle: {
        fontSize: "16px",
        color: "#6b7280",
        marginBottom: "20px",
      },
      sectionTitle: {
        fontSize: "18px",
        fontWeight: "600",
        color: "#1f2937",
        marginTop: "20px",
        marginBottom: "15px",
        paddingBottom: "5px",
        borderBottom: "1px solid #e5e7eb",
      },
      infoGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px",
        marginBottom: "15px",
      },
      infoItem: {
        padding: "8px",
        backgroundColor: "#f9fafb",
        borderRadius: "6px",
        border: "1px solid #e5e7eb",
      },
      infoLabel: {
        fontSize: "9px",
        color: "#6b7280",
        textTransform: "uppercase" as const,
        letterSpacing: "0.5px",
        marginBottom: "5px",
      },
      infoValue: {
        fontSize: "12px",
        fontWeight: "600",
        color: "#1f2937",
      },
      chartContainer: {
        width: "100%",
        height: "800px", // Reduced height to fit within page constraints
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid #e5e7eb",
        borderRadius: "6px",
        backgroundColor: "#ffffff",
        marginBottom: "15px",
        overflow: "hidden",
        flexShrink: 0, // Prevent chart from shrinking
      },
      // Remove watermark and complex positioning
      content: {
        width: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column" as const,
      },
      // Simplified cover content
      coverContent: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center" as const,
      },
    };

    return (
      <div ref={ref} style={pdfStyles.container} className="pdf-document-container">
        {/* Cover Page */}
        <div style={{ ...pdfStyles.page, textAlign: "center"}}>
          <div style={pdfStyles.coverContent}>
            {/* Logo/Header Section */}
            <div style={{ marginBottom: "30px" }}>
              <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                lineHeight: "1.25" 
              }}>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}>
                  <span style={{
                    fontSize: "26px",
                    fontWeight: "700",
                    whiteSpace: "nowrap",
                    color: "#7c3aed", // Solid purple color that works in PDF
                    display: "inline-block"
                  }}>
                    紫微斗数
                  </span>
                  <span style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#7c3aed", // Solid purple text to match main text
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    display: "inline-block",
                    verticalAlign: "middle"
                  }}>
                    CAE
                  </span>
                </div>
              </div>
              <h1 style={{ ...pdfStyles.title, fontSize: "28px", margin: "0 0 8px 0" }}>
                {t("pdfExport.title") || "Zi Wei Dou Shu Chart Analysis"}
              </h1>
              <p style={{ ...pdfStyles.subtitle, fontSize: "16px", margin: "0 0 30px 0" }}>
                {t("pdfExport.subtitle") || "Professional Astrological Report"}
              </p>
            </div>

            {/* Profile Information */}
            <div style={{
              backgroundColor: "#f8fafc",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              marginBottom: "30px",
              textAlign: "left",
              maxWidth: "500px",
              width: "100%",
            }}>
              <h2 style={{ ...pdfStyles.sectionTitle, marginTop: "0", marginBottom: "12px", textAlign: "center", fontSize: "16px" }}>
                {t("pdfExport.profileTitle") || "Profile Information"}
              </h2>
              <div style={{...pdfStyles.infoGrid, gap: "10px"}}>
                <div style={{...pdfStyles.infoItem, padding: "8px"}}>
                  <div style={pdfStyles.infoLabel}>{t("myChart.fields.name") || "Name"}</div>
                  <div style={pdfStyles.infoValue}>{chartData.name}</div>
                </div>
                <div style={{...pdfStyles.infoItem, padding: "8px"}}>
                  <div style={pdfStyles.infoLabel}>{t("myChart.fields.gender") || "Gender"}</div>
                  <div style={pdfStyles.infoValue}>
                    {chartData.gender === "male" 
                      ? t("myChart.fields.male") || "Male"
                      : t("myChart.fields.female") || "Female"
                    }
                  </div>
                </div>
                <div style={{...pdfStyles.infoItem, padding: "8px"}}>
                  <div style={pdfStyles.infoLabel}>{t("myChart.fields.birthDate") || "Birth Date"}</div>
                  <div style={pdfStyles.infoValue}>{formatDate(chartData.birthDate)}</div>
                </div>
                <div style={{...pdfStyles.infoItem, padding: "8px"}}>
                  <div style={pdfStyles.infoLabel}>{t("myChart.fields.birthTime") || "Birth Time"}</div>
                  <div style={pdfStyles.infoValue}>{chartData.birthTime}</div>
                </div>
              </div>
            </div>

            {/* Report Details */}
            <div style={{
              backgroundColor: "#fefefe",
              padding: "15px",
              borderRadius: "6px",
              border: "1px solid #e5e7eb",
              maxWidth: "400px",
              width: "100%",
            }}>
              <p style={{ fontSize: "11px", color: "#6b7280", margin: "0 0 6px 0" }}>
                {t("pdfExport.reportGenerated") || "Report Generated"}
              </p>
              <p style={{ fontSize: "13px", fontWeight: "600", color: "#1f2937", margin: "0 0 8px 0" }}>
                {new Date().toLocaleDateString()}
              </p>
              <p style={{ fontSize: "9px", color: "#9ca3af", fontStyle: "italic", margin: "0" }}>
                {t("pdfExport.confidential") || "This report is confidential and intended for personal use only."}
              </p>
            </div>
          </div>
          <div style={pdfStyles.footer}>
            <p>{t("pdfExport.pageNumber") || "Page"} 1</p>
          </div>
        </div>

        {/* Chart Visualization Page */}
        <div style={{ ...pdfStyles.page}}>
          <div style={pdfStyles.content}>
            <div style={{...pdfStyles.header, marginBottom: "15px", paddingBottom: "8px"}}>
              <h2 style={{ ...pdfStyles.title, fontSize: "18px", marginBottom: "4px" }}>
                {t("result.chartVisualization") || "Chart Visualization"}
              </h2>
              <p style={{ fontSize: "11px", color: "#6b7280" }}>
                {chartData.name} • {formatDate(chartData.birthDate)} • {chartData.birthTime}
              </p>
            </div>

            {/* Chart Container */}
            <div style={pdfStyles.chartContainer}>
              {calculatedChartData && (
                <div style={{ 
                  width: "100%", 
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  transformOrigin: "center",
                }}>
                  <ZWDSChart 
                    chartData={calculatedChartData} 
                    disableInteraction={true}
                    isPdfExport={true}
                  />
                </div>
              )}
            </div>
          </div>
          <div style={pdfStyles.footer}>
            <p>{t("pdfExport.pageNumber") || "Page"} 2</p>
          </div>
        </div>
      </div>
    );
  }
);

PdfDocument.displayName = "PdfDocument";

export default PdfDocument; 