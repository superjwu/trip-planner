/**
 * HMAC-SHA256 signing for short-lived flow cookies.
 *
 * Codex device-code flow stores deviceAuthId / userCode / clerkUserId in a
 * cookie between /start and /poll. Without integrity protection, a client
 * could forge that cookie value to bind a different ChatGPT session to their
 * Clerk user, or steal someone else's pending device flow. We HMAC-sign the
 * payload with a server-only key (`OAUTH_COOKIE_SIGNING_KEY`) so the server
 * can detect tampering on read.
 *
 * Cookie format: `<base64url-payload>.<base64url-sig>` where payload is the
 * UTF-8 JSON we'd otherwise have written raw.
 */

const ENC = new TextEncoder();
const DEC = new TextDecoder();

function b64urlEncode(bytes: Uint8Array): string {
  // Browser/Node-compatible base64url
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? 0 : 4 - (s.length % 4);
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(pad);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    ENC.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function getSigningKey(): string {
  const k = process.env.OAUTH_COOKIE_SIGNING_KEY;
  if (!k || k.length < 32) {
    throw new Error(
      "OAUTH_COOKIE_SIGNING_KEY missing or too short (need ≥32 chars). Generate with `openssl rand -hex 32`.",
    );
  }
  return k;
}

/**
 * Constant-time byte comparison so verification can't leak via timing.
 */
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function signCookie<T>(payload: T): Promise<string> {
  const json = JSON.stringify(payload);
  const payloadBytes = ENC.encode(json);
  const key = await importKey(getSigningKey());
  const sigBuf = await crypto.subtle.sign("HMAC", key, payloadBytes as BufferSource);
  const sig = new Uint8Array(sigBuf);
  return `${b64urlEncode(payloadBytes)}.${b64urlEncode(sig)}`;
}

/**
 * Returns the parsed payload if the cookie is well-formed and the signature
 * verifies. Returns `null` for any failure (missing, malformed, bad sig,
 * unparseable JSON).
 */
export async function verifyCookie<T>(cookieValue: string | undefined | null): Promise<T | null> {
  if (!cookieValue) return null;
  const dot = cookieValue.indexOf(".");
  if (dot <= 0 || dot === cookieValue.length - 1) return null;

  let payloadBytes: Uint8Array;
  let givenSig: Uint8Array;
  try {
    payloadBytes = b64urlDecode(cookieValue.slice(0, dot));
    givenSig = b64urlDecode(cookieValue.slice(dot + 1));
  } catch {
    return null;
  }

  let key: CryptoKey;
  try {
    key = await importKey(getSigningKey());
  } catch {
    return null;
  }

  const expectBuf = await crypto.subtle.sign("HMAC", key, payloadBytes as BufferSource);
  const expectSig = new Uint8Array(expectBuf);
  if (!timingSafeEqual(givenSig, expectSig)) return null;

  try {
    return JSON.parse(DEC.decode(payloadBytes)) as T;
  } catch {
    return null;
  }
}
