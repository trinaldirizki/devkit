export const siteConfig = {
  name: "DevTools Hub",
  description:
    "Free, fast, client-side developer tools. JSON formatter, JWT debugger, Base64, diff checker, regex tester, and more.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://devtools.hub",
  ogImage: "/api/og",
  creator: "DevTools Hub",
  keywords: [
    "developer tools",
    "JSON formatter",
    "JWT debugger",
    "Base64 encoder",
    "diff checker",
    "regex tester",
    "UUID generator",
    "hash generator",
    "URL encoder",
    "cron parser",
  ],
} as const;
