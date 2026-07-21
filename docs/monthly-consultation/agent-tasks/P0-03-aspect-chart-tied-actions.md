# P0-03 — Work / Money / People: chart-tied ranked actions

**Agent brief.** You are killing template smell on Work / Money / People. Each aspect must show **≤3 ranked** Do actions (and tight Avoids) tied to **that month’s aspect palace + main stars** (and season / activations when useful). No shared generic wellbeing/wealth tip lists reused across areas.

**Backlog map:** `MONTHLY_REPORT_FEEDBACK.md` → Must-have **P6** (P0 trust killer). Soft personalization section also applies.

**Depends on (soft):** P0-01/P0-02 patterns for palace+star English helpers are useful to reuse; this task can still ship alone.

---

## Goal

Work, Money, and People deep dives read as chart-specific coaching for **this** month’s Career / Wealth / Relationships Liu Yue palaces — not interchangeable lifestyle tips.

## Acceptance criteria

- [ ] Each of Career / Wealth / Relationships exposes **≤3 ranked Do actions** in UI and print (not 4–5 generic bullets).
- [ ] Actions for an aspect **name or clearly depend on** that aspect’s palace and/or its main stars and/or a month activation relevant to that aspect.
- [ ] The three aspects do **not** share the same Do list (or near-duplicates). Avoid lists also must not be copy-pastes of each other.
- [ ] Ranking is explicit in copy or order (1 / 2 / 3, or strongest-first with label).
- [ ] Context line remains palace+stars-aware (already partially done via `contextTemplate`).
- [ ] English-only; no em/en dashes; no Chinese in user-facing strings; no fake rarity %.
- [ ] Hardcoded coach `tip` props on `ChapterCareer` / `ChapterWealth` / `ChapterRelationships` either become data-driven or stay aspect-specific (not three flavors of the same blank advice).
- [ ] `npx tsc --noEmit` passes.

## Problem statement

From buyer feedback:

> Named user, but large blocks could apply to anyone in a Wellbeing + Harvest month: Protect rest / Say yes to the right opportunities / Outer wealth reflects inner state.

Section notes: *Work / Money / People — usable avoid lists; too generic vs Travel+Ju Men / Spouse+Tai Yang / Life+Tian Ji.*

Acceptance checklist item: *Work / Money / People each have ≤3 ranked chart-tied actions.*

## Exact files / symbols to touch

| Path | What |
| ---- | ---- |
| `src/utils/forecast/monthlyConsultation/contentLibraries.ts` | **`ASPECT_PLAYBOOK_SEEDS`** (~831–886), **`buildAspectPlaybook`** (~891–907). Today: injects palace/stars into **context only**, then returns **full** `doThis` / `watchOut` arrays (5 each) from static seeds |
| `src/utils/forecast/monthlyConsultation/types.ts` | **`AspectLifePlaybook`**: `context`, `doThis`, `watchOut` — consider ranking metadata or keep order-as-rank |
| `src/utils/forecast/monthlyConsultation/buildMonthlyConsultationBundle.ts` | Call sites ~294–309: passes aspect, `palaceNameEnglish`, `mainStarsEnglish` only. **Widen** to pass season, `stemActivations` / `activationCards`, maybe focus Life palace for contrast |
| `src/utils/forecast/monthlyConsultation/englishLabels.ts` | `starToEnglish`, palace helpers as needed |
| `src/components/monthly-consultation/chapters/MonthlyConsultationChapters.tsx` | **`AspectDeepDive`** (~383–430) currently `actions.slice(0, 4)` and `watch.slice(0, 4)` — change to **≤3**. **`ChapterCareer` / `ChapterWealth` / `ChapterRelationships`** (~432–463) |
| Optional reuse | `STAR_CUES` in `contentLibraries.ts` (~930–949) for star-flavored moves; `ACTIVATION_MOVE` (~909–914) for Si Hua-shaped actions |
| Data already built | `bundle.aspectPalaces.*`, `bundle.stemActivations`, `bundle.briefing.season`, `bundle.stack` |

**Print:** same chapters via `MonthlyConsultationBody`.

### Current builder behavior (the bug)

```ts
export const buildAspectPlaybook = (aspect, palaceNameEnglish, mainStarsEnglish) => {
  const seed = ASPECT_PLAYBOOK_SEEDS[aspect];
  // context gets palace/stars; doThis/watchOut are always the same 5 strings for that aspect key
  return { context: injectVars(...), doThis: seed.doThis, watchOut: seed.watchOut };
};
```

Seeds are aspect-keyed (career vs wealth vs relationships differ from each other), but they are **not chart-tied month-to-month** — every Career month gets the same five work tips regardless of Travel+Ju Men vs Career+Wu Qu.

## Current vs desired behavior

### Current UI

- Context: `"Through your {{palace}}{{stars}}."` (OK direction).
- Do: up to 4 of 5 static tips (generic promotions / invoices / conversations).
- Avoid: up to 4 of 5 static watch-outs.
- Hardcoded tips like “Make one win visible before mid-month…” (career) are template coach tone.

### Desired (per aspect)

Example direction (implement real copy generators; do not ship these placeholders verbatim unless they fit the chart):

1. **Ranked Do 1:** use **primary star** in that aspect palace (or primary relevant activation) → one concrete behavior.
2. **Do 2:** use palace theme (Career / Wealth / Spouse / Friends / … English name) → one behavior.
3. **Do 3:** use month season (`briefing.season`) or challenge activation → one boundary / timing behavior.

Avoid: **≤3** items, still aspect+chart flavored (not “don’t lend money” on People and Work identically).

If an aspect palace has **no main stars**, actions must still be specific via palace English name + month activations (same philosophy as P0-01 emptiness: meaning, not blank tips).

## Implementation steps

1. **Change `buildAspectPlaybook` signature** to accept month context:
   - `aspect`, aspect `MonthlyStarSnapshot | null` (or palace + stars), `season`, `stemActivations` (and optionally Life focus palace for “contrast” lines).
2. **Replace flat seed dump** with a selector that:
   - Builds a candidate pool from star cues + activation moves + palace-specific seeds.
   - Scores / orders them for this month.
   - Returns **at most 3** `doThis` and **at most 3** `watchOut`.
3. Keep thin `ASPECT_PLAYBOOK_SEEDS` only as **fallback fragments** keyed by aspect, but combine with `STAR_CUES` / activation text so two months with different stars never produce identical Do lists when stars differ.
4. **Update call site** in `buildBundleCore` to pass richer inputs (snapshots already computed: `careerSnap`, `wealthSnap`, `relSnap`).
5. **Update `AspectDeepDive`** to `slice(0, 3)` (or trust builder length) and optionally render rank numbers.
6. Move or regenerate chapter `tip` from builder (`AspectLifePlaybook.coachTip?`) so JSX is not three permanent templates.
7. Spot-check three aspects side by side for one month: palace names and star names should appear in actions or context; lists must diverge.
8. `npx tsc --noEmit`.

## Out of scope

- Empty stars chapter (P0-01) except reusing helpers
- Scorecard (P0-02)
- Health / Body chapter (`ChapterHealth` / somatic) unless a one-line cross-link is trivial
- Calendar dated windows, decision board Hard NO/WAIT, rarity page, month contract page 1
- Sharing one master “wellbeing” checklist across aspects

## Done when / test plan

1. `npx tsc --noEmit` clean.
2. Viewer → Work, Money, People:
   - Each Do list length ≤ 3.
   - At least one action per aspect mentions that aspect’s palace name or a main star / activation for that aspect.
   - Comparing the three chapters, Do lists are clearly not the same template.
3. Change month (or profile) so aspect stars change; Confirm Do lists change when stars change (not solely context string).
4. PDF shows ≤3 Do / ≤3 Avoid per aspect chapter.
5. Grep: ensure UI no longer slices 4 of the old five-item generic career/wealth/relationships seeds as the primary experience (seeds may remain as internal fallback fragments only).
