import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Unit } from '../types';

// Define a type for your database schema if you have one
// For now, we define a profile type
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: number
          username: string | null
          first_name: string | null
          balance: number
          inventory: Unit[] | null
        }
        Insert: {
          id: number
          username?: string | null
          first_name?: string | null
          balance?: number
          inventory?: Unit[] | null
        }
        Update: {
          id?: number
          username?: string | null
          first_name?: string | null
          balance?: number
          inventory?: Unit[] | null
        }
        // FIX: Add Relationships property, which is required for Supabase's type inference to work correctly.
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// -----------------------------------------------------------------------------
// ⚠️ IMPORTANT: CONNECTION DETAILS ARE SET VIA ENVIRONMENT VARIABLES! ⚠️
// For deployment (e.g., on Vercel), you MUST set the following
// Environment Variables in your project settings:
// 1. SUPABASE_URL: Your Supabase project URL.
// 2. SUPABASE_ANON_KEY: Your Supabase project's anon (public) key.
//
// These variables must be exposed to the client-side for the app to work.
//
// Find these in your Supabase project's "API" settings.
// -----------------------------------------------------------------------------

// The build system (e.g., Vercel) is expected to replace these `process.env`
// variables with the actual string values during the build process.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;


// The App.tsx component will handle connection errors gracefully
// if these variables are not set correctly in the deployment environment.
let supabase: SupabaseClient<Database> | null = null;

if (supabaseUrl && supabaseAnonKey) {
    try {
        supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
    } catch (error) {
        console.error("Error creating Supabase client:", error);
    }
} else {
    console.error("Supabase URL or Anon Key is missing. Check your Environment Variables (SUPABASE_URL, SUPABASE_ANON_KEY).");
}

export { supabase };
