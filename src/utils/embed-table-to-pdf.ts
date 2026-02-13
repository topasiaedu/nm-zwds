import { PDFDocument, rgb } from "pdf-lib";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function embedTableImage() {
  console.log("🚀 Starting PDF embedding with generated table image...\n");

  // Load the template PDF
  const templatePath = path.join(__dirname, "../assets/templates/pdf/[CAE] Navigate Your Year Like a Pro.pdf");
  const existingPdfBytes = fs.readFileSync(templatePath);

  console.log("✅ Loaded template PDF");

  // Load PDF document
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Get page 45 (index 44)
  const page = pdfDoc.getPages()[44];
  const { width, height } = page.getSize();
  console.log(`📄 Page 45 dimensions: ${width}x${height}`);

  // Load the generated table image
  const tableImagePath = path.join(__dirname, "../output/table-generated.png");
  const tableImageBytes = fs.readFileSync(tableImagePath);
  const tableImage = await pdfDoc.embedPng(tableImageBytes);

  const tableDims = tableImage.scale(0.5); // Scale down from 2x to 1x
  console.log(`🖼️ Table image dimensions (scaled): ${tableDims.width}x${tableDims.height}`);

  // Draw single background rectangle to cover the area where table will be
  console.log("🎨 Drawing background rectangle...");

  page.drawRectangle({
    x: 30,
    y: 98,
    width: tableDims.width + 5,
    height: tableDims.height + 5,
    color: rgb(0.996, 0.984, 0.957) // #FEFBF4
  });

  console.log("✅ Background rectangle drawn");

  // Embed the table image
  // Position: x:32, y:100 per user request
  console.log("📊 Embedding table image...");
  page.drawImage(tableImage, {
    x: 32,
    y: 100,
    width: tableDims.width,
    height: tableDims.height
  });

  console.log("✅ Table image embedded");
  console.log(`📍 Position: x=32, y=100`);
  console.log(`📐 Table size: ${tableDims.width}x${tableDims.height}`);

  // Save the modified PDF
  const pdfBytes = await pdfDoc.save();
  const outputPath = path.join(__dirname, "../output/test-final-html.pdf");

  fs.writeFileSync(outputPath, pdfBytes);

  console.log(`\n🎉 SUCCESS! PDF saved to: ${outputPath}`);
  console.log("\n📋 Summary:");
  console.log("   - Position: x:32, y:100");
  console.log("   - Cell height: 26px");
  console.log("   - Table width: 350px");
  console.log("\n✨ Next step: Verify the output PDF visually");
}

// Run the embedding
embedTableImage().catch(console.error);
