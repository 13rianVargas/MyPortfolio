import type { APIRoute } from "astro";
import { CONTACT_EMAIL } from "astro:env/server";

// Runs on demand as a Vercel function. Everything else in the site stays
// prerendered.
export const prerender = false;

/**
 * FormSubmit, called from our own function instead of from the browser.
 *
 * The original code posted here straight from client JS with the destination
 * address hardcoded in the bundle, so anyone could read it off the page.
 * Routing through this endpoint keeps the address in a server-side env var and
 * lets us validate and throttle before anything leaves the box.
 *
 * Web3Forms was evaluated as an alternative and rejected: its free tier
 * answers server-side calls with 403 "Pro plan is required". FormSubmit
 * accepts them, so the provider that already worked stays.
 */
const FORMSUBMIT_ENDPOINT = "https://formsubmit.co/ajax";

const LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  message: { min: 10, max: 500 },
} as const;

// Deliberately permissive: the only claim worth making here is "looks like an
// address". Real validation is the reply landing.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Best-effort per-IP throttle.
 *
 * Serverless instances are ephemeral and horizontally scaled, so this map is
 * NOT a hard guarantee — a distributed attacker hitting cold instances slips
 * through. It blunts trivial floods from a single source. The structural win
 * is that the destination address never reaches the browser, so there is
 * nothing to scrape and replay straight at FormSubmit.
 */
const RATE_LIMIT = { windowMs: 60_000, max: 3 };
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT.windowMs,
  );
  recent.push(now);
  hits.set(ip, recent);

  // Opportunistic cleanup so the map cannot grow unbounded on a warm instance.
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_LIMIT.windowMs)) hits.delete(key);
    }
  }

  return recent.length > RATE_LIMIT.max;
}

function json(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const destination = CONTACT_EMAIL;

  if (!destination) {
    console.error("[contact] CONTACT_EMAIL is not set");
    return json({ ok: false, reason: "server" }, 500);
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, reason: "invalid" }, 400);
  }

  // Honeypot: a real person never fills a field they cannot see.
  // Answer 200 so bots get no signal that they were caught.
  if (typeof payload.botcheck === "string" && payload.botcheck.trim() !== "") {
    return json({ ok: true }, 200);
  }

  const name = String(payload.name ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const message = String(payload.message ?? "").trim();

  if (!name || !email || !message) {
    return json({ ok: false, reason: "required" }, 400);
  }

  // Shape before size: "nope" is 4 characters, so a length-first check
  // reported it as "message too short" instead of "invalid email".
  if (!EMAIL_RE.test(email) || email.length > LIMITS.email.max) {
    return json({ ok: false, reason: "email" }, 400);
  }

  if (
    name.length < LIMITS.name.min ||
    name.length > LIMITS.name.max ||
    message.length < LIMITS.message.min ||
    message.length > LIMITS.message.max
  ) {
    return json({ ok: false, reason: "invalid" }, 400);
  }

  if (isRateLimited(clientAddress ?? "unknown")) {
    return json({ ok: false, reason: "rate" }, 429);
  }

  try {
    const upstream = await fetch(
      `${FORMSUBMIT_ENDPOINT}/${encodeURIComponent(destination)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `Portfolio — nuevo mensaje de ${name}`,
          _template: "table",
          // Safe to disable here: the honeypot, the field validation above and
          // the per-IP throttle already gate this, and a visible captcha would
          // only tax the recruiter who actually wants to write.
          _captcha: "false",
        }),
      },
    );

    if (!upstream.ok) {
      console.error("[contact] upstream responded", upstream.status);
      return json({ ok: false, reason: "upstream" }, 502);
    }

    return json({ ok: true }, 200);
  } catch (error) {
    console.error("[contact] upstream request failed", error);
    return json({ ok: false, reason: "upstream" }, 502);
  }
};

// Anything other than POST is a mistake worth stating plainly.
export const ALL: APIRoute = () => json({ ok: false, reason: "method" }, 405);
