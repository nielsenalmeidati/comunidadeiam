import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { channelId, content } = await req.json();
  if (!channelId || !content?.trim()) {
    return NextResponse.json({ error: "Missing channelId or content" }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();

  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single() as { data: { id: string } | null; error: unknown };

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("posts")
    .insert({ channel_id: channelId, author_id: user.id, content: content.trim() })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ post: data });
}
