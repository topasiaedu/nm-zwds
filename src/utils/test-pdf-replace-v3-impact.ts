/**
 * Test script V3 - Using real Impact font
 * 
 * Instructions:
 * 1. Copy Impact font from Windows: C:\Windows\Fonts\impact.ttf
 * 2. Paste to: src/assets/fonts/impact.ttf
 * 3. Run this script
 */

import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import * as fs from "fs";
import * as path from "path";

async function replaceMonthWithImpactFont() {
  try {
    console.log("Loading PDF template...");
    
    const pdfPath = "E:/Dev/GitHub/nm-zwds/src/assets/templates/pdf/[CAE] Navigate Your Year Like a Pro.pdf";
    const existingPdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    
    // Register fontkit to enable custom font embedding
    pdfDoc.registerFontkit(fontkit);
    
    console.log(`PDF loaded. Total pages: ${pdfDoc.getPageCount()}`);
    
    const page = pdfDoc.getPages()[6];
    const { width, height } = page.getSize();
    
    console.log(`Page 7 dimensions: ${width} x ${height}`);
    
    // Try to load Impact font
    const impactFontPath = "E:/Dev/GitHub/nm-zwds/src/assets/fonts/impact.ttf";
    
    let font;
    if (fs.existsSync(impactFontPath)) {
      console.log("✅ Impact font found! Using real Impact font...");
      const impactFontBytes = fs.readFileSync(impactFontPath);
      font = await pdfDoc.embedFont(impactFontBytes);
    } else {
      console.log("⚠️  Impact font not found at:", impactFontPath);
      console.log("Instructions:");
      console.log("1. Open: C:\\Windows\\Fonts\\");
      console.log("2. Find: impact.ttf");
      console.log("3. Copy to: src/assets/fonts/impact.ttf");
      console.log("");
      console.log("For now, falling back to Helvetica-Bold...");
      const { StandardFonts } = await import("pdf-lib");
      font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    }
    
    // Position for "MARCH 2026" - matching where "JANUARY 2026" was
    const monthPosition = {
      x: 45,
      y: 570, // Higher position to match original placement
    };
    
    // Cover the old "JANUARY 2026" text completely
    // Background color: #aa0000 = rgb(170/255, 0, 0) = rgb(0.667, 0, 0)
    // Make it extra wide to ensure full coverage of "JANUARY"
    page.drawRectangle({
      x: 40,
      y: 562,
      width: 345, // Much wider to cover all of "JANUARY 2026"
      height: 50,
      color: rgb(0.667, 0, 0), // Exact color #aa0000
    });
    
    // Draw the new text with Impact font
    page.drawText("MARCH 2026", {
      x: monthPosition.x,
      y: monthPosition.y,
      size: 36, // Exact size from Canva
      font: font,
      color: rgb(1, 1, 1), // White
    });
    
    console.log("Text replaced successfully!");
    
    const outputPath = "E:/Dev/GitHub/nm-zwds/src/assets/templates/pdf/test-output-page7-v3-impact.pdf";
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);
    
    console.log(`✅ Modified PDF saved to: ${outputPath}`);
    console.log("Open the file to check the result!");
    
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

replaceMonthWithImpactFont();
