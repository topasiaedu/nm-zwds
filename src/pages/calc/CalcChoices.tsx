import { useNavigate } from "react-router-dom";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import React, { useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useProfileContext } from "../../context/ProfileContext";
import { Card } from "flowbite-react";
import LoadingPage from "../pages/loading";

const CalcChoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { loading, currentProfile } = useProfileContext();
  console.log("currentProfile", currentProfile);

  useEffect(() => {

  }, [currentProfile]);

  if (!currentProfile || loading) {
    return <LoadingPage />;
  }


  console.log("currentProfile", currentProfile);

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="flex items-center justify-center h-[100vh] gap-8">
        <>
          {/* Navigate instead of window.location.href */}
          <Card
            className="max-w-sm rounded-lg shadow-lg p-8 cursor-pointer"
            onClick={() => {
              navigate("/calc/results/" + currentProfile.id + "/1");
            }}>
            <img
              src="/images/calc1.svg"
              alt="Discover yourself"
              className="w-64 h-64"
            />
            <h5 className="text-2xl font-bold text-center pt-4">
              {t("calculator_1")}
            </h5>
          </Card>

          <Card
            className="max-w-sm rounded-lg shadow-lg p-8 cursor-pointer"
            onClick={() =>
              navigate("/calc/results/" + currentProfile.id + "/2")
            }>
            <img
              src="/images/calc1_snake.svg"
              alt="Discover others"
              className="w-64 h-64"
            />
            <h5 className="text-2xl font-bold text-center pt-4">
              {t("calculator_2")}
            </h5>
          </Card>
        </>
      </div>
    </NavbarSidebarLayout>
  );
};

export default CalcChoicesPage;
