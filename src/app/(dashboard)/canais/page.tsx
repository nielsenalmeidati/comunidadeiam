"use client";
import { useState, useEffect, useRef } from "react";
import { Hash, Send, Search, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { PostCard } from "@/components/community/post-card";
import type { SupabaseClient } from "@supabase/supabase-js";

type Channel = { id: string; name: string; description: string | null; type: string };
type Post = { id: string; channel_id: string; content: string; likes_count: number; comments_count: number; created_at: string; author: { id: string; name: string; avatar_url: string | null; plan: string } | null };

export default function CanaisPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [newPost, setNewPost] = useState("");
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const clientRef = useRef<SupabaseClient | null>(null);
  function getClient(): SupabaseClient {
    if (!clientRef.current) clientRef.current = createClient() as unknown as SupabaseClient;
    return clientRef.current;
  }

  useEffect(() => {
    const sb = getClient();
    async function init() {
      const { data: chs } = await sb.from("channels").select("*").order("created_at");
      if (chs?.length) { setChannels(chs as Channel[]); setActiveChannel((chs as Channel[])[0]); }
      const { data: { user } } = await sb.auth.getUser();
      if (user) {
        const { data: profile } = await (sb as any).from("users").select("id").eq("clerk_id", user.id).single() as { data: { id: string } | null };
        setCurrentUser(profile);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (!activeChannel) return;
    const sb = getClient();
    async function loadPosts() {
      const { data } = await (sb as any).from("posts").select("*, author:users(id, name, avatar_url, plan)").eq("channel_id", activeChannel!.id).order("created_at", { ascending: false }).limit(20);
      setPosts((data as Post[]) ?? []);
    }
    loadPosts();
    const ch = sb.channel(`posts:${activeChannel.id}`)
      .on("postgres_changes" as any, { event: "INSERT", schema: "public", table: "posts", filter: `channel_id=eq.${activeChannel.id}` }, async (payload: any) => {
        const { data } = await (sb as any).from("posts").select("*, author:users(id, name, avatar_url, plan)").eq("id", payload.new.id).single();
        if (data) setPosts((prev) => [data as Post, ...prev]);
      }).subscribe();
    return () => { sb.removeChannel(ch); };
  }, [activeChannel]);

  const handleSend = async () => {
    if (!newPost.trim() || !activeChannel || !currentUser) return;
    setSending(true);
    const sb = getClient();
    await (sb as any).from("posts").insert({ channel_id: activeChannel.id, author_id: currentUser.id, content: newPost.trim() });
    setNewPost("");
    setSending(false);
  };

  const adaptedPosts = posts.map((p) => ({
    id: p.id, channelId: p.channel_id,
    author: { name: p.author?.name ?? "Usuário", avatar: (p.author?.name ?? "US").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(), role: p.author?.plan === "pro" ? "PRO" : "Membro" },
    content: p.content, createdAt: new Date(p.created_at).toLocaleDateString("pt-BR"), likes: p.likes_count, comments: p.comments_count, liked: false,
  }));

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-60 border-r border-border bg-card flex flex-col shrink-0">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-3"><Users className="w-4 h-4 text-primary" /><h2 className="font-semibold text-sm">Canais</h2></div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Buscar canal..." className="w-full bg-secondary border border-border rounded-md pl-7 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {channels.map((ch) => (
            <button key={ch.id} onClick={() => setActiveChannel(ch)}
              className={cn("w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-left", activeChannel?.id === ch.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary")}>
              <Hash className="w-3.5 h-3.5 shrink-0" /><span className="flex-1 truncate">{ch.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-2"><Hash className="w-5 h-5 text-primary" /><h1 className="font-semibold">{activeChannel?.name ?? "Carregando..."}</h1></div>
          <p className="text-xs text-muted-foreground mt-0.5">{activeChannel?.description}</p>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {adaptedPosts.length === 0
            ? <div className="text-center py-16 text-muted-foreground"><Hash className="w-10 h-10 mx-auto mb-3 opacity-30" /><p className="text-sm">Nenhuma postagem ainda.</p><p className="text-xs">Seja o primeiro a postar!</p></div>
            : <div className="space-y-4 max-w-2xl mx-auto">{adaptedPosts.map((post) => <PostCard key={post.id} post={post} />)}</div>}
        </div>
        <div className="px-6 py-4 border-t border-border bg-card shrink-0">
          <div className="max-w-2xl mx-auto flex items-end gap-3">
            <div className="flex-1 bg-secondary border border-border rounded-xl px-4 py-3">
              <textarea value={newPost} onChange={(e) => setNewPost(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={`Postar em #${activeChannel?.name ?? "canal"}...`}
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none resize-none" rows={2} />
            </div>
            <Button size="icon" className="bg-primary hover:bg-primary/90 shrink-0 w-10 h-10 rounded-xl" disabled={!newPost.trim() || sending} onClick={handleSend}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
