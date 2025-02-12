/* eslint-disable jsx-a11y/anchor-is-valid */
import classNames from "classnames";
import { Sidebar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { BsGrid3X3 } from "react-icons/bs";
import { HiInformationCircle } from "react-icons/hi";
import { MdLogout } from "react-icons/md";
import { useAuthContext } from "../context/AuthContext";
import { useSidebarContext } from "../context/SidebarContext";
import isSmallScreen from "../helpers/is-small-screen";
import { useLanguage } from "../context/LanguageContext";

const ExampleSidebar: React.FC = function () {
  const { isOpenOnSmallScreens: isSidebarOpenOnSmallScreens } =
    useSidebarContext();
  const [currentPage, setCurrentPage] = useState("");
  const { signOut } = useAuthContext();
  const { t } = useLanguage();

  useEffect(() => {
    const newPage = window.location.pathname;

    setCurrentPage(newPage);
  }, [setCurrentPage]);

  return (
    <div
      className={classNames("lg:!block", {
        hidden: !isSidebarOpenOnSmallScreens,
      })}>
      <Sidebar
        aria-label="Sidebar with multi-level dropdown example"
        collapsed={isSidebarOpenOnSmallScreens && !isSmallScreen()}>
        <div className="flex h-full flex-col justify-between py-2">
          <div>
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <Sidebar.Item
                  href="/"
                  icon={BsGrid3X3}
                  className={
                    "/" === currentPage ? "bg-gray-100 dark:bg-gray-700" : ""
                  }>
                  {t("dashboard")}
                </Sidebar.Item>

                {/* Logout */}
                <Sidebar.Item
                  icon={MdLogout}
                  onClick={signOut}
                  className={
                    "/logout" === currentPage
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }>
                  {t("logout")}
                </Sidebar.Item>
              </Sidebar.ItemGroup>
              <Sidebar.ItemGroup>
                <Sidebar.Item
                  href="https://api.whatsapp.com/send/?phone=60139968817&text&type=phone_number&app_absent=0"
                  target="_blank"
                  icon={HiInformationCircle}>
                  {t("contact_us")}
                </Sidebar.Item>
              </Sidebar.ItemGroup>
            </Sidebar.Items>

            {/* <BottomMenu /> */}
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

// const BottomMenu: React.FC = function () {
//   return (
//     <div className="flex items-center justify-center gap-x-5">
//       <LanguageToggle />
//       <DarkThemeToggle />
//     </div>
//   );
// };

export default ExampleSidebar;
