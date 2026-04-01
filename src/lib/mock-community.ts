export const channels = [
  { id: "1", name: "geral", description: "Canal principal da comunidade", type: "public" as const, unread: 3 },
  { id: "2", name: "apresentações", description: "Se apresente para a comunidade", type: "public" as const, unread: 0 },
  { id: "3", name: "dúvidas", description: "Tire suas dúvidas aqui", type: "public" as const, unread: 5 },
  { id: "4", name: "cases", description: "Compartilhe seus resultados", type: "public" as const, unread: 0 },
  { id: "5", name: "oportunidades", description: "Vagas e oportunidades de negócio", type: "public" as const, unread: 1 },
];

export const posts = [
  {
    id: "1",
    channelId: "1",
    author: { name: "Elber Domingos", avatar: "ED", role: "Admin" },
    content: "🚀 Bem-vindos ao canal geral da Comunidade do IAM! Este é o espaço para você se conectar com outros membros, compartilhar aprendizados e crescer junto com a comunidade. Qualquer dúvida, chame no privado!",
    createdAt: "2h atrás",
    likes: 24,
    comments: 8,
    liked: false,
  },
  {
    id: "2",
    channelId: "1",
    author: { name: "Nielsen Regenilson", avatar: "NR", role: "PRO" },
    content: "Acabei de fechar mais um contrato de R$8.000! Usando exatamente as técnicas da aula de vendas. O método funciona demais. Obrigado a todos que me apoiaram nessa jornada! 💪",
    createdAt: "5h atrás",
    likes: 47,
    comments: 15,
    liked: true,
  },
  {
    id: "3",
    channelId: "1",
    author: { name: "Maria Silva", avatar: "MS", role: "PRO" },
    content: "Dica: Antes de dormir, anote 3 conquistas do dia, por menores que pareçam. Isso treina o cérebro para focar no positivo e manter a motivação alta. Aprendi isso no Bootcamp Mental e mudou minha vida!",
    createdAt: "1d atrás",
    likes: 31,
    comments: 6,
    liked: false,
  },
  {
    id: "4",
    channelId: "2",
    author: { name: "Pedro Costa", avatar: "PC", role: "Membro" },
    content: "Oi pessoal! Me chamo Pedro, sou de SP, trabalho com marketing digital há 3 anos e vim aqui para aprender a escalar meu negócio. Animado para essa jornada com vocês! 🙌",
    createdAt: "3d atrás",
    likes: 12,
    comments: 4,
    liked: false,
  },
];

export type Channel = typeof channels[0];
export type Post = typeof posts[0];
