# Alignment Advantage — PDF Export Parity Agent Prompts

Copy **one prompt block per agent session**. Run in order: Agent 1 → 2 → 3 → 4.

Each prompt is sized for a ~200k-context model: enough repo context to execute without loading the whole monorepo, without packing multiple phases into one session.

**Before any agent starts:**

```bash
git checkout feature/aa-pdf-export-parity
```

**Read first (every agent):**

- `docs/AA_PDF_EXPORT_PARITY_BRIEF.md`

**Global rules (every agent):**

- Minimal diff — only files required for this task
- Match AA naming/imports/styling (`C` from `shared/constants.ts`)
- TypeScript: no `any`, no non-null assertions (`!`), no `as unknown as T`
- Strings: double quotes; prefer templates / `.join()` over `+`
- Do not commit, push, or merge unless the human explicitly asks
- Do not run `npm start` (human likely already has a server). Prefer `npx tsc --noEmit` for verification
- Preserve Puppeteer contract on the print page: `data-pdf-loading`, `data-pdf-error`, `data-pdf-render-ready="true"`, and skip auto-`window.print()` when `puppeteer=1`

---

## Agent 1 — Shared overview + print document recompose

```
# Task: AA PDF parity — shared overview + rewire print document to web chapters

## Branch
feature/aa-pdf-export-parity

## Read first
- docs/AA_PDF_EXPORT_PARITY_BRIEF.md (Problem, Locked decisions, Target architecture, Option A)

## Goal
Stop rendering the old parallel Print* playbook body. The print route must compose the same report body as the in-app viewer (minus DocumentViewerLayout chrome), using brand tokens from C.

This agent does NOT expand all 12 Execution Playbook months yet (Agent 2). It is OK if ChapterExecutionPlaybook still shows the interactive single-month UI for now — just mount it so structure/order matches web.

## Current state (important)
- In-app: src/pages/alignment-advantage/index.tsx
  - Overview/cover is INLINE in the page (section id="cover")
  - Then ChapterDecisionFramework, ChapterCoreDesign, ChapterWealthAcceleration, ChapterStakeholderIntelligence, ChapterExecutionPlaybook
- Print: src/components/alignment-advantage/print/AlignmentAdvancePrintDocument.tsx
  - Still mounts PrintCoverPage, PrintTableOfContents, PrintExecutiveSummary, PrintDecisionFramework, PrintStructureProfile, PrintWealthBlueprint, … etc.
- Data hook already shared: useAlignmentAdvantageData
- Print profile fetch: fetchPrintProfile + pdfToken session handling — KEEP this auth/loading flow

## Locked product rules for this task
- Option A strict content: do NOT keep TOC, PrintExecutiveSummary, PrintIdealCollaborator, PrintAppendixChart, CompactTimingTable, old PrintCoverPage
- Visual source of truth = web chapters + C tokens (navy/coral/cream), not purple/Inter print aesthetic
- Keep data-pdf-render-ready / loading / error attributes working

## Files to read (required)
- docs/AA_PDF_EXPORT_PARITY_BRIEF.md
- src/pages/alignment-advantage/index.tsx
- src/components/alignment-advantage/print/AlignmentAdvancePrintDocument.tsx
- src/components/alignment-advantage/print/printStyles.ts
- src/components/alignment-advantage/data/useAlignmentAdvantageData.ts
- src/components/alignment-advantage/shared/constants.ts
- Chapter components under src/components/alignment-advantage/chapters/ (imports + props only — do not redesign them)

## Files to change
1. Extract the Overview/cover block from index.tsx into a shared component, e.g.:
   - src/components/alignment-advantage/chapters/ChapterOverview.tsx
   Props should include whatever the inline cover already needs (profile name, chartData, strategicData, structure labels/formation, signalHex, etc.). Keep visuals identical.
2. Update src/pages/alignment-advantage/index.tsx to use ChapterOverview (no visual regression).
3. Rewrite the SUCCESS body of AlignmentAdvancePrintDocument.tsx to render, in order:
   - ChapterOverview
   - ChapterDecisionFramework (same props derivation as index.tsx)
   - ChapterCoreDesign
   - ChapterWealthAcceleration
   - ChapterStakeholderIntelligence
   - ChapterExecutionPlaybook
4. Update printStyles.ts enough that the print root uses C-compatible cream/navy colors (remove reliance on the old purple playbook look for the document chrome). Full A4 polish is Agent 3 — do not over-invest in page-break micro-tuning here.
5. Do NOT delete Print* section files yet (Agent 4 cleanup). Just stop importing/using them from the print document.

## Requirements
1. Print page must NOT use DocumentViewerLayout / CommandCentre shell / sidebar.
2. Preserve existing pdfToken auth + fetchPrintProfile + loading/error UX.
3. Preserve auto window.print() on browser preview, but NOT when searchParams puppeteer=1.
4. Ready marker: data-pdf-render-ready="true" only when profile + aa data are loaded successfully.
5. Derive STRUCTURE_LABELS / FORMATION_PROFILES / PHASE_DISPLAY / signalHex the same way index.tsx does so chapter props match.
6. No changes to server/ Puppeteer code unless absolutely required for the ready selector (should not be needed).

## Out of scope
- Execution Playbook 12-month expansion (Agent 2)
- Detailed @media print page-break polish on ReportSheet (Agent 3)
- Restoring Download Playbook buttons (Agent 4)
- Deleting Print* files (Agent 4)

## Verification
- npx tsc --noEmit
- Manually (if app already running): /alignment-advantage still looks the same
- /print/alignment-advantage?pdfToken=<session> shows web-like chapters (overview through people + playbook shell), not the old TOC/purple cover playbook
- Inspect DOM: data-pdf-render-ready appears when loaded

## Deliverable
Short summary of files changed, any follow-ups for Agent 2/3, and confirmation that old Print* imports were removed from AlignmentAdvancePrintDocument.
```

---

## Agent 2 — Execution Playbook print mode (all 12 months)

```
# Task: AA PDF parity — Execution Playbook print mode with all 12 months expanded

## Branch
feature/aa-pdf-export-parity

## Read first
- docs/AA_PDF_EXPORT_PARITY_BRIEF.md (Locked decisions: all 12 months expanded)
- Assume Agent 1 already rewired /print/alignment-advantage to mount ChapterExecutionPlaybook

## Goal
In-app Execution Playbook stays interactive (month grid selects one briefing).
PDF/print must show the shared header content (macro trajectory + phase banner + month grid as a non-interactive legend/summary) AND then render the monthly briefing content for ALL 12 months (Jan–Dec), visually matching the single-month briefing block used in the app.

## Files to read (required)
- src/components/alignment-advantage/chapters/ChapterExecutionPlaybook.tsx
- src/components/alignment-advantage/shared/MonthGrid.tsx
- src/utils/forecast/alignmentAdvantage/executionPlaybookData.ts (PALACE_MONTH_DATA, PALACE_GUIDANCE_DATA, SEASON_STYLES)
- src/utils/destiny-navigator/palace-resolver.ts (getPalaceForAspectLiuMonth usage pattern)
- Where print document mounts the chapter: src/components/alignment-advantage/print/AlignmentAdvancePrintDocument.tsx

## Files to change
Primary:
- src/components/alignment-advantage/chapters/ChapterExecutionPlaybook.tsx
Optional if needed for clean API:
- src/components/alignment-advantage/shared/MonthGrid.tsx (e.g. disable clicks when print)
- AlignmentAdvancePrintDocument.tsx (pass mode="print" or equivalent)

## Design
1. Add an explicit mode prop, e.g. mode?: "interactive" | "print" with default "interactive".
2. interactive (default):
   - Keep current useState selectedMonthIndex behavior
   - MonthGrid remains clickable
   - Subtitle can keep “Select any month…”
3. print:
   - Do not rely on click interaction
   - Render MonthGrid as display-only (no onSelect / pointer events), still showing signal colors for the year
   - After the shared header (timeline + phase banner + month grid), loop months 0..11 and render each briefing block
   - Each month briefing should reuse the SAME content structure as the current selected-month block:
     Monthly Briefing header, Capacity Allocation bars, Executive Action (max 3), Risk Mitigation (max 3), Strategic Reflection (max 2)
   - Cap list lengths exactly as web already does (3 / 3 / 2)
   - If a palace has missing mData/gData, show the same “Briefing unavailable” fallback for that month only
4. Page-break friendly: add a stable className or data attribute on each month briefing wrapper so Agent 3 can attach break-before rules (e.g. data-aa-print-month="0"). Do not invent a second visual design system.
5. Update subtitle in print mode so it does not say “Select any month”.

## Requirements
1. No visual redesign of briefing cards — parity with interactive month detail.
2. Do not reintroduce Win Metrics (removed in Kheli batch 1).
3. Do not bring back PrintMonthlyDeepDive / CompactTimingTable as the content source — derive from the same PALACE_* data the web chapter uses.
4. Keep TypeScript strict (no any / no !).
5. Interactive mode must remain unchanged for /alignment-advantage.

## Out of scope
- Full print CSS overhaul (Agent 3)
- Export button restore / Print* deletion (Agent 4)
- Changing timing calculation formulas

## Verification
- npx tsc --noEmit
- /alignment-advantage: month picker still switches a single briefing
- /print/alignment-advantage: Execution Playbook contains 12 monthly briefing sections in calendar order
- Confirm Executive Action / Risk Mitigation / Reflection caps still 3 / 3 / 2

## Deliverable
Summary of the mode API, files touched, and how print mounts mode="print".
```

---

## Agent 3 — Print CSS and A4 page-break polish

```
# Task: AA PDF parity — print CSS + A4 page-break polish for shared chapters

## Branch
feature/aa-pdf-export-parity

## Read first
- docs/AA_PDF_EXPORT_PARITY_BRIEF.md (Success criteria, Puppeteer notes)
- Assume Agents 1–2 are done: print document composes web chapters; Execution Playbook print mode expands 12 months

## Goal
Make the print/PDF layout read as the in-app report on A4: correct cream/navy/coral, avoid clipping, avoid huge empty pages, and place sensible page breaks between major sections and between monthly briefings.

Do NOT redesign chapter content. This is layout/print CSS work.

## Files to read (required)
- src/components/alignment-advantage/print/printStyles.ts
- src/components/alignment-advantage/print/AlignmentAdvancePrintDocument.tsx
- src/components/alignment-advantage/shared/ReportSheet.tsx
- src/components/alignment-advantage/shared/constants.ts
- Chapter roots: ChapterOverview (or equivalent), ChapterDecisionFramework, ChapterCoreDesign, ChapterWealthAcceleration, ChapterStakeholderIntelligence, ChapterExecutionPlaybook
- server/src/pdf/renderPdf.ts (only to confirm wait selector + pdf margins — do not change unless broken)

## Files to change
Likely:
- src/components/alignment-advantage/print/printStyles.ts
- Light className / data-attribute hooks on chapter roots or ReportSheet if needed for break rules
- Possibly AlignmentAdvancePrintDocument.tsx wrapper padding

Avoid large Tailwind rewrites inside chapter business logic.

## Requirements
1. @page A4 with margins compatible with server pdf() margins (see renderPdf / existing printStyles). Prefer adjusting CSS, not server, unless necessary.
2. print-color-adjust: exact so coral/navy backgrounds survive PDF.
3. Hide anything that is screen-only chrome if it somehow appears (print-hide class already exists).
4. Page breaks:
   - Prefer break-before between major chapters (overview → decision → design → wealth → people → timing)
   - Prefer break-before between each Execution Playbook month block (use data-aa-print-month from Agent 2 if present)
   - Use break-inside: avoid on small cards where safe; do not force avoid on very tall sections (that causes overflow blank pages)
5. Soften web-only flourishes that waste PDF space if needed: excessive drop shadows, huge rounded-[40px] outer shells, sticky/fixed behavior. Prefer print overrides in printStyles over rewriting components.
6. Keep max content width readable on A4 (~ same as current print-root max-width approach).
7. Do not reintroduce old purple playbook typography utilities as the primary look.

## Out of scope
- Content changes / copy edits
- Re-enabling export buttons
- Deleting unused Print* files
- html2canvas result-page PDF pipeline

## Verification
- npx tsc --noEmit
- Browser print preview on /print/alignment-advantage?pdfToken=…:
  - chapters paginate cleanly
  - 12 month briefings each start on a sensible page boundary when possible
  - colors preserved
  - no sidebar/app chrome
- Spot-check that interactive /alignment-advantage layout is unchanged on screen

## Deliverable
Notes on which selectors control breaks, any known remaining PDF quirks, files modified.
```

---

## Agent 4 — Restore export UI + delete dead print sections

```
# Task: AA PDF parity — restore Download/Print Preview + remove dead Print* code

## Branch
feature/aa-pdf-export-parity

## Read first
- docs/AA_PDF_EXPORT_PARITY_BRIEF.md (Success criteria)
- git show 588d61c -- src/pages/alignment-advantage/index.tsx
  (reference for the previously removed Download Playbook / Print Preview footerActions)

## Goal
1) Restore export actions on the AA viewer now that print parity exists.
2) Delete unused parallel print section/primitives that are no longer imported.
3) Leave the print route entrypoint + AlignmentAdvancePrintDocument + printStyles + any still-used primitives.

## Files to read (required)
- src/pages/alignment-advantage/index.tsx
- src/components/layout/DocumentViewerLayout.tsx (footerActions prop)
- src/utils/pdfExportServer.ts (exportPdfViaServer, resolvePrintPageOrigin)
- src/components/alignment-advantage/print/AlignmentAdvancePrintDocument.tsx (confirm current imports)
- src/components/alignment-advantage/print/sections/index.ts
- git history snippet from 588d61c for the exact previous button UX

## Files to change
1. Restore handleDownloadPlaybook + handlePrintPreview on index.tsx (same behavior as before hide):
   - Auth via supabase.auth.getSession()
   - target URL: `${resolvePrintPageOrigin()}/print/alignment-advantage?pdfToken=<token>`
   - Download uses exportPdfViaServer(..., `Alignment-Advantage-${name}.pdf`)
   - Preview uses window.open
   - Loading/disabled state on download button
   - Alerts via useAlertContext on errors
2. Pass footerActions back into DocumentViewerLayout (match prior coral Download + muted Print Preview styling).
3. Grep the repo for imports of old Print* modules. Delete only files that are unused after Agent 1:
   Typical candidates under src/components/alignment-advantage/print/sections/:
   - PrintCoverPage, PrintTableOfContents, PrintExecutiveSummary, PrintDecisionFramework,
     PrintStructureProfile, PrintWealthBlueprint, PrintRevenueStrategy, PrintPhaseAlignment,
     PrintActionPlan, PrintIdealCollaborator, PrintStakeholderIntel, PrintDayunCycle,
     PrintRiskMitigation, PrintMonthlyDeepDive, PrintReflectionQuestions, PrintAppendixChart
   And unused primitives if nothing imports them (OrnamentalDivider, ChapterOpener, etc.) — ONLY if unused.
4. Update sections/index.ts barrel (or remove it if empty/unused).
5. Do NOT delete AlignmentAdvancePrintDocument.tsx, printStyles.ts, or pages/print/AlignmentAdvancePrint.tsx.

## Requirements
1. Do not change feature-flag gating (hasAlignmentAdvantage).
2. Do not commit.
3. If a Print* file is still imported anywhere, do not delete it — stop and report.
4. Keep TypeScript strict; remove dead imports from index.tsx carefully.
5. wealth.tsx copy that mentions downloading from Command Centre can stay or be lightly updated only if clearly wrong after restore — optional, minimal.

## Verification
- npx tsc --noEmit
- rg / grep: no broken imports to deleted Print* files
- /alignment-advantage shows Download Playbook + Print Preview again
- Print Preview opens print route
- Download path calls exportPdfViaServer only when REACT_APP_PDF_SERVICE_URL is configured (existing behavior — do not invent a new fallback)

## Deliverable
- List of restored UI behavior
- List of deleted files
- Confirmation print route still works
- Any leftover dead code you intentionally kept (with reason)
```

---

## Suggested handoff notes for the human

1. Paste **Agent 1** first; wait until print route shows web chapters before starting Agent 2.
2. After Agent 2, scroll the print page and confirm 12 month headings exist before Agent 3 tunes breaks.
3. Agent 4 last — restoring export before parity makes bad PDFs easy to ship again.
4. If an agent runs long, do not merge phases; open a fresh session with the next prompt and point it at the brief + prior deliverable summary.
