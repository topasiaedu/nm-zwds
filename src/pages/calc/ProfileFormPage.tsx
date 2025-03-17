import {
  Card,
  TextInput,
  Datepicker,
  Button,
  ToggleSwitch,
} from "flowbite-react";
import React, { useState } from "react";
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
  const [switch1, setSwitch1] = useState(false);
  const [switch2, setSwitch2] = useState(true);
  const [switch3, setSwitch3] = useState(true);
  
  const handleAddProfile = async (calcType: string) => {
    if (!user) return;
    if (!name || !birthday || !birthTime || !gender || !calcType) {
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
          navigate(`/result/${data.id}`);
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
              inline
              onChange={(date) => date && setBirthday(date)}
              value={birthday}
              className="z-50"
            />
          </div>

          {/* Birth Time Picker */}
          <BirthTimePicker birthTime={birthTime} setBirthTime={setBirthTime} />


          {/* Gender Toggle Switch */}
          <div className="mt-4">
            <Label htmlFor="gender">{t("gender")}</Label>
            <div className="flex items-center mt-2 gap-4">
              <span>{t("male")}</span>
              <ToggleSwitch
                checked={gender === "female"}
                onChange={() =>
                  setGender(gender === "male" ? "female" : "male")
                }
              />
              <span>{t("female")}</span>
            </div>
          </div>
          <Button
            color="primary"
            onClick={() => {
              handleAddProfile("1");
            }}>
            {" "}
            <div className="flex items-center gap-x-3 text-md font-bold">
              <HiPlus className="text-xl" />
              {t("add_profile")}
            </div>
          </Button>
          <Button
            color="primary"
            onClick={() => {
              handleAddProfile("2");
            }}>
            <div className="flex items-center gap-x-3 text-md font-bold">
              <HiPlus className="text-xl" />
              {t("add_profile")} 2
            </div>
          </Button>
        </Card>
      </div>
    </NavbarSidebarLayout>
  );
};

export default ProfileFormPage;
