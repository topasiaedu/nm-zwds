/**
 * Extended per-palace report copy for the monthly forecast HTML report.
 * Sourced from MONTHLY_REPORT_SAMPLE_DATA.md — keyed by palace Chinese name.
 */

export interface PalaceReportCopy {
  /** One-line focus headline for the month. */
  monthsFocus: string;
  /** Palace-specific strategic context for the month. */
  whyThisMonthMatters: string;
  whatToExpect: string;
  primaryGoal: string;
  quickTakeaway: string;
}

export const PALACE_REPORT_COPY: Record<string, PalaceReportCopy> = {
  "官禄": {
    monthsFocus:
      "Step into bigger roles and fight for achievements and growth in your professional life.",
    whyThisMonthMatters:
      "This is your green light season. Doors open easier and people say yes faster. Launch new initiatives and move forward with confidence.",
    whatToExpect:
      "This month activates your Career Palace under Spring energy. This is the perfect window to step into larger responsibilities and upgrade your positioning before the environment forces you to adapt.",
    primaryGoal:
      "Launch at least one new initiative or step into a more visible role this month.",
    quickTakeaway: "Your years of experience are your biggest advantage—leverage them now.",
  },
  "迁移": {
    monthsFocus: "Step outside your comfort zone and explore new territories.",
    whyThisMonthMatters:
      "Movement brings new energy. This is your time to explore, shift environments, and grow through change.",
    whatToExpect:
      "This month channels Travel Palace energy, encouraging you to move beyond familiar boundaries. Consider shifts in markets, departments, or new opportunities that challenge your current setup.",
    primaryGoal:
      "Make at least one significant environmental shift or explore one new territory.",
    quickTakeaway: "New spaces bring new energy—don't wait for perfect timing.",
  },
  "交友": {
    monthsFocus: "Activate your network and build strategic partnerships.",
    whyThisMonthMatters:
      "Your network is your net worth. This month, leverage connections for mutual growth and expansion.",
    whatToExpect:
      "This month highlights your Friends Palace, making it ideal for reconnecting with dormant contacts and building new strategic alliances. Opportunities come through people this month.",
    primaryGoal:
      "Reactivate 3 dormant relationships and create 1 new strategic partnership.",
    quickTakeaway: "Opportunities knock through people—activate your network now.",
  },
  "财帛": {
    monthsFocus: "Activate your resources and monetize what you've already built.",
    whyThisMonthMatters:
      "This is your harvest season. Stop waiting and start activating what you already have. Time to cash in and collect the fruits of your work.",
    whatToExpect:
      "This month shifts into Summer energy through your Wealth Palace. This is the optimal window to review investments, monetize skills, and turn accumulated knowledge into income streams.",
    primaryGoal:
      "Complete a full portfolio review and monetize at least one underutilized skill.",
    quickTakeaway: "Your resources are meant to work for you—activate them now.",
  },
  "田宅": {
    monthsFocus: "Optimize what you already own and make it work harder.",
    whyThisMonthMatters:
      "Use your foundations as a springboard. Optimize, upgrade, and leverage what you've built.",
    whatToExpect:
      "This month activates your Property Palace, creating opportunities to optimize assets and strengthen family foundations. This is about maximizing returns from what you already possess.",
    primaryGoal:
      "Complete market research and implement one optimization to increase asset returns.",
    quickTakeaway: "You're sitting on more value than you realize—optimize it.",
  },
  "福德": {
    monthsFocus: "Align your inner state with your outer wealth goals.",
    whyThisMonthMatters:
      "Your inner superpower is your hidden money palace. Align your energy, sharpen your instincts, and watch wealth flow more naturally.",
    whatToExpect:
      "This month channels Wellbeing Palace energy—your hidden money palace. During this period, inner alignment directly impacts outer wealth. Sharpen decision-making and reduce overthinking.",
    primaryGoal:
      "Identify and shift one major inner pattern that's sabotaging your external success.",
    quickTakeaway: "Your outer wealth reflects your inner state—align from within.",
  },
  "夫妻": {
    monthsFocus: "Cut emotional noise and realign key partnerships.",
    whyThisMonthMatters:
      "This is your safety net season. Cut emotional noise, patch up holes, and strengthen your foundation. Protect what you've built.",
    whatToExpect:
      "This month transitions to Autumn through the Spouse Palace. Address unspoken frustrations in partnerships (personal and professional) and bring clarity to misaligned expectations.",
    primaryGoal:
      "Have one difficult conversation that needs to happen to realign a key partnership.",
    quickTakeaway: "Address it now before emotional clutter becomes a crisis.",
  },
  "兄弟": {
    monthsFocus: "Clean up your circle and filter connections.",
    whyThisMonthMatters:
      "Quality over quantity. Identify who's adding value vs. noise, and invest in real alliances.",
    whatToExpect:
      "This month activates the Siblings Palace under Autumn energy. This is the ideal time to clean up your circle and focus on quality connections that challenge and support your growth.",
    primaryGoal:
      "Set clear boundaries with energy-draining connections and strengthen 2–3 real alliances.",
    quickTakeaway: "Not everyone deserves a seat at your next-season table.",
  },
  "子女": {
    monthsFocus: "Structure your legacy and cut emotional procrastination.",
    whyThisMonthMatters:
      "Stop letting worry run the show. Structure your legacy clearly and support wisely based on facts, not fear.",
    whatToExpect:
      "This month channels Children Palace energy, urging you to face emotional patterns and create clear plans for what you're building or passing down.",
    primaryGoal:
      "Create one clear plan for your legacy or what you're building for the future.",
    quickTakeaway: "Structure beats worry—build with clarity, not fear.",
  },
  "父母": {
    monthsFocus: "Own your story and break free from old patterns.",
    whyThisMonthMatters:
      "Face old patterns from your past and cut through fear-based thinking with clarity and responsibility.",
    whatToExpect:
      "This month activates the Parents Palace, challenging you to address how authority figures and childhood narratives shape your current decisions.",
    primaryGoal:
      "Identify one old pattern from your past and take concrete steps to break free from it.",
    quickTakeaway: "Own your story without blame—your past is context, not control.",
  },
  "命宫": {
    monthsFocus: "Invest in yourself and rebuild your edge.",
    whyThisMonthMatters:
      "Quietly sharpen your sword and rebuild your arsenal. This is your reload season—prepare yourself for when the season turns.",
    whatToExpect:
      "This month enters Winter through your Life Palace. This is prime time for self-investment, skill upgrades, and strengthening your personal foundation before Spring returns.",
    primaryGoal:
      "Enroll in one course or commit to one meaningful skill upgrade this month.",
    quickTakeaway: "Winter is for you—invest in yourself now, reap later.",
  },
  "疾厄": {
    monthsFocus: "Repair, recalibrate, and restore your body intentionally.",
    whyThisMonthMatters:
      "Slow down now before you're forced to stop completely. Treat this as your preparation window—restore your strength.",
    whatToExpect:
      "This month activates the Health Palace under Winter energy. Address warning signs before they become emergencies and build sustainable routines to carry you into the new year.",
    primaryGoal:
      "Complete a full health checkup and establish one sustainable wellness routine.",
    quickTakeaway: "Your body carries your future—protect it now.",
  },
};
