# P0-01 — Empty / light-on-stars rewrite

**Agent brief.** You are implementing one focused fix: when the month focus (Liu Yue Life) palace has few or no natal main stars, the “Your chart” chapter must feel like consultation value, not a blank box after payment.

**Backlog map:** `MONTHLY_REPORT_FEEDBACK.md` → Must-have **P2** (called **P0** here because it is a trust killer).

**Read first:** this file, then the cited functions only. Do not hunt the whole repo.

---

## Goal

Reframe sparseness as **meaningful chart teaching** (method: rely on month activations / flying stars; clarity / “empty stage” theme). Never leave a “no stars, skip this” feeling.

## Acceptance criteria

- [ ] Empty / no-main-star focus palace shows a **full meaning rewrite** (why emptiness matters this month), not a single apologetic line.
- [ ] Copy never tells the reader to “skip” the section or that there is “nothing here.”
- [ ] Empty case still points to **what to use instead**: month Si Hua / activation moves already on `bundle.activationCards` (or equivalent plain English), without dumping Chinese.
- [ ] Non-empty focus palace still shows **per-star English cues** (existing `STAR_CUES` behavior preserved or improved).
- [ ] Chapter title / subtitle / tips for this section make sense for **both** empty and non-empty (no tips that assume stars when there are none).
- [ ] English-only user-facing copy; no em/en dashes; no invented rarity %.
- [ ] `npx tsc --noEmit` passes.

## Problem statement

From buyer feedback:

> “Focus palace is light on main stars; follow month activation moves” reads as a blank section after payment.

**Buyer need:** Reframe emptiness as meaning (method, reliance on flying stars, clarity theme), not an empty box.

Section notes: *Your Chart — conceptually correct for empty palace; feels empty / unpaid.*

## Exact files / symbols to touch

| Path | What |
| ---- | ---- |
| `src/utils/forecast/monthlyConsultation/contentLibraries.ts` | `buildStarSpotlight`, `STAR_CUES` (~lines 930–971) |
| `src/utils/forecast/monthlyConsultation/types.ts` | `StarSpotlightRow` — extend if empty case needs more structured fields (e.g. `kind: "star" \| "empty-meaning"`) |
| `src/utils/forecast/monthlyConsultation/buildMonthlyConsultationBundle.ts` | Call site: `starSpotlight: buildStarSpotlight(lifePalaceStars.mainStars)` (~313). May need to pass **season, palace English name, activation cards / activations** so empty copy is month-specific |
| `src/utils/forecast/monthlyConsultation/englishLabels.ts` | `starToEnglish` only if cue keys missing; do not put Chinese in UI |
| `src/components/monthly-consultation/chapters/MonthlyConsultationChapters.tsx` | `ChapterStars` (~243–274); hardcoded `TipList` “How to use these stars” is wrong for empty case |
| Print | No separate stars chapter file — print uses `MonthlyConsultationBody` → same `ChapterStars` via `src/components/monthly-consultation/print/MonthlyConsultationPrintDocument.tsx` |

**Input you already have on the bundle:**

- `bundle.lifePalaceStars` (`MonthlyStarSnapshot`: `mainStars`, `palaceNameEnglish`, …) from `snapshotPalaceStars` in `timingStack.ts`
- `bundle.activationCards` from `buildActivationCards`
- `bundle.briefing.season`, `bundle.stack.liuYueLifePalaceNameEnglish`

## Current vs desired behavior

### Empty palace (no natal main stars in focus)

**Current (`buildStarSpotlight`):**

```ts
// returns single row:
{ star: "Focus palace", cue: "This area is light on main stars; follow the month activation moves instead" }
```

`ChapterStars` still titles “Stars in {palace}” and tips assume picking a star cue.

**Desired (example shape — write better final copy):**

- Primary block: emptiness **means** something for *this* palace + season (e.g. clarity / reliance on month activations / less natal “fixed personality” pressure in that life area).
- Secondary: 2–4 scannable lines such as “What to watch instead” tying to activation moves (Prosperity / Power / Recognition / Challenge) already on the bundle.
- Tips: “How to use an open palace” (use activations, one move, one protect), not “pick a star cue.”

### Non-empty palace

**Current:** up to 4 main stars → English name + `STAR_CUES[star]` or generic fallback.

**Desired:** keep star rows. Optionally tighten generic fallback. Tips can stay star-oriented. Do not regress when stars exist.

## Implementation steps

1. **Widen `buildStarSpotlight` inputs** so empty copy can use palace English name, season, and activations (or activation card titles/moves). Avoid calling with only `string[]` if that forces generic emptiness copy.
2. **Implement empty branch** that returns either:
   - richer `StarSpotlightRow[]` (e.g. rows like “Why this palace is open”, “Rely on month activations”, “What clarity buys you”), **or**
   - typed union on `starSpotlight` / companion fields on the bundle (e.g. `starSpotlightEmptyNarrative`) — pick the smallest type change that lets `ChapterStars` branch cleanly.
3. **Update `ChapterStars`:**
   - Adjust subtitle when empty vs non-empty.
   - Branch TipList copy.
   - If you add narrative paragraphs, keep layout consistent with other chapters (`WarmCard` / existing row list style).
4. **Wire call site** in `buildBundleCore` (`buildMonthlyConsultationBundle.ts`) to pass new args.
5. **Smoke both paths:** find or force a month where `lifePalaceStars.mainStars.length === 0`, and one where length > 0.
6. Run `npx tsc --noEmit`.

## Out of scope

- Scorecard drivers (P0-02)
- Work / Money / People playbooks (P0-03)
- Rarity / fingerprint page, calendar dated windows, decision board hierarchy
- Changing Si Hua resolution math
- Inventing fake “X% of charts are empty here” stats
- Full redesign of chapter chrome

## Done when / test plan

1. `npx tsc --noEmit` clean.
2. Document Viewer → **Your chart** chapter:
   - Empty month: no “light on main stars” / skip vibe; reads as intentional teaching; mentions using month activations.
   - Star month: star cues still render.
3. PDF / print path shows the same chapter content.
4. Grep UI strings for the old cue and remove it:
   - `"This area is light on main stars"`
