"use client";
import { useState } from "react";
import { MessageSquare, Send, Hash } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const messages = [
  { id: "1", author: "Elber Domingos", avatar: "ED", role: "Admin", content: "Olá turma! Bem-vindos ao chat dos alunos. Este é o espaço para trocas rápidas e networking.", time: "09:00" },
  { id: "2", author: "Maria Silva", avatar: "MS", role: "PRO", content: "Bom dia! Animada para mais um dia de aprendizado 🚀", time: "09:15" },
  { id: "3", author: "Pedro Costa", avatar: "PC", role: "Membro", content: "Alguém já terminou o Bootcamp Mental? Vale muito a pena?", time: "09:32" },
  { id: "4", author: "Nielsen Regenilson", avatar: "NR", role: "PRO", content: "Sim! Terminei semana passada. É incrível, muda completamente a mentalidade sobre empreendedorismo.", time: "09:45" },
  { id: "5", author: "Ana Oliveira", avatar: "AO", role: "PRO", content: "Concordo com o Nielsen! O módulo sobre síndrome do impostor foi transformador pra mim.", time: "09:50" },
];

const roleStyle: Record<string, string> = {
  Admin: "bg-yellow-500/20 text-yellow-400",
  PRO: "bg-primary/20 text-primary",
  Membro: "bg-secondary text-muted-foreground",
};

export default function ChatPage() {
  const [newMessage, setNewMessage] = useState("");

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h1 className="font-semibold">Chat — Alunos</h1>
          <Badge variant="destructive" className="h-5 text-xs px-1">2</Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">Canal de comunicação entre alunos</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className="flex items-start gap-3">
            <Avatar className="w-8 h-8 shrink-0">
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">{m.avatar}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold">{m.author}</span>
                <Badge className={`text-xs border-0 px-1.5 py-0 ${roleStyle[m.role]}`}>{m.role}</Badge>
                <span className="text-xs text-muted-foreground">{m.time}</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{m.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 border-t border-border bg-card shrink-0">
        <div className="flex items-end gap-3">
          <div className="flex-1 bg-secondary border border-border rounded-xl px-4 py-3">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); setNewMessage(""); } }}
              placeholder="Digite sua mensagem..."
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none resize-none"
              rows={2}
            />
          </div>
          <Button size="icon" className="bg-primary hover:bg-primary/90 shrink-0 w-10 h-10 rounded-xl" disabled={!newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
