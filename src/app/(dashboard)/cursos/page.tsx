import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CourseCard } from "@/components/course-card";
import { BookOpen, TrendingUp } from "lucide-react";

async function getCoursesWithProgress(clerkUserId: string | null) {
  const supabase = await createServerSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: courses } = await (supabase as any)
    .from("courses")
    .select("*, lessons(id)")
    .eq("is_published", true)
    .order("order") as { data: any[] | null };
  if (!courses) return [];
  let completedLessonIds: string[] = [];
  if (clerkUserId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: user } = await (supabase as any).from("users").select("id").eq("clerk_id", clerkUserId).single() as { data: { id: string } | null };
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: progress } = await (supabase as any)
        .from("lesson_progress").select("lesson_id").eq("user_id", user.id).eq("completed", true) as { data: { lesson_id: string }[] | null };
      completedLessonIds = progress?.map((p) => p.lesson_id) ?? [];
    }
  }
  return courses.map((c) => {
    const lessonIds = (c.lessons ?? []).map((l: { id: string }) => l.id);
    const completed = lessonIds.filter((id: string) => completedLessonIds.includes(id)).length;
    return { ...c, totalLessons: lessonIds.length, completedLessons: completed, thumbnail: c.thumbnail_url ?? "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80" };
  });
}

export default async function CursosPage() {
  const { userId } = await auth();
  const courses = await getCoursesWithProgress(userId);
  const totalCompleted = courses.reduce((acc, c) => acc + c.completedLessons, 0);
  const totalLessons = courses.reduce((acc, c) => acc + c.totalLessons, 0);
  const overallProgress = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Meus Cursos</h1>
        <p className="text-muted-foreground">Acompanhe seu progresso em todos os cursos</p>
      </div>
      <div className="flex items-center gap-6 p-4 bg-card border border-border rounded-xl mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xl font-bold">{courses.length}</p>
            <p className="text-xs text-muted-foreground">Cursos disponíveis</p>
          </div>
        </div>
        <div className="w-px h-10 bg-border" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-xl font-bold">{overallProgress}%</p>
            <p className="text-xs text-muted-foreground">Progresso geral</p>
          </div>
        </div>
        <div className="w-px h-10 bg-border" />
        <div>
          <p className="text-xl font-bold">{totalCompleted}</p>
          <p className="text-xs text-muted-foreground">Aulas concluídas</p>
        </div>
      </div>
      {courses.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Nenhum curso disponível no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course as any} />
          ))}
        </div>
      )}
    </div>
  );
}
