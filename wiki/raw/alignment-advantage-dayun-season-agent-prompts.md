# Alignment Advantage — Dayun Season Chapter — Agent Prompts

Copy **one** prompt block per agent session.  
Tasks are sized for a ~200k context model: enough file pointers and requirements to execute without loading the whole monorepo, without packing an entire product redesign into one session.

**Read first (both agents):**  
`wiki/raw/alignment-advantage-dayun-season-spec.md`

**Also useful:**  
`wiki/alignment-advantage.md` (AA design principles + chapter map)

**Code principles:**
- Minimal diff — only files required for the task
- Match existing AA patterns (`C` tokens, `ReportSheet`, `SectionHeader`, Georgia titles)
- Strict TypeScript: no `any`, no non-null assertions (`!`), no `as unknown as T`
- Double-quoted strings; JSDoc on new exported components
- Do **not** commit, push, or merge unless the user explicitly asks
- Do **not** run `npm start` (dev server may already be running). Prefer targeted typecheck/lint on touched files. Run `npm run build` only if the user asks.
- Do **not** remove Dayun from the Founder report

**Order:** Agent 1 → Agent 2 (Agent 2 depends on the new chapter existing).

---

## Agent 1 — Build AA-native `ChapterDayunSeason` (full five blocks)

```
# Task: Alignment Advantage — Build ChapterDayunSeason (AA-restyled full Dayun stack)

## Spec (required reading)
Read end-to-end:
- wiki/raw/alignment-advantage-dayun-season-spec.md

Skim for design tokens / patterns:
- wiki/alignment-advantage.md (design principles, chapter map)
- src/components/alignment-advantage/shared/constants.ts (C tokens)
- src/components/alignment-advantage/shared/ReportSheet.tsx
- src/components/alignment-advantage/shared/SectionHeader.tsx
- src/components/alignment-advantage/chapters/PhaseWealthAlignmentSheet.tsx (hero + WhatToDoNowList + watch card patterns)
- src/components/alignment-advantage/shared/WhatToDoNowList.tsx
- src/components/alignment-advantage/shared/PhaseCycleGrid.tsx
- src/components/alignment-advantage/shared/phaseWealthVisuals.tsx (SeasonPhaseSvg, resolvePhaseKey, PHASE_LABELS)
- src/components/alignment-advantage/data/types.ts (StrategicData.dayun)

## Source content to port (logic + fields, NOT styling)
Read these Founder/Dayun files to understand the five blocks and field usage:
- src/components/dayun/DayunSection.tsx
- src/components/dayun/DayunSeasonHero.tsx
- src/components/dayun/CycleTimeline.tsx
- src/components/dayun/PhaseIntensityChart.tsx
- src/components/dayun/DayunGuidanceCards.tsx
- src/components/dayun/ReflectionQuestions.tsx
- src/utils/dayun/seasonMapper.ts (PHASE_LABELS, SEASON_TITLES)
- src/types/dayun.ts (DayunCycleExtended)

## Goal
Create a new Alignment Advantage chapter component that presents the FULL Dayun season analysis (all five blocks) in AA design language.

Do NOT import/render the existing Dayun* presentational components unchanged.
Do NOT touch Founder report files.
Do NOT wire the chapter into the page or print document yet (Agent 2 does that).

## Create
Primary file:
- src/components/alignment-advantage/chapters/ChapterDayunSeason.tsx

Props:
- strategicData: StrategicData (from ../data/types)
- Use strategicData.dayun (DayunCycleExtended | null). Guidance is already generated in useAlignmentAdvantageData.

If dayun is null: render ReportSheet + SectionHeader + a calm “Data unavailable” style message. Do not throw.

Suggested SectionHeader copy (from spec):
- chapter: "Chapter 03 · Dayun Season"
- title: "Your 10-Year Phase"
- subtitle: "Where you are in the decade cycle, what to prioritize, and what to watch."
- graphicType: "timing" is fine (clock motif already exists in SectionGraphic)

Root wrapper:
- outer div id="dayun" className="scroll-mt-16 mb-8" (id is required for sidebar scroll spy later)
- wrap content in ReportSheet (watermark "timeline" or "compass" is fine)

## Required blocks (all five)

### 1) Phase hero (replaces DayunSeasonHero)
Show phase label via PHASE_LABELS / resolvePhaseKey (Expansion / Visibility / Consolidation / Foundation — NOT "SPRING SEASON" + emoji).
Include: seasonTitle, coreMessage, palace + palaceChinese, startYear–endYear, progress (year in cycle + %).
Use SeasonPhaseSvg / PhaseCycleGrid patterns and phase accent colors from the spec:
- expansion #16a34a, visibility C.coral, consolidation #d97706, foundation #2563eb

### 2) Cycle journey (replaces CycleTimeline)
Previous / current / next from previousCycle, current, nextCycle.
AA stepped cards or list; mark current clearly; phase labels not emojis.

### 3) Intensity curve (replaces PhaseIntensityChart)
Preserve the intensity value table and years 1–5 vs 6–10 messaging logic from PhaseIntensityChart.tsx.
Restyle with AA colors (phase accent or C.coral/C.navy). Keep Recharts AreaChart if already used in that file.
Fixed chart height suitable for report + print.

### 4) Guidance (replaces DayunGuidanceCards)
Two columns:
- What To Do This Cycle → WhatToDoNowList (or identical pattern) using dayun.keyActions
- Watch Out For → coral-tinted watch card pattern from PhaseWealthAlignmentSheet using dayun.watchOut
Show full lists (do not invent arbitrary caps unless empty-safe).

### 5) Reflection (replaces ReflectionQuestions)
Always expanded (NO accordion / click-to-open).
Style like Execution Playbook Strategic Reflection (italic quote + coral left border) using dayun.reflectionQuestions.

## Hard constraints
- Match AA visual language (C tokens, Georgia titles, cream sheets). No Founder orange pulse header.
- No emoji season icons as the primary visual.
- Strict TS: no any, no !, no as unknown as T; double-quoted strings; JSDoc on the exported component.
- Prefer a single ChapterDayunSeason.tsx. Split into sibling files under chapters/ only if the file becomes unreadable (>~500 lines).
- Do not modify src/components/dayun/* or Founder files.
- Do not modify index.tsx or AlignmentAdvancePrintDocument.tsx in this task.

## Verification
- Ensure the file typechecks in isolation conceptually (imports resolve, props typed).
- Optionally run a targeted check the repo already supports (e.g. tsc) if available; do not npm start.
- Manually re-read the component against the five-block checklist in the spec.

## Deliverable
1. List of files created/modified
2. Brief note on how null dayun is handled
3. Confirm Founder/Dayun presentational components were not reused as-is
```

---

## Agent 2 — Wire chapter into AA web + print + wiki

```
# Task: Alignment Advantage — Wire ChapterDayunSeason into web, print, and wiki

## Spec (required reading)
- wiki/raw/alignment-advantage-dayun-season-spec.md (placement, chapter order, verification)
- Confirm Agent 1 output exists:
  - src/components/alignment-advantage/chapters/ChapterDayunSeason.tsx
  - exported ChapterDayunSeason with id="dayun" on the root section wrapper

## Goal
Insert the new Dayun Season chapter into Alignment Advantage navigation and render order (web + print), renumber Execution Playbook to Chapter 05, and update the wiki chapter map.

Do NOT redesign ChapterDayunSeason in this task unless a tiny prop fix is required to compile.
Do NOT remove or change Founder Wealth Timing Cycle / DayunSection.

## Files to modify

### 1) src/pages/alignment-advantage/index.tsx
- Extend ChapterId union with "dayun"
- Add CHAPTERS entry AFTER wealth and BEFORE people:
  - id: "dayun"
  - label: "Dayun Season"
  - sub: "Ch 03 · 10-Year Phase"
- Add "dayun" to the IntersectionObserver ids array (same order as chapters)
- Import ChapterDayunSeason
- Render <ChapterDayunSeason strategicData={strategicData} /> after ChapterWealthAcceleration and before ChapterStakeholderIntelligence

### 2) src/components/alignment-advantage/print/AlignmentAdvancePrintDocument.tsx
- Import ChapterDayunSeason
- Render it in the same order as the web page (after Wealth, before People)
- Pass strategicData={reportBody.strategicData}
- Keep Execution Playbook mode="print" as today

### 3) src/components/alignment-advantage/chapters/ChapterExecutionPlaybook.tsx
- Confirm SectionHeader chapter string is "Chapter 05 · Execution Playbook"
- Leave Macro Trajectory / phase banner / monthly roadmap intact (overlap with Dayun chapter is acceptable per spec)

### 4) Wiki updates
Update chapter map in:
- wiki/alignment-advantage.md (ingested SoT — chapter map table)
- wiki/raw/alignment-advantage-implementation-record.md (add a short “Dayun Season chapter added” note under shipped/follow-up if that file tracks history)

Also add rows to wiki/INDEX.md raw documents table for:
- raw/alignment-advantage-dayun-season-spec.md
- raw/alignment-advantage-dayun-season-agent-prompts.md
(if not already listed)

If the repo uses wiki ingest (`node scripts/wiki-ingest.mjs`), run it ONLY if the project’s INDEX instructions say ingested pages must be refreshed after raw edits AND the ingest script is expected to rewrite alignment-advantage.md from raw. Prefer manually updating wiki/alignment-advantage.md chapter map so agents do not lose curated SoT content. Do not invent a new ingest pipeline.

## Hard constraints
- Minimal diff focused on wiring + renumber + wiki
- Do not change Dayun calculation utilities
- Do not revive PrintDayunCycle Success Metrics
- Do not commit unless asked
- Do not npm start

## Verification checklist
- CHAPTERS order: cover → decision → design → wealth → dayun → people → timing
- Observer id list matches
- Print body order matches web
- Playbook header says Chapter 05
- Founder report still has Wealth Timing Cycle (spot-check import/usage in founder-report.tsx — do not edit)
- Typecheck/lint clean on touched files

## Deliverable
1. Files modified
2. Final chapter order confirmation (web + print)
3. Any follow-ups (e.g. print CSS tweak needed for intensity chart) called out briefly
```

---

## Optional follow-up (only if Agent 2 notes a print issue)

Not a default agent. Use only if print/PDF smoke shows the intensity chart clipping or creating sparse pages.

```
# Task (optional): AA Dayun Season print polish

## Context
ChapterDayunSeason is wired. Print/PDF shows chart overflow, excessive blank space, or broken keep-together around the intensity curve or guidance columns.

## Files likely involved
- src/components/alignment-advantage/chapters/ChapterDayunSeason.tsx
- src/components/alignment-advantage/print/printStyles.ts

## Requirements
- Prefer data attributes (data-aa-*) + printStyles rules consistent with existing AA print patterns
- Do not redesign web layout unless required for parity
- Do not change Dayun math/guidance content
- Minimal CSS/markup fix; document what you changed

## Deliverable
Before/after notes for the print issue and files touched.
```

---

## Handoff checklist for the human

1. Paste **Agent 1** into a fresh agent session; wait until `ChapterDayunSeason.tsx` exists and looks AA-native.
2. Paste **Agent 2** into a new session on the same branch; wire + wiki.
3. Manually open `/alignment-advantage`, confirm sidebar + scroll, then print preview.
4. Confirm `/founder-report` still shows Wealth Timing Cycle.
5. Commit only when you explicitly ask.
