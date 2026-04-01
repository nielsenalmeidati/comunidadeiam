import Stripe from "stripe";

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-03-25.dahlia",
      typescript: true,
    })
  : null;

export const PLANS = {
  PRO: {
    name: "Plano PRO",
    description: "Acesso completo a todos os cursos e comunidade",
    price: 9700, // R$ 97,00 in centavos
    priceId: process.env.STRIPE_PRO_PRICE_ID || "price_placeholder",
    features: [
      "Acesso a todos os cursos",
      "Comunidade exclusiva PRO",
      "Chat com membros",
      "Novos conteúdos mensais",
      "Certificados de conclusão",
    ],
  },
};
