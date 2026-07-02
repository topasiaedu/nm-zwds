/**
 * Three-level report hierarchy:
 *   Level 1 — Part header (main)
 *   Level 2 — Section box (sub-header)
 *   Level 3 — Sub-section strip (sub-sub-header)
 */

import React from "react";

export type ReportPartId = "0" | "1" | "2" | "3" | "cover";

export interface ReportPartZoneProps {
  partId: ReportPartId;
  children: React.ReactNode;
  className?: string;
  /** Per-month theme class, e.g. report-month-theme-3 */
  monthThemeClass?: string;
}

/**
 * Level 0 — Part zone tint wrapping page content (different background per part).
 */
export const ReportPartZone: React.FC<ReportPartZoneProps> = ({
  partId,
  children,
  className = "",
  monthThemeClass,
}) => {
  const monthTheme =
    monthThemeClass !== undefined && monthThemeClass !== ""
      ? `report-month-theme ${monthThemeClass}`
      : "";

  return (
    <div
      className={`report-part-zone report-part-zone-${partId} ${monthTheme} ${className}`.trim()}
    >
      {children}
    </div>
  );
};

export interface ReportPartHeaderProps {
  partNumber: string;
  title: string;
  subtitle?: string;
  /** Large month label for monthly chapters (e.g. 正月). */
  heroLabel?: string;
  /** Solar date span shown under the hero label. */
  dateRange?: string;
}

/**
 * Level 1 — Main part header (full-width banner). Show once per Part.
 */
export const ReportPartHeader: React.FC<ReportPartHeaderProps> = ({
  partNumber,
  title,
  subtitle,
  heroLabel,
  dateRange,
}) => {
  const isMonthlyHeader = heroLabel !== undefined && heroLabel !== "";

  if (isMonthlyHeader) {
    return (
      <header className="report-part-header report-part-header--monthly annual-report-avoid-break">
        <p className="report-part-header-kicker">
          {`Part ${partNumber} · ${title}`}
        </p>
        <h2 className="report-part-header-hero">{heroLabel}</h2>
        {dateRange !== undefined && dateRange !== "" ? (
          <p className="report-part-header-dates">{dateRange}</p>
        ) : null}
        {subtitle !== undefined && subtitle !== "" ? (
          <p className="report-part-header-subtitle">{subtitle}</p>
        ) : null}
      </header>
    );
  }

  return (
    <header className="report-part-header annual-report-avoid-break">
      <p className="report-part-header-kicker">Part {partNumber}</p>
      <h2 className="report-part-header-title">{title}</h2>
      {subtitle !== undefined && subtitle !== "" ? (
        <p className="report-part-header-subtitle">{subtitle}</p>
      ) : null}
    </header>
  );
};

export interface ReportPageContinuedProps {
  /** Short label for continuation pages (no full Part banner). */
  label: string;
}

/**
 * Lightweight continuation marker on page 2+ of a Part or month.
 */
export const ReportPageContinued: React.FC<ReportPageContinuedProps> = ({ label }) => {
  return <p className="report-page-continued">{label}</p>;
};

export interface ReportSectionProps {
  index: string;
  title: string;
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  continued?: boolean;
}

/**
 * Level 2 — Section box with sub-header bar.
 */
export const ReportSection: React.FC<ReportSectionProps> = ({
  index,
  title,
  headerExtra,
  children,
  className = "",
  continued = false,
}) => {
  const continuedClass = continued ? " report-section-continued" : "";
  return (
    <section
      className={`report-section annual-report-avoid-break${continuedClass} ${className}`.trim()}
    >
      <div className="report-section-header">
        <span className="report-section-index">{index}</span>
        <h3 className="report-section-title">{title}</h3>
        {headerExtra !== undefined && headerExtra !== null ? (
          <div className="report-section-extra">{headerExtra}</div>
        ) : null}
      </div>
      <div className="report-section-body">{children}</div>
    </section>
  );
};

export interface ReportSubSectionProps {
  label: string;
  children: React.ReactNode;
}

/**
 * Level 3 — Sub-sub-header inside a section body.
 */
export const ReportSubSection: React.FC<ReportSubSectionProps> = ({ label, children }) => {
  return (
    <div className="report-subsection">
      <p className="report-subsection-label">{label}</p>
      <div className="report-subsection-body">{children}</div>
    </div>
  );
};

export interface ReportBulletListProps {
  items: string[];
}

export const ReportBulletList: React.FC<ReportBulletListProps> = ({ items }) => {
  return (
    <ul className="report-bullet-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
};

export interface ReportDataTableProps {
  headers: string[];
  cells: React.ReactNode[];
}

export const ReportDataTable: React.FC<ReportDataTableProps> = ({ headers, cells }) => {
  return (
    <table className="report-data-table">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {cells.map((cell, cellIndex) => (
            <td key={`cell-${cellIndex}`}>{cell}</td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export interface ActionPlanProps {
  /** Positive actions for the month. */
  mustDo: string[];
  /** Things to steer clear of. */
  avoid: string[];
  /** Plain sentence about the best timing window. */
  bestTiming: string;
}

/**
 * Three-card action plan block: Do This / Avoid This / Best Timing.
 * Replaces the plain ReportDataTable in Section 4 "Your action plan".
 */
export const ActionPlan: React.FC<ActionPlanProps> = ({ mustDo, avoid, bestTiming }) => {
  return (
    <div className="report-action-plan">
      {/* Do This card */}
      <div className="report-action-card report-action-card--do">
        <div className="report-action-card-header">
          <span className="report-action-card-icon" aria-hidden="true">✓</span>
          <span className="report-action-card-label">Do This</span>
        </div>
        <div className="report-action-card-body">
          <ul className="report-bullet-list">
            {mustDo.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Avoid This card */}
      <div className="report-action-card report-action-card--avoid">
        <div className="report-action-card-header">
          <span className="report-action-card-icon" aria-hidden="true">✕</span>
          <span className="report-action-card-label">Avoid This</span>
        </div>
        <div className="report-action-card-body">
          <ul className="report-bullet-list">
            {avoid.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Best Timing card */}
      <div className="report-action-card report-action-card--timing">
        <div className="report-action-card-header">
          <span className="report-action-card-icon" aria-hidden="true">◷</span>
          <span className="report-action-card-label">Best Timing</span>
        </div>
        <div className="report-action-card-body">
          <p className="report-action-card-timing-text">{bestTiming}</p>
        </div>
      </div>
    </div>
  );
};

export interface ReportClusterRowProps {
  label: string;
  text: string;
}

export const ReportClusterRow: React.FC<ReportClusterRowProps> = ({ label, text }) => {
  return (
    <div className="report-cluster-row">
      <span className="report-cluster-label">{label}</span>
      <span className="report-cluster-text">{text}</span>
    </div>
  );
};

export interface ReportKvRowProps {
  label: string;
  value: string;
}

export const ReportKvRow: React.FC<ReportKvRowProps> = ({ label, value }) => {
  return (
    <p className="report-kv-row">
      <span className="report-kv-label">{label}</span> {value}
    </p>
  );
};

export interface ReportInsetPanelProps {
  title: string;
  children: React.ReactNode;
}

/**
 * Nested panel inside section body (e.g. 流月四化 table).
 */
export const ReportInsetPanel: React.FC<ReportInsetPanelProps> = ({ title, children }) => {
  return (
    <div className="report-inset-panel">
      <p className="report-inset-panel-title">{title}</p>
      <div>{children}</div>
    </div>
  );
};
