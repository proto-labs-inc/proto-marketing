import { NextResponse } from "next/server";
import { z } from "zod";

import { readSql, sql } from "@/lib/db";

export async function GET() {
  try {
    const rows = await readSql(read => read`
      SELECT count(*)::int AS count FROM early_access_requests
    `) as { count: number }[];
    const count = rows[0]?.count;
    if (typeof count !== "number") throw new Error("Missing waitlist count");
    return NextResponse.json(
      { count },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Early access count failed", error);
    return NextResponse.json({ error: "Waitlist count unavailable." }, { status: 503 });
  }
}

const requestBody = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  role: z.string().trim().min(1).max(120),
  twitterHandle: z.string().trim().min(1).max(120),
  excitement: z.string().trim().min(1).max(120),
  phone: z.string().trim().max(40).optional().transform((value) => value || null),
});

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const parsed = requestBody.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Check your details and try again." }, { status: 400 });
  }

  const { email, role, twitterHandle, excitement, phone } = parsed.data;
  try {
    await sql()`
      INSERT INTO early_access_requests (email, role, twitter_handle, excitement, phone)
      VALUES (${email}, ${role}, ${twitterHandle}, ${excitement}, ${phone})
      ON CONFLICT (email) DO UPDATE SET
        role = EXCLUDED.role,
        twitter_handle = EXCLUDED.twitter_handle,
        excitement = EXCLUDED.excitement,
        phone = EXCLUDED.phone,
        updated_at = now()
    `;
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Early access request failed", error);
    return NextResponse.json({ error: "Could not save your request. Please try again." }, { status: 500 });
  }
}
