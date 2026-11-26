import { NextResponse } from "next/server";
import { z } from "zod";

import { sql } from "@/lib/db";

const requestBody = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  role: z.string().trim().min(1).max(120),
  twitterHandle: z.string().trim().min(1).max(120),
  excitement: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(1).max(40),
  followsProto: z.literal(true),
});

export async function POST(request: Request) {
  const host = request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") ?? new URL(request.url).protocol.slice(0, -1);
  if (!host || (protocol !== "http" && protocol !== "https") || request.headers.get("origin") !== `${protocol}://${host}`) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const parsed = requestBody.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Check your details and try again." }, { status: 400 });
  }

  const { email, role, twitterHandle, excitement, phone, followsProto } = parsed.data;
  try {
    await sql()`
      INSERT INTO early_access_requests (email, role, twitter_handle, excitement, phone, follows_proto)
      VALUES (${email}, ${role}, ${twitterHandle}, ${excitement}, ${phone}, ${followsProto})
      ON CONFLICT (email) DO UPDATE SET
        role = EXCLUDED.role,
        twitter_handle = EXCLUDED.twitter_handle,
        excitement = EXCLUDED.excitement,
        phone = EXCLUDED.phone,
        follows_proto = EXCLUDED.follows_proto,
        updated_at = now()
    `;
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Early access application failed", error);
    return NextResponse.json({ error: "Could not save your request. Please try again." }, { status: 500 });
  }
}
