import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { stripe, PLANS } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json();
    const planConfig = PLANS[plan as keyof typeof PLANS];

    if (!planConfig) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: planConfig.priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/assinatura?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/assinatura?canceled=true`,
      metadata: { userId, plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[CHECKOUT_ERROR]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
