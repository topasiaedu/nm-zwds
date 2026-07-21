/**
 * Premium editorial profile sidebar for the chart result page.
 * Visual refresh only — all labels, values, and actions are unchanged.
 */

import React from "react";
import { Link } from "react-router-dom";
import { Clock, Sparkles } from "lucide-react";
import type { PdfChartData } from "../../PdfDocument";
import type { ChartData } from "../../../utils/zwds/types";
import { useLanguage } from "../../../context/LanguageContext";
import {
  formatChartLunarDate,
  formatChartSolarDate,
} from "../utils/chartDateLabels";
import { SubsectionSparkleDivider } from "../../analysis_v2/shared/SubsectionSparkleDivider";
import {
  chartAdminButtonClass,
  chartAdminBranchControlsClass,
  chartAdminPanelClass,
  chartAdminPanelDescClass,
  chartAdminPanelTitleClass,
  chartBadgeOtherClass,
  chartBadgeSelfClass,
  chartBranchAdjustedClass,
  chartBranchOriginalClass,
  chartExportButtonClass,
  chartPrimaryButtonClass,
  chartSidebarActionsClass,
  chartSidebarCardClass,
  chartSidebarFieldLabelClass,
  chartSidebarFieldListClass,
  chartSidebarFieldRowClass,
  chartSidebarFieldValueClass,
  chartSidebarTitleClass,
} from "../../../styles/chartUi";

type BranchInfo = {
  branch: string;
  timeRange: string;
};

type TranslateFn = (key: string) => string;

type ChartProfileSidebarProps = {
  chartData: PdfChartData;
  calculatedChartData: ChartData | null;
  isSelfProfile: boolean;
  isAdmin: boolean;
  branchOffset: number;
  enablePdfExport: boolean;
  onBranchOffsetChange: (updater: (prev: number) => number) => void;
  onBranchReset: () => void;
  onPdfExport: () => void;
  getCurrentBranchInfo: () => BranchInfo | null;
  formatDate: (dateString: string) => string;
  t: TranslateFn;
};

type ProfileFieldProps = {
  label: string;
  children: React.ReactNode;
};

/**
 * Single label/value row in the profile details list.
 */
const ProfileField: React.FC<ProfileFieldProps> = ({ label, children }) => (
  <div className={chartSidebarFieldRowClass}>
    <dt className={chartSidebarFieldLabelClass}>{label}</dt>
    <dd className={chartSidebarFieldValueClass}>{children}</dd>
  </div>
);

/**
 * Chart page profile sidebar — serif header, sparkle dividers, cream card shell.
 */
const ChartProfileSidebar: React.FC<ChartProfileSidebarProps> = ({
  chartData,
  calculatedChartData,
  isSelfProfile,
  isAdmin,
  branchOffset,
  enablePdfExport,
  onBranchOffsetChange,
  onBranchReset,
  onPdfExport,
  getCurrentBranchInfo,
  formatDate,
  t,
}) => {
  const { language } = useLanguage();
  const currentBranchInfo = getCurrentBranchInfo();

  return (
    <div className={chartSidebarCardClass}>
      <header className="text-center">
        <h2 className={chartSidebarTitleClass}>
          {t("result.profileDetails") || "Profile Details"}
        </h2>
        <SubsectionSparkleDivider className="mx-auto mt-3 flex w-full max-w-[12rem] items-center gap-2 px-1" />
      </header>

      <dl className={chartSidebarFieldListClass}>
        <ProfileField label={t("myChart.fields.name") || "Name"}>
          {chartData.name}
        </ProfileField>

        <ProfileField label={t("myChart.fields.type") || "Type"}>
          {isSelfProfile ? (
            <span className={chartBadgeSelfClass}>
              {t("myChart.fields.self") || "Self"}
            </span>
          ) : (
            <span className={chartBadgeOtherClass}>
              {t("myChart.fields.other") || "Other"}
            </span>
          )}
        </ProfileField>

        <ProfileField label={t("myChart.fields.birthDate") || "Birth Date"}>
          {formatDate(chartData.birthDate)}
        </ProfileField>

        <ProfileField label={t("myChart.fields.birthTime") || "Birth Time"}>
          {chartData.birthTime}
        </ProfileField>

        <ProfileField label={t("myChart.fields.gender") || "Gender"}>
          {chartData.gender === "male" ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 shrink-0 rounded-full bg-theme-link-primary" />
              {t("myChart.fields.male") || "Male"}
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 shrink-0 rounded-full bg-accent-coral" />
              {t("myChart.fields.female") || "Female"}
            </span>
          )}
        </ProfileField>

        {calculatedChartData ? (
          <div className="sm:hidden">
            <ProfileField label={t("chartInfo.solarDate")}>
              {formatChartSolarDate(calculatedChartData, t, language)}
            </ProfileField>

            <ProfileField
              label={t("chartInfo.lunarDate") || t("zwds.chart.阴历")}
            >
              {formatChartLunarDate(calculatedChartData, t, language)}
            </ProfileField>
          </div>
        ) : null}

        <ProfileField label={t("result.fields.generated") || "Generated"}>
          {formatDate(chartData.createdAt)}
        </ProfileField>
      </dl>

      {isAdmin ? (
        <div className={chartAdminPanelClass}>
          <h3 className={chartAdminPanelTitleClass}>
            <Clock
              className="h-3.5 w-3.5 shrink-0 text-accent-gold dark:text-accent-goldDark"
              aria-hidden="true"
            />
            <Sparkles
              className="h-3 w-3 shrink-0 text-[var(--color-accent-gradient-5)]"
              aria-hidden="true"
            />
            {t("result.hourAdjustment.title") || "Adjust Birth Hour"}
          </h3>
          <p className={chartAdminPanelDescClass}>
            {t("result.hourAdjustment.description") ||
              "Cycle through the 12 time branches (地支) to explore chart variations"}
          </p>

          <div className={chartAdminBranchControlsClass}>
            <button
              type="button"
              onClick={() => onBranchOffsetChange((prev) => prev - 1)}
              className={chartAdminButtonClass}
              aria-label={t("result.hourAdjustment.previous") || "Previous"}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="min-w-0 flex-1 text-center">
              <div
                className={
                  branchOffset === 0
                    ? chartBranchOriginalClass
                    : chartBranchAdjustedClass
                }
              >
                {currentBranchInfo ? (
                  <div className="flex flex-col">
                    <span className="text-base leading-tight">
                      {currentBranchInfo.branch}
                    </span>
                    <span className="text-[10px] font-normal leading-tight opacity-80">
                      {currentBranchInfo.timeRange}
                    </span>
                  </div>
                ) : (
                  <span>{t("result.hourAdjustment.original") || "Original"}</span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onBranchOffsetChange((prev) => prev + 1)}
              className={chartAdminButtonClass}
              aria-label={t("result.hourAdjustment.next") || "Next"}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {branchOffset !== 0 ? (
            <button
              type="button"
              onClick={onBranchReset}
              className={`mt-3 w-full ${chartPrimaryButtonClass}`}
            >
              {t("result.hourAdjustment.reset") || "Reset to Original"}
            </button>
          ) : null}
        </div>
      ) : null}

      <div className={chartSidebarActionsClass}>
        {enablePdfExport ? (
          <button
            type="button"
            onClick={onPdfExport}
            disabled={!chartData || !calculatedChartData}
            className={chartExportButtonClass}
          >
            <svg
              className="h-4 w-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {t("result.exportPdf") || "Export PDF"}
          </button>
        ) : null}

        <Link
          to={`/timing-chart/${chartData.id}`}
          className={chartPrimaryButtonClass}
        >
          {"View Timing Analysis"}
        </Link>

        {/* Soft-hidden per CAE feedback; route remains reachable via deep link. */}
        {false && isAdmin ? (
          <Link
            to={`/destiny-navigator/${chartData.id}`}
            className={chartPrimaryButtonClass}
          >
            Destiny Navigator
          </Link>
        ) : null}

        {isSelfProfile ? (
          <Link to="/calculate" className={chartPrimaryButtonClass}>
            {t("myChart.createOtherProfile") || "Create Profile for Someone Else"}
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default ChartProfileSidebar;
