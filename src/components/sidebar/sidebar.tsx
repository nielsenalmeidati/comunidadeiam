"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Calendar,
  UserPlus,
  Megaphone,
  MessageSquare,
  HelpCircle,
  Star,
  BarChart3,
  GraduationCap,
  FileText,
  Users,
  Hash,
  Bookmark,
  Briefcase,
  Gift,
  Mail,
  User,
  CreditCard,
  Settings,
  Bug,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navAprendizado = [
  { label: "Início", href: "/", icon: Home },
  { label: "Meus Cursos", href: "/cursos", icon: BookOpen },
  { label: "Calendário", href: "/calendario", icon: Calendar },
  { label: "Se Apresente", href: "/apresente", icon: UserPlus },
  { label: "News e Anúncios", href: "/news", icon: Megaphone, badge: 1 },
  { label: "Chat - Alunos", href: "/chat", icon: MessageSquare, badge: 2 },
  { label: "Dúvidas", href: "/duvidas", icon: HelpCircle },
  { label: "Indicações & Reviews", href: "/indicacoes", icon: Star },
  { label: "Meu Progresso", href: "/progresso", icon: BarChart3 },
  { label: "Formações", href: "/formacoes", icon: GraduationCap },
  { label: "Anotações", href: "/anotacoes", icon: FileText },
];

const navComunidade = [
  { label: "Membros", href: "/membros", icon: Users },
  { label: "Canais", href: "/canais", icon: Hash, badge: 8 },
  { label: "Postagens Salvas", href: "/postagens-salvas", icon: Bookmark },
  { label: "Cases", href: "/cases", icon: Briefcase },
  { label: "Oportunidades", href: "/oportunidades", icon: Briefcase },
  { label: "Giveaways", href: "/giveaways", icon: Gift },
];

const navComunicacao = [
  { label: "Mensagens", href: "/mensagens", icon: Mail },
];

const navConta = [
  { label: "Perfil", href: "/perfil", icon: User },
  { label: "Minha Assinatura", href: "/assinatura", icon: CreditCard },
  { label: "Configurações", href: "/configuracoes", icon: Settings },
  { label: "Bugs e Sugestões", href: "/bugs", icon: Bug },
];

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
};

function NavSection({
  title,
  items,
}: {
  title: string;
  items: NavItem[];
}) {
  const pathname = usePathname();

  return (
    <div className="mb-4">
      <p className="px-3 mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {title}
      </p>
      <ul className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive
                    ? "bg-accent/20 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <Badge variant="destructive" className="h-5 min-w-5 text-xs px-1">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="flex flex-col w-64 min-h-screen bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-sm">IAM Community</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
        <NavSection title="Aprendizado" items={navAprendizado} />
        <NavSection title="Comunidade" items={navComunidade} />
        <NavSection title="Comunicação" items={navComunicacao} />
        <NavSection title="Conta" items={navConta} />
      </nav>

      {/* User Profile */}
      <div className="px-3 py-3 border-t border-border">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/avatar.png" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              NR
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate">Nielsen Regenilson</p>
            <p className="text-xs text-muted-foreground truncate">ticosampa@gmail.com</p>
          </div>
          <Badge className="text-xs bg-primary/20 text-primary border-0">PRO</Badge>
        </div>
      </div>
    </aside>
  );
}
