/**
 * PDF Template Service
 * 
 * Service for filling PDF templates with dynamic data.
 * Uses coordinate mappings to replace text in designer-created templates.
 */

import { PDFDocument, rgb, StandardFonts, PDFFont, RGB } from "pdf-lib";
import type { FieldPosition } from "../../assets/templates/coordinates/navigate-your-year";

export interface PdfTemplateConfig {
  templatePath: string;
  outputPath?: string;
  fields: Record<string, FieldPosition>;
}

export interface FieldReplacement {
  fieldKey: string;
  newValue: string;
  coverBackground?: RGB;
}

/**
 * PDF Template Service for replacing text in templates
 */
export class PdfTemplateService {
  /**
   * Load a PDF template from file system or URL
   */
  static async loadTemplate(templatePath: string): Promise<PDFDocument> {
    // In a real app, this would fetch from your storage
    // For now, we'll assume the caller provides the bytes
    throw new Error("Not implemented - use loadTemplateFromBytes instead");
  }

  /**
   * Load a PDF template from bytes
   */
  static async loadTemplateFromBytes(pdfBytes: ArrayBuffer): Promise<PDFDocument> {
    return await PDFDocument.load(pdfBytes);
  }

  /**
   * Replace text fields on a specific page
   * 
   * @param pdfDoc - The PDF document
   * @param pageIndex - Page index (0-based)
   * @param replacements - Array of field replacements
   * @param fieldPositions - Coordinate mapping for fields
   */
  static async replaceFieldsOnPage(
    pdfDoc: PDFDocument,
    pageIndex: number,
    replacements: FieldReplacement[],
    fieldPositions: Record<string, FieldPosition>
  ): Promise<void> {
    const page = pdfDoc.getPages()[pageIndex];
    
    // Load fonts
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
    
    const fontMap: Record<string, PDFFont> = {
      "Helvetica": helvetica,
      "Helvetica-Bold": helveticaBold,
      "Helvetica-Oblique": helveticaOblique,
    };
    
    // Process each replacement
    for (const replacement of replacements) {
      const fieldConfig = fieldPositions[replacement.fieldKey];
      
      if (!fieldConfig) {
        console.warn(`Field "${replacement.fieldKey}" not found in coordinate mapping`);
        continue;
      }
      
      // Cover old text with background color
      if (replacement.coverBackground) {
        const coverWidth = fieldConfig.maxWidth || 200;
        const coverHeight = fieldConfig.fontSize + 10;
        
        page.drawRectangle({
          x: fieldConfig.x,
          y: fieldConfig.y,
          width: coverWidth,
          height: coverHeight,
          color: replacement.coverBackground,
        });
      }
      
      // Get font
      const font = fontMap[fieldConfig.fontFamily] || helvetica;
      
      // Draw new text
      page.drawText(replacement.newValue, {
        x: fieldConfig.x,
        y: fieldConfig.y + (fieldConfig.fontSize * 0.3), // Adjust for better centering
        size: fieldConfig.fontSize,
        font: font,
        color: rgb(fieldConfig.color.r, fieldConfig.color.g, fieldConfig.color.b),
        maxWidth: fieldConfig.maxWidth,
      });
    }
  }

  /**
   * Save the modified PDF
   */
  static async savePdf(pdfDoc: PDFDocument): Promise<Uint8Array> {
    return await pdfDoc.save();
  }

  /**
   * Complete workflow: Load template, replace fields, save
   */
  static async generateFromTemplate(
    templateBytes: ArrayBuffer,
    pageReplacements: Map<number, FieldReplacement[]>,
    fieldMappings: Map<number, Record<string, FieldPosition>>
  ): Promise<Uint8Array> {
    // Load template
    const pdfDoc = await this.loadTemplateFromBytes(templateBytes);
    
    // Process each page
    for (const [pageIndex, replacements] of pageReplacements.entries()) {
      const fieldPositions = fieldMappings.get(pageIndex);
      if (!fieldPositions) {
        console.warn(`No field mapping found for page ${pageIndex}`);
        continue;
      }
      
      await this.replaceFieldsOnPage(pdfDoc, pageIndex, replacements, fieldPositions);
    }
    
    // Save and return
    return await this.savePdf(pdfDoc);
  }
}

export default PdfTemplateService;
