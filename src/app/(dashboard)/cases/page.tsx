import { TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const cases = [
  { id: "1", author: "Nielsen Regenilson", avatar: "NR", result: "Fechei R$ 8.000 em contratos", content: "Usando as técnicas da aula de vendas, consegui fechar 2 contratos de R$ 4.000 cada em menos de 30 dias. O método de abordagem e follow-up funcionou perfeitamente!", category: "Vendas", date: "01/04/2026" },
  { id: "2", author: "Maria Silva", avatar: "MS", result: "Primeiro cliente online conquistado", content: "Após o módulo de negócios, estruturei meu serviço de design e consegui meu primeiro cliente online pagando R$ 2.500. Nunca imaginei que seria tão rápido!", category: "Negócios", date: "28/03/2026" },
  { id: "3", author: "Ana Oliveira", avatar: "AO", result: "Saí do emprego CLT", content: "Em 3 meses aplicando o que aprendi aqui, consegui substituir meu salário CLT com freelas. Hoje faturando 2x mais com muito mais liberdade.", category: "Mindset", date: "20/03/2026" },
];

export default function CasesPage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Cases de Sucesso</h1>
          <p className="text-muted-foreground">Resultados reais de membros da comunidade</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">+ Compartilhar Case</Button>
      </div>
      <div className="space-y-4">
        {cases.map((c) => (
          <div key={c.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-9 h-9"><AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">{c.avatar}</AvatarFallback></Avatar>
              <div className="flex-1">
                <p className="text-sm font-semibold">{c.author}</p>
                <p className="text-xs text-muted-foreground">{c.date}</p>
              </div>
              <Badge className="bg-primary/20 text-primary border-0 text-xs">{c.category}</Badge>
            </div>
            <div className="flex items-center gap-2 mb-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <TrendingUp className="w-4 h-4 text-green-400 shrink-0" />
              <p className="text-sm font-semibold text-green-400">{c.result}</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
