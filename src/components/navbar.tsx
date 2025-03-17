/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";

/**
 * Navbar component with authentication status and user controls
 */
const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  /**
   * Handle sign out action
   */
  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut();
      navigate("/authentication/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
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
  
  return (
    <nav className="bg-transparent border-gray-200 px-4 py-2.5 border-b border-white/10 dark:border-gray-800/50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
        <div className="flex items-center">
          {/* Language toggle */}
          <div className="flex items-center mr-3">
            <LanguageToggle />
          </div>
          
          {/* Theme toggle */}
          <div className="flex items-center mr-3">
            <ThemeToggle />
          </div>
          
          {/* User profile dropdown */}
          {user && (
            <div className="relative z-20" ref={dropdownRef}>
              <button
                type="button"
                className="flex items-center text-sm rounded-full focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-600"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="sr-only">Open user menu</span>
                <div className="relative w-8 h-8 overflow-hidden bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full shadow ring-2 ring-white/20 dark:ring-gray-800/70">
                  <svg
                    className="absolute w-10 h-10 text-white/70 -left-1 -top-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
              </button>
              
              {/* User dropdown menu */}
              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-2xl shadow-xl
                              border border-white/10
                              backdrop-filter backdrop-blur-2xl 
                              bg-white/10 hover:bg-white/15 
                              dark:bg-black/10 dark:hover:bg-black/20
                              transition-all duration-300 z-50">
                  <div className="px-4 py-3 text-sm border-b border-white/10 dark:border-gray-800/50">
                    <div className="font-medium truncate dark:text-white">
                      {user.email}
                    </div>
                  </div>
                  <ul className="py-2 text-sm">
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-white/20 dark:hover:bg-black/20 dark:text-white transition-all duration-200"
                        onClick={() => setDropdownOpen(false)}
                      >
                        {t("navbar.profile")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 hover:bg-white/20 dark:hover:bg-black/20 dark:text-white transition-all duration-200"
                        onClick={() => setDropdownOpen(false)}
                      >
                        {t("navbar.settings")}
                      </Link>
                    </li>
                  </ul>
                  <div className="py-2 border-t border-white/10 dark:border-gray-800/50">
                    <button
                      onClick={handleSignOut}
                      className="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-200"
                    >
                      {t("navbar.signOut")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <Link to="/" className="flex items-center">
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-purple-600 dark:text-purple-400">
            紫微斗数
          </span>
        </Link>
        
        {!user && (
          <div className="flex items-center space-x-3">
            <Link
              to="/authentication/sign-in"
              className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
            >
              {t("navbar.signIn")}
            </Link>
            <Link
              to="/authentication/sign-up"
              className="px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg font-medium"
            >
              {t("navbar.signUp")}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
