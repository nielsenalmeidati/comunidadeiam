import { GraduationCap, TrendingUp, Users, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sidebar } from "@/components/sidebar/sidebar";

const stats = [
  { label: "Cursos em Andamento", value: "3", icon: BookOpen, color: "text-blue-400" },
  { label: "Progresso Geral", value: "42%", icon: TrendingUp, color: "text-green-400" },
  { label: "Membros Ativos", value: "1.2k", icon: Users, color: "text-purple-400" },
  { label: "Certificados", value: "2", icon: GraduationCap, color: "text-yellow-400" },
];

const courses = [
  { name: "Bootcamp Mental", progress: 25, total: 11, completed: 3 },
  { name: "Finanças", progress: 0, total: 5, completed: 0 },
  { name: "Seu Negócio", progress: 0, total: 8, completed: 0 },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Olá, <span className="text-primary">Nielsen Regenilson</span>!
          </h1>
          <p className="text-muted-foreground mt-1">Bem-vindo de volta ao seu painel de aprendizado</p>
        </div>

        {/* Stats */}
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

        {/* Courses Progress */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Meu Progresso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {courses.map((course) => (
              <div key={course.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{course.name}</span>
                  <span className="text-muted-foreground">{course.completed}/{course.total} aulas</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
