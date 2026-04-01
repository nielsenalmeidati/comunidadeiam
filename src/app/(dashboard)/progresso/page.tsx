import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CheckCircle2, Circle, BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

export default async function ProgressoPage() {
  const { userId } = await auth();
  const supabase = await createServerSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: courses } = await (supabase as any).from("courses").select("*, lessons(id, title, order)").eq("is_published", true).order("order");

  let completedIds: string[] = [];
  if (userId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: user } = await (supabase as any).from("users").select("id").eq("clerk_id", userId).single();
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: prog } = await (supabase as any).from("lesson_progress").select("lesson_id").eq("user_id", (user as any).id).eq("completed", true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      completedIds = (prog as any[])?.map((p: any) => p.lesson_id) ?? [];
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const courseStats = ((courses ?? []) as any[]).map((c: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lessons = [...(c.lessons ?? [])].sort((a: any, b: any) => a.order - b.order);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const done = lessons.filter((l: any) => completedIds.includes(l.id)).length;
    const progress = lessons.length > 0 ? Math.round((done / lessons.length) * 100) : 0;
    return { ...c, lessons, done, progress };
  });

  const totalLessons = courseStats.reduce((a, c) => a + c.lessons.length, 0);
  const totalDone = completedIds.length;
  const overall = totalLessons > 0 ? Math.round((totalDone / totalLessons) * 100) : 0;

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Meu Progresso</h1>
        <p className="text-muted-foreground">Acompanhe sua evolução em todos os cursos</p>
      </div>
      <div className="bg-card border border-primary/30 rounded-xl p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-semibold">Progresso Geral</p>
            <p className="text-sm text-muted-foreground">{totalDone} de {totalLessons} aulas concluídas</p>
          </div>
          <span className="text-3xl font-bold text-primary">{overall}%</span>
        </div>
        <Progress value={overall} className="h-3" />
      </div>
      <div className="space-y-6">
        {courseStats.map((c) => (
          <div key={c.id} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <h2 className="font-semibold">{c.title}</h2>
              </div>
              <span className="text-sm font-medium text-primary">{c.progress}%</span>
            </div>
            <Progress value={c.progress} className="h-2 mb-4" />
            <div className="space-y-1">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {c.lessons.map((l: any, i: number) => {
                const done = completedIds.includes(l.id);
                return (
                  <Link key={l.id} href={`/cursos/${c.slug}/aula/${l.id}`}>
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-secondary/50 transition-colors">
                      {done ? <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" /> : <Circle className="w-4 h-4 text-muted-foreground shrink-0" />}
                      <span className={`text-xs ${done ? "text-muted-foreground line-through" : "text-foreground"}`}>{i + 1}. {l.title}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
