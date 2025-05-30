import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "../utils/supabaseClient";
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

  useEffect(() => {
    const fetchProfileWithoutUser = async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", "2fdd8c60-fdb0-4ba8-a6e4-327a28179498")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching profiles:", error);
        return;
      }


      setProfiles((prev) => {
        if (isEqual(prev, profiles)) {
          return prev;
        }

        return profiles!;
      });
    };

    const fetchProfiles = async () => {
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

      setProfiles((prev) => {
        if (isEqual(prev, profiles)) {
          return prev;
        }

        return profiles!;
      });
    };

    if (user) {
      fetchProfiles();
    } else {
      fetchProfileWithoutUser();
    }

    const handleChanges = (payload: any) => {
      if (payload.eventType === "INSERT") {
        // Check if the profile is for the current user
        if (payload.new.user_id === user?.id) {
          setProfiles((prev) => [...prev, payload.new]);
        }
      } else if (payload.eventType === "UPDATE") {
        const updatedProfiles = profiles.map((profile) =>
          profile.id === payload.new.id ? payload.new : profile
        );

        setProfiles((prev) => {
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

    const subscription = supabase
      .channel("profiles")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        (payload) => {
          handleChanges(payload);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addProfile = useCallback(async (profile: ProfileInsert) => {
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
      console.error("Error adding contact:", error);
      return null;
    }

    // We add to the array of Profiles
    setProfiles((prev) => [...prev, data?.[0]]);
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
      console.log("Setting current profile by ID:", profileId, profile);
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
    [profiles, currentProfile, addProfile, updateProfile, deleteProfile]
  );

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
}
// Add the whyDidYouRender property after defining the component
(ProfileProvider as any).whyDidYouRender = true; // Add this line
export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }

  return context;
}
