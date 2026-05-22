export interface JwtHeader {
  alg: string;
  typ?: string;
  kid?: string;
  [key: string]: unknown;
}

export interface JwtPayload {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  [key: string]: unknown;
}

export interface JwtDecoded {
  header: JwtHeader;
  payload: JwtPayload;
  signature: string;
  isExpired: boolean;
  expiresAt: Date | null;
  issuedAt: Date | null;
}

export interface JwtError {
  success: false;
  error: string;
}

export type JwtResult = ({ success: true } & JwtDecoded) | JwtError;

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  if (pad) base64 += "=".repeat(4 - pad);
  return atob(base64);
}

export function decodeJwt(token: string): JwtResult {
  const trimmed = token.trim();
  const parts = trimmed.split(".");
  if (parts.length !== 3) {
    return { success: false, error: "Invalid JWT: expected 3 parts separated by dots." };
  }

  try {
    const header = JSON.parse(base64UrlDecode(parts[0])) as JwtHeader;
    const payload = JSON.parse(base64UrlDecode(parts[1])) as JwtPayload;
    const signature = parts[2];

    const expiresAt = payload.exp ? new Date(payload.exp * 1000) : null;
    const issuedAt = payload.iat ? new Date(payload.iat * 1000) : null;
    const isExpired = expiresAt ? expiresAt.getTime() < Date.now() : false;

    return {
      success: true,
      header,
      payload,
      signature,
      isExpired,
      expiresAt,
      issuedAt,
    };
  } catch {
    return { success: false, error: "Failed to decode JWT. Ensure it is properly Base64URL encoded." };
  }
}

export function isJwt(value: string): boolean {
  return /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*$/.test(
    value.trim(),
  );
}

export const jwtExamples = {
  basic:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
};
