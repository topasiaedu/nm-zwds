import React, { ReactNode } from "react";
import { authPageInnerClass, authPageShellClass } from "../../styles/authUi";

interface AuthPageLayoutProps {
  children: ReactNode;
}

/**
 * Centered auth page shell using COLOR_SCHEME surface backgrounds.
 */
export const AuthPageLayout: React.FC<AuthPageLayoutProps> = ({ children }) => {
  return (
    <div className={authPageShellClass}>
      <div className={authPageInnerClass}>{children}</div>
    </div>
  );
};

export default AuthPageLayout;
