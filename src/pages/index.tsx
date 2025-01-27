/* eslint-disable jsx-a11y/anchor-is-valid */
import NavbarSidebarLayout from "../layouts/navbar-sidebar";
import React from "react";

const DashboardPage: React.FC = () => {
  return (
    <NavbarSidebarLayout isFooter={false}>
      <iframe
      src="/calc/index.html"
      style={{ width: "100%", height: "100vh", border: "none" }}
      title="Static Page"
    />
    </NavbarSidebarLayout>

  );
};

export default DashboardPage;
