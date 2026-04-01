# PDF UI Fidelity QA Checklist

## Pre-check
- Run `npx tsc --noEmit`.
- Run lint for touched files.
- Confirm export is still one-click from `result` page.

## Functional coverage
- Free result: export includes cover/chart pages and no paid analysis regressions.
- Premium result: export includes analysis pages and completes successfully.
- Blueprint modes:
  - `dna`
  - `dayun`
  - `liumonth`

## Visual fidelity checks
- Header badge numerals (`01`..`06`) are vertically centered.
- Pills/chips/tags are centered and not baseline-shifted.
- No animated state leakage in PDF (no pulse/transition artifacts).
- Text wrapping is stable and not clipped.

## Pagination checks
- No obvious horizontal seam lines between slices.
- Fewer pages with large blank lower regions.
- Section boundaries are cleaner and avoid splitting major cards when possible.
- No zero-height or missing page slices.

## Stress checks
- Long Health section scenario.
- Long Wealth Code scenario.
- Mixed Chinese/English content.

## Regression checks
- Progress messages still advance and finish.
- Export file naming still works.
- Fallback page appears only when section capture actually fails.
