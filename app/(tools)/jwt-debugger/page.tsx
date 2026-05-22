import type { Metadata } from "next";
import { JwtDebuggerClient } from "./_components/jwt-debugger-client";

export const metadata: Metadata = {
  title: "JWT Debugger",
  description: "Decode and inspect JWT tokens. View header, payload, and expiration.",
};

export default function JwtDebuggerPage() {
  return <JwtDebuggerClient />;
}
