import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useTierAccess } from "../context/TierContext";
import { useAuth } from "../context/AuthContext";

interface TierProtectedRouteProps {
  children: React.ReactNode;
  requiredTier?: "tier1" | "tier2" | "admin";
  requiresDestinyNavigator?: boolean;
  requiresAnalytics?: boolean;
  adminOnly?: boolean;
}

/**
 * TierProtectedRoute component that restricts access based on user tier
 * Can be configured to check for specific tier requirements
 */
const TierProtectedRoute: React.FC<TierProtectedRouteProps> = ({
  children,
  requiredTier = "tier1",
  requiresDestinyNavigator = false,
  requiresAnalytics = false,
  adminOnly = false,
}) => {
  const { user } = useAuth();
  const location = useLocation();
  const { 
    isAdmin, 
    isTier2OrHigher, 
    hasDestinyNavigatorAccess, 
    hasAnalyticsAccess,
    canManageUsers 
  } = useTierAccess();

  // If user is not authenticated, redirect to sign in
  if (!user) {
    return <Navigate to="/authentication/sign-in" state={{ from: location }} replace />;
  }

  // Check admin-only access
  if (adminOnly && !canManageUsers) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check Destiny Navigator access
  if (requiresDestinyNavigator && !hasDestinyNavigatorAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check analytics access
  if (requiresAnalytics && !hasAnalyticsAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check specific tier requirements
  if (requiredTier === "admin" && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredTier === "tier2" && !isTier2OrHigher) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default TierProtectedRoute; 