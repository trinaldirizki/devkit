export interface Base64Result {
  success: true;
  output: string;
  inputSize: number;
  outputSize: number;
}

export interface Base64Error {
  success: false;
  error: string;
}

export type Base64EncodeResult = Base64Result | Base64Error;

export function encodeBase64(input: string): Base64EncodeResult {
  try {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(input);
    const binary = Array.from(bytes)
      .map((b) => String.fromCharCode(b))
      .join("");
    const output = btoa(binary);
    return {
      success: true,
      output,
      inputSize: bytes.length,
      outputSize: output.length,
    };
  } catch {
    return { success: false, error: "Failed to encode input to Base64." };
  }
}

export function decodeBase64(input: string): Base64EncodeResult {
  try {
    const trimmed = input.replace(/\s/g, "");
    const binary = atob(trimmed);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const output = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return {
      success: true,
      output,
      inputSize: trimmed.length,
      outputSize: bytes.length,
    };
  } catch {
    return { success: false, error: "Invalid Base64 string." };
  }
}

export function isBase64(value: string): boolean {
  const trimmed = value.replace(/\s/g, "");
  if (trimmed.length === 0) return false;
  return /^[A-Za-z0-9+/]*={0,2}$/.test(trimmed) && trimmed.length % 4 === 0;
}

export const base64Examples = {
  encode: "Hello, World! This is a Base64 encoding test.",
  decode: "SGVsbG8sIFdvcmxkISBUaGlzIGlzIGEgQmFzZTY0IGVuY29kaW5nIHRlc3Qu",
};
