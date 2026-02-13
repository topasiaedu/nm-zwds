import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample data for testing - 12 months with varying data
const yearlyData = [
  { month: "Jan", palace: "Career", area: "Professional", season: "Winter", energy: 5, priority: "Launch initiatives" },
  { month: "Feb", palace: "Travel", area: "Expansion", season: "Spring", energy: 5, priority: "Step outside comfort" },
  { month: "Mar", palace: "Friends", area: "Network", season: "Spring", energy: 5, priority: "Activate connections" },
  { month: "Apr", palace: "Wealth", area: "Financial", season: "Summer", energy: 5, priority: "Cash Out" },
  { month: "May", palace: "Property", area: "Assets", season: "Summer", energy: 4, priority: "Optimize foundations" },
  { month: "Jun", palace: "Wellbeing", area: "Inner Power", season: "Summer", energy: 5, priority: "Align inner state" },
  { month: "Jul", palace: "Spouse", area: "Partnership", season: "Autumn", energy: 3, priority: "Cut emotional noise" },
  { month: "Aug", palace: "Siblings", area: "Circle", season: "Autumn", energy: 3, priority: "Purge Connections" },
  { month: "Sep", palace: "Children", area: "Legacy", season: "Autumn", energy: 3, priority: "Structure plans" },
  { month: "Oct", palace: "Parents", area: "Patterns", season: "Autumn", energy: 3, priority: "Cut Old Loop" },
  { month: "Nov", palace: "Life", area: "Self", season: "Winter", energy: 4, priority: "Invest yourself" },
  { month: "Dec", palace: "Health", area: "Body", season: "Winter", energy: 3, priority: "Restore strength" }
];

// Table configuration matching page 45 from reference image
const tableConfig = {
  // Background to cover original content
  bgX: 36,
  bgY: 255,  // Adjusted for bottom-left coords
  bgWidth: 474,
  bgHeight: 455,
  bgColor: rgb(0.996, 0.984, 0.957), // #FEFBF4

  // Table positioning
  startX: 50,
  startY: 668,  // Starting from top, will work downwards
  rowHeight: 33,
  headerHeight: 30,

  // Colors
  headerBgColor: rgb(0.706, 0.345, 0.235), // #b4583c
  textColor: rgb(0, 0, 0),
  borderColor: rgb(0.9, 0.9, 0.9), // Light gray for borders

  // Font
  fontSize: 7,

  // Column definitions (x positions and widths)
  columns: {
    month: { x: 51, width: 48 },
    palace: { x: 102, width: 73 },
    area: { x: 178, width: 68 },
    season: { x: 249, width: 64 },  // Image column
    energy: { x: 316, width: 64 },  // Image column
    priority: { x: 383, width: 115 }
  }
};

async function generateHybridTableFixed() {
  console.log("🚀 Starting FIXED hybrid table generation test...\n");

  // Load the template PDF
  const templatePath = path.join(__dirname, "../assets/templates/pdf/[CAE] Navigate Your Year Like a Pro.pdf");
  const existingPdfBytes = fs.readFileSync(templatePath);

  console.log("✅ Loaded template PDF");

  // Load PDF document
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  pdfDoc.registerFontkit(fontkit);

  // Get page 45 (index 44)
  const page = pdfDoc.getPages()[44];
  const { width, height } = page.getSize();
  console.log(`📄 Page 45 dimensions: ${width}x${height}`);

  // Load Inter Regular font (not Impact!)
  const fontPath = path.join(__dirname, "../assets/fonts/Inter-Regular.ttf");
  const fontBytes = fs.readFileSync(fontPath);
  const interFont = await pdfDoc.embedFont(fontBytes);
  console.log("✅ Loaded Inter Regular font");

  // Load all 7 cell images
  const cellsPath = path.join(__dirname, "../assets/templates/cells");

  const seasonImages = {
    Spring: await pdfDoc.embedPng(fs.readFileSync(path.join(cellsPath, "Spring.png"))),
    Summer: await pdfDoc.embedPng(fs.readFileSync(path.join(cellsPath, "Summer.png"))),
    Autumn: await pdfDoc.embedPng(fs.readFileSync(path.join(cellsPath, "Autumn.png"))),
    Winter: await pdfDoc.embedPng(fs.readFileSync(path.join(cellsPath, "Winter.png")))
  };

  const energyImages = {
    5: await pdfDoc.embedPng(fs.readFileSync(path.join(cellsPath, "5 Star.png"))),
    4: await pdfDoc.embedPng(fs.readFileSync(path.join(cellsPath, "4 Star.png"))),
    3: await pdfDoc.embedPng(fs.readFileSync(path.join(cellsPath, "3 Star.png")))
  };

  console.log("✅ Loaded 7 cell images (4 seasons + 3 energy levels)\n");

  // STEP 1: Draw background rectangle to cover original content
  console.log("🎨 Drawing background rectangle (#FEFBF4) to cover original content...");
  page.drawRectangle({
    x: tableConfig.bgX,
    y: tableConfig.bgY,
    width: tableConfig.bgWidth,
    height: tableConfig.bgHeight,
    color: tableConfig.bgColor
  });
  console.log("✅ Background drawn\n");

  // STEP 2: Draw table header with background
  console.log("📊 Drawing table header...");

  const headerY = tableConfig.startY - tableConfig.headerHeight;

  // Header background
  page.drawRectangle({
    x: tableConfig.startX,
    y: headerY,
    width: tableConfig.bgWidth - 14,
    height: tableConfig.headerHeight,
    color: tableConfig.headerBgColor
  });

  // Header text
  const headers = [
    { text: "MONTH", x: tableConfig.columns.month.x + 5 },
    { text: "PALACE", x: tableConfig.columns.palace.x + 8 },
    { text: "AREA", x: tableConfig.columns.area.x + 12 },
    { text: "SEASON", x: tableConfig.columns.season.x + 8 },
    { text: "ENERGY", x: tableConfig.columns.energy.x + 6 },
    { text: "PRIORITY THEME", x: tableConfig.columns.priority.x + 10 }
  ];

  headers.forEach(header => {
    page.drawText(header.text, {
      x: header.x,
      y: headerY + 11,
      font: interFont,
      size: 7,
      color: rgb(1, 1, 1) // White text
    });
  });

  // Draw header borders
  // Bottom border of header
  page.drawLine({
    start: { x: tableConfig.startX, y: headerY },
    end: { x: tableConfig.startX + tableConfig.bgWidth - 14, y: headerY },
    thickness: 1,
    color: tableConfig.borderColor
  });

  console.log("✅ Header drawn\n");

  // STEP 3: Draw 12 rows of data with borders
  console.log("📝 Drawing 12 data rows with cell borders...\n");

  yearlyData.forEach((rowData, index) => {
    const rowY = headerY - ((index + 1) * tableConfig.rowHeight);

    console.log(`Row ${index + 1}: ${rowData.month.padEnd(4)} | ${rowData.palace.padEnd(10)} | ${rowData.season.padEnd(6)} | ${rowData.energy} stars`);

    // Draw horizontal line above this row
    page.drawLine({
      start: { x: tableConfig.startX, y: rowY + tableConfig.rowHeight },
      end: { x: tableConfig.startX + tableConfig.bgWidth - 14, y: rowY + tableConfig.rowHeight },
      thickness: 1,
      color: tableConfig.borderColor
    });

    // Column 1: MONTH (text)
    page.drawText(rowData.month, {
      x: tableConfig.columns.month.x + 5,
      y: rowY + 12,
      font: interFont,
      size: tableConfig.fontSize,
      color: tableConfig.textColor
    });

    // Column 2: PALACE (text)
    page.drawText(rowData.palace, {
      x: tableConfig.columns.palace.x + 5,
      y: rowY + 12,
      font: interFont,
      size: tableConfig.fontSize,
      color: tableConfig.textColor
    });

    // Column 3: AREA (text)
    page.drawText(rowData.area, {
      x: tableConfig.columns.area.x + 5,
      y: rowY + 12,
      font: interFont,
      size: tableConfig.fontSize,
      color: tableConfig.textColor
    });

    // Column 4: SEASON (image)
    const seasonImage = seasonImages[rowData.season as keyof typeof seasonImages];
    const seasonDims = seasonImage.scale(0.25);

    page.drawImage(seasonImage, {
      x: tableConfig.columns.season.x + 5,
      y: rowY + 5,
      width: seasonDims.width,
      height: seasonDims.height
    });

    // Column 5: ENERGY (image)
    const energyImage = energyImages[rowData.energy as keyof typeof energyImages];
    const energyDims = energyImage.scale(0.2);

    page.drawImage(energyImage, {
      x: tableConfig.columns.energy.x + 5,
      y: rowY + 7,
      width: energyDims.width,
      height: energyDims.height
    });

    // Column 6: PRIORITY THEME (text)
    page.drawText(rowData.priority, {
      x: tableConfig.columns.priority.x + 5,
      y: rowY + 12,
      font: interFont,
      size: tableConfig.fontSize,
      color: tableConfig.textColor
    });

    // Draw vertical borders for each column
    const colXPositions = [
      tableConfig.startX,
      tableConfig.columns.palace.x,
      tableConfig.columns.area.x,
      tableConfig.columns.season.x,
      tableConfig.columns.energy.x,
      tableConfig.columns.priority.x,
      tableConfig.startX + tableConfig.bgWidth - 14
    ];

    colXPositions.forEach(x => {
      page.drawLine({
        start: { x: x, y: rowY },
        end: { x: x, y: rowY + tableConfig.rowHeight },
        thickness: 1,
        color: tableConfig.borderColor
      });
    });
  });

  // Draw final bottom border
  const finalY = headerY - (12 * tableConfig.rowHeight);
  page.drawLine({
    start: { x: tableConfig.startX, y: finalY },
    end: { x: tableConfig.startX + tableConfig.bgWidth - 14, y: finalY },
    thickness: 1,
    color: tableConfig.borderColor
  });

  console.log("\n✅ All 12 rows drawn successfully with cell borders");

  // Save the modified PDF
  const pdfBytes = await pdfDoc.save();
  const outputPath = path.join(__dirname, "../output/test-hybrid-table-FIXED.pdf");

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, pdfBytes);

  console.log(`\n🎉 SUCCESS! FIXED PDF saved to: ${outputPath}`);
  console.log("\n📋 Summary of FIXES:");
  console.log("   ✅ 1. Corrected positioning (proper coordinates)");
  console.log("   ✅ 2. Full table visible (all 12 rows fit)");
  console.log("   ✅ 3. Background rectangle #FEFBF4 covers original content");
  console.log("   ✅ 4. Inter Regular 7px font (not Impact)");
  console.log("   ✅ 5. Cell borders added (horizontal + vertical lines)");
  console.log("\n✨ Next step: Verify the FIXED output PDF visually");
}

// Run the test
generateHybridTableFixed().catch(console.error);
