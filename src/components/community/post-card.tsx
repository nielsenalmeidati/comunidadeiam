"use client";

import { useState } from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Post } from "@/lib/mock-community";

export function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = () => {
    if (liked) {
      setLikes(l => l - 1);
    } else {
      setLikes(l => l + 1);
    }
    setLiked(!liked);
  };

  const roleColor: Record<string, string> = {
    Admin: "bg-yellow-500/20 text-yellow-400",
    PRO: "bg-primary/20 text-primary",
    Membro: "bg-secondary text-muted-foreground",
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-border/80 transition-colors">
      {/* Author */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9">
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
              {post.author.avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">{post.author.name}</p>
              <Badge className={cn("text-xs border-0 px-2 py-0", roleColor[post.author.role] || roleColor["Membro"])}>
                {post.author.role}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{post.createdAt}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <p className="text-sm leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>

      {/* Actions */}
      <div className="flex items-center gap-1 pt-3 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={cn(
            "gap-2 text-xs h-8",
            liked ? "text-red-400 hover:text-red-400 hover:bg-red-500/10" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Heart className={cn("w-4 h-4", liked && "fill-red-400")} />
          {likes}
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 text-xs h-8 text-muted-foreground hover:text-foreground">
          <MessageCircle className="w-4 h-4" />
          {post.comments}
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 text-xs h-8 text-muted-foreground hover:text-foreground ml-auto">
          <Share2 className="w-4 h-4" />
          Compartilhar
        </Button>
      </div>
    </div>
  );
}
