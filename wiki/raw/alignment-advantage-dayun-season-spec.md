# Alignment Advantage — Add Dayun Season Chapter (Spec)

**Status:** Approved for implementation (not yet shipped)  
**Branch:** work on current `main` (or a feature branch cut from latest `main`)  
**Scope:** Alignment Advantage web report + print/PDF parity  
**Related prompts:** `wiki/raw/alignment-advantage-dayun-season-agent-prompts.md`

---

## Goal

Add the **full Dayun Season Analysis** (the same information stack as Founder Report → Wealth Timing Cycle → `DayunSection`) into the **Alignment Advantage** report as a **new sidebar chapter**, placed **after Wealth Acceleration and before People Intel**.

This is a **content + design port**, not a component dump:

- **Reuse** Dayun calculation / guidance data utilities.
- **Do not** mount Founder chrome or the existing Founder-styled Dayun UI as-is.
- **Rebuild** the five blocks in Alignment Advantage visual language.
- **Keep** the section on the Founder report unchanged (both reports keep it).

---

## Locked product decisions

| # | Decision | Choice |
|---|----------|--------|
| 1 | Placement | **Option A** — new dedicated AA chapter in the sidebar |
| 2 | Scope | **Full stack** — all five Dayun blocks (not hero-only) |
| 3 | Founder report | **Keep** Wealth Timing Cycle / `DayunSection` as-is |

### Chapter order after this change

| Order | Sidebar label | Section `id` | Component |
|------:|---------------|--------------|-----------|
| 1 | Overview | `cover` | `ChapterOverview` |
| 2 | Strategic Filter | `decision` | `ChapterDecisionFramework` |
| 3 | Founder's Blueprint | `design` | `ChapterCoreDesign` |
| 4 | Wealth Acceleration | `wealth` | `ChapterWealthAcceleration` |
| 5 | **Dayun Season (NEW)** | **`dayun`** | **`ChapterDayunSeason` (NEW)** |
| 6 | People Intel | `people` | `ChapterStakeholderIntelligence` |
| 7 | Execution Playbook | `timing` | `ChapterExecutionPlaybook` |

Suggested sidebar copy:

- **label:** `Dayun Season`
- **sub:** `Ch 03 · 10-Year Phase`

Renumber People Intel header copy to **Chapter 04**. Execution Playbook stays **Chapter 05**.

---

## Background — what exists today

### Founder Report (source of content)

- Page: `src/pages/founder-report.tsx`
- Section: `src/components/founder-report/WealthTimingCycle.tsx`
- Renders: `<DayunSection chartData={...} showHeader={false} />` under an orange Founder “Wealth Timing Cycle” header

### Dayun data + UI (shared engine)

| Layer | Path | Role |
|-------|------|------|
| Types | `src/types/dayun.ts` | `DayunSeason`, `DayunCycleExtended`, etc. |
| Calculator | `src/utils/dayun/calculator.ts` | `calculateCurrentDayunCycle(chartData)` |
| Guidance | `src/utils/dayun/guidanceGenerator.ts` | `generateDayunGuidance(...)` → actions, watch-outs, reflection, metrics |
| Season map | `src/utils/dayun/seasonMapper.ts` | palace→season, `PHASE_LABELS`, `SEASON_TITLES`, `SEASON_MESSAGES` |
| Container | `src/components/dayun/DayunSection.tsx` | orchestrates the five UI blocks |
| Block 1 | `src/components/dayun/DayunSeasonHero.tsx` | season hero + progress |
| Block 2 | `src/components/dayun/CycleTimeline.tsx` | previous / current / next cycle |
| Block 3 | `src/components/dayun/PhaseIntensityChart.tsx` | 10-year intensity curve (Recharts) |
| Block 4 | `src/components/dayun/DayunGuidanceCards.tsx` | What To Do + Watch Out |
| Block 5 | `src/components/dayun/ReflectionQuestions.tsx` | collapsible questions (Founder/app style) |

### Alignment Advantage (destination)

| Item | Path |
|------|------|
| Wiki SoT | `wiki/alignment-advantage.md` |
| Main page | `src/pages/alignment-advantage/index.tsx` |
| Print document | `src/components/alignment-advantage/print/AlignmentAdvancePrintDocument.tsx` |
| Data hook | `src/components/alignment-advantage/data/useAlignmentAdvantageData.ts` |
| Strategic snapshot | `strategicData.dayun` is already `DayunCycleExtended \| null` (guidance already generated) |
| Design tokens | `src/components/alignment-advantage/shared/constants.ts` → `C` |
| Chapter shell | `ReportSheet` + `SectionHeader` |
| Phase naming | Expansion / Visibility / Consolidation / Foundation via `PHASE_LABELS` / `resolvePhaseKey` |
| Existing timing overlap | Execution Playbook already has Macro Trajectory + phase banner + 12-month roadmap — **do not delete**; new chapter is the deeper 10-year season read |

AA already surfaces Dayun **summary** fragments (overview chips, wealth intersection, playbook phase banner). The new chapter is the **full season analysis**, editorialized for AA.

---

## Design rules (must follow)

From AA wiki + existing chapters:

1. **Report ≠ app** — conclusions and guidance, not interactive tooling.
2. **AA visual language** — navy / coral / cream (`C`), Georgia for titles, soft borders (`C.border`), `rounded-[40px]` sheets, no Founder orange pulse header.
3. **Phase naming in UI** — show **Expansion / Visibility / Consolidation / Foundation**, not “SPRING SEASON” + emoji.
4. **No emojis** as primary season icons — use existing AA SVG motifs (`SeasonPhaseSvg`, `PhaseCycleGrid`, `PhaseSeasonBand`).
5. **Layman English** — keep Dayun guidance text as returned by `generateDayunGuidance` unless a phrase clearly violates AA copy rules (no em dashes in client-facing copy if you edit strings).
6. **Web/print parity** — same chapter component used by in-app viewer and print document (pass a `mode` prop only if needed; prefer one read-only layout that works for both).
7. **Strict TypeScript** — no `any`, no non-null assertions (`!`), no `as unknown as T`, double-quoted strings, JSDoc on new exported components.

### Explicitly do **not** do

- Do **not** remove or gut Founder `WealthTimingCycle` / `DayunSection`.
- Do **not** import and render `DayunSeasonHero`, `CycleTimeline`, `PhaseIntensityChart`, `DayunGuidanceCards`, or `ReflectionQuestions` unchanged inside AA.
- Do **not** revive old `PrintDayunCycle.tsx` Success Metrics (wiki out-of-scope item).
- Do **not** collapse Reflection into a clickable accordion in AA (report should show questions open).
- Do **not** run `npm start` / `npm run build` if the user says a server is already running — prefer `npx tsc --noEmit` or lint on touched files when verifying, unless the user asks for a full build.

---

## Content blocks to ship (full stack)

The new chapter must include **all five** blocks, AA-restyled. Data source: `strategicData.dayun` (already guided). If `dayun === null`, render a quiet unavailable state inside the chapter shell (do not crash).

### Block 1 — Phase hero (replaces `DayunSeasonHero`)

Show:

- Current phase label (`PHASE_LABELS[season]`)
- Phase title / tagline (`seasonTitle` or AA equivalent)
- Core message
- Palace English + Chinese
- Cycle years (`startYear`–`endYear`)
- Progress within cycle (year N of span + percent)

Visual references:

- `PhaseWealthAlignmentSheet.tsx` hero card
- `PhaseCycleGrid.tsx` / `SeasonPhaseSvg`
- Phase accent colors:
  - Expansion → `#16a34a`
  - Visibility → `C.coral`
  - Consolidation → `#d97706`
  - Foundation → `#2563eb`

### Block 2 — Cycle journey (replaces `CycleTimeline`)

Show previous / current / next cycles from `previousCycle` / current / `nextCycle`.

- Mark current with an AA “You are here” / Active treatment
- Use phase labels, not emoji season icons
- Editorial list or stepped cards inside a cream/white sheet — not Founder gradient pills

### Block 3 — Intensity curve (replaces `PhaseIntensityChart`)

Preserve the **same intensity curve logic** (U-shaped year 1–10 values and foundation vs maximize messaging) from `PhaseIntensityChart.tsx`.

- Keep Recharts `AreaChart` if already a project dependency
- Restyle stroke/fill to phase accent or `C.coral` / `C.navy` (not Founder seasonal rainbow unless mapped to AA phase accents)
- Keep years 1–5 vs 6–10 strategic phase callouts, AA typography

### Block 4 — Guidance (replaces `DayunGuidanceCards`)

Two columns:

- **What To Do This Cycle** → prefer `WhatToDoNowList` pattern
- **Watch Out For** → prefer coral-tinted watch card pattern from `PhaseWealthAlignmentSheet`

Use full `keyActions` and `watchOut` arrays from `dayun` (do not arbitrarily cap unless the lists are huge; Founder shows full lists).

### Block 5 — Reflection (replaces `ReflectionQuestions`)

- Always **expanded** (no accordion)
- Style like Execution Playbook “Strategic Reflection” (italic quotes, coral left border) or equivalent AA editorial list
- Use `dayun.reflectionQuestions`

---

## File plan

### Create

| File | Purpose |
|------|---------|
| `src/components/alignment-advantage/chapters/ChapterDayunSeason.tsx` | New chapter shell + five AA-styled blocks (may split private subcomponents in the same file or sibling files under `chapters/` / `shared/` if the file gets huge) |

Optional (only if the chapter file exceeds ~400–500 lines and readability suffers):

- `src/components/alignment-advantage/chapters/dayun/DayunPhaseHero.tsx`
- `.../DayunCycleJourney.tsx`
- `.../DayunIntensityCurve.tsx`
- `.../DayunCycleGuidance.tsx`
- `.../DayunReflection.tsx`

Prefer **one chapter file first**; split only if necessary.

### Modify

| File | Change |
|------|--------|
| `src/pages/alignment-advantage/index.tsx` | Add chapter to `CHAPTERS`, `ChapterId`, IntersectionObserver id list, render `<ChapterDayunSeason />` after Wealth / before People |
| `src/components/alignment-advantage/print/AlignmentAdvancePrintDocument.tsx` | Render the same chapter in the same order |
| `src/components/alignment-advantage/chapters/ChapterExecutionPlaybook.tsx` | Bump section header from Chapter 04 → Chapter 05 |
| `wiki/raw/alignment-advantage-dayun-season-spec.md` | This spec (already) |
| `wiki/alignment-advantage.md` and/or raw implementation record | Update chapter map after ship (Agent 2) |

### Do not modify (for this feature)

- `src/components/founder-report/WealthTimingCycle.tsx` (keep)
- `src/components/dayun/*` Founder/result Dayun UI (leave for Founder / result page)
- `src/utils/dayun/*` unless a tiny shared helper is truly needed (prefer reading existing helpers)

---

## Data wiring

Preferred prop shape (match other chapters):

```ts
interface ChapterDayunSeasonProps {
  strategicData: StrategicData; // from ../data/types — includes dayun: DayunCycleExtended | null
}
```

`chartData` is **not required** if everything comes from `strategicData.dayun`. Only add `chartData` if you need palace lookups beyond the guided cycle object.

`useAlignmentAdvantageData` already:

1. `calculateCurrentDayunCycle(chartData)`
2. `generateDayunGuidance(rawDayun)`
3. stores result on `strategicData.dayun`

Do not re-compute unless print/web paths diverge (they should not).

---

## Print / PDF notes

- Print uses the same chapter components as the web viewer (`AlignmentAdvancePrintDocument.tsx`).
- Use `ReportSheet` so existing `printStyles.ts` sheet fragmentation rules apply.
- Avoid interactive-only UI (no month pickers, no collapse toggles).
- Intensity chart: ensure it has a fixed height and does not explode print layout; follow Recharts usage already present in the repo.
- After implementation, smoke-check `/print/alignment-advantage` chapter order includes Dayun before Execution Playbook.

---

## Copy / naming suggestions

| Surface | Suggested copy |
|---------|----------------|
| Sidebar label | `Dayun Season` |
| Sidebar sub | `Ch 03 · 10-Year Phase` |
| `SectionHeader.chapter` | `Chapter 03 · Dayun Season` |
| `SectionHeader.title` | `Your 10-Year Phase` |
| `SectionHeader.subtitle` | `Where you are in the decade cycle, what to prioritize, and what to watch.` |
| People header | `Chapter 04 · People Intelligence` |
| Playbook header | `Chapter 05 · Execution Playbook` |

---

## Verification checklist

- [ ] `/alignment-advantage` sidebar shows Dayun Season between Wealth and People Intel
- [ ] Scroll spy / active chapter highlights `dayun`
- [ ] All five blocks render when `strategicData.dayun` is present
- [ ] Null dayun shows a calm unavailable state
- [ ] Visual language matches AA (no Founder orange pulse, no emoji season heroes)
- [ ] Phase labels use Expansion / Visibility / Consolidation / Foundation
- [ ] Print document includes the chapter in the same order
- [ ] Founder report Wealth Timing Cycle still present and unchanged
- [ ] Typecheck / lint clean on touched files
- [ ] Wiki chapter map updated after ship

---

## Agent split

See `wiki/raw/alignment-advantage-dayun-season-agent-prompts.md`:

| Agent | Owns |
|-------|------|
| **Agent 1** | Build `ChapterDayunSeason` (full five-block AA UI) |
| **Agent 2** | Wire into web + print, renumber Playbook, update wiki |

Run **Agent 1 first**, then **Agent 2**.
