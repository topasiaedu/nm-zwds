import React, { createContext, useContext, useState, ReactNode } from "react";

// Define language types
export type Language = "en" | "zh";

// Define context shape
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Create context with default values
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const translations: Record<Language, Record<string, string>> = {
  en: {
    welcome: "Welcome",
    change_language: "Change Language",
    hello: "Hello",
    discover_yourself: "Discover Yourself",
    discover_others: "Discover Others",
    name: "Name",
    select_date: "Select Date",
    select_birth_time: "Select Birth Time",
    profile_form: "Profile Form",
    gender: "Gender",
    male: "Male",
    female: "Female",
    birth_time_placeholder: "Please select birth time",
    add_profile: "Add Profile",
    fill_all_fields: "Please fill in all fields",
    profile_added_successfully: "Profile added successfully",
    error_adding_profile: "Error adding profile",
    other_profiles: "Other Profiles",
    dashboard: "Dashboard",
    logout: "Logout",
    contact_us: "Contact Us",
    app_name: "Zi Wei Dou Shu Chart",
    welcome_back: "Welcome Back!",
    email: "Email",
    password: "Password",
    login: "Login",
    loading: "Loading...",
  },
  zh: {
    welcome: "欢迎",
    change_language: "更改语言",
    hello: "你好",
    discover_yourself: "发现自己",
    discover_others: "发现他人",
    name: "名字",
    select_date: "选择日期",
    select_birth_time: "选择出生时间",
    profile_form: "个人资料",
    gender: "性别",
    male: "男",
    female: "女",
    birth_time_placeholder: "请选择出生时间",
    add_profile: "添加个人资料",
    fill_all_fields: "请填写所有字段",
    profile_added_successfully: "成功添加个人资料",
    error_adding_profile: "添加个人资料时出错",
    other_profiles: "其他个人资料",
    dashboard: "紫微斗數命盤",
    logout: "退出登录",
    contact_us: "联系我们",
    app_name: "紫微斗數命盤",
    welcome_back: "欢迎回来!",
    email: "电子邮件",
    password: "密码",
    login: "登录",
    loading: "加载中...",
  },
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage2] = useState<Language>(localStorage.getItem("language") as Language || "en");

  // Function to translate a key
  const t = (key: string) => translations[language][key] || key;

  const setLanguage = (lang: Language) => {
    // Set to local storage
    localStorage.setItem("language", lang);
    setLanguage2(lang);
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
