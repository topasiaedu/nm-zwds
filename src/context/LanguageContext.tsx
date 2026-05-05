import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
  type PropsWithChildren,
} from "react";
import en from "../translations/en";
import zhCN from "../translations/zh-CN";
import zhTW from "../translations/zh-TW";

/**
 * Available languages.
 * "en"    = English
 * "zh-CN" = Simplified Chinese (Malaysia audience)
 * "zh-TW" = Traditional Chinese (Taiwan audience)
 */
export type Language = "en" | "zh-CN" | "zh-TW";

/**
 * Returns true for any Chinese-script language.
 * Use this instead of `language !== "en"` so that adding a new non-Chinese
 * language (e.g. "ms") does not accidentally activate Chinese layout.
 * Update this function when adding new Chinese variants.
 */
export const isChineseLanguage = (lang: Language): boolean =>
  lang === "zh-CN" || lang === "zh-TW";

/**
 * Translation map type — nested key → value structure.
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
 * All translation resources keyed by language code.
 */
const resources: Record<Language, TranslationMap> = {
  en,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
};

/**
 * Fallback order for each language.
 * When a key is missing in the primary language, the lookup walks this chain
 * before returning the raw key. This makes partially-complete zh-TW safe to
 * ship — missing keys fall through to zh-CN, then English.
 */
const fallbackChain: Record<Language, Language[]> = {
  en: ["en"],
  "zh-CN": ["zh-CN", "en"],
  "zh-TW": ["zh-TW", "zh-CN", "en"],
};

/**
 * Detect the initial language from localStorage, then browser preference.
 * Defaults to English if neither provides a supported value.
 */
const detectInitialLanguage = (): Language => {
  const stored = localStorage.getItem("language");
  if (stored === "en" || stored === "zh-CN" || stored === "zh-TW") {
    return stored;
  }

  const nav = navigator.language.toLowerCase();
  if (nav.startsWith("zh-tw") || nav.startsWith("zh-hk") || nav.startsWith("zh-mo")) {
    return "zh-TW";
  }
  if (nav.startsWith("zh")) {
    return "zh-CN";
  }
  return "en";
};

/**
 * Resolve a dotted key path against a TranslationMap.
 * Returns the string value or undefined if not found.
 */
const resolveKey = (map: TranslationMap, key: string): string | undefined => {
  const parts = key.split(".");
  let current: TranslationMap | string = map;

  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }

  return typeof current === "string" ? current : undefined;
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
 * Provider component for language context.
 * Detects the initial language from localStorage / browser, and provides
 * the t() function with a fallback chain so partially-translated languages
 * never show raw key strings.
 */
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(detectInitialLanguage);

  /**
   * Change the current language and persist to localStorage.
   */
  const changeLanguage = (lang: Language): void => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  /**
   * Get the translated string for a dot-separated key.
   * Walks the fallback chain (e.g. zh-TW → zh-CN → en) before giving up.
   */
  const t = (key: string): string => {
    const chain = fallbackChain[language];

    for (const fallbackLang of chain) {
      const value = resolveKey(resources[fallbackLang], key);
      if (value !== undefined) {
        return value;
      }
    }

    console.warn(`Translation key not found in any language: ${key}`);
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

/**
 * Language provider for off-screen PDF captures (detached React roots).
 * Uses PropsWithChildren so React.createElement(P, { language }, subtree) type-checks.
 */
type PdfCaptureLanguageProviderProps = PropsWithChildren<{
  language: Language;
}>;

export const PdfCaptureLanguageProvider: React.FC<PdfCaptureLanguageProviderProps> = ({
  language,
  children,
}) => {
  const t = useCallback(
    (key: string): string => {
      const chain = fallbackChain[language];

      for (const fallbackLang of chain) {
        const value = resolveKey(resources[fallbackLang], key);
        if (value !== undefined) {
          return value;
        }
      }

      console.warn(`Translation key not found in any language: ${key}`);
      return key;
    },
    [language]
  );

  const value = useMemo(
    (): LanguageContextType => ({
      language,
      changeLanguage: () => {
        /* no-op for static capture trees */
      },
      t,
    }),
    [language, t]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
};
