import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useProfileContext } from "../context/ProfileContext";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { renderTitleWithBrandGradientPhrases } from "../components/BrandGradientText";
import PageTransition from "../components/PageTransition";
import ProfileForm from "../components/ProfileForm";
import ConfirmationModal from "../components/ConfirmationModal";
import CommandCentreShell from "../components/layout/CommandCentreShell";
import { useAppNavItems } from "../hooks/useAppNavItems";
import { useAlertContext } from "../context/AlertContext";
import { C } from "../components/alignment-advantage/shared/constants";
import { Sparkle } from "../components/alignment-advantage/shared/Sparkle";
import {
  calculateCalloutBodyClass,
  calculateCalloutClass,
  calculateCalloutHeadingClass,
  calculateCardClass,
  calculateDangerButtonClass,
  calculateEmptyIconClass,
  calculateEmptyTextClass,
  calculateInfoCardClass,
  calculateInfoTitleClass,
  calculateLoadingTextClass,
  calculateProfileItemClass,
  calculateProfileMetaClass,
  calculateProfileNameClass,
  calculateSearchIconClass,
  calculateSearchInputClass,
  calculateSectionIconClass,
  calculateSectionTitleClass,
  calculateSpinnerClass,
} from "../styles/calculateUi";

/**
 * Calculate component for creating 紫微斗数 (Zi Wei Dou Shu) charts for other people
 */
const Calculate: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { profiles, loading, deleteProfile } = useProfileContext();
  const { showAlert } = useAlertContext();
  const navigate = useNavigate();
  const { items: appNavItems } = useAppNavItems({ activeKey: "calculate" });
  const [searchQuery, setSearchQuery] = useState("");
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

  const userInitial = displayName.trim().length > 0
    ? displayName.trim().charAt(0).toUpperCase()
    : "?";

  const handleProfileSuccess = (profileId?: string) => {
    if (profileId) {
      navigate(`/result/${profileId}`);
    }
  };

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
        t("dashboard.deleteSuccess").replace("{{name}}", deleteConfirmation.profileName),
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

  const otherProfiles = profiles
    .filter((profile) => !profile.is_self)
    .sort((a, b) => {
      const dateA = new Date(a.last_viewed || a.created_at).getTime();
      const dateB = new Date(b.last_viewed || b.created_at).getTime();
      return dateB - dateA;
    });

  const filteredProfiles = searchQuery.trim()
    ? otherProfiles.filter((profile) =>
        profile.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : otherProfiles;

  return (
    <PageTransition>
      <CommandCentreShell
        brandLabel="Purple Star Astrology"
        brandSubLabel={t("calculate.newCalculation")}
        contextTitle="Calculate"
        contextSubtitle={t("calculate.newCalculation")}
        appNavItems={appNavItems}
        sidebarFooter={(
          <div className="px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border border-white/30"
                style={{ background: "rgba(255,255,255,0.15)", color: C.white }}
              >
                {userInitial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{displayName}</p>
                <p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {user?.email ?? ""}
                </p>
              </div>
              <Sparkle size={10} color="rgba(255,255,255,0.60)" />
            </div>
          </div>
        )}
      >
        <div className="relative px-4 sm:px-6 md:px-10 py-6 md:py-10 min-w-0">
          {otherProfiles.length > 0 && (
            <p className="mb-6 text-sm text-theme-accent-muted">
              {t("dashboard.savedProfiles").replace(
                "{{count}}",
                otherProfiles.length.toString()
              )}
            </p>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className={calculateCardClass}>
                <h2 className={calculateSectionTitleClass}>
                  <svg
                    className={calculateSectionIconClass}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  {t("calculate.savedProfiles")}
                </h2>

                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className={calculateSearchIconClass}
                      aria-hidden="true"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="search"
                    className={calculateSearchInputClass}
                    placeholder={t("general.search") || "Search profiles..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {loading ? (
                  <div className="text-center py-6">
                    <div className={calculateSpinnerClass} />
                    <p className={calculateLoadingTextClass}>{t("common.loading")}</p>
                  </div>
                ) : otherProfiles.length > 0 ? (
                  <>
                    <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                      {filteredProfiles.map((profile) => (
                        <div key={profile.id} className={calculateProfileItemClass}>
                          <div className="flex justify-between items-start">
                            <Link to={`/result/${profile.id}`} className="flex-1">
                              <div>
                                <h3 className={calculateProfileNameClass}>
                                  {profile.name}
                                </h3>
                                <p className={calculateProfileMetaClass}>
                                  {t("dashboard.table.other")} •{" "}
                                  {new Date(profile.birthday).toLocaleDateString()}
                                </p>
                                <span className={calculateProfileMetaClass}>
                                  {new Date(
                                    profile.last_viewed || profile.created_at
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </Link>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(profile.id, profile.name);
                              }}
                              className={calculateDangerButtonClass}
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
                        </div>
                      ))}
                    </div>
                    {filteredProfiles.length === 0 && (
                      <div className="text-center py-4">
                        <p className={calculateLoadingTextClass}>
                          {t("general.noSearchResults") ||
                            "No profiles match your search"}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-6">
                    <svg
                      className={calculateEmptyIconClass}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    <p className={calculateEmptyTextClass}>
                      {t("calculate.noProfiles")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 order-1 lg:order-2">
              <ProfileForm
                isSelfProfile={false}
                onSuccess={handleProfileSuccess}
              />
            </div>

            <div className="lg:col-span-3 order-3">
              <div className={calculateInfoCardClass}>
                <h2 className={calculateInfoTitleClass}>
                  {renderTitleWithBrandGradientPhrases(t("calculate.aboutZiWei"))}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className={calculateCalloutClass}>
                    <h3 className={calculateCalloutHeadingClass}>
                      {renderTitleWithBrandGradientPhrases(t("calculate.whatIsZiWei"))}
                    </h3>
                    <p className={calculateCalloutBodyClass}>
                      {t("calculate.whatIsDescription")}
                    </p>
                  </div>

                  <div className={calculateCalloutClass}>
                    <h3 className={calculateCalloutHeadingClass}>
                      {t("calculate.requiredInfo")}
                    </h3>
                    <p className={calculateCalloutBodyClass}>
                      {t("calculate.requiredInfoDescription")}
                    </p>
                  </div>

                  <div className={calculateCalloutClass}>
                    <h3 className={calculateCalloutHeadingClass}>
                      {t("calculate.interpretation")}
                    </h3>
                    <p className={calculateCalloutBodyClass}>
                      {t("calculate.interpretationDescription")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-16" />
        </div>
      </CommandCentreShell>

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
    </PageTransition>
  );
};

export default Calculate;
