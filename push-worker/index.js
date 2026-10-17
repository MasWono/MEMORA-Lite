
import { sendPushNotification } from "@mmmike/web-push/send";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://maswono.github.io",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json; charset=utf-8"
};

function response(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders
  });
}

function allowedOrigin(origin) {
  return origin === "https://maswono.github.io";
}

async function hashEndpoint(endpoint) {
  const bytes = new TextEncoder().encode(endpoint);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      if (!allowedOrigin(origin)) {
        return new Response(null, { status: 403 });
      }
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (origin && !allowedOrigin(origin)) {
      return response({ error: "Origin not allowed" }, 403);
    }

    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return response({
        service: "MEMORA Lite Push",
        status: "ready"
      });
    }

    if (
      request.method === "GET" &&
      url.pathname === "/api/vapid-public-key"
    ) {
      if (!env.VAPID_PUBLIC_KEY) {
        return response({ error: "VAPID public key is missing" }, 500);
      }
      return response({ publicKey: env.VAPID_PUBLIC_KEY });
    }

    if (
      request.method === "POST" &&
      url.pathname === "/api/push/subscribe"
    ) {
      let data;
      try {
        data = await request.json();
      } catch {
        return response({ error: "Invalid JSON" }, 400);
      }

      const subscription = data.subscription || data;

      if (
        !subscription.endpoint ||
        !subscription.keys?.p256dh ||
        !subscription.keys?.auth
      ) {
        return response({ error: "Invalid subscription" }, 400);
      }

      const key = "sub:" + await hashEndpoint(subscription.endpoint);

      await env.PUSH_KV.put(key, JSON.stringify(subscription));

      return response({ ok: true, saved: true }, 201);
    }

    if (
      request.method === "POST" &&
      url.pathname === "/api/push/test"
    ) {
      if (
        !env.ADMIN_TOKEN ||
        request.headers.get("Authorization") !==
          `Bearer ${env.ADMIN_TOKEN}`
      ) {
        return response({ error: "Unauthorized" }, 401);
      }

      const privateKey =
        env.VAPID_PRIVATE_KEY || env.VAPID_PRIVATE;

      if (
        !env.VAPID_PUBLIC_KEY ||
        !privateKey ||
        !env.VAPID_SUBJECT
      ) {
        return response({ error: "VAPID configuration incomplete" }, 500);
      }

      let data = {};
      try {
        data = await request.json();
      } catch {
        // Use the default test message.
      }

      const payload = {
        title: data.title || "MEMORA Lite",
        body: data.body || "Ini adalah tes notifikasi MEMORA Lite.",
        url: "/",
        tag: "memora-test"
      };

      const listed = await env.PUSH_KV.list({ prefix: "sub:" });
      let sent = 0;
      let failed = 0;

      for (const item of listed.keys) {
        const raw = await env.PUSH_KV.get(item.name);
        if (!raw) continue;

        try {
          const subscription = JSON.parse(raw);
          const delivered = await sendPushNotification(
            subscription,
            payload,
            {
              publicKey: env.VAPID_PUBLIC_KEY,
              privateKey,
              subject: env.VAPID_SUBJECT
            }
          );

          if (delivered) {
            sent++;
          } else {
            await env.PUSH_KV.delete(item.name);
          }
        } catch {
          failed++;
        }
      }

      return response({
        ok: true,
        sent,
        failed,
        subscriptions: listed.keys.length
      });
    }

    return response({ error: "Not found" }, 404);
  }
};

