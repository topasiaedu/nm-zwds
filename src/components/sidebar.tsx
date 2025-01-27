/* eslint-disable jsx-a11y/anchor-is-valid */
import classNames from "classnames";
import { DarkThemeToggle, Sidebar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiChartPie, HiInformationCircle } from "react-icons/hi";
import { BsGrid3X3 } from "react-icons/bs";
import { MdLogout } from "react-icons/md";
import { useAuthContext } from "../context/AuthContext";
import { useSidebarContext } from "../context/SidebarContext";
import isSmallScreen from "../helpers/is-small-screen";

const ExampleSidebar: React.FC = function () {
  const { isOpenOnSmallScreens: isSidebarOpenOnSmallScreens } =
    useSidebarContext();
  const [currentPage, setCurrentPage] = useState("");
  const { user, signOut } = useAuthContext();

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
        className="pt-2"
        collapsed={isSidebarOpenOnSmallScreens && !isSmallScreen()}
        // collapsed={true}
      >
        {/* <Sidebar.Logo href="/" img="/images/logo.svg" imgAlt="紫微斗數命盤 logo">
          <div className="flex items-center justify-between gap-2">
            <span className="bg-gradient-to-r from-[#CBB26B] to-[#CBB26B] bg-clip-text text-transparent font-bold text-xl">
              紫微斗數命盤
            </span>
          </div>
        </Sidebar.Logo> */}

        <img
          className="hidden lg:block mx-auto"
          // src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/authentication/illustration.svg"
          src="/images/logo.svg"
          alt="Sign-in Illustration"
        />
        <div>
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item
                href="/"
                icon={BsGrid3X3}
                className={
                  "/" === currentPage ? "bg-gray-100 dark:bg-gray-700" : ""
                }>
                紫微斗數命盤
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
                退出登录
              </Sidebar.Item>
            </Sidebar.ItemGroup>
            <Sidebar.ItemGroup>
              <Sidebar.Item
                href="https://api.whatsapp.com/send/?phone=60139968817&text&type=phone_number&app_absent=0"
                target="_blank"
                icon={HiInformationCircle}>
                联系我们
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>

          <BottomMenu />
        </div>
      </Sidebar>
    </div>
  );
};

const BottomMenu: React.FC = function () {
  return (
    <div className="flex items-center justify-center gap-x-5">
      <DarkThemeToggle />
    </div>
  );
};

export default ExampleSidebar;
