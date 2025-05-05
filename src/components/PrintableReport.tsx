import React, { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import ZWDSChart from "./ZWDSChart";
import { ChartData } from "../utils/pdfExport";
import {
  LifeAreasRadarChart,
  LifeAreasExplanation,
  SummaryAnalysis,
  WatchoutAnalysis,
} from "./analysis";
import CareerAnalysis from "./analysis/CareerAnalysis";
import FourKeyPalaceAnalysis from "./analysis/FourKeyPalaceAnalysis";

/**
 * CSS styles to ensure light mode for printing
 */
const lightModeStyles = `
  .print-container {
    color: #000 !important;
    background-color: #fff !important;
  }
  
  .print-container * {
    color: inherit !important;
    background-color: inherit !important;
    border-color: #e5e7eb !important;
  }
  
  .print-container h1, 
  .print-container h2, 
  .print-container h3, 
  .print-container h4, 
  .print-container h5, 
  .print-container h6, 
  .print-container strong, 
  .print-container .font-bold {
    color: #000 !important;
  }
  
  .print-container .text-gray-500, 
  .print-container .text-gray-600 {
    color: #6b7280 !important;
  }
  
  .print-container svg text,
  .print-container svg .chart-text {
    fill: #000 !important;
  }
  
  .print-container .content-box {
    background-color: #fff !important;
    border: 1px solid #e5e7eb !important;
  }
  
  .print-container table, 
  .print-container td, 
  .print-container th {
    border-color: #e5e7eb !important;
  }
  
  .print-container .bg-purple-600,
  .print-container .bg-purple-500 {
    background-color: #9333ea !important;
  }
`;

/**
 * Printable Report component for exporting the chart results
 */
const PrintableReport: React.FC<{
  chartData: ChartData;
  calculatedChartData: any;
  formatDate: (date: string) => string;
}> = ({ chartData, calculatedChartData, formatDate }) => {
  const { t, language } = useLanguage();
  
  // Add light mode style to head when component mounts, remove on unmount
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.setAttribute("id", "light-mode-print-styles");
    styleEl.innerHTML = lightModeStyles;
    document.head.appendChild(styleEl);
    
    return () => {
      const existingStyle = document.getElementById("light-mode-print-styles");
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  return (
    <div className="print-container bg-white text-black">
      {/* Cover Page */}
      <div
        className="print-page print-cover-page flex flex-col items-center justify-center"
        style={{
          height: "100vh",
          minHeight: "800px",
          pageBreakAfter: "always",
        }}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-center">
            {t("result.exportTitle") || "紫微斗数命盘分析"}
          </h1>
          <h2 className="text-2xl mb-2 text-center">{chartData.name}</h2>
          <p className="text-gray-500 mb-8 text-center">
            {formatDate(chartData.birthDate)} {chartData.birthTime}
          </p>
          <div className="w-40 h-1 bg-purple-600 mx-auto my-8"></div>
        </div>

        <div className="profile-summary">
          <div className="grid grid-cols-2 gap-6 mb-10 max-w-xl mx-auto">
            <div className="-r  pr-6">
              <p className="mb-2">
                <span className="font-semibold text-lg">
                  {t("myChart.fields.name") || "姓名"}:
                </span>{" "}
                <span className="text-lg">{chartData.name}</span>
              </p>
              <p className="mb-2">
                <span className="font-semibold">
                  {t("myChart.fields.gender") || "性别"}:
                </span>{" "}
                <span>
                  {chartData.gender === "male"
                    ? t("myChart.fields.male") || "男"
                    : t("myChart.fields.female") || "女"}
                </span>
              </p>
            </div>
            <div>
              <p className="mb-2">
                <span className="font-semibold">
                  {t("myChart.fields.birthDate") || "出生日期"}:
                </span>{" "}
                <span>{formatDate(chartData.birthDate)}</span>
              </p>
              <p className="mb-2">
                <span className="font-semibold">
                  {t("myChart.fields.birthTime") || "出生时间"}:
                </span>{" "}
                <span>{chartData.birthTime}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            {t("result.generatedOn") || "生成于"}:{" "}
            {formatDate(new Date().toISOString())}
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} - 紫微斗数 Analysis
          </p>
        </div>
      </div>

      {/* Profile information */}

      {/* Chart visualization */}
      <div
        className="print-page"
        style={{
          pageBreakAfter: "always",
          minHeight: "800px",
          padding: "20px 0",
        }}>
        <div
          className="zwds-chart-container print-chart"
          style={{
            margin: "0 auto",
            overflow: "visible",
            transform: "scale(0.9)",
            transformOrigin: "center top",
          }}>
          <ZWDSChart chartData={calculatedChartData} />
        </div>
        <div className="summary-analysis-container">
          <div className="content-box rounded-lg px-4">
            <SummaryAnalysis chartData={calculatedChartData} />
          </div>
        </div>
      </div>

      {/* Life Areas Radar Chart */}
      <div
        className="print-page"
        style={{
          pageBreakAfter: "always",
          minHeight: "800px",
          padding: "20px 0",
        }}>
        <div className="life-areas-chart-container mb-6">
          <div className="content-box rounded-lg px-4">
            <div
              className="radar-chart-container print-chart"
              style={{
                height: "500px",
                maxWidth: "600px",
                margin: "0 auto",
                transform: "scale(0.9)",
                transformOrigin: "center center",
              }}>
              <LifeAreasRadarChart chartData={calculatedChartData} />
            </div>
          </div>
        </div>

        <div className="content-box rounded-lg px-4">
          <LifeAreasExplanation
            chartData={calculatedChartData}
            expandedView={true}
            showSpecificSection={0}
          />
        </div>
      </div>

      {/* Life Areas Explanation - Expanded */}
      <div
        className="print-page"
        style={{
          pageBreakAfter: "always",
          minHeight: "800px",
          padding: "20px 0",
        }}>
        <div className="life-areas-explanation-container expanded-content">
          <div className="content-box rounded-lg px-4">
            <LifeAreasExplanation
              chartData={calculatedChartData}
              expandedView={true}
              showSpecificSection={1}
            />
            <LifeAreasExplanation
              chartData={calculatedChartData}
              expandedView={true}
              showSpecificSection={2}
            />
            <LifeAreasExplanation
              chartData={calculatedChartData}
              expandedView={true}
              showSpecificSection={3}
            />
          </div>
        </div>
      </div>

      {/* Four Key Palace Analysis */}
      <div
        className="print-page"
        style={{
          pageBreakAfter: "always",
          minHeight: "800px",
          padding: "20px 0",
        }}>
        <div className="palace-analysis-container">
          <div className="content-box   rounded-lg px-4">
            <FourKeyPalaceAnalysis chartData={calculatedChartData} />
          </div>
        </div>
      </div>

      {/* Watchout Analysis */}
      <div
        className="print-page"
        style={{
          pageBreakAfter: "always",
          minHeight: "800px",
          padding: "20px 0",
        }}>
        <div className="watchout-analysis-container mb-6">
          <div className="content-box   rounded-lg px-4">
            <WatchoutAnalysis chartData={calculatedChartData} />
          </div>
        </div>
        <div className="career-analysis-container">
          <div className="content-box rounded-lg px-4">
            <div
              className="career-chart-container print-chart"
              style={{
                height: "500px",
                maxWidth: "700px",
                margin: "0 auto",
                transform: "scale(0.9)",
                transformOrigin: "center center",
                overflow: "visible"
              }}>
              <CareerAnalysis chartData={calculatedChartData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableReport;
