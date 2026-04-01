import { Gift, Clock, Users, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const giveaways = [
  { id: "1", title: "Mentoria 1:1 com Elber Domingos", description: "1 hora de mentoria individual com o fundador da comunidade. Sorteio entre todos os membros PRO ativos.", prize: "Mentoria 1:1", endsAt: "10/04/2026", participants: 47, maxParticipants: 100, active: true },
  { id: "2", title: "3 meses de assinatura PRO grátis", description: "Sorteio de 3 meses gratuitos de assinatura PRO. Participe indicando um amigo.", prize: "3 meses PRO", endsAt: "15/04/2026", participants: 23, maxParticipants: 50, active: true },
  { id: "3", title: "Curso de Copywriting Avançado", description: "Curso completo de copywriting avançado no valor de R$ 497.", prize: "Curso R$ 497", endsAt: "01/04/2026", participants: 89, maxParticipants: 89, active: false },
];

export default function GiveawaysPage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Giveaways</h1>
        <p className="text-muted-foreground">Sorteios e prêmios exclusivos para membros</p>
      </div>
      <div className="space-y-4">
        {giveaways.map((g) => (
          <div key={g.id} className={`bg-card border rounded-xl p-5 ${g.active ? "border-primary/40" : "border-border opacity-60"}`}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <Gift className={`w-5 h-5 ${g.active ? "text-primary" : "text-muted-foreground"}`} />
                <h2 className="font-semibold">{g.title}</h2>
              </div>
              <Badge className={`shrink-0 border-0 text-xs ${g.active ? "bg-green-500/20 text-green-400" : "bg-secondary text-muted-foreground"}`}>
                {g.active ? "Ativo" : "Encerrado"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{g.description}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1"><Trophy className="w-3 h-3 text-yellow-400" />{g.prize}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Até {g.endsAt}</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{g.participants}/{g.maxParticipants}</span>
            </div>
            <Progress value={(g.participants / g.maxParticipants) * 100} className="h-1.5 mb-3" />
            {g.active && <Button size="sm" className="bg-primary hover:bg-primary/90">Participar</Button>}
          </div>
        ))}
      </div>
    </div>
  );
}
