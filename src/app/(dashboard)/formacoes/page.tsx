import { GraduationCap, Clock, BookOpen, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

const formacoes = [
  { id: "1", title: "Formação Empreendedor Digital Completo", description: "Do zero ao primeiro R$ 10.000/mês online. Trilha completa com Mindset, Finanças, Negócio e Vendas.", courses: ["Bootcamp Mental", "Finanças", "Seu Negócio", "Venda"], duration: "18h 30min", students: 234, progress: 27, available: true },
  { id: "2", title: "Formação Vendedor de Alta Performance", description: "Torne-se um vendedor de alto nível. Aprenda a prospectar, apresentar e fechar qualquer venda.", courses: ["Venda", "Seu Negócio"], duration: "10h 45min", students: 189, progress: 0, available: false },
];

export default function FormacoesPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Formações</h1>
        <p className="text-muted-foreground">Trilhas de aprendizado completas e estruturadas</p>
      </div>
      <div className="space-y-6">
        {formacoes.map((f) => (
          <div key={f.id} className={`bg-card border rounded-xl p-6 ${f.available ? "border-border hover:border-primary/40" : "border-border opacity-70"} transition-colors`}>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold">{f.title}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">{f.description}</p>
                </div>
              </div>
              {!f.available && <Lock className="w-5 h-5 text-muted-foreground shrink-0" />}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {f.courses.map((c) => <Badge key={c} className="bg-secondary text-muted-foreground border-0 text-xs">{c}</Badge>)}
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{f.courses.length} cursos</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{f.duration}</span>
              <span>{f.students} alunos</span>
            </div>
            {f.available && f.progress > 0 && (
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Progresso</span><span className="text-primary">{f.progress}%</span></div>
                <Progress value={f.progress} className="h-2" />
              </div>
            )}
            {f.available
              ? <Link href="/cursos"><Button className="bg-primary hover:bg-primary/90">{f.progress > 0 ? "Continuar Formação" : "Iniciar Formação"}</Button></Link>
              : <Button disabled className="opacity-50">Em breve</Button>}
          </div>
        ))}
      </div>
    </div>
  );
}
