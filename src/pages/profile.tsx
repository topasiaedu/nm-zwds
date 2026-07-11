import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Legacy /profile route — account settings now live at /settings.
 */
const Profile: React.FC = () => {
  return <Navigate to="/settings" replace />;
};

export default Profile;
