// Kommentar: Initialiserer Supabase-klienten og læser nøgler fra app.json -> expo.extra
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

const { supabaseUrl, supabaseAnonKey } = Constants.expoConfig!.extra as {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
