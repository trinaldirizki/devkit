import type { Metadata } from "next";
import { Base64Client } from "./_components/base64-client";

export const metadata: Metadata = {
  title: "Base64 Encoder/Decoder",
  description: "Encode text to Base64 or decode Base64 back to text.",
};

export default function Base64Page() {
  return <Base64Client />;
}
