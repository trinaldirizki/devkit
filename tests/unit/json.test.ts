import { describe, it, expect } from "vitest";
import {
  formatJson,
  validateJson,
  minifyJson,
  jsonToTree,
} from "@/lib/tools/json";

describe("formatJson", () => {
  it("formats valid JSON with default indent", () => {
    const result = formatJson('{"a":1,"b":2}');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.formatted).toBe('{\n  "a": 1,\n  "b": 2\n}');
    }
  });

  it("formats with custom indent", () => {
    const result = formatJson('{"a":1}', 4);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.formatted).toContain("    ");
    }
  });

  it("returns error for invalid JSON", () => {
    const result = formatJson("{invalid}");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeTruthy();
    }
  });

  it("computes size correctly", () => {
    const result = formatJson('{"key":"value"}');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.size).toBeGreaterThan(0);
      expect(result.minifiedSize).toBeGreaterThan(0);
      expect(result.minifiedSize).toBeLessThanOrEqual(result.size);
    }
  });
});

describe("validateJson", () => {
  it("returns true for valid JSON", () => {
    expect(validateJson("{}")).toBe(true);
    expect(validateJson("[]")).toBe(true);
    expect(validateJson('"hello"')).toBe(true);
    expect(validateJson("123")).toBe(true);
    expect(validateJson("null")).toBe(true);
  });

  it("returns false for invalid JSON", () => {
    expect(validateJson("")).toBe(false);
    expect(validateJson("{foo}")).toBe(false);
    expect(validateJson("undefined")).toBe(false);
  });
});

describe("minifyJson", () => {
  it("removes whitespace", () => {
    const input = '{\n  "a": 1,\n  "b": 2\n}';
    expect(minifyJson(input)).toBe('{"a":1,"b":2}');
  });
});

describe("jsonToTree", () => {
  it("builds tree for object", () => {
    const tree = jsonToTree({ a: 1, b: [2, 3] });
    expect(tree.type).toBe("object");
    expect(tree.children).toHaveLength(2);
    expect(tree.children![1].type).toBe("array");
    expect(tree.children![1].children).toHaveLength(2);
  });

  it("handles null", () => {
    const tree = jsonToTree(null);
    expect(tree.type).toBe("null");
  });

  it("handles primitives", () => {
    expect(jsonToTree("hello").type).toBe("string");
    expect(jsonToTree(42).type).toBe("number");
    expect(jsonToTree(true).type).toBe("boolean");
  });
});
