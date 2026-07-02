/**
 * Part 2 — Monthly chapters (Part → Section 1–6 → Sub-sections).
 */

import React from "react";
import type { AnnualMonthEntry } from "../../utils/annual-report/types";
import {
  BestTimingPanel,
  DomainScoreGrid,
  GrowStrongerPanel,
  LifeAreaClusterGrid,
  MonthFocusList,
  SeeHearDoActionPlan,
  SeeHearDoObserveSplit,
} from "./reportUtils";
import ReportPrintPage from "./ReportPrintPage";
import {
  ReportPartHeader,
  ReportPageContinued,
  ReportSection,
  ReportSubSection,
} from "./ReportHierarchy";

export interface Part2MonthlyChapterProps {
  entry: AnnualMonthEntry;
  reportYear: number;
}

const Part2MonthlyChapter: React.FC<Part2MonthlyChapterProps> = ({ entry, reportYear }) => {
  const { snapshot } = entry;
  const englishMonthLabel = entry.lunarMonthLabel;
  const monthDateRange = `${englishMonthLabel} · ${entry.solarDateRange}, ${reportYear}`;
  const monthLine = `${englishMonthLabel} · ${entry.solarDateRange}, ${reportYear}`;
  const monthMeta = `Keyword: ${snapshot.keyword} · ${snapshot.palaceFocus}`;

  return (
    <>
      <ReportPrintPage
        partId="2"
        lunarMonth={entry.lunarMonth}
        pageId={`${englishMonthLabel} A`}
        id={`month-${entry.lunarMonth}`}
      >
        <ReportPartHeader
          partNumber="2"
          title="This Month"
          heroLabel={englishMonthLabel}
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
            <DomainScoreGrid ratings={snapshot.ratings} />
          </ReportSubSection>
        </ReportSection>

        <ReportSection index="2" title="What to Pay Attention To">
          <p className="text-sm text-slate-700 mb-3 leading-relaxed">{entry.monthFocusGuide.summary}</p>
          <ReportSubSection label="Focus here">
            <MonthFocusList items={entry.monthFocusGuide.focusHere} variant="focus" />
          </ReportSubSection>
          {entry.monthFocusGuide.beCarefulHere.length > 0 ? (
            <ReportSubSection label="Go easy here">
              <MonthFocusList items={entry.monthFocusGuide.beCarefulHere} variant="caution" />
            </ReportSubSection>
          ) : null}
        </ReportSection>
      </ReportPrintPage>

      <ReportPrintPage partId="2" lunarMonth={entry.lunarMonth} pageId={`${englishMonthLabel} B`}>
        <ReportPageContinued label={`${monthLine} (continued)`} />

        <ReportSection index="3" title="Life Areas This Month">
          <LifeAreaClusterGrid clusters={entry.lifeAreaClusters} />
        </ReportSection>

        <ReportSection index="4" title="What to Notice, Say, and Do">
          <SeeHearDoObserveSplit
            see={entry.seeHearDo.see}
            hear={entry.seeHearDo.hear}
          />
          <ReportSubSection label="Your action plan">
            <SeeHearDoActionPlan
              mustDo={entry.seeHearDo.mustDo}
              avoid={entry.seeHearDo.avoid}
              bestTiming={entry.seeHearDo.bestTiming}
            />
          </ReportSubSection>
        </ReportSection>

        <ReportSection index="5" title="Build Your Strength">
          <GrowStrongerPanel growStronger={entry.growStronger} />
        </ReportSection>

        <ReportSection index="6" title="Best Timing">
          <BestTimingPanel timingNote={entry.timingNote} />
        </ReportSection>
      </ReportPrintPage>
    </>
  );
};

export default Part2MonthlyChapter;
