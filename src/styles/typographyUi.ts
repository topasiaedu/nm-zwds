/**
 * Brand typography — vivid light-mode accent gradient text.
 * Use on neutral surfaces and analysis section heroes (see analysisHeroTitleClass).
 */

/** Primary clip-text gradient — headers, heroes, navbar wordmark. */
export const brandGradientTextClass = [
  "bg-gradient-to-r from-[#080657] via-[#8B1167] to-[#FE8E01] dark:from-accent-goldDark dark:via-accent-coralDark dark:to-accent-coral bg-clip-text text-transparent",
].join(" ");

/**
 * Secondary clip-text gradient — inline body copy emphasis (coral → orange).
 * Stops: --color-accent-gradient-4 → --color-accent-gradient-5 in color-scheme.css.
 */
export const secondaryBrandGradientTextClass = [
  "bg-gradient-to-r from-[var(--color-brand-gradient-secondary-from)] to-[var(--color-brand-gradient-secondary-to)] bg-clip-text text-transparent",
].join(" ");

/** Filled background using the secondary brand gradient (pills, markers). */
export const secondaryBrandGradientBgClass = [
  "bg-gradient-to-r from-[var(--color-brand-gradient-secondary-from)] to-[var(--color-brand-gradient-secondary-to)]",
].join(" ");

/** Analysis section hero titles — typography only; pair with BrandGradientText for gradient. */
export const analysisHeroTitleClass = [
  "text-2xl font-black uppercase tracking-tight sm:text-3xl md:text-4xl",
].join(" ");

/** Centered hero title — constrains gradient to text width (not full container). */
export const analysisHeroTitleCenteredClass = [
  analysisHeroTitleClass,
  "inline-block w-fit mx-auto",
].join(" ");

export const analysisHeroTitleLargeClass = [
  "text-3xl font-black uppercase tracking-tight sm:text-4xl",
].join(" ");

/** Card / list-row title (h4) — guidance cards, life-area rows, mini-card zodiac name. */
export const analysisCardTitleClass = [
  "font-serif text-base font-bold sm:text-lg",
].join(" ");

/** Named entity within a panel (h3/h4) — palace, archetype, wealth code label. */
export const analysisPanelTitleClass = [
  "font-serif text-xl font-black leading-tight sm:text-2xl",
].join(" ");

/** Eyebrow label above card titles — not a heading. */
export const analysisEyebrowClass = [
  "text-[10px] font-bold uppercase tracking-[0.2em] text-theme-fg-secondary",
].join(" ");
