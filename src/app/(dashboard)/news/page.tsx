import { Megaphone, Pin, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const announcements = [
  { id: "1", title: "Bem-vindos à Comunidade do IAM!", content: "Estamos muito felizes em ter vocês aqui. Esta é a nossa plataforma oficial de aprendizado e comunidade. Aproveitem os cursos, interajam nos canais e cresçam juntos!", author: "Elber Domingos", date: "01/04/2026", pinned: true, tag: "Importante" },
  { id: "2", title: "Novo curso disponível: Venda", content: "O curso de Vendas já está disponível na plataforma! Acesse Meus Cursos e comece agora. São 9 aulas repletas de técnicas e estratégias para você vender mais.", author: "Elber Domingos", date: "28/03/2026", pinned: false, tag: "Novo Curso" },
  { id: "3", title: "Live especial na quinta-feira", content: "Teremos uma live especial nesta quinta às 20h sobre como fechar contratos de alto valor. Não percam! O link será enviado no canal Geral.", author: "Elber Domingos", date: "25/03/2026", pinned: false, tag: "Evento" },
];

export default function NewsPage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">News e Anúncios</h1>
        <p className="text-muted-foreground">Fique por dentro de tudo que acontece na comunidade</p>
      </div>
      <div className="space-y-4">
        {announcements.map((a) => (
          <div key={a.id} className={`bg-card border rounded-xl p-5 ${a.pinned ? "border-primary/50" : "border-border"}`}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                {a.pinned && <Pin className="w-4 h-4 text-primary shrink-0" />}
                <h2 className="font-semibold">{a.title}</h2>
              </div>
              <Badge className="shrink-0 bg-primary/20 text-primary border-0 text-xs">{a.tag}</Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{a.content}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Bell className="w-3 h-3" />
              <span>{a.author}</span>
              <span>·</span>
              <span>{a.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
