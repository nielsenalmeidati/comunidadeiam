"use client";
import { useState } from "react";
import { UserPlus, Send } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const presentations = [
  { id: "1", name: "Pedro Costa", avatar: "PC", role: "Membro", city: "São Paulo, SP", bio: "Trabalho com marketing digital há 3 anos. Vim aqui para aprender a escalar meu negócio!", goal: "Escalar negócio digital", date: "3d atrás" },
  { id: "2", name: "Juliana Mendes", avatar: "JM", role: "PRO", city: "Belo Horizonte, MG", bio: "Designer freelancer em transição para infoprodutos. Animada para aprender com todos vocês!", goal: "Criar primeiro infoproduto", date: "5d atrás" },
];

export default function ApresentePage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Se Apresente</h1>
          <p className="text-muted-foreground">Conte quem você é para a comunidade</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 gap-2" onClick={() => setShowForm(!showForm)}>
          <UserPlus className="w-4 h-4" />Me Apresentar
        </Button>
      </div>
      {showForm && (
        <div className="bg-card border border-primary/40 rounded-xl p-5 mb-6">
          <h2 className="font-semibold mb-4">Sua apresentação</h2>
          <div className="space-y-3">
            <input placeholder="Sua cidade" className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            <textarea placeholder="Fale um pouco sobre você — quem é, o que faz, por que entrou na comunidade..." className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" rows={3} />
            <input placeholder="Seu principal objetivo na comunidade" className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            <Button className="bg-primary hover:bg-primary/90 gap-2 w-full"><Send className="w-4 h-4" />Publicar Apresentação</Button>
          </div>
        </div>
      )}
      <div className="space-y-4">
        {presentations.map((p) => (
          <div key={p.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-10 h-10"><AvatarFallback className="bg-primary/20 text-primary font-semibold">{p.avatar}</AvatarFallback></Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{p.name}</p>
                  <Badge className="bg-primary/20 text-primary border-0 text-xs">{p.role}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{p.city} · {p.date}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{p.bio}</p>
            <p className="text-xs text-primary font-medium">Objetivo: {p.goal}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
