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
 * Create and export the Supabase client
 */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey); 