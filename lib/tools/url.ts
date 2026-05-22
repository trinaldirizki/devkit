export interface UrlEncodeResult {
  success: true;
  output: string;
}

export interface UrlError {
  success: false;
  error: string;
}

export type UrlResult = UrlEncodeResult | UrlError;

export function encodeUrl(input: string): UrlResult {
  try {
    return { success: true, output: encodeURIComponent(input) };
  } catch {
    return { success: false, error: "Failed to encode URL." };
  }
}

export function decodeUrl(input: string): UrlResult {
  try {
    return { success: true, output: decodeURIComponent(input) };
  } catch {
    return { success: false, error: "Invalid encoded URL string." };
  }
}

export function encodeFullUrl(input: string): UrlResult {
  try {
    return { success: true, output: encodeURI(input) };
  } catch {
    return { success: false, error: "Failed to encode URL." };
  }
}

export function decodeFullUrl(input: string): UrlResult {
  try {
    return { success: true, output: decodeURI(input) };
  } catch {
    return { success: false, error: "Invalid encoded URL." };
  }
}

export interface ParsedUrl {
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  params: [string, string][];
}

export function parseUrl(input: string): ParsedUrl | null {
  try {
    const url = new URL(input);
    return {
      protocol: url.protocol,
      host: url.host,
      hostname: url.hostname,
      port: url.port,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      params: Array.from(url.searchParams.entries()),
    };
  } catch {
    return null;
  }
}

export const urlExamples = {
  encode: "Hello World! foo=bar&baz=qux spaces",
  decode: "Hello%20World%21%20foo%3Dbar%26baz%3Dqux%20spaces",
  fullUrl:
    "https://example.com/search?q=hello world&lang=en&page=1#results",
};
