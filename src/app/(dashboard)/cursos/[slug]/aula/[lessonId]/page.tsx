"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, CheckCircle2, Circle, ChevronLeft, ChevronRight as Next, ListVideo, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type Lesson = { id: string; title: string; video_url: string | null; duration_seconds: number; order: number };
type CourseData = { id: string; slug: string; title: string; lessons: Lesson[] };

export default function AulaPage() {
  const params = useParams<{ slug: string; lessonId: string }>();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: courseData } = await (supabase as any)
        .from("courses").select("id, slug, title, lessons(id, title, video_url, duration_seconds, order)")
        .eq("slug", params.slug).single() as { data: any };
      if (!courseData) return;
      const sorted = [...(courseData.lessons ?? [])].sort((a: any, b: any) => a.order - b.order);
      setCourse({ ...courseData, lessons: sorted });
      setLesson(sorted.find((l: any) => l.id === params.lessonId) ?? null);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: dbUser } = await (supabase as any).from("users").select("id").eq("clerk_id", user.id).single() as { data: { id: string } | null };
        if (dbUser) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: prog } = await (supabase as any).from("lesson_progress").select("lesson_id").eq("user_id", dbUser.id).eq("completed", true) as { data: { lesson_id: string }[] | null };
          setCompletedIds(new Set(prog?.map((p) => p.lesson_id) ?? []));
        }
      }
      setLoading(false);
    }
    load();
  }, [params.slug, params.lessonId]);

  const handleToggleComplete = async () => {
    if (!lesson) return;
    const nowCompleted = !completedIds.has(lesson.id);
    setCompletedIds((prev) => { const next = new Set(prev); nowCompleted ? next.add(lesson.id) : next.delete(lesson.id); return next; });
    await fetch("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lessonId: lesson.id, completed: nowCompleted }) });
  };

  if (loading || !course || !lesson) {
    return <div className="flex items-center justify-center h-screen"><div className="text-muted-foreground text-sm">Carregando aula...</div></div>;
  }

  const lessonIndex = course.lessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = course.lessons[lessonIndex - 1];
  const nextLesson = course.lessons[lessonIndex + 1];
  const isCompleted = completedIds.has(lesson.id);
  const completedCount = course.lessons.filter((l) => completedIds.has(l.id)).length;
  const progress = Math.round((completedCount / course.lessons.length) * 100);
  function fmt(s: number) { const m = Math.floor(s / 60); return `${m}:${String(s % 60).padStart(2, "0")}`; }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 text-xs text-muted-foreground px-6 py-3 border-b border-border bg-card shrink-0">
          <Link href="/cursos" className="hover:text-foreground">Meus Cursos</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/cursos/${course.slug}`} className="hover:text-foreground">{course.title}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground truncate">{lesson.title}</span>
          <div className="ml-auto">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="gap-2 text-xs">
              <ListVideo className="w-4 h-4" />{sidebarOpen ? "Ocultar aulas" : "Ver aulas"}
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="bg-black">
            <div className="max-w-5xl mx-auto aspect-video">
              {lesson.video_url
                ? <iframe src={lesson.video_url} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                : <div className="w-full h-full flex items-center justify-center text-muted-foreground">Vídeo não disponível</div>}
            </div>
          </div>
          <div className="max-w-5xl mx-auto px-6 py-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-xl font-bold mb-1">{lesson.title}</h1>
                <p className="text-sm text-muted-foreground">{course.title} · Aula {lessonIndex + 1} de {course.lessons.length}</p>
              </div>
              <Button onClick={handleToggleComplete} variant={isCompleted ? "outline" : "default"}
                className={cn("gap-2 shrink-0", isCompleted && "border-green-500 text-green-400 hover:bg-green-500/10")}>
                {isCompleted ? <><CheckCircle2 className="w-4 h-4" /> Concluída</> : <><Check className="w-4 h-4" /> Marcar como concluída</>}
              </Button>
            </div>
            <div className="flex justify-between">
              {prevLesson ? <Link href={`/cursos/${course.slug}/aula/${prevLesson.id}`}><Button variant="outline" className="gap-2"><ChevronLeft className="w-4 h-4" /> Aula anterior</Button></Link> : <div />}
              {nextLesson ? <Link href={`/cursos/${course.slug}/aula/${nextLesson.id}`}><Button className="gap-2 bg-primary hover:bg-primary/90">Próxima aula <Next className="w-4 h-4" /></Button></Link> : <div />}
            </div>
          </div>
        </div>
      </div>
      {sidebarOpen && (
        <div className="w-80 border-l border-border bg-card flex flex-col shrink-0">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-sm mb-2">{course.title}</h3>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>{completedCount}/{course.lessons.length} aulas</span><span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {course.lessons.map((l, i) => {
              const isActive = l.id === lesson.id;
              const isDone = completedIds.has(l.id);
              return (
                <Link key={l.id} href={`/cursos/${course.slug}/aula/${l.id}`}>
                  <div className={cn("flex items-center gap-3 px-4 py-3 border-b border-border/50 hover:bg-secondary/50 transition-colors", isActive && "bg-primary/10 border-l-2 border-l-primary")}>
                    <div className="shrink-0">{isDone ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Circle className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />}</div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-xs font-medium truncate", isActive ? "text-primary" : isDone ? "text-muted-foreground" : "text-foreground")}>{i + 1}. {l.title}</p>
                      <p className="text-xs text-muted-foreground">{fmt(l.duration_seconds)}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
