/**
 * Part 2 — Monthly chapters (Part → Section 1–6 → Sub-sections).
 */

import React from "react";
import type { AnnualMonthEntry } from "../../utils/annual-report/types";
import { StarRating, HarmonyBadge } from "./reportUtils";
import ReportPrintPage from "./ReportPrintPage";
import {
  ReportPartHeader,
  ReportPageContinued,
  ReportSection,
  ReportSubSection,
  ReportBulletList,
  ReportClusterRow,
  ActionPlan,
} from "./ReportHierarchy";

export interface Part2MonthlyChapterProps {
  entry: AnnualMonthEntry;
  reportYear: number;
}

/** English ordinal labels for lunar months 1–12 (正月 = 1). */
const LUNAR_MONTH_ENGLISH: readonly string[] = [
  "1st Lunar Month",
  "2nd Lunar Month",
  "3rd Lunar Month",
  "4th Lunar Month",
  "5th Lunar Month",
  "6th Lunar Month",
  "7th Lunar Month",
  "8th Lunar Month",
  "9th Lunar Month",
  "10th Lunar Month",
  "11th Lunar Month",
  "12th Lunar Month",
] as const;

const Part2MonthlyChapter: React.FC<Part2MonthlyChapterProps> = ({ entry, reportYear }) => {
  const { snapshot } = entry;
  const englishMonthLabel =
    LUNAR_MONTH_ENGLISH[entry.lunarMonth - 1] ?? `Lunar Month ${entry.lunarMonth}`;
  const monthDateRange = `${englishMonthLabel} · ${entry.solarDateRange}, ${reportYear}`;
  const monthLine = `${entry.lunarMonthLabel} · ${entry.solarDateRange}, ${reportYear}`;
  const monthMeta = `Keyword: ${snapshot.keyword} · ${snapshot.palaceFocus}`;

  return (
    <>
      <ReportPrintPage
        partId="2"
        lunarMonth={entry.lunarMonth}
        pageId={`${entry.lunarMonthLabel} A`}
        id={`month-${entry.lunarMonth}`}
      >
        <ReportPartHeader
          partNumber="2"
          title="This Month"
          heroLabel={entry.lunarMonthLabel}
          dateRange={monthDateRange}
          subtitle={monthMeta}
        />

        <ReportSection index="1" title="Month at a Glance">
          <ReportSubSection label="What this month is about">
            <p className="font-semibold text-slate-900 mb-1">{snapshot.theme}</p>
            <p className="text-slate-600 mb-0">{snapshot.energy}</p>
          </ReportSubSection>
          <ReportSubSection label="How it fits your year">
            <p className="text-sm text-slate-500 mb-0">{snapshot.yearLink}</p>
          </ReportSubSection>
          <ReportSubSection label="Your scores this month">
            <div className="report-ratings-row">
              <span className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Career</span>
                <StarRating rating={snapshot.ratings.career} />
              </span>
              <span className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Wealth</span>
                <StarRating rating={snapshot.ratings.wealth} />
              </span>
              <span className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Love</span>
                <StarRating rating={snapshot.ratings.love} />
              </span>
              <span className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Health</span>
                <StarRating rating={snapshot.ratings.health} />
              </span>
            </div>
          </ReportSubSection>
        </ReportSection>

        <ReportSection index="2" title="What to Pay Attention To">
          <p className="text-sm text-slate-700 mb-3 leading-relaxed">{entry.monthFocusGuide.summary}</p>
          <ReportSubSection label="Focus here">
            <ReportBulletList items={entry.monthFocusGuide.focusHere} />
          </ReportSubSection>
          {entry.monthFocusGuide.beCarefulHere.length > 0 ? (
            <ReportSubSection label="Go easy here">
              <ReportBulletList items={entry.monthFocusGuide.beCarefulHere} />
            </ReportSubSection>
          ) : null}
        </ReportSection>

        <ReportSection index="3" title="Life Areas This Month">
          <ReportClusterRow label="You and your mindset" text={entry.lifeAreaClusters.selfAndMindset} />
          <ReportClusterRow label="Work and money" text={entry.lifeAreaClusters.workAndMoney} />
        </ReportSection>
      </ReportPrintPage>

      <ReportPrintPage partId="2" lunarMonth={entry.lunarMonth} pageId={`${entry.lunarMonthLabel} B`}>
        <ReportPageContinued label={`${monthLine} (continued)`} />

        <ReportSection index="3" title="Life Areas This Month" continued>
          <ReportClusterRow label="People and love" text={entry.lifeAreaClusters.peopleAndLove} />
          <ReportClusterRow label="Body, home, and world" text={entry.lifeAreaClusters.bodyHomeAndWorld} />
        </ReportSection>

        <ReportSection index="4" title="What to Notice, Say, and Do">
          <ReportSubSection label="What you may notice">
            <ReportBulletList items={entry.seeHearDo.see} />
          </ReportSubSection>
          <ReportSubSection label="How to communicate">
            <ReportBulletList items={entry.seeHearDo.hear} />
          </ReportSubSection>
          <ReportSubSection label="Your action plan">
            <ActionPlan
              mustDo={entry.seeHearDo.mustDo}
              avoid={entry.seeHearDo.avoid}
              bestTiming={entry.seeHearDo.bestTiming}
            />
          </ReportSubSection>
        </ReportSection>

        <ReportSection index="5" title="Build Your Strength">
          <ReportSubSection label="Skill to practice">
            <p className="mb-0 font-medium text-slate-800">{entry.growStronger.characterFocus}</p>
          </ReportSubSection>
          <ReportSubSection label="Daily habit">
            <p className="mb-0">{entry.growStronger.practice}</p>
          </ReportSubSection>
          <ReportSubSection label="If you feel pressure">
            <p className="text-sm text-slate-500 mb-0">{entry.growStronger.pressureNote}</p>
          </ReportSubSection>
        </ReportSection>

        <ReportSection
          index="6"
          title="Best Timing"
          headerExtra={<HarmonyBadge harmony={entry.timingNote.branchHarmony} />}
        >
          <ReportSubSection label="Good window">
            <p className="mb-0">{entry.timingNote.favorableWindow}</p>
          </ReportSubSection>
          <ReportSubSection label="Go slow window">
            <p className="mb-0">{entry.timingNote.cautionWindow}</p>
          </ReportSubSection>
          <ReportSubSection label="Why timing matters">
            <p className="text-sm text-gray-500 mb-0">{entry.timingNote.branchExplanation}</p>
          </ReportSubSection>
        </ReportSection>
      </ReportPrintPage>
    </>
  );
};

export default Part2MonthlyChapter;
