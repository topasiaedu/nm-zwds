import React, { useState, useRef, useEffect } from "react";
import { useLanguage, type Language } from "../context/LanguageContext";

/**
 * Language display metadata
 */
interface LanguageOption {
  code: Language;
  flag: string;
  label: string;
  shortLabel: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: "en", flag: "🇺🇸", label: "English", shortLabel: "EN" },
  { code: "zh-CN", flag: "🇨🇳", label: "简体中文", shortLabel: "简体" },
  { code: "zh-TW", flag: "🇹🇼", label: "繁體中文", shortLabel: "繁體" },
];

/**
 * Language toggle component with a frosted glass dropdown menu.
 * Renders a flag icon that opens a dropdown with all available languages.
 */
const LanguageToggle: React.FC = () => {
  const { language, changeLanguage } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const currentOption = LANGUAGE_OPTIONS.find((o) => o.code === language) ?? LANGUAGE_OPTIONS[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center space-x-1 px-3 py-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300"
        aria-expanded={dropdownOpen}
        aria-haspopup="listbox"
        type="button"
      >
        <span className="text-xl">{currentOption.flag}</span>
        <span className="text-xs font-medium hidden sm:inline">{currentOption.shortLabel}</span>
      </button>

      {dropdownOpen && (
        <div
          className="absolute left-0 mt-2 z-50 w-44 rounded-2xl shadow-xl
                      border border-white/20
                      backdrop-filter backdrop-blur-lg
                      bg-white/80 hover:bg-white/90
                      dark:bg-black/85 dark:hover:bg-black/95
                      transition-all duration-300"
          role="listbox"
        >
          <ul className="py-2">
            {LANGUAGE_OPTIONS.map((option) => (
              <li key={option.code}>
                <button
                  onClick={() => {
                    changeLanguage(option.code);
                    setDropdownOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-3 sm:py-2 text-left hover:bg-white/30 dark:hover:bg-black/40 transition-all duration-200 ${
                    language === option.code ? "bg-white/30 dark:bg-black/40" : ""
                  }`}
                  role="option"
                  aria-selected={language === option.code}
                >
                  <span className="text-xl mr-2">{option.flag}</span>
                  <span className="dark:text-white text-gray-800 font-medium text-sm">
                    {option.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;
