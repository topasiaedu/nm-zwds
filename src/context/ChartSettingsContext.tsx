import React, { createContext, useContext, useState, ReactNode } from "react";

/**
 * Chart settings interface defining all toggleable features
 */
export interface ChartSettings {
  /** Show activation lines when palace is clicked */
  transformationLines: boolean;
  /** Allow palace clicking to show activation lines */
  palaceClickInteraction: boolean;
  /** Allow Da Xian clicking to show Da Ming tags */
  daXianClickInteraction: boolean;
  /** Allow palace name clicking to show secondary palace names */
  palaceNameClickInteraction: boolean;
  /** Show self influence icons on stars */
  selfInfluenceIcon: boolean;
  /** Show Liu Nian (annual flow) tags */
  liuNianTag: boolean;
  /** Allow year/age clicking to show months */
  yearAgeClickInteraction: boolean;
  /** Show activation tags beside stars */
  activationTags: boolean;
}

/**
 * Page-specific default settings
 */
export type PageType = "result" | "free-result" | "timing-chart";

const DEFAULT_SETTINGS: Record<PageType, ChartSettings> = {
  // Result page - most features enabled by default
  result: {
    transformationLines: true,
    palaceClickInteraction: true,
    daXianClickInteraction: true,
    palaceNameClickInteraction: true,
    selfInfluenceIcon: true,
    liuNianTag: true,
    yearAgeClickInteraction: true,
    activationTags: true,
  },
  // Free result page - all features disabled by default except activation tags
  "free-result": {
    transformationLines: false,
    palaceClickInteraction: false,
    daXianClickInteraction: false,
    palaceNameClickInteraction: false,
    selfInfluenceIcon: false,
    liuNianTag: false,
    yearAgeClickInteraction: false,
    activationTags: true,
  },
  // Timing chart page - selective features enabled
  "timing-chart": {
    transformationLines: true,
    palaceClickInteraction: true,
    daXianClickInteraction: false,
    palaceNameClickInteraction: false,
    selfInfluenceIcon: true,
    liuNianTag: true,
    yearAgeClickInteraction: false,
    activationTags: true,
  },
};

/**
 * Context interface
 */
interface ChartSettingsContextType {
  /** Current chart settings */
  settings: ChartSettings;
  /** Update a specific setting */
  updateSetting: (key: keyof ChartSettings, value: boolean) => void;
  /** Reset settings to page defaults */
  resetToDefaults: (pageType: PageType) => void;
  /** Get default settings for a page */
  getPageDefaults: (pageType: PageType) => ChartSettings;
  /** Check if settings modal should be shown */
  isModalOpen: boolean;
  /** Toggle settings modal visibility */
  toggleModal: () => void;
  /** Close settings modal */
  closeModal: () => void;
}

/**
 * Chart Settings Context
 */
const ChartSettingsContext = createContext<ChartSettingsContextType | undefined>(undefined);

/**
 * Props for ChartSettingsProvider
 */
interface ChartSettingsProviderProps {
  children: ReactNode;
  /** Default page type for initial settings */
  defaultPageType?: PageType;
}

/**
 * Chart Settings Provider component
 */
export const ChartSettingsProvider: React.FC<ChartSettingsProviderProps> = ({
  children,
  defaultPageType = "result",
}) => {
  const [settings, setSettings] = useState<ChartSettings>(DEFAULT_SETTINGS[defaultPageType]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  /**
   * Update a specific chart setting
   */
  const updateSetting = (key: keyof ChartSettings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  /**
   * Reset settings to page defaults
   */
  const resetToDefaults = (pageType: PageType) => {
    setSettings({ ...DEFAULT_SETTINGS[pageType] });
  };

  /**
   * Get default settings for a page
   */
  const getPageDefaults = (pageType: PageType): ChartSettings => {
    return { ...DEFAULT_SETTINGS[pageType] };
  };

  /**
   * Toggle settings modal visibility
   */
  const toggleModal = () => {
    setIsModalOpen(prev => !prev);
  };

  /**
   * Close settings modal
   */
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const contextValue: ChartSettingsContextType = {
    settings,
    updateSetting,
    resetToDefaults,
    getPageDefaults,
    isModalOpen,
    toggleModal,
    closeModal,
  };

  return (
    <ChartSettingsContext.Provider value={contextValue}>
      {children}
    </ChartSettingsContext.Provider>
  );
};

/**
 * Hook to use chart settings context
 */
export const useChartSettings = (): ChartSettingsContextType => {
  const context = useContext(ChartSettingsContext);
  if (context === undefined) {
    throw new Error("useChartSettings must be used within a ChartSettingsProvider");
  }
  return context;
};

/**
 * Higher-order component to wrap components with chart settings
 */
export const withChartSettings = <P extends object>(
  Component: React.ComponentType<P>,
  pageType: PageType = "result"
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <ChartSettingsProvider defaultPageType={pageType}>
        <Component {...props} />
      </ChartSettingsProvider>
    );
  };

  WrappedComponent.displayName = `withChartSettings(${Component.displayName || Component.name})`;
  return WrappedComponent;
}; 