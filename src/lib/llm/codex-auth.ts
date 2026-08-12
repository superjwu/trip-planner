/**
 * OpenAI ChatGPT (Codex backend) OAuth helpers.
 *
 * COMPLIANCE NOTE: this app's "Connect ChatGPT" feature uses the same OAuth
 * client_id and protocol that the official Codex CLI uses. Reference projects
 * (`numman-ali/opencode-openai-codex-auth`, `tumf/opencode-openai-device-auth`)
 * implement the same flow for personal CLI tools and explicitly disclaim
 * production / multi-user use. We're knowingly running a multi-tenant version
 * for the Week 5 demo. CODEX_OAUTH_ENABLED=false flips us back to a banner.
 *
 * We use the **device-code** flow (not the authorization-code flow) because
 * our app is hosted, not running on the user's localhost — device code lets
 * the user authenticate at auth.openai.com without us needing a registered
 * redirect_uri on our domain.
 */

const CLIENT_ID = "app_EMoamEEZ73f0CkXaXp7hrann"; // same as Codex CLI; see openai/codex
const BASE_URL = "https://auth.openai.com";
const API_BASE_URL = `${BASE_URL}/api/accounts`;
export const VERIFICATION_URL = `${BASE_URL}/codex/device`;

const FETCH_TIMEOUT_MS = 8000;

const COMMON_HEADERS = {
  "User-Agent": "trip-planner-codex-auth/1.0.0",
};

export interface DeviceCodeResponse {
  deviceAuthId: string;
  userCode: string;
  intervalSeconds: number;
  verificationUrl: string;
}

export interface DeviceTokenSuccess {
  authorizationCode: string;
  codeVerifier: string;
}

export interface OAuthTokens {
  accessToken: string;
  refreshToken: string;
  idToken?: string;
  expiresAt: Date; // absolute time
}

export class CodexOAuthError extends Error {
  constructor(message: string, readonly code: string = "oauth_error") {
    super(message);
    this.name = "CodexOAuthError";
  }
}

export class CodexNotConnectedError extends Error {
  constructor() {
    super("ChatGPT account is not connected for this user.");
    this.name = "CodexNotConnectedError";
  }
}

export type RefreshFailureReason = "expired" | "reused" | "revoked" | "unknown";

/**
 * Permanent refresh failure: the stored refresh token can never work again, so
 * the only cure is a fresh device-code login.
 *
 * Upstream codex separates these from transient failures in
 * `auth/manager.rs::classify_refresh_token_failure`. We used to collapse both
 * into this class, which told the user to reconnect after a one-off 5xx from
 * OpenAI when a plain retry would have worked.
 */
export class CodexAuthExpiredError extends Error {
  constructor(readonly reason: RefreshFailureReason = "unknown") {
    super("ChatGPT auth token expired and refresh failed.");
    this.name = "CodexAuthExpiredError";
  }
}

/**
 * Retryable refresh failure (5xx, timeout, transport error). The stored tokens
 * are still believed good — the caller should surface "try again", not
 * "reconnect", and must NOT delete the row.
 */
export class CodexRefreshTransientError extends Error {
  constructor(detail: string) {
    super(`ChatGPT token refresh failed temporarily: ${detail}`);
    this.name = "CodexRefreshTransientError";
  }
}

export class CodexRateLimitError extends Error {
  constructor() {
    super("ChatGPT rate-limit hit on this account.");
    this.name = "CodexRateLimitError";
  }
}

/**
 * Step 1: ask OpenAI for a one-time user code the human will type at
 * https://auth.openai.com/codex/device. Returns the device_auth_id we need to
 * poll with.
 *
 * Throws CodexOAuthError("device_code_disabled") if the user has not enabled
 * device-code login on their ChatGPT security settings page (404 from OpenAI).
 */
export async function requestDeviceCode(): Promise<DeviceCodeResponse> {
  const url = `${API_BASE_URL}/deviceauth/usercode`;
  const res = await fetchWithTimeout(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", ...COMMON_HEADERS },
    body: JSON.stringify({ client_id: CLIENT_ID }),
  });
  if (res.status === 404) {
    throw new CodexOAuthError(
      "Device-code login isn't enabled on this ChatGPT account. Enable it at https://chatgpt.com/settings/security.",
      "device_code_disabled",
    );
  }
  if (!res.ok) {
    throw new CodexOAuthError(`requestDeviceCode failed: ${res.status} ${await res.text()}`, "request_failed");
  }
  const json = (await res.json()) as {
    device_auth_id?: string;
    user_code?: string;
    usercode?: string;
    interval?: string | number;
  };
  const userCode = json.user_code ?? json.usercode;
  if (!json.device_auth_id || !userCode) {
    throw new CodexOAuthError("Bad device-code response from OpenAI", "bad_response");
  }
  const intervalSeconds =
    typeof json.interval === "string" ? parseInt(json.interval, 10) || 5 : (json.interval ?? 5);
  return {
    deviceAuthId: json.device_auth_id,
    userCode,
    intervalSeconds,
    verificationUrl: VERIFICATION_URL,
  };
}

/**
 * Step 2: ask OpenAI whether the user has entered the code yet.
 * Returns null while still pending; throws on hard failure.
 */
export async function pollDeviceAuth(args: {
  deviceAuthId: string;
  userCode: string;
}): Promise<DeviceTokenSuccess | null> {
  const url = `${API_BASE_URL}/deviceauth/token`;
  const res = await fetchWithTimeout(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", ...COMMON_HEADERS },
    body: JSON.stringify({
      device_auth_id: args.deviceAuthId,
      user_code: args.userCode,
    }),
  });
  // 403 / 404 = still pending per OpenAI's device-code semantics
  if (res.status === 403 || res.status === 404) return null;
  if (!res.ok) {
    throw new CodexOAuthError(`pollDeviceAuth failed: ${res.status} ${await res.text()}`, "poll_failed");
  }
  const json = (await res.json()) as {
    authorization_code?: string;
    code_verifier?: string;
  };
  if (!json.authorization_code || !json.code_verifier) {
    throw new CodexOAuthError("Device auth complete but missing code/verifier", "bad_response");
  }
  return {
    authorizationCode: json.authorization_code,
    codeVerifier: json.code_verifier,
  };
}

/**
 * Step 3: exchange the authorization_code for access + refresh tokens.
 */
export async function exchangeAuthorizationCode(args: {
  authorizationCode: string;
  codeVerifier: string;
}): Promise<OAuthTokens> {
  const url = `${BASE_URL}/oauth/token`;
  const redirectUri = `${BASE_URL}/deviceauth/callback`; // device-code-flow's static redirect
  const res = await fetchWithTimeout(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", ...COMMON_HEADERS },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      code: args.authorizationCode,
      code_verifier: args.codeVerifier,
      redirect_uri: redirectUri,
    }).toString(),
  });
  if (!res.ok) {
    throw new CodexOAuthError(`exchangeAuthorizationCode failed: ${res.status} ${await res.text()}`, "exchange_failed");
  }
  const json = (await res.json()) as {
    access_token?: string;
    refresh_token?: string;
    id_token?: string;
    expires_in?: number;
  };
  // `expires_in` is NOT part of the contract — upstream codex's TokenResponse
  // deserializes only id_token/access_token/refresh_token and derives lifetime
  // from the JWT. Hard-requiring it here made us one response-shape change away
  // from failing every login.
  if (!json.access_token || !json.refresh_token) {
    throw new CodexOAuthError("Token exchange missing access/refresh token", "bad_response");
  }
  return {
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
    idToken: json.id_token,
    expiresAt: resolveAccessTokenExpiry(json.expires_in, json.access_token),
  };
}

/**
 * Refresh an expired access token using the stored refresh token.
 */
export async function refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
  const url = `${BASE_URL}/oauth/token`;
  let res: Response;
  try {
    res = await fetchWithTimeout(url, {
      method: "POST",
      // Upstream codex posts the refresh grant as JSON
      // (`auth/manager.rs::request_chatgpt_token_refresh`). The
      // authorization_code exchange above stays form-encoded, matching
      // `server.rs::exchange_code_for_tokens`.
      headers: { "Content-Type": "application/json", Accept: "application/json", ...COMMON_HEADERS },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });
  } catch (e) {
    // Timeout / DNS / connection reset — the refresh token is untouched.
    throw new CodexRefreshTransientError((e as Error).message);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const reason = classifyRefreshFailure(body);
    // 401 or a recognised permanent code => the token is dead for good.
    // Anything else (5xx, 429, unknown) is worth retrying.
    if (res.status === 401 || reason !== "unknown") {
      throw new CodexAuthExpiredError(reason);
    }
    throw new CodexRefreshTransientError(`${res.status} ${body.slice(0, 200)}`);
  }

  const json = (await res.json()) as {
    access_token?: string;
    refresh_token?: string;
    id_token?: string;
    expires_in?: number;
  };
  if (!json.access_token) {
    throw new CodexAuthExpiredError("unknown");
  }
  return {
    accessToken: json.access_token,
    // OpenAI invalidates a refresh token on use, so keep the new one when it
    // ships and only fall back to the old one if the response omits it.
    refreshToken: json.refresh_token ?? refreshToken,
    idToken: json.id_token,
    expiresAt: resolveAccessTokenExpiry(json.expires_in, json.access_token),
  };
}

/**
 * Map an OAuth error body onto a permanent-failure reason, mirroring
 * upstream's `classify_refresh_token_failure`. "unknown" means "not provably
 * permanent" — treat as transient.
 */
function classifyRefreshFailure(body: string): RefreshFailureReason {
  if (!body.trim()) return "unknown";
  let code: string | undefined;
  try {
    const parsed = JSON.parse(body) as { error?: unknown; code?: unknown };
    if (typeof parsed.error === "string") code = parsed.error;
    else if (parsed.error && typeof parsed.error === "object") {
      code = (parsed.error as { code?: string }).code;
    }
    if (!code && typeof parsed.code === "string") code = parsed.code;
  } catch {
    return "unknown";
  }
  switch (code?.toLowerCase()) {
    case "refresh_token_expired":
      return "expired";
    case "refresh_token_reused":
      return "reused";
    case "refresh_token_invalidated":
      return "revoked";
    default:
      return "unknown";
  }
}

/** Decode a JWT's payload segment. Returns null rather than throwing. */
function decodeJwtPayload(jwt: string): Record<string, unknown> | null {
  const parts = jwt.split(".");
  if (parts.length !== 3 || !parts[1]) return null;
  // base64url -> base64
  const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  try {
    return JSON.parse(Buffer.from(padded, "base64").toString("utf-8"));
  } catch {
    return null;
  }
}

/**
 * Absolute expiry from a JWT's standard `exp` claim (seconds since epoch).
 * This is how upstream codex derives token lifetime — see
 * `token_data.rs::parse_jwt_expiration`. Its token responses don't carry
 * `expires_in` at all.
 */
export function jwtExpiresAt(jwt: string): Date | null {
  const payload = decodeJwtPayload(jwt);
  const exp = payload?.["exp"];
  if (typeof exp !== "number" || !Number.isFinite(exp)) return null;
  return new Date(exp * 1000);
}

/**
 * Pick an absolute expiry for an access token, in order of trust:
 *   1. `expires_in` from the token response, when present
 *   2. the access token's own `exp` claim
 *   3. a deliberately short fallback
 *
 * The fallback is short on purpose: guessing *too soon* costs one extra
 * refresh round-trip, guessing too late hands the Codex backend a dead token
 * and surfaces as a spurious 401.
 */
const FALLBACK_ACCESS_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export function resolveAccessTokenExpiry(
  expiresIn: unknown,
  accessToken: string,
): Date {
  if (typeof expiresIn === "number" && Number.isFinite(expiresIn) && expiresIn > 0) {
    return new Date(Date.now() + expiresIn * 1000);
  }
  const fromJwt = jwtExpiresAt(accessToken);
  if (fromJwt && fromJwt.getTime() > Date.now()) return fromJwt;
  return new Date(Date.now() + FALLBACK_ACCESS_TOKEN_TTL_MS);
}

/**
 * Extract `chatgpt_account_id` from the `https://api.openai.com/auth` claim
 * block of a JWT. Returns null when absent.
 */
function readChatgptAccountId(jwt: string): string | null {
  const payload = decodeJwtPayload(jwt);
  if (!payload) return null;
  const auth = (payload["https://api.openai.com/auth"] ?? {}) as {
    chatgpt_account_id?: string;
  };
  return auth.chatgpt_account_id ?? null;
}

/**
 * Resolve the account id required by the `chatgpt-account-id` request header.
 *
 * Upstream codex reads this from the **id_token**
 * (`server.rs` -> `parse_chatgpt_jwt_claims(&id_token)`), not the access
 * token, and treats it as optional. We prefer the id_token for that reason and
 * fall back to the access token, which is where we used to look exclusively.
 */
export function resolveChatgptAccountId(tokens: {
  idToken?: string;
  accessToken: string;
}): string {
  const fromId = tokens.idToken ? readChatgptAccountId(tokens.idToken) : null;
  const accountId = fromId ?? readChatgptAccountId(tokens.accessToken);
  if (!accountId) {
    throw new CodexOAuthError(
      "Neither the id_token nor the access_token carried chatgpt_account_id.",
      "no_account_id",
    );
  }
  return accountId;
}

/** @deprecated Prefer {@link resolveChatgptAccountId}, which checks id_token first. */
export function decodeChatgptAccountId(accessToken: string): string {
  return resolveChatgptAccountId({ accessToken });
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  return fetch(url, { ...init, signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
}

/**
 * Master kill switch. When CODEX_OAUTH_ENABLED is anything other than "1", the
 * Connect/poll/disconnect routes return 503 and the planner UI shows a banner.
 */
export function isCodexOAuthEnabled(): boolean {
  return process.env.CODEX_OAUTH_ENABLED === "1";
}
