import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { supabase } from "../utils/supabase-client";
import { Database } from "../../database.types";
import { useAuthContext } from "./AuthContext";
import isEqual from "lodash.isequal";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Profiles = { profiles: Profile[] };
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];

interface ProfileContextProps {
  loading: boolean;
  profiles: Profile[];
  addProfile: (profile: ProfileInsert) => Promise<Profile | null>;
  updateProfile: (profile: Profile) => void;
  deleteProfile: (profileId: string) => void;
  currentProfile: Profile | null;
  setCurrentProfile: (profile: Profile) => void;
  setCurrentProfileById: (profileId: string) => void;
}

const ProfileContext = createContext<ProfileContextProps>(undefined!);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const { user } = useAuthContext();
  
  // Use ref to avoid closure issues in real-time handlers
  const profilesRef = useRef<Profile[]>([]);
  const userRef = useRef(user);
  
  // Update refs when state changes
  useEffect(() => {
    profilesRef.current = profiles;
  }, [profiles]);
  
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    const fetchProfileWithoutUser = async () => {
      try {
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", "2fdd8c60-fdb0-4ba8-a6e4-327a28179498")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching profiles:", error);
          return;
        }

        // console.log("ProfileContext - Fetched free test profiles:", profiles?.length);

        setProfiles((prev) => {
          if (isEqual(prev, profiles)) {
            return prev;
          }

          return profiles!;
        });
      } catch (error) {
        console.error("ProfileContext - Exception fetching free test profiles:", error);
      }
    };

    const fetchProfiles = async () => {
      try {
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user?.id);

        if (error) {
          console.error("Error fetching profiles:", error);
          return;
        }

        // If profile length is more than 4k, console log out a warning message with the length and the user id
        if (profiles?.length > 4000) {
          console.warn("Warning: Profile length is more than 4k, user id:", user?.id, "Profile length:", profiles?.length);
        }

        // Fetched authenticated user profiles

        setProfiles((prev) => {
          if (isEqual(prev, profiles)) {
            return prev;
          }

          return profiles!;
        });
      } catch (error) {
        console.error("ProfileContext - Exception fetching user profiles:", error);
      }
    };

    // Fetch profiles regardless of auth state to support free test
    if (user) {
      // console.log("ProfileContext - Fetching profiles for authenticated user:", user.id);
      fetchProfiles();
    } else {
      // console.log("ProfileContext - Fetching free test profiles (no auth required)");
      fetchProfileWithoutUser();
    }

    // Use refs to avoid closure issues
    const handleChanges = (payload: any) => {
      if (payload.eventType === "INSERT") {
        // Check if the profile is for the current user OR for free test users
        const isForCurrentUser = payload.new.user_id === userRef.current?.id;
        const isForFreeTestUser = !userRef.current && payload.new.user_id === "2fdd8c60-fdb0-4ba8-a6e4-327a28179498";
        
        if (isForCurrentUser || isForFreeTestUser) {
          setProfiles((prev) => [...prev, payload.new]);
        }
      } else if (payload.eventType === "UPDATE") {
        setProfiles((prev) => {
          const updatedProfiles = prev.map((profile) =>
            profile.id === payload.new.id ? payload.new : profile
          );

          if (!isEqual(prev, updatedProfiles)) {
            return updatedProfiles;
          }

          return prev;
        });
      } else if (payload.eventType === "DELETE") {
        setProfiles((prev) =>
          prev.filter((profile) => profile.id !== payload.old.id)
        );
      }
    };

    // Create unique channel names to prevent cross-user interference
    // For free test users, skip real-time subscriptions entirely
    let subscription: any = null;
    
    if (user) {
      const channelName = `profiles-user-${user.id}`;
      // Subscribing to real-time channel for user profiles

      subscription = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "profiles" },
          handleChanges
        )
        .subscribe();
    }

    // Improved cleanup
    return () => {
      if (subscription) {
        subscription.unsubscribe().catch((error: any) => {
          console.error("ProfileContext - Error unsubscribing:", error);
        });
      }
    };
  }, [user]); // Only depend on user, not profiles

  const addProfile = useCallback(async (profile: ProfileInsert) => {
    // console.log("ProfileContext - addProfile called with:", profile);
    setLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .insert([
        {
          ...profile,
        },
      ])
      .select();
    if (error) {
      console.error("ProfileContext - Error adding contact:", error);
      setLoading(false);
      return null;
    }

    // console.log("ProfileContext - Profile created successfully:", data?.[0]);
    
    // We add to the array of Profiles
    setProfiles((prev) => {
      const newProfiles = [...prev, data?.[0]];
      // console.log("ProfileContext - Updated profiles in context:", newProfiles.map(p => ({ id: p.id, name: p.name })));
      return newProfiles;
    });
    setLoading(false);
    return data?.[0] || null;
  }, []);

  const updateProfile = useCallback(async (profile: Profile) => {
    const { error } = await supabase
      .from("profiles")
      .update(profile)
      .match({ id: profile.id })
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      return;
    }
  }, []);

  const deleteProfile = useCallback(async (profileId: string) => {
    const { error } = await supabase
      .from("profiles")
      .delete()
      .match({ id: profileId });

    if (error) {
      console.error("Error deleting profile:", error);
      return;
    }
  }, []);

  const setCurrentProfileById = useCallback(
    (profileId: string) => {
      const profile = profiles.find((profile) => profile.id === profileId);
      // console.log("Setting current profile by ID:", profileId, profile);
      if (profile) {
        setCurrentProfile(profile);
      }
    },
    [profiles]
  );

  const contextValue = useMemo(
    () => ({
      loading,
      profiles,
      addProfile,
      updateProfile,
      deleteProfile,
      currentProfile,
      setCurrentProfile,
      setCurrentProfileById,
    }),
    [loading, profiles, currentProfile, addProfile, updateProfile, deleteProfile, setCurrentProfileById]
  );

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
}

// Removed whyDidYouRender to reduce debugging overhead
export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }

  return context;
}
