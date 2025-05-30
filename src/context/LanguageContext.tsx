import React, { createContext, useContext, useState, ReactNode } from "react";
import en from "../translations/en";
import zh from "../translations/zh";

/**
 * Available languages
 */
export type Language = "en" | "zh";

/**
 * Translation map type
 */
interface TranslationMap {
  [key: string]: string | TranslationMap;
}

/**
 * Language context type definition
 */
export interface LanguageContextType {
  language: Language;
  changeLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

/**
 * Translation resources for each language
 */
const resources: Record<Language, TranslationMap> = {
  en,
  zh,
};

/**
 * Create the language context
 */
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Props for LanguageProvider
 */
interface LanguageProviderProps {
  children: ReactNode;
}

/**
 * Provider component for language context
 */
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Always force English language
  const getBrowserLanguage = (): Language => {
    return "en";
  };

  // Force language to always be English, ignore localStorage
  const [language, setLanguage] = useState<Language>("en");

  /**
   * Change the current language (disabled - always stays English)
   */
  const changeLanguage = (lang: Language): void => {
    // Force language to always stay English
    setLanguage("en");
    localStorage.setItem("language", "en");
  };

  /**
   * Get translation for a key
   */
  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = resources[language];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    if (typeof value === "string") {
      return value;
    }

    console.warn(`Translation key does not resolve to a string: ${key}`);
    return key;
  };

  const value = {
    language,
    changeLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Hook to use the language context
 */
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
