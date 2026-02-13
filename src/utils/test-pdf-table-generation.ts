/**
 * Test script - Generate custom yearly overview table on page 45
 * Approach 1: Cover entire table and redraw with new data
 */

import { PDFDocument, PDFPage, rgb, StandardFonts, PDFFont } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import * as fs from "fs";

interface MonthlyData {
  month: string;
  palace: string;
  area: string;
  season: "Spring" | "Summer" | "Autumn" | "Winter";
  energy: number; // 1-5
  priorityTheme: string;
}

/**
 * Test data - Different from the template
 * Jan is now "Spouse" instead of "Career"
 */
const testTableData: MonthlyData[] = [
  { month: "Jan", palace: "Spouse", area: "Partnership", season: "Spring", energy: 5, priorityTheme: "Strengthen bonds" },
  { month: "Feb", palace: "Career", area: "Professional", season: "Spring", energy: 4, priorityTheme: "Build foundations" },
  { month: "Mar", palace: "Wealth", area: "Financial", season: "Spring", energy: 5, priorityTheme: "Increase income" },
  { month: "Apr", palace: "Health", area: "Wellness", season: "Summer", energy: 3, priorityTheme: "Reset habits" },
  { month: "May", palace: "Travel", area: "Expansion", season: "Summer", energy: 5, priorityTheme: "Explore opportunities" },
  { month: "Jun", palace: "Friends", area: "Network", season: "Summer", energy: 4, priorityTheme: "Build connections" },
  { month: "Jul", palace: "Children", area: "Legacy", season: "Autumn", energy: 3, priorityTheme: "Nurture growth" },
  { month: "Aug", palace: "Property", area: "Assets", season: "Autumn", energy: 4, priorityTheme: "Secure foundations" },
  { month: "Sep", palace: "Parents", area: "Patterns", season: "Autumn", energy: 3, priorityTheme: "Honor roots" },
  { month: "Oct", palace: "Wellbeing", area: "Inner Power", season: "Autumn", energy: 4, priorityTheme: "Recharge energy" },
  { month: "Nov", palace: "Siblings", area: "Circle", season: "Winter", energy: 4, priorityTheme: "Collaborate closely" },
  { month: "Dec", palace: "Life", area: "Self", season: "Winter", energy: 3, priorityTheme: "Reflect and plan" },
];

/**
 * Season icon mapping (using safe ASCII-compatible characters)
 */
const seasonIcons: Record<string, string> = {
  Spring: ">", // Leaf/growth indicator
  Summer: "*", // Sun rays
  Autumn: "~", // Falling leaves
  Winter: "+", // Snowflake
};

/**
 * Season colors
 */
const seasonColors: Record<string, { r: number; g: number; b: number }> = {
  Spring: { r: 0.4, g: 0.8, b: 0.4 }, // Green
  Summer: { r: 1, g: 0.65, b: 0 }, // Orange/yellow
  Autumn: { r: 0.8, g: 0.35, b: 0.1 }, // Dark orange
  Winter: { r: 0.3, g: 0.6, b: 0.9 }, // Light blue
};

/**
 * Generate star rating string using simple ASCII characters
 */
function getStarRating(energy: number): string {
  const fullStar = "*";
  const emptyStar = "-";
  return fullStar.repeat(energy) + emptyStar.repeat(5 - energy);
}

/**
 * Draw the yearly overview table
 */
async function drawYearlyOverviewTable(
  page: PDFPage,
  data: MonthlyData[],
  font: PDFFont,
  fontBold: PDFFont
) {
  // Table dimensions and position (measured from the reference image)
  const table = {
    x: 50,
    y: 150, // Bottom of table
    width: 455,
    height: 400,
    rowHeight: 30,
    headerHeight: 25,
  };

  // Column definitions (widths and positions)
  const columns = [
    { key: "month", label: "MONTH", x: 50, width: 45 },
    { key: "palace", label: "PALACE", x: 100, width: 65 },
    { key: "area", label: "AREA", x: 170, width: 75 },
    { key: "season", label: "SEASON", x: 250, width: 65 },
    { key: "energy", label: "ENERGY", x: 320, width: 60 },
    { key: "priorityTheme", label: "PRIORITY THEME", x: 385, width: 120 },
  ];

  const tableTop = table.y + table.height;
  const headerY = tableTop - 20;
  const firstRowY = headerY - table.headerHeight - 5;

  // Step 1: Cover the entire existing table with cream background
  console.log("Covering existing table...");
  page.drawRectangle({
    x: table.x - 5,
    y: table.y,
    width: table.width + 10,
    height: table.height,
    color: rgb(0.98, 0.96, 0.94), // Cream/beige background
  });

  // Step 2: Draw table header background
  // Color: #b4583c = rgb(180/255, 88/255, 60/255)
  console.log("Drawing table headers...");
  page.drawRectangle({
    x: table.x,
    y: headerY - 5,
    width: table.width,
    height: table.headerHeight,
    color: rgb(0.706, 0.345, 0.235), // #b4583c from Canva
  });

  // Step 3: Draw column headers
  columns.forEach((col) => {
    page.drawText(col.label, {
      x: col.x,
      y: headerY + 2,
      size: 7, // Canva font size
      font: fontBold,
      color: rgb(1, 1, 1), // White text
    });
  });

  // Step 4: Draw horizontal grid lines
  console.log("Drawing grid lines...");
  const gridColor = rgb(0.85, 0.85, 0.85); // Light gray
  
  // Line below header
  page.drawLine({
    start: { x: table.x, y: headerY - 5 },
    end: { x: table.x + table.width, y: headerY - 5 },
    thickness: 1,
    color: gridColor,
  });

  // Lines between rows
  for (let i = 0; i <= data.length; i++) {
    const y = firstRowY - (i * table.rowHeight);
    page.drawLine({
      start: { x: table.x, y },
      end: { x: table.x + table.width, y },
      thickness: 0.5,
      color: gridColor,
    });
  }

  // Step 5: Draw vertical grid lines
  let cumulativeX = table.x;
  columns.forEach((col, index) => {
    if (index > 0) {
      page.drawLine({
        start: { x: cumulativeX, y: tableTop },
        end: { x: cumulativeX, y: table.y },
        thickness: 0.5,
        color: gridColor,
      });
    }
    cumulativeX += col.width;
  });

  // Final right border
  page.drawLine({
    start: { x: table.x + table.width, y: tableTop },
    end: { x: table.x + table.width, y: table.y },
    thickness: 0.5,
    color: gridColor,
  });

  // Step 6: Draw table data
  console.log("Drawing table data...");
  data.forEach((row, rowIndex) => {
    const rowY = firstRowY - 15 - (rowIndex * table.rowHeight);

    // Month
    page.drawText(row.month, {
      x: columns[0].x,
      y: rowY,
      size: 7,
      font: font,
      color: rgb(0, 0, 0),
    });

    // Palace
    page.drawText(row.palace, {
      x: columns[1].x,
      y: rowY,
      size: 7,
      font: font,
      color: rgb(0, 0, 0),
    });

    // Area
    page.drawText(row.area, {
      x: columns[2].x,
      y: rowY,
      size: 7,
      font: font,
      color: rgb(0, 0, 0),
    });

    // Season (symbol + text with color)
    const seasonSymbol = seasonIcons[row.season];
    const seasonColor = seasonColors[row.season];
    
    // Draw colored symbol
    page.drawText(seasonSymbol, {
      x: columns[3].x,
      y: rowY,
      size: 9,
      font: fontBold,
      color: rgb(seasonColor.r, seasonColor.g, seasonColor.b),
    });
    
    // Draw season text
    page.drawText(row.season, {
      x: columns[3].x + 12,
      y: rowY,
      size: 7,
      font: font,
      color: rgb(0, 0, 0),
    });

    // Energy (star rating)
    const stars = getStarRating(row.energy);
    page.drawText(stars, {
      x: columns[4].x,
      y: rowY,
      size: 8,
      font: font,
      color: rgb(1, 0.65, 0), // Orange stars
    });

    // Priority Theme
    page.drawText(row.priorityTheme, {
      x: columns[5].x,
      y: rowY,
      size: 7,
      font: font,
      color: rgb(0, 0, 0),
    });
  });

  console.log("✅ Table drawn successfully!");
}

async function generateCustomTable() {
  try {
    console.log("Loading PDF template...");
    
    const pdfPath = "E:/Dev/GitHub/nm-zwds/src/assets/templates/pdf/[CAE] Navigate Your Year Like a Pro.pdf";
    const existingPdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    
    // Register fontkit for custom fonts
    pdfDoc.registerFontkit(fontkit);
    
    console.log(`PDF loaded. Total pages: ${pdfDoc.getPageCount()}`);
    
    // Get page 45 (index 44)
    const page = pdfDoc.getPages()[44];
    const { width, height } = page.getSize();
    
    console.log(`Page 45 dimensions: ${width} x ${height}`);
    
    // Load fonts - try Inter first, fallback to Helvetica
    let font: PDFFont;
    let fontBold: PDFFont;
    
    const interFontPath = "E:/Dev/GitHub/nm-zwds/src/assets/fonts/Inter-Regular.ttf";
    const interBoldPath = "E:/Dev/GitHub/nm-zwds/src/assets/fonts/Inter-Bold.ttf";
    
    try {
      if (fs.existsSync(interFontPath)) {
        console.log("✅ Using Inter font");
        const interFontBytes = fs.readFileSync(interFontPath);
        font = await pdfDoc.embedFont(interFontBytes);
        
        if (fs.existsSync(interBoldPath)) {
          const interBoldBytes = fs.readFileSync(interBoldPath);
          fontBold = await pdfDoc.embedFont(interBoldBytes);
        } else {
          fontBold = font; // Use regular as bold if bold not available
        }
      } else {
        console.log("⚠️  Inter font not found, using Helvetica");
        font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      }
    } catch (error) {
      console.log("⚠️  Error loading Inter, using Helvetica");
      font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    }
    
    // Draw the custom table with test data
    await drawYearlyOverviewTable(page, testTableData, font, fontBold);
    
    // Save the modified PDF
    const outputPath = "E:/Dev/GitHub/nm-zwds/src/assets/templates/pdf/test-output-page45-table.pdf";
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);
    
    console.log(`✅ Modified PDF saved to: ${outputPath}`);
    console.log("Check page 45 - January should now show 'Spouse' palace!");
    
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

generateCustomTable();
