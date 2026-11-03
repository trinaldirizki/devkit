import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";

// Static export support (desktop build); behavior-neutral on the web build.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
