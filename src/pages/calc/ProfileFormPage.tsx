import { Card, TextInput, Datepicker, Button } from "flowbite-react";
import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useProfileContext } from "../../context/ProfileContext";
import { Label, Radio } from "flowbite-react";
import BirthTimePicker from "../../components/calc/BirthTimePicker";
import { HiPlus } from "react-icons/hi";
import { useAuthContext } from "../../context/AuthContext";
import { useAlertContext } from "../../context/AlertContext";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ProfileFormPage: React.FC = () => {
  const isSelf = useParams().isSelf === "true";
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [name, setName] = React.useState<string>("");
  const [birthday, setBirthday] = React.useState<Date>(new Date());
  const [birthTime, setBirthTime] = React.useState<string>("");
  const [gender, setGender] = React.useState<string>("male"); // Default to male
  const { user } = useAuthContext();
  const { addProfile, setCurrentProfile } = useProfileContext();
  const { showAlert } = useAlertContext();

  const handleAddProfile = async () => {
    if (!user) return;
    if (!name || !birthday || !birthTime || !gender) {
      showAlert(t("fill_all_fields"), "error");
      return;
    }

    await addProfile({
      name,
      birthday: birthday.toISOString(),
      birth_time: birthTime,
      gender,
      user_id: user.id,
      is_self: isSelf,
    })
      .then((data) => {
        if (data) {
          setName("");
          setBirthday(new Date());
          setBirthTime("");
          showAlert(t("profile_added_successfully"), "success");
          setCurrentProfile(data);
          // Redirect to results page
          navigate(`/calc/results/${data.id}`);
        } else {
          console.error("Error adding profile: Data is null");
          showAlert(t("error_adding_profile"), "error");
        }
      })
      .catch((error) => {
        console.error("Error adding profile:", error);
        showAlert(t("error_adding_profile"), "error");
      });
  };

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="flex items-center justify-center h-[100vh] gap-8">
        <Card className="max-w-sm rounded-lg shadow-lg p-8 dark:bg-gray-800 gap-4">
          <h5 className="text-2xl font-bold text-center">
            {t("profile_form")}
          </h5>

          {/* Name Input */}
          <div className="mb-4">
            <Label htmlFor="name">{t("name")}</Label>
            <div className="mt-1">
              <TextInput
                id="name"
                name="name"
                placeholder={t("name")}
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
          </div>

          {/* Birthday Picker */}
          <div className="mt-4 relative">
            <Label
              htmlFor="birthday"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              {t("select_date")}
            </Label>
            <Datepicker
              id="birthday"
              name="birthday"
              onChange={(date) => date && setBirthday(date)}
              value={birthday}
              className="z-50"
            />
          </div>

          {/* Birth Time Picker */}
          <BirthTimePicker birthTime={birthTime} setBirthTime={setBirthTime} />

          {/* Gender Selection */}
          <div className="mt-4">
            <legend className="mb-1">{t("gender")}</legend>
            <div className="flex gap-2">
              {/* Male Radio */}
              <div className="flex items-center gap-2">
                <Radio
                  id="male"
                  name="gender"
                  value="male"
                  checked={gender === "male"} // Fixed checked binding
                  onChange={(e) => setGender(e.target.value)}
                />
                <Label htmlFor="male">{t("male")}</Label>
              </div>

              {/* Female Radio */}
              <div className="flex items-center gap-2">
                <Radio
                  id="female"
                  name="gender"
                  value="female"
                  checked={gender === "female"} // Correct checked state
                  onChange={(e) => setGender(e.target.value)}
                />
                <Label htmlFor="female">{t("female")}</Label>
              </div>
            </div>
          </div>

          <Button color="primary" onClick={handleAddProfile}>
            <div className="flex items-center gap-x-3 text-md font-bold">
              <HiPlus className="text-xl" />
              {t("add_profile")}
            </div>
          </Button>
        </Card>
      </div>
    </NavbarSidebarLayout>
  );
};

export default ProfileFormPage;
