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

export class CodexAuthExpiredError extends Error {
  constructor() {
    super("ChatGPT auth token expired and refresh failed.");
    this.name = "CodexAuthExpiredError";
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
  if (!json.access_token || !json.refresh_token || typeof json.expires_in !== "number") {
    throw new CodexOAuthError("Token exchange missing fields", "bad_response");
  }
  return {
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
    idToken: json.id_token,
    expiresAt: new Date(Date.now() + json.expires_in * 1000),
  };
}

/**
 * Refresh an expired access token using the stored refresh token.
 */
export async function refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
  const url = `${BASE_URL}/oauth/token`;
  const res = await fetchWithTimeout(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", ...COMMON_HEADERS },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: CLIENT_ID,
      refresh_token: refreshToken,
    }).toString(),
  });
  if (!res.ok) {
    throw new CodexAuthExpiredError();
  }
  const json = (await res.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
  };
  if (!json.access_token || typeof json.expires_in !== "number") {
    throw new CodexAuthExpiredError();
  }
  return {
    accessToken: json.access_token,
    refreshToken: json.refresh_token ?? refreshToken,
    expiresAt: new Date(Date.now() + json.expires_in * 1000),
  };
}

/**
 * Decode the access_token JWT and extract `chatgpt_account_id` from the
 * https://api.openai.com/auth claim block.
 */
export function decodeChatgptAccountId(accessToken: string): string {
  const parts = accessToken.split(".");
  if (parts.length !== 3) throw new CodexOAuthError("Malformed JWT", "bad_jwt");
  // base64url -> base64
  const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(Buffer.from(padded, "base64").toString("utf-8"));
  } catch {
    throw new CodexOAuthError("JWT payload not JSON", "bad_jwt");
  }
  const auth = (payload["https://api.openai.com/auth"] ?? {}) as {
    chatgpt_account_id?: string;
  };
  if (!auth.chatgpt_account_id) {
    throw new CodexOAuthError("JWT missing chatgpt_account_id", "no_account_id");
  }
  return auth.chatgpt_account_id;
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
