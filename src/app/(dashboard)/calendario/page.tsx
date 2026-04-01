import { Calendar, Clock, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const events = [
  { id: "1", title: "Live: Como fechar contratos de alto valor", date: "03/04/2026", time: "20:00", type: "Live", location: "YouTube / Canal Geral", description: "Aprenda as melhores técnicas para fechar contratos acima de R$5.000." },
  { id: "2", title: "Mentoria em grupo — Bootcamp Mental", date: "05/04/2026", time: "15:00", type: "Mentoria", location: "Zoom", description: "Sessão de mentoria em grupo focada nos módulos de mentalidade." },
  { id: "3", title: "Workshop: Criando seu primeiro produto digital", date: "10/04/2026", time: "19:00", type: "Workshop", location: "Online", description: "Passo a passo para criar e lançar seu primeiro produto digital do zero." },
  { id: "4", title: "Live mensal de resultados", date: "15/04/2026", time: "20:00", type: "Live", location: "YouTube", description: "Membros compartilham seus resultados do mês. Venha se inspirar!" },
];

const typeColor: Record<string, string> = {
  Live: "bg-red-500/20 text-red-400",
  Mentoria: "bg-primary/20 text-primary",
  Workshop: "bg-green-500/20 text-green-400",
};

export default function CalendarioPage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Calendário</h1>
        <p className="text-muted-foreground">Próximos eventos e lives da comunidade</p>
      </div>
      <div className="space-y-4">
        {events.map((e) => (
          <div key={e.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 className="font-semibold">{e.title}</h2>
              <Badge className={`shrink-0 border-0 text-xs ${typeColor[e.type] ?? typeColor.Live}`}>{e.type}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{e.description}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{e.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{e.time}</span>
              <span className="flex items-center gap-1"><Video className="w-3 h-3" />{e.location}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
