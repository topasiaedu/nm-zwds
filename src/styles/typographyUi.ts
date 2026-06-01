/**
 * Brand typography — gold→coral gradient text (navbar logo, premium highlights).
 * Use on neutral surfaces and analysis section heroes (see analysisHeroTitleClass).
 */

/** Clip-text gradient matching navbar wordmark and dashboard featured actions. */
export const brandGradientTextClass = [
  "bg-gradient-to-r from-accent-goldDark to-accent-coralDark bg-clip-text text-transparent",
].join(" ");

/** Analysis section hero titles (purple/orange banners) — same gold→coral as logo. */
export const analysisHeroTitleClass = [
  "text-2xl font-black uppercase tracking-tight sm:text-3xl md:text-4xl",
  brandGradientTextClass,
].join(" ");

export const analysisHeroTitleLargeClass = [
  "text-3xl font-black uppercase tracking-tight sm:text-4xl",
  brandGradientTextClass,
].join(" ");
