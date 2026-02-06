import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
  useRef,
} from "react";
import { supabase } from "../utils/supabase-client";
import { Database } from "../../database.types";
import { useAuthContext } from "./AuthContext";
import {
  FeatureFlags,
  FeatureKey,
  PROGRAM_TEMPLATES,
} from "../types/features";

export type UserDetails = Database["public"]["Tables"]["user_details"]["Row"];
export type UserDetailsInsert = Database["public"]["Tables"]["user_details"]["Insert"];
export type UserDetailsUpdate = Database["public"]["Tables"]["user_details"]["Update"];

// Type for user details with email from auth
export type UserDetailsWithEmail = UserDetails & {
  email?: string;
};

/**
 * User tier identifiers used throughout the app.
 * Includes "tier3" temporarily to keep legacy checks compiling.
 */
export type UserTier = "tier1" | "tier2" | "tier3" | "founder" | "beta" | "admin";

interface TierContextProps {
  loading: boolean;
  userDetails: UserDetails | null;
  tier: UserTier;
  isAdmin: boolean;
  isTier2OrHigher: boolean;
  isPaused: boolean;
  featureFlags: FeatureFlags;
  hasFeature: (feature: FeatureKey) => boolean;
  updateUserTier: (userId: string, newTier: UserTier) => Promise<boolean>;
  toggleUserPause: (userId: string, isPaused: boolean) => Promise<boolean>;
  updateFeatureFlags: (userId: string, flags: FeatureFlags) => Promise<boolean>;
  applyProgramTemplate: (userId: string, programKey: string) => Promise<boolean>;
  updateMembershipExpiration: (userId: string, expiration: string | null) => Promise<boolean>;
  quickSetProgram: (userId: string, programKey: string) => Promise<boolean>;
  getAllUserDetails: () => Promise<UserDetailsWithEmail[]>;
}

const TierContext = createContext<TierContextProps | undefined>(undefined);

/**
 * TierProvider component that manages user tier state and provides tier-related functions
 */
export function TierProvider({ children }: { readonly children: ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const { user } = useAuthContext();
  
  // Use ref to avoid closure issues in real-time handlers
  const userRef = useRef(user);
  
  // Update ref when user changes
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user) {
        setUserDetails(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from("user_details")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) {
          // If user_details doesn't exist, create it with default tier1
          if (error.code === "PGRST116") {
            console.log("TierContext - Creating user_details for new user:", user.id);
                         const { data: newUserDetails, error: insertError } = await supabase
               .from("user_details")
               .insert([{ user_id: user.id, tier: "tier1" }])
               .select()
               .single();

            if (insertError) {
              console.error("TierContext - Error creating user_details:", insertError);
              setUserDetails(null);
            } else {
              console.log("TierContext - Created user_details:", newUserDetails);
              setUserDetails(newUserDetails);
            }
          } else {
            console.error("TierContext - Error fetching user_details:", error);
            setUserDetails(null);
          }
        } else {
          // Fetched user details successfully
          setUserDetails(data);
        }
      } catch (error) {
        console.error("TierContext - Exception fetching user_details:", error);
        setUserDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();

    // Set up real-time subscription for tier changes
    let subscription: any = null;
    
    if (user) {
      const channelName = `user-details-${user.id}`;
      // Use a handler that doesn't capture user in closure
      const handleRealtimeChange = (payload: any) => {
        
        if ((payload.eventType === "UPDATE" || payload.eventType === "INSERT") && payload.new) {
          setUserDetails(payload.new as UserDetails);
        }
      };

      subscription = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          { 
            event: "*", 
            schema: "public", 
            table: "user_details",
            filter: `user_id=eq.${user.id}`
          },
          handleRealtimeChange
        )
        .subscribe();
    }

    // Improved cleanup
    return () => {
      if (subscription) {
        subscription.unsubscribe().catch((error: any) => {
          console.error("TierContext - Error unsubscribing:", error);
        });
      }
    };
  }, [user]);

  /**
   * Update a user's tier - Admin only function
   */
  const updateUserTier = useCallback(async (userId: string, newTier: UserTier): Promise<boolean> => {
    if (userDetails?.tier !== "admin") {
      console.error("TierContext - Unauthorized tier update attempt");
      return false;
    }

    try {
      const { error } = await supabase
        .from("user_details")
        .update({ tier: newTier })
        .eq("user_id", userId);

      if (error) {
        console.error("TierContext - Error updating user tier:", error);
        return false;
      }

      console.log("TierContext - Successfully updated user tier:", userId, newTier);
      return true;
    } catch (error) {
      console.error("TierContext - Exception updating user tier:", error);
      return false;
    }
  }, [userDetails]);

  /**
   * Toggle user pause status - Admin only function
   */
  const toggleUserPause = useCallback(async (userId: string, isPaused: boolean): Promise<boolean> => {
    if (userDetails?.tier !== "admin") {
      console.error("TierContext - Unauthorized pause toggle attempt");
      return false;
    }

    try {
      const { error } = await supabase
        .from("user_details")
        .update({ is_paused: isPaused })
        .eq("user_id", userId);

      if (error) {
        console.error("TierContext - Error toggling user pause:", error);
        return false;
      }

      console.log("TierContext - Successfully toggled user pause:", userId, isPaused);
      return true;
    } catch (error) {
      console.error("TierContext - Exception toggling user pause:", error);
      return false;
    }
  }, [userDetails]);

  /**
   * Get all user details with emails - Admin only function
   */
  const getAllUserDetails = useCallback(async (): Promise<UserDetailsWithEmail[]> => {
    if (userDetails?.tier !== "admin") {
      console.error("TierContext - Unauthorized getAllUserDetails attempt");
      return [];
    }

    try {
      // First get all user details
      const { data: userDetailsData, error: userDetailsError } = await supabase
        .from("user_details")
        .select("*")
        .order("created_at", { ascending: false });

        console.log("Length of userDetailsData", userDetailsData?.length);

      if (userDetailsError) {
        console.error("TierContext - Error fetching user details:", userDetailsError);
        return [];
      }

      // Try to get auth users to fetch emails (requires admin privileges)
      console.log("TierContext - Attempting to fetch auth users...");
      const { data: authUsersData, error: authUsersError } = await supabase.auth.admin.listUsers();

      if (authUsersError) {
        console.error("TierContext - Error fetching auth users:", authUsersError);
        console.log("TierContext - Returning user details without emails");
        // Still return user details without emails if auth query fails
        return userDetailsData || [];
      }

      console.log("TierContext - Auth users fetched:", authUsersData?.users?.length || 0, "users");

      // Combine the data
      const usersWithEmails = (userDetailsData || []).map(userDetail => ({
        ...userDetail,
        email: authUsersData.users.find(authUser => authUser.id === userDetail.user_id)?.email || "Unknown"
      }));

      console.log("TierContext - Fetched user details with emails:", usersWithEmails);
      return usersWithEmails;
    } catch (error) {
      console.error("TierContext - Exception fetching all user details:", error);
      return [];
    }
  }, [userDetails]);

  // Computed values for easy access
  const tier: UserTier = (userDetails?.tier as UserTier) || "tier1";
  const isAdmin: boolean = tier === "admin";
  const isTier2OrHigher: boolean = tier === "tier2" || tier === "admin";
  const isPaused: boolean = userDetails?.is_paused === true;

  /**
   * Merge tier program template with user-specific feature flag overrides.
   * Base features come from PROGRAM_TEMPLATES[tier], then user overrides are applied.
   * The database feature_flags column is for exceptions/overrides only - most users have NULL/empty.
   */
  const featureFlags: FeatureFlags = React.useMemo(() => {
    // Validate that the tier exists in PROGRAM_TEMPLATES
    const isProgramKey = (key: string): key is keyof typeof PROGRAM_TEMPLATES =>
      Object.hasOwn(PROGRAM_TEMPLATES, key);
    
    const baseFlags = isProgramKey(tier) ? PROGRAM_TEMPLATES[tier] : PROGRAM_TEMPLATES.tier1;
    const userOverrides = userDetails?.feature_flags || {};
    
    return { ...baseFlags, ...userOverrides };
  }, [tier, userDetails?.feature_flags]);

  /**
   * Check whether a feature is enabled for the current user.
   */
  const hasFeature = useCallback(
    (feature: FeatureKey): boolean => {
      // Step: Admin has unrestricted access across all features.
      if (isAdmin) {
        return true;
      }

      // Step: Non-admin users rely on explicit feature flag enablement.
      return featureFlags[feature] === true;
    },
    [featureFlags, isAdmin]
  );

  /**
   * Update a user's feature flags - Admin only function.
   */
  const updateFeatureFlags = useCallback(
    async (userId: string, flags: FeatureFlags): Promise<boolean> => {
      // Step: Guard against non-admin updates.
      if (userDetails?.tier !== "admin") {
        console.error("TierContext - Unauthorized feature flag update attempt");
        return false;
      }

      // Step: Persist feature flag updates in the database.
      try {
        const { error } = await supabase
          .from("user_details")
          .update({ feature_flags: flags })
          .eq("user_id", userId);

        if (error) {
          console.error("TierContext - Error updating feature flags:", error);
          return false;
        }

        console.log("TierContext - Successfully updated feature flags:", userId);
        return true;
      } catch (error) {
        console.error("TierContext - Exception updating feature flags:", error);
        return false;
      }
    },
    [userDetails]
  );

  /**
   * Apply a program template to a user - Admin only helper.
   */
  const applyProgramTemplate = useCallback(
    async (userId: string, programKey: string): Promise<boolean> => {
      // Step: Validate the provided program key.
      const isProgramKey = (key: string): key is keyof typeof PROGRAM_TEMPLATES =>
        Object.hasOwn(PROGRAM_TEMPLATES, key);

      if (!isProgramKey(programKey)) {
        console.error("TierContext - Unknown program template:", programKey);
        return false;
      }

      // Step: Apply the program template via feature flag update.
      return updateFeatureFlags(userId, PROGRAM_TEMPLATES[programKey]);
    },
    [updateFeatureFlags]
  );

  /**
   * Update membership expiration for a user - Admin only helper.
   */
  const updateMembershipExpiration = useCallback(
    async (userId: string, expiration: string | null): Promise<boolean> => {
      // Step: Guard against non-admin updates.
      if (userDetails?.tier !== "admin") {
        console.error("TierContext - Unauthorized membership expiration update attempt");
        return false;
      }

      // Step: Persist the membership expiration in the database.
      try {
        const { error } = await supabase
          .from("user_details")
          .update({ membership_expiration: expiration })
          .eq("user_id", userId);

        if (error) {
          console.error("TierContext - Error updating membership expiration:", error);
          return false;
        }

        console.log("TierContext - Successfully updated membership expiration:", userId);
        return true;
      } catch (error) {
        console.error("TierContext - Exception updating membership expiration:", error);
        return false;
      }
    },
    [userDetails]
  );

  /**
   * Update tier and feature flags in one operation - Admin only helper.
   */
  const quickSetProgram = useCallback(
    async (userId: string, programKey: string): Promise<boolean> => {
      // Step: Guard against non-admin updates.
      if (userDetails?.tier !== "admin") {
        console.error("TierContext - Unauthorized program quick set attempt");
        return false;
      }

      // Step: Validate program key before applying.
      const isProgramKey = (key: string): key is keyof typeof PROGRAM_TEMPLATES =>
        Object.hasOwn(PROGRAM_TEMPLATES, key);

      if (!isProgramKey(programKey)) {
        console.error("TierContext - Unknown program template:", programKey);
        return false;
      }

      // Step: Persist tier and feature flags together.
      try {
        const { error } = await supabase
          .from("user_details")
          .update({
            tier: programKey,
            feature_flags: PROGRAM_TEMPLATES[programKey],
          })
          .eq("user_id", userId);

        if (error) {
          console.error("TierContext - Error quick setting program:", error);
          return false;
        }

        console.log("TierContext - Successfully quick set program:", userId, programKey);
        return true;
      } catch (error) {
        console.error("TierContext - Exception quick setting program:", error);
        return false;
      }
    },
    [userDetails]
  );

  const value: TierContextProps = useMemo(
    () => ({
      loading,
      userDetails,
      tier,
      isAdmin,
      isTier2OrHigher,
      isPaused,
      featureFlags,
      hasFeature,
      updateUserTier,
      toggleUserPause,
      updateFeatureFlags,
      applyProgramTemplate,
      updateMembershipExpiration,
      quickSetProgram,
      getAllUserDetails,
    }),
    [
      loading,
      userDetails,
      tier,
      isAdmin,
      isTier2OrHigher,
      isPaused,
      featureFlags,
      hasFeature,
      updateUserTier,
      toggleUserPause,
      updateFeatureFlags,
      applyProgramTemplate,
      updateMembershipExpiration,
      quickSetProgram,
      getAllUserDetails,
    ]
  );

  return (
    <TierContext.Provider value={value}>
      {children}
    </TierContext.Provider>
  );
}

/**
 * Hook to use the TierContext
 */
export function useTierContext(): TierContextProps {
  const context = useContext(TierContext);
  if (context === undefined) {
    throw new Error("useTierContext must be used within a TierProvider");
  }
  return context;
}

/**
 * Convenience hook for checking tier access
 */
export function useTierAccess() {
  const {
    tier,
    isAdmin,
    isTier2OrHigher,
    featureFlags,
    hasFeature,
  } = useTierContext();
  
  return {
    tier,
    isAdmin,
    isTier2OrHigher,
    featureFlags,
    hasFeature,
    hasFullAnalysis: hasFeature("hasFullAnalysis"),
    hasAIAssistant: hasFeature("hasAIAssistant"),
    hasDestinyNavigatorTool: hasFeature("hasDestinyNavigatorTool"),
    hasFounderReport: hasFeature("hasFounderReport"),
    hasExperimentalCharts: hasFeature("hasExperimentalCharts"),
    hasHourAdjustment: hasFeature("hasHourAdjustment"),
    hasUserManagement: hasFeature("hasUserManagement"),
    hasNumerologyAnalytics: hasFeature("hasNumerologyAnalytics"),
    canManageUserTiers: hasFeature("canManageUserTiers"),
    canManageFeatureFlags: hasFeature("canManageFeatureFlags"),
    // Deprecated: use hasFullAnalysis instead.
    hasAnalyticsAccess: hasFeature("hasFullAnalysis"),
    // Deprecated: use hasAIAssistant instead.
    hasDestinyNavigatorAccess: hasFeature("hasAIAssistant"),
    canManageUsers: isAdmin,
  };
} 