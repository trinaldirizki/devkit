import type { Metadata } from "next";
import { HashGeneratorClient } from "./_components/hash-generator-client";

export const metadata: Metadata = {
  title: "Hash Generator",
  description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text.",
};

export default function HashGeneratorPage() {
  return <HashGeneratorClient />;
}
