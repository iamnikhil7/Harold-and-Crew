import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Check if Supabase is configured (not using placeholder) */
export function isSupabaseConfigured(): boolean {
  return supabaseUrl !== "https://placeholder.supabase.co" && supabaseAnonKey !== "placeholder";
}
