import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getChannels() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("channels")
    .select("*")
    .order("created_at");

  if (error) throw error;
  return data;
}

export async function getPostsByChannel(channelId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      author:users(id, name, avatar_url, plan)
    `)
    .eq("channel_id", channelId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw error;
  return data;
}

export async function createPost(channelId: string, authorId: string, content: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerSupabaseClient()) as any;
  const { data, error } = await supabase
    .from("posts")
    .insert({ channel_id: channelId, author_id: authorId, content })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function toggleLike(postId: string, userId: string, liked: boolean) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerSupabaseClient()) as any;
  if (liked) {
    const { error } = await supabase
      .from("post_likes")
      .insert({ post_id: postId, user_id: userId });
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("post_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId);
    if (error) throw error;
  }
}
