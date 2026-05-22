import type { Metadata } from "next";
import { RegexTesterClient } from "./_components/regex-tester-client";

export const metadata: Metadata = {
  title: "Regex Tester",
  description: "Test regular expressions with real-time matching and capture groups.",
};

export default function RegexTesterPage() {
  return <RegexTesterClient />;
}
