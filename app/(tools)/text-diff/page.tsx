import type { Metadata } from "next";
import { TextDiffClient } from "./_components/text-diff-client";

export const metadata: Metadata = {
  title: "Text Diff",
  description: "Compare two blocks of text and see differences highlighted.",
};

export default function TextDiffPage() {
  return <TextDiffClient />;
}
