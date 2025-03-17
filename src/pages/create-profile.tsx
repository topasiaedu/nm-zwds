import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { Link, useSearchParams } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import ProfileForm from "../components/ProfileForm";

/**
 * CreateProfile page for creating new profiles
 * Uses URL parameter to determine if it's a self profile or other profile
 */
const CreateProfile: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const isSelfProfile = searchParams.get("self") === "true";
  
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link to="/dashboard" className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t("general.back") || "Back"}
            </Link>
            <h1 className="text-3xl font-bold dark:text-white">
              {isSelfProfile 
                ? t("profile.createSelfTitle") 
                : t("profile.createOtherTitle")}
            </h1>
          </div>
        </div>

        <ProfileForm isSelfProfile={isSelfProfile} />
      </div>
    </PageTransition>
  );
};

export default CreateProfile; 