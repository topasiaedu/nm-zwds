/**
 * Test script to replace text in PDF template
 * This is a proof of concept to replace "JANUARY 2026" with "MARCH 2026" on page 7
 */

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import * as fs from "fs";

async function replaceMonthOnPage7() {
  try {
    console.log("Loading PDF template...");
    
    // Load the PDF template (using absolute path)
    const pdfPath = "E:/Dev/GitHub/nm-zwds/src/assets/templates/pdf/[CAE] Navigate Your Year Like a Pro.pdf";
    const existingPdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    
    console.log(`PDF loaded. Total pages: ${pdfDoc.getPageCount()}`);
    
    // Get page 7 (index 6, since 0-indexed)
    const page = pdfDoc.getPages()[6];
    const { width, height } = page.getSize();
    
    console.log(`Page 7 dimensions: ${width} x ${height}`);
    
    // Based on visual analysis and Canva specs:
    // - Font: Impact (36pt in Canva) - using Helvetica-Bold as substitute
    // - Canva 36pt ≈ 36-38pt in PDF
    // - Position: Top red bar, left-aligned
    // - Page height: 600 points, text about 25-30 points from top
    
    const monthPosition = {
      x: 52,
      y: 538, // Adjusted for correct vertical position
      width: 280, // Width to cover "JANUARY 2026"
      height: 50,
    };
    
    // Cover the old text with a red rectangle (matching the background)
    // Need to cover slightly larger area to ensure "JANUARY" is fully covered
    page.drawRectangle({
      x: monthPosition.x - 5,
      y: monthPosition.y - 3,
      width: 285,
      height: 54,
      color: rgb(0.77, 0.08, 0.08), // Match the dark red header
    });
    
    // Load a bold font (closest to Impact)
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Draw the new text with correct size
    page.drawText("MARCH 2026", {
      x: monthPosition.x,
      y: monthPosition.y + 6, // Fine-tune vertical centering
      size: 36, // Match Canva font size
      font: font,
      color: rgb(1, 1, 1), // White text
      lineHeight: 36,
    });
    
    console.log("Text replaced successfully!");
    
    // Save the modified PDF
    const outputPath = "E:/Dev/GitHub/nm-zwds/src/assets/templates/pdf/test-output-page7.pdf";
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);
    
    console.log(`✅ Modified PDF saved to: ${outputPath}`);
    console.log("Check the output file to verify the change!");
    
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

// Run the function
replaceMonthOnPage7();
