"use client";
import { useState } from "react";
import { Settings, Bell, Moon, Globe, Shield, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const settings = [
  {
    section: "Notificações",
    icon: Bell,
    items: [
      { label: "Notificações por email", description: "Receba novidades e anúncios por email", enabled: true },
      { label: "Notificações de mensagens", description: "Seja avisado de novas mensagens diretas", enabled: true },
      { label: "Notificações de canais", description: "Atualizações dos canais que você segue", enabled: false },
    ],
  },
  {
    section: "Aparência",
    icon: Moon,
    items: [
      { label: "Tema escuro", description: "Interface no modo escuro", enabled: true },
    ],
  },
  {
    section: "Privacidade",
    icon: Shield,
    items: [
      { label: "Perfil público", description: "Outros membros podem ver seu perfil", enabled: true },
      { label: "Mostrar status online", description: "Exibir quando você está online", enabled: false },
    ],
  },
];

export default function ConfiguracoesPage() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    settings.forEach((s) => s.items.forEach((item) => { init[item.label] = item.enabled; }));
    return init;
  });

  const toggle = (label: string) => setToggles((prev) => ({ ...prev, [label]: !prev[label] }));

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Configurações</h1>
        <p className="text-muted-foreground">Personalize sua experiência na plataforma</p>
      </div>
      <div className="space-y-6">
        {settings.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.section} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-border">
                <Icon className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-sm">{s.section}</h2>
              </div>
              <div className="divide-y divide-border">
                {s.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <button
                      onClick={() => toggle(item.label)}
                      className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${toggles[item.label] ? "bg-primary" : "bg-secondary border border-border"}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${toggles[item.label] ? "translate-x-5" : "translate-x-1"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
