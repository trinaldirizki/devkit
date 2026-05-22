import type { Metadata } from "next";
import { UrlEncoderClient } from "./_components/url-encoder-client";

export const metadata: Metadata = {
  title: "URL Encoder/Decoder",
  description: "Encode or decode URL components and full URLs.",
};

export default function UrlEncoderPage() {
  return <UrlEncoderClient />;
}
