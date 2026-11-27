import order from "@/_proto/alternate-order.json";

// Imported alternates keep their identities and dates. Their source's display
// order is separate metadata, available only to the local Proto Frame.
export function GET() {
  if (process.env.NODE_ENV !== "development") {
    return new Response(null, { status: 404 });
  }
  return Response.json(order, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    },
  });
}
