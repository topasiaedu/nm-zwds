import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTierContext } from "../context/TierContext";

/**
 * Props for the ProtectedRoute component
 */
interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Protected route component that redirects to login if not authenticated
 * @param children - Child components to render when authenticated
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const { userDetails } = useTierContext();
  const location = useLocation();
  
  if (!user) {
    // Redirect to login if user is not authenticated
    // Store the current path in location state so we can redirect back after login
    return <Navigate to="/authentication/sign-in" state={{ from: location }} replace />;
  }

  // Check if membership has expired
  if (userDetails?.membership_expiration) {
    const expirationDate = new Date(userDetails.membership_expiration);
    const now = new Date();
    
    if (expirationDate < now) {
      // Don't redirect if already on membership-expired page to avoid infinite loop
      if (location.pathname !== "/membership-expired") {
        return <Navigate to="/membership-expired" replace />;
      }
    }
  }
  
  // Render children if authenticated and membership is valid
  return <>{children}</>;
};

export default ProtectedRoute;
