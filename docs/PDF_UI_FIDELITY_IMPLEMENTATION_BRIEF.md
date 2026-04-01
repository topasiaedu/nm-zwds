# PDF UI Fidelity Implementation Brief

## Context

The exported PDF currently uses client-side section capture (`html2canvas` + `jsPDF`) to preserve the app's visual style. This is the correct direction for UI parity, but the current output still has print-quality defects:

- Text/badge vertical alignment shifts (example: `01` badge baseline drops in PDF header)
- Inconsistent line-height/font metrics between app DOM vs capture clone
- Some pages have large blank regions caused by section tiling and pagination cut points
- Card heights and content density differ from what users see in-app
- Long sections split at visually awkward points

The goal is not to redesign the report. The goal is to make PDF output look like the app with stable print layout.

## Desired Outcome

1. PDF matches in-app layout and typography as closely as possible.
2. No clipped content, no obvious seam lines, no oversized blank pages.
3. Stable component alignment in capture mode (badges, labels, counters, pills).
4. Deterministic pagination for long sections.
5. Keep the existing `blueprintMode` behavior (`dna`, `dayun`, `liumonth`) and free vs premium flow.

## Current System Surface

Primary pipeline:
- `src/utils/pdfExport.ts`

High-risk components for PDF misalignment:
- `src/components/analysis_v2/Overview.tsx`
- `src/components/analysis_v2/WealthCode.tsx`
- `src/components/analysis_v2/Health.tsx`
- `src/components/analysis_v2/AreasOfLIfe.tsx`
- `src/components/analysis_v2/FourKeyPalace.tsx`

Language provider used in detached capture trees:
- `src/context/LanguageContext.tsx` (`PdfCaptureLanguageProvider`)

## Root Causes (UI/UX + Technical)

### 1) Font Metrics Drift
`html2canvas` clone can render with slightly different font metrics if fonts are not guaranteed loaded before capture.

Impact:
- badge numerals vertically off-center
- text line breaks differ from app

### 2) Baseline + Line-Height Inconsistency
Mixed usage of utility classes and custom inline styles causes baseline drift in tight badges/chips and header strips.

Impact:
- “centered in app, lower in PDF” symptoms

### 3) Pagination Cut Logic Is Geometric, Not Semantic
Current slicing tiles by pixel height only. It does not avoid cutting through key visual groups.

Impact:
- awkward splits
- pages with mostly whitespace

### 4) Dynamic/Animated Styles Leak into Capture
Some effects are disabled for capture, but not fully normalized across all components.

Impact:
- subtle spacing/position mismatch

## Implementation Strategy

### A. Add a Dedicated PDF Capture CSS Baseline
Create a global capture class (example: `pdf-capture-root`) applied to off-screen render container and force:

- `font-feature-settings`, `text-rendering`, smoothing consistency
- explicit `line-height` tokens for headings/body/chips
- no transitions/animations in capture mode
- no `position: sticky/fixed` effects in cloned tree

### B. Introduce “Semantic Break Anchors”
Wrap major cards/sections with a `data-pdf-break-anchor` marker and improve paginator to prefer cut points near anchors.

Fallback to geometric slice only if no anchor window available.

### C. Standardize Badge/Chip Alignment Tokens
For components with known drift (header badges, score pills, tiny tags), enforce:

- explicit height
- `display: inline-flex`
- `align-items: center`
- `line-height: 1`
- stable vertical padding

### D. Two-Pass Capture Timing
Before capture:
1) wait for fonts/images
2) render + settle frame
3) capture

Use deterministic waits only where needed.

### E. Improve Pagination Heuristics
Keep existing tile slicing, but add:

- minimum fill threshold per page (avoid mostly empty pages)
- seam overlap guard
- orphan/widow style rule for short fragments at page top

## UX Acceptance Criteria

- Header badge numbers remain visually centered in their box.
- Text wrapping in major cards is consistent with app rendering.
- No page has >45% blank area unless it is intentionally end-of-section.
- No key title/subtitle is split from its immediate content block.
- No clipped text or overlapping cards.

## Test Plan

### Golden Set
Use the provided exported page PNGs as baseline references and compare post-fix output.

### Scenarios
- DNA full report
- Dayun mode
- Liumonth mode
- Long Health section
- Long Wealth/Career section
- Mixed Chinese/English data

### Device/Class Checks
- Desktop Chrome capture
- At least one lower-memory machine profile

## Non-Goals

- Rebuilding report in `@react-pdf/renderer`
- Rewriting visual design system
- Server-side rendering pipeline

## Delivery

Implementation should be delivered in small, reviewable commits/patches with screenshots of before/after for:

1) badge alignment fix
2) pagination quality fix
3) final full-report pass
