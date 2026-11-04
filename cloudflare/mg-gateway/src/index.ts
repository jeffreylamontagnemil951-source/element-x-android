export interface Env {
  DB: D1Database;
  OWNER_KEY_SHA256: string;
  CORS_ORIGIN: string;
}

type Role = "owner" | "admin" | "support" | "bot";
type Principal = { id: string; role: Role; scopes: string[] };

const json = (data: unknown, status = 200, headers: HeadersInit = {}) => {
  const responseHeaders = new Headers(headers);
  responseHeaders.set("content-type", "application/json; charset=utf-8");
  responseHeaders.set("cache-control", "no-store");
  responseHeaders.set("x-content-type-options", "nosniff");
  return new Response(JSON.stringify(data), { status, headers: responseHeaders });
};

const hex = (bytes: ArrayBuffer) =>
  Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, "0")).join("");

async function sha256(value: string): Promise<string> {
  return hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function cors(request: Request, env: Env): Headers {
  const headers = new Headers({
    "access-control-allow-methods": "GET, POST, PATCH, OPTIONS",
    "access-control-allow-headers": "authorization, content-type",
    "vary": "Origin",
  });
  const origin = request.headers.get("Origin");
  if (origin && origin === env.CORS_ORIGIN) headers.set("access-control-allow-origin", origin);
  return headers;
}

async function authenticate(request: Request, env: Env): Promise<Principal | null> {
  const match = /^Bearer\s+(.+)$/i.exec(request.headers.get("Authorization") ?? "");
  if (!match) return null;
  const token = match[1].trim();
  if (!token || token.length > 512) return null;

  const digest = await sha256(token);
  if (env.OWNER_KEY_SHA256 && safeEqual(digest, env.OWNER_KEY_SHA256.toLowerCase())) {
    return { id: "owner-bootstrap", role: "owner", scopes: ["*"] };
  }

  const row = await env.DB.prepare(
    "SELECT id, role, scopes_json FROM api_tokens WHERE token_hash = ? AND revoked_at IS NULL AND (expires_at IS NULL OR expires_at > datetime('now'))"
  ).bind(digest).first<{ id: string; role: Role; scopes_json: string }>();

  if (!row) return null;
  let scopes: string[] = [];
  try { scopes = JSON.parse(row.scopes_json) as string[]; } catch { return null; }
  return { id: row.id, role: row.role, scopes };
}

function allows(principal: Principal, roles: Role[]): boolean {
  return principal.role === "owner" || roles.includes(principal.role);
}

async function audit(env: Env, actor: Principal, action: string, target: string): Promise<void> {
  await env.DB.prepare(
    "INSERT INTO audit_log (actor_id, actor_role, action, target, created_at) VALUES (?, ?, ?, ?, datetime('now'))"
  ).bind(actor.id, actor.role, action, target).run();
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const headers = cors(request, env);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });

    const url = new URL(request.url);
    if (url.pathname === "/health" && request.method === "GET") {
      try {
        await env.DB.prepare("SELECT 1").first();
        return json({ ok: true, service: "mg-api-gateway", database: "connected" }, 200, headers);
      } catch {
        return json({ ok: false, service: "mg-api-gateway", database: "unavailable" }, 503, headers);
      }
    }

    if (url.pathname === "/v1/support/volunteers" && request.method === "GET") {
      try {
        const result = await env.DB.prepare(
          "SELECT id, display_name, matrix_user_id, room_id, support_hours FROM support_volunteers WHERE active = 1 AND verified = 1 ORDER BY display_order ASC, display_name ASC"
        ).all();
        return json({ volunteers: result.results.map((row: Record<string, unknown>) => ({
          ...row, official_badge: true,
        })) }, 200, headers);
      } catch {
        return json({ error: "service_unavailable" }, 503, headers);
      }
    }

    if (!url.pathname.startsWith("/v1/admin/")) return json({ error: "not_found" }, 404, headers);

    const principal = await authenticate(request, env);
    if (!principal) return json({ error: "unauthorized" }, 401, headers);

    if (url.pathname === "/v1/admin/volunteers" && request.method === "GET") {
      if (!allows(principal, ["admin"])) return json({ error: "forbidden" }, 403, headers);
      const result = await env.DB.prepare(
        "SELECT id, display_name, matrix_user_id, room_id, active, verified, support_hours FROM support_volunteers ORDER BY created_at DESC"
      ).all();
      return json({ volunteers: result.results }, 200, headers);
    }

    if (url.pathname === "/v1/admin/volunteers" && request.method === "POST") {
      if (principal.role !== "owner") return json({ error: "owner_only" }, 403, headers);
      let body: Record<string, unknown>;
      try { body = await request.json() as Record<string, unknown>; } catch { return json({ error: "invalid_json" }, 400, headers); }
      const displayName = typeof body.display_name === "string" ? body.display_name.trim() : "";
      const matrixUserId = typeof body.matrix_user_id === "string" ? body.matrix_user_id.trim() : "";
      const roomId = typeof body.room_id === "string" ? body.room_id.trim() : "";
      const supportHours = typeof body.support_hours === "string" ? body.support_hours.trim().slice(0, 120) : "";
      const verified = body.verified === true ? 1 : 0;
      if (!displayName || displayName.length > 60 || !/^@[^:\s]+:[^\s]+$/.test(matrixUserId) || (roomId && !/^![^:\s]+:[^\s]+$/.test(roomId))) {
        return json({ error: "invalid_volunteer_fields" }, 400, headers);
      }
      const id = crypto.randomUUID();
      await env.DB.prepare(
        "INSERT INTO support_volunteers (id, display_name, matrix_user_id, room_id, support_hours, active, verified, display_order, created_at) VALUES (?, ?, ?, ?, ?, 1, ?, 0, datetime('now'))"
      ).bind(id, displayName, matrixUserId, roomId || null, supportHours, verified).run();
      await audit(env, principal, "support.volunteer.create", id);
      return json({ id, created: true, verified: verified === 1 }, 201, headers);
    }

    if (url.pathname === "/v1/admin/audit" && request.method === "GET") {
      if (principal.role !== "owner") return json({ error: "owner_only" }, 403, headers);
      const result = await env.DB.prepare(
        "SELECT id, actor_id, actor_role, action, target, created_at FROM audit_log ORDER BY id DESC LIMIT 100"
      ).all();
      return json({ events: result.results }, 200, headers);
    }

    return json({ error: "not_found" }, 404, headers);
  },
} satisfies ExportedHandler<Env>;
