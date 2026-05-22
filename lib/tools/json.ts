export interface JsonFormatResult {
  success: true;
  formatted: string;
  minified: string;
  size: number;
  minifiedSize: number;
}

export interface JsonErrorResult {
  success: false;
  error: string;
  line?: number;
  column?: number;
}

export type JsonResult = JsonFormatResult | JsonErrorResult;

export function formatJson(input: string, indent = 2): JsonResult {
  try {
    const parsed = JSON.parse(input);
    const formatted = JSON.stringify(parsed, null, indent);
    const minified = JSON.stringify(parsed);
    return {
      success: true,
      formatted,
      minified,
      size: new Blob([formatted]).size,
      minifiedSize: new Blob([minified]).size,
    };
  } catch (e) {
    const msg = e instanceof SyntaxError ? e.message : "Invalid JSON";
    const posMatch = msg.match(/position\s+(\d+)/i);
    let line: number | undefined;
    let column: number | undefined;
    if (posMatch) {
      const pos = Number(posMatch[1]);
      const before = input.slice(0, pos);
      line = (before.match(/\n/g)?.length ?? 0) + 1;
      column = pos - before.lastIndexOf("\n");
    }
    return { success: false, error: msg, line, column };
  }
}

export function validateJson(input: string): boolean {
  try {
    JSON.parse(input);
    return true;
  } catch {
    return false;
  }
}

export function minifyJson(input: string): string {
  return JSON.stringify(JSON.parse(input));
}

export interface TreeNode {
  key: string;
  value: unknown;
  type: "object" | "array" | "string" | "number" | "boolean" | "null";
  children?: TreeNode[];
}

export function jsonToTree(value: unknown, key = "root"): TreeNode {
  if (value === null) return { key, value, type: "null" };
  if (Array.isArray(value)) {
    return {
      key,
      value,
      type: "array",
      children: value.map((item, i) => jsonToTree(item, String(i))),
    };
  }
  if (typeof value === "object") {
    return {
      key,
      value,
      type: "object",
      children: Object.entries(value as Record<string, unknown>).map(
        ([k, v]) => jsonToTree(v, k),
      ),
    };
  }
  return { key, value, type: typeof value as TreeNode["type"] };
}

export const jsonExamples = {
  simple: `{
  "name": "DevTools Hub",
  "version": "1.0.0",
  "tools": 10,
  "free": true
}`,
  nested: `{
  "users": [
    {
      "id": 1,
      "name": "Alice",
      "roles": ["admin", "editor"],
      "settings": {
        "theme": "dark",
        "notifications": true
      }
    }
  ]
}`,
};
