import React, { useState, useRef, useEffect } from "react";
import { useLanguage, Language } from "../context/LanguageContext";

/**
 * Language toggle component with a frosted glass dropdown menu
 */
const LanguageToggle: React.FC = () => {
  const { language, changeLanguage } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  /**
   * Toggle the dropdown menu
   */
  const toggleDropdown = (): void => {
    setDropdownOpen(!dropdownOpen);
  };
  
  /**
   * Handle language selection
   */
  const handleLanguageSelect = (lang: Language): void => {
    changeLanguage(lang);
    setDropdownOpen(false);
  };
  
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
  
  /**
   * Get the language icon and text
   */
  const getLanguageDisplay = (lang: Language): { icon: string; text: string } => {
    switch (lang) {
      case "en":
        return {
          icon: "🇺🇸",
          text: "English",
        };
      case "zh":
        return {
          icon: "🇨🇳",
          text: "中文",
        };
      default:
        return {
          icon: "🌐",
          text: "Unknown",
        };
    }
  };
  
  const currentLanguage = getLanguageDisplay(language);
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 px-3 py-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300"
        aria-expanded={dropdownOpen}
        type="button"
      >
        <span className="text-xl">{currentLanguage.icon}</span>
      </button>
      
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 z-50 w-48 rounded-2xl shadow-xl
                      border border-white/10
                      backdrop-filter backdrop-blur-2xl 
                      bg-white/10 hover:bg-white/15 
                      dark:bg-black/10 dark:hover:bg-black/20
                      transition-all duration-300">
          <ul className="py-2">
            <li>
              <button
                onClick={() => handleLanguageSelect("en")}
                className={`flex items-center w-full px-4 py-2 text-left hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-200 ${
                  language === "en" ? "bg-white/20 dark:bg-black/20" : ""
                }`}
              >
                <span className="text-xl mr-2">🇺🇸</span>
                <span className="dark:text-white">English</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLanguageSelect("zh")}
                className={`flex items-center w-full px-4 py-2 text-left hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-200 ${
                  language === "zh" ? "bg-white/20 dark:bg-black/20" : ""
                }`}
              >
                <span className="text-xl mr-2">🇨🇳</span>
                <span className="dark:text-white">中文</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;
