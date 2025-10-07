// This file will contain your Supabase database types
// Generate them by running: npx supabase gen types typescript --project-id your-project-ref > src/types/database.types.ts

// For now, this is a placeholder. After setting up your Supabase tables, you can generate types:
// 1. Install Supabase CLI: npm install -g supabase
// 2. Login: npx supabase login
// 3. Generate types: npx supabase gen types typescript --project-id your-project-ref > src/types/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Your tables will appear here after generation
      [key: string]: {
        Row: Record<string, unknown>
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
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
  }
}

