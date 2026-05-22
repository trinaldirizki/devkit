import {
  Braces,
  KeyRound,
  Binary,
  FileDiff,
  FileJson2,
  Regex,
  Fingerprint,
  Hash,
  Link,
  Clock,
  type LucideIcon,
} from "lucide-react";

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  slug: string;
  icon: LucideIcon;
  category: ToolCategory;
  keywords: string[];
}

export type ToolCategory =
  | "format"
  | "encode"
  | "compare"
  | "generate"
  | "parse";

export const categories: Record<ToolCategory, string> = {
  format: "Format & Validate",
  encode: "Encode & Decode",
  compare: "Compare",
  generate: "Generate",
  parse: "Parse & Test",
};

export const tools: ToolDefinition[] = [
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "Format, validate, and minify JSON with syntax highlighting.",
    slug: "json-formatter",
    icon: Braces,
    category: "format",
    keywords: ["json", "format", "validate", "minify", "pretty", "beautify"],
  },
  {
    id: "jwt-debugger",
    name: "JWT Debugger",
    description: "Decode and inspect JWT tokens. View header, payload, and verify signatures.",
    slug: "jwt-debugger",
    icon: KeyRound,
    category: "parse",
    keywords: ["jwt", "token", "decode", "header", "payload", "signature"],
  },
  {
    id: "base64",
    name: "Base64 Encoder/Decoder",
    description: "Encode text to Base64 or decode Base64 back to text.",
    slug: "base64",
    icon: Binary,
    category: "encode",
    keywords: ["base64", "encode", "decode", "binary", "text"],
  },
  {
    id: "text-diff",
    name: "Text Diff",
    description: "Compare two blocks of text and see differences highlighted.",
    slug: "text-diff",
    icon: FileDiff,
    category: "compare",
    keywords: ["diff", "compare", "text", "difference", "merge"],
  },
  {
    id: "json-diff",
    name: "JSON Diff",
    description: "Compare two JSON objects and visualize structural differences.",
    slug: "json-diff",
    icon: FileJson2,
    category: "compare",
    keywords: ["json", "diff", "compare", "object", "structure"],
  },
  {
    id: "regex-tester",
    name: "Regex Tester",
    description: "Test regular expressions with real-time matching and capture groups.",
    slug: "regex-tester",
    icon: Regex,
    category: "parse",
    keywords: ["regex", "regular expression", "match", "test", "pattern"],
  },
  {
    id: "uuid-generator",
    name: "UUID Generator",
    description: "Generate UUIDs (v4) individually or in bulk with copy support.",
    slug: "uuid-generator",
    icon: Fingerprint,
    category: "generate",
    keywords: ["uuid", "guid", "generate", "unique", "identifier"],
  },
  {
    id: "hash-generator",
    name: "Hash Generator",
    description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text.",
    slug: "hash-generator",
    icon: Hash,
    category: "generate",
    keywords: ["hash", "md5", "sha", "sha256", "sha512", "checksum"],
  },
  {
    id: "url-encoder",
    name: "URL Encoder/Decoder",
    description: "Encode or decode URL components and full URLs.",
    slug: "url-encoder",
    icon: Link,
    category: "encode",
    keywords: ["url", "encode", "decode", "uri", "percent", "query"],
  },
  {
    id: "cron-parser",
    name: "Cron Parser",
    description: "Parse cron expressions and see the next scheduled run times.",
    slug: "cron-parser",
    icon: Clock,
    category: "parse",
    keywords: ["cron", "schedule", "crontab", "time", "job"],
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return tools.filter((t) => t.category === category);
}

export function searchTools(query: string): ToolDefinition[] {
  const q = query.toLowerCase().trim();
  if (!q) return tools;
  return tools.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.includes(q)),
  );
}
