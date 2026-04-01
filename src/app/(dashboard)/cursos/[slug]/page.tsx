import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Clock, BookOpen, CheckCircle2, Circle, ChevronRight, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { userId } = await auth();
  const supabase = await createServerSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: course } = await (supabase as any)
    .from("courses").select("*, lessons(*)").eq("slug", slug).eq("is_published", true).single() as { data: any };
  if (!course) notFound();
  const lessons = [...(course.lessons ?? [])].sort((a: any, b: any) => a.order - b.order);
  let completedIds: string[] = [];
  if (userId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: user } = await (supabase as any).from("users").select("id").eq("clerk_id", userId).single() as { data: { id: string } | null };
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: progress } = await (supabase as any)
        .from("lesson_progress").select("lesson_id").eq("user_id", user.id).eq("completed", true) as { data: { lesson_id: string }[] | null };
      completedIds = progress?.map((p) => p.lesson_id) ?? [];
    }
  }
  const completedCount = lessons.filter((l: any) => completedIds.includes(l.id)).length;
  const progress = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;
  const nextLesson = lessons.find((l: any) => !completedIds.includes(l.id));
  function fmt(s: number) { const m = Math.floor(s / 60); return `${m}:${String(s % 60).padStart(2, "0")}`; }
  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/cursos" className="hover:text-foreground transition-colors">Meus Cursos</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">{course.title}</span>
      </div>
      <div className="flex items-start gap-6 mb-8">
        <div className="flex-1">
          <Badge className="mb-3 bg-primary/20 text-primary border-0">{course.category}</Badge>
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-muted-foreground mb-4">{course.description}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" />{lessons.length} aulas</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{course.duration}</span>
          </div>
        </div>
      </div>
      <div className="bg-card border border-border rounded-xl p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-semibold">Seu progresso</p>
            <p className="text-sm text-muted-foreground">{completedCount} de {lessons.length} aulas concluídas</p>
          </div>
          <span className="text-2xl font-bold text-primary">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2 mb-4" />
        {nextLesson && (
          <Link href={`/cursos/${course.slug}/aula/${nextLesson.id}`}>
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Play className="w-4 h-4" />
              {completedCount === 0 ? "Começar curso" : "Continuar de onde parei"}
            </Button>
          </Link>
        )}
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4">Aulas do curso</h2>
        <div className="space-y-2">
          {lessons.map((lesson: any, index: number) => {
            const isDone = completedIds.includes(lesson.id);
            return (
              <Link key={lesson.id} href={`/cursos/${course.slug}/aula/${lesson.id}`}>
                <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors group">
                  <div className="shrink-0">
                    {isDone ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Circle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isDone ? "text-muted-foreground line-through" : ""}`}>
                      {index + 1}. {lesson.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-muted-foreground">{fmt(lesson.duration_seconds)}</span>
                    <Play className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
