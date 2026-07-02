/**
 * Shared display helpers for annual report components.
 */

import React from "react";
import type {
  AnnualPlaybook,
  BranchHarmonyType,
  CautionWindowEntry,
  GoldenWindowEntry,
  GrowStronger,
  LifeAreaCluster,
  LifeAreaClusters,
  MonthCategoryEntry,
  MonthRhythmVisual,
  OpportunityRiskItem,
  QuarterlyEnergyArc,
  TimingNote,
  TransformationKind,
  TurningPointEntry,
  YearMapMonthRow,
} from "../../utils/annual-report/types";
import { getTransformationKindLabel } from "../../utils/annual-report/reportLabels";
import { TIMING_ZONES_BY_HARMONY } from "../../utils/annual-report/branchHarmony";

/** Month theme accent colors for Part 3 legend (matches annualReportPrint.css). */
export const MONTH_THEME_ACCENT_COLORS: readonly string[] = [
  "#be123c",
  "#a21caf",
  "#15803d",
  "#047857",
  "#0f766e",
  "#0369a1",
  "#1d4ed8",
  "#4338ca",
  "#6d28d9",
  "#b45309",
  "#9a3412",
  "#475569",
] as const;

export type ReportDomainKey = "career" | "wealth" | "love" | "health";

/**
 * Render 1–5 star rating.
 */
export function StarRating({ rating }: { rating: number }): React.ReactElement {
  const clamped = Math.min(5, Math.max(1, Math.round(rating)));
  return (
    <span className="text-amber-500 text-sm tracking-wider" aria-label={`${clamped} stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index}>{index < clamped ? "★" : "☆"}</span>
      ))}
    </span>
  );
}

/**
 * Decorative circular chart emblem for the cover page.
 */
export function CoverEmblem(): React.ReactElement {
  const palaceMarks = Array.from({ length: 12 }, (_, index) => {
    const angle = (index / 12) * Math.PI * 2 - Math.PI / 2;
    const radius = 62;
    const cx = 80 + Math.cos(angle) * radius;
    const cy = 80 + Math.sin(angle) * radius;
    return (
      <circle
        key={`palace-${index}`}
        cx={cx}
        cy={cy}
        r={4}
        fill="#4338ca"
        opacity={0.85}
      />
    );
  });

  return (
    <div className="report-cover-emblem" aria-hidden="true">
      <svg viewBox="0 0 160 160" className="report-cover-emblem-svg">
        <circle cx="80" cy="80" r="72" fill="none" stroke="#e2e8f0" strokeWidth="2" />
        <circle cx="80" cy="80" r="52" fill="none" stroke="#c7d2fe" strokeWidth="1.5" />
        <circle cx="80" cy="80" r="32" fill="none" stroke="#a5b4fc" strokeWidth="1.5" />
        <circle cx="80" cy="80" r="10" fill="#3730a3" opacity="0.9" />
        {palaceMarks}
      </svg>
    </div>
  );
}

export type CoverDetailIconType = "calendar" | "clock" | "gender" | "year";

/**
 * Small inline SVG icon for cover birth detail rows.
 */
export function CoverDetailIcon({ type }: { type: CoverDetailIconType }): React.ReactElement {
  const paths: Record<CoverDetailIconType, React.ReactNode> = {
    calendar: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 9h16M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 8v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
    gender: (
      <path
        d="M12 4v12M9 7h6M9 13c0 1.7 1.3 3 3 3s3-1.3 3-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    ),
    year: (
      <>
        <path
          d="M12 4l2 5 5 1-4 3 1 5-4-2-4 2 1-5-4-3 5-1 2-5z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" className="report-cover-detail-icon" aria-hidden="true">
      {paths[type]}
    </svg>
  );
}

const TRANSFORMATION_ICON_STYLE: Record<
  TransformationKind,
  { bg: string; symbol: string }
> = {
  "化祿": { bg: "#22c55e", symbol: "+" },
  "化權": { bg: "#4338ca", symbol: "↑" },
  "化科": { bg: "#3b82f6", symbol: "★" },
  "化忌": { bg: "#f59e0b", symbol: "!" },
};

const TRANSFORMATION_CARD_ACCENT: Record<TransformationKind, { border: string; bg: string; pill: string }> = {
  "化祿": { border: "#22c55e", bg: "#f0fdf4", pill: "#dcfce7" },
  "化權": { border: "#4338ca", bg: "#f5f3ff", pill: "#ede9fe" },
  "化科": { border: "#3b82f6", bg: "#eff6ff", pill: "#dbeafe" },
  "化忌": { border: "#f59e0b", bg: "#fffbeb", pill: "#fef3c7" },
};

export interface AnnualTransformationCardProps {
  kind: TransformationKind;
  starLabel: string;
  palaceLabel: string;
  insight: string;
}

/**
 * Single annual transformation shift card for Part 1.2.
 */
export function AnnualTransformationCard({
  kind,
  starLabel,
  palaceLabel,
  insight,
}: AnnualTransformationCardProps): React.ReactElement {
  const accent = TRANSFORMATION_CARD_ACCENT[kind];
  const shiftLabel = getTransformationKindLabel(kind);
  const iconStyle = TRANSFORMATION_ICON_STYLE[kind];

  return (
    <div
      className="report-transformation-card"
      style={{
        borderLeftColor: accent.border,
        backgroundColor: accent.bg,
      }}
    >
      <div className="report-transformation-card-header">
        <span
          className="report-transformation-card-icon"
          style={{ backgroundColor: iconStyle.bg }}
          aria-hidden="true"
        >
          {iconStyle.symbol}
        </span>
        <div>
          <p className="report-transformation-card-shift">{shiftLabel}</p>
          <p className="report-transformation-card-star">{starLabel}</p>
        </div>
      </div>
      <p
        className="report-transformation-card-palace"
        style={{ backgroundColor: accent.pill }}
      >
        {palaceLabel}
      </p>
      <p className="report-transformation-card-insight">{insight}</p>
    </div>
  );
}

/**
 * 2×2 grid of annual transformation cards.
 */
export function AnnualTransformationGrid({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <div className="report-transformation-grid">{children}</div>;
}

/**
 * Colored circle icon for transformation shift types in Part 1 table.
 */
export function TransformationIcon({ kind }: { kind: TransformationKind }): React.ReactElement {
  const style = TRANSFORMATION_ICON_STYLE[kind];
  const label = getTransformationKindLabel(kind);
  return (
    <span className="report-transformation-icon" aria-label={label}>
      <span
        className="report-transformation-icon-circle"
        style={{ backgroundColor: style.bg }}
      >
        {style.symbol}
      </span>
      <span className="report-transformation-icon-label">{label}</span>
    </span>
  );
}

/**
 * Opportunity list item icon (emerald upward arrow).
 */
export function OpportunityIcon(): React.ReactElement {
  return (
    <svg viewBox="0 0 20 20" className="report-list-item-icon report-list-item-icon--opportunity" aria-hidden="true">
      <circle cx="10" cy="10" r="9" fill="#dcfce7" />
      <path d="M10 14V6M10 6l-3 3M10 6l3 3" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Risk list item icon (amber warning triangle).
 */
export function RiskIcon(): React.ReactElement {
  return (
    <svg viewBox="0 0 20 20" className="report-list-item-icon report-list-item-icon--risk" aria-hidden="true">
      <circle cx="10" cy="10" r="9" fill="#fef3c7" />
      <path d="M10 6v5M10 13v1" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 4.5L14.5 13H5.5L10 4.5z" fill="none" stroke="#b45309" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Compact opportunity or risk entry for Part 1.3 side-by-side panels.
 */
export function OpportunityRiskEntry({
  variant,
  item,
}: {
  variant: "opportunity" | "risk";
  item: OpportunityRiskItem;
}): React.ReactElement {
  const icon = variant === "opportunity" ? <OpportunityIcon /> : <RiskIcon />;
  return (
    <li className={`report-opportunity-risk-entry report-opportunity-risk-entry--${variant}`}>
      <div className="report-opportunity-risk-entry-heading">
        {icon}
        <p className="report-opportunity-risk-entry-title">{item.title}</p>
      </div>
      <p className="report-opportunity-risk-entry-action">{item.posture}</p>
    </li>
  );
}

/**
 * Side-by-side opportunities and risks panels for Part 1.3.
 */
export function OpportunityRiskSplit({
  opportunities,
  risks,
}: {
  opportunities: readonly OpportunityRiskItem[];
  risks: readonly OpportunityRiskItem[];
}): React.ReactElement {
  return (
    <div className="report-opportunity-risk-split">
      <div className="report-opportunity-risk-column report-opportunity-risk-column--opportunity">
        <div className="report-opportunity-risk-column-header">
          <OpportunityIcon />
          <span>Opportunities</span>
        </div>
        <ul className="report-opportunity-risk-list">
          {opportunities.map((item, itemIndex) => (
            <OpportunityRiskEntry
              key={`opp-${itemIndex}-${item.title}`}
              variant="opportunity"
              item={item}
            />
          ))}
        </ul>
      </div>
      <div className="report-opportunity-risk-column report-opportunity-risk-column--risk">
        <div className="report-opportunity-risk-column-header">
          <RiskIcon />
          <span>Risks</span>
        </div>
        <ul className="report-opportunity-risk-list">
          {risks.map((item, itemIndex) => (
            <OpportunityRiskEntry
              key={`risk-${itemIndex}-${item.title}`}
              variant="risk"
              item={item}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

const DOMAIN_ICON_PATHS: Record<ReportDomainKey, React.ReactNode> = {
  career: (
    <path
      d="M6 8V6a2 2 0 012-2h4a2 2 0 012 2v2M5 8h10v9H5V8z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  ),
  wealth: (
  <>
      <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8v8M9.5 10.5c0-1 1.2-1.5 2.5-1.5s2.5.5 2.5 1.5-1.2 1.5-2.5 1.5-2.5.5-2.5 1.5 1.2 1.5 2.5 1.5 2.5-.5 2.5-1.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </>
  ),
  love: (
    <path
      d="M12 18s-6-4-6-8.5a3.5 3.5 0 016-2 3.5 3.5 0 016 2C18 14 12 18 12 18z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  ),
  health: (
    <>
      <path d="M12 5c-3 4-6 6-6 9a6 6 0 1012 0c0-3-3-5-6-9z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </>
  ),
};

const DOMAIN_LABELS: Record<ReportDomainKey, string> = {
  career: "Career",
  wealth: "Wealth",
  love: "Love",
  health: "Health",
};

/**
 * Mini score card with domain icon and star rating for Part 2.
 */
export function DomainScoreCard({
  domain,
  rating,
}: {
  domain: ReportDomainKey;
  rating: number;
}): React.ReactElement {
  return (
    <div className={`report-domain-score-card report-domain-score-card--${domain}`}>
      <svg viewBox="0 0 24 24" className="report-domain-score-icon" aria-hidden="true">
        {DOMAIN_ICON_PATHS[domain]}
      </svg>
      <span className="report-domain-score-label">{DOMAIN_LABELS[domain]}</span>
      <StarRating rating={rating} />
    </div>
  );
}

/**
 * Grid of four domain score cards.
 */
export function DomainScoreGrid({
  ratings,
}: {
  ratings: Record<ReportDomainKey, number>;
}): React.ReactElement {
  const domains: ReportDomainKey[] = ["career", "wealth", "love", "health"];
  return (
    <div className="report-domain-score-grid">
      {domains.map((domain) => (
        <DomainScoreCard key={domain} domain={domain} rating={ratings[domain]} />
      ))}
    </div>
  );
}

/**
 * Five-dot score meter (1–5) for life area cluster cards.
 */
export function ScoreDotMeter({ score }: { score: number }): React.ReactElement {
  const filled = Math.min(5, Math.max(0, Math.round(score)));
  const level =
    filled >= 4 ? "high" : filled >= 3 ? "mid" : "low";

  return (
    <span className={`report-score-dots report-score-dots--${level}`} aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={`dot-${index}`}
          className={
            index < filled
              ? "report-score-dot report-score-dot--filled"
              : "report-score-dot"
          }
        />
      ))}
    </span>
  );
}

/**
 * Single life area cluster card with score chips and insight.
 */
export function LifeAreaClusterCard({
  title,
  cluster,
}: {
  title: string;
  cluster: LifeAreaCluster;
}): React.ReactElement {
  return (
    <div className="report-life-area-card">
      <p className="report-life-area-card-title">{title}</p>
      <div className="report-life-area-scores">
        {cluster.scores.map((chip) => (
          <div key={chip.label} className="report-life-area-score-chip">
            <span className="report-life-area-score-label">{chip.label}</span>
            <ScoreDotMeter score={chip.score} />
            <span className="report-life-area-score-value">{chip.score}/5</span>
          </div>
        ))}
      </div>
      <p className="report-life-area-insight">{cluster.insight}</p>
    </div>
  );
}

const LIFE_AREA_CLUSTER_ITEMS: readonly {
  key: keyof LifeAreaClusters;
  title: string;
}[] = [
  { key: "selfAndMindset", title: "You and your mindset" },
  { key: "workAndMoney", title: "Work and money" },
  { key: "peopleAndLove", title: "People and love" },
  { key: "bodyHomeAndWorld", title: "Body, home, and world" },
] as const;

/**
 * 2×2 grid of life area cluster cards for Part 2 section 3.
 */
export function LifeAreaClusterGrid({
  clusters,
}: {
  clusters: LifeAreaClusters;
}): React.ReactElement {
  return (
    <div className="report-life-area-grid">
      {LIFE_AREA_CLUSTER_ITEMS.map(({ key, title }) => (
        <LifeAreaClusterCard key={key} title={title} cluster={clusters[key]} />
      ))}
    </div>
  );
}

/**
 * Eye icon for "what you may notice" entries.
 */
export function NoticeIcon(): React.ReactElement {
  return (
    <svg
      viewBox="0 0 20 20"
      className="report-list-item-icon report-list-item-icon--notice"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="9" fill="#e0e7ff" />
      <ellipse cx="10" cy="10" rx="4.5" ry="3" fill="none" stroke="#4338ca" strokeWidth="1.3" />
      <circle cx="10" cy="10" r="1.6" fill="#4338ca" />
    </svg>
  );
}

/**
 * Speech bubble icon for communication tips.
 */
export function CommunicateIcon(): React.ReactElement {
  return (
    <svg
      viewBox="0 0 20 20"
      className="report-list-item-icon report-list-item-icon--communicate"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="9" fill="#ede9fe" />
      <path
        d="M6 7.5h8a1 1 0 011 1v3.5a1 1 0 01-1 1H9.5L7 14.5V12.5H6a1 1 0 01-1-1V8.5a1 1 0 011-1z"
        fill="none"
        stroke="#6d28d9"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M8 10h4M8 11.5h2.5" stroke="#6d28d9" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Check-circle icon for positive actions.
 */
export function ActionDoIcon(): React.ReactElement {
  return (
    <svg
      viewBox="0 0 20 20"
      className="report-action-card-svg-icon"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="9" fill="#bbf7d0" />
      <path
        d="M6.5 10.2l2.2 2.2 4.8-5"
        fill="none"
        stroke="#166534"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * X-circle icon for things to avoid.
 */
export function ActionAvoidIcon(): React.ReactElement {
  return (
    <svg
      viewBox="0 0 20 20"
      className="report-action-card-svg-icon"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="9" fill="#fde68a" />
      <path
        d="M7.2 7.2l5.6 5.6M12.8 7.2l-5.6 5.6"
        stroke="#92400e"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Clock icon for best timing window.
 */
export function ActionTimingIcon(): React.ReactElement {
  return (
    <svg
      viewBox="0 0 20 20"
      className="report-action-card-svg-icon"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="9" fill="#bfdbfe" />
      <circle cx="10" cy="10" r="5.5" fill="none" stroke="#1e40af" strokeWidth="1.3" />
      <path d="M10 7.5V10l2 1.5" stroke="#1e40af" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Side-by-side notice and communication panels for Part 2 section 4.
 */
export function SeeHearDoObserveSplit({
  see,
  hear,
}: {
  see: readonly string[];
  hear: readonly string[];
}): React.ReactElement {
  return (
    <div className="report-see-hear-split">
      <div className="report-see-hear-column report-see-hear-column--notice">
        <div className="report-see-hear-column-header">
          <NoticeIcon />
          <span>What you may notice</span>
        </div>
        <ul className="report-see-hear-list">
          {see.map((item, itemIndex) => (
            <li
              key={`notice-${itemIndex}-${item}`}
              className="report-see-hear-entry report-see-hear-entry--notice"
            >
              <span className="report-see-hear-entry-marker" aria-hidden="true">
                {itemIndex + 1}
              </span>
              <p className="report-see-hear-entry-text">{item}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="report-see-hear-column report-see-hear-column--communicate">
        <div className="report-see-hear-column-header">
          <CommunicateIcon />
          <span>How to communicate</span>
        </div>
        <ul className="report-see-hear-list">
          {hear.map((item, itemIndex) => (
            <li
              key={`communicate-${itemIndex}-${item}`}
              className="report-see-hear-entry report-see-hear-entry--communicate"
            >
              <span className="report-see-hear-entry-marker" aria-hidden="true">
                {itemIndex + 1}
              </span>
              <p className="report-see-hear-entry-text">{item}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Enhanced three-card action plan with SVG icons and numbered items.
 */
export function SeeHearDoActionPlan({
  mustDo,
  avoid,
  bestTiming,
}: {
  mustDo: readonly string[];
  avoid: readonly string[];
  bestTiming: string;
}): React.ReactElement {
  return (
    <div className="report-action-plan report-action-plan--enhanced">
      <div className="report-action-card report-action-card--do">
        <div className="report-action-card-header">
          <ActionDoIcon />
          <span className="report-action-card-label">Do This</span>
        </div>
        <div className="report-action-card-body">
          <ul className="report-action-numbered-list">
            {mustDo.map((item, itemIndex) => (
              <li key={`do-${itemIndex}-${item}`} className="report-action-numbered-item">
                <span className="report-action-numbered-badge report-action-numbered-badge--do">
                  {itemIndex + 1}
                </span>
                <span className="report-action-numbered-text">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="report-action-card report-action-card--avoid">
        <div className="report-action-card-header">
          <ActionAvoidIcon />
          <span className="report-action-card-label">Avoid This</span>
        </div>
        <div className="report-action-card-body">
          <ul className="report-action-numbered-list">
            {avoid.map((item, itemIndex) => (
              <li key={`avoid-${itemIndex}-${item}`} className="report-action-numbered-item">
                <span className="report-action-numbered-badge report-action-numbered-badge--avoid">
                  {itemIndex + 1}
                </span>
                <span className="report-action-numbered-text">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="report-action-card report-action-card--timing">
        <div className="report-action-card-header">
          <ActionTimingIcon />
          <span className="report-action-card-label">Best Timing</span>
        </div>
        <div className="report-action-card-body">
          <p className="report-action-card-timing-text">{bestTiming}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Split a focus line into area label and detail when formatted as "Area: detail".
 */
function parseMonthFocusItem(text: string): { area: string | null; detail: string } {
  const colonIndex = text.indexOf(": ");
  if (colonIndex > 0 && colonIndex <= 48) {
    return {
      area: text.slice(0, colonIndex),
      detail: text.slice(colonIndex + 2),
    };
  }
  return { area: null, detail: text };
}

/**
 * Single numbered focus or caution card for Part 2 section 2.
 */
export function MonthFocusItem({
  index,
  text,
  variant,
}: {
  index: number;
  text: string;
  variant: "focus" | "caution";
}): React.ReactElement {
  const { area, detail } = parseMonthFocusItem(text);

  return (
    <li className={`report-month-focus-item report-month-focus-item--${variant}`}>
      <span className="report-month-focus-number" aria-hidden="true">
        {index}
      </span>
      <div className="report-month-focus-body">
        {area !== null ? (
          <>
            <p className="report-month-focus-area">{area}</p>
            <p className="report-month-focus-detail">{detail}</p>
          </>
        ) : (
          <p className="report-month-focus-detail">{detail}</p>
        )}
      </div>
    </li>
  );
}

/**
 * Numbered focus or caution list for Part 2 "What to Pay Attention To".
 */
export function MonthFocusList({
  items,
  variant,
}: {
  items: readonly string[];
  variant: "focus" | "caution";
}): React.ReactElement {
  return (
    <ul className="report-month-focus-list">
      {items.map((item, itemIndex) => (
        <MonthFocusItem
          key={`${variant}-${itemIndex}-${item}`}
          index={itemIndex + 1}
          text={item}
          variant={variant}
        />
      ))}
    </ul>
  );
}

const HARMONY_SUMMARY: Record<BranchHarmonyType, string> = {
  favorable: "This month's rhythm aligns well with your chart. Strong timing for key moves.",
  supportive: "This month works smoothly with your chart. Good for teamwork and coordinated plans.",
  challenging: "This month pushes against your chart's flow. Prioritize stability over big leaps.",
  watchful: "This month carries hidden friction. Double-check plans and communication.",
  neutral: "This month is balanced for your chart. Neither strongly for nor against you.",
};

/**
 * Colored energy icon for month harmony status.
 */
export function HarmonyEnergyIcon({
  harmony,
}: {
  harmony: BranchHarmonyType;
}): React.ReactElement {
  const fills: Record<BranchHarmonyType, { bg: string; stroke: string }> = {
    favorable: { bg: "#dcfce7", stroke: "#166534" },
    supportive: { bg: "#dbeafe", stroke: "#1e40af" },
    watchful: { bg: "#fef3c7", stroke: "#92400e" },
    challenging: { bg: "#fee2e2", stroke: "#9f1239" },
    neutral: { bg: "#f1f5f9", stroke: "#475569" },
  };
  const colors = fills[harmony];

  return (
    <svg
      viewBox="0 0 20 20"
      className={`report-best-timing-harmony-icon report-best-timing-harmony-icon--${harmony}`}
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="9" fill={colors.bg} />
      <path
        d="M10 5.5l1.2 3.6h3.8l-3.1 2.2 1.2 3.6L10 12.7 7.1 14.9l1.2-3.6-3.1-2.2h3.8L10 5.5z"
        fill="none"
        stroke={colors.stroke}
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Green upward icon for favorable timing windows.
 */
export function FavorableWindowIcon(): React.ReactElement {
  return (
    <svg
      viewBox="0 0 20 20"
      className="report-best-timing-window-icon report-best-timing-window-icon--favorable"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="9" fill="#dcfce7" />
      <path
        d="M10 14V6M10 6l-3 3M10 6l3 3"
        stroke="#166534"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Amber pause icon for caution timing windows.
 */
export function CautionWindowIcon(): React.ReactElement {
  return (
    <svg
      viewBox="0 0 20 20"
      className="report-best-timing-window-icon report-best-timing-window-icon--caution"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="9" fill="#fef3c7" />
      <path d="M8 6.5v7M12 6.5v7" stroke="#92400e" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Info icon for the timing insight card.
 */
export function TimingInsightIcon(): React.ReactElement {
  return (
    <svg
      viewBox="0 0 20 20"
      className="report-best-timing-insight-icon"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="9" fill="#e0e7ff" />
      <path d="M10 9v4.5M10 6.5v.5" stroke="#3730a3" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Month rhythm: phase cards plus one combined progress bar.
 */
function MonthTimingTrack({ rhythm }: { rhythm: MonthRhythmVisual }): React.ReactElement {
  const favorableWidth = Math.max(
    0,
    rhythm.favorableBand.endPercent - rhythm.favorableBand.startPercent
  );
  const cautionWidth = Math.max(
    0,
    rhythm.cautionBand.endPercent - rhythm.cautionBand.startPercent
  );

  return (
    <div className="report-month-rhythm">
      <div className="report-month-rhythm-phases">
        <div className="report-month-rhythm-phase">
          <span className="report-month-rhythm-phase-name">Early</span>
          <span className="report-month-rhythm-phase-dates">
            {rhythm.monthStartLabel} – {rhythm.earlyEndLabel}
          </span>
        </div>
        <div className="report-month-rhythm-phase">
          <span className="report-month-rhythm-phase-name">Mid</span>
          <span className="report-month-rhythm-phase-dates">
            {rhythm.earlyEndLabel} – {rhythm.lateStartLabel}
          </span>
        </div>
        <div className="report-month-rhythm-phase">
          <span className="report-month-rhythm-phase-name">Late</span>
          <span className="report-month-rhythm-phase-dates">
            {rhythm.lateStartLabel} – {rhythm.monthEndLabel}
          </span>
        </div>
      </div>

      <div className="report-month-rhythm-bar">
        <div className="report-month-rhythm-bar-rail" />
        <div
          className="report-month-rhythm-bar-zone report-month-rhythm-bar-zone--favorable"
          style={{
            left: `${rhythm.favorableBand.startPercent}%`,
            width: `${favorableWidth}%`,
          }}
        />
        <div
          className="report-month-rhythm-bar-zone report-month-rhythm-bar-zone--caution"
          style={{
            left: `${rhythm.cautionBand.startPercent}%`,
            width: `${cautionWidth}%`,
          }}
        />
      </div>

      <div className="report-month-rhythm-legend">
        <span className="report-month-rhythm-legend-item report-month-rhythm-legend-item--favorable">
          Good window
        </span>
        <span className="report-month-rhythm-legend-item report-month-rhythm-legend-item--caution">
          Go slow
        </span>
      </div>
    </div>
  );
}

/**
 * Visual panel for Part 2 section 6 (best timing).
 */
export function BestTimingPanel({ timingNote }: { timingNote: TimingNote }): React.ReactElement {
  return (
    <div className="report-best-timing-panel">
      <div className={`report-best-timing-harmony report-best-timing-harmony--${timingNote.branchHarmony}`}>
        <HarmonyEnergyIcon harmony={timingNote.branchHarmony} />
        <div className="report-best-timing-harmony-body">
          <div className="report-best-timing-harmony-top">
            <span className="report-best-timing-harmony-label">Month energy</span>
            <HarmonyBadge harmony={timingNote.branchHarmony} />
          </div>
          <p className="report-best-timing-harmony-summary">
            {HARMONY_SUMMARY[timingNote.branchHarmony]}
          </p>
        </div>
      </div>

      <div className="report-best-timing-track-card">
        <p className="report-best-timing-track-title">Month rhythm</p>
        <MonthTimingTrack rhythm={timingNote.rhythmVisual} />
      </div>

      <div className="report-best-timing-windows">
        <div className="report-best-timing-window report-best-timing-window--favorable">
          <div className="report-best-timing-window-header">
            <FavorableWindowIcon />
            <p className="report-best-timing-window-label">Good window</p>
          </div>
          <p className="report-best-timing-window-text">{timingNote.favorableWindow}</p>
        </div>
        <div className="report-best-timing-window report-best-timing-window--caution">
          <div className="report-best-timing-window-header">
            <CautionWindowIcon />
            <p className="report-best-timing-window-label">Go slow window</p>
          </div>
          <p className="report-best-timing-window-text">{timingNote.cautionWindow}</p>
        </div>
      </div>

      <div className="report-best-timing-insight">
        <TimingInsightIcon />
        <div className="report-best-timing-insight-body">
          <p className="report-best-timing-insight-label">Why timing matters</p>
          <p className="report-best-timing-insight-text">{timingNote.branchExplanation}</p>
        </div>
      </div>

      <p className="report-best-timing-calc-note">
        Month energy compares this lunar month&apos;s branch with your Life Palace branch
        (triple harmony, paired harmony, clash, hidden friction, or neutral).
        Good and go-slow dates split this month&apos;s solar calendar using the same
        percentages shown on the rhythm bar above.
      </p>
    </div>
  );
}

export interface TimingTimelineProps {
  harmony: BranchHarmonyType;
  favorableWindow: string;
  cautionWindow: string;
}

/**
 * Horizontal month timeline with favorable and caution zones.
 */
export function TimingTimeline({
  harmony,
  favorableWindow,
  cautionWindow,
}: TimingTimelineProps): React.ReactElement {
  const zones = TIMING_ZONES_BY_HARMONY[harmony];

  return (
    <div className="report-timing-timeline">
      <div className="report-timing-timeline-header">
        <HarmonyBadge harmony={harmony} />
        <span className="report-timing-timeline-scale">
          <span>Early</span>
          <span>Mid</span>
          <span>Late</span>
        </span>
      </div>
      <div className="report-timing-timeline-bar" aria-hidden="true">
        <div className="report-timing-timeline-track" />
        <div
          className="report-timing-timeline-zone report-timing-timeline-zone--favorable"
          style={{
            left: `${zones.favorableStart}%`,
            width: `${zones.favorableEnd - zones.favorableStart}%`,
          }}
        />
        <div
          className="report-timing-timeline-zone report-timing-timeline-zone--caution"
          style={{
            left: `${zones.cautionStart}%`,
            width: `${zones.cautionEnd - zones.cautionStart}%`,
          }}
        />
        <div className="report-timing-timeline-marker" style={{ left: "33.3%" }} />
        <div className="report-timing-timeline-marker" style={{ left: "66.6%" }} />
      </div>
      <div className="report-timing-timeline-labels">
        <div className="report-timing-timeline-label report-timing-timeline-label--favorable">
          <span className="report-timing-timeline-dot report-timing-timeline-dot--favorable" />
          <div>
            <p className="report-timing-timeline-label-title">Good window</p>
            <p className="report-timing-timeline-label-text">{favorableWindow}</p>
          </div>
        </div>
        <div className="report-timing-timeline-label report-timing-timeline-label--caution">
          <span className="report-timing-timeline-dot report-timing-timeline-dot--caution" />
          <div>
            <p className="report-timing-timeline-label-title">Go slow window</p>
            <p className="report-timing-timeline-label-text">{cautionWindow}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Circular focus ring with the first letter of a character trait.
 */
export function StrengthFocusRing({ characterFocus }: { characterFocus: string }): React.ReactElement {
  const letter = characterFocus.trim().charAt(0).toUpperCase() || "F";
  return (
    <div className="report-strength-focus" aria-hidden="true">
      <svg viewBox="0 0 48 48" className="report-strength-focus-ring">
        <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.35" />
        <circle cx="24" cy="24" r="14" fill="currentColor" opacity="0.12" />
        <text x="24" y="29" textAnchor="middle" className="report-strength-focus-letter">
          {letter}
        </text>
      </svg>
    </div>
  );
}

/**
 * Calendar-repeat icon for the daily habit card.
 */
export function DailyHabitIcon(): React.ReactElement {
  return (
    <svg
      viewBox="0 0 20 20"
      className="report-grow-stronger-icon report-grow-stronger-icon--habit"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="9" fill="#ccfbf1" />
      <rect x="5.5" y="6" width="9" height="8.5" rx="1" fill="none" stroke="#0f766e" strokeWidth="1.2" />
      <path d="M5.5 8.5h9M7.5 4.5v2M12.5 4.5v2" stroke="#0f766e" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M8 11.5h1.5M10.5 11.5h1.5M8 13.5h4" stroke="#0f766e" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Shield-heart icon for the pressure relief card.
 */
export function PressureReliefIcon(): React.ReactElement {
  return (
    <svg
      viewBox="0 0 20 20"
      className="report-grow-stronger-icon report-grow-stronger-icon--pressure"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="9" fill="#fce7f3" />
      <path
        d="M10 5.5c-2.2 1.4-4.5 1.5-4.5 1.5v3.8c0 2.4 2 3.7 4.5 4.7 2.5-1 4.5-2.3 4.5-4.7V7s-2.3-.1-4.5-1.5z"
        fill="none"
        stroke="#be123c"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M8.2 10.2c.5.6 1.2 1 2 1.1.8-.1 1.5-.5 2-1.1"
        fill="none"
        stroke="#be123c"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Visual panel for Part 2 section 5 (skill, daily habit, pressure note).
 */
export function GrowStrongerPanel({
  growStronger,
}: {
  growStronger: GrowStronger;
}): React.ReactElement {
  return (
    <div className="report-grow-stronger-panel">
      <div className="report-grow-stronger-card report-grow-stronger-card--skill">
        <div className="report-grow-stronger-card-top">
          <StrengthFocusRing characterFocus={growStronger.characterFocus} />
          <div className="report-grow-stronger-card-heading">
            <p className="report-grow-stronger-card-label">Skill to practice</p>
            <p className="report-grow-stronger-trait">{growStronger.characterFocus}</p>
          </div>
        </div>
        <p className="report-grow-stronger-skill-hint">{growStronger.skillHint}</p>
      </div>

      <div className="report-grow-stronger-card report-grow-stronger-card--habit">
        <div className="report-grow-stronger-card-top">
          <DailyHabitIcon />
          <div className="report-grow-stronger-card-heading">
            <p className="report-grow-stronger-card-label">Daily habit</p>
            <p className="report-grow-stronger-habit-title">{growStronger.practiceTitle}</p>
          </div>
        </div>
        <ol className="report-grow-stronger-steps">
          {growStronger.practiceSteps.map((step, stepIndex) => (
            <li key={`habit-step-${stepIndex}-${step}`} className="report-grow-stronger-step">
              <span className="report-grow-stronger-step-marker" aria-hidden="true">
                {stepIndex + 1}
              </span>
              <span className="report-grow-stronger-step-text">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="report-grow-stronger-card report-grow-stronger-card--pressure">
        <div className="report-grow-stronger-card-top">
          <PressureReliefIcon />
          <div className="report-grow-stronger-card-heading">
            <p className="report-grow-stronger-card-label">If you feel pressure</p>
          </div>
        </div>
        <p className="report-grow-stronger-pressure-text">{growStronger.pressureNote}</p>
      </div>
    </div>
  );
}

/**
 * 12-month color dot legend for Part 3 overview table.
 */
export function MonthColorLegend(): React.ReactElement {
  return (
    <div className="report-month-color-legend" aria-hidden="true">
      {MONTH_THEME_ACCENT_COLORS.map((color, index) => (
        <span
          key={`month-dot-${index}`}
          className="report-month-color-dot"
          style={{ backgroundColor: color }}
          title={`Month ${index + 1}`}
        />
      ))}
    </div>
  );
}

/**
 * Small compass icon for the annual playbook closing line.
 */
export function CompassIcon(): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" className="report-compass-icon" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 5l2 7-7 2 7 2-2 7" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

type BestMonthCategoryVariant = "career" | "wealth" | "love" | "health" | "challenge";

const BEST_MONTH_CATEGORY_ITEMS: readonly {
  key: "career" | "wealth" | "love" | "health" | "mostChallenging";
  label: string;
  variant: BestMonthCategoryVariant;
}[] = [
  { key: "career", label: "Best for career", variant: "career" },
  { key: "wealth", label: "Best for wealth", variant: "wealth" },
  { key: "love", label: "Best for love", variant: "love" },
  { key: "health", label: "Best for health and rest", variant: "health" },
  { key: "mostChallenging", label: "Most challenging", variant: "challenge" },
] as const;

/**
 * Category icon for Part 3.2 best and challenging month cards.
 */
function BestMonthCategoryIcon({
  variant,
}: {
  variant: BestMonthCategoryVariant;
}): React.ReactElement {
  const iconPaths: Record<BestMonthCategoryVariant, React.ReactNode> = {
    career: DOMAIN_ICON_PATHS.career,
    wealth: DOMAIN_ICON_PATHS.wealth,
    love: DOMAIN_ICON_PATHS.love,
    health: DOMAIN_ICON_PATHS.health,
    challenge: (
      <path
        d="M10 4.5L14.5 13H5.5L10 4.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      className={`report-best-month-icon report-best-month-icon--${variant}`}
      aria-hidden="true"
    >
      {iconPaths[variant]}
    </svg>
  );
}

/**
 * Single best or challenging month category card.
 */
function BestMonthCategoryCard({
  label,
  entry,
  variant,
  wide,
}: {
  label: string;
  entry: MonthCategoryEntry;
  variant: BestMonthCategoryVariant;
  wide?: boolean;
}): React.ReactElement {
  const wideClass = wide ? " report-best-month-card--wide" : "";

  return (
    <div className={`report-best-month-card report-best-month-card--${variant}${wideClass}`}>
      <div className="report-best-month-card-header">
        <BestMonthCategoryIcon variant={variant} />
        <p className="report-best-month-card-title">{label}</p>
      </div>

      <div className="report-best-month-score-list">
        {entry.monthRows.length > 0 ? (
          entry.monthRows.map((row) => (
            <div
              key={`${variant}-${row.label}`}
              className="report-best-month-score-row"
            >
              <span className="report-best-month-score-label">{row.label}</span>
              <ScoreDotMeter score={row.score} />
              <span className="report-best-month-score-value">{row.score}/5</span>
            </div>
          ))
        ) : (
          <p className="report-best-month-score-empty">No months flagged</p>
        )}
      </div>

      <div className="report-best-month-details">
        <div className="report-best-month-detail">
          <p className="report-best-month-detail-label">Why</p>
          <p className="report-best-month-detail-text">{entry.why}</p>
        </div>
        <div className="report-best-month-detail">
          <p className="report-best-month-detail-label">Strategy</p>
          <p className="report-best-month-detail-text">{entry.strategy}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Card grid for Part 3.2 best and challenging months.
 */
export function BestMonthsPanel({
  bestMonths,
}: {
  bestMonths: {
    career: MonthCategoryEntry;
    wealth: MonthCategoryEntry;
    love: MonthCategoryEntry;
    health: MonthCategoryEntry;
    mostChallenging: MonthCategoryEntry;
  };
}): React.ReactElement {
  return (
    <div className="report-best-months-panel">
      <div className="report-best-months-grid">
        {BEST_MONTH_CATEGORY_ITEMS.filter((item) => item.key !== "mostChallenging").map(
          ({ key, label, variant }) => (
            <BestMonthCategoryCard
              key={key}
              label={label}
              entry={bestMonths[key]}
              variant={variant}
            />
          )
        )}
      </div>
      <BestMonthCategoryCard
        label="Most challenging"
        entry={bestMonths.mostChallenging}
        variant="challenge"
        wide
      />
    </div>
  );
}

/**
 * Pivot icon for turning point cards.
 */
function TurningPointIcon(): React.ReactElement {
  return (
    <svg
      viewBox="0 0 20 20"
      className="report-key-window-icon report-key-window-icon--turning"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="9" fill="#e0e7ff" />
      <path
        d="M7 13l3-6 3 6M10 7V5"
        fill="none"
        stroke="#4338ca"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Single turning point card.
 */
function TurningPointCard({ entry }: { entry: TurningPointEntry }): React.ReactElement {
  return (
    <li className="report-key-window-card report-key-window-card--turning">
      <div className="report-key-window-card-header">
        <TurningPointIcon />
        <div className="report-key-window-card-heading">
          <p className="report-key-window-month">{entry.monthLabel}</p>
          <HarmonyBadge harmony={entry.harmony} />
        </div>
      </div>
      <p className="report-key-window-card-text">{entry.explanation}</p>
    </li>
  );
}

/**
 * Single golden window card.
 */
function GoldenWindowCard({ entry }: { entry: GoldenWindowEntry }): React.ReactElement {
  return (
    <li className="report-key-window-card report-key-window-card--golden">
      <div className="report-key-window-card-header">
        <FavorableWindowIcon />
        <div className="report-key-window-card-heading">
          <p className="report-key-window-month">{entry.monthLabel}</p>
          {entry.solarDateRange.length > 0 ? (
            <span className="report-key-window-date">{entry.solarDateRange}</span>
          ) : null}
        </div>
      </div>
      <p className="report-key-window-card-text">{entry.window}</p>
    </li>
  );
}

/**
 * Single caution window card.
 */
function CautionWindowCard({ entry }: { entry: CautionWindowEntry }): React.ReactElement {
  return (
    <li className="report-key-window-card report-key-window-card--caution">
      <div className="report-key-window-card-header">
        <CautionWindowIcon />
        <p className="report-key-window-month">{entry.monthLabel}</p>
      </div>
      <p className="report-key-window-card-text">{entry.window}</p>
    </li>
  );
}

function KeyWindowEmptyState({ message }: { message: string }): React.ReactElement {
  return <p className="report-key-window-empty">{message}</p>;
}

/**
 * Visual panel for Part 3.3 turning points and key windows.
 */
export function TurningPointsKeyWindowsPanel({
  turningPoints,
  goldenWindows,
  cautionCalendar,
}: {
  turningPoints: readonly TurningPointEntry[];
  goldenWindows: readonly GoldenWindowEntry[];
  cautionCalendar: readonly CautionWindowEntry[];
}): React.ReactElement {
  return (
    <div className="report-key-windows-panel">
      <div className="report-key-windows-section report-key-windows-section--turning">
        <div className="report-key-windows-section-header">
          <TurningPointIcon />
          <span>Turning points</span>
        </div>
        {turningPoints.length > 0 ? (
          <ul className="report-key-windows-list">
            {turningPoints.map((entry) => (
              <TurningPointCard key={`turning-${entry.monthLabel}`} entry={entry} />
            ))}
          </ul>
        ) : (
          <KeyWindowEmptyState message="No major turning points flagged this year." />
        )}
      </div>

      <div className="report-key-windows-split">
        <div className="report-key-windows-section report-key-windows-section--golden">
          <div className="report-key-windows-section-header">
            <FavorableWindowIcon />
            <span>Golden windows</span>
          </div>
          {goldenWindows.length > 0 ? (
            <ul className="report-key-windows-list">
              {goldenWindows.map((entry) => (
                <GoldenWindowCard key={`golden-${entry.monthLabel}`} entry={entry} />
              ))}
            </ul>
          ) : (
            <KeyWindowEmptyState message="No golden windows flagged this year." />
          )}
        </div>

        <div className="report-key-windows-section report-key-windows-section--caution">
          <div className="report-key-windows-section-header">
            <CautionWindowIcon />
            <span>Caution calendar</span>
          </div>
          {cautionCalendar.length > 0 ? (
            <ul className="report-key-windows-list">
              {cautionCalendar.map((entry) => (
                <CautionWindowCard key={`caution-${entry.monthLabel}`} entry={entry} />
              ))}
            </ul>
          ) : (
            <KeyWindowEmptyState message="No caution windows flagged this year." />
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Target icon for annual playbook goals.
 */
function PlaybookGoalIcon(): React.ReactElement {
  return (
    <svg viewBox="0 0 20 20" className="report-playbook-section-icon" aria-hidden="true">
      <circle cx="10" cy="10" r="9" fill="#dcfce7" />
      <circle cx="10" cy="10" r="4.5" fill="none" stroke="#166534" strokeWidth="1.3" />
      <circle cx="10" cy="10" r="1.5" fill="#166534" />
    </svg>
  );
}

/**
 * Shield icon for playbook guardrails.
 */
function PlaybookGuardrailIcon(): React.ReactElement {
  return (
    <svg viewBox="0 0 20 20" className="report-playbook-section-icon" aria-hidden="true">
      <circle cx="10" cy="10" r="9" fill="#fef3c7" />
      <path
        d="M10 5.5c-2.2 1.4-4.5 1.5-4.5 1.5v3.8c0 2.2 1.8 3.5 4.5 4.5 2.7-1 4.5-2.3 4.5-4.5V7s-2.3-.1-4.5-1.5z"
        fill="none"
        stroke="#92400e"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Tag icon for monthly keyword grid.
 */
function PlaybookKeywordIcon(): React.ReactElement {
  return (
    <svg viewBox="0 0 20 20" className="report-playbook-section-icon" aria-hidden="true">
      <circle cx="10" cy="10" r="9" fill="#e0e7ff" />
      <path
        d="M6.5 7.5h4.8l3.2 3.2v2.8H6.5V7.5z"
        fill="none"
        stroke="#4338ca"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="9.5" r="0.9" fill="#4338ca" />
    </svg>
  );
}

/**
 * Book icon for re-read guide items.
 */
function PlaybookRereadIcon(): React.ReactElement {
  return (
    <svg viewBox="0 0 20 20" className="report-playbook-section-icon" aria-hidden="true">
      <circle cx="10" cy="10" r="9" fill="#f5f3ff" />
      <path
        d="M6.5 6.5h7v7h-7V6.5z"
        fill="none"
        stroke="#6d28d9"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M10 6.5v7" stroke="#6d28d9" strokeWidth="1.1" />
    </svg>
  );
}

type PlaybookItemVariant = "goal" | "guardrail" | "q1" | "reread";

/**
 * Numbered playbook list item.
 */
function PlaybookNumberedItem({
  index,
  text,
  variant,
}: {
  index: number;
  text: string;
  variant: PlaybookItemVariant;
}): React.ReactElement {
  return (
    <li className={`report-playbook-item report-playbook-item--${variant}`}>
      <span className={`report-playbook-item-number report-playbook-item-number--${variant}`}>
        {index}
      </span>
      <span className="report-playbook-item-text">{text}</span>
    </li>
  );
}

/**
 * Visual panel for Part 3.4 annual playbook.
 */
export function AnnualPlaybookPanel({
  playbook,
  overviewRows,
}: {
  playbook: AnnualPlaybook;
  overviewRows: readonly YearMapMonthRow[];
}): React.ReactElement {
  return (
    <div className="report-playbook-panel">
      <div className="report-playbook-split">
        <div className="report-playbook-section report-playbook-section--goals">
          <div className="report-playbook-section-header">
            <PlaybookGoalIcon />
            <span>Annual goals</span>
          </div>
          <ul className="report-playbook-list">
            {playbook.annualGoals.map((goal, goalIndex) => (
              <PlaybookNumberedItem
                key={`goal-${goalIndex}-${goal}`}
                index={goalIndex + 1}
                text={goal}
                variant="goal"
              />
            ))}
          </ul>
        </div>

        <div className="report-playbook-section report-playbook-section--guardrails">
          <div className="report-playbook-section-header">
            <PlaybookGuardrailIcon />
            <span>Guardrails</span>
          </div>
          <ul className="report-playbook-list">
            {playbook.guardrails.map((item, itemIndex) => (
              <PlaybookNumberedItem
                key={`guardrail-${itemIndex}-${item}`}
                index={itemIndex + 1}
                text={item}
                variant="guardrail"
              />
            ))}
          </ul>
        </div>
      </div>

      <div className="report-playbook-section report-playbook-section--keywords">
        <div className="report-playbook-section-header">
          <PlaybookKeywordIcon />
          <span>Monthly action verbs</span>
        </div>
        <div className="report-playbook-keyword-grid">
          {overviewRows.map((row, rowIndex) => (
            <div
              key={`keyword-${row.lunarMonthLabel}`}
              className="report-playbook-keyword-card"
            >
              <span
                className="report-playbook-keyword-accent"
                style={{
                  backgroundColor: MONTH_THEME_ACCENT_COLORS[rowIndex] ?? "#94a3b8",
                }}
              />
              <div className="report-playbook-keyword-body">
                <p className="report-playbook-keyword-month">{row.lunarMonthLabel}</p>
                <p className="report-playbook-keyword-verb">{row.keyword}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="report-playbook-split">
        <div className="report-playbook-section report-playbook-section--q1">
          <div className="report-playbook-section-header">
            <DailyHabitIcon />
            <span>Q1 starter plan</span>
          </div>
          <ul className="report-playbook-list">
            {playbook.q1StarterPlan.map((item, itemIndex) => (
              <PlaybookNumberedItem
                key={`q1-${itemIndex}-${item}`}
                index={itemIndex + 1}
                text={item}
                variant="q1"
              />
            ))}
          </ul>
        </div>

        <div className="report-playbook-section report-playbook-section--reread">
          <div className="report-playbook-section-header">
            <PlaybookRereadIcon />
            <span>When to re-read</span>
          </div>
          <ul className="report-playbook-list">
            {playbook.rereadGuide.map((item, itemIndex) => (
              <PlaybookNumberedItem
                key={`reread-${itemIndex}-${item}`}
                index={itemIndex + 1}
                text={item}
                variant="reread"
              />
            ))}
          </ul>
        </div>
      </div>

      <div className="report-playbook-closing">
        <CompassIcon />
        <p className="report-playbook-closing-text">{playbook.closingLine}</p>
      </div>
    </div>
  );
}

/**
 * Format birth hour index into display range.
 */
export function formatBirthHour(hourIndex: string): string {
  const hour = parseInt(hourIndex, 10);
  if (Number.isNaN(hour)) {
    return hourIndex;
  }
  const timeRanges: { start: number; end: number; range: string }[] = [
    { start: 23, end: 1, range: "23:00–00:59" },
    { start: 1, end: 3, range: "01:00–02:59" },
    { start: 3, end: 5, range: "03:00–04:59" },
    { start: 5, end: 7, range: "05:00–06:59" },
    { start: 7, end: 9, range: "07:00–08:59" },
    { start: 9, end: 11, range: "09:00–10:59" },
    { start: 11, end: 13, range: "11:00–12:59" },
    { start: 13, end: 15, range: "13:00–14:59" },
    { start: 15, end: 17, range: "15:00–16:59" },
    { start: 17, end: 19, range: "17:00–18:59" },
    { start: 19, end: 21, range: "19:00–20:59" },
    { start: 21, end: 23, range: "21:00–22:59" },
  ];
  if (hour >= 23 || hour < 1) {
    return timeRanges[0].range;
  }
  for (const tr of timeRanges) {
    if (hour >= tr.start && hour < tr.end) {
      return tr.range;
    }
  }
  return timeRanges[0].range;
}

/**
 * Format ISO date for display.
 */
export function formatBirthDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Section heading component.
 */
export function SectionHeading({
  children,
  color = "#6b7280",
}: {
  children: React.ReactNode;
  color?: string;
}): React.ReactElement {
  return (
    <h3 className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color }}>
      {children}
    </h3>
  );
}

/**
 * Trend arrow display component.
 */
export function TrendArrow({ trend }: { trend: "up" | "stable" | "down" }): React.ReactElement {
  const symbol = trend === "up" ? "↑" : trend === "down" ? "↓" : "→";
  return <span>{symbol}</span>;
}

const HARMONY_CLASS: Record<BranchHarmonyType, string> = {
  favorable: "annual-report-harmony-favorable",
  supportive: "annual-report-harmony-supportive",
  watchful: "annual-report-harmony-watchful",
  challenging: "annual-report-harmony-challenging",
  neutral: "annual-report-harmony-neutral",
};

const HARMONY_LABEL: Record<BranchHarmonyType, string> = {
  favorable: "Favorable",
  supportive: "Supportive",
  watchful: "Watchful",
  challenging: "Caution",
  neutral: "Neutral",
};

/**
 * Branch harmony badge for timing blocks.
 */
export function HarmonyBadge({ harmony }: { harmony: BranchHarmonyType }): React.ReactElement {
  return (
    <span className={`annual-report-harmony-badge ${HARMONY_CLASS[harmony]}`}>
      {HARMONY_LABEL[harmony]}
    </span>
  );
}

/**
 * Ring stroke color from a 0–5 quarterly score.
 */
function quarterScoreRingColor(score: number): string {
  if (score >= 4) {
    return "#4338ca";
  }
  if (score >= 3) {
    return "#6366f1";
  }
  if (score >= 2) {
    return "#94a3b8";
  }
  return "#f59e0b";
}

const QUARTER_ACCENT_COLORS: Record<string, string> = {
  Q1: "#3730a3",
  Q2: "#4338ca",
  Q3: "#6366f1",
  Q4: "#92400e",
};

/**
 * Circular score gauge (0–5) with tick marks for Part 1 quarterly cards.
 */
export function QuarterScoreGauge({ score }: { score: number }): React.ReactElement {
  const clamped = Math.min(5, Math.max(0, score));
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const progress = (clamped / 5) * circumference;
  const ringColor = quarterScoreRingColor(clamped);

  const ticks = Array.from({ length: 5 }, (_, index) => {
    const angle = (index / 5) * Math.PI * 2 - Math.PI / 2;
    const innerR = 28;
    const outerR = 32;
    const cx = 44;
    const cy = 44;
    return (
      <line
        key={`tick-${index}`}
        x1={cx + Math.cos(angle) * innerR}
        y1={cy + Math.sin(angle) * innerR}
        x2={cx + Math.cos(angle) * outerR}
        y2={cy + Math.sin(angle) * outerR}
        stroke="#cbd5e1"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    );
  });

  return (
    <div className="report-quarter-gauge" aria-label={`Score ${clamped.toFixed(1)} out of 5`}>
      <svg viewBox="0 0 88 88" className="report-quarter-gauge-svg">
        {ticks}
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="7"
        />
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          transform="rotate(-90 44 44)"
        />
        <text x="44" y="47" textAnchor="middle" className="report-quarter-gauge-score">
          <tspan className="report-quarter-gauge-value" fill={ringColor}>
            {clamped.toFixed(1)}
          </tspan>
          <tspan className="report-quarter-gauge-denom">&nbsp;/5&nbsp;</tspan>
        </text>
      </svg>
    </div>
  );
}

/**
 * Single quarter card with circular score gauge.
 */
export function QuarterScoreCard({ quarter }: { quarter: QuarterlyEnergyArc }): React.ReactElement {
  const accent = QUARTER_ACCENT_COLORS[quarter.quarter] ?? "#4338ca";
  return (
    <div className="report-quarter-card">
      <div className="report-quarter-card-header">
        <span className="report-quarter-badge" style={{ backgroundColor: accent }}>
          {quarter.quarter}
        </span>
        <span className="report-quarter-label">{quarter.label}</span>
      </div>
      <QuarterScoreGauge score={quarter.averageScore} />
      <p className="report-quarter-summary">{quarter.summary}</p>
    </div>
  );
}

/**
 * 2×2 grid of quarterly score cards for Part 1.
 */
export function QuarterScoreGrid({
  quarters,
}: {
  quarters: readonly QuarterlyEnergyArc[];
}): React.ReactElement {
  return (
    <div className="report-quarter-grid">
      {quarters.map((q) => (
        <QuarterScoreCard key={q.quarter} quarter={q} />
      ))}
    </div>
  );
}

/**
 * Quarterly energy bar (0–5 scale).
 */
export function EnergyBar({ score, label }: { score: number; label: string }): React.ReactElement {
  const pct = Math.min(100, Math.max(0, (score / 5) * 100));
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span className="font-medium">{label}</span>
        <span>{score.toFixed(1)}/5</span>
      </div>
      <div className="annual-report-energy-bar">
        <div className="annual-report-energy-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
