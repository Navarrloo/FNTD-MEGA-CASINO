import { createClient } from '@supabase/supabase-js'
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
// ⚠️ IMPORTANT: PLEASE REPLACE THE PLACEHOLDER VALUES BELOW! ⚠️
// You can find your Supabase URL and Anon Key in your Supabase project settings
// under the "API" section. Without replacing these, the app will not connect
// to your database.
// -----------------------------------------------------------------------------
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';
// -----------------------------------------------------------------------------


export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)