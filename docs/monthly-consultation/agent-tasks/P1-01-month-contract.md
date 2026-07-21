# P1-01 — Month contract on page 1

**Agent brief.** You are adding a **month contract** to the cover (page 1): primary move, deadline, success measure, anti-pattern. Priority / vibe alone is not enough for a ~$50 consultation feel.

**Backlog map:** `MONTHLY_REPORT_FEEDBACK.md` → Must-have **P5** (called **P1-01** in this agent series).

**Assumes:** P0 trust fixes are done or in tree (empty stars, distinct scorecard drivers, chart-tied aspect actions). Do **not** undo P0. Do not redesign the report chrome.

**Read first:** this file, then the cited functions only.

---

## Goal

Page 1 (cover) states a clear **plan**: one primary move, one deadline, one success measure, one anti-pattern — scannable, month-specific, English-only.

## Acceptance criteria

- [ ] Cover shows all four fields: **primary move**, **deadline**, **success measure**, **anti-pattern** (labels can vary; meaning must match).
- [ ] Fields are **data-driven** from this month’s palace / failure exit / guidance / season — not static marketing copy identical for every palace.
- [ ] Existing cover meta (Focus, Season, Priority, Decade, Year, Area) and “Active this month” remain; contract **adds** plan clarity, does not replace the month spine.
- [ ] `briefing.primaryGoal` (or successor) stays coherent with the contract (same move language; avoid two conflicting “one move” lines).
- [ ] English-only user-facing copy; no em/en dashes; no Chinese in UI strings; no fake rarity %.
- [ ] `npx tsc --noEmit` passes.

## Problem statement

From buyer feedback:

> Cover / How to read — clear priority + one move; **missing success measure / deadline**.

Backlog **P5**: *Month contract on page 1 — primary move, deadline, success measure, anti-pattern* — makes the brief feel like a plan, not only a vibe.

Acceptance checklist: *Page 1 states one move, one deadline, one success measure, one anti-pattern.*

## Exact files / symbols to touch

| Path | What |
| ---- | ---- |
| `src/utils/forecast/monthlyConsultation/types.ts` | Add a small **`MonthContract`** (or equivalent) on `MonthlyConsultationBundle` / fold into `MonthlyBriefingContent`. Suggested fields: `primaryMove`, `deadline`, `successMeasure`, `antiPattern` (all `string`) |
| `src/utils/forecast/monthlyConsultation/contentLibraries.ts` | **`buildPrimaryGoal`** (~797–799) — today: `` `${priority}. One move: ${exitMove}` ``. Add **`buildMonthContract(...)`** (or widen `buildPrimaryGoal`) |
| `src/utils/forecast/monthlyConsultation/buildMonthlyConsultationBundle.ts` | **`loadBriefing`** (~82–98) already has `guidance` with `successMetrics` / `watchOut` from `PALACE_GUIDANCE_DATA`. Wire contract after `buildFailureMode` + `loadBriefing`. Call site in **`buildBundleCore`** (~254–260, return ~320–390) |
| `src/utils/forecast/timing/liuMonthGuidance.ts` | **`PalaceGuidanceData.successMetrics`**, **`watchOut`**; **`PALACE_MONTH_DATA[*].priority`** — prefer first success metric / first watch-out as seeds; optionally tighten copy in builder rather than rewriting whole static tables |
| `src/components/monthly-consultation/chapters/MonthlyConsultationChapters.tsx` | **`ChapterCover`** (~84–148): TipList today is priority + `primaryGoal` + generic how-to-read. Add a clear **Month contract** card (four labeled lines) |
| Print | Same chapter via `MonthlyConsultationBody` → `MonthlyConsultationPrintDocument.tsx` |

**Inputs already on the bundle / builders:**

- `failureMode.exitMove` — best seed for **primary move** (already injected into `primaryGoal`)
- `briefing.priority` — spine (keep)
- `briefing.guidance.successMetrics[0]` — seed for **success measure**
- `briefing.guidance.watchOut[0]` or `failureMode.howItShows[0]` / `failureMode.name` — seed for **anti-pattern**
- Season / failure templates often already encode timing (“Before mid-month…”, “Before week 3…”) — harvest or normalize into a **deadline** string

## Current vs desired behavior

### Current (`ChapterCover`)

- Grid: Focus, Season, Priority, Decade, Year, Area
- TipList: main focus priority + `primaryGoal` (`priority` + exit move) + generic read tips
- No explicit deadline / success measure / anti-pattern block

### Desired

A scannable contract block on cover, for example:

| Field | Example direction (write real copy from data) |
| ----- | ----------------------------------------------- |
| Primary move | Same spine as exit move / `ACTIVATION_MOVE`-aligned one move |
| Deadline | Concrete: “By mid-month” / “Before week 3” / “By day 14” (from exit template or season rule) |
| Success measure | One verifiable outcome from `successMetrics` (shortened, English, no dash characters) |
| Anti-pattern | Named failure trap: what **not** to do (from failure mode / watchOut) |

Keep TipList short if the contract card already covers the move; do not duplicate three conflicting “one move” paragraphs.

## Implementation steps

1. **Add `MonthContract` type** and put it on the bundle (top-level `monthContract` is clearest for `ChapterCover`).
2. **Implement `buildMonthContract`** in `contentLibraries.ts` taking at least: `priority`, `exitMove`, `season`, `guidance.successMetrics`, `guidance.watchOut`, optional `failureMode.name` / `howItShows`.
   - Derive **deadline** with a small rule table by season or by parsing / pairing known exitMove timing phrases — prefer explicit English deadlines, never invent fake dates.
   - Pick **one** success metric and **one** anti-pattern; shorten to one line each.
3. **Call from `buildBundleCore`** after failure mode + briefing exist.
4. **Align `buildPrimaryGoal`** so it still reads as one spine sentence (or set `primaryGoal` from contract fields) — no contradictory moves.
5. **Update `ChapterCover`:** render the four fields (WarmCard or compact labeled grid). Keep month selector and Active this month.
6. Smoke a Consolidation vs Expansion month: deadlines and anti-patterns should differ.
7. `npx tsc --noEmit`.

## Out of scope

- Signal ranking / decision Hard Yes-No (P1-02)
- Rarity page depth (P1-03)
- Closing letter bridge (P1-04)
- Dated calendar windows (S2 / later)
- Inventory rewrite of all `PALACE_GUIDANCE_DATA` essays
- Fake population rarity stats
- Undoing P0 star / scorecard / aspect playbook work

## Done when / test plan

1. `npx tsc --noEmit` clean.
2. Document Viewer → Cover: four contract fields visible and filled.
3. Change lunar month / palace: at least two of {move, deadline, success, anti-pattern} change when palace guidance changes.
4. PDF / print cover shows the same contract.
5. Grep: cover is not *only* “Priority + One move” without success/deadline/anti-pattern.
