import { Star, Gift, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function IndicacoesPage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Indicações & Reviews</h1>
        <p className="text-muted-foreground">Indique amigos e ganhe recompensas</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Indicações feitas", value: "0", icon: Users, color: "text-blue-400" },
          { label: "Conversões", value: "0", icon: TrendingUp, color: "text-green-400" },
          { label: "Recompensas", value: "R$ 0", icon: Gift, color: "text-yellow-400" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h2 className="font-semibold mb-2">Seu link de indicação</h2>
        <p className="text-sm text-muted-foreground mb-4">Compartilhe este link e ganhe comissão por cada novo membro que entrar.</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-secondary border border-border rounded-lg px-4 py-2 text-sm text-muted-foreground">
            https://comunidadeiam.vercel.app?ref=nielsen
          </div>
          <Button variant="outline" className="shrink-0">Copiar</Button>
        </div>
      </div>
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" />Deixe seu review</h2>
        <p className="text-sm text-muted-foreground mb-4">Sua opinião ajuda outros membros a conhecerem a plataforma.</p>
        <textarea className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none" rows={3} placeholder="Conte como a Comunidade do IAM impactou sua vida..." />
        <Button className="mt-3 bg-primary hover:bg-primary/90">Enviar Review</Button>
      </div>
    </div>
  );
}
