# P1-04 — Operational close + bridge to next month

**Agent brief.** You are turning the closing letter from poetic exit into an **operational close**: the one decision, by when, success measure, and what **next month inherits**. Prefer continuity data already on the bundle (`priorMonth`, `yearClimate`) over new vague inspiration.

**Backlog map:** `MONTHLY_REPORT_FEEDBACK.md` → closing gap + wishlist “Bridge to next month”; acceptance *Close includes bridge to next month*. Related backlog **S1** (month-to-month memory) is adjacent — implement a **thin bridge on Close**, not the full annual memory product.

**Assumes:** P0 done. Prefer **after P1-01** so Close can reuse month contract fields (move / deadline / success). If month contract is missing, derive the same four facts from `failureMode.exitMove`, `briefing.guidance.successMetrics`, and season. Do not undo P0.

**Read first:** this file + letter builders + `ChapterLetter` / `ChapterContinuity`.

---

## Goal

Close chapter answers: *Decide what? By when? How do I know it worked? What does next month inherit if I skip it?* Warm tone may remain, but the operational block is required.

## Acceptance criteria

- [ ] Close includes **the one decision** (aligned with primary move / month contract / exit move).
- [ ] Close includes **by when** (deadline).
- [ ] Close includes **success measure**.
- [ ] Close includes **bridge to next month**: next Liu Yue focus (from `yearClimate` or resolved next stack) and what unfinished debt that month should not inherit.
- [ ] If `priorMonth` exists, Close may reference finishing last month’s bridge (`priorMonth.bridgeNarrative`) in one line without making Close a full Track Record rewrite (`ChapterContinuity` stays).
- [ ] Letter is not *only* poetic closing (`letterTemplates.closing` alone).
- [ ] English-only; no em/en dashes; no Chinese in UI; no fake rarity %.
- [ ] `npx tsc --noEmit` passes.

## Problem statement

From buyer feedback:

> Closing is poetic, not operational — “Decide cleanly. Then rest into it” is beautiful but incomplete for $50.
>
> **Buyer need:** The one decision, by when, success measure, and what next month inherits.
>
> Year view is a map, not a story — need how this month changes what last asked and what to prepare next.
>
> Close section: warm tone; **needs operational close**.

## Exact files / symbols to touch

| Path | What |
| ---- | ---- |
| `src/utils/forecast/monthlyConsultation/types.ts` | **`PersonalLetter`** (~116–120): `greeting`, `bodyParagraphs`, `closing`. Extend (e.g. `operationalClose: { decision, deadline, successMeasure, nextMonthBridge }` or dedicated strings on the letter / bundle) |
| `src/utils/forecast/monthlyConsultation/contentLibraries.ts` | **`buildPersonalLetter`** (~768–792): injects name/star/transformation/palace/season into `letterTemplates.body`; closing from static palace templates (often poetic). **Palace `letterTemplates`** in `PALACE_CONTENT` (~108+) |
| `src/utils/forecast/monthlyConsultation/buildMonthlyConsultationBundle.ts` | Letter call site (~379–385) passes profile + palace + season + activations only — **no** `priorMonth`, `yearClimate`, guidance metrics, or month contract. **`buildPriorMonthBriefing`** (~396–418) already builds prior slice with `bridgeNarrative: priorBundle.failureMode.exitMove`. **`buildYearClimate`** (~194–218) has next months’ `palaceNameEnglish` / `season` / `priority`. **`resolvePriorMonthAnchor`** (~104–112) — add sibling **`resolveNextMonthAnchor`** if helpful |
| `src/components/monthly-consultation/chapters/MonthlyConsultationChapters.tsx` | **`ChapterLetter`** (~811–838): greeting + body + italic closing only. **`ChapterContinuity`** (~778–808): already shows prior subtitle + year map — do not duplicate the whole map into Close; one bridge sentence is enough |
| Optional reuse | P1-01 `monthContract` if present on bundle; else `failureMode.exitMove`, `briefing.guidance.successMetrics[0]`, `briefing.priority` |

**Print:** same `ChapterLetter`.

### Current letter builder

```ts
export const buildPersonalLetter = (profileName, palaceName, palaceNameEnglish, season, activations) => {
  // one body from templates; closing e.g. "Be clear. Be visible. Rest on purpose."
};
```

Called in `buildBundleCore` **before** `priorMonth` is attached (core sets `priorMonth: null`; full bundle merges prior later). Closest fix: either (a) build letter in `buildMonthlyConsultationBundle` after prior exists, or (b) pass next/prior anchors into `buildBundleCore` without full prior recursion.

## Current vs desired behavior

### Current

- Warm named paragraph + italic poetic close
- Continuity chapter holds last-month finish line + M1–M12 grid
- Close does not tell you what next palace inherits

### Desired (compact operational block + optional short warm body)

Example structure (write real copy from data):

1. Warm 1–2 sentences (optional keep / shorten templates)
2. **This month’s close-out**
   - Decision: …
   - By when: …
   - Done looks like: …
3. **Bridge**
   - Next: M{n} → {palaceEnglish}, {season short}. Finish {decision} so next month does not inherit {anti-pattern / unfinished agreement / open friction}.
4. Short closing line (can stay warm)

## Implementation steps

1. **Decide data shape:** extend `PersonalLetter` or add `bundle.operationalClose` rendered inside `ChapterLetter`.
2. **Resolve next month:** from `yearClimate` find `lunarMonth === current + 1` (wrap Dec→Jan / year+1 via anchor helper if climate is single-year only — for month 12, resolve next year’s M1 with `getPalaceForAspectLiuMonth` / `PALACE_MONTH_DATA` like `buildYearClimate`).
3. **Widen `buildPersonalLetter`** (or new `buildOperationalClose`) to accept: exit move / month contract, success measure, anti-pattern, next palace English + season + priority, optional `priorMonth`.
4. **Call site:** build operational close where `priorMonth` and `yearClimate` are available (`buildMonthlyConsultationBundle` after merge, or pass next/prior into core).
5. **Update `ChapterLetter`:** render labeled operational lines + bridge; keep visual language (`WarmCard` / existing rounded panel).
6. Do not replace `ChapterContinuity`; optionally tighten Continuity subtitle only if it already duplicates Close (avoid double essays).
7. Smoke month 7 with prior + next climate rows; also month 12 rollover.
8. `npx tsc --noEmit`.

## Out of scope

- Full S1 subscriber journal / user notes memory
- Quarterly synthesis (S7)
- Rarity depth (P1-03) except one optional cross-link
- Rewriting all palace `letterTemplates` poetry (may shorten to make room)
- Decision board / activation ranking (P1-02) except reading shared move language if present
- Fake rarity %

## Done when / test plan

1. `npx tsc --noEmit` clean.
2. Viewer → Close: decision, deadline, success measure, next-month bridge all present.
3. Bridge names a **specific next palace** (English) for this profile/month, not “prepare next month” alone.
4. Month 12 → next shows Month 1 next solar year palace when resolvable.
5. PDF Close matches viewer.
6. Poetic-only closing is no longer the sole content of the chapter.
