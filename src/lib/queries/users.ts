import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getUserByClerkId(clerkId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", clerkId)
    .single();

  if (error) return null;
  return data;
}

export async function getMembers() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
