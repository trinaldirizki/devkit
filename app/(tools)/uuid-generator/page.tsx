import type { Metadata } from "next";
import { UuidGeneratorClient } from "./_components/uuid-generator-client";

export const metadata: Metadata = {
  title: "UUID Generator",
  description: "Generate UUIDs (v4) individually or in bulk with copy support.",
};

export default function UuidGeneratorPage() {
  return <UuidGeneratorClient />;
}
