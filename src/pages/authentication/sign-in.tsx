/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Card, Label, TextInput, Alert } from "flowbite-react";
import React, { useState, FC } from "react";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../pages/loading";
import { useAuthContext } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import LanguageToggle from "../../components/LanguageToggle";

const SignInPage: FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { signIn, user, loading } = useAuthContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn(username, password);

    if (result.error) {
      setError(result.error.message);
    } else {
      navigate("/");
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (user) {
    navigate("/");
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center px-6 lg:h-screen bg-gray-50 dark:bg-gray-900">
      <div className="grid max-w-screen-xl w-full py-8 lg:gap-20 lg:py-16 lg:grid-cols-12">
        {/* Illustration Section */}
        <div className="lg:col-span-6 place-self-center">
          <img
            className="hidden lg:block mx-auto"
            src="/images/logo.svg"
            alt="Sign-in Illustration"
          />
        </div>
        {/* Form Section */}
        <div className="lg:col-span-6 w-full mx-auto">
          <Card className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 sm:max-w-xl sm:p-8">
            <div className="flex items-center justify-between mb-8">
              <a
                href="#"
                className="inline-flex items-center text-4xl font-bold text-gray-900 dark:text-white">
                {t("app_name")}
              </a>
              <LanguageToggle />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("welcome_back")}
            </h1>
            {error && (
              <Alert color="failure" className="my-4">
                {error}
              </Alert>
            )}
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <Label htmlFor="username" className="mb-2">
                  {t("email")}
                </Label>
                <TextInput
                  id="username"
                  name="username"
                  placeholder="username123"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="mb-2">
                  {t("password")}
                </Label>
                <TextInput
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {t("login")}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
