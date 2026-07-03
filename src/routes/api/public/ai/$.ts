import { createFileRoute } from "@tanstack/react-router";

const UPSTREAM = "https://amd-backend-production-5f23.up.railway.app";

async function proxy(request: Request, params: { _splat?: string }) {
  const path = params._splat ?? "";
  const url = new URL(request.url);
  const target = `${UPSTREAM}/${path}${url.search}`;
  const init: RequestInit = { method: request.method, headers: {} };
  const ct = request.headers.get("content-type");
  if (ct) (init.headers as Record<string, string>)["content-type"] = ct;
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }
  const upstream = await fetch(target, init);
  const body = await upstream.arrayBuffer();
  return new Response(body, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "application/json",
      "cache-control": "no-store",
    },
  });
}

export const Route = createFileRoute("/api/public/ai/$")({
  server: {
    handlers: {
      GET: async ({ request, params }) => proxy(request, params),
      POST: async ({ request, params }) => proxy(request, params),
    },
  },
});
