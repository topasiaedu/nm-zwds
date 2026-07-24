# P1-02 — Signal hierarchy + decision board hardening

**Agent brief.** You own **one shared priority model** that (1) ranks month Si Hua / activation cards by urgency and (2) hardens the Should I…? board into Hard Yes / Soft Yes / Wait / No with at least one clear WAIT or NO and a chart-reason line each. Do not ship hierarchy in activations while decisions still say soft “Good timing” that can justify everything.

**Backlog map:** `MONTHLY_REPORT_FEEDBACK.md` → Must-have **P4** (resolve signal contradictions) + wishlist / acceptance for **decision board** (Hard Yes / Soft Yes / Wait / No; ≥1 WAIT or NO).

**Assumes:** P0 done (or non-conflicting). Prefer running **after P1-01** so decisions can cite the month contract move when ratings are close. Do not undo P0.

**Read first:** this file + cited functions. One agent session for both halves — they share ranking logic.

---

## Goal

Activations read as an ordered urgency stack. Decisions cannot all feel “yes with caveats.” Prosperity vs “wait on launches” is hierarchy-resolved against season + Challenge + month priority / primary move.

## Acceptance criteria

- [ ] Activation cards are **ordered by urgency** (and UI shows order or rank labels: 1 / 2 / 3…).
- [ ] Hierarchy is explicit: e.g. Challenge / clarity repair before expansion when season is Consolidation/Foundation or `化忌` is present; Prosperity does **not** override a clear wait-on-launches rule.
- [ ] Tip / coach on Signals chapter reflects the **top** move, not four equal tips.
- [ ] Decision ratings are **Hard Yes / Soft Yes / Wait / No** (or equivalent four-way enum), not only favorable/caution/unfavorable → “Good timing / Be careful / Better wait”.
- [ ] Board includes **≥1 Wait or No** for a typical contradictory month (Prosperity present + Consolidation / Challenge pressure).
- [ ] Each decision row has **one chart-reason line** naming season and/or activation and/or focus palace (already partly in `why`; tighten so rating + reason cannot conflict).
- [ ] Shared ranking helper used by both `buildActivationCards` (or post-sort) and `buildDecisions` — no duplicated contradictory rules.
- [ ] English-only; no em/en dashes; no Chinese in UI; no fake rarity %.
- [ ] `npx tsc --noEmit` passes.

## Problem statement

From buyer feedback:

> Signals — excellent move framing; **could rank signals by urgency**.
>
> Should I…? — soft / conflicting; Prosperity vs “new launches wait” not hierarchy-resolved. Multiple items land on GOOD TIMING with caveats that could justify anything.
>
> **Buyer need:** Hard ranking vs month priority — including clean **NO / WAIT**.

Acceptance: *Signal hierarchy resolves Prosperity vs caution without contradiction*; *Decision board includes at least one clear WAIT or NO*.

## Exact files / symbols to touch

| Path | What |
| ---- | ---- |
| `src/utils/forecast/monthlyConsultation/types.ts` | **`ActivationCard`** (~177–182): add `urgencyRank: number` and/or `urgencyLabel`. **`DecisionRow`** (~101–106): change `rating` from `"favorable" \| "caution" \| "unfavorable"` to a four-way type, e.g. `"hard-yes" \| "soft-yes" \| "wait" \| "no"` (keep `why` as chart reason; `coaching` stays short action) |
| `src/utils/forecast/monthlyConsultation/contentLibraries.ts` | **`ACTIVATION_MOVE`** (~901–906), **`buildActivationCards`** (~1137–1146) — today maps activations in stem order with no rank. **`buildDecisions`** (~706–763) — boolean `hasLu` / `hasJi` / season flags; many rows land `favorable` or soft `caution`; launch row can stay open while purchase waits — contradictions possible |
| New helper (same file or `signalPriority.ts`) | e.g. **`rankStemActivations`**, **`resolveExpansionStance`**: returns `{ allowNewLaunch: boolean; expansionBias: "press" \| "prepare" \| "wait"; ranked: StemSiHuaActivation[] }` from `season`, `activations`, optional `priority` / month contract move |
| `src/utils/forecast/monthlyConsultation/buildMonthlyConsultationBundle.ts` | Call sites: `activationCards = buildActivationCards(...)` (~308); `decisions: buildDecisions(...)` (~377). Pass **season + priority** (and optionally `failureMode.exitMove` / month contract) into both |
| `src/utils/forecast/monthlyConsultation/englishLabels.ts` | `SI_HUA_LABEL`, `SI_HUA_PLAIN` — labels only; do not put Chinese in UI |
| `src/components/monthly-consultation/chapters/MonthlyConsultationChapters.tsx` | **`ChapterActivations`** (~205–239): render in ranked order; update TipList to point at #1. **`ChapterDecisions`** (~606–641): **`ratingLabel` / `ratingColor`** (~33–51) must map the new four-way ratings. Slice still ~5 rows |

**Print:** same chapters via `MonthlyConsultationBody`.

### Current decision rating map (bug surface)

```ts
// contentLibraries buildDecisions — soft ternary rules
rating: expandOk && !hasJi ? "favorable" : "caution"  // launch
rating: hasLu && expandOk ? "favorable" : "caution"     // purchase
// ChapterDecisions:
// favorable → "Good timing"; caution → "Be careful"; unfavorable → "Better wait"
// unfavorable almost never used except consolidation new partnership
```

Prosperity (`hasLu`) can paint “good timing” while coaching elsewhere says prepare / wait — hierarchy not shared with activation card order (`buildActivationCards` preserves `resolveLiuYueStemSiHua` order only).

## Current vs desired behavior

### Activations

**Current:** Unordered (stem resolution order). TipList treats Prosperity/Recognition/Power/Challenge as equal quick rules.

**Desired:** Sorted urgency. Suggested default policy (document in code comment; tune if needed):

1. **Challenge (`化忌`)** first when present (repair / name friction)
2. Else **Power (`化权`)** when season is Consolidation/Foundation (decide / date it)
3. Else **Recognition (`化科`)** when Visibility / need for proof
4. **Prosperity (`化禄`)** supports openings **after** repair/decide when clash exists; never outranks Challenge in a Consolidation + Challenge month

Show rank on card (“1 · Do this first”) or rely on visual order + subtitle.

### Decisions

**Current:** 6 built, 5 shown; mostly Good timing / Be careful.

**Desired:**

| Verdict | When to use |
| ------- | ------------ |
| Hard Yes | Season + activations clearly support; aligns with month primary move |
| Soft Yes | Allowed with condition (written terms, small size, after repair) |
| Wait | Timing OK later / after a precondition this month |
| No | Contradicts month hierarchy (e.g. brand-new launch in Consolidation + Challenge) |

Guarantee: if `resolveExpansionStance().allowNewLaunch === false`, the **“Major career launch…”** row (or equivalent) must be **Wait or No**, even if Prosperity is present. Chart reason must say why (season + Challenge / month priority).

## Implementation steps

1. **Define shared stance + rank helper** from `season`, `StemSiHuaActivation[]`, and month `priority` (string from `briefing.priority`).
2. **Extend `ActivationCard`**; update `buildActivationCards` to sort by rank and set `urgencyRank`.
3. **Widen `DecisionRow.rating`**; rewrite `buildDecisions` to call the same stance helper for every expansion / spend / exit row.
4. Force **≥1 Wait or No** when stance is wait/no — if all heuristics yield Soft Yes, downgrade the weakest expansion/spend row and document the rule.
5. Tighten each `why` to one **chart-reason** line (palace English + season short + relevant Si Hua English label).
6. Update **`ratingLabel` / `ratingColor`** in `MonthlyConsultationChapters.tsx`.
7. Update **`ChapterActivations`** TipList to name the #1 card’s move.
8. Manual check: Wellbeing / Consolidation-like month with Prosperity + Challenge — launch/purchase must not both read Hard Yes / Soft Yes without hierarchy text.
9. `npx tsc --noEmit`.

### Type sketch (adapt as needed)

```ts
export type DecisionVerdict = "hard-yes" | "soft-yes" | "wait" | "no";

export interface DecisionRow {
  decision: string;
  rating: DecisionVerdict;
  why: string;      // chart reason
  coaching: string; // what to do
}

export interface ActivationCard {
  title: string;
  landing: string;
  meaning: string;
  move: string;
  urgencyRank: number;
}
```

## Out of scope

- Month contract cover UI (P1-01) except reading `priority` / move if already present
- Rarity depth (P1-03), letter bridge (P1-04)
- Rewriting aspect playbooks / scorecard (P0)
- Dated calendar windows
- Changing Si Hua **resolution math** in `stemSiHua.ts` / `timingStack.ts` (order for ranking is post-process only)

## Done when / test plan

1. `npx tsc --noEmit` clean.
2. Signals chapter: cards appear in urgency order; #1 matches hierarchy policy for that month.
3. Decisions: labels are Hard Yes / Soft Yes / Wait / No (or agreed English synonyms); **at least one Wait or No** visible when launch should wait.
4. Prosperity present + Consolidation/Challenge: launch decision is Wait/No and reason cites hierarchy (not “Prosperity softens risk” alone).
5. PDF matches viewer for both chapters.
6. Grep: remove sole reliance on `"Good timing"` as the only favorable label if replaced.
