import { auth, currentUser } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { GraduationCap, TrendingUp, Users, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();
  const supabase = await createServerSupabaseClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: courses } = await (supabase as any).from("courses").select("id, title, lessons(id)").eq("is_published", true).order("order") as { data: any[] | null };

  let completedIds: string[] = [];
  if (userId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: u } = await (supabase as any).from("users").select("id").eq("clerk_id", userId).single() as { data: { id: string } | null };
    if (u) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: prog } = await (supabase as any).from("lesson_progress").select("lesson_id").eq("user_id", u.id).eq("completed", true) as { data: { lesson_id: string }[] | null };
      completedIds = prog?.map((p) => p.lesson_id) ?? [];
    }
  }

  const { count: memberCount } = await supabase.from("users").select("*", { count: "exact", head: true });
  const totalLessons = courses?.reduce((acc, c) => acc + (c.lessons?.length ?? 0), 0) ?? 0;
  const overallProgress = totalLessons > 0 ? Math.round((completedIds.length / totalLessons) * 100) : 0;
  const activeCourses = courses?.filter((c) =>
    (c.lessons ?? []).some((l: any) => completedIds.includes(l.id)) &&
    (c.lessons ?? []).some((l: any) => !completedIds.includes(l.id))
  ).length ?? 0;

  const stats = [
    { label: "Cursos em Andamento", value: String(activeCourses), icon: BookOpen, color: "text-blue-400" },
    { label: "Progresso Geral", value: `${overallProgress}%`, icon: TrendingUp, color: "text-green-400" },
    { label: "Membros Ativos", value: String(memberCount ?? 0), icon: Users, color: "text-purple-400" },
    { label: "Aulas Concluídas", value: String(completedIds.length), icon: GraduationCap, color: "text-yellow-400" },
  ];

  const courseProgress = (courses ?? []).map((c) => {
    const ids = (c.lessons ?? []).map((l: any) => l.id);
    const done = ids.filter((id: string) => completedIds.includes(id)).length;
    return { name: c.title, progress: ids.length > 0 ? Math.round((done / ids.length) * 100) : 0, completed: done, total: ids.length };
  });

  const displayName = user?.firstName ?? "Aluno";

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Olá, <span className="text-primary">{displayName}</span>!</h1>
        <p className="text-muted-foreground mt-1">Bem-vindo de volta ao seu painel de aprendizado</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            Meu Progresso
            <Link href="/cursos" className="text-xs text-primary hover:underline font-normal">Ver todos →</Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {courseProgress.length === 0
            ? <p className="text-sm text-muted-foreground text-center py-4">Nenhum curso disponível.</p>
            : courseProgress.map((c) => (
              <div key={c.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{c.name}</span>
                  <span className="text-muted-foreground">{c.completed}/{c.total} aulas</span>
                </div>
                <Progress value={c.progress} className="h-2" />
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
