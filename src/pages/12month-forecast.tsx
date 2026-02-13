/**
 * 12-Month Forecast PDF Generation Page
 * 
 * URL: /12month-forecast?name=John&birthday=1990-01-15&birth_time=14:30&gender=male
 * 
 * This page automatically generates a personalized 12-month forecast PDF and downloads it.
 */

import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { PDFDocument, rgb, PDFFont } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { ZWDSCalculator } from "../utils/zwds/calculator";
import { ChartInput } from "../utils/zwds/types";
import { getPalaceForAspectLiuMonth } from "../utils/destiny-navigator/palace-resolver";
import { calculatePalaceQuality } from "../utils/destiny-navigator/metrics-calculator";
import ForecastForm from "../components/ForecastForm";

interface GenerationProgress {
  step: string;
  percentage: number;
  isComplete: boolean;
  error?: string;
}

const TwelveMonthForecast: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [view, setView] = useState<'form' | 'generating' | 'success' | 'error'>('form');
  const [progress, setProgress] = useState<GenerationProgress>({
    step: "Initializing...",
    percentage: 0,
    isComplete: false
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Check URL parameters (highest priority)
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const birthday = searchParams.get("birthday");
    const birthTime = searchParams.get("birth_time");
    const gender = searchParams.get("gender");

    if (name && birthday && birthTime && gender) {
      const birthDate = new Date(birthday);
      const input: ChartInput = {
        year: birthDate.getFullYear(),
        month: birthDate.getMonth() + 1,
        day: birthDate.getDate(),
        hour: extractHour(birthTime),
        gender: gender as "male" | "female",
        name: name,
        email: email || undefined
      };

      // Save valid URL param data to storage too
      localStorage.setItem("zwds_forecast_user", JSON.stringify(input));

      generatePDF(input);
      return;
    }

    // 2. Check LocalStorage for existing session
    const storedData = localStorage.getItem("zwds_forecast_user");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        // Auto-generate if data exists
        generatePDF(parsed);
      } catch (e) {
        console.error("Failed to parse stored data", e);
        setView('form');
      }
    } else {
      // 3. Show Form
      setView('form');
    }
  }, []);

  const handleFormSubmit = (data: ChartInput) => {
    localStorage.setItem("zwds_forecast_user", JSON.stringify(data));
    generatePDF(data);
  };

  const generatePDF = async (chartInput: ChartInput) => {
    try {
      setView('generating');
      setError(null);
      setProgress({ step: "Initializing...", percentage: 5, isComplete: false });

      // Step 2: Calculate chart
      setProgress({ step: "Calculating your ZWDS chart...", percentage: 15, isComplete: false });

      // Simulate small delay for UI smoothness
      await new Promise(resolve => setTimeout(resolve, 800));

      const calculator = new ZWDSCalculator(chartInput);
      const chartData = calculator.calculate();

      // Step 3: Map months to palaces
      setProgress({ step: "Mapping monthly palaces...", percentage: 25, isComplete: false });
      await new Promise(resolve => setTimeout(resolve, 500));

      const year = new Date().getFullYear(); // Or current year of forecast? Default to current.
      const monthToPalaceMap = await calculateMonthlyPalaces(chartData, year);

      // Step 4: Load template PDF
      setProgress({ step: "Loading template...", percentage: 35, isComplete: false });

      // URL encode the filename to handle special characters like [CAE]
      const pdfFileName = encodeURIComponent("[CAE] Navigate Your Year Like a Pro.pdf");
      const templateUrl = `/assets/templates/pdf/${pdfFileName}`;

      const response = await fetch(templateUrl);
      if (!response.ok) {
        throw new Error(`Failed to load PDF template: ${response.status} ${response.statusText}`);
      }

      const templateBytes = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(templateBytes);

      pdfDoc.registerFontkit(fontkit);

      // Step 5: Reorder pages
      setProgress({ step: "Personalizing pages...", percentage: 45, isComplete: false });

      const reorderedPdf = await reorderPdfPages(pdfDoc, monthToPalaceMap);

      // Step 6: Update month headers
      setProgress({ step: "Applying customizations...", percentage: 60, isComplete: false });

      await updateMonthHeaders(reorderedPdf, year);

      // Step 7: Generate yearly table
      setProgress({ step: "Generating visual overview...", percentage: 75, isComplete: false });

      await embedYearlyTable(reorderedPdf, monthToPalaceMap, year);

      // Step 8: Save and download
      setProgress({ step: "Finalizing document...", percentage: 90, isComplete: false });
      await new Promise(resolve => setTimeout(resolve, 500));

      const pdfBytes = await reorderedPdf.save();

      // Trigger download
      const blob = new Blob([new Uint8Array(pdfBytes).buffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `12-Month-Forecast-${chartInput.name}-${year}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setProgress({
        step: "Complete! PDF downloaded.",
        percentage: 100,
        isComplete: true
      });
      setView('success');

    } catch (error) {
      console.error("PDF Generation Error:", error);
      setError(error instanceof Error ? error.message : "Unknown error occurred");
      setView('error');
    }
  };

  const clearData = () => {
    localStorage.removeItem("zwds_forecast_user");
    setView('form');
    setProgress({ step: "Initializing...", percentage: 0, isComplete: false });
  };

  // Joey Yap / PDF Inspired Theme
  const pdfContainerStyle = {
    backgroundColor: "#FDFBF7", // Cream/Beige background
    color: "#1f2937", // Dark Gray text
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
  };

  const pdfCardStyle = {
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    borderTop: "6px solid #991b1b" // Deep Red Header Accent
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 font-sans"
      style={pdfContainerStyle}
    >

      {/* Container with Professional Look */}
      <div
        className="rounded-lg p-10 max-w-lg w-full relative overflow-hidden"
        style={pdfCardStyle}
      >

        {/* --- FORM VIEW --- */}
        {view === 'form' && (
          <div className="animate-fade-in relative z-10">
            <div className="text-center mb-10">
              {/* No Icon - Clean Professional Look */}
              <h1 className="text-3xl font-bold mb-3 tracking-tight" style={{ color: "#991b1b" }}>
                2026 Annual Assessment
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
                Secure your personalized 12-month ZWDS strategic guide.
              </p>
            </div>
            <ForecastForm onSubmit={handleFormSubmit} isGenerating={false} />
          </div>
        )}

        {/* --- GENERATING VIEW --- */}
        {view === 'generating' && (
          <div className="animate-fade-in text-center py-12 relative z-10">
            <div className="w-24 h-24 mx-auto mb-8 relative">
              <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-orange-600 border-t-transparent animate-spin"></div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">Analyzing Chart Structure...</h2>
            <p className="text-gray-500 mb-8 h-6 text-sm font-medium">{progress.step}</p>

            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-700 to-orange-600 h-full transition-all duration-700 ease-out"
                style={{ width: `${progress.percentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* --- SUCCESS VIEW --- */}
        {view === 'success' && (
          <div className="animate-fade-in text-center py-10 relative z-10">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center border border-green-200">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Generated</h2>
            <p className="text-gray-500 mb-8 text-sm">
              Your strategic guide has been downloaded.
            </p>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => generatePDF(JSON.parse(localStorage.getItem("zwds_forecast_user") || "{}"))}
                className="px-6 py-4 bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-800 hover:to-orange-700 text-white rounded shadow-lg transition-all font-bold flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Copy
              </button>

              <button
                onClick={clearData}
                className="text-gray-400 hover:text-gray-600 text-xs mt-4 transition-colors font-medium"
              >
                Not you? Start over
              </button>
            </div>
          </div>
        )}

        {/* --- ERROR VIEW --- */}
        {view === 'error' && (
          <div className="animate-fade-in text-center py-8 relative z-10">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center border border-red-200">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Generation Failed</h3>
            <p className="text-red-500 mb-8 text-sm px-4">
              {error}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setView('form')}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-gray-700 transition-all text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// Helper Functions

function extractHour(birthTime: string): number {
  const timeRegex = /(\d{1,2}):?(\d{2})?\s*(AM|PM)?/i;
  const match = timeRegex.exec(birthTime);

  if (!match) {
    return 12; // Default to noon
  }

  let hour = parseInt(match[1], 10);
  const isPM = match[3]?.toUpperCase() === "PM";
  const isAM = match[3]?.toUpperCase() === "AM";

  if (isPM && hour < 12) {
    hour += 12;
  }
  if (isAM && hour === 12) {
    hour = 0;
  }

  return hour;
}

async function calculateMonthlyPalaces(chartData: any, year: number) {
  const monthlyData = [];

  for (let month = 1; month <= 12; month++) {
    // Get palace for this month
    // Note: getPalaceForAspectLiuMonth needs an aspect - using "life" as default
    const palaceNumber = getPalaceForAspectLiuMonth(
      "life",
      chartData,
      month,
      year
    );

    if (!palaceNumber) continue;

    const palace = chartData.palaces[palaceNumber - 1];

    monthlyData.push({
      month,
      palaceName: palace.name,
      palaceNumber,
      ...palace // spread full palace data (stars, etc) for getStarRating
    });
  }

  return monthlyData;
}

async function reorderPdfPages(pdfDoc: PDFDocument, monthToPalaceMap: any[]) {
  // Map palace names to their page ranges in template
  // Map palace names to their page ranges in template
  // Updated based on user feedback: Friends is at 13-15
  // Implies sequence: Health, Travel, Friends, Career, Property, Fortune, Parents, Life, Siblings, Spouse, Children, Wealth
  // Canonical Mapping provided by User (Step 1032)
  const palaceToPages: Record<string, number[]> = {
    "官禄": [7, 8, 9],    // Career
    "迁移": [10, 11, 12], // Travel
    "交友": [13, 14, 15], // Friends
    "财帛": [16, 17, 18], // Wealth
    "田宅": [19, 20, 21], // Property
    "福德": [22, 23, 24], // Wellbeing / Fortune
    "夫妻": [25, 26, 27], // Spouse
    "兄弟": [28, 29, 30], // Siblings
    "子女": [31, 32, 33], // Children
    "父母": [34, 35, 36], // Parents
    "命宫": [37, 38, 39], // Life
    "疾厄": [40, 41, 42], // Health
  };

  // Create new PDF with reordered pages
  const newPdfDoc = await PDFDocument.create();

  // Keep pages 1-6 (intro pages)
  const introPages = await newPdfDoc.copyPages(pdfDoc, [0, 1, 2, 3, 4, 5]);
  introPages.forEach(page => newPdfDoc.addPage(page));

  // Add months in sequence (pages 7-42)
  for (const { palaceName } of monthToPalaceMap) {
    const pageNumbers = palaceToPages[palaceName];

    if (!pageNumbers) {
      console.warn(`Palace ${palaceName} not found in palace-to-page map`);
      continue;
    }

    // Convert to 0-indexed
    const pageIndices = pageNumbers.map(p => p - 1);

    // Copy all 3 pages for this palace
    const palacePages = await newPdfDoc.copyPages(pdfDoc, pageIndices);
    palacePages.forEach(page => newPdfDoc.addPage(page));
  }

  // Add page 43 (yearly overview) - index 42
  const page43 = await newPdfDoc.copyPages(pdfDoc, [42]);
  page43.forEach(page => newPdfDoc.addPage(page));

  // Add remaining pages (44+)
  const totalPages = pdfDoc.getPageCount();
  if (totalPages > 43) {
    const remainingIndices = Array.from(
      { length: totalPages - 43 },
      (_, i) => i + 43
    );
    const remainingPages = await newPdfDoc.copyPages(pdfDoc, remainingIndices);
    remainingPages.forEach(page => newPdfDoc.addPage(page));
  }

  return newPdfDoc;
}

async function updateMonthHeaders(pdfDoc: PDFDocument, year: number) {
  const monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];

  // Use StandardFonts.HelveticaBold as requested (closest to Impact without install)
  const { StandardFonts } = await import("pdf-lib");
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const fontSize = 32; // User requested 32
  const letterSpacing = fontSize * (20 / 1000); // Reduced spacing (from 53 -> 20)

  // Helper to draw text with manual letter spacing
  const drawSpacedText = (page: any, text: string, x: number, y: number) => {
    let currentX = x; // Left align from x

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      page.drawText(char, {
        x: currentX,
        y,
        size: fontSize,
        font,
        color: rgb(1, 1, 1) // White
      });
      currentX += font.widthOfTextAtSize(char, fontSize) + letterSpacing;
    }
  };

  // Update header on first page of each month's section (pages 7, 10, 13, etc.)
  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    const pageIndex = 6 + (monthIndex * 3); // Pages 7, 10, 13, 16, etc.
    const page = pdfDoc.getPages()[pageIndex];

    if (!page) continue;

    const monthName = monthNames[monthIndex];
    const text = `${monthName} ${year}`;

    // Cover old text with background rectangle (#aa0000)
    // Box: x=40, w=345.
    page.drawRectangle({
      x: 40,
      y: 562,
      width: 345,
      height: 50,
      color: rgb(0.667, 0, 0) // #aa0000
    });

    // Draw new month text left-aligned with reduced spacing
    drawSpacedText(page, text, 45, 570);
  }
}

async function embedYearlyTable(pdfDoc: PDFDocument, monthToPalaceMap: any[], year: number) {
  const page43Index = 42;
  const page43 = pdfDoc.getPages()[page43Index];

  if (!page43) {
    console.warn("Page 43 not found");
    return;
  }

  // Static Palace Data from User Reference (Screenshot 43.png)
  const PALACE_DATA: Record<string, { season: string; stars: number; area: string; priority: string }> = {
    "官禄": { season: "Spring", stars: 5, area: "Professional", priority: "Launch Initiatives" },       // Career
    "迁移": { season: "Spring", stars: 5, area: "Expansion", priority: "Step Beyond Comfort Zone" },    // Travel
    "交友": { season: "Spring", stars: 5, area: "Network", priority: "Launch Initiatives" },            // Friends
    "财帛": { season: "Summer", stars: 5, area: "Financial", priority: "Monetize Resources" },          // Wealth
    "田宅": { season: "Summer", stars: 4, area: "Assets", priority: "Optimize Foundations" },           // Property
    "福德": { season: "Summer", stars: 5, area: "Inner Power", priority: "Align Inner State" },         // Fortune/Wellbeing
    "夫妻": { season: "Autumn", stars: 3, area: "Partnership", priority: "Clear Emotional Clutter" },   // Spouse
    "兄弟": { season: "Autumn", stars: 4, area: "Circle", priority: "Purge Connections" },              // Siblings
    "子女": { season: "Autumn", stars: 3, area: "Legacy", priority: "Structure Your Plans" },           // Children
    "父母": { season: "Autumn", stars: 3, area: "Patterns", priority: "Break Old Loops" },              // Parents
    "命宫": { season: "Winter", stars: 4, area: "Self", priority: "Invest in Yourself" },               // Life
    "疾厄": { season: "Winter", stars: 3, area: "Body", priority: "Restore Strength" },                 // Health
  };

  // Helper for Priority Theme mapping
  const getPriorityTheme = (palaceName: string): string => {
    const themeMap: Record<string, string> = {
      "官禄": "Launch Initiatives",       // Career
      "迁移": "Step Beyond Comfort Zone", // Travel
      "交友": "Launch Initiatives",       // Friends (Matches 'Launch Initiatives' in reference)
      "财帛": "Monetize Resources",       // Wealth
      "田宅": "Optimize Foundations",     // Property
      "福德": "Align Inner State",        // Fortune/Wellbeing
      "夫妻": "Clear Emotional Clutter",  // Spouse
      "兄弟": "Purge Connections",        // Siblings
      "子女": "Structure Your Plans",     // Children
      "父母": "Break Old Loops",          // Parents
      "命宫": "Invest in Yourself",       // Life
      "疾厄": "Restore Strength"          // Health
    };
    return themeMap[palaceName] || "Focus on Growth";
  };

  // Table configuration
  // User requested y: 150 (was 130)
  const startX = 34;
  const startY = 100;
  const rowHeight = 26;
  const columnWidths = [35, 52, 52, 58, 58, 85]; // Month, Palace, Area, Season, Energy, Priority
  const totalWidth = columnWidths.reduce((a, b) => a + b, 0); // 340px

  // Colors
  const headerBgColor = rgb(0.706, 0.345, 0.235); // #b4583c
  const headerTextColor = rgb(1, 1, 1); // White
  const cellBgColor = rgb(0.996, 0.984, 0.953); // #fefbf3
  const borderColor = rgb(0.706, 0.345, 0.235); // #b4583c

  // Load fonts - Use custom Inter font
  // StandardFonts (Helvetica) only support WinAnsi which doesn't include "★"
  let font: PDFFont, fontBold: PDFFont;

  try {
    const interRegularUrl = "/assets/fonts/Inter-Regular.ttf";
    const interBoldUrl = "/assets/fonts/Inter-Bold.ttf";

    const [regularBytes, boldBytes] = await Promise.all([
      fetch(interRegularUrl).then(res => res.arrayBuffer()),
      fetch(interBoldUrl).then(res => res.arrayBuffer())
    ]);

    font = await pdfDoc.embedFont(regularBytes);
    fontBold = await pdfDoc.embedFont(boldBytes);
  } catch (error) {
    console.warn("Inter fonts not found, falling back to Helvetica (Unicode chars will fail)");
    const { StandardFonts } = await import("pdf-lib");
    font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  }

  // Load images for Season and Energy columns
  const seasonImages: Record<string, any> = {};
  const starImages: Record<string, any> = {};

  try {
    const seasons = ["Spring", "Summer", "Autumn", "Winter"];
    const stars = ["3 Star", "4 Star", "5 Star"];

    // Load season images
    for (const season of seasons) {
      const url = `/assets/templates/cells/${season}.png`;
      const bytes = await fetch(url).then(res => res.arrayBuffer());
      seasonImages[season] = await pdfDoc.embedPng(bytes);
    }

    // Load star images
    for (const star of stars) {
      const url = `/assets/templates/cells/${star}.png`;
      const bytes = await fetch(url).then(res => res.arrayBuffer());
      starImages[star] = await pdfDoc.embedPng(bytes);
    }
  } catch (error) {
    console.error("Failed to load cell images:", error);
  }

  // Helper to translate palace name to English
  const translatePalace = (palaceName: string): string => {
    const translations: Record<string, string> = {
      "命宫": "Life",
      "兄弟": "Siblings",
      "夫妻": "Spouse",
      "子女": "Children",
      "财帛": "Wealth",
      "疾厄": "Health",
      "迁移": "Travel",
      "交友": "Friends",
      "官禄": "Career",
      "田宅": "Property",
      "福德": "Fortune",
      "父母": "Parents"
    };
    return translations[palaceName] || palaceName;
  };

  //Helper for area mapping
  const getArea = (palaceName: string): string => {
    const areaMap: Record<string, string> = {
      "命宫": "Core Self",
      "兄弟": "Social",
      "夫妻": "Love",
      "子女": "Legacy",
      "财帛": "Financial",
      "疾厄": "Health",
      "迁移": "Expansion",
      "交友": "Network",
      "官禄": "Professional",
      "田宅": "Property",
      "福德": "Spiritual",
      "父母": "Family"
    };
    return areaMap[palaceName] || "General";
  };

  // Helper for season
  // Month 1-3 (Index 0-2): Spring
  // Month 4-6 (Index 3-5): Summer
  // Month 7-9 (Index 6-8): Autumn
  // Month 10-12 (Index 9-11): Winter
  const getSeason = (monthIndex: number): string => {
    if (monthIndex >= 0 && monthIndex <= 2) return "Spring";
    if (monthIndex >= 3 && monthIndex <= 5) return "Summer";
    if (monthIndex >= 6 && monthIndex <= 8) return "Autumn";
    return "Winter";
  };

  // Helper for star rating (1-5) using palace quality score
  const getStarRating = (palace: any): number => {
    try {
      const score = calculatePalaceQuality(palace);
      if (score >= 80) return 5;
      if (score >= 60) return 4;
      if (score >= 40) return 3;
      if (score >= 20) return 2;
      return 1;
    } catch (e) {
      console.warn("Error calculating quality:", e);
      return 3;
    }
  };

  // Cover background for entire table area
  page43.drawRectangle({
    x: startX - 2,
    y: startY - 2,
    width: totalWidth + 4,
    height: rowHeight * 13 + 4, // Header + 12 rows
    color: rgb(1, 1, 1) // White background behind table
  });

  // Draw table header
  let currentX = startX;
  const headers = ["Month", "Palace", "Area", "Season", "Energy", "Priority Theme"];

  headers.forEach((header, i) => {
    // Header background
    page43.drawRectangle({
      x: currentX,
      y: startY + rowHeight * 12,
      width: columnWidths[i],
      height: rowHeight,
      color: headerBgColor,
      borderColor: borderColor,
      borderWidth: 0.5
    });

    // Header text
    const textWidth = fontBold.widthOfTextAtSize(header, 8);
    page43.drawText(header, {
      x: currentX + (columnWidths[i] - textWidth) / 2,
      y: startY + rowHeight * 12 + 9,
      size: 8,
      font: fontBold,
      color: headerTextColor
    });

    currentX += columnWidths[i];
  });

  // Draw data rows
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  for (let row = 0; row < 12; row++) {
    const monthData = monthToPalaceMap[row];
    const yPos = startY + rowHeight * (11 - row); // Bottom to top

    currentX = startX;

    // Get static data for this palace from PALACE_DATA
    const palaceName = monthData.palaceName;
    const data = PALACE_DATA[palaceName] || {
      season: "Winter",
      stars: 3,
      area: "General",
      priority: "Focus"
    };

    const month = monthNames[row]; // Col 0
    let translatedPalace = translatePalace(palaceName); // Col 1

    // Screenshot Override: "Wellbeing" instead of "Fortune" if desired
    if (translatedPalace === "Fortune") translatedPalace = "Wellbeing";

    const area = data.area; // Col 2
    const seasonName = data.season; // Col 3 (Image)
    const starCount = data.stars;
    const energyLevel = `${starCount} Star`; // Col 4 (Image)
    const priority = data.priority; // Col 5

    // Column 0: Month
    drawCell(page43, currentX, yPos, columnWidths[0], rowHeight, month, font, 8, cellBgColor, borderColor);
    currentX += columnWidths[0];

    // Column 1: Palace
    drawCell(page43, currentX, yPos, columnWidths[1], rowHeight, translatedPalace, font, 8, cellBgColor, borderColor);
    currentX += columnWidths[1];

    // Column 2: Area
    drawCell(page43, currentX, yPos, columnWidths[2], rowHeight, area, font, 8, cellBgColor, borderColor);
    currentX += columnWidths[2];

    // Column 3: Season (Image)
    drawCellBackground(page43, currentX, yPos, columnWidths[3], rowHeight, cellBgColor, borderColor);
    const seasonImg = seasonImages[seasonName];
    if (seasonImg) {
      const imgDims = seasonImg.scale(0.5);
      const imgX = currentX + (columnWidths[3] - imgDims.width) / 2;
      const imgY = yPos + (rowHeight - imgDims.height) / 2;
      page43.drawImage(seasonImg, { x: imgX, y: imgY, width: imgDims.width, height: imgDims.height });
    }
    currentX += columnWidths[3];

    // Column 4: Energy (Image)
    drawCellBackground(page43, currentX, yPos, columnWidths[4], rowHeight, cellBgColor, borderColor);
    const starImg = starImages[energyLevel];
    if (starImg) {
      const imgDims = starImg.scale(0.4);
      const imgX = currentX + (columnWidths[4] - imgDims.width) / 2;
      const imgY = yPos + (rowHeight - imgDims.height) / 2;
      page43.drawImage(starImg, { x: imgX, y: imgY, width: imgDims.width, height: imgDims.height });
    }
    currentX += columnWidths[4];

    // Column 5: Priority
    drawCell(page43, currentX, yPos, columnWidths[5], rowHeight, priority, font, 7, cellBgColor, borderColor);
    currentX += columnWidths[5];
  }
}

// Helper to draw cell background and text
function drawCell(page: any, x: number, y: number, w: number, h: number, text: string, font: any, fontSize: number, bgColor: any, borderColor: any) {
  drawCellBackground(page, x, y, w, h, bgColor, borderColor);

  if (text && font) {
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const textX = x + (w - textWidth) / 2;
    page.drawText(text, {
      x: textX,
      y: y + 8,
      size: fontSize,
      font: font,
      color: rgb(0.1, 0.1, 0.1)
    });
  }
}

function drawCellBackground(page: any, x: number, y: number, w: number, h: number, bgColor: any, borderColor: any) {
  page.drawRectangle({
    x: x,
    y: y,
    width: w,
    height: h,
    color: bgColor,
    borderColor: borderColor,
    borderWidth: 0.5
  });
}

export default TwelveMonthForecast;
