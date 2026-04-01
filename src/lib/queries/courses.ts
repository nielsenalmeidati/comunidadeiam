import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getCourses() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("is_published", true)
    .order("order");

  if (error) throw error;
  return data;
}

export async function getCourseBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("courses")
    .select(`
      *,
      lessons(*)
    `)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) throw error;
  return data;
}

export async function getLessonById(lessonId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("lessons")
    .select(`*, courses(slug, title)`)
    .eq("id", lessonId)
    .single();

  if (error) throw error;
  return data;
}

export async function getUserProgress(userId: string, courseId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("lesson_progress")
    .select("lesson_id, completed")
    .eq("user_id", userId);

  if (error) throw error;
  return data ?? [];
}

export async function markLessonComplete(userId: string, lessonId: string, completed: boolean) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerSupabaseClient()) as any;
  const { error } = await supabase
    .from("lesson_progress")
    .upsert({ user_id: userId, lesson_id: lessonId, completed, completed_at: completed ? new Date().toISOString() : null },
      { onConflict: "user_id,lesson_id" });

  if (error) throw error;
}
