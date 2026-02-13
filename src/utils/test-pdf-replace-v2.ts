/**
 * Test script V2 - With Impact-like font rendering
 * Uses character spacing to simulate Impact font's condensed look
 */

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import * as fs from "fs";

async function replaceMonthOnPage7V2() {
  try {
    console.log("Loading PDF template...");
    
    const pdfPath = "E:/Dev/GitHub/nm-zwds/src/assets/templates/pdf/[CAE] Navigate Your Year Like a Pro.pdf";
    const existingPdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    
    console.log(`PDF loaded. Total pages: ${pdfDoc.getPageCount()}`);
    
    const page = pdfDoc.getPages()[6];
    const { width, height } = page.getSize();
    
    console.log(`Page 7 dimensions: ${width} x ${height}`);
    
    const monthPosition = {
      x: 52,
      y: 538,
    };
    
    // Cover the old text - make it wider to fully cover "JANUARY"
    page.drawRectangle({
      x: 47,
      y: 535,
      width: 290,
      height: 56,
      color: rgb(0.77, 0.08, 0.08),
    });
    
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Draw each character individually with tighter spacing to mimic Impact
    const text = "MARCH 2026";
    const fontSize = 36;
    const letterSpacing = -1; // Negative spacing for condensed look
    
    let xOffset = monthPosition.x;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      page.drawText(char, {
        x: xOffset,
        y: monthPosition.y + 6,
        size: fontSize,
        font: font,
        color: rgb(1, 1, 1),
      });
      
      // Calculate next position (width of character + spacing)
      const charWidth = font.widthOfTextAtSize(char, fontSize);
      xOffset += charWidth + letterSpacing;
    }
    
    console.log("Text replaced successfully with condensed spacing!");
    
    const outputPath = "E:/Dev/GitHub/nm-zwds/src/assets/templates/pdf/test-output-page7-v2.pdf";
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);
    
    console.log(`✅ Modified PDF saved to: ${outputPath}`);
    
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

replaceMonthOnPage7V2();
