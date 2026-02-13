# PDF Template System

## Overview

This system allows you to use designer-created PDF templates (from Canva, Figma, etc.) and programmatically replace text fields with dynamic data.

## ✅ Proof of Concept: SUCCESSFUL

We successfully replaced "JANUARY 2026" with "MARCH 2026" on page 7 of the template!

**Test Result**: `src/assets/templates/pdf/test-output-page7.pdf`

## Folder Structure

```
src/assets/templates/
├── pdf/                          # Production PDF templates
│   ├── [CAE] Navigate Your Year Like a Pro.pdf
│   └── test-output-page7.pdf    # Test output
│
├── reference/                    # Reference images for coordinate mapping
│   ├── 1.png through 55.png     # All pages exported as PNG
│   └── [CAE] Navigate Your Year Like a Pro.zip
│
└── coordinates/                  # Coordinate mapping files
    └── navigate-your-year.ts    # Field positions for each page
```

## How It Works

### 1. Designer Workflow
1. Designer creates beautiful template in Canva
2. Export as PDF → save to `pdf/` folder
3. Export each page as PNG → save to `reference/` folder
4. Share with AI agent for coordinate mapping

### 2. AI Coordinate Mapping
1. AI agent reads PNG files
2. Analyzes text positions visually
3. Generates TypeScript coordinate file
4. Saves to `coordinates/` folder

### 3. Developer Usage
```typescript
import { PdfTemplateService } from '../../services/pdf/PdfTemplateService';
import { page7Fields, navigateYourYearTemplate } from '../assets/templates/coordinates/navigate-your-year';
import * as fs from 'fs';

// Load template
const templateBytes = fs.readFileSync('path/to/template.pdf');

// Define replacements
const replacements = [
  {
    fieldKey: 'month',
    newValue: 'MARCH 2026',
    coverBackground: navigateYourYearTemplate.backgrounds.redHeader,
  },
  {
    fieldKey: 'careerScore',
    newValue: '85',
    coverBackground: navigateYourYearTemplate.backgrounds.beige,
  },
];

// Generate PDF
const pageReplacements = new Map([[6, replacements]]); // Page 7 = index 6
const fieldMappings = new Map([[6, page7Fields]]);

const outputBytes = await PdfTemplateService.generateFromTemplate(
  templateBytes,
  pageReplacements,
  fieldMappings
);

// Save or send
fs.writeFileSync('output.pdf', outputBytes);
```

## Coordinate Mapping Format

Each field has precise positioning information:

```typescript
{
  month: {
    x: 53,              // Horizontal position from left
    y: 760,             // Vertical position from bottom
    fontSize: 50,       // Font size in points
    fontFamily: "Helvetica-Bold",
    color: { r: 1, g: 1, b: 1 },  // RGB color (white)
    maxWidth: 300,      // Maximum text width
    align: "left",      // Text alignment
  }
}
```

## Adding New Pages

To add coordinate mappings for more pages:

1. Share the page PNG with AI agent
2. Tell AI which fields need to be dynamic
3. AI analyzes and provides coordinate mapping
4. Add to `coordinates/navigate-your-year.ts`

Example request to AI:
> "Analyze page 8 (reference/8.png) and map these fields:
> - Month header
> - Palace name
> - Season text
> - All score numbers"

## API Endpoint Usage

For JWT-based endpoint generation:

```typescript
// API route: /api/generate-report
app.post('/api/generate-report', async (req, res) => {
  const { token } = req.body;
  
  // Decode JWT
  const userData = decodeJWT(token);
  
  // Load template
  const template = await loadTemplate();
  
  // Prepare replacements based on user data
  const replacements = prepareReplacements(userData);
  
  // Generate PDF
  const pdfBytes = await PdfTemplateService.generateFromTemplate(
    template,
    replacements,
    fieldMappings
  );
  
  // Return PDF
  res.setHeader('Content-Type', 'application/pdf');
  res.send(Buffer.from(pdfBytes));
});
```

## Benefits

✅ **Designer Freedom**: Designers work in familiar tools (Canva)  
✅ **No Manual Mapping**: AI does the coordinate mapping  
✅ **Type-Safe**: TypeScript coordinate files  
✅ **Scalable**: Easy to add new pages/fields  
✅ **Fast**: One-time coordinate mapping, reuse forever  
✅ **Maintainable**: Clear separation of template and logic  

## Test Script

Run the test script to verify the system works:

```bash
npx ts-node src/utils/test-pdf-replace.ts
```

This will:
1. Load the template PDF
2. Replace "JANUARY 2026" with "MARCH 2026" on page 7
3. Save output to `test-output-page7.pdf`

## Next Steps

1. ✅ Proof of concept complete
2. ⏳ Map coordinates for all pages (as needed)
3. ⏳ Integrate with JWT endpoint
4. ⏳ Add dynamic data from user profiles
5. ⏳ Deploy to production

## Notes

- PDF coordinates start from **bottom-left** corner (not top-left!)
- Page dimensions: 384 x 600 points (custom size)
- Always test output PDF to verify positioning
- Adjust `y` coordinate by adding `fontSize * 0.3` for better vertical centering
