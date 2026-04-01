"use client";

import { useState } from "react";
import { Check, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/lib/stripe";

export default function AssinaturaPage() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (plan: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const features = PLANS.PRO.features;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Minha Assinatura</h1>
        <p className="text-muted-foreground">Gerencie seu plano e acesso à plataforma</p>
      </div>

      {/* Current plan */}
      <div className="bg-primary/10 border border-primary/30 rounded-xl p-5 mb-8 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <Crown className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-semibold">Plano PRO — Ativo</p>
          <p className="text-sm text-muted-foreground">Próxima cobrança: 30/04/2026</p>
        </div>
        <Badge className="ml-auto bg-green-500/20 text-green-400 border-0">Ativo</Badge>
      </div>

      {/* Plan card */}
      <div className="bg-card border-2 border-primary rounded-xl overflow-hidden">
        <div className="bg-primary p-5 text-white">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5" />
            <h2 className="font-bold text-lg">{PLANS.PRO.name}</h2>
          </div>
          <p className="text-primary-foreground/80 text-sm">{PLANS.PRO.description}</p>
        </div>
        <div className="p-6">
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-3xl font-bold">R$ 97</span>
            <span className="text-muted-foreground">/mês</span>
          </div>
          <ul className="space-y-3 mb-6">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
          <Button
            onClick={() => handleSubscribe("PRO")}
            disabled={loading}
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary hover:text-white"
          >
            {loading ? "Redirecionando..." : "Gerenciar assinatura"}
          </Button>
        </div>
      </div>
    </div>
  );
}
