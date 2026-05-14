export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          avatar: string | null;
          bio: string | null;
          location: string | null;
          interests: string[];
          followers_count: number;
          following_count: number;
          total_projects: number;
          total_entries: number;
          social_links: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["users"]["Row"], "created_at" | "updated_at" | "followers_count" | "following_count" | "total_projects" | "total_entries"> & {
          followers_count?: number;
          following_count?: number;
          total_projects?: number;
          total_entries?: number;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          slug: string;
          tagline: string;
          description: string | null;
          categories: string[];
          cover_image: string | null;
          start_date: string;
          status: string;
          visibility: string;
          entry_count: number;
          follower_count: number;
          total_reactions: number;
          streak_count: number;
          linked_urls: Json;
          health_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["projects"]["Row"], "created_at" | "updated_at" | "entry_count" | "follower_count" | "total_reactions" | "streak_count" | "health_score"> & {
          entry_count?: number;
          follower_count?: number;
          total_reactions?: number;
          streak_count?: number;
          health_score?: number;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };
      entries: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          title: string | null;
          body: string;
          date: string;
          is_milestone: boolean;
          mood_tag: string | null;
          media_urls: string[];
          reactions: Json;
          comment_count: number;
          view_count: number;
          hashtags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["entries"]["Row"], "created_at" | "updated_at" | "comment_count" | "view_count"> & {
          comment_count?: number;
          view_count?: number;
        };
        Update: Partial<Database["public"]["Tables"]["entries"]["Insert"]>;
      };
      user_follows: {
        Row: {
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["user_follows"]["Row"], "created_at">;
        Update: never;
      };
      project_follows: {
        Row: {
          user_id: string;
          project_id: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["project_follows"]["Row"], "created_at">;
        Update: never;
      };
      reactions: {
        Row: {
          id: string;
          entry_id: string;
          user_id: string;
          type: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reactions"]["Row"], "id" | "created_at">;
        Update: never;
      };
    };
  };
};
