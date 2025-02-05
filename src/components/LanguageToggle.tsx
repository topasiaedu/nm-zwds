import React, { useState } from "react";
import { Dropdown } from "flowbite-react";
import { FaGlobe } from "react-icons/fa";
import { useLanguage, Language } from "../context/LanguageContext";

const LanguageToggle :React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  }

  return (
    <Dropdown
      label=""
      inline
      className="border border-gray-300 dark:border-gray-600 rounded-lg"
      renderTrigger={() => (
        <button className="flex items-center gap-2 px-3 py-2 border rounded-md bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
          <FaGlobe className="text-lg" />
          <span className="capitalize">{language === "en" ? "English" : "中文"}</span>
        </button>
      )}
    >
      <Dropdown.Item onClick={() => handleLanguageChange("en")}>
        🇬🇧 English
      </Dropdown.Item>
      <Dropdown.Item onClick={() => handleLanguageChange("zh")}>
        🇨🇳 中文
      </Dropdown.Item>
    </Dropdown>
  );
};

export default LanguageToggle;
