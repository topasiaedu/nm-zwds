# Alignment Advantage — PDF Export Parity Brief

**Branch:** `feature/aa-pdf-export-parity` (cut from `staging`)  
**Status:** Planning / ready for implementation  
**Related prompts:** [`AA_PDF_EXPORT_PARITY_AGENT_PROMPTS.md`](./AA_PDF_EXPORT_PARITY_AGENT_PROMPTS.md)  
**Wiki source of truth:** [`wiki/alignment-advantage.md`](../wiki/alignment-advantage.md)

---

## Problem

The in-app Alignment Advantage report (`/alignment-advantage`) and the exported PDF (`/print/alignment-advantage` via Puppeteer) do **not** look or read like the same product.

Users see the coral/navy cream report chapters in the Document Viewer. The PDF still renders an older parallel “Strategic Playbook” print tree with different structure, typography, accents, and section inventory.

Export buttons were recently **hidden** on staging (`588d61c`) because shipping the mismatched PDF was worse than no export. This work restores parity, then re-enables download/preview.

---

## Locked product decisions

| Decision | Choice | Meaning |
|----------|--------|---------|
| Content parity | **Option A — strict** | PDF contains only what the in-app report shows. No print-only TOC, no separate Ideal Collaborator page, no executive-summary-only layout, no appendix chart unless it already appears in the web report. |
| Execution Playbook | **All 12 months expanded** | PDF must print every month’s briefing (not only the currently selected month). In-app keeps the interactive month picker. |
| Visual source of truth | **In-app chapters** | Brand tokens from `shared/constants.ts` (`C`: navy, coral, cream, gold). Do not preserve the old purple/Inter print aesthetic. |
| Architecture | **Reuse chapter components** | Do not keep restyling the parallel `print/sections/Print*` tree as the long-term path. Print route composes the same chapters (with a print mode where needed). |

---

## Current architecture (as of staging)

### In-app report

| Piece | Location |
|-------|----------|
| Route | `/alignment-advantage` |
| Page | `src/pages/alignment-advantage/index.tsx` |
| Shell | `DocumentViewerLayout` (sidebar nav — **not** for PDF) |
| Data | `useAlignmentAdvantageData(profile)` |
| Chapters | Overview (inline) → `ChapterDecisionFramework` → `ChapterCoreDesign` → `ChapterWealthAcceleration` → `ChapterStakeholderIntelligence` → `ChapterExecutionPlaybook` |
| Brand | `src/components/alignment-advantage/shared/constants.ts` → `C` |

### PDF / print path

| Piece | Location |
|-------|----------|
| Route | `/print/alignment-advantage` |
| Entrypoint | `src/pages/print/AlignmentAdvancePrint.tsx` |
| Document | `src/components/alignment-advantage/print/AlignmentAdvancePrintDocument.tsx` |
| Sections | `src/components/alignment-advantage/print/sections/Print*.tsx` (parallel UI) |
| Styles | `src/components/alignment-advantage/print/printStyles.ts` |
| Export helper | `exportPdfViaServer` + `resolvePrintPageOrigin` in `src/utils/pdfExportServer.ts` |
| Server wait | Puppeteer waits for `[data-pdf-render-ready="true"]` (`server/src/pdf/renderPdf.ts`) |

Removed UI (to restore after parity):

- `Download Playbook` / `Print Preview` footer actions on `DocumentViewerLayout` (deleted from `index.tsx` in `588d61c`)

---

## Target architecture

```
/alignment-advantage          /print/alignment-advantage
        │                              │
        ▼                              ▼
 DocumentViewerLayout          Print shell (auth, ready flag,
 (sidebar + chrome)             print CSS, page breaks)
        │                              │
        └──────────┬───────────────────┘
                   ▼
         Shared chapter components
         (+ cover/overview extract)
                   │
                   ▼
         ChapterExecutionPlaybook
           mode="interactive" | "print"
           print → all 12 month briefings
```

### Required PDF body order (Option A)

1. Overview / cover content (same chips, archetype strip, mini grid as web)
2. Strategic Filter (`ChapterDecisionFramework`)
3. Founder’s Blueprint (`ChapterCoreDesign`)
4. Wealth Acceleration (`ChapterWealthAcceleration`)
5. People Intel (`ChapterStakeholderIntelligence`)
6. Execution Playbook (`ChapterExecutionPlaybook` in print mode — timeline + phase banner + **12 monthly briefings**)

### Explicitly out of PDF (Option A)

- `PrintTableOfContents`
- `PrintExecutiveSummary` as a separate redesigned page
- `PrintIdealCollaborator` standalone page
- `PrintAppendixChart` / full `ZWDSChart` appendix
- `PrintCoverPage` navy/purple full-bleed cover (replace with web overview look)
- Worksheet-style blank “Decision on the Table” checkboxes from `PrintDecisionFramework` (web filter is the source of truth)

Old `Print*` files may remain temporarily unused until the cleanup agent deletes them.

---

## Root cause

Web and print were built as **two UI trees** that share some helpers (`TwelvePalaceMiniGrid`, people guidance, data hook) but diverge on layout, copy framing, and chapter inventory. Wiki already requires **web/print parity**; batch-1 Kheli fixes mostly landed on web with only partial print mirrors.

---

## Implementation phases (summary)

Detailed agent prompts live in `AA_PDF_EXPORT_PARITY_AGENT_PROMPTS.md`. Run in order.

| Phase | Goal |
|-------|------|
| 1 | Extract shared overview; rewire print document to compose web chapters; keep auth + `data-pdf-render-ready` |
| 2 | Add Execution Playbook `print` mode with all 12 months expanded |
| 3 | Print CSS / page-break polish so A4 output matches the report sheets |
| 4 | Re-enable Download + Print Preview; delete dead `Print*` sections |

---

## Non-goals

- Changing AA feature-flag / tier gating
- Redesigning the in-app report look
- Migrating away from the Puppeteer PDF microservice
- Fixing chart result-page PDF capture (`html2canvas`) — different pipeline
- Reintroducing People Strategy / Archetype Profile / Win Metrics removed in Kheli batch 1

---

## Coding constraints (all agents)

- Branch: `feature/aa-pdf-export-parity`
- TypeScript: no `any`, no non-null assertions (`!`), no `as unknown as T`
- Strings: double quotes
- Prefer string templates or `.join()` over `+` concatenation
- Match existing AA patterns (`C` tokens, `ReportSheet`, chapter file layout)
- Minimal diffs — no drive-by refactors
- Do **not** commit, push, or merge unless the human explicitly asks
- Do **not** run `npm start` / `npm run build` if a local server is already running for the human; prefer `npx tsc --noEmit` for typecheck when verification is needed
- Preserve Puppeteer contract: loading/error states use `data-pdf-loading` / `data-pdf-error`; success uses `data-pdf-render-ready="true"`; honor `?puppeteer=1` (do not auto `window.print()` in that mode)

---

## Success criteria

1. Opening `/print/alignment-advantage?pdfToken=…` shows the same chapter content and visual language as `/alignment-advantage` (minus app shell).
2. PDF includes all 12 monthly Execution Playbook briefings.
3. No Option-B extras (TOC, ideal collaborator page, appendix chart).
4. Download Playbook + Print Preview restored and working against the print route.
5. Old unused parallel print sections removed (or clearly deleted in cleanup).
6. Typecheck clean for touched files; no new linter errors in touched files.

---

## Manual verification checklist

- [ ] `/alignment-advantage` unchanged in interactive behavior (month picker still works)
- [ ] `/print/alignment-advantage?pdfToken=…` loads with ready flag when data is present
- [ ] Overview chips / wealth strip / mini grid match web
- [ ] Strategic Filter, Blueprint, Wealth, People match web content
- [ ] Execution Playbook print shows Jan–Dec briefings
- [ ] Download Playbook produces a multi-page PDF that looks like the viewer
- [ ] Print Preview opens the print route in a new tab
- [ ] Puppeteer path still waits on `data-pdf-render-ready`

---

## Reference commits / history

- `a508497` — original Strategic Playbook PDF + portal pages
- `588d61c` — hide AA export buttons + alignment tier
- Wiki: `wiki/alignment-advantage.md` (web/print parity principle)
- Prior print inventory: `src/components/alignment-advantage/print/`
