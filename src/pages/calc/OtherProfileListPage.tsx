import React from "react";
import { useProfileContext } from "../../context/ProfileContext";
import { useLanguage } from "../../context/LanguageContext";
import { Card } from "flowbite-react";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import { HiPlus } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const OtherProfileListPage: React.FC = () => {
  const { profiles } = useProfileContext();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="flex flex-col items-center justify-center h-[100vh] gap-8">
        <h1 className="text-2xl font-bold text-center mb-2">
          {t("other_profiles")}
        </h1>
        <div className="max-h-[80vh] overflow-y-auto">
          {/* Add Profile Button */}
          <Card
            className=" flex justify-center align-center rounded-lg shadow-lg p-4 cursor-pointer w-64 mt-4"
            onClick={() => navigate("/calc/profile/false")}>
            <HiPlus className="text-2xl text-center" />
            <h5 className="text-xl font-bold">{t("add_profile")}</h5>
          </Card>

          {profiles
            .filter((profile) => !profile.is_self)
            .map((profile) => (
              <Card
                key={profile.id}
                className="rounded-lg shadow-lg p-4 w-64 mt-4"
                onClick={() => navigate(`/calc/results/${profile.id}`)}>
                <h5 className="text-xl font-bold">{profile.name}</h5>
                <p>
                  {" "}
                  {new Intl.DateTimeFormat(
                    language === "en" ? "en-US" : "zh-CN",
                    {
                      timeZone: "Asia/Kuala_Lumpur",
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                    }
                  ).format(new Date(profile.birthday))}
                </p>
              </Card>
            ))}
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

export default OtherProfileListPage;
