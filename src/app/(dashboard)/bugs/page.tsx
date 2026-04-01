"use client";
import { useState } from "react";
import { Bug, Send, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const reports = [
  { id: "1", title: "Vídeo não carrega no iOS Safari", type: "Bug", status: "resolved", date: "28/03/2026" },
  { id: "2", title: "Sugestão: modo de texto grande", type: "Sugestão", status: "reviewing", date: "25/03/2026" },
];

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  resolved: { label: "Resolvido", color: "bg-green-500/20 text-green-400", icon: CheckCircle2 },
  reviewing: { label: "Em análise", color: "bg-yellow-500/20 text-yellow-400", icon: Clock },
  open: { label: "Aberto", color: "bg-blue-500/20 text-blue-400", icon: AlertTriangle },
};

export default function BugsPage() {
  const [type, setType] = useState<"Bug" | "Sugestão">("Bug");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Bugs e Sugestões</h1>
        <p className="text-muted-foreground">Nos ajude a melhorar a plataforma</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <h2 className="font-semibold mb-4">Enviar reporte</h2>
        <div className="flex gap-2 mb-4">
          {(["Bug", "Sugestão"] as const).map((t) => (
            <button key={t} onClick={() => setType(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${type === t ? "bg-primary text-white" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder={type === "Bug" ? "Descreva o bug resumidamente..." : "Qual sua sugestão?"}
            className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva com mais detalhes. Para bugs: como reproduzir, qual dispositivo/navegador..."
            className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" rows={4} />
          <Button className="bg-primary hover:bg-primary/90 gap-2 w-full" disabled={!title.trim()}>
            <Send className="w-4 h-4" />Enviar {type}
          </Button>
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-4">Meus reportes</h2>
        <div className="space-y-3">
          {reports.map((r) => {
            const cfg = statusConfig[r.status];
            const Icon = cfg.icon;
            return (
              <div key={r.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Bug className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.type} · {r.date}</p>
                </div>
                <Badge className={`shrink-0 border-0 text-xs flex items-center gap-1 ${cfg.color}`}>
                  <Icon className="w-3 h-3" />{cfg.label}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
