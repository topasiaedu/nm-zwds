import puppeteer from "puppeteer";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample data - 12 months with RANDOMIZED palace/area assignments
// This demonstrates that each person gets different palace per month
const yearlyData = [
  { month: "Jan", palace: "Wealth", area: "Financial", season: "Spring", energy: 4, priority: "Cash Out" },
  { month: "Feb", palace: "Health", area: "Body", season: "Winter", energy: 3, priority: "Restore strength" },
  { month: "Mar", palace: "Spouse", area: "Partnership", season: "Autumn", energy: 5, priority: "Cut emotional noise" },
  { month: "Apr", palace: "Children", area: "Legacy", season: "Summer", energy: 3, priority: "Structure plans" },
  { month: "May", palace: "Career", area: "Professional", season: "Spring", energy: 5, priority: "Launch initiatives" },
  { month: "Jun", palace: "Parents", area: "Patterns", season: "Autumn", energy: 4, priority: "Cut Old Loop" },
  { month: "Jul", palace: "Travel", area: "Expansion", season: "Summer", energy: 5, priority: "Step outside comfort" },
  { month: "Aug", palace: "Wellbeing", area: "Inner Power", season: "Summer", energy: 4, priority: "Align inner state" },
  { month: "Sep", palace: "Property", area: "Assets", season: "Autumn", energy: 3, priority: "Optimize foundations" },
  { month: "Oct", palace: "Life", area: "Self", season: "Winter", energy: 5, priority: "Invest yourself" },
  { month: "Nov", palace: "Friends", area: "Network", season: "Spring", energy: 4, priority: "Activate connections" },
  { month: "Dec", palace: "Siblings", area: "Circle", season: "Winter", energy: 3, priority: "Purge Connections" }
];

// Map season/energy to image paths (we'll convert to base64)
const seasonImagePaths = {
  Spring: path.join(__dirname, "../assets/templates/cells/Spring.png"),
  Summer: path.join(__dirname, "../assets/templates/cells/Summer.png"),
  Autumn: path.join(__dirname, "../assets/templates/cells/Autumn.png"),
  Winter: path.join(__dirname, "../assets/templates/cells/Winter.png")
};

const energyImagePaths = {
  3: path.join(__dirname, "../assets/templates/cells/3 Star.png"),
  4: path.join(__dirname, "../assets/templates/cells/4 Star.png"),
  5: path.join(__dirname, "../assets/templates/cells/5 Star.png")
};

// Convert image to base64 data URI
function imageToBase64(imagePath: string): string {
  const imageBuffer = fs.readFileSync(imagePath);
  const base64 = imageBuffer.toString('base64');
  return `data:image/png;base64,${base64}`;
}

// Generate HTML rows
function generateRows(): string {
  return yearlyData.map(row => {
    const seasonImageBase64 = imageToBase64(seasonImagePaths[row.season as keyof typeof seasonImagePaths]);
    const energyImageBase64 = imageToBase64(energyImagePaths[row.energy as keyof typeof energyImagePaths]);

    return `
      <tr>
        <td class="col-month">${row.month}</td>
        <td class="col-palace">${row.palace}</td>
        <td class="col-area">${row.area}</td>
        <td class="col-season season-cell"><img src="${seasonImageBase64}" alt="${row.season}"></td>
        <td class="col-energy energy-cell"><img src="${energyImageBase64}" alt="${row.energy} stars"></td>
        <td class="col-priority">${row.priority}</td>
      </tr>
    `;
  }).join('\n');
}

async function generateTableImage() {
  console.log("🚀 Starting HTML-to-Image table generation...\n");

  // Load HTML template
  const templatePath = path.join(__dirname, "../templates/table-template.html");
  let htmlContent = fs.readFileSync(templatePath, 'utf-8');

  console.log("✅ Loaded HTML template");

  // Inject rows
  const rowsHtml = generateRows();
  htmlContent = htmlContent.replace('{{ROWS}}', rowsHtml);

  console.log("✅ Injected 12 rows of data");

  // Launch Puppeteer
  console.log("🌐 Launching headless browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Set viewport to exact table dimensions
  await page.setViewport({
    width: 460,
    height: 380, // Increased for 30px row height
    deviceScaleFactor: 2 // Higher resolution for better quality
  });

  console.log("✅ Browser launched, viewport set to 460x380 (2x scale)");

  // Load HTML content
  await page.setContent(htmlContent, {
    waitUntil: 'networkidle0' // Wait for fonts and images to load
  });

  console.log("✅ HTML content loaded, waiting for fonts...");

  // Wait for table to be present
  await page.waitForSelector('#yearly-table');

  // Wait a bit more for fonts to fully render
  await page.evaluate(() => document.fonts.ready);
  await new Promise(resolve => setTimeout(resolve, 500));

  console.log("✅ Fonts loaded and ready");

  // Get the table element
  const tableElement = await page.$('.table-container');

  if (!tableElement) {
    throw new Error("Table container not found!");
  }

  // Take screenshot
  const outputPath = path.join(__dirname, "../output/table-generated.png");

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  await tableElement.screenshot({
    path: outputPath,
    type: 'png',
    omitBackground: false
  });

  console.log(`\n🎉 Table image generated: ${outputPath}`);

  // Get dimensions for verification
  const dimensions = await tableElement.boundingBox();
  console.log(`📐 Image dimensions: ${dimensions?.width}x${dimensions?.height} (at 2x scale)`);

  await browser.close();
  console.log("✅ Browser closed");

  console.log("\n✨ Next step: Embed this image into PDF");
}

// Run the generator
generateTableImage().catch(console.error);
