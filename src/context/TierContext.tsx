import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "../utils/supabase-client";
import { Database } from "../../database.types";
import { useAuthContext } from "./AuthContext";

export type UserDetails = Database["public"]["Tables"]["user_details"]["Row"];
export type UserDetailsInsert = Database["public"]["Tables"]["user_details"]["Insert"];
export type UserDetailsUpdate = Database["public"]["Tables"]["user_details"]["Update"];

// Extended type for admin functions that includes email
export type UserDetailsWithEmail = UserDetails & {
  email?: string;
};
export type UserTier = string;

interface TierContextProps {
  loading: boolean;
  userDetails: UserDetails | null;
  tier: UserTier;
  isAdmin: boolean;
  isTier2OrHigher: boolean;
  updateUserTier: (userId: string, newTier: UserTier) => Promise<boolean>;
  getAllUserDetails: () => Promise<UserDetailsWithEmail[]>;
}

const TierContext = createContext<TierContextProps>(undefined!);

/**
 * TierProvider component that manages user tier information
 * Follows the same architecture as ProfileContext
 */
export function TierProvider({ children }: { children: React.ReactNode }) {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuthContext();

  /**
   * Fetch user tier information when user changes
   */
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
          console.log("TierContext - Fetched user_details:", data);
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
      console.log("TierContext - Subscribing to channel:", channelName);

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
          (payload) => {
            console.log("TierContext - Real-time event:", payload.eventType, payload.new || payload.old);
            
            if (payload.eventType === "UPDATE" && payload.new) {
              setUserDetails(payload.new as UserDetails);
            } else if (payload.eventType === "INSERT" && payload.new) {
              setUserDetails(payload.new as UserDetails);
            }
          }
        )
        .subscribe();
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [user]);

  /**
   * Update a user's tier - Admin only function
   */
  const updateUserTier = useCallback(async (userId: string, newTier: UserTier): Promise<boolean> => {
    if (!userDetails || userDetails.tier !== "admin") {
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
   * Get all user details with emails - Admin only function
   */
  const getAllUserDetails = useCallback(async (): Promise<UserDetailsWithEmail[]> => {
    if (!userDetails || userDetails.tier !== "admin") {
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
  const tier: UserTier = userDetails?.tier || "tier1";
  const isAdmin: boolean = tier === "admin";
  const isTier2OrHigher: boolean = tier === "tier2" || tier === "admin";

  const value: TierContextProps = {
    loading,
    userDetails,
    tier,
    isAdmin,
    isTier2OrHigher,
    updateUserTier,
    getAllUserDetails,
  };

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
  const { tier, isAdmin, isTier2OrHigher } = useTierContext();
  
  return {
    tier,
    isAdmin,
    isTier2OrHigher,
    hasDestinyNavigatorAccess: isTier2OrHigher,
    hasAnalyticsAccess: isTier2OrHigher,
    canManageUsers: isAdmin,
  };
} 