/**
 * Tab-style blueprint mode switcher for the chart card (DNA, Da Yun, Liu Nian, Liu Month).
 */

import React from "react";
import { Calendar, Clock, Sparkles } from "lucide-react";
import {
  chartBlueprintSwitcherClass,
  chartBlueprintTabActiveClass,
  chartBlueprintTabIconClass,
  chartBlueprintTabInactiveClass,
} from "../../../styles/chartUi";

export type ChartBlueprintMode = "dna" | "dayun" | "liunian" | "liumonth";

type BlueprintTabConfig = {
  key: ChartBlueprintMode;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
};

type ChartBlueprintSwitcherProps = {
  value: ChartBlueprintMode;
  onChange: (mode: ChartBlueprintMode) => void;
  className?: string;
};

/**
 * Calendar with a small sparkle — matches the annual-energy tab reference art.
 */
const AnnualEnergyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <span className={`relative inline-flex shrink-0 ${className ?? ""}`} aria-hidden="true">
    <Calendar className="h-full w-full" />
    <Sparkles className="absolute -right-0.5 -top-0.5 h-2 w-2 sm:h-2.5 sm:w-2.5 text-accent-gold dark:text-accent-goldDark" />
  </span>
);

const BLUEPRINT_TABS: BlueprintTabConfig[] = [
  {
    key: "dna",
    label: "DNA Chart",
    shortLabel: "DNA",
    icon: <Sparkles className={chartBlueprintTabIconClass} aria-hidden="true" />,
  },
  {
    key: "dayun",
    label: "Da Yun (10 Year)",
    shortLabel: "10 Year",
    icon: <Clock className={chartBlueprintTabIconClass} aria-hidden="true" />,
  },
  {
    key: "liunian",
    label: "Liu Nian (Yearly)",
    shortLabel: "Year",
    icon: (
      <AnnualEnergyIcon
        className={`${chartBlueprintTabIconClass} h-3.5 w-3.5 sm:h-4 sm:w-4`}
      />
    ),
  },
  {
    key: "liumonth",
    label: "Liu Month (Monthly)",
    shortLabel: "Month",
    icon: <Calendar className={chartBlueprintTabIconClass} aria-hidden="true" />,
  },
];

/**
 * Branded tab strip for switching chart blueprint overlays.
 */
const ChartBlueprintSwitcher: React.FC<ChartBlueprintSwitcherProps> = ({
  value,
  onChange,
  className = "",
}) => {
  return (
    <div
      className={`${chartBlueprintSwitcherClass} ${className}`.trim()}
      role="tablist"
      aria-label="Chart blueprint mode"
    >
      {BLUEPRINT_TABS.map((tab) => {
        const active = value === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.key)}
            className={active ? chartBlueprintTabActiveClass : chartBlueprintTabInactiveClass}
          >
            {tab.icon}
            <span className="truncate text-center sm:hidden">{tab.shortLabel}</span>
            <span className="hidden truncate text-center sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ChartBlueprintSwitcher;
