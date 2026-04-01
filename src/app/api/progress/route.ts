import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type LessonProgressInsert = Database["public"]["Tables"]["lesson_progress"]["Insert"];

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ completedIds: [] });

  const supabase = await createServerSupabaseClient();

  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single() as { data: { id: string } | null; error: unknown };

  if (!user) return NextResponse.json({ completedIds: [] });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: progress } = await (supabase as any)
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", user.id)
    .eq("completed", true) as { data: { lesson_id: string }[] | null };

  const completedIds = progress?.map((p) => p.lesson_id) ?? [];
  return NextResponse.json({ completedIds });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { lessonId, completed } = await req.json();

  const supabase = await createServerSupabaseClient();

  // Get user's DB id
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single() as { data: { id: string } | null; error: unknown };

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const progressData: LessonProgressInsert = {
    user_id: user.id,
    lesson_id: lessonId,
    completed,
    completed_at: completed ? new Date().toISOString() : null,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("lesson_progress")
    .upsert(progressData, { onConflict: "user_id,lesson_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
