import React, { useEffect, useMemo, useState } from "react";
import {
  FEATURE_DESCRIPTIONS,
  FEATURE_KEYS,
  FeatureFlags,
  FeatureKey,
  PROGRAM_INFO,
  PROGRAM_TEMPLATES,
} from "../../types/features";

/**
 * Props for the FeatureFlagsManager modal component.
 */
export interface FeatureFlagsManagerProps {
  /** The user ID whose flags are being edited. */
  userId: string;
  /** Current flags loaded for the user. */
  currentFlags: FeatureFlags;
  /** Persist changes for the user. */
  onSave: (flags: FeatureFlags) => Promise<void>;
  /** Close the modal without saving. */
  onClose: () => void;
}

/**
 * Admin-only feature keys for grouping.
 */
const ADMIN_FEATURE_KEYS: FeatureKey[] = [
  "hasUserManagement",
  "hasSystemSettings",
  "canManageUserTiers",
  "canManageFeatureFlags",
  "canPauseUsers",
];

/**
 * Format a feature key into a human-friendly label.
 */
const formatFeatureName = (featureKey: FeatureKey): string => {
  const withSpaces = featureKey.replace(/([A-Z])/g, " $1");
  return withSpaces.replace(/^./, (match) => match.toUpperCase());
};

/**
 * Safely build a complete feature flags map with a single value.
 */
const buildAllFlags = (value: boolean): FeatureFlags => {
  return FEATURE_KEYS.reduce<FeatureFlags>((accumulator, key) => {
    return { ...accumulator, [key]: value };
  }, {});
};

/**
 * FeatureFlagsManager modal component for editing user feature flags.
 */
const FeatureFlagsManager: React.FC<FeatureFlagsManagerProps> = ({
  userId,
  currentFlags,
  onSave,
  onClose,
}) => {
  const [editedFlags, setEditedFlags] = useState<FeatureFlags>({ ...currentFlags });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const adminFeatureSet = useMemo(() => new Set(ADMIN_FEATURE_KEYS), []);
  const userFeatureKeys = useMemo(
    () => FEATURE_KEYS.filter((key) => !adminFeatureSet.has(key)),
    [adminFeatureSet]
  );

  /**
   * Sync local state whenever the modal is opened with new data.
   */
  useEffect(() => {
    setEditedFlags({ ...currentFlags });
    setSuccessMessage(null);
    setErrorMessage(null);
  }, [currentFlags, userId]);

  /**
   * Prevent background scrolling while the modal is visible.
   */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  /**
   * Map an unknown error to a safe message for the UI.
   */
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error && error.message.trim().length > 0) {
      return error.message;
    }
    return "Failed to save feature flags. Please try again.";
  };

  /**
   * Toggle a specific feature flag.
   */
  const handleToggleFeature = (key: FeatureKey, enabled: boolean) => {
    setEditedFlags((previous) => ({ ...previous, [key]: enabled }));
  };

  /**
   * Apply a template by merging it into the current edited flags.
   */
  const handleApplyTemplate = (template: FeatureFlags) => {
    setEditedFlags((previous) => ({ ...previous, ...template }));
  };

  /**
   * Enable all user-level features while preserving admin flags.
   */
  const handleSelectAllUserFeatures = () => {
    const userEnabled = userFeatureKeys.reduce<FeatureFlags>((accumulator, key) => {
      return { ...accumulator, [key]: true };
    }, {});
    setEditedFlags((previous) => ({ ...previous, ...userEnabled }));
  };

  /**
   * Clear all features for the user.
   */
  const handleClearAll = () => {
    setEditedFlags(buildAllFlags(false));
  };

  /**
   * Persist the changes via the onSave prop.
   */
  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      await onSave(editedFlags);
      setSuccessMessage("Feature flags saved successfully.");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const templateButtons = [
    {
      id: "tier2",
      label: "DYD",
      info: PROGRAM_INFO.tier2,
      template: PROGRAM_TEMPLATES.tier2,
    },
    {
      id: "founder",
      label: "Founder",
      info: PROGRAM_INFO.founder,
      template: PROGRAM_TEMPLATES.founder,
    },
    {
      id: "beta",
      label: "Beta",
      info: PROGRAM_INFO.beta,
      template: PROGRAM_TEMPLATES.beta,
    },
    {
      id: "admin",
      label: "Admin",
      info: PROGRAM_INFO.admin,
      template: PROGRAM_TEMPLATES.admin,
    },
  ];

  /**
   * Large quick-apply program buttons for common setups.
   */
  const quickApplyButtons = [
    {
      id: "quick-tier2",
      label: "Apply DYD Program",
      info: PROGRAM_INFO.tier2,
      template: PROGRAM_TEMPLATES.tier2,
    },
    {
      id: "quick-founder",
      label: "Apply Founder Program",
      info: PROGRAM_INFO.founder,
      template: PROGRAM_TEMPLATES.founder,
    },
    {
      id: "quick-beta",
      label: "Apply Beta Program",
      info: PROGRAM_INFO.beta,
      template: PROGRAM_TEMPLATES.beta,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feature-flags-title"
      >
        <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3
              id="feature-flags-title"
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              Feature Flags Manager
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Update access for user ID: {userId}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[65vh] space-y-6">
          {/* Step: Highlight quick-apply programs at the top for visibility. */}
          <div className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 p-4">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <h4 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">
                  Quick Apply
                </h4>
                <p className="text-xs text-indigo-700 dark:text-indigo-200 mt-1">
                  One-click setup for the most common programs.
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {quickApplyButtons.map((button) => (
                <button
                  key={button.id}
                  type="button"
                  onClick={() => handleApplyTemplate(button.template)}
                  disabled={isSaving}
                  className="text-left px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-indigo-100 dark:border-indigo-800 shadow-sm hover:shadow-md transition-shadow disabled:opacity-50"
                >
                  <div className="text-sm font-semibold text-indigo-700 dark:text-indigo-200">
                    {button.label}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {button.info.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {templateButtons.map((button) => (
              <button
                key={button.id}
                type="button"
                onClick={() => handleApplyTemplate(button.template)}
                disabled={isSaving}
                className="px-3 py-1.5 text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors disabled:opacity-50"
                title={button.info.description}
              >
                {button.label} Template
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleSelectAllUserFeatures}
              disabled={isSaving}
              className="px-3 py-1.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors disabled:opacity-50"
            >
              Select All User Features
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              disabled={isSaving}
              className="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
            >
              Clear All
            </button>
          </div>

          {(successMessage || errorMessage) && (
            <div
              className={`rounded-lg border px-4 py-3 text-sm ${
                successMessage
                  ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200"
                  : "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200"
              }`}
              role="status"
            >
              {successMessage || errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  User Features
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Toggle end-user accessible features.
                </p>
              </div>
              <div className="space-y-3">
                {userFeatureKeys.map((key) => {
                  const checked = Boolean(editedFlags[key]);
                  const inputId = `feature-${key}`;
                  return (
                    <label
                      key={key}
                      htmlFor={inputId}
                      className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900/30 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatFeatureName(key)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {FEATURE_DESCRIPTIONS[key]}
                        </div>
                      </div>
                      <input
                        id={inputId}
                        type="checkbox"
                        checked={checked}
                        disabled={isSaving}
                        onChange={(event) => handleToggleFeature(key, event.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Admin Features
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Toggle administrative permissions and access.
                </p>
              </div>
              <div className="space-y-3">
                {ADMIN_FEATURE_KEYS.map((key) => {
                  const checked = Boolean(editedFlags[key]);
                  const inputId = `feature-${key}`;
                  return (
                    <label
                      key={key}
                      htmlFor={inputId}
                      className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900/30 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatFeatureName(key)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {FEATURE_DESCRIPTIONS[key]}
                        </div>
                      </div>
                      <input
                        id={inputId}
                        type="checkbox"
                        checked={checked}
                        disabled={isSaving}
                        onChange={(event) => handleToggleFeature(key, event.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving && (
              <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureFlagsManager;
