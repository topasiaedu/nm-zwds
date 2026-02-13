/**
 * Test script - Image-based table generation (Proof of Concept)
 * Uses ONE row template image repeated 12 times
 */

import { PDFDocument, rgb } from "pdf-lib";
import * as fs from "fs";

async function generateTableFromRowImage() {
  try {
    console.log("Loading PDF template...");
    
    const pdfPath = "E:/Dev/GitHub/nm-zwds/src/assets/templates/pdf/[CAE] Navigate Your Year Like a Pro.pdf";
    const existingPdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    
    console.log(`PDF loaded. Total pages: ${pdfDoc.getPageCount()}`);
    
    // Get page 45 (index 44)
    const page = pdfDoc.getPages()[44];
    const { width, height } = page.getSize();
    
    console.log(`Page 45 dimensions: ${width} x ${height}`);
    
    // Load the row template image
    const rowImagePath = "E:/Dev/GitHub/nm-zwds/src/assets/templates/rows/image.png";
    
    if (!fs.existsSync(rowImagePath)) {
      console.error("❌ Row template image not found!");
      console.log("Please export one table row from Canva and save it to:");
      console.log(rowImagePath);
      return;
    }
    
    console.log("✅ Row image found, loading...");
    const rowImageBytes = fs.readFileSync(rowImagePath);
    const rowImage = await pdfDoc.embedPng(rowImageBytes);
    
    // Get image dimensions
    const imgDims = rowImage.scale(1);
    console.log(`Row image dimensions: ${imgDims.width} x ${imgDims.height}`);
    
    // Table position settings (measured from reference page 45)
    const monthColumnWidth = 45; // Space for month column (Jan, Feb, etc)
    const tableStartX = 50; // Start of MONTH column
    const dataStartX = tableStartX + monthColumnWidth + 5; // Start of your row image (after month)
    const tableStartY = 475; // Starting Y position for first row
    const rowHeight = 30; // Height between rows
    
    // Calculate actual width needed for the image
    const actualImageWidth = (imgDims.width / imgDims.height) * (rowHeight - 1);
    console.log(`Calculated image width at scale: ${actualImageWidth}px`);
    
    // Cover the existing table area first (but leave header visible)
    console.log("Covering existing table data area...");
    page.drawRectangle({
      x: 45,
      y: 120,
      width: 465,
      height: 380,
      color: rgb(0.98, 0.96, 0.94), // Cream background
    });
    
    // Load font for text
    const { StandardFonts } = await import("pdf-lib");
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Draw header row
    console.log("Drawing table header...");
    const headerY = tableStartY + 25;
    const headerHeight = 20;
    
    // Header background color: #b4583c
    page.drawRectangle({
      x: tableStartX,
      y: headerY,
      width: monthColumnWidth + actualImageWidth + 5,
      height: headerHeight,
      color: rgb(0.706, 0.345, 0.235), // #b4583c
    });
    
    // Header labels
    const headers = [
      { label: "MONTH", x: tableStartX + 5 },
      { label: "PALACE", x: dataStartX + 5 },
      { label: "AREA", x: dataStartX + 75 },
      { label: "SEASON", x: dataStartX + 155 },
      { label: "ENERGY", x: dataStartX + 230 },
      { label: "PRIORITY THEME", x: dataStartX + 290 },
    ];
    
    headers.forEach(header => {
      page.drawText(header.label, {
        x: header.x,
        y: headerY + 6,
        size: 7,
        font: fontBold,
        color: rgb(1, 1, 1), // White
      });
    });
    
    // Month names
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Draw the row image 12 times with month labels
    console.log("Drawing 12 rows with month labels...");
    
    for (let i = 0; i < 12; i++) {
      const yPosition = tableStartY - (i * rowHeight);
      
      // Draw month label (left column)
      page.drawText(months[i], {
        x: tableStartX + 5,
        y: yPosition + 8,
        size: 7,
        font: font,
        color: rgb(0, 0, 0),
      });
      
      // Draw row image (remaining 5 columns)
      page.drawImage(rowImage, {
        x: dataStartX,
        y: yPosition,
        width: actualImageWidth,
        height: rowHeight - 1,
      });
      
      console.log(`  Row ${i + 1} (${months[i]}) drawn at y=${yPosition}`);
    }
    
    console.log("✅ All rows drawn successfully!");
    
    // Save the modified PDF
    const outputPath = "E:/Dev/GitHub/nm-zwds/src/assets/templates/pdf/test-output-page45-image-rows.pdf";
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);
    
    console.log(`\n✅ Modified PDF saved to: ${outputPath}`);
    console.log("\n📊 PROOF OF CONCEPT RESULT:");
    console.log("- This shows all 12 rows using your exported image");
    console.log("- All rows are identical (same palace/season/energy)");
    console.log("- Quality should be pixel-perfect!");
    console.log("\n🎯 Next step: Export 12 different row images (one per month)");
    console.log("   and we can dynamically choose which image to place");
    
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

generateTableFromRowImage();
