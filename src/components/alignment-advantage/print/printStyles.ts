/**
 * Embedded CSS for Alignment Advantage PDF / print preview.
 *
 * Visual tokens match C (cream / navy / coral). Puppeteer `page.pdf()` margins
 * are 0 (full bleed); @page margin is also 0 so cream goes edge-to-edge.
 * Readable inset comes from section/card padding inside the design — not a
 * white Chromium printer margin ring.
 *
 * Spacing policy: preserve the in-app Tailwind rhythm across ALL chapters
 * (mb-16 = 4rem, ReportSheet p-16, space-y-10, etc.). Do not crush gaps/fonts
 * to pack denser pages — product prefers generous parity with the viewer.
 */
export const PRINT_STYLES = `
  @page {
    size: A4;
    margin: 0;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  @media screen {
    .print-root {
      max-width: 860px;
      margin: 0 auto;
      padding: 40px 48px;
      background: #fdf6ee;
      color: #1a1e3f;
    }
  }

  @media print {
    @page {
      size: A4;
      margin: 0;
    }

    html, body {
      background: #fdf6ee !important;
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      max-width: 100% !important;
      /*
       * Do NOT set overflow-x:hidden on html/body/print-root — any non-visible
       * overflow creates a fragmentation root and Chromium drops all pages
       * after the first in page.pdf().
       */
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .print-root {
      background: #fdf6ee !important;
      color: #1a1e3f !important;
      max-width: none !important;
      width: 100% !important;
      margin: 0 !important;
      /* Safe inset inside cream — not a white page margin */
      padding: 14mm 14mm !important;
      box-sizing: border-box !important;
      overflow: visible !important;
    }

    .print-root [data-aa-print-body] {
      padding: 0 !important;
      gap: 0 !important;
      max-width: 100% !important;
      overflow: visible !important;
    }

    .print-hide {
      display: none !important;
    }

    /*
     * A4 print is fixed-width — neutralize mobile reflow that stacks columns
     * when Chromium evaluates narrow print media queries.
     */
    .print-root .md\\:flex-row {
      flex-direction: row !important;
    }
    .print-root .md\\:items-center {
      align-items: center !important;
    }
    .print-root .md\\:items-end {
      align-items: flex-end !important;
    }
    .print-root .md\\:justify-between {
      justify-content: space-between !important;
    }
    .print-root .md\\:text-right {
      text-align: right !important;
    }
    .print-root .md\\:w-1\\/4 {
      width: 25% !important;
    }
    .print-root .md\\:w-auto {
      width: auto !important;
    }
    .print-root .md\\:max-w-xs {
      max-width: 20rem !important;
    }
    .print-root .md\\:grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }
    .print-root .md\\:grid-cols-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    }
    .print-root .md\\:grid-cols-\\[112px_1fr\\] {
      grid-template-columns: 112px 1fr !important;
    }
    .print-root .md\\:grid-cols-\\[112px_1fr_auto\\] {
      grid-template-columns: 112px 1fr auto !important;
    }
    .print-root .md\\:grid-cols-\\[120px_1fr_auto\\] {
      grid-template-columns: 120px 1fr auto !important;
    }
    .print-root .sm\\:grid-cols-12 {
      grid-template-columns: repeat(12, minmax(0, 1fr)) !important;
    }
    .print-root .lg\\:grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }
    .print-root .md\\:overflow-hidden,
    .print-root .md\\:rounded-3xl {
      overflow: visible !important;
    }
    .print-root .md\\:min-h-\\[220px\\],
    .print-root .md\\:min-h-\\[1050px\\] {
      min-height: 0 !important;
    }
    .print-root .md\\:p-16 {
      padding: 4rem !important;
    }
    .print-root .md\\:p-10 {
      padding: 2.5rem !important;
    }
    .print-root .md\\:p-7 {
      padding: 1.75rem !important;
    }
    .print-root .sm\\:p-8 {
      padding: 2rem !important;
    }
    .print-root .lg\\:p-16 {
      padding: 4rem !important;
    }

    .print-root [data-aa-report-sheet],
    .print-root [data-aa-report-sheet] * {
      max-width: 100%;
    }
    .print-root img,
    .print-root svg,
    .print-root table {
      max-width: 100% !important;
    }

    /* ── Utility break helpers ── */
    .print-page-break {
      break-before: page;
      page-break-before: always;
    }

    .print-avoid-break {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    [data-pdf-page-break-before] {
      break-before: page;
      page-break-before: always;
    }

    /*
     * Major chapters: prefer a fresh page before each (except overview #cover).
     * Do NOT use break-inside: avoid on these — they are taller than one A4 page.
     */
    #decision,
    #design,
    #wealth,
    #people,
    #timing {
      break-before: page;
      page-break-before: always;
      break-inside: auto;
      page-break-inside: auto;
    }

    #cover {
      break-before: auto;
      page-break-before: auto;
      break-inside: auto;
      page-break-inside: auto;
    }

    /* One monthly briefing per page — keeps generous spacing viable */
    [data-aa-print-month] {
      break-before: page;
      page-break-before: always;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    #design [data-aa-report-sheet] ~ [data-aa-report-sheet],
    #wealth [data-aa-report-sheet] ~ [data-aa-report-sheet],
    #people [data-aa-report-sheet] ~ [data-aa-report-sheet] {
      break-before: page;
      page-break-before: always;
    }

    /*
     * Page-start breathing room (cream-internal). Full bleed stays margin:0.
     */
    .print-root [data-aa-print-month],
    .print-root #design [data-aa-report-sheet] ~ [data-aa-report-sheet],
    .print-root #wealth [data-aa-report-sheet] ~ [data-aa-report-sheet],
    .print-root #people [data-aa-report-sheet] ~ [data-aa-report-sheet],
    .print-root #decision,
    .print-root #design,
    .print-root #wealth,
    .print-root #people,
    .print-root #timing,
    .print-root #cover {
      padding-top: 16mm !important;
    }

    /*
     * Sheet shells — match in-app ReportSheet / chapter padding (md:p-16 = 4rem).
     * Applied on ALL chapter surfaces, not only months.
     */
    .print-root #cover,
    .print-root [data-aa-report-sheet] {
      border-radius: 28px !important;
      box-shadow: none !important;
      overflow: visible !important;
      min-height: 0 !important;
      margin-bottom: 2rem !important;
      padding: 4rem 3.5rem !important;
    }

    .print-root #decision {
      border-radius: 28px !important;
      box-shadow: none !important;
      overflow: visible !important;
      min-height: 0 !important;
      margin-bottom: 0 !important;
      padding-right: 3.5rem !important;
      padding-bottom: 4rem !important;
      padding-left: 3.5rem !important;
    }
    /*
     * #timing wraps all 12 months. Zero trailing margin/padding — mb-32 / 4rem
     * bottom padding after December creates a cream-only last page.
     */
    .print-root #timing {
      border-radius: 28px !important;
      box-shadow: none !important;
      overflow: visible !important;
      min-height: 0 !important;
      margin-bottom: 0 !important;
      padding-right: 3.5rem !important;
      padding-bottom: 0 !important;
      padding-left: 3.5rem !important;
    }
    /* Screen chapters use overflow-hidden; never clip print fragments. */
    .print-root #decision.overflow-hidden,
    .print-root #timing.overflow-hidden {
      overflow: visible !important;
    }

    /*
     * Overview: modest top-section shrink so hero + chips + wealth + mini-grid
     * can share one A4 page. Do not crush other chapters.
     */
    .print-root #cover {
      margin-bottom: 0 !important;
      padding-right: 2.5rem !important;
      padding-bottom: 1.5rem !important;
      padding-left: 2.5rem !important;
    }
    .print-root #cover .mb-16 {
      margin-bottom: 1.5rem !important;
    }
    .print-root #cover .mb-6 {
      margin-bottom: 0.85rem !important;
    }
    .print-root #cover .gap-4 {
      gap: 0.75rem !important;
    }
    .print-root #cover .p-5 {
      padding: 0.85rem 1rem !important;
    }
    .print-root #cover .py-5 {
      padding-top: 0.85rem !important;
      padding-bottom: 0.85rem !important;
    }

    .print-root #design,
    .print-root #wealth,
    .print-root #people {
      margin-bottom: 0 !important;
      padding-bottom: 0 !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
      min-height: 0 !important;
      overflow: visible !important;
    }
    /* Last sheet in a chapter: no bottom margin that spills into a blank page */
    .print-root #wealth [data-aa-report-sheet]:last-child,
    .print-root #people [data-aa-report-sheet]:last-child,
    .print-root #design [data-aa-report-sheet]:last-child {
      margin-bottom: 0 !important;
      padding-bottom: 2rem !important;
    }

    /*
     * Re-assert page-start top inset AFTER sheet padding shorthands so it is
     * not wiped by padding: 4rem 3.5rem on #cover / ReportSheet.
     */
    .print-root [data-aa-print-month],
    .print-root #design [data-aa-report-sheet] ~ [data-aa-report-sheet],
    .print-root #wealth [data-aa-report-sheet] ~ [data-aa-report-sheet],
    .print-root #people [data-aa-report-sheet] ~ [data-aa-report-sheet],
    .print-root #decision,
    .print-root #design,
    .print-root #wealth,
    .print-root #people,
    .print-root #timing {
      padding-top: 16mm !important;
    }
    .print-root #cover {
      padding-top: 10mm !important;
    }

    .print-root .sticky,
    .print-root .fixed,
    .print-root [class*="sticky"],
    .print-root [class*="fixed"] {
      position: static !important;
      top: auto !important;
      bottom: auto !important;
    }

    .print-root svg.absolute {
      overflow: visible !important;
    }

    /*
     * Atomic keep-together only — NEVER on multi-section chapter wrappers.
     * Tall break-inside:avoid blocks that are shorter than a page but leave
     * a large empty lower half force the next section onto a new page (seen on
     * Strategic Filter: Convergence alone then Deal-Flow orphaned). Prefer packing
     * following content, or split at labeled row/card boundaries.
     *
     * Do NOT use a blanket .rounded-2xl.border avoid — MonthGrid and AxisCard
     * match that and create sparse voids across chapters.
     *
     * What-To-Do / What-To-Watch CARDS must stay intact (mid-card splits left
     * item 3 alone on a sparse page). Prefer breaking before [data-aa-action-plan].
     * Stars chips + summary stay together so the summary is not pulled onto the
     * actions page by a prior break-before:avoid on the action plan.
     */
    [data-aa-chart-block],
    [data-aa-mini-grid],
    [data-aa-convergence],
    [data-aa-checklist-row],
    [data-aa-score-bar],
    [data-aa-wealth-archetype-card],
    [data-aa-wealth-engine],
    [data-aa-numbered-list-row],
    [data-aa-what-to-do-list],
    [data-aa-watch-card],
    [data-aa-action-column],
    [data-aa-palace-stars],
    [data-aa-overview-tail] {
      break-inside: avoid;
      page-break-inside: avoid;
    }
    [data-aa-numbered-list-row] {
      -webkit-column-break-inside: avoid;
    }

    /*
     * Tall multi-part sections: allow fragmentation so leftover page space can
     * fill with the next atomic block. Card/column children still keep together.
     *
     * Playbook opener must NOT use break-inside:avoid — when header + opener
     * exceed one A4 box, Chromium clips the bottom (Year-at-a-Glance disappears).
     * Keep the year legend attached with break-before:avoid instead.
     *
     * Action-plan containers stay auto so the whole two-column block can move
     * to the next page cleanly when it will not fit (never split mid-card).
     */
    [data-aa-deal-flow],
    [data-aa-operating-engine],
    [data-aa-people-priority],
    [data-aa-wealth-scores],
    [data-aa-action-plan],
    [data-aa-playbook-opener],
    [data-aa-playbook-timeline],
    [data-aa-playbook-phase],
    [data-aa-playbook-month-grid],
    [data-aa-month-picker] {
      break-inside: auto;
      page-break-inside: auto;
    }
    .print-root [data-aa-playbook-month-grid] {
      break-before: avoid;
      page-break-before: avoid;
    }

    /*
     * Mini-grid / chart block — print-only real size shrink (not transform).
     * Inline minHeight:90 + center info makes the 4×4 grid taller than the A4
     * content box; Chromium then clips bottom rows when break-inside:avoid
     * cannot spill. Shrink cells/fonts/gaps here only; leave chapter mb-* alone.
     *
     * Convergence / Deal-Flow / engine shrinks are re-asserted AFTER the
     * Tailwind spacing scale block further below (so .mb-12 etc. do not win).
     */
    .print-root [data-aa-mini-grid] {
      gap: 2px !important;
      padding: 2px !important;
    }
    .print-root [data-aa-palace-cell] {
      min-height: 52px !important;
      padding: 3px 4px !important;
    }
    .print-root [data-aa-palace-cell] .text-\\[40px\\] {
      font-size: 22px !important;
    }
    .print-root [data-aa-palace-cell] .text-\\[9px\\] {
      font-size: 7px !important;
      line-height: 1.2 !important;
    }
    .print-root [data-aa-palace-cell] .text-\\[8px\\] {
      font-size: 6.5px !important;
      line-height: 1.15 !important;
    }
    .print-root [data-aa-palace-cell] .pt-2 {
      padding-top: 0.15rem !important;
    }
    .print-root [data-aa-palace-cell] .gap-0\\.5 {
      gap: 0 !important;
    }
    .print-root [data-aa-mini-grid-center-header] {
      padding: 4px 0 !important;
    }
    .print-root [data-aa-mini-grid-center-header] .text-sm {
      font-size: 0.7rem !important;
      line-height: 1.2 !important;
    }
    .print-root [data-aa-center-info] {
      gap: 0.2rem !important;
      padding: 0.25rem 0.35rem !important;
      font-size: 7px !important;
      line-height: 1.25 !important;
      overflow: hidden !important;
    }
    .print-root [data-aa-center-info] .text-\\[8px\\],
    .print-root [data-aa-center-info] .sm\\:text-\\[9px\\] {
      font-size: 6px !important;
      line-height: 1.1 !important;
    }
    .print-root [data-aa-center-info] .gap-0\\.5 {
      gap: 0 !important;
    }

    /*
     * Force true Tailwind spacing scale across the whole print tree.
     * Earlier dense-pack passes overrode these to 8–12px globally.
     */
    .print-root .mb-32 { margin-bottom: 8rem !important; }
    .print-root .mb-16 { margin-bottom: 4rem !important; }
    .print-root .mb-12 { margin-bottom: 3rem !important; }
    .print-root .mb-10 { margin-bottom: 2.5rem !important; }
    .print-root .mb-8  { margin-bottom: 2rem !important; }
    .print-root .mb-7  { margin-bottom: 1.75rem !important; }
    .print-root .mb-6  { margin-bottom: 1.5rem !important; }
    .print-root .mb-5  { margin-bottom: 1.25rem !important; }
    .print-root .mb-4  { margin-bottom: 1rem !important; }
    .print-root .mb-3  { margin-bottom: 0.75rem !important; }
    .print-root .mb-2  { margin-bottom: 0.5rem !important; }
    .print-root .mb-1  { margin-bottom: 0.25rem !important; }
    .print-root .mt-6  { margin-top: 1.5rem !important; }
    .print-root .mt-4  { margin-top: 1rem !important; }
    .print-root .mt-3  { margin-top: 0.75rem !important; }
    .print-root .pt-16 { padding-top: 4rem !important; }
    .print-root .pt-8  { padding-top: 2rem !important; }
    .print-root .pt-2  { padding-top: 0.5rem !important; }
    .print-root .pb-8  { padding-bottom: 2rem !important; }
    .print-root .pb-3  { padding-bottom: 0.75rem !important; }
    .print-root .pb-2  { padding-bottom: 0.5rem !important; }
    .print-root .p-8   { padding: 2rem !important; }
    .print-root .p-7   { padding: 1.75rem !important; }
    .print-root .p-6   { padding: 1.5rem !important; }
    .print-root .p-5   { padding: 1.25rem !important; }
    .print-root .px-6  { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
    .print-root .px-5  { padding-left: 1.25rem !important; padding-right: 1.25rem !important; }
    .print-root .px-4  { padding-left: 1rem !important; padding-right: 1rem !important; }
    .print-root .py-5  { padding-top: 1.25rem !important; padding-bottom: 1.25rem !important; }
    .print-root .py-4  { padding-top: 1rem !important; padding-bottom: 1rem !important; }
    .print-root .py-2  { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
    .print-root .space-y-16 > * + * { margin-top: 4rem !important; }
    .print-root .space-y-10 > * + * { margin-top: 2.5rem !important; }
    .print-root .space-y-7  > * + * { margin-top: 1.75rem !important; }
    .print-root .space-y-4  > * + * { margin-top: 1rem !important; }
    .print-root .gap-12 { gap: 3rem !important; }
    .print-root .gap-x-12 { column-gap: 3rem !important; }
    .print-root .gap-y-6  { row-gap: 1.5rem !important; }
    .print-root .gap-6  { gap: 1.5rem !important; }
    .print-root .gap-4  { gap: 1rem !important; }
    .print-root .gap-3  { gap: 0.75rem !important; }
    .print-root .gap-2  { gap: 0.5rem !important; }

    .print-root .leading-relaxed {
      line-height: 1.625 !important;
    }
    .print-root .leading-tight {
      line-height: 1.25 !important;
    }
    .print-root .text-sm {
      font-size: 0.875rem !important;
      line-height: 1.625 !important;
    }
    .print-root .text-base {
      font-size: 1rem !important;
      line-height: 1.625 !important;
    }
    .print-root .text-lg {
      font-size: 1.125rem !important;
      line-height: 1.625 !important;
    }

    /*
     * Re-assert section-local print shrinks AFTER the Tailwind scale block so
     * attribute selectors win over .mb-12 / .p-8 / .gap-12 reassertions.
     */
    .print-root [data-aa-convergence] {
      margin-bottom: 1.75rem !important;
    }
    .print-root [data-aa-convergence-header] {
      padding: 1rem 1.5rem !important;
    }
    .print-root [data-aa-convergence-header] .text-2xl {
      font-size: 1.25rem !important;
      line-height: 1.3 !important;
    }
    .print-root [data-aa-convergence-body] {
      padding: 1.25rem 1.5rem !important;
      gap: 1.5rem !important;
    }
    .print-root [data-aa-convergence-venn] {
      width: 11rem !important;
      height: 11rem !important;
    }
    .print-root [data-aa-convergence-body] .gap-6 {
      gap: 0.85rem !important;
    }
    .print-root [data-aa-convergence-body] .mt-2 {
      margin-top: 0.35rem !important;
    }
    .print-root [data-aa-convergence-body] .p-4 {
      padding: 0.75rem !important;
    }
    .print-root [data-aa-deal-flow] {
      margin-bottom: 0 !important;
    }
    .print-root [data-aa-deal-flow] > p {
      margin-bottom: 0.65rem !important;
    }
    .print-root [data-aa-checklist-row] {
      padding-top: 0.85rem !important;
      padding-bottom: 0.85rem !important;
    }
    .print-root [data-aa-chart-block] {
      margin-top: 0.75rem !important;
      margin-bottom: 1.75rem !important;
    }
    .print-root [data-aa-operating-engine] .mb-8 {
      margin-bottom: 1.25rem !important;
    }
    .print-root [data-aa-operating-engine] .mb-16 {
      margin-bottom: 2rem !important;
    }
    .print-root [data-aa-operating-engine] .mb-12 {
      margin-bottom: 1.5rem !important;
    }
    .print-root [data-aa-people-priority],
    .print-root [data-aa-wealth-scores] {
      margin-bottom: 2rem !important;
    }
    .print-root [data-aa-wealth-engine] {
      margin-bottom: 1.5rem !important;
    }
    .print-root [data-aa-playbook-timeline],
    .print-root [data-aa-playbook-phase],
    .print-root [data-aa-playbook-month-grid] {
      margin-bottom: 1.75rem !important;
    }

    /* Wealth first sheet: pack chart + scores + engine card onto one page when possible */
    .print-root #wealth [data-aa-chart-block] {
      margin-bottom: 1.25rem !important;
    }
    .print-root #wealth [data-aa-wealth-scores] {
      margin-bottom: 1.25rem !important;
    }
    .print-root #wealth [data-aa-wealth-engine] .mb-6 {
      margin-bottom: 0.85rem !important;
    }
    .print-root #wealth [data-aa-wealth-archetype-card] {
      padding: 1.25rem 1.5rem !important;
    }
    .print-root #wealth [data-aa-wealth-archetype-card] .text-3xl {
      font-size: 1.5rem !important;
      line-height: 1.25 !important;
      margin-bottom: 0.65rem !important;
    }
    .print-root #wealth [data-aa-wealth-archetype-card] .mb-6 {
      margin-bottom: 0.85rem !important;
    }
    .print-root #wealth [data-aa-wealth-archetype-card] .mb-4 {
      margin-bottom: 0.65rem !important;
    }

    /*
     * Action-plan / What-To-Do:
     * - Cards + columns are break-inside:avoid (above) — never slice mid-list.
     * - Do NOT use break-before:avoid on people action-plan: that pulled the
     *   stars summary onto page 2 and left activations/stars chips stranded
     *   above a cream void (Children Palace). Prefer a clean break before the
     *   whole actions block when it will not fit.
     * - Modest print-only shrink helps header+activations+stars+actions pack.
     */
    .print-root [data-aa-action-plan] {
      padding-top: 1.25rem !important;
    }
    .print-root [data-aa-action-plan] .mb-8 {
      margin-bottom: 1.25rem !important;
    }
    .print-root [data-aa-what-to-do-list] {
      min-height: 0 !important;
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }
    .print-root [data-aa-what-to-do-list] .md\\:p-6 {
      padding: 1rem !important;
    }
    .print-root [data-aa-what-to-do-list] .md\\:space-y-4 > * + * {
      margin-top: 0.65rem !important;
    }
    .print-root [data-aa-what-to-do-list] .text-\\[15px\\] {
      font-size: 0.8rem !important;
      line-height: 1.45 !important;
    }
    .print-root [data-aa-action-plan] .min-h-\\[220px\\] {
      min-height: 0 !important;
    }
    .print-root [data-aa-action-plan] .p-6 {
      padding: 1rem !important;
    }
    .print-root #people [data-aa-action-plan] {
      break-before: auto;
      page-break-before: auto;
    }
    .print-root [data-aa-watch-card],
    .print-root [data-aa-action-column],
    .print-root [data-aa-palace-stars] {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
      min-height: 0 !important;
    }

    /* People palace sheets: modest packing so actions fit with intro more often */
    .print-root #people [data-aa-report-sheet] ~ [data-aa-report-sheet] .space-y-7 > * + * {
      margin-top: 0.85rem !important;
    }
    .print-root #people [data-aa-report-sheet] ~ [data-aa-report-sheet] .p-6.md\\:p-7,
    .print-root #people [data-aa-report-sheet] ~ [data-aa-report-sheet] .md\\:p-7 {
      padding: 0.85rem 1rem !important;
    }
    .print-root #people [data-aa-report-sheet] ~ [data-aa-report-sheet] .text-2xl.md\\:text-3xl,
    .print-root #people [data-aa-report-sheet] ~ [data-aa-report-sheet] .md\\:text-3xl {
      font-size: 1.5rem !important;
      line-height: 1.25 !important;
    }
    .print-root #people [data-aa-report-sheet] ~ [data-aa-report-sheet] .w-28.h-28 {
      width: 5rem !important;
      height: 5rem !important;
    }
    .print-root #people [data-aa-action-plan] {
      padding-top: 0.65rem !important;
    }
    .print-root #people [data-aa-action-plan] .gap-6 {
      gap: 0.75rem !important;
    }
    .print-root #people [data-aa-palace-stars] .mb-3 {
      margin-bottom: 0.5rem !important;
    }
    .print-root #people [data-aa-what-to-do-list] .md\\:p-6 {
      padding: 0.75rem !important;
    }
    .print-root #people [data-aa-what-to-do-list] .md\\:space-y-4 > * + * {
      margin-top: 0.45rem !important;
    }
    .print-root #people [data-aa-watch-card] {
      padding: 0.75rem !important;
    }

    /* Playbook opener: keep year legend on the same page as phase copy */
    .print-root #timing > .mb-16 {
      margin-bottom: 2rem !important;
    }
    .print-root [data-aa-playbook-opener] .mb-12,
    .print-root [data-aa-playbook-opener] .mb-10 {
      margin-bottom: 1.25rem !important;
    }
    .print-root [data-aa-playbook-phase] {
      padding-bottom: 1rem !important;
    }
    .print-root [data-aa-playbook-phase] .text-3xl {
      font-size: 1.5rem !important;
      line-height: 1.25 !important;
      margin-bottom: 0.65rem !important;
    }
    .print-root [data-aa-month-picker] {
      padding: 0.75rem !important;
    }
    .print-root [data-aa-month-picker] > .grid {
      grid-template-columns: repeat(12, minmax(0, 1fr)) !important;
    }
    .print-root [data-aa-month-picker] .py-2\\.5 {
      padding-top: 0.4rem !important;
      padding-bottom: 0.4rem !important;
    }
    .print-root [data-aa-month-picker] .hidden.sm\\:block {
      display: block !important;
    }
    .print-root [data-aa-playbook-timeline],
    .print-root [data-aa-playbook-phase],
    .print-root [data-aa-playbook-month-grid] {
      margin-bottom: 1.25rem !important;
    }

    /*
     * Phase x Wealth sheet can exceed one A4 content box by a few dozen px and
     * leave a cream-only spill page before #people (then #people break-before
     * doubles into a blank interstitial). Tighten sheet so it fits one page.
     */
    .print-root #wealth [data-aa-report-sheet] ~ [data-aa-report-sheet] .mb-10 {
      margin-bottom: 1rem !important;
    }
    .print-root #wealth [data-aa-report-sheet] ~ [data-aa-report-sheet] .text-3xl {
      font-size: 1.5rem !important;
      line-height: 1.25 !important;
    }
    .print-root #wealth [data-aa-report-sheet] ~ [data-aa-report-sheet] .gap-6 {
      gap: 0.85rem !important;
    }
    .print-root #wealth [data-aa-action-plan] .text-sm {
      font-size: 0.8rem !important;
      line-height: 1.45 !important;
    }
    .print-root #wealth [data-aa-action-plan] {
      padding-top: 0.85rem !important;
    }

    /* Months — same sheet inset + capacity 2×2; no font crushing */
    .print-root [data-aa-print-month] {
      display: block !important;
      padding-right: 3.5rem !important;
      padding-bottom: 12mm !important;
      padding-left: 3.5rem !important;
    }
    /*
     * December is last: kill trailing margin/padding that Chromium turns into
     * an empty cream page after the month footer.
     */
    .print-root [data-aa-print-month]:last-child {
      margin-bottom: 0 !important;
      padding-bottom: 8mm !important;
      break-after: avoid;
      page-break-after: avoid;
    }
    .print-root #timing.mb-32 {
      margin-bottom: 0 !important;
    }

    .print-root [data-aa-month-capacity-grid] {
      grid-template-columns: 1fr 1fr !important;
      gap: 1.5rem 2rem !important;
    }

    .print-root [data-aa-month-actions] {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 2rem 3rem !important;
      align-items: start !important;
      break-inside: auto;
      page-break-inside: auto;
    }

    .print-root [data-aa-month-reflection] {
      break-inside: auto;
      page-break-inside: auto;
    }

    .print-root [data-aa-month-footer] {
      display: block !important;
      margin-top: 2.5rem !important;
      padding-top: 1rem !important;
      border-top: 1px solid rgba(232, 221, 208, 0.7);
      font-size: 8px !important;
      font-weight: 600 !important;
      letter-spacing: 0.14em !important;
      text-transform: uppercase !important;
      color: rgba(26, 30, 63, 0.42) !important;
      text-align: right !important;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .print-root [data-aa-month-theme-pill] {
      max-width: 46% !important;
      box-sizing: border-box !important;
    }

    .print-root [data-aa-month-theme-pill] span {
      white-space: normal !important;
      line-height: 1.4 !important;
    }

    [data-aa-month-capacity-bar],
    [data-aa-month-action-row],
    [data-aa-month-reflection-row] {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }

  /* Legacy utility classes (unused by shared chapters; kept for safety) */
  .pp-heading {
    font-size: 26px;
    font-weight: 800;
    color: #1a1e3f;
    margin-bottom: 6px;
    line-height: 1.2;
    font-family: Georgia, "Times New Roman", serif;
  }

  .pp-accent {
    color: #e8642d;
    font-style: italic;
    font-family: Georgia, "Times New Roman", serif;
  }

  .pp-subheading {
    font-size: 13px;
    font-weight: 600;
    color: #1a1e3f;
    margin-bottom: 4px;
  }

  .pp-body {
    font-size: 12px;
    color: #7a6e65;
    line-height: 1.75;
  }

  .pp-card {
    margin-bottom: 20px;
  }

  .pp-callout {
    background: #ffffff;
    border-left: 3px solid #e8642d;
    border-radius: 0 10px 10px 0;
    padding: 16px 20px;
    margin-bottom: 20px;
  }

  .pp-section-header {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #e8642d;
    border-bottom: 1px solid rgba(232,100,45,0.30);
    padding-bottom: 6px;
    margin-bottom: 12px;
  }

  .pp-row {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 12px 0;
    border-bottom: 1px solid rgba(26,30,63,0.07);
  }
  .pp-row:last-child {
    border-bottom: none;
  }

  .pp-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    min-width: 24px;
    border-radius: 50%;
    background: rgba(232,100,45,0.14);
    color: #e8642d;
    font-size: 11px;
    font-weight: 700;
  }

  .pp-dot-green  { background: #16a34a; }
  .pp-dot-yellow { background: #c9873a; }
  .pp-dot-red    { background: #e8642d; }

  /*
   * Monthly Consultation PDF: chapters are sibling <section data-mc-chapter>,
   * not sibling sheets (sheet lives inside section). Break on sections.
   */
  @media print {
    .print-root [data-mc-print-body] > [data-mc-chapter] ~ [data-mc-chapter] {
      break-before: page;
      page-break-before: always;
    }
    .print-root [data-mc-print-body] [data-aa-report-sheet] {
      margin-bottom: 0 !important;
      padding: 3.5rem 3rem !important;
      box-shadow: none !important;
    }
    .print-root [data-mc-print-body] .gap-7 {
      gap: 1.75rem !important;
    }
    .print-root [data-mc-print-body] .mb-12 {
      margin-bottom: 3rem !important;
    }
  }
`;
