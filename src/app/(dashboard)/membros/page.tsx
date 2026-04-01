import { Search, Crown, Shield, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function MembrosPage() {
  const supabase = await createServerSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: members } = await (supabase as any).from("users").select("*").order("created_at", { ascending: false }) as { data: { id: string; name: string; email: string; avatar_url: string | null; plan: string; created_at: string }[] | null };
  const list = members ?? [];
  const roleIcon: Record<string, React.ReactNode> = { admin: <Crown className="w-3 h-3" />, pro: <Shield className="w-3 h-3" />, free: <User className="w-3 h-3" /> };
  const roleLabel: Record<string, string> = { admin: "Admin", pro: "PRO", free: "Membro" };
  const roleStyle: Record<string, string> = { admin: "bg-yellow-500/20 text-yellow-400 border-0", pro: "bg-primary/20 text-primary border-0", free: "bg-secondary text-muted-foreground border-0" };
  function getInitials(name: string) { return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(); }
  function timeAgo(d: string) {
    const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
    if (days === 0) return "Hoje"; if (days === 1) return "Ontem";
    if (days < 7) return `Há ${days} dias`; if (days < 30) return `Há ${Math.floor(days / 7)} semanas`;
    return `Há ${Math.floor(days / 30)} meses`;
  }
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Membros</h1>
        <p className="text-muted-foreground">{list.length} membro{list.length !== 1 ? "s" : ""} na comunidade</p>
      </div>
      <div className="relative max-w-sm mb-6">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input placeholder="Buscar membro..." className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>
      {list.length === 0
        ? <div className="text-center py-20 text-muted-foreground"><User className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>Nenhum membro ainda.</p></div>
        : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((m) => {
            const plan = m.plan ?? "free";
            return (
              <div key={m.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:border-primary/40 transition-colors">
                <Avatar className="w-12 h-12">
                  {m.avatar_url && <AvatarImage src={m.avatar_url} />}
                  <AvatarFallback className="bg-primary/20 text-primary font-semibold">{getInitials(m.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold truncate">{m.name}</p>
                    <Badge className={`text-xs shrink-0 flex items-center gap-1 ${roleStyle[plan] ?? roleStyle.free}`}>{roleIcon[plan] ?? roleIcon.free}{roleLabel[plan] ?? "Membro"}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">Entrou: {timeAgo(m.created_at)}</p>
                </div>
              </div>
            );
          })}
        </div>}
    </div>
  );
}
