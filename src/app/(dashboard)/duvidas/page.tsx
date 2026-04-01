import { MessageCircle, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const questions = [
  { id: "1", title: "Como acessar os certificados dos cursos?", content: "Conclui o Bootcamp Mental mas não encontrei onde baixar o certificado. Alguém pode me ajudar?", author: "Maria Silva", date: "2h atrás", answers: 3, solved: true },
  { id: "2", title: "É possível assistir as aulas offline?", content: "Viajo muito e queria saber se consigo baixar as aulas para assistir sem internet.", author: "Pedro Costa", date: "5h atrás", answers: 1, solved: false },
  { id: "3", title: "Como funciona o plano PRO?", content: "Quais são as diferenças entre o plano gratuito e o PRO? Vale a pena fazer o upgrade?", author: "Ana Oliveira", date: "1d atrás", answers: 5, solved: true },
  { id: "4", title: "Posso cancelar minha assinatura a qualquer momento?", content: "Preciso entender melhor a política de cancelamento antes de assinar.", author: "Carlos Santos", date: "2d atrás", answers: 2, solved: true },
];

export default function DuvidasPage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Dúvidas</h1>
          <p className="text-muted-foreground">Pergunte e ajude outros membros</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">+ Nova Dúvida</Button>
      </div>
      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 className="font-semibold text-sm">{q.title}</h2>
              {q.solved
                ? <Badge className="shrink-0 bg-green-500/20 text-green-400 border-0 text-xs flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Resolvida</Badge>
                : <Badge className="shrink-0 bg-yellow-500/20 text-yellow-400 border-0 text-xs flex items-center gap-1"><Clock className="w-3 h-3" />Aberta</Badge>}
            </div>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{q.content}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>{q.author}</span>
              <span>·</span>
              <span>{q.date}</span>
              <span className="flex items-center gap-1 ml-auto"><MessageCircle className="w-3 h-3" />{q.answers} respostas</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
