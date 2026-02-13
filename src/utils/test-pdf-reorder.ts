/**
 * Test script - Reordering PDF pages
 * This demonstrates how to move page 7 to be the first page
 */

import { PDFDocument } from "pdf-lib";
import * as fs from "fs";

async function reorderPages() {
  try {
    console.log("Loading PDF template...");
    
    const pdfPath = "E:/Dev/GitHub/nm-zwds/src/assets/templates/pdf/[CAE] Navigate Your Year Like a Pro.pdf";
    const existingPdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    
    const totalPages = pdfDoc.getPageCount();
    console.log(`PDF loaded. Total pages: ${totalPages}`);
    
    console.log("Moving page 7 (index 6) to be the first page...");
    
    // Create a new PDF with pages in desired order
    const newPdfDoc = await PDFDocument.create();
    
    // Copy pages in new order: page 7 first, then pages 1-6, then pages 8-55
    // New order: [6, 0, 1, 2, 3, 4, 5, 7, 8, 9, ...]
    const pageIndices = [
      6, // Page 7 becomes first
      ...Array.from({ length: 6 }, (_, i) => i), // Pages 1-6 (indices 0-5)
      ...Array.from({ length: totalPages - 7 }, (_, i) => i + 7), // Pages 8-55 (indices 7-54)
    ];
    
    const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach((page) => newPdfDoc.addPage(page));
    
    console.log("✅ Page order changed successfully!");
    console.log("New order: Page 7 is now Page 1, old Pages 1-6 are now Pages 2-7");
    console.log(`Total pages in new PDF: ${newPdfDoc.getPageCount()}`);
    
    // Save the modified PDF
    const outputPath = "E:/Dev/GitHub/nm-zwds/src/assets/templates/pdf/test-reordered.pdf";
    const pdfBytes = await newPdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);
    
    console.log(`✅ Reordered PDF saved to: ${outputPath}`);
    console.log("Open the file to verify page 7 is now first!");
    
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

reorderPages();
