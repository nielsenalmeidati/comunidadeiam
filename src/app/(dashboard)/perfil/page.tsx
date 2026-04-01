import { auth, currentUser } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { User, Mail, Calendar, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default async function PerfilPage() {
  const { userId } = await auth();
  const clerkUser = await currentUser();
  const supabase = await createServerSupabaseClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let dbUser: any = null;
  if (userId) {
    const { data } = await supabase.from("users").select("*").eq("clerk_id", userId).single();
    dbUser = data;
  }

  const name = clerkUser?.firstName ? `${clerkUser.firstName} ${clerkUser.lastName ?? ""}`.trim() : dbUser?.name ?? "Usuário";
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? dbUser?.email ?? "";
  const avatar = clerkUser?.imageUrl ?? dbUser?.avatar_url ?? "";
  const plan = dbUser?.plan ?? "free";
  const initials = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Meu Perfil</h1>
        <p className="text-muted-foreground">Suas informações na plataforma</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center gap-5">
          <Avatar className="w-20 h-20">
            {avatar && <AvatarImage src={avatar} />}
            <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">{name}</h2>
            <p className="text-muted-foreground text-sm">{email}</p>
            <Badge className={`mt-2 border-0 ${plan === "pro" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
              {plan === "pro" ? "PRO" : "Gratuito"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl divide-y divide-border">
        {[
          { icon: User, label: "Nome completo", value: name },
          { icon: Mail, label: "Email", value: email },
          { icon: Shield, label: "Plano", value: plan === "pro" ? "PRO" : "Gratuito" },
          { icon: Calendar, label: "Membro desde", value: dbUser?.created_at ? new Date(dbUser.created_at).toLocaleDateString("pt-BR") : "—" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-4 p-4">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-medium">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
