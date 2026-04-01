# PDF Capture Maintainer Notes

## How capture mode works
- Main pipeline is in `src/utils/pdfExport.ts`.
- Analysis sections are rendered to an off-screen DOM root using `PdfCaptureLanguageProvider`, then rasterized via `html2canvas`, then paginated into `jsPDF`.
- Off-screen root uses `pdf-capture-root` styling to normalize capture-only typography and disable animation/transition effects.
- Section-level semantic hints use `data-pdf-break-anchor` attributes and are consumed by the paginator.

## Typography tuning points
- Capture baseline class and text rendering defaults: `src/utils/pdfExport.ts` (`PDF_CAPTURE_ROOT_CLASS` and injected capture style).
- Badge/chip vertical alignment is standardized with explicit `height`, `lineHeight: 1`, and `inline-flex` centering in:
  - `src/components/analysis_v2/shared/GradientSectionHeader.tsx`
  - `src/components/analysis_v2/WealthCode.tsx`
  - `src/components/analysis_v2/FourKeyPalace.tsx`
  - `src/components/analysis_v2/Overview.tsx`

## Pagination tuning points
- Pagination entry point: `addPaginatedCanvasToPdf` in `src/utils/pdfExport.ts`.
- Main knobs:
  - `PAGINATION_ANCHOR_TOLERANCE_RATIO`
  - `MIN_PAGE_FILL_RATIO`
  - `MIN_RESIDUAL_RATIO`
  - `TILE_OVERLAP_PX` (used with adaptive overlap reduction)
- Dev instrumentation logs are emitted via `console.debug` in dev mode to inspect:
  - chosen cut positions (`sourceY`, `sliceHeight`)
  - per-page fill ratio

## QA safety hooks
- `isCaptureCanvasValid` guards invalid canvases before pagination.
- Zero-height/invalid tiles are rejected in paginator loop.
- If capture fails (or yields no tiles), exporter adds a fallback page message instead of aborting the full export.
