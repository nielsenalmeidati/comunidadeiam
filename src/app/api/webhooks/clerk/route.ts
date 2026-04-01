import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { createServiceClient } from "@/lib/supabase/server";

type ClerkUserEvent = {
  type: "user.created" | "user.updated" | "user.deleted";
  data: {
    id: string;
    email_addresses: { email_address: string; id: string }[];
    first_name: string | null;
    last_name: string | null;
    image_url: string;
    primary_email_address_id: string;
  };
};

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing webhook secret" }, { status: 500 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const payload = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let event: ClerkUserEvent;
  try {
    event = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkUserEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createServiceClient();

  if (event.type === "user.created" || event.type === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url, primary_email_address_id } = event.data;
    const primaryEmail = email_addresses.find(e => e.id === primary_email_address_id);

    if (!primaryEmail) {
      return NextResponse.json({ error: "No primary email" }, { status: 400 });
    }

    const name = [first_name, last_name].filter(Boolean).join(" ") || "Usuário";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("users").upsert({
      clerk_id: id,
      email: primaryEmail.email_address,
      name,
      avatar_url: image_url,
    }, { onConflict: "clerk_id" });

    if (error) {
      console.error("[CLERK_WEBHOOK] Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  if (event.type === "user.deleted") {
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("clerk_id", event.data.id);

    if (error) {
      console.error("[CLERK_WEBHOOK] Delete error:", error);
    }
  }

  return NextResponse.json({ received: true });
}
