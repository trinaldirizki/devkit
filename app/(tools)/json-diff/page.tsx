import type { Metadata } from "next";
import { JsonDiffClient } from "./_components/json-diff-client";

export const metadata: Metadata = {
  title: "JSON Diff",
  description: "Compare two JSON objects and visualize structural differences.",
};

export default function JsonDiffPage() {
  return <JsonDiffClient />;
}
