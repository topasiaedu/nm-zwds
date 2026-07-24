/**
 * Content libraries for Monthly Consultation differentiators.
 * Keyed by natal palace name (simplified Chinese). Template vars:
 * {{star}}, {{transformation}}, {{palace}}, {{palaceEn}}, {{season}}
 */

import type { LiuMonthSeason } from "../timing/liuMonthGuidance";
import {
  activationLandingEnglish,
  formatActivationPlain,
  liuSeasonShort,
  SI_HUA_LABEL,
  SI_HUA_PLAIN,
  starToEnglish,
} from "./englishLabels";
import {
  getPrimaryActivation,
  resolveExpansionStance,
  urgencyLabelForRank,
  type ExpansionStance,
} from "./signalPriority";
import type {
  ActivationCard,
  AspectLifePlaybook,
  CautionItem,
  ConvergenceResult,
  DecisionRow,
  DecisionVerdict,
  DimensionScorecard,
  FailureMode,
  FocusStarSource,
  MonthArchetype,
  MonthContract,
  MonthScript,
  MonthlyStarSnapshot,
  OperationalClose,
  PersonalLetter,
  PriorMonthBriefing,
  SiHuaKind,
  SomaticSignal,
  StarSpotlightRow,
  StemSiHuaActivation,
  WeekPlanRow,
} from "./types";

type PalaceKey = string;

interface PalaceContent {
  archetype: Omit<MonthArchetype, "description" | "identityLine"> & {
    descriptionTemplate: string;
    identityTemplate: string;
  };
  failure: Omit<FailureMode, "description" | "howItShows" | "exitMove"> & {
    descriptionTemplate: string;
    howItShowsTemplates: string[];
    exitMoveTemplate: string;
  };
  somatic: SomaticSignal;
  letterTemplates: {
    body: string[];
    closing: string;
  };
}

/**
 * Replace {{var}} placeholders in a template string.
 */
export const injectVars = (
  template: string,
  vars: Record<string, string>
): string => {
  return template.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    const value = vars[key];
    return value !== undefined ? value : "";
  });
};

const BASE: Record<PalaceKey, PalaceContent> = {
  "官禄": {
    archetype: {
      code: "CRR-LAUNCH",
      name: "The Visibility Launch Window",
      descriptionTemplate:
        "This month highlights your Career area. With {{star}} bringing a {{transformation}} signal, visible progress matters more than quiet overtime.",
      identityTemplate:
        "I will put one clear win where people can actually see it.",
      signatureBehaviors: [
        "You want more ownership at work",
        "Quiet hard work starts to feel not enough",
        "Good timing for being noticed",
      ],
    },
    failure: {
      name: "Working Hard but Staying Invisible",
      triggerCode: "CRR-FAIL",
      descriptionTemplate:
        "The common mistake this month is doing more work without showing it. With {{star}} bringing a {{transformation}} push, quiet overtime rarely gets rewarded if decision-makers never see the result.",
      howItShowsTemplates: [
        "You keep saying yes to tasks that never reach the people who decide pay or role",
        "You delay the update or deliverable that would show your progress",
      ],
      exitMoveTemplate:
        "Before mid-month, send one finished work sample to a decision-maker, or ask in writing for one clearer responsibility.",
    },
    somatic: {
      elementPressure:
        "Work stress this month often shows up as tight shoulders or neck, and staying up late after long work days.",
      weekSignals: [
        { week: "Week 1", signal: "Your mind may race. You may feel a strong urge to prove yourself." },
        { week: "Week 2", signal: "Shoulders or neck may tighten before important asks or meetings." },
        { week: "Week 3", signal: "Drive is highest. Sleep well the night before any big conversation." },
        { week: "Week 4", signal: "You feel lighter if you showed your work. You feel drained if you only ground without being seen." },
      ],
      protocol: [
        "Get at least 7 hours of sleep before any important ask",
        "Stretch your neck and shoulders after long focus blocks",
        "Do not have hard work talks after 9pm",
      ],
    },
    letterTemplates: {
      body: [
        "{{name}}, this career-focused month is not asking you to be louder for no reason. It is asking you to make {{star}}'s {{transformation}} signal visible.",
        "In a {{season}} season: launch what is ready. Skip theatre.",
      ],
      closing: "Be clear. Be visible. Rest on purpose.",
    },
  },
  "迁移": {
    archetype: {
      code: "TRV-SHIFT",
      name: "The Fresh Territory Window",
      descriptionTemplate:
        "This month highlights Travel and change. {{star}} with a {{transformation}} signal favors new spaces, markets, or routines, not staying stuck.",
      identityTemplate:
        "I will make one deliberate move outside my usual map.",
      signatureBehaviors: [
        "Your current environment feels tighter",
        "New invites feel more interesting",
        "Comfort starts to feel costly",
      ],
    },
    failure: {
      name: "Always Researching, Never Moving",
      triggerCode: "TRV-FAIL",
      descriptionTemplate:
        "The common mistake this month is endless research with no real step. {{star}}'s {{transformation}} push favors one deliberate move, not browsing forever.",
      howItShowsTemplates: [
        "You look at three options and choose none",
        "You wait for perfect timing that never arrives",
      ],
      exitMoveTemplate:
        "Before week 3, pick one new place, role, or market and take one real step: book, apply, or work there for a day.",
    },
    somatic: {
      elementPressure:
        "Change-heavy months often bring restless nights before trips, and tiredness from moving around.",
      weekSignals: [
        { week: "Week 1", signal: "You may feel restless and want to leave your usual routine." },
        { week: "Week 2", signal: "Unclear plans can create schedule stress and scattered energy." },
        { week: "Week 3", signal: "This is usually the best week to try a new place, market, or setup." },
        { week: "Week 4", signal: "Slow down and settle what the change taught you before the next move." },
      ],
      protocol: [
        "Drink water and keep sleep times steady when you travel or change location",
        "Sort logistics early so travel feels planned, not chaotic",
        "Keep one recovery day after a big trip or move",
      ],
    },
    letterTemplates: {
      body: [
        "{{name}}, movement helps this month, but only with a reason. {{star}}'s {{transformation}} signal points to one territory shift, not endless browsing.",
      ],
      closing: "Move once, on purpose. Then let the new setting work for you.",
    },
  },
  "交友": {
    archetype: {
      code: "NET-ALLIANCE",
      name: "The Real Alliance Window",
      descriptionTemplate:
        "This month highlights friends and networks. {{star}} with a {{transformation}} signal means opportunities come through people.",
      identityTemplate:
        "I will turn one real connection into a clear next step, not just collect names.",
      signatureBehaviors: [
        "Old contacts may reappear",
        "Networking feels more important",
        "You notice who helps and who drains you",
      ],
    },
    failure: {
      name: "Collecting Contacts, Skipping Relationships",
      triggerCode: "NET-FAIL",
      descriptionTemplate:
        "The common mistake this month is adding names without real follow-up. In a {{palaceEn}} month, {{star}}'s {{transformation}} push rewards one real next step with a person, not a longer contact list.",
      howItShowsTemplates: [
        "You add contacts and never message them again",
        "You stay socially busy with no clear ask or offer",
      ],
      exitMoveTemplate:
        "Message three quiet contacts. With one, book a call or send one clear ask before month-end.",
    },
    somatic: {
      elementPressure:
        "Busy people months can strain your voice and leave you socially tired after too many talks.",
      weekSignals: [
        { week: "Week 1", signal: "Your calendar may fill faster than usual." },
        { week: "Week 2", signal: "Your voice or throat may feel tired if you talk all day." },
        { week: "Week 3", signal: "It becomes clearer who gives you energy and who drains you." },
        { week: "Week 4", signal: "You need quiet time to settle new connections." },
      ],
      protocol: [
        "Limit late social nights and protect easy mornings",
        "Drink water on talk-heavy days",
        "End one draining obligation this month",
      ],
    },
    letterTemplates: {
      body: [
        "{{name}}, people open doors this month. {{star}}'s {{transformation}} signal is about real alliances, not popularity.",
      ],
      closing: "Reach out clearly. Follow through once.",
    },
  },
  "财帛": {
    archetype: {
      code: "WLT-ACTIVATE",
      name: "The Money Activation Window",
      descriptionTemplate:
        "This month highlights Wealth. {{star}} with a {{transformation}} signal favors using what you already have, not wild new bets.",
      identityTemplate:
        "I will put idle money or skills to work, instead of chasing the next shiny tip.",
      signatureBehaviors: [
        "Money choices feel louder",
        "Unused skills look sellable",
        "A review of income and costs feels necessary",
      ],
    },
    failure: {
      name: "Leaving Value Idle",
      triggerCode: "WLT-FAIL",
      descriptionTemplate:
        "The common mistake this month is letting money, invoices, or skills sit unused while you wait for a perfect tip. With {{star}} bringing a {{transformation}} push, progress comes from activating what you already hold.",
      howItShowsTemplates: [
        "You ignore invoices or skip a price review",
        "You follow old money advice that no longer fits you",
      ],
      exitMoveTemplate:
        "List this month's income, costs, and unpaid invoices on one page. Then raise a price, send an invoice, or list one skill for sale.",
    },
    somatic: {
      elementPressure:
        "Money stress often hits the stomach and sleep before you make a big financial choice.",
      weekSignals: [
        { week: "Week 1", signal: "You may feel pressure to do something with money right away." },
        { week: "Week 2", signal: "Appetite or sleep may swing around money talks or decisions." },
        { week: "Week 3", signal: "Best week for a calm money review with clear numbers on paper." },
        { week: "Week 4", signal: "Close open money loops. Avoid emotional spending." },
      ],
      protocol: [
        "Make money decisions only after you have slept and eaten",
        "Write your spending or investing rule before you act",
        "Keep comfort shopping separate from strategy spending",
      ],
    },
    letterTemplates: {
      body: [
        "{{name}}, this is a collect-and-activate money month. {{star}}'s {{transformation}} signal wants you to use what you already hold.",
      ],
      closing: "Review. Clarify. Then put money to work.",
    },
  },
  "田宅": {
    archetype: {
      code: "AST-OPTIMIZE",
      name: "The Home and Assets Window",
      descriptionTemplate:
        "This month highlights Property and foundations. {{star}} with a {{transformation}} signal asks you to upgrade what you already own.",
      identityTemplate:
        "I will improve what I already have before buying the next thing.",
      signatureBehaviors: [
        "Home or base issues need attention",
        "Assets may look underused",
        "Family logistics matter more",
      ],
    },
    failure: {
      name: "Sitting on Unused Value",
      triggerCode: "AST-FAIL",
      descriptionTemplate:
        "The common mistake this month is calling your base 'fine' while home, assets, or systems quietly underperform. {{star}}'s {{transformation}} push asks you to upgrade what you already own.",
      howItShowsTemplates: [
        "You skip a basic check on something you own",
        "You ignore home or family tension that weakens your base",
      ],
      exitMoveTemplate:
        "Pick one home, tool, or asset that wastes time weekly. Get a quote, book a repair, or finish one upgrade.",
    },
    somatic: {
      elementPressure:
        "Home and foundation months often bring lower-back tension and restless sleep when chores and admin pile up.",
      weekSignals: [
        { week: "Week 1", signal: "Home or admin backlog becomes hard to ignore." },
        { week: "Week 2", signal: "You feel more tired if you keep putting base work off." },
        { week: "Week 3", signal: "Best week to fix or upgrade one home or asset system." },
        { week: "Week 4", signal: "Settle into the improved routine and keep it simple." },
      ],
      protocol: [
        "Schedule one admin block each week",
        "Walk after long sitting sessions",
        "Close one open loop at home before new spending",
      ],
    },
    letterTemplates: {
      body: [
        "{{name}}, this month is about foundations. {{star}}'s {{transformation}} signal reminds you that unused value is still a choice.",
      ],
      closing: "Upgrade the base. Then stand on it.",
    },
  },
  "福德": {
    archetype: {
      code: "INN-ALIGN",
      name: "The Inner Clarity Window",
      descriptionTemplate:
        "This month highlights Wellbeing and inner state. {{star}} with a {{transformation}} signal means your yes/no clarity affects outer results.",
      identityTemplate:
        "I will get clear inside before I push harder outside.",
      signatureBehaviors: [
        "Overthinking costs more energy",
        "Instinct works better when you rest",
        "Outer results follow inner clarity",
      ],
    },
    failure: {
      name: "Thinking in Circles",
      triggerCode: "INN-FAIL",
      descriptionTemplate:
        "The common mistake this month is replaying the same decision without choosing. {{star}}'s {{transformation}} push rewards one clear yes or no, not working harder while you stay stuck in doubt.",
      howItShowsTemplates: [
        "You replay the same decision for days",
        "You say yes to draining noise while postponing the real choice",
      ],
      exitMoveTemplate:
        "Write one pending choice as a yes or no. Then block time for the yes, or decline one conflicting invite.",
    },
    somatic: {
      elementPressure:
        "When your mind is overloaded, sleep gets lighter and your body holds tension from overthinking.",
      weekSignals: [
        { week: "Week 1", signal: "Mental noise rises. Small decisions feel heavier." },
        { week: "Week 2", signal: "Sleep gets worse if you leave big decisions unfinished." },
        { week: "Week 3", signal: "Clarity improves if you protect rest and stop late scrolling." },
        { week: "Week 4", signal: "Turn one clear decision into a simple habit you can keep." },
      ],
      protocol: [
        "Write one decision rule before sleep",
        "Cut late screens on noisy-mind nights",
        "Walk outdoors after heavy thinking",
      ],
    },
    letterTemplates: {
      body: [
        "{{name}}, this is not a soft break from life. {{star}}'s {{transformation}} signal says your outer map follows your inner yes.",
      ],
      closing: "Decide cleanly. Then rest into it.",
    },
  },
  "夫妻": {
    archetype: {
      code: "SPR-W07",
      name: "The Partnership Clarity Window",
      descriptionTemplate:
        "This month highlights partnerships (romantic or business). {{star}} with a {{transformation}} signal favors honest clarity over forced expansion.",
      identityTemplate:
        "I am not losing speed. I am clearing relationship drag so next month can move cleanly.",
      signatureBehaviors: [
        "You notice tone and unspoken tension more",
        "Small issues feel louder",
        "Being 'nice' without being clear creates avoidance",
      ],
    },
    failure: {
      name: "The Peace Tax",
      triggerCode: "SPR-FAIL",
      descriptionTemplate:
        "The common mistake this month is saying \"it is fine\" to keep peace, then losing a week of focus. With {{star}} bringing a {{transformation}} push, small unclear yeses get expensive fast.",
      howItShowsTemplates: [
        "You agree to a few small favors that steal your focus",
        "You avoid the one clear conversation that would fix the leak",
      ],
      exitMoveTemplate:
        "Before day 12, have a 20-minute clarity talk. Write what you agreed, what stays open, and the next check-in.",
    },
    somatic: {
      elementPressure:
        "Partnership months often affect sleep and digestion when you put off a hard talk.",
      weekSignals: [
        { week: "Week 1", signal: "Social fatigue rises. You may need more alone time." },
        { week: "Week 2", signal: "Sleep breaks if you keep postponing a hard conversation." },
        { week: "Week 3", signal: "Jaw, neck, or lower back may tighten after relationship stress." },
        { week: "Week 4", signal: "You feel relief if clarity arrived. You feel foggy if you only kept the peace." },
      ],
      protocol: [
        "Protect at least 7 hours of sleep",
        "Do not have high-stakes talks after 9pm",
        "Walk after emotionally heavy conversations",
      ],
    },
    letterTemplates: {
      body: [
        "{{name}}, partnership months often feel like “nothing is wrong, just slightly off.” That slight-off feeling matters. {{star}}'s {{transformation}} signal is asking for honesty.",
        "You do not need to become harsher. You need to become clearer.",
      ],
      closing: "Speak specifically. Rest on purpose. Keep your softness with a spine.",
    },
  },
  "兄弟": {
    archetype: {
      code: "CIR-FILTER",
      name: "The Circle Filter Window",
      descriptionTemplate:
        "This month highlights peers and close circle. {{star}} with a {{transformation}} signal asks for quality of people over loyalty by habit.",
      identityTemplate:
        "Not everyone needs a seat at my next chapter.",
      signatureBehaviors: [
        "Old friendships get a quiet re-check",
        "Gossip and drains feel harder to tolerate",
        "True allies become easier to spot",
      ],
    },
    failure: {
      name: "Loyalty Without Fit",
      triggerCode: "CIR-FAIL",
      descriptionTemplate:
        "The common mistake this month is keeping people around only because of history, not because they still fit. {{star}}'s {{transformation}} push asks for quality of circle over loyalty by habit.",
      howItShowsTemplates: [
        "You tolerate drains so you do not look cold",
        "You give equal energy to unequal relationships",
      ],
      exitMoveTemplate:
        "Name one drain. Say or send one stop sentence once. Then book two check-ins with people who help you.",
    },
    somatic: {
      elementPressure:
        "When you are filtering your circle, you may feel socially drained and hold tension in your jaw from boundaries you have not said yet.",
      weekSignals: [
        { week: "Week 1", signal: "Group noise and group chats feel more irritating." },
        { week: "Week 2", signal: "A boundary talk feels overdue with someone who drains you." },
        { week: "Week 3", signal: "You feel lighter after one clean boundary." },
        { week: "Week 4", signal: "Put energy back into the people who still fit." },
      ],
      protocol: [
        "Write the boundary before you speak it",
        "Limit group chats during weeks when you feel overloaded",
        "Sleep before making social decisions",
      ],
    },
    letterTemplates: {
      body: [
        "{{name}}, this month filters your table. {{star}}'s {{transformation}} signal is about capacity, not coldness.",
      ],
      closing: "Choose your circle for the season you are entering.",
    },
  },
  "子女": {
    archetype: {
      code: "LEG-STRUCT",
      name: "The Plans and Legacy Window",
      descriptionTemplate:
        "This month highlights projects, creativity, and what you are building. {{star}} with a {{transformation}} signal asks for structure over worry.",
      identityTemplate:
        "I will build with a plan, not with worry pretending to be love.",
      signatureBehaviors: [
        "Worries about the future rise",
        "Projects need clearer ownership",
        "Caretaking can tip into overdoing",
      ],
    },
    failure: {
      name: "Worry Posing as Work",
      triggerCode: "LEG-FAIL",
      descriptionTemplate:
        "The common mistake this month is worrying in a way that feels productive while nothing is actually planned. With {{star}} bringing a {{transformation}} push, a written plan beats looping care.",
      howItShowsTemplates: [
        "You carry other people's problems without a plan",
        "You put off the real plan because it feels emotional",
      ],
      exitMoveTemplate:
        "Write a one-page plan: goal, next action, date. Do the next action on that date.",
    },
    somatic: {
      elementPressure:
        "When plans stay only in your head, worry can show up as chest tightness.",
      weekSignals: [
        { week: "Week 1", signal: "Worry rises when nothing is written down yet." },
        { week: "Week 2", signal: "Best week to put one plan on paper with a next date." },
        { week: "Week 3", signal: "Feelings get heavier if you only caretake and never plan." },
        { week: "Week 4", signal: "You feel calmer once a written plan exists." },
      ],
      protocol: [
        "Turn worry into a written plan",
        "Cap caretaking hours so you do not empty yourself",
        "Breathe before hard planning talks",
      ],
    },
    letterTemplates: {
      body: [
        "{{name}}, a simple written plan beats looping worry. {{star}}'s {{transformation}} signal wants something you can hold.",
      ],
      closing: "Write it down. Then support from clarity.",
    },
  },
  "父母": {
    archetype: {
      code: "PAT-OWN",
      name: "The Pattern Ownership Window",
      descriptionTemplate:
        "This month highlights old authority patterns and life scripts. {{star}} with a {{transformation}} signal asks you to own them, not blame them forever.",
      identityTemplate:
        "My past explains me. It does not control me.",
      signatureBehaviors: [
        "Old stories show up in current choices",
        "Bosses or elders feel louder",
        "Fear-based thinking wants an update",
      ],
    },
    failure: {
      name: "Using the Past as an Excuse",
      triggerCode: "PAT-FAIL",
      descriptionTemplate:
        "The common mistake this month is pointing backwards at family or old bosses instead of choosing forwards. {{star}}'s {{transformation}} push asks you to own the old pattern, then take one opposite action.",
      howItShowsTemplates: [
        "You blame family patterns for present inaction",
        "You react from an old fear script with bosses or mentors",
      ],
      exitMoveTemplate:
        "Write one old rule in one sentence. Then do the opposite once: ask in writing, say no, or stop apologizing.",
    },
    somatic: {
      elementPressure:
        "Old-pattern months often hit the gut, and tension rises before talks with bosses, parents, or mentors.",
      weekSignals: [
        { week: "Week 1", signal: "Old family or authority stories may replay in your mind." },
        { week: "Week 2", signal: "Gut tension rises before a talk where you need to own your choice." },
        { week: "Week 3", signal: "Things ease if you speak one clear truth out loud." },
        { week: "Week 4", signal: "Lock the new rule with one action, not only a feeling." },
      ],
      protocol: [
        "Write the new rule before the conversation",
        "Do not process heavy topics alone past midnight",
        "Walk before intense family or authority talks",
      ],
    },
    letterTemplates: {
      body: [
        "{{name}}, this month asks for ownership without self-punishment. {{star}}'s {{transformation}} signal is a chance to update the script.",
      ],
      closing: "",
    },
  },
  "命宫": {
    archetype: {
      code: "SLF-REBUILD",
      name: "The Self-Investment Window",
      descriptionTemplate:
        "This month highlights you. {{star}} with a {{transformation}} signal supports skill upgrades and habit rebuilds before the next growth season.",
      identityTemplate:
        "This is my rebuild month. I invest in the person who will carry the next climb.",
      signatureBehaviors: [
        "Urge to learn or retrain",
        "Habit changes feel more possible",
        "Pouring into everyone else feels costly",
      ],
    },
    failure: {
      name: "Helping Everyone Except Yourself",
      triggerCode: "SLF-FAIL",
      descriptionTemplate:
        "The common mistake this month is upgrading everyone else's life while skipping your own rebuild. With {{star}} bringing a {{transformation}} push, self-investment is the real work.",
      howItShowsTemplates: [
        "You skip the course or practice you meant to start",
        "You hit the same ceiling without changing a skill",
      ],
      exitMoveTemplate:
        "Choose one skill. Enroll in one course, or complete five practice sessions before month-end.",
    },
    somatic: {
      elementPressure:
        "Self-rebuild months need recovery. Fatigue shows up faster when you keep giving to everyone else first.",
      weekSignals: [
        { week: "Week 1", signal: "You may want to step back from busywork so you can rebuild." },
        { week: "Week 2", signal: "Best learning week if you actually rest, not only schedule rest." },
        { week: "Week 3", signal: "Temptation rises to rescue others again and drop your own plan." },
        { week: "Week 4", signal: "Lock one habit upgrade you can keep next month." },
      ],
      protocol: [
        "Block two learning or recovery sessions each week and keep them",
        "Say no to one optional rescue",
        "Treat sleep as a non-negotiable part of performance",
      ],
    },
    letterTemplates: {
      body: [
        "{{name}}, this is reload time, not retreat. {{star}}'s {{transformation}} signal asks you to become more, not only do more.",
      ],
      closing: "Invest in yourself now. Reap when the season turns.",
    },
  },
  "疾厄": {
    archetype: {
      code: "BOD-RESTORE",
      name: "The Body Restore Window",
      descriptionTemplate:
        "This month highlights Health. {{star}} with a {{transformation}} signal asks for repair before your body forces a stop.",
      identityTemplate:
        "I will care for the body that carries every other goal.",
      signatureBehaviors: [
        "Fatigue signals get louder",
        "Willpower starts compensating for rest",
        "Simple maintenance becomes strategic",
      ],
    },
    failure: {
      name: "I’ll Rest Later",
      triggerCode: "BOD-FAIL",
      descriptionTemplate:
        "The common mistake this month is pushing through early body warnings and telling yourself you will rest later. With {{star}} bringing a {{transformation}} push, repair now is cheaper than a forced stop later.",
      howItShowsTemplates: [
        "You ignore sleep or pain signals",
        "You cover tiredness with caffeine and force",
      ],
      exitMoveTemplate:
        "Book the delayed checkup, or put three fixed sleep or rest blocks on your calendar and keep them.",
    },
    somatic: {
      elementPressure:
        "Health-focus months make the weak link loud: tiredness, inflammation, or sleep debt you have been ignoring.",
      weekSignals: [
        { week: "Week 1", signal: "Your body sends early warnings. Listen before they get louder." },
        { week: "Week 2", signal: "Symptoms get louder if you keep pushing through them." },
        { week: "Week 3", signal: "Recovery goes better if you already slowed down earlier." },
        { week: "Week 4", signal: "Put one sustainable routine in place you can keep next month." },
      ],
      protocol: [
        "Book the checkup you postponed",
        "Reduce one stimulant dependency (coffee, energy drinks, or late screens)",
        "Treat sleep like a meeting you cannot skip",
      ],
    },
    letterTemplates: {
      body: [
        "{{name}}, taking care of your body is not weakness. {{star}}'s {{transformation}} signal is maintenance for everything else you want.",
      ],
      closing: "Slow down on purpose, before life slows you down.",
    },
  },
};

const FALLBACK = BASE["命宫"];

/**
 * Lookup palace content with fallback to Life Palace templates.
 */
const getPalaceContent = (palaceName: string): PalaceContent => {
  return BASE[palaceName] ?? FALLBACK;
};

/**
 * Build archetype with Si Hua variables injected (ranked primary / Ji-first).
 */
export const buildArchetype = (
  palaceName: string,
  palaceNameEnglish: string,
  season: LiuMonthSeason,
  activations: StemSiHuaActivation[]
): MonthArchetype => {
  const content = getPalaceContent(palaceName);
  const primary = getPrimaryActivation(activations, season);
  const vars = {
    star: primary !== undefined ? starToEnglish(primary.starName) : "your timing",
    transformation: primary !== undefined ? SI_HUA_LABEL[primary.kind] : "focus",
    palace: palaceNameEnglish,
    palaceEn: palaceNameEnglish,
    season: liuSeasonShort(season),
  };
  return {
    code: content.archetype.code,
    name: content.archetype.name,
    description: injectVars(content.archetype.descriptionTemplate, vars),
    identityLine: injectVars(content.archetype.identityTemplate, vars),
    signatureBehaviors: content.archetype.signatureBehaviors,
  };
};

/**
 * Build failure mode with Si Hua variables injected (ranked primary / Ji-first).
 */
export const buildFailureMode = (
  palaceName: string,
  palaceNameEnglish: string,
  activations: StemSiHuaActivation[],
  season: LiuMonthSeason
): FailureMode => {
  const content = getPalaceContent(palaceName);
  const primary = getPrimaryActivation(activations, season);
  const vars = {
    star: primary !== undefined ? starToEnglish(primary.starName) : "this month's pattern",
    transformation: primary !== undefined ? SI_HUA_LABEL[primary.kind] : "focus",
    palace: palaceNameEnglish,
    palaceEn: palaceNameEnglish,
  };
  return {
    name: content.failure.name,
    triggerCode: content.failure.triggerCode,
    description: injectVars(content.failure.descriptionTemplate, vars),
    howItShows: content.failure.howItShowsTemplates.map((t) => injectVars(t, vars)),
    exitMove: injectVars(content.failure.exitMoveTemplate, vars),
  };
};

/**
 * Return somatic content for the palace.
 */
export const buildSomatic = (palaceName: string): SomaticSignal => {
  return getPalaceContent(palaceName).somatic;
};

/** Inputs for the Should I…? decision board. */
export interface BuildDecisionsArgs {
  season: LiuMonthSeason;
  activations: StemSiHuaActivation[];
  palaceNameEnglish: string;
  priority: string;
  primaryMove: string;
  /** Timing Sync band so Wait/No cannot contradict Sync tips. */
  convergenceBand: ConvergenceResult["band"];
  /** Shared month action stance when already resolved upstream. */
  stance?: ExpansionStance;
}

/**
 * One short chart-reason line (kept brief for the decision board).
 */
const shortDecisionWhy = (
  palaceNameEnglish: string,
  seasonShort: string,
  cue: string
): string => {
  const palace = palaceNameEnglish.replace(/ Palace$/i, "");
  const cleaned = sanitizeReportCopy(cue).trim();
  if (cleaned.length === 0) {
    return `${palace}, ${seasonShort} season.`;
  }
  return `${palace}, ${seasonShort}. ${cleaned}`;
};

/**
 * Ensure the board includes at least one Wait or No when launches should wait.
 * Downgrades the weakest expansion/spend row if heuristics missed the hierarchy.
 */
const ensureWaitOrNo = (
  rows: DecisionRow[],
  stance: ExpansionStance
): DecisionRow[] => {
  const hasBlock = rows.some((row) => row.rating === "wait" || row.rating === "no");
  if (hasBlock || stance.allowNewLaunch) {
    return rows;
  }
  const launchIndex = rows.findIndex((row) =>
    row.decision.toLowerCase().includes("new career launch")
  );
  const targetIndex = launchIndex >= 0 ? launchIndex : 0;
  return rows.map((row, index) => {
    if (index !== targetIndex) {
      return row;
    }
    const downgraded: DecisionRow = {
      ...row,
      rating: "wait",
      why: "This month wants repair first, not a new launch.",
      coaching: "Hold the launch. Finish clarity work first.",
    };
    return downgraded;
  });
};

/**
 * Decision board: short question, verdict, one tip. Shared expansion stance.
 */
export const buildDecisions = (args: BuildDecisionsArgs): DecisionRow[] => {
  const {
    season,
    activations,
    palaceNameEnglish,
    priority,
    primaryMove,
    convergenceBand,
    stance: stanceArg,
  } = args;
  const stance =
    stanceArg
    ?? resolveExpansionStance({
      season,
      activations,
      priority,
      primaryMove,
      convergenceBand,
    });
  const seasonShort = liuSeasonShort(season);

  const launchRating = ((): DecisionVerdict => {
    if (stance.allowNewLaunch && stance.expansionBias === "press") {
      return "hard-yes";
    }
    if (stance.allowNewLaunch && stance.expansionBias === "prepare") {
      return "soft-yes";
    }
    if (stance.isRepairSeason && stance.hasChallenge) {
      return "no";
    }
    return "wait";
  })();

  const purchaseRating = ((): DecisionVerdict => {
    if (stance.allowNewLaunch && stance.hasProsperity && stance.expansionBias === "press") {
      return "soft-yes";
    }
    if (!stance.allowNewLaunch || stance.isRepairSeason || stance.hasChallenge) {
      return "wait";
    }
    return "wait";
  })();

  const newPartnerRating = ((): DecisionVerdict => {
    if (stance.isRepairSeason) {
      return "no";
    }
    if (stance.hasChallenge || !stance.allowNewLaunch) {
      return "wait";
    }
    if (stance.hasProsperity && stance.expansionBias === "press") {
      return "soft-yes";
    }
    return "wait";
  })();

  const rows: DecisionRow[] = [
    {
      decision: "Rewrite an existing agreement?",
      rating:
        stance.isRepairSeason || stance.hasChallenge ? "hard-yes" : "soft-yes",
      why: shortDecisionWhy(
        palaceNameEnglish,
        seasonShort,
        stance.isRepairSeason || stance.hasChallenge
          ? "Clarity talks are favored."
          : "Clarity still helps."
      ),
      coaching: "Write expectations down.",
    },
    {
      decision: "Start a brand-new long partnership?",
      rating: newPartnerRating,
      why: shortDecisionWhy(
        palaceNameEnglish,
        seasonShort,
        stance.isRepairSeason || stance.hasChallenge
          ? "Fix what exists first."
          : stance.stanceReason
      ),
      coaching:
        newPartnerRating === "no" || newPartnerRating === "wait"
          ? "Clean up existing deals first."
          : "Proceed only with written terms.",
    },
    {
      decision: "New career launch or public rebrand?",
      rating: launchRating,
      why: shortDecisionWhy(
        palaceNameEnglish,
        seasonShort,
        stance.stanceReason
      ),
      coaching:
        launchRating === "hard-yes"
          ? "Launch what is ready."
          : launchRating === "soft-yes"
            ? "Launch after one proof checkpoint."
            : "Prepare quietly. Announce later.",
    },
    {
      decision: "Have the hard talk you avoided?",
      rating:
        stance.hasChallenge || stance.isRepairSeason ? "hard-yes" : "soft-yes",
      why: shortDecisionWhy(
        palaceNameEnglish,
        seasonShort,
        stance.hasChallenge || stance.isRepairSeason
          ? "Unfinished truth is cheaper early."
          : "Keep it short and dated."
      ),
      coaching: "Do it before mid-month.",
    },
    {
      decision: "Large optional purchase?",
      rating: purchaseRating,
      why: shortDecisionWhy(
        palaceNameEnglish,
        seasonShort,
        stance.allowNewLaunch && stance.hasProsperity
          ? "Only planned, sized spends."
          : stance.stanceReason
      ),
      coaching:
        purchaseRating === "soft-yes"
          ? "Cap the size. Write your rule first."
          : "Delay unless necessary.",
    },
    {
      decision: "Resign or exit a role?",
      rating: "wait",
      why: shortDecisionWhy(
        palaceNameEnglish,
        seasonShort,
        "Emotion is high. Decide on facts."
      ),
      coaching: "Wait 48 hours. Decide on facts, not mood.",
    },
  ];

  return ensureWaitOrNo(rows, stance);
};

/** Next-month Life palace focus used for the Close bridge sentence. */
export interface NextMonthFocus {
  lunarMonth: number;
  solarYear: number;
  palaceNameEnglish: string;
  season: LiuMonthSeason;
  priority: string;
}

/** Inputs for the warm letter plus operational close block. */
export interface BuildPersonalLetterArgs {
  profileName: string;
  palaceName: string;
  palaceNameEnglish: string;
  season: LiuMonthSeason;
  activations: StemSiHuaActivation[];
  monthContract: MonthContract;
  nextFocus: NextMonthFocus | null;
  priorMonth: PriorMonthBriefing | null;
}

/**
 * Strip anti-pattern labels so the bridge sentence stays natural.
 */
const unfinishedDebtLabel = (antiPattern: string): string => {
  const cleaned = sanitizeReportCopy(antiPattern)
    .replace(/^Do not fall into\s*/i, "")
    .replace(/^Do not:\s*/i, "")
    .replace(/^Do not\s+/i, "")
    .replace(/^Avoid\s+/i, "")
    .replace(/^Trap:\s*/i, "")
    .trim();
  if (cleaned.length === 0) {
    return "open friction";
  }
  const first = cleaned.charAt(0).toLowerCase();
  return `${first}${cleaned.slice(1)}`;
};

/**
 * Build the required operational close: decision, deadline, success, next-month bridge.
 */
export const buildOperationalClose = (
  monthContract: MonthContract,
  nextFocus: NextMonthFocus | null,
  priorMonth: PriorMonthBriefing | null
): OperationalClose => {
  const decision = sanitizeReportCopy(monthContract.primaryMove);
  const deadline = sanitizeReportCopy(monthContract.deadline);
  const successMeasure = sanitizeReportCopy(monthContract.successMeasure);
  const debt = unfinishedDebtLabel(monthContract.antiPattern);

  const nextMonthBridge =
    nextFocus !== null
      ? [
          `Next: M${String(nextFocus.lunarMonth)} ${String(nextFocus.solarYear)}`,
          nextFocus.palaceNameEnglish,
          liuSeasonShort(nextFocus.season),
        ].join(" · ")
      : `Close this month so next does not inherit ${debt}.`;

  const priorBridgeNote =
    priorMonth !== null
      ? `Finish last month's bridge first: ${sanitizeReportCopy(priorMonth.bridgeNarrative)}.`
      : null;

  return {
    decision: decision.length > 0 ? decision : "Complete this month's primary move",
    deadline: deadline.length > 0 ? deadline : "Before month end",
    successMeasure:
      successMeasure.length > 0
        ? successMeasure
        : "You can name what changed in one clear sentence",
    nextMonthBridge,
    priorBridgeNote,
  };
};

/**
 * Build personal letter with warm body plus required operational close.
 */
export const buildPersonalLetter = (args: BuildPersonalLetterArgs): PersonalLetter => {
  const {
    profileName,
    palaceName,
    palaceNameEnglish,
    season,
    activations,
    monthContract,
    nextFocus,
    priorMonth,
  } = args;
  const content = getPalaceContent(palaceName);
  const primary = getPrimaryActivation(activations, season);
  const vars = {
    name: profileName,
    star: primary !== undefined ? starToEnglish(primary.starName) : "your timing",
    transformation: primary !== undefined ? SI_HUA_LABEL[primary.kind] : "focus",
    palace: palaceNameEnglish,
    palaceEn: palaceNameEnglish,
    season: liuSeasonShort(season),
  };
  const bodies = content.letterTemplates.body.map((t) =>
    sanitizeReportCopy(injectVars(t, vars))
  );
  return {
    greeting: `${profileName},`,
    // One short body keeps the close letter from turning into another essay.
    bodyParagraphs: bodies.slice(0, 1),
    closing: sanitizeReportCopy(content.letterTemplates.closing),
    operationalClose: buildOperationalClose(monthContract, nextFocus, priorMonth),
  };
};

/**
 * Strip em/en dashes and collapse whitespace for English report copy.
 */
const sanitizeReportCopy = (raw: string): string => {
  return raw
    .replace(/[\u2013\u2014]/g, ", ")
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Capitalize the first letter of a sentence-style line.
 */
const capitalizeLine = (raw: string): string => {
  if (raw.length === 0) {
    return raw;
  }
  const first = raw.charAt(0).toUpperCase();
  return `${first}${raw.slice(1)}`;
};

/**
 * Shorten a guidance line to one scannable sentence (no dash characters).
 */
const shortenContractLine = (raw: string, maxLen: number): string => {
  const cleaned = sanitizeReportCopy(raw);
  if (cleaned.length === 0) {
    return cleaned;
  }
  const firstClause = cleaned.split(/[.;]/)[0];
  const candidate =
    firstClause !== undefined && firstClause.trim().length > 0
      ? firstClause.trim()
      : cleaned;
  if (candidate.length <= maxLen) {
    return capitalizeLine(candidate);
  }
  const sliced = candidate.slice(0, maxLen);
  const lastSpace = sliced.lastIndexOf(" ");
  const truncated = lastSpace > 24 ? sliced.slice(0, lastSpace) : sliced;
  return capitalizeLine(truncated.trim());
};

/**
 * Season fallback deadline when the exit move has no explicit timing phrase.
 */
const deadlineForSeason = (season: LiuMonthSeason): string => {
  if (season === "Consolidation" || season === "Foundation") {
    return "By mid-month";
  }
  if (season === "Visibility") {
    return "By day 14";
  }
  return "Before week 3";
};

/**
 * Harvest a deadline and strip timing noise from the failure exit move.
 * Prefers explicit English timing already present in templates; never invents dates.
 */
const splitExitMoveTiming = (
  exitMove: string,
  season: LiuMonthSeason
): { primaryMove: string; deadline: string } => {
  const cleaned = sanitizeReportCopy(exitMove);
  const prefixMatchers: Array<{
    pattern: RegExp;
    toDeadline: (match: RegExpMatchArray) => string;
  }> = [
    {
      pattern: /^Before mid-month,\s*/i,
      toDeadline: () => "By mid-month",
    },
    {
      pattern: /^Before week 3,\s*/i,
      toDeadline: () => "Before week 3",
    },
    {
      pattern: /^Before day (\d+),\s*/i,
      toDeadline: (match) => {
        const day = match[1];
        return day !== undefined && day.length > 0
          ? `By day ${day}`
          : deadlineForSeason(season);
      },
    },
  ];
  for (const matcher of prefixMatchers) {
    const match = cleaned.match(matcher.pattern);
    if (match !== null) {
      const rest = cleaned.replace(matcher.pattern, "").trim();
      return {
        primaryMove: capitalizeLine(rest.replace(/[.]+$/, "")),
        deadline: matcher.toDeadline(match),
      };
    }
  }
  const suffixMatchers: Array<{ pattern: RegExp; deadline: string }> = [
    { pattern: /\s+before month-end\.?$/i, deadline: "By month-end" },
    { pattern: /\s+before the last week\.?$/i, deadline: "Before the last week" },
    { pattern: /\s+this month\.?$/i, deadline: deadlineForSeason(season) },
  ];
  for (const matcher of suffixMatchers) {
    if (matcher.pattern.test(cleaned)) {
      const rest = cleaned.replace(matcher.pattern, "").trim();
      return {
        primaryMove: capitalizeLine(rest.replace(/[.]+$/, "")),
        deadline: matcher.deadline,
      };
    }
  }
  return {
    primaryMove: capitalizeLine(cleaned.replace(/[.]+$/, "")),
    deadline: deadlineForSeason(season),
  };
};

/** Leading verb check so primary moves read as instructions, not descriptions. */
const IMPERATIVE_VERB =
  /^(finish|make|ask|book|apply|visit|change|send|write|name|complete|lock|document|sign|close|start|launch|schedule|call|set|remove|stop|protect|choose|pick|decline|renegotiate|surface|show|deliver|commit|date|run|take|put|keep|hold|reach|stretch|build|drop|cut|say|tell|request|submit|share|present|prepare|rest|plan|clear|verify|confirm|move|step|ship|record|track|follow|prioritize|focus|delegate|limit|pause|reset|revisit|update|outline|draft|list|define|align|refuse|defer|accept|join|leave|shift|do)\b/i;

/**
 * Format the primary move as a short verb-led instruction.
 * Keeps a trailing " · Star Kind, Palace" activation tag when present.
 */
const formatContractPrimaryMove = (move: string, priority: string): string => {
  const cleaned = sanitizeReportCopy(move).replace(/[.]+$/, "").trim();
  if (cleaned.length === 0) {
    const focus = sanitizeReportCopy(priority);
    return capitalizeLine(`Focus on ${focus.charAt(0).toLowerCase()}${focus.slice(1)}`);
  }
  const tagMatch = cleaned.match(/^(.*?)(\s·\s.+)$/);
  const body = tagMatch !== null && tagMatch[1] !== undefined ? tagMatch[1].trim() : cleaned;
  const tag = tagMatch !== null && tagMatch[2] !== undefined ? tagMatch[2] : "";
  const shortened = shortenContractLine(body, 80);
  const core = IMPERATIVE_VERB.test(shortened)
    ? shortened
    : capitalizeLine(`Do this: ${shortened.charAt(0).toLowerCase()}${shortened.slice(1)}`);
  return `${core}${tag}`;
};

/**
 * Format the deadline as a short timing label (card label already says "By when").
 */
const formatContractDeadline = (deadline: string): string => {
  const cleaned = sanitizeReportCopy(deadline).trim();
  if (cleaned.length === 0) {
    return "Month end";
  }
  return capitalizeLine(
    cleaned
      .replace(/^(finish|complete|have this done)\s+/i, "")
      .replace(/^by\s+/i, "")
      .replace(/^before\s+/i, "Before ")
      .trim()
  );
};

/**
 * Format success as a short outcome line (card label already says "Done looks like").
 */
const formatContractSuccessMeasure = (seed: string, priority: string): string => {
  const cleaned = sanitizeReportCopy(seed).trim();
  if (cleaned.length === 0) {
    const focus = sanitizeReportCopy(priority).toLowerCase();
    return capitalizeLine(`You finished ${focus}`);
  }
  const line = shortenContractLine(cleaned, 72);
  return capitalizeLine(line.replace(/^done looks like:\s*/i, ""));
};

/**
 * Format the anti-pattern as a short trap name (card label already says "Do not").
 */
const formatContractAntiPattern = (
  failureModeName: string,
  watchSeed: string,
  howItShows: string[]
): string => {
  const trap = sanitizeReportCopy(failureModeName).trim();
  if (trap.length > 0) {
    return trap.replace(/^(do not fall into|avoid)\s+/i, "");
  }
  const watchClean = sanitizeReportCopy(watchSeed).trim();
  const watchLine =
    watchClean.length > 0
      ? shortenContractLine(watchClean, 72)
      : howItShows
          .map((line) => sanitizeReportCopy(line).trim())
          .find((line) => line.length > 0) ?? "";
  if (watchLine.length > 0) {
    return capitalizeLine(watchLine.replace(/^(avoid|do not)\s+/i, ""));
  }
  return "Drifting without a clear next step";
};

/** Inputs for building the cover month contract. */
export interface BuildMonthContractArgs {
  priority: string;
  exitMove: string;
  season: LiuMonthSeason;
  successMetrics: string[];
  watchOut: string[];
  failureModeName: string;
  howItShows: string[];
  /** Top-ranked stem activation for this month, when present. */
  topActivation?: StemSiHuaActivation;
}

/**
 * Build the cover month contract from palace exit move, guidance, season,
 * and optional top activation so Primary Move names a real next step.
 */
export const buildMonthContract = (args: BuildMonthContractArgs): MonthContract => {
  const { primaryMove: moveRaw, deadline: deadlineRaw } = splitExitMoveTiming(
    args.exitMove,
    args.season
  );
  const primaryMoveSource =
    moveRaw.length > 0
      ? moveRaw
      : capitalizeLine(sanitizeReportCopy(args.exitMove).replace(/[.]+$/, ""));
  const anchoredMove = withActivationAnchor(primaryMoveSource, args.topActivation);
  const successSeed =
    args.successMetrics.find((line) => sanitizeReportCopy(line).length > 0) ??
    `Complete the primary focus: ${args.priority}`;
  const watchSeed =
    args.watchOut.find((line) => sanitizeReportCopy(line).length > 0) ?? "";
  return {
    primaryMove: formatContractPrimaryMove(anchoredMove, args.priority),
    deadline: formatContractDeadline(deadlineRaw),
    successMeasure: formatContractSuccessMeasure(successSeed, args.priority),
    antiPattern: formatContractAntiPattern(
      args.failureModeName,
      watchSeed,
      args.howItShows
    ),
  };
};

/**
 * Primary goal line aligned with the month contract move (same spine language).
 */
export const buildPrimaryGoal = (priority: string, primaryMove: string): string => {
  return `${sanitizeReportCopy(priority)}. One move: ${sanitizeReportCopy(primaryMove)}`;
};

/**
 * Week windows derived from season + shared action stance.
 * Each useFor line is a concrete action people can do this week.
 * When launches are withheld, Expansion weeks prepare instead of launching.
 */
export const buildWeekWindows = (
  season: LiuMonthSeason,
  priority: string,
  stance?: ExpansionStance
): Array<{ window: string; quality: string; useFor: string }> => {
  const focus = sanitizeReportCopy(priority).trim();
  const focusTag =
    focus.length > 0
      ? ` for ${focus.charAt(0).toLowerCase()}${focus.slice(1)}`
      : "";
  const allowLaunch = stance === undefined ? true : stance.allowNewLaunch;

  if (season === "Consolidation" || season === "Foundation") {
    return [
      {
        window: "Week 1 (days 1 to 7)",
        quality: "Best to push",
        useFor: `Book a 20-minute call with one key person${focusTag}. Write down what is in scope and what is out.`,
      },
      {
        window: "Week 2 (days 8 to 14)",
        quality: "Go careful",
        useFor:
          "Limit hard talks to one topic and 15 minutes. Do not sign or start a new project this week.",
      },
      {
        window: "Week 3 (days 15 to 21)",
        quality: "Steady work",
        useFor:
          "Email a short summary of what you both agreed. Send any pending form, invoice, or follow-up message.",
      },
      {
        window: "Week 4 (days 22 to end)",
        quality: "Best to push",
        useFor:
          "Confirm the final terms in writing. Tick off one open admin task (file, payment, or calendar invite).",
      },
    ];
  }

  if (season === "Visibility") {
    return [
      {
        window: "Week 1 (days 1 to 7)",
        quality: allowLaunch ? "Best to push" : "Go careful",
        useFor: allowLaunch
          ? `Send one finished sample or ask to the person who decides next steps${focusTag}.`
          : `Send one finished sample to the person who decides next steps${focusTag}. Do not pitch a new offer yet.`,
      },
      {
        window: "Week 2 (days 8 to 14)",
        quality: allowLaunch ? "Best to push" : "Steady work",
        useFor: allowLaunch
          ? "Message everyone who saw your work. Book one call or set one dated next step."
          : "Message everyone who saw your work. Ask for one dated reply or small proof step, not a launch.",
      },
      {
        window: "Week 3 (days 15 to 21)",
        quality: "Go careful",
        useFor:
          "Say no to one extra presentation or side ask. Protect the main deliverable you already started.",
      },
      {
        window: "Week 4 (days 22 to end)",
        quality: "Wrap and prepare",
        useFor:
          "Save one win in writing (what worked). Send a thank-you note to one helper. List one task for next month.",
      },
    ];
  }

  // Expansion season
  return [
    {
      window: "Week 1 (days 1 to 7)",
      quality: allowLaunch ? "Best to push" : "Prepare, do not launch",
      useFor: allowLaunch
        ? `Start one small project or outreach${focusTag}. Put the first checkpoint date on your calendar.`
        : `Write a one-page draft plan${focusTag}. Put a later start date on your calendar; do not go public yet.`,
    },
    {
      window: "Week 2 (days 8 to 14)",
      quality: allowLaunch ? "Best to push" : "Steady work",
      useFor: allowLaunch
        ? "Send two follow-up messages to people who can help. Book one meeting this week or next."
        : "Send one repair or clarification message. Write the next step on paper; do not announce a launch.",
    },
    {
      window: "Week 3 (days 15 to 21)",
      quality: "Go careful",
      useFor:
        "Cancel or postpone one side task that is not on your main plan. Finish the one move you started in week 1.",
    },
    {
      window: "Week 4 (days 22 to end)",
      quality: "Wrap and prepare",
      useFor:
        "Close one unfinished email, payment, or file. Hand off or note one open item so next month starts clean.",
    },
  ];
};

type AspectKey = "career" | "wealth" | "relationships";

/** Scorecard dimension labels mapped to aspect palace snapshots. */
type ScorecardDimensionLabel = "Career" | "Wealth" | "Relationships" | "Health";

/**
 * Fallback fragments only. Chart-tied builders mix these with stars / activations.
 */
const ASPECT_FALLBACK: Record<
  AspectKey,
  {
    contextTemplate: string;
    palaceDo: string;
    emptyPalaceDo: string;
    seasonDo: Record<LiuMonthSeason, string>;
    avoidPalace: string;
    avoidEmpty: string;
    coachWithStars: string;
    coachEmpty: string;
  }
> = {
  career: {
    contextTemplate: "Through your {{palace}}{{stars}}.",
    palaceDo: "Treat {{palace}} as your work stage: ask for clearer ownership on one project you already carry",
    emptyPalaceDo:
      "Your Career month stage in {{palace}} has no natal main stars. Use a month activation for one visible work win (opposite-palace borrow is Life-focus only)",
    seasonDo: {
      Expansion: "In a Growing season for work: start one scoped initiative and date the first checkpoint",
      Visibility: "In a Harvest season for work: surface one finished result to the people who decide pay or role",
      Consolidation: "In a Protecting season for work: lock scope and refuse three new threads that dilute focus",
      Foundation: "In a Rebuild season for work: rest the pipeline and prep one skill that unlocks the next role",
    },
    avoidPalace: "Filling {{palace}} with busy tasks that never reach a decision-maker",
    avoidEmpty: "Waiting and assuming an open Career stage needs no action",
    coachWithStars:
      "Make one {{star}}-shaped win visible before mid-month. Quiet overtime without an audience rarely pays this timing",
    coachEmpty:
      "With an open Career stage, lead with month activation moves. One dated deliverable beats a week of invisible effort",
  },
  wealth: {
    contextTemplate: "Through your {{palace}}{{stars}}.",
    palaceDo: "Treat {{palace}} as your money stage: close one invoice or income loop you can explain on paper",
    emptyPalaceDo:
      "Your Wealth month stage in {{palace}} has no natal main stars. Follow a Lu or Ji activation into one clean money move (opposite-palace borrow is Life-focus only)",
    seasonDo: {
      Expansion: "In a Growing season for money: open one priced offer, then track the first payment",
      Visibility: "In a Harvest season for money: collect what is owed before starting a new bet",
      Consolidation: "In a Protecting season for money: write one spending rule and keep the cash buffer intact",
      Foundation: "In a Rebuild season for money: review accounts quietly and cut one leak before expanding",
    },
    avoidPalace: "Using {{palace}} energy for comfort spending that replaces a real money decision",
    avoidEmpty: "Waiting and assuming an open Wealth stage needs no money move",
    coachWithStars:
      "Prefer clean {{star}} structure over new risk. Close open money loops in {{palace}} before expanding",
    coachEmpty:
      "An open Wealth stage wants one documented move. Close a loop, then expand only what you can explain",
  },
  relationships: {
    contextTemplate: "Through your {{palace}}{{stars}}.",
    palaceDo:
      "Treat {{palace}} as your people stage: have one clear conversation about expectations with a key person",
    emptyPalaceDo:
      "Your People month stage in {{palace}} has no natal main stars. Let a month activation set one honest talk this week (opposite-palace borrow is Life-focus only)",
    seasonDo: {
      Expansion: "In a Growing season for people: invite one supportive contact into a concrete next step",
      Visibility: "In a Harvest season for people: name the win in the relationship out loud, then set a boundary",
      Consolidation: "In a Protecting season for people: reduce time with anyone who drains you after every chat",
      Foundation: "In a Rebuild season for people: rest social load and repair one quiet rupture with precise words",
    },
    avoidPalace: "Keeping false peace in {{palace}} when your body already knows the talk is due",
    avoidEmpty: "Filling the month with everyone else's urgencies instead of one honest talk",
    coachWithStars:
      "One {{star}}-honest sentence early in {{palace}} is cheaper than a week of soft quiet. Use Scripts when stuck",
    coachEmpty:
      "An open People stage still needs one clear ask. Borrow the month activation wording and say it once",
  },
};

const ACTIVATION_MOVE: Record<SiHuaKind, string> = {
  "化禄": "Open one door for support or income in this life area",
  "化权": "Make one firm decision that others have been waiting on",
  "化科": "Show one clean result where the right people can see it",
  "化忌": "Name the friction in one sentence, then take the smallest repair",
};

/**
 * Attach the month's top activation so the primary move is chart-specific,
 * not only a palace template.
 */
const withActivationAnchor = (
  move: string,
  topActivation: StemSiHuaActivation | undefined
): string => {
  const cleaned = sanitizeReportCopy(move).replace(/[.]+$/, "").trim();
  if (topActivation === undefined || cleaned.length === 0) {
    return cleaned;
  }
  const star = starToEnglish(topActivation.starName);
  const kind = SI_HUA_LABEL[topActivation.kind];
  const landing = shortPalaceLabel(activationLandingEnglish(topActivation));
  const alreadyAnchored =
    cleaned.toLowerCase().includes(star.toLowerCase()) ||
    cleaned.toLowerCase().includes(landing.toLowerCase());
  if (alreadyAnchored) {
    return cleaned;
  }
  return `${cleaned} · ${star} ${kind}, ${landing}`;
};

const STAR_CUES: Record<string, string> = {
  "Zi Wei": "Lead with standards; do not hide behind quiet competence",
  "Tian Ji": "Plan first; one sharp strategy beats three rushed moves",
  "Tai Yang": "Be visible and generous, but set a clear stop time for giving",
  "Wu Qu": "Tighten money and systems; finish what you already started",
  "Tian Tong": "Comfort helps recovery, not avoidance of hard truth",
  "Lian Zhen": "Passion needs clean agreements or it turns into drama",
  "Tian Fu": "Protect the base; build inventory before expansion",
  "Tai Yin": "Read the room, then speak the soft truth in precise words",
  "Tan Lang": "Desire creates openings; choose one worthy obsession",
  "Ju Men": "Say the hard thing cleanly; gossip leaks energy",
  "Tian Xiang": "Be the fair bridge; document roles when you help",
  "Tian Liang": "Mentor or be mentored; skip martyr mode",
  "Qi Sha": "Cut fast when needed; do not weaponize bluntness",
  "Po Jun": "Tear down one dead structure; rebuild with a plan",
  "Wen Chang": "Write it down; exams, papers, and clear language win",
  "Wen Qu": "Art and charm help if they serve a finished deliverable",
  "Zuo Fu": "Support wins when scope is clear; avoid unpaid backup duty",
  "You Bi": "Alliances grow through intros; ask for one concrete help",
};

/**
 * Strip trailing " Palace" for shorter action copy.
 */
const shortPalaceLabel = (palaceNameEnglish: string): string => {
  return palaceNameEnglish.replace(/ Palace$/i, "");
};

/**
 * Find the highest-urgency stem activation that lands on this aspect's palace.
 * Uses the same Ji-first season ranking as Signals (not raw emit order).
 */
const findAspectActivation = (
  snapshot: MonthlyStarSnapshot | null,
  stemActivations: StemSiHuaActivation[],
  season: LiuMonthSeason
): StemSiHuaActivation | undefined => {
  if (snapshot === null) {
    return undefined;
  }
  const matches = stemActivations.filter(
    (a) =>
      a.landingPalaceNumber === snapshot.palaceNumber ||
      activationLandingEnglish(a) === snapshot.chartPalaceNameEnglish
  );
  return getPrimaryActivation(matches, season);
};

/**
 * Star-flavored Do line for one aspect.
 * Star identity is shown separately in the UI, so keep this to the action only.
 */
const starDoForAspect = (
  aspect: AspectKey,
  star: string,
  _palaceShort: string
): string => {
  const cue = STAR_CUES[star];
  if (cue !== undefined) {
    // Prefer the first clause of the cue as a short instruction.
    const firstClause = cue.split(";")[0]?.trim();
    if (firstClause !== undefined && firstClause.length > 0) {
      return firstClause;
    }
  }
  if (aspect === "career") {
    return "Make one work outcome visible to a decision-maker";
  }
  if (aspect === "wealth") {
    return "Close one money loop you can explain on paper";
  }
  return "Have one clear conversation about expectations";
};

/**
 * Activation-flavored Do line for one aspect (action only; star shown separately).
 */
const activationDoForAspect = (
  aspect: AspectKey,
  activation: StemSiHuaActivation,
  _palaceShort: string
): string => {
  if (activation.kind === "化禄") {
    if (aspect === "career") {
      return "Open one door for work support or a clearer role";
    }
    if (aspect === "wealth") {
      return "Open one door for income or payment";
    }
    return "Open one door for real help from someone nearby";
  }
  if (activation.kind === "化权") {
    if (aspect === "career") {
      return "Make one firm work decision others have been waiting on";
    }
    if (aspect === "wealth") {
      return "Make one firm money decision and date it";
    }
    return "Make one firm people decision and say it once";
  }
  if (activation.kind === "化科") {
    if (aspect === "career") {
      return "Show one clean work result to the right people";
    }
    if (aspect === "wealth") {
      return "Show one clean money result you can prove on paper";
    }
    return "Show one clear, fair update in a key relationship";
  }
  if (aspect === "career") {
    return "Name the work friction in one sentence, then take the smallest repair";
  }
  if (aspect === "wealth") {
    return "Name the money friction in one sentence, then take the smallest repair";
  }
  return "Name the people friction in one sentence, then take the smallest repair";
};

/**
 * Short Avoid lines for one aspect (2–3 sharp directives).
 * `hasDisplayStars` is true for natal or opposite-borrow stars.
 */
const chartTiedAvoid = (
  aspect: AspectKey,
  hasDisplayStars: boolean,
  stemActivations: StemSiHuaActivation[]
): string[] => {
  const avoids: string[] = [];

  if (aspect === "career") {
    avoids.push(hasDisplayStars ? "Unpaid overtime nobody sees" : "Waiting for work to notice you");
    avoids.push("Starting three threads and finishing none");
  } else if (aspect === "wealth") {
    avoids.push(hasDisplayStars ? "A spend you cannot explain on paper" : "Improvised money bets under pressure");
    avoids.push("Chasing tips instead of closing open loops");
  } else {
    avoids.push(hasDisplayStars ? "False peace when a clear talk is due" : "Everyone else's urgencies over one honest talk");
    avoids.push("Busy social time that never gets specific");
  }

  const challenge = stemActivations.find((a) => a.kind === "化忌");
  if (challenge !== undefined) {
    if (aspect === "career") {
      avoids.push("Ignoring Ji until conflict goes public");
    } else if (aspect === "wealth") {
      avoids.push("Ignoring Ji until a money leak becomes a crisis");
    } else {
      avoids.push("Ignoring Ji until resentment replaces the talk");
    }
  } else if (aspect === "career") {
    avoids.push("Saying yes to scope that dilutes your main win");
  } else if (aspect === "wealth") {
    avoids.push("Expanding before you review what you already own");
  } else {
    avoids.push("Keeping people from habit, not fit");
  }

  return avoids.slice(0, 3);
};

/**
 * Short season-tied Do line for one aspect.
 */
const seasonDoShort = (
  aspect: AspectKey,
  season: LiuMonthSeason,
  stance: ExpansionStance | undefined
): string => {
  if (stance !== undefined && !stance.allowNewLaunch && season === "Expansion") {
    if (aspect === "career") {
      return "Draft one scoped work move; do not launch yet";
    }
    if (aspect === "wealth") {
      return "Price one offer on paper; hold the public launch";
    }
    return "Invite support into a repair talk, not a new bond";
  }
  if (aspect === "career") {
    if (season === "Expansion") {
      return "Start one scoped initiative with a dated checkpoint";
    }
    if (season === "Visibility") {
      return "Surface one finished result to decision-makers";
    }
    if (season === "Consolidation") {
      return "Lock scope; refuse three diluting new threads";
    }
    return "Prep one skill that unlocks the next role";
  }
  if (aspect === "wealth") {
    if (season === "Expansion") {
      return "Open one priced offer and track the first payment";
    }
    if (season === "Visibility") {
      return "Collect what is owed before any new bet";
    }
    if (season === "Consolidation") {
      return "Write one spending rule and keep the buffer";
    }
    return "Cut one money leak before expanding";
  }
  if (season === "Expansion") {
    return "Make one clear invite or ask with a real person";
  }
  if (season === "Visibility") {
    return "Name one relationship win out loud to the right person";
  }
  if (season === "Consolidation") {
    return "Have the overdue clarity talk this week";
  }
  return "Repair one bond before adding new people";
};

/**
 * Display palace label for aspect copy: prefer Liu Month chart name.
 */
const aspectPalaceLabel = (snapshot: MonthlyStarSnapshot | null): string => {
  if (snapshot === null) {
    return "this month's focus";
  }
  return snapshot.chartPalaceNameEnglish;
};

/**
 * Build distinct, chart-tied career / wealth / relationships playbooks.
 * Stars are shown separately in UI (natal or opposite borrow); Do / Avoid stay short (2–3).
 */
export const buildAspectPlaybook = (
  aspect: AspectKey,
  snapshot: MonthlyStarSnapshot | null,
  season: LiuMonthSeason,
  stemActivations: StemSiHuaActivation[],
  stance?: ExpansionStance,
  starSource: FocusStarSource | null = null
): AspectLifePlaybook => {
  const seed = ASPECT_FALLBACK[aspect];
  const palaceFull = aspectPalaceLabel(snapshot);
  const palaceShort = shortPalaceLabel(palaceFull);
  const displayStarsZh = starSource?.displayMainStars ?? snapshot?.mainStars ?? [];
  const starsEn = displayStarsZh.map(starToEnglish);
  const hasDisplayStars = starsEn.length > 0;
  const stars =
    starsEn.length > 0
      ? `, with ${starsEn.slice(0, 2).join(" and ")} active`
      : "";
  const primaryStar = starsEn[0];
  const matchedActivation = findAspectActivation(snapshot, stemActivations, season);

  const doThis: string[] = [];

  if (matchedActivation !== undefined) {
    doThis.push(activationDoForAspect(aspect, matchedActivation, palaceShort));
  } else if (primaryStar !== undefined) {
    doThis.push(starDoForAspect(aspect, primaryStar, palaceShort));
  } else if (aspect === "career") {
    doThis.push("Land one visible work win this month");
  } else if (aspect === "wealth") {
    doThis.push("Make one clean money move this month");
  } else {
    doThis.push("Have one clear people conversation this month");
  }

  // Palace-stage action (short), without repeating the lead line.
  if (aspect === "career") {
    doThis.push("Ask for clearer ownership on one project you already carry");
  } else if (aspect === "wealth") {
    doThis.push("Close one invoice or income loop on paper");
  } else {
    doThis.push("State one expectation clearly with a key person");
  }

  const seasonLine = seasonDoShort(aspect, season, stance);
  if (!doThis.includes(seasonLine)) {
    doThis.push(seasonLine);
  }

  const uniqueDo: string[] = [];
  for (const line of doThis) {
    if (!uniqueDo.includes(line)) {
      uniqueDo.push(line);
    }
    if (uniqueDo.length >= 3) {
      break;
    }
  }

  return {
    context: injectVars(seed.contextTemplate, { palace: palaceFull, stars }),
    doThis: uniqueDo,
    watchOut: chartTiedAvoid(aspect, hasDisplayStars, stemActivations),
    coachTip: "",
    starSource,
  };
};

/** Inputs for ranked activation move cards. */
export interface BuildActivationCardsArgs {
  activations: StemSiHuaActivation[];
  season: LiuMonthSeason;
  priority?: string;
  primaryMove?: string;
  convergenceBand?: ConvergenceResult["band"];
}

/**
 * Turn each stem activation into a short move card, ordered by urgency hierarchy.
 */
export const buildActivationCards = (
  args: BuildActivationCardsArgs
): ActivationCard[] => {
  const stance = resolveExpansionStance({
    season: args.season,
    activations: args.activations,
    priority: args.priority,
    primaryMove: args.primaryMove,
    convergenceBand: args.convergenceBand,
  });
  return stance.ranked.map((activation, index) => {
    const urgencyRank = index + 1;
    const landingEnglish = activationLandingEnglish(activation);
    return {
      title: `${starToEnglish(activation.starName)}, ${SI_HUA_LABEL[activation.kind]}`,
      landing: landingEnglish,
      meaning: SI_HUA_PLAIN[activation.kind],
      move: ACTIVATION_MOVE[activation.kind],
      urgencyRank,
      urgencyLabel: urgencyLabelForRank(urgencyRank),
    };
  });
};

/**
 * Inputs for focus-palace star spotlight (natal, opposite borrow, or open teaching).
 */
export interface BuildStarSpotlightArgs {
  /** Stars to cue (focus natal or opposite borrow); empty triggers open-palace teaching */
  mainStars: string[];
  palaceNameEnglish: string;
  season: LiuMonthSeason;
  activationCards: ActivationCard[];
  /**
   * When set, stars are borrowed from the opposite palace (借星安宫).
   * English palace name of the opposite source.
   */
  borrowedFromPalaceNameEnglish?: string | null;
}

/**
 * Map raw main-star names to spotlight cue rows.
 */
const mapStarsToSpotlightRows = (
  mainStars: string[],
  kind: "star" | "borrowed-star"
): StarSpotlightRow[] =>
  mainStars.slice(0, 4).map((raw) => {
    const star = starToEnglish(raw);
    const cue = STAR_CUES[star];
    return {
      kind,
      star,
      cue:
        cue !== undefined
          ? cue
          : "Notice how this energy shows up in decisions this month",
    };
  });

/**
 * Spotlight natal main stars in the month focus palace.
 * Empty focus palaces borrow opposite-palace main stars when available;
 * only a fully open pair falls back to activation teaching.
 */
export const buildStarSpotlight = (
  args: BuildStarSpotlightArgs
): StarSpotlightRow[] => {
  const {
    mainStars,
    palaceNameEnglish,
    season,
    activationCards,
    borrowedFromPalaceNameEnglish,
  } = args;

  const borrowedFrom =
    typeof borrowedFromPalaceNameEnglish === "string"
      ? borrowedFromPalaceNameEnglish.trim()
      : "";
  const isBorrowed = borrowedFrom.length > 0 && mainStars.length > 0;

  if (isBorrowed) {
    const focusLabel = shortPalaceLabel(palaceNameEnglish);
    const oppositeLabel = shortPalaceLabel(borrowedFrom);
    const header: StarSpotlightRow = {
      kind: "empty-meaning",
      star: "Borrowed from the opposite palace",
      cue: [
        `Your ${focusLabel} month focus has no natal main stars (open palace).`,
        `Per Zi Wei Dou Shu, we read the opposite palace: ${oppositeLabel}.`,
        "Borrowed stars still shape this focus, usually a notch softer than stars sitting in the palace itself.",
      ].join(" "),
    };
    return [header, ...mapStarsToSpotlightRows(mainStars, "borrowed-star")];
  }

  if (mainStars.length === 0) {
    const palaceLabel = shortPalaceLabel(palaceNameEnglish);
    const seasonWord = liuSeasonShort(season);
    const rows: StarSpotlightRow[] = [
      {
        kind: "empty-meaning",
        star: "Why this palace is open",
        cue: [
          `Your ${palaceLabel} month focus has no natal main stars holding the stage,`,
          "and the opposite palace is also light on main stars.",
          "That emptiness is chart teaching, not a blank page:",
          "less fixed personality pressure here, more room for month activations to lead.",
        ].join(" "),
      },
      {
        kind: "empty-meaning",
        star: "What clarity buys you",
        cue: [
          `In a ${seasonWord} season, an open palace favors one clean choice over autopilot.`,
          "Name one priority and one protect move, then keep the stage clear.",
        ].join(" "),
      },
    ];

    if (activationCards.length > 0) {
      const activationSummary = activationCards
        .slice(0, 3)
        .map((card) => `${card.title} in ${card.landing}`)
        .join("; ");
      rows.push({
        kind: "empty-meaning",
        star: "Rely on month activations",
        cue: [
          "Do not wait for natal star cues in this focus area.",
          `Run these Signals instead: ${activationSummary}.`,
          "The Cover month contract stays your #1 move; these Signals support it.",
        ].join(" "),
      });
    } else {
      rows.push({
        kind: "empty-meaning",
        star: "Rely on month activations",
        cue: [
          "Stem activations are quiet this month.",
          "Treat the month priority and one protect move as your schedule for this open palace.",
        ].join(" "),
      });
    }
    return rows;
  }

  return mapStarsToSpotlightRows(mainStars, "star");
};

/**
 * Build a distinct mechanism line for one scorecard dimension.
 */
export const buildDimensionMechanism = (
  label: ScorecardDimensionLabel,
  snap: MonthlyStarSnapshot | null,
  stemActivations: StemSiHuaActivation[],
  season: LiuMonthSeason,
  focusPalaceEnglish: string
): string => {
  const seasonWord = liuSeasonShort(season);
  const focusShort = shortPalaceLabel(focusPalaceEnglish);

  if (snap !== null && snap.mainStars.length > 0) {
    const primary = starToEnglish(snap.mainStars[0] ?? "");
    const secondaryRaw = snap.mainStars[1];
    const starsPhrase =
      secondaryRaw !== undefined
        ? `${primary} and ${starToEnglish(secondaryRaw)}`
        : primary;
    return `${starsPhrase} in ${snap.chartPalaceNameEnglish} set the ${label} pace`;
  }

  if (snap !== null) {
    const matched = findAspectActivation(snap, stemActivations, season);
    if (matched !== undefined) {
      return [
        formatActivationPlain(
          matched.starName,
          matched.kind,
          activationLandingEnglish(matched)
        ),
        `shapes ${label}`,
      ].join(" ");
    }
    return [
      `Open ${snap.chartPalaceNameEnglish} stage for ${label}.`,
      `Follow month activations in a ${seasonWord} season`,
      `(opposite-palace borrow is Life-focus only)`,
    ].join(" ");
  }

  if (label === "Career") {
    return `Career leans on month focus ${focusShort} in a ${seasonWord} season`;
  }
  if (label === "Wealth") {
    return `Wealth follows support and structure around ${focusShort} this ${seasonWord} month`;
  }
  if (label === "Relationships") {
    return `Relationships move through people dynamics near ${focusShort} in a ${seasonWord} season`;
  }
  return `Health needs protect-and-pace care while ${focusShort} leads a ${seasonWord} month`;
};

/**
 * One protect / press coach line from sorted scorecard bars.
 */
export const buildScorecardProtectPress = (
  scorecard: DimensionScorecard[],
  monthPriority: string
): string => {
  if (scorecard.length === 0) {
    return "Protect the lowest bar. Press the highest bar tied to your month priority.";
  }

  const byPct = [...scorecard].sort((a, b) => a.pct - b.pct);
  const lowest = byPct[0];
  const highest = byPct[byPct.length - 1];
  if (lowest === undefined || highest === undefined) {
    return "Protect the lowest bar. Press the highest bar tied to your month priority.";
  }

  if (lowest.label === highest.label) {
    return [
      `Protect and press ${lowest.label} with equal care.`,
      `Bars are close. Bias toward: ${monthPriority}.`,
    ].join(" ");
  }

  const closeHighest = byPct.filter((row) => highest.pct - row.pct <= 5);
  const priorityBias = closeHighest.find((row) =>
    monthPriority.toLowerCase().includes(row.label.toLowerCase())
  );
  const pressLabel =
    priorityBias !== undefined && priorityBias.label !== lowest.label
      ? priorityBias.label
      : highest.label;

  return `Protect ${lowest.label} (lowest). Press ${pressLabel} (highest this month).`;
};

/**
 * Plain-English situation label for "someone asks for more of my time"
 * based on this month's focus palace.
 */
const scriptAskMoreSituation = (palaceNameEnglish: string): string => {
  const key = palaceNameEnglish.replace(/ Palace$/i, "").toLowerCase();
  if (key === "career") {
    return "When someone piles on work without clearer ownership";
  }
  if (key === "wealth") {
    return "When someone pushes a money ask before you have reviewed the numbers";
  }
  if (key === "travel") {
    return "When someone wants you to stay stuck instead of making one real move";
  }
  if (key === "friends") {
    return "When someone wants more of your time without a clear next step";
  }
  if (key === "property") {
    return "When home or asset tasks keep expanding without a finish line";
  }
  if (key === "wellbeing") {
    return "When people keep asking while you still need one clear decision";
  }
  if (key === "spouse") {
    return "When a partner or collaborator asks for more without clarifying the deal";
  }
  if (key === "siblings") {
    return "When your circle asks for loyalty that drains your focus";
  }
  if (key === "children") {
    return "When worry or caretaking expands without a written plan";
  }
  if (key === "parents") {
    return "When a boss, parent, or mentor pulls you into an old pattern";
  }
  if (key === "life") {
    return "When people ask you to help them while your own rebuild waits";
  }
  if (key === "health") {
    return "When people expect you to push through while your body needs rest";
  }
  return "When someone asks for more of your time this month";
};

/**
 * Practical scripts for common month situations (short, speakable, plain English).
 * Every line must be words you can actually say out loud.
 */
export const buildMonthScripts = (
  palaceNameEnglish: string,
  _exitMove: string,
  priority: string
): MonthScript[] => {
  const focus = sanitizeReportCopy(priority).trim();
  const focusLabel =
    focus.length > 0
      ? focus
      : "my main priority";

  return [
    {
      situation: scriptAskMoreSituation(palaceNameEnglish),
      sayThis:
        "I can help with [this one task] by Friday. I cannot take on [the extra ask] this month without dropping [my current priority].",
    },
    {
      situation: "When you want to stay kind but still be clear",
      sayThis:
        "I care about this. For it to work, I need one clear outcome and a date.",
    },
    {
      situation: "When a new request pulls you off your month focus",
      sayThis: [
        `My focus this month is ${focusLabel}.`,
        "Can we adjust this so it supports that, instead of pulling me off it?",
      ].join(" "),
    },
    {
      situation: "When you need to name your month boundary out loud",
      sayThis: [
        `I am protecting my focus on ${focusLabel} this month.`,
        "I can do one clear next step.",
        "I cannot take this on without dropping something else.",
      ].join(" "),
    },
  ];
};

/**
 * Patterns / people dynamics to limit (complements nobleman allies).
 */
export const buildCautionList = (
  activations: StemSiHuaActivation[],
  palaceNameEnglish: string
): CautionItem[] => {
  const hasChallenge = activations.some((a) => a.kind === "化忌");
  const items: CautionItem[] = [
    {
      label: "People who make you feel bad for saying no",
      why: "If someone pushes you to agree before they say what they actually need, pause. Ask for a clear request first.",
    },
    {
      label: "Rush requests with no real deadline",
      why: "If they cannot name a date, it is usually not urgent. Protect your main focus this month.",
    },
    {
      label: "People who test your loyalty with vague pressure",
      why: `Lines like "If you trusted me, you would…" often pull you off your ${palaceNameEnglish} work. Ask what they want in plain words.`,
    },
  ];
  if (hasChallenge) {
    items.unshift({
      label: "People who only cheer you up and skip the real problem",
      why: "This month, say the stuck point out loud early. Soft talk that avoids it wastes the week.",
    });
  }
  return items.slice(0, 4);
};

/**
 * Build the four-week action calendar from season windows.
 * Body feelings stay in the Body chapter to avoid overlap.
 */
export const buildWeekPlan = (
  windows: Array<{ window: string; quality: string; useFor: string }>
): WeekPlanRow[] => {
  return windows.slice(0, 4).map((w) => ({
    window: w.window,
    quality: w.quality,
    useFor: w.useFor,
  }));
};
