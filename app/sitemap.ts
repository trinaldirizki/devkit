import type { MetadataRoute } from "next";
import { tools } from "@/lib/config/tools";
import { siteConfig } from "@/lib/config/site";

// Static export support (desktop build); behavior-neutral on the web build.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages = tools.map((tool) => ({
    url: `${siteConfig.url}/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...toolPages,
  ];
}
