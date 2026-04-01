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
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url: string | null;
          plan: "free" | "pro";
          clerk_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          avatar_url?: string | null;
          plan?: "free" | "pro";
          clerk_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar_url?: string | null;
          plan?: "free" | "pro";
          clerk_id?: string;
          created_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          thumbnail_url: string | null;
          category: string;
          duration: string;
          is_published: boolean;
          order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description: string;
          thumbnail_url?: string | null;
          category?: string;
          duration?: string;
          is_published?: boolean;
          order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string;
          thumbnail_url?: string | null;
          category?: string;
          duration?: string;
          is_published?: boolean;
          order?: number;
          created_at?: string;
        };
      };
      lessons: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          description: string | null;
          video_url: string | null;
          duration_seconds: number;
          order: number;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          description?: string | null;
          video_url?: string | null;
          duration_seconds?: number;
          order?: number;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          title?: string;
          description?: string | null;
          video_url?: string | null;
          duration_seconds?: number;
          order?: number;
          is_published?: boolean;
          created_at?: string;
        };
      };
      lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          completed: boolean;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          completed?: boolean;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          lesson_id?: string;
          completed?: boolean;
          completed_at?: string | null;
        };
      };
      channels: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          type: "public" | "private";
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          type?: "public" | "private";
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          type?: "public" | "private";
          created_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          channel_id: string;
          author_id: string;
          content: string;
          media_urls: string[] | null;
          likes_count: number;
          comments_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          channel_id: string;
          author_id: string;
          content: string;
          media_urls?: string[] | null;
          likes_count?: number;
          comments_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          channel_id?: string;
          author_id?: string;
          content?: string;
          media_urls?: string[] | null;
          likes_count?: number;
          comments_count?: number;
          created_at?: string;
        };
      };
      post_likes: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: never;
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          author_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          author_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          author_id?: string;
          content?: string;
          created_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_subscription_id: string;
          plan: string;
          status: "active" | "canceled" | "past_due" | "trialing";
          current_period_end: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_subscription_id: string;
          plan: string;
          status?: "active" | "canceled" | "past_due" | "trialing";
          current_period_end: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_subscription_id?: string;
          plan?: string;
          status?: "active" | "canceled" | "past_due" | "trialing";
          current_period_end?: string;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
