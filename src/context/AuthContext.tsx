import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from "react";
import { supabase } from "../utils/supabase-client";
import { Session, User, AuthError } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

/**
 * AuthResponse type for standardizing auth function responses
 */
interface AuthResponse {
  data: {
    user?: User | null;
    session?: Session | null;
  };
  error: AuthError | null;
}

/**
 * Auth context type definition
 */
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (
    email: string,
    password: string,
    referralCode: string
  ) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  completePasswordReset: (
    token: string,
    newPassword: string
  ) => Promise<{ error: AuthError | null }>;
}

/**
 * Create the Authentication Context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider component that wraps the app and makes auth object available
 * to any child component that calls useAuth().
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const initializedRef = useRef<boolean>(false);
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // TEMP CONSOLE LOG OUT USER ID
  useEffect(() => {
    const getUserId = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      // console.log("AuthContext - Initial session user ID:", session?.user.id);
    };
    getUserId();
  }, []);

  useEffect(() => {
    // Only initialize if not already initialized
    if (initializedRef.current) {
      return;
    }

    // Get session from local storage and set states
    const initializeAuth = async () => {
      setLoading(true);

      try {
        // Get current session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("AuthContext - Error getting session:", error);
        }

        // console.log("AuthContext - Initialize auth with session:", !!session);
        
        if (session) {
          setSession(session);
          setUser(session.user);
        }
        
        initializedRef.current = true;
      } catch (error) {
        console.error("Error loading auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // console.log("Auth state change:", event, "Session exists:", !!session, "User ID:", session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);

        // Don't redirect during initial load
        if (!initializedRef.current) {
          // console.log("AuthContext - Skipping redirect during initialization");
          return;
        }

        // console.log("Auth state change:", event, "Session exists:", !!session, "User ID:", session?.user?.id);
      }
    );

    // Clean up subscription
    return () => {
      authListener.subscription.unsubscribe();
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, [navigate]);

  /**
   * Sign in with email and password
   */
  const signIn = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return {
        data: {
          user: data.user,
          session: data.session,
        },
        error,
      };
    } catch (error) {
      console.error("Error signing in:", error);
      return {
        data: { user: null, session: null },
        error: error as AuthError,
      };
    }
  };

  /**
   * Sign up with email, password and referral code
   */
  const signUp = async (
    email: string,
    password: string,
    referralCode: string
  ): Promise<AuthResponse> => {
    try {
      // Check referral code
      if (referralCode !== "DYD2025") {
        return {
          data: { user: null, session: null },
          error: { message: "Invalid referral code", status: 400 } as AuthError,
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      return {
        data: {
          user: data.user,
          session: data.session,
        },
        error,
      };
    } catch (error) {
      console.error("Error signing up:", error);
      return {
        data: { user: null, session: null },
        error: error as AuthError,
      };
    }
  };

  /**
   * Sign out the current user
   */
  const signOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  /**
   * Reset password (send reset email)
   */
  const resetPassword = async (
    email: string
  ): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/authentication/reset-password",
      });
      return { error };
    } catch (error) {
      console.error("Error resetting password:", error);
      return { error: error as AuthError };
    }
  };

  /**
   * Complete password reset (set new password with token)
   */
  const completePasswordReset = async (
    token: string,
    newPassword: string
  ): Promise<{ error: AuthError | null }> => {
    try {
      // For Supabase password reset, we just update the password
      // The session should already be established by the auth state change
      // when the user lands on the page with the token
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      return { error };
    } catch (error) {
      console.error("Error completing password reset:", error);
      return { error: error as AuthError };
    }
  };

  // Create the value object that will be provided by the context
  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    completePasswordReset,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook for easy access to the auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

/**
 * Alias for useAuth() to maintain compatibility with existing code
 */
export const useAuthContext = useAuth;
