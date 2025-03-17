import React from "react";
import { Link } from "react-router-dom";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

/**
 * AuthNav component
 * Displays user authentication status and navigation options
 */
const AuthNav: React.FC = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();

  return (
    <Navbar fluid className="px-0 py-3 bg-transparent border-0">
      <div className="w-full flex items-center justify-between">
        <Navbar.Brand as={Link} to="/">
          <img 
            src="/images/logo.svg" 
            className="mr-3 h-6 sm:h-8" 
            alt="Logo" 
            onError={(e) => {
              // Fallback if image doesn't exist
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "https://via.placeholder.com/120x40?text=Logo";
            }}
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            {t("app.title")}
          </span>
        </Navbar.Brand>

        <div className="flex items-center md:order-2">
          {user ? (
            <UserDropdown />
          ) : (
            <div className="flex space-x-3">
              <Link 
                to="/authentication/sign-in"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                {t("auth.signin")}
              </Link>
              <Link
                to="/authentication/sign-up"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors"
              >
                {t("auth.signup")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </Navbar>
  );
};

/**
 * UserDropdown component
 * Displays user avatar and dropdown menu when logged in
 */
const UserDropdown: React.FC = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  
  // Get username from email or use default
  const username = user?.email ? user.email.split("@")[0] : "User";
  
  return (
    <Dropdown
      arrowIcon={false}
      inline
      label={
        <Avatar
          alt="User profile"
          img="https://via.placeholder.com/150"
          rounded
          bordered
          status="online"
          statusPosition="bottom-right"
        />
      }
    >
      <Dropdown.Header>
        <span className="block text-sm">{username}</span>
        <span className="block truncate text-sm font-medium">{user?.email}</span>
      </Dropdown.Header>
      <Dropdown.Item as={Link} to="/dashboard">
        {t("nav.dashboard")}
      </Dropdown.Item>
      <Dropdown.Item as={Link} to="/user/settings">
        {t("nav.settings")}
      </Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item onClick={() => signOut()}>
        {t("nav.logout")}
      </Dropdown.Item>
    </Dropdown>
  );
};

export default AuthNav; 