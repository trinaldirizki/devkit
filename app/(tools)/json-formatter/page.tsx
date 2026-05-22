import type { Metadata } from "next";
import { JsonFormatterClient } from "./_components/json-formatter-client";

export const metadata: Metadata = {
  title: "JSON Formatter",
  description:
    "Format, validate, and minify JSON with syntax highlighting and tree view.",
};

export default function JsonFormatterPage() {
  return <JsonFormatterClient />;
}
