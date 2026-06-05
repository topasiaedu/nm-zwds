import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { useProfileContext } from "../../context/ProfileContext";
import { useTierAccess } from "../../context/TierContext";
import { Link } from "react-router-dom";
import PageTransition from "../../components/PageTransition";
import { useAlertContext } from "../../context/AlertContext";
import ConfirmationModal from "../../components/ConfirmationModal";
import { BrandGradientText } from "../../components/BrandGradientText";
import {
  dashboardActionDescClass,
  dashboardActionLinkClass,
  dashboardActionLinkFeaturedClass,
  dashboardActionTitleClass,
  dashboardActionTitleFeaturedClass,
  dashboardBadgeClass,
  dashboardCardClass,
  dashboardCardHeaderBorderClass,
  dashboardCellPrimaryClass,
  dashboardCellSecondaryClass,
  dashboardChevronClass,
  dashboardContainerClass,
  dashboardDangerButtonClass,
  dashboardEmptyIconClass,
  dashboardIconAccentClass,
  dashboardIconBoxAccentClass,
  dashboardIconBoxNeutralClass,
  dashboardIconBoxOrange,
  dashboardIconNeutralClass,
  dashboardIconOrange,
  dashboardGlowClass,
  dashboardHeroClass,
  dashboardHeroMetaClass,
  dashboardHeroSubtitleClass,
  dashboardHeroTitleClass,
  dashboardMetaClass,
  dashboardPageClass,
  dashboardPrimaryButtonClass,
  dashboardPrimaryLinkClass,
  dashboardSectionIconClass,
  dashboardSectionLabelClass,
  dashboardSectionTitleClass,
  dashboardSpinnerClass,
  dashboardTableBodyClass,
  dashboardTableDividerClass,
  dashboardTableHeadCellClass,
  dashboardTableHeadClass,
  dashboardTableRowHoverClass,
  dashboardTableWrapperClass,
} from "../../styles/dashboardUi";
/**
 * Dashboard component for 紫微斗数 (Zi Wei Dou Shu/Purple Star Astrology) application
 */
const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { profiles, loading, deleteProfile } = useProfileContext();
  const { showAlert } = useAlertContext();
  const {
    hasAIAssistant,
    hasFounderReport,
    hasAlignmentAdvantage,
    hasDestinyNavigatorTool,
    isAdmin,
    tier,
  } = useTierAccess();
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    profileId: string;
    profileName: string;
  }>({
    isOpen: false,
    profileId: "",
    profileName: "",
  });
  const displayName =
    user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User";
  const selfProfile = React.useMemo(
    () => profiles.find((p) => p.is_self),
    [profiles]
  );
  const destinyNavigatorUrl = selfProfile
    ? `/destiny-navigator/${selfProfile.id}`
    : "/calculate";
  const recentProfiles = React.useMemo(() => {
    return [...profiles]
      .sort((a, b) => {
        const aDate = a.last_viewed || a.created_at;
        const bDate = b.last_viewed || b.created_at;
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      })
      .slice(0, 5);
  }, [profiles]);
  const handleDeleteClick = (profileId: string, profileName: string) => {
    setDeleteConfirmation({
      isOpen: true,
      profileId,
      profileName,
    });
  };
  const handleConfirmDelete = async () => {
    try {
      await deleteProfile(deleteConfirmation.profileId);
      showAlert(
        t("dashboard.deleteSuccess").replace(
          "{{name}}",
          deleteConfirmation.profileName
        ),
        "success"
      );
      setDeleteConfirmation({ isOpen: false, profileId: "", profileName: "" });
    } catch (error) {
      console.error("Error deleting profile:", error);
      showAlert(t("dashboard.deleteError"), "error");
    }
  };
  const handleCancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, profileId: "", profileName: "" });
  };
  const renderChevron = () => (
    <svg
      className={dashboardChevronClass}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
  return (
    <>
      <div className={dashboardGlowClass} aria-hidden="true" />
      <PageTransition>
        <div className={dashboardPageClass}>
          <div className={dashboardContainerClass}>
            <header className={dashboardHeroClass}>
              <h1 className={dashboardHeroTitleClass}>
                {t("dashboard.welcome")},{" "}
                <BrandGradientText>{displayName}</BrandGradientText>
              </h1>
              <p className={dashboardHeroSubtitleClass}>
                {t("dashboard.subtitle")}
              </p>
              <p className={dashboardHeroMetaClass}>
                {t("dashboard.savedProfiles").replace(
                  "{{count}}",
                  profiles.length.toString()
                )}
              </p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className={`${dashboardCardClass} p-6`}>
                  <p className={dashboardSectionLabelClass}>
                    {t("dashboard.subtitle")}
                  </p>
                  <h2 className={`${dashboardSectionTitleClass} mt-0 mb-4`}>
                    {t("dashboard.quickActions")}
                  </h2>
                  <div className="space-y-4">
                    <Link
                      to={
                        tier === "tier3" && !isAdmin
                          ? "/tier3-result"
                          : "/chart"
                      }
                      className={dashboardActionLinkFeaturedClass}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <div className={dashboardIconBoxAccentClass}>
                            <svg
                              className={dashboardIconAccentClass}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className={dashboardActionTitleFeaturedClass}>
                              {t("dashboard.actions.myChart.title")}
                            </h3>
                            <p className={dashboardActionDescClass}>
                              {t("dashboard.actions.myChart.description")}
                            </p>
                          </div>
                        </div>
                        {renderChevron()}
                      </div>
                    </Link>
                    <Link
                      to="/calculate"
                      className={dashboardActionLinkFeaturedClass}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <div className={dashboardIconBoxAccentClass}>
                            <svg
                              className={dashboardIconAccentClass}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className={dashboardActionTitleFeaturedClass}>
                              {t("dashboard.actions.calculate.title")}
                            </h3>
                            <p className={dashboardActionDescClass}>
                              {t("dashboard.actions.calculate.description")}
                            </p>
                          </div>
                        </div>
                        {renderChevron()}
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <span className={dashboardMetaClass}>
                          {t("dashboard.savedProfiles").replace(
                            "{{count}}",
                            profiles.length.toString()
                          )}
                        </span>
                        <span className={dashboardBadgeClass}>
                          {t("dashboard.newBadge")}
                        </span>
                      </div>
                    </Link>
                    {hasDestinyNavigatorTool && (
                      <Link
                        to={destinyNavigatorUrl}
                        className={dashboardActionLinkClass}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className={dashboardIconBoxNeutralClass}>
                              <svg
                                className={dashboardIconNeutralClass}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                            </div>
                            <div>
                              <h3 className={dashboardActionTitleClass}>
                                Destiny Navigator
                              </h3>
                              <p className={dashboardActionDescClass}>
                                Analyse life aspects across timeframes
                              </p>
                            </div>
                          </div>
                          {renderChevron()}
                        </div>
                      </Link>
                    )}
                    {hasAIAssistant && (
                      <Link
                        to="/destiny-wealth-navigator"
                        className={dashboardActionLinkClass}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className={dashboardIconBoxNeutralClass}>
                              <svg
                                className={dashboardIconNeutralClass}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                              </svg>
                            </div>
                            <div>
                              <h3 className={dashboardActionTitleClass}>
                                Destiny Wealth Navigator AI Assistant
                              </h3>
                              <p className={dashboardActionDescClass}>
                                AI-powered astrology insights and guidance
                              </p>
                            </div>
                          </div>
                          {renderChevron()}
                        </div>
                      </Link>
                    )}
                    {hasFounderReport && (
                      <Link
                        to="/founder-report"
                        className={dashboardActionLinkClass}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className={dashboardIconBoxOrange}>
                              <svg
                                className={dashboardIconOrange}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </div>
                            <div>
                              <h3 className={dashboardActionTitleClass}>
                                Founder Report
                              </h3>
                              <p className={dashboardActionDescClass}>
                                Strategic business and wealth insights
                              </p>
                            </div>
                          </div>
                          {renderChevron()}
                        </div>
                      </Link>
                    )}
                    {hasAlignmentAdvantage && (
                      <Link
                        to="/alignment-advantage"
                        className={dashboardActionLinkFeaturedClass}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className={dashboardIconBoxAccentClass}>
                              <svg
                                className={dashboardIconAccentClass}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                              </svg>
                            </div>
                            <div>
                              <h3 className={dashboardActionTitleFeaturedClass}>
                                Alignment Advantage
                              </h3>
                              <p className={dashboardActionDescClass}>
                                Your 12-month strategic command centre
                              </p>
                            </div>
                          </div>
                          {renderChevron()}
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-4">
                <div className={`${dashboardCardClass} overflow-hidden`}>
                  <div className={dashboardCardHeaderBorderClass}>
                    <p className={dashboardSectionLabelClass}>
                      {t("dashboard.savedProfiles").replace(
                        "{{count}}",
                        profiles.length.toString()
                      )}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <h2
                        className={`${dashboardSectionTitleClass} mb-0 flex items-center`}
                      >
                        <svg
                          className={dashboardSectionIconClass}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        {t("dashboard.recentResults")}
                      </h2>
                      <Link
                        to="/calculate"
                        className={dashboardPrimaryLinkClass}
                      >
                        {t("dashboard.viewAll")}
                      </Link>
                    </div>
                  </div>
                  {loading ? (
                    <div className="text-center py-12">
                      <div className={dashboardSpinnerClass} />
                    </div>
                  ) : recentProfiles.length > 0 ? (
                    <div className={dashboardTableWrapperClass}>
                      <table className={dashboardTableDividerClass}>
                        <thead className={dashboardTableHeadClass}>
                          <tr>
                            <th
                              scope="col"
                              className={dashboardTableHeadCellClass}
                            >
                              {t("dashboard.table.name")}
                            </th>
                            <th
                              scope="col"
                              className={dashboardTableHeadCellClass}
                            >
                              {t("dashboard.table.date")}
                            </th>
                            <th
                              scope="col"
                              className={dashboardTableHeadCellClass}
                            >
                              {t("dashboard.table.gender")}
                            </th>
                            <th
                              scope="col"
                              className={dashboardTableHeadCellClass}
                            >
                              {t("dashboard.table.action")}
                            </th>
                          </tr>
                        </thead>
                        <tbody className={dashboardTableBodyClass}>
                          {recentProfiles.map((profile) => (
                            <tr
                              key={profile.id}
                              className={dashboardTableRowHoverClass}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className={dashboardCellPrimaryClass}>
                                  {profile.name}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className={dashboardCellSecondaryClass}>
                                  {new Date(
                                    profile.birthday
                                  ).toLocaleDateString()}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className={dashboardCellSecondaryClass}>
                                  {profile.gender === "male"
                                    ? t("dashboard.table.male")
                                    : t("dashboard.table.female")}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="flex items-center space-x-3">
                                  <Link
                                    to={
                                      tier === "tier3" && !isAdmin
                                        ? `/tier3-result/${profile.id}`
                                        : `/result/${profile.id}`
                                    }
                                    className={dashboardPrimaryLinkClass}
                                  >
                                    {t("dashboard.table.view")}
                                  </Link>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteClick(
                                        profile.id,
                                        profile.name
                                      )
                                    }
                                    className={dashboardDangerButtonClass}
                                    title={t("dashboard.table.delete")}
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      aria-hidden="true"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <svg
                        className={dashboardEmptyIconClass}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <h3
                        className={`mt-2 text-sm font-medium ${dashboardCellPrimaryClass}`}
                      >
                        {t("dashboard.emptyState.title")}
                      </h3>
                      <p
                        className={`mt-1 text-sm ${dashboardCellSecondaryClass}`}
                      >
                        {t("dashboard.emptyState.description")}
                      </p>
                      <div className="mt-6">
                        <Link
                          to="/calculate"
                          className={dashboardPrimaryButtonClass}
                        >
                          <svg
                            className="-ml-1 mr-2 h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          {t("dashboard.emptyState.action")}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <ConfirmationModal
            isOpen={deleteConfirmation.isOpen}
            title={t("dashboard.deleteConfirmTitle") || "Delete Profile"}
            message={
              t("dashboard.deleteConfirmMessage")?.replace(
                "{{name}}",
                deleteConfirmation.profileName
              ) ||
              `Are you sure you want to delete "${deleteConfirmation.profileName}"? This action cannot be undone.`
            }
            confirmText={t("dashboard.table.delete") || "Delete"}
            cancelText={t("general.cancel") || "Cancel"}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
            type="danger"
          />
        </div>
      </PageTransition>
    </>
  );
};
export default Dashboard;
