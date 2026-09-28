import { createHash, timingSafeEqual } from "node:crypto";
import { del, get, put } from "@vercel/blob";

// Saved budget edits for /money. The body is an AES-GCM envelope encrypted in
// the browser under the ledger passphrase, so this route stores and returns
// ciphertext only. Writes need the passphrase-derived key; the server holds a
// SHA-256 of that key (MONEY_WRITE_HASH) and nothing that can decrypt.

const PATHNAME = "money/budget-overrides.enc.json";
const MAX_BYTES = 32_000;
const NO_STORE = { "Cache-Control": "no-store" };

function authorised(req: Request): boolean {
  const expected = process.env.MONEY_WRITE_HASH;
  const token = req.headers.get("x-money-key");
  if (!expected || !token) return false;
  const got = createHash("sha256").update(token).digest();
  const want = Buffer.from(expected, "hex");
  return got.length === want.length && timingSafeEqual(got, want);
}

function isEnvelope(v: unknown): boolean {
  if (!v || typeof v !== "object") return false;
  const e = v as Record<string, unknown>;
  return ["salt", "iv", "ct", "kdf", "cipher"].every((k) => typeof e[k] === "string") && typeof e.iterations === "number";
}

export async function GET() {
  const res = await get(PATHNAME, { access: "private", useCache: false });
  if (!res || res.statusCode !== 200) return new Response(null, { status: 204, headers: NO_STORE });
  return new Response(res.stream, { headers: { ...NO_STORE, "Content-Type": "application/json" } });
}

export async function PUT(req: Request) {
  if (!authorised(req)) return Response.json({ error: "unauthorised" }, { status: 401, headers: NO_STORE });
  const text = await req.text();
  if (text.length > MAX_BYTES) return Response.json({ error: "too large" }, { status: 413, headers: NO_STORE });

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: "not JSON" }, { status: 400, headers: NO_STORE });
  }
  if (!isEnvelope(body)) return Response.json({ error: "not an envelope" }, { status: 400, headers: NO_STORE });

  await put(PATHNAME, text, {
    access: "private",
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
  return new Response(null, { status: 204, headers: NO_STORE });
}

export async function DELETE(req: Request) {
  if (!authorised(req)) return Response.json({ error: "unauthorised" }, { status: 401, headers: NO_STORE });
  await del(PATHNAME);
  return new Response(null, { status: 204, headers: NO_STORE });
}
