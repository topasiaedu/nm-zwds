import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useProfileContext } from "../../context/ProfileContext";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import LoadingPage from "../pages/loading";

const CalcResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { loading, currentProfile } = useProfileContext();

  if (!currentProfile) {
    navigate("/");
    return null;
  }

  if (loading) {
    return <LoadingPage />;
  }

  // Ensure birthday is a valid string before parsing
  const birthdayString = currentProfile?.birthday ?? "";
  const date = birthdayString ? new Date(birthdayString) : null;

  if (!date || isNaN(date.getTime())) {
    console.error("Invalid birthday format in profile.");
    navigate("/");
    return null;
  }

  // Extract date parts
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  // Ensure hour and gender exist
  const hour = currentProfile?.birth_time ? currentProfile.birth_time.toString().padStart(2, "0") : "00";
  const gender = currentProfile?.gender || "unknown";

  // Construct query parameters
  const queryParams = new URLSearchParams({ year, month, day, hour, gender }).toString();

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="flex items-center justify-center h-[100vh] gap-8">
        <iframe
          src={`/calc/index.html?${queryParams}`}
          style={{ width: "100%", height: "100vh", border: "none" }}
          title="Calculation Page"
        />
      </div>
    </NavbarSidebarLayout>
  );
};

export default CalcResultPage;
