export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return origin === new URL(request.url).origin;
}

export function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

export async function readCommand(request: Request) {
  const text = await request.text();
  if (text.length > 2048) throw new Error("Verzoek te groot.");
  return JSON.parse(text) as { id?: string; action?: string; answer?: unknown };
}
