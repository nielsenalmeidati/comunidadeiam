import { Bookmark, Hash, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

const saved = [
  { id: "1", channel: "geral", author: "Elber Domingos", avatar: "ED", content: "Olá pessoal! Bem-vindos à Comunidade do IAM! Este é o espaço para você se conectar com outros membros...", savedAt: "Hoje, 10:30" },
  { id: "2", channel: "cases", author: "Nielsen Regenilson", avatar: "NR", content: "Acabei de fechar mais um contrato de R$8.000! Usando exatamente as técnicas da aula de vendas...", savedAt: "Ontem, 15:20" },
];

export default function PostagensSalvasPage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Postagens Salvas</h1>
        <p className="text-muted-foreground">{saved.length} postagem{saved.length !== 1 ? "s" : ""} salva{saved.length !== 1 ? "s" : ""}</p>
      </div>

      {saved.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Nenhuma postagem salva ainda.</p>
          <p className="text-xs mt-1">Salve postagens nos canais clicando no ícone de marcador.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {saved.map((s) => (
            <div key={s.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">{s.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{s.author}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Hash className="w-3 h-3" />{s.channel}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />{s.savedAt}
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{s.content}</p>
              <Link href="/canais">
                <p className="text-xs text-primary mt-2 hover:underline">Ver no canal →</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
