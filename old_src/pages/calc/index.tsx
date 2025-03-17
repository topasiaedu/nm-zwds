import { useNavigate } from "react-router-dom";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import React, { useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { Profile, useProfileContext } from "../../context/ProfileContext";
import { useAuthContext } from "../../context/AuthContext";
import { Card } from "flowbite-react";
import LoadingPage from "../pages/loading";

const CalculatorPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { loading, profiles, setCurrentProfile } = useProfileContext();
  const { user } = useAuthContext();
  const [self, setSelf] = React.useState<Profile | null>(null);

  useEffect(() => {
    if (!user) return;
    if (profiles.length === 0) return;

    const self = profiles.find(
      (profile) => profile.user_id === user.id && profile.is_self
    );
    if (self) {
      setSelf(self);
    }
  }, [user, profiles]);

  if (!user || loading) {
    return <LoadingPage />;
  }

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="flex items-center justify-center h-[100vh] gap-8">
        <>
          {/* Navigate instead of window.location.href */}
          <Card
            className="max-w-sm rounded-lg shadow-lg p-8 cursor-pointer"
            onClick={() => {
              if (!self) {
                navigate("/calc/profile/true");
              } else {
                setCurrentProfile(self);
                navigate("/calc/choices/" + self.id);
              }
            }}>
            <img
              src="/images/self.svg"
              alt="Discover yourself"
              className="w-64 h-64"
            />
            <h5 className="text-2xl font-bold text-center pt-4">
              {t("discover_yourself")}
            </h5>
          </Card>

          <Card
            className="max-w-sm rounded-lg shadow-lg p-8 cursor-pointer"
            onClick={() => navigate("/calc/profiles")}>
            <img
              src="/images/others.svg"
              alt="Discover others"
              className="w-64 h-64"
            />
            <h5 className="text-2xl font-bold text-center pt-4">
              {t("discover_others")}
            </h5>
          </Card>
        </>
      </div>
    </NavbarSidebarLayout>
  );
};

export default CalculatorPage;
