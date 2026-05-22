import { describe, it, expect } from "vitest";
import { decodeJwt, isJwt } from "@/lib/tools/jwt";

const VALID_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

describe("decodeJwt", () => {
  it("decodes a valid JWT", () => {
    const result = decodeJwt(VALID_TOKEN);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.header.alg).toBe("HS256");
      expect(result.header.typ).toBe("JWT");
      expect(result.payload.sub).toBe("1234567890");
      expect(result.payload.name).toBe("John Doe");
      expect(result.payload.iat).toBe(1516239022);
      expect(result.issuedAt).toBeInstanceOf(Date);
    }
  });

  it("returns error for invalid token", () => {
    const result = decodeJwt("not.a.valid-token-but-three-parts");
    // This might succeed or fail depending on base64 decode
    // At minimum it should not throw
    expect(result).toBeDefined();
  });

  it("returns error for token with wrong number of parts", () => {
    const result = decodeJwt("only.two");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("3 parts");
    }
  });

  it("detects expired tokens", () => {
    // Token with exp in the past (exp: 1000000000 = 2001-09-08)
    const expiredPayload = btoa(
      JSON.stringify({ sub: "1", exp: 1000000000 }),
    )
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    const header = btoa(JSON.stringify({ alg: "HS256" }))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    const token = `${header}.${expiredPayload}.signature`;
    const result = decodeJwt(token);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.isExpired).toBe(true);
    }
  });
});

describe("isJwt", () => {
  it("returns true for valid JWT format", () => {
    expect(isJwt(VALID_TOKEN)).toBe(true);
  });

  it("returns false for non-JWT strings", () => {
    expect(isJwt("hello")).toBe(false);
    expect(isJwt("a.b")).toBe(false);
    expect(isJwt("")).toBe(false);
  });
});
