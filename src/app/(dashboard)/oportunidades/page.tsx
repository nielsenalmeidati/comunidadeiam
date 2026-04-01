import { MapPin, DollarSign, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const opportunities = [
  { id: "1", title: "Copywriter Freelancer", company: "Agência Digital XYZ", type: "Freelance", location: "Remoto", budget: "R$ 2.000 - 4.000/mês", deadline: "Aberta", description: "Procuramos copywriter para criar conteúdo persuasivo para e-commerce. Experiência com email marketing é diferencial." },
  { id: "2", title: "Gestor de Tráfego Pago", company: "Startup ABC", type: "PJ", location: "Remoto", budget: "R$ 3.500/mês", deadline: "Fecha em 5 dias", description: "Vaga para gestor de tráfego com experiência em Facebook e Google Ads para gestão de contas de e-commerce." },
  { id: "3", title: "Parceria: Infoproduto de Vendas", company: "Nielsen Regenilson", type: "Parceria", location: "Online", budget: "50% comissão", deadline: "Aberta", description: "Busco co-criador para produto digital sobre vendas consultivas. Divisão igual nos lucros." },
];

const typeColor: Record<string, string> = {
  Freelance: "bg-blue-500/20 text-blue-400",
  PJ: "bg-primary/20 text-primary",
  Parceria: "bg-green-500/20 text-green-400",
};

export default function OportunidadesPage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Oportunidades</h1>
          <p className="text-muted-foreground">Vagas e parcerias para membros da comunidade</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">+ Publicar Oportunidade</Button>
      </div>
      <div className="space-y-4">
        {opportunities.map((o) => (
          <div key={o.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h2 className="font-semibold">{o.title}</h2>
                <p className="text-sm text-muted-foreground">{o.company}</p>
              </div>
              <Badge className={`shrink-0 border-0 text-xs ${typeColor[o.type] ?? typeColor.Freelance}`}>{o.type}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{o.description}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{o.location}</span>
              <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{o.budget}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{o.deadline}</span>
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90">Tenho Interesse</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
