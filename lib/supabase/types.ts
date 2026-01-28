// Supabase database types
// These will be populated when you run `supabase gen types typescript --local`
// For now, we define minimal types for our progress tracking

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_progress: {
        Row: {
          user_id: string;
          completed_challenges: string[];
          current_challenge: string;
          started_at: string;
          last_activity: string;
        };
        Insert: {
          user_id: string;
          completed_challenges?: string[];
          current_challenge?: string;
          started_at?: string;
          last_activity?: string;
        };
        Update: {
          user_id?: string;
          completed_challenges?: string[];
          current_challenge?: string;
          started_at?: string;
          last_activity?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
