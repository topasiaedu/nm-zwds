import React, { useEffect } from "react";
import { useChartSettings, ChartSettings, PageType } from "../context/ChartSettingsContext";

/**
 * Props for ChartSettingsModal component
 */
interface ChartSettingsModalProps {
  /** Current page type for resetting to appropriate defaults */
  pageType: PageType;
}

/**
 * Toggle switch component for individual settings
 */
interface ToggleSwitchProps {
  /** Whether the toggle is enabled */
  enabled: boolean;
  /** Callback when toggle is changed */
  onChange: (enabled: boolean) => void;
  /** Label for the toggle */
  label: string;
  /** Description of what the toggle does */
  description: string;
  /** Whether the toggle is disabled */
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  enabled,
  onChange,
  label,
  description,
  disabled = false,
}) => {
  return (
    <div className={`flex items-center justify-between py-3 ${disabled ? "opacity-50" : ""}`}>
      <div className="flex-1 mr-4">
        <label className="text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
          enabled 
            ? "bg-indigo-600" 
            : "bg-gray-200 dark:bg-gray-700"
        } ${disabled ? "cursor-not-allowed" : ""}`}
        role="switch"
        aria-checked={enabled}>
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};

/**
 * ChartSettingsModal component to configure chart interaction features
 * Provides toggle switches for various chart features with descriptions
 */
const ChartSettingsModal: React.FC<ChartSettingsModalProps> = ({ pageType }) => {
  const { 
    settings, 
    updateSetting, 
    resetToDefaults, 
    getPageDefaults,
    isModalOpen, 
    closeModal 
  } = useChartSettings();

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isModalOpen, closeModal]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  /**
   * Handle reset to defaults for current page
   */
  const handleResetToDefaults = () => {
    resetToDefaults(pageType);
  };

  /**
   * Handle enabling all features
   */
     const handleEnableAll = () => {
     const allEnabledSettings: ChartSettings = {
       transformationLines: true,
       palaceClickInteraction: true,
       daXianClickInteraction: true,
       palaceNameClickInteraction: true,
       selfInfluenceIcon: true,
       liuNianTag: true,
       yearAgeClickInteraction: true,
       activationTags: true,
     };
    
    Object.entries(allEnabledSettings).forEach(([key, value]) => {
      updateSetting(key as keyof ChartSettings, value);
    });
  };

  /**
   * Handle disabling all features
   */
     const handleDisableAll = () => {
     const allDisabledSettings: ChartSettings = {
       transformationLines: false,
       palaceClickInteraction: false,
       daXianClickInteraction: false,
       palaceNameClickInteraction: false,
       selfInfluenceIcon: false,
       liuNianTag: false,
       yearAgeClickInteraction: false,
       activationTags: false,
     };
    
    Object.entries(allDisabledSettings).forEach(([key, value]) => {
      updateSetting(key as keyof ChartSettings, value);
    });
  };

  // Get page defaults for comparison
  const pageDefaults = getPageDefaults(pageType);
  const isAtDefaults = JSON.stringify(settings) === JSON.stringify(pageDefaults);

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Chart Settings
          </h3>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Close modal">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Configure which chart features are enabled. When disabled, features will not be interactive or visible.
          </p>

          {/* Quick Actions */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={handleEnableAll}
              className="px-3 py-1.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
              Enable All
            </button>
            <button
              onClick={handleDisableAll}
              className="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
              Disable All
            </button>
            <button
              onClick={handleResetToDefaults}
              disabled={isAtDefaults}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                isAtDefaults
                  ? "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}>
              Reset to Defaults
            </button>
          </div>

          {/* Settings Toggles */}
          <div className="space-y-1">
            <ToggleSwitch
              enabled={settings.transformationLines}
              onChange={(value) => updateSetting("transformationLines", value)}
              label="Activation Lines"
              description="Show colored lines connecting palaces when clicked to display activations"
            />

            <ToggleSwitch
              enabled={settings.palaceClickInteraction}
              onChange={(value) => updateSetting("palaceClickInteraction", value)}
              label="Palace Click Interaction"
              description="Allow clicking on palaces to show activation lines and highlights"
            />

            <ToggleSwitch
              enabled={settings.daXianClickInteraction}
              onChange={(value) => updateSetting("daXianClickInteraction", value)}
              label="Da Xian Click Interaction"
              description="Allow clicking on Da Xian (major limit) sections to show Da Ming tags"
            />

            <ToggleSwitch
              enabled={settings.palaceNameClickInteraction}
              onChange={(value) => updateSetting("palaceNameClickInteraction", value)}
              label="Palace Name Click Interaction"
              description="Allow clicking on palace names to show secondary palace names"
            />

            <ToggleSwitch
              enabled={settings.selfInfluenceIcon}
              onChange={(value) => updateSetting("selfInfluenceIcon", value)}
              label="Self Influence Icons"
              description="Show transformation icons next to stars that have self-influence"
            />

            <ToggleSwitch
              enabled={settings.liuNianTag}
              onChange={(value) => updateSetting("liuNianTag", value)}
              label="Liu Nian Tags"
              description="Show Liu Nian (annual flow) tags when present in palaces"
            />

            <ToggleSwitch
              enabled={settings.yearAgeClickInteraction}
              onChange={(value) => updateSetting("yearAgeClickInteraction", value)}
              label="Year/Age Click Interaction"
              description="Allow clicking on year/age to show corresponding months"
            />

            <ToggleSwitch
              enabled={settings.activationTags}
              onChange={(value) => updateSetting("activationTags", value)}
              label="Activation Tags"
              description="Show activation tags beside stars in palaces"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChartSettingsModal; 