import type { Metadata } from "next";
import { CronParserClient } from "./_components/cron-parser-client";

export const metadata: Metadata = {
  title: "Cron Expression Parser",
  description: "Parse cron expressions and see the next scheduled run times.",
};

export default function CronParserPage() {
  return <CronParserClient />;
}
