"use client";
import { useState } from "react";
import { Mail, Send, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const conversations = [
  { id: "1", name: "Elber Domingos", avatar: "ED", lastMessage: "Bem-vindo à comunidade! Qualquer dúvida estou aqui.", time: "10:30", unread: 1 },
  { id: "2", name: "Maria Silva", avatar: "MS", lastMessage: "Obrigada pela dica sobre o Bootcamp!", time: "Ontem", unread: 0 },
];

const mockMessages: Record<string, { id: string; from: string; content: string; time: string; mine: boolean }[]> = {
  "1": [
    { id: "1", from: "Elber Domingos", content: "Olá! Bem-vindo à Comunidade do IAM!", time: "10:00", mine: false },
    { id: "2", from: "Elber Domingos", content: "Bem-vindo à comunidade! Qualquer dúvida estou aqui.", time: "10:30", mine: false },
    { id: "3", from: "Você", content: "Obrigado! Muito feliz em fazer parte.", time: "10:35", mine: true },
  ],
  "2": [
    { id: "1", from: "Maria Silva", content: "Oi! Vi sua mensagem no chat sobre o Bootcamp.", time: "Ontem 14:00", mine: false },
    { id: "2", from: "Você", content: "Sim! Vale muito a pena, recomendo.", time: "Ontem 14:05", mine: true },
    { id: "3", from: "Maria Silva", content: "Obrigada pela dica sobre o Bootcamp!", time: "Ontem 14:10", mine: false },
  ],
};

export default function MensagensPage() {
  const [active, setActive] = useState(conversations[0]);
  const [newMsg, setNewMsg] = useState("");

  const messages = mockMessages[active.id] ?? [];

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-72 border-r border-border bg-card flex flex-col shrink-0">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-3"><Mail className="w-4 h-4 text-primary" /><h2 className="font-semibold text-sm">Mensagens</h2></div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Buscar conversa..." className="w-full bg-secondary border border-border rounded-md pl-7 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((c) => (
            <button key={c.id} onClick={() => setActive(c)}
              className={cn("w-full flex items-center gap-3 px-4 py-3 border-b border-border/50 hover:bg-secondary/50 transition-colors text-left", active.id === c.id && "bg-primary/10")}>
              <Avatar className="w-9 h-9 shrink-0">
                <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">{c.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold truncate">{c.name}</p>
                  <span className="text-xs text-muted-foreground shrink-0">{c.time}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>
              </div>
              {c.unread > 0 && <div className="w-2 h-2 rounded-full bg-primary shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-card shrink-0 flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">{active.avatar}</AvatarFallback>
          </Avatar>
          <p className="font-semibold text-sm">{active.name}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={cn("flex", m.mine ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-xs px-4 py-2 rounded-2xl text-sm", m.mine ? "bg-primary text-white rounded-br-sm" : "bg-card border border-border rounded-bl-sm")}>
                <p>{m.content}</p>
                <p className={cn("text-xs mt-1", m.mine ? "text-white/70" : "text-muted-foreground")}>{m.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-border bg-card shrink-0">
          <div className="flex items-end gap-3">
            <div className="flex-1 bg-secondary border border-border rounded-xl px-4 py-3">
              <textarea value={newMsg} onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); setNewMsg(""); } }}
                placeholder="Digite uma mensagem..." className="w-full bg-transparent text-sm focus:outline-none resize-none" rows={2} />
            </div>
            <Button size="icon" className="bg-primary hover:bg-primary/90 w-10 h-10 rounded-xl shrink-0" disabled={!newMsg.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
