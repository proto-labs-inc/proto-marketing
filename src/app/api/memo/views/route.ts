import { z } from "zod";

import { sql } from "@/lib/db";

const requestBody = z.object({
  email: z.email().trim().max(254).transform((value) => value.toLowerCase()),
});

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return Response.json({ error: "Invalid origin." }, { status: 403 });
  }

  const parsed = requestBody.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  try {
    await sql()`INSERT INTO memo_views (email) VALUES (${parsed.data.email})`;
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Memo view could not be saved", error);
    return Response.json({ error: "Could not open the memo. Please try again." }, { status: 500 });
  }
}
