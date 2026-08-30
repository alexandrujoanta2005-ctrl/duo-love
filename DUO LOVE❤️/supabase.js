const SUPABASE_URL =
  "https://vrcwpodmvdamkgveuedz.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_IeQ2x8ksLJF6_r3VIqUCrA_7ehSop7x";


const supabaseClient =
  supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
        storage: window.localStorage
      }
    }
  );