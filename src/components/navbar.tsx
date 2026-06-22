/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTierAccess } from "../context/TierContext";
import { useLanguage } from "../context/LanguageContext";
import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";
import { brandGradientTextClass } from "../styles/typographyUi";

/**
 * Navbar component with authentication status and user controls
 */
const FREE_TEST_ROUTE_PREFIXES = ["/free-test", "/free-result", "/free-test-ended"];

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const { isAdmin } = useTierAccess();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isFreeTestRoute = FREE_TEST_ROUTE_PREFIXES.some((prefix) =>
    location.pathname.startsWith(prefix)
  );

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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-surface-elevated/80 dark:bg-surface-darkSecondary/80 px-2 sm:px-4 border-b border-accent-gold/30 dark:border-brand-purpleDeep backdrop-blur-md">
      <div className="h-full max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
        <div className="flex items-center space-x-1 sm:space-x-3">
          {/* Language toggle - visible on free-test routes only for now */}
          {isFreeTestRoute && (
            <div className="flex items-center">
              <LanguageToggle />
            </div>
          )}

          {/* Theme toggle */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>

          {/* User profile dropdown */}
          {user && (
            <div className="relative z-20" ref={dropdownRef}>
              <button
                type="button"
                className="flex items-center text-sm rounded-full focus:ring-4 focus:ring-brand-purple/40 dark:focus:ring-accent-goldDark/40"
                onClick={() => setDropdownOpen(!dropdownOpen)}>
                <span className="sr-only">Open user menu</span>
                <div className="relative w-7 h-7 sm:w-8 sm:h-8 overflow-hidden bg-gradient-to-r from-brand-purple to-brand-purpleDeep rounded-full shadow ring-2 ring-accent-gold/40 dark:ring-brand-purpleDeep/70">
                  <svg
                    className="absolute w-9 h-9 sm:w-10 sm:h-10 text-white/70 -left-1 -top-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"></path>
                  </svg>
                </div>
              </button>

              {/* User dropdown menu */}
              {dropdownOpen && (
                <div
                  className="absolute left-0 mt-2 w-48 rounded-2xl shadow-xl
                              border border-accent-gold/40 dark:border-brand-purpleDeep
                              bg-surface-elevated dark:bg-surface-darkSecondary
                              transition-all duration-300 z-50">
                  <div className="px-4 py-3 text-sm border-b border-accent-gold/30 dark:border-brand-purpleDeep">
                    <div className="font-medium truncate text-navy dark:text-cream">
                      {user.user_metadata?.display_name || user.email?.split("@")[0] || "User"}
                    </div>
                    <div className="text-xs text-muted dark:text-muted-dark truncate">
                      {user.email}
                    </div>
                  </div>
                  <ul className="py-2 text-sm">
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-navy dark:text-cream hover:bg-surface-warm dark:hover:bg-brand-purpleDeep/50 transition-all duration-200"
                        onClick={() => setDropdownOpen(false)}>
                        {t("navbar.profile")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-navy dark:text-cream hover:bg-surface-warm dark:hover:bg-brand-purpleDeep/50 transition-all duration-200"
                        onClick={() => setDropdownOpen(false)}>
                        {t("navbar.settings")}
                      </Link>
                    </li>
                  </ul>
                  {isAdmin && (
                    <div className="py-2 border-t border-accent-gold/30 dark:border-brand-purpleDeep">
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-accent-coral dark:text-accent-coralDark hover:bg-surface-warm dark:hover:bg-brand-purpleDeep/50 transition-all duration-200"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 3l7 4v5c0 5-3.5 9-7 10-3.5-1-7-5-7-10V7l7-4z"
                          />
                        </svg>
                        Admin Dashboard
                      </Link>
                    </div>
                  )}
                  <div className="py-2 border-t border-accent-gold/30 dark:border-brand-purpleDeep">
                    <button
                      onClick={handleSignOut}
                      className="block w-full px-4 py-2 text-left text-sm text-accent-coral dark:text-accent-coralDark hover:bg-surface-warm dark:hover:bg-brand-purpleDeep/50 transition-all duration-200">
                      {t("navbar.signOut")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <Link
          to="/dashboard"
          className="flex flex-col items-center leading-tight rounded-lg transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/40 dark:focus-visible:ring-accent-goldDark/40"
          aria-label={t("navbar.dashboard")}
        >
          <div className="flex items-center">
            <span
              className={`text-xl sm:text-2xl md:text-3xl font-bold whitespace-nowrap ${brandGradientTextClass}`}
            >
              紫微斗数
            </span>
            <span className="ml-1 text-xs sm:text-sm font-bold px-1 sm:px-2 py-0.5 rounded-lg bg-gradient-to-r from-[#080657] via-[#8B1167] to-[#FE8E01] text-cream dark:from-accent-goldDark dark:via-accent-coralDark dark:to-accent-coral dark:text-surface-darkSecondary uppercase tracking-wider">
              CAE
            </span>
          </div>
        </Link>

        {!user && (
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* <Link
              to="/authentication/sign-in"
              className="text-purple-600 dark:text-purple-400 hover:underline font-medium text-sm sm:text-base"
            >
              {t("navbar.signIn")}
            </Link>
            <Link
              to="/authentication/sign-up"
              className="px-2 sm:px-4 py-1 sm:py-2 text-white text-sm sm:text-base bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg font-medium"
            >
              {t("navbar.signUp")}
            </Link> */}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
