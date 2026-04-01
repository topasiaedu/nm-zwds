# PDF UI Fidelity Agent Prompts

Use these prompts with another coding agent (Gemini 3.1 Pro High). They are scoped to avoid context-window overload while still being substantial.

Run prompts in order: Prompt 1 -> Prompt 2 -> Prompt 3.

---

## Prompt 1: Alignment and Typography Stabilization

```md
You are working in `C:/Users/Stanley/Documents/GitHub/nm-zwds`.

Goal:
Fix PDF capture text/badge misalignment issues (notably section badge numerals like "01" appearing lower than centered in PDF) while preserving in-app design.

Context:
- PDF export path is client-side capture via `src/utils/pdfExport.ts`.
- Off-screen capture uses `PdfCaptureLanguageProvider`.
- Known problematic components:
  - `src/components/analysis_v2/Overview.tsx`
  - `src/components/analysis_v2/WealthCode.tsx`
  - `src/components/analysis_v2/FourKeyPalace.tsx`
  - `src/components/analysis_v2/Health.tsx`
  - `src/components/analysis_v2/AreasOfLIfe.tsx`

Tasks:
1) Add a stable capture baseline class to the off-screen capture root in `pdfExport.ts` and apply strict text rendering and line-height defaults for capture mode only.
2) For badge/chip/pill UI elements in the components above, enforce explicit vertical centering in `forPdfCapture` mode:
   - use inline-flex centering
   - explicit height
   - line-height: 1
   - remove ambiguous vertical paddings
3) Ensure animations/transitions are disabled in `forPdfCapture` mode for all listed components.
4) Keep normal app UI behavior unchanged outside PDF mode.

Acceptance:
- Badge numerals are centered in PDF output.
- No visual regressions in normal app mode.
- `npx tsc --noEmit` passes and lints pass for changed files.

Constraints:
- Do not migrate to react-pdf or server rendering.
- Keep changes focused to capture alignment only (no pagination rewrite in this task).
```

---

## Prompt 2: Smart Pagination and Blank-Page Reduction

```md
You are working in `C:/Users/Stanley/Documents/GitHub/nm-zwds`.

Goal:
Improve PDF pagination quality in `html2canvas + jsPDF` export so long sections avoid ugly splits and pages with excessive blank space.

Context:
- Main file: `src/utils/pdfExport.ts`.
- Current function: tiled slicing (`addPaginatedCanvasToPdf`) with fixed geometric cuts.
- Problem examples: pages with large empty lower area, awkward section split points.

Tasks:
1) Enhance paginator to support semantic break hints:
   - During capture, detect optional break anchors (`data-pdf-break-anchor`) from DOM and map to canvas Y ranges.
   - Prefer cut points near anchors within a tolerance window.
2) Add a minimum page-fill threshold heuristic:
   - avoid creating a new page for tiny residual slices if content can be merged without major overflow artifacts.
3) Keep seam overlap logic but tune it to reduce visible horizontal cut lines.
4) Add lightweight instrumentation logs (dev-only) for:
   - chosen cut positions
   - fill ratio per page
5) Do not alter user-facing progress flow or blueprint mode behavior.

Acceptance:
- Fewer pages with excessive blank area.
- Cleaner section boundaries.
- No clipped text.
- `npx tsc --noEmit` and lints pass.

Constraints:
- Keep API signatures stable unless absolutely necessary.
- No broad refactor outside `pdfExport.ts` and minimal helper additions.
```

---

## Prompt 3: End-to-End Polish, QA Hooks, and Documentation

```md
You are working in `C:/Users/Stanley/Documents/GitHub/nm-zwds`.

Goal:
Finalize PDF UI-fidelity pipeline with QA checks and concise maintainers docs.

Context:
- Prompt 1 handled alignment stabilization.
- Prompt 2 handled pagination heuristics.
- Existing UX requirement: PDF should match app style as closely as possible.

Tasks:
1) Add a small capture QA utility in `pdfExport.ts` (or adjacent util) to validate:
   - capture canvas dimensions are valid
   - no zero-height tiles
   - fallback behavior when a section capture fails
2) Ensure free vs premium and blueprint mode (`dna/dayun/liumonth`) flows remain intact.
3) Add a short maintainer doc under `docs/`:
   - how capture mode works
   - where to tune typography tokens
   - where to tune pagination thresholds
4) Add a short QA checklist under `docs/testing/` for manual PDF review.
5) Run typecheck/lint and summarize changed files + rationale.

Acceptance:
- Export remains one-click and stable.
- No regressions in mode-based section selection.
- Maintainer docs are clear and short.
- Typecheck/lint pass.

Constraints:
- Avoid large-scale architecture changes.
- Keep output focused and practical for handoff.
```

---

## Suggested Execution Notes

- Give the agent only the prompt for the current phase, not all three at once.
- After each phase, review diff and generated PDF pages before moving on.
- If phase output is too broad, ask agent to reduce scope to touched files only.

