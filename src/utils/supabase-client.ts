import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Environment variables for Supabase configuration
 */
const supabaseUrl: string = process.env.REACT_APP_SUPABASE_URL || "";
const supabaseAnonKey: string = process.env.REACT_APP_SUPABASE_ANON_KEY || "";

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing environment variables: REACT_APP_SUPABASE_URL or REACT_APP_SUPABASE_ANON_KEY is not defined"
  );
}

/**
 * Create and export the Supabase client with explicit session persistence
 */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Ensure session persistence
    persistSession: true,
    // Set session storage to localStorage (default, but explicit)
    storage: window.localStorage,
    // Auto refresh tokens before they expire
    autoRefreshToken: true,
    // Detect session in URL (for email confirmations, password resets)
    detectSessionInUrl: false, // Disable for free test to prevent conflicts
    // Use a longer storage key to avoid conflicts
    storageKey: "zwds-supabase-auth-token"
  }
}); 