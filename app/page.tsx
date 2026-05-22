"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { tools, categories, type ToolCategory } from "@/lib/config/tools";
import { useFavorites } from "@/lib/stores/favorites";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { ToolCard } from "@/components/tools/tool-card";

export default function HomePage() {
  const { favoriteIds } = useFavorites();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const grouped = Object.entries(categories).map(([key, label]) => ({
    category: key as ToolCategory,
    label,
    items: tools.filter((t) => t.category === key),
  }));

  const favoriteTools = mounted ? tools.filter((t) => favoriteIds.includes(t.id)) : [];

  function openCommandPalette() {
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
        cancelable: true,
      }),
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Nav />
      <main className="flex-1">
        {/* Hero — MD3 Surface Container */}
        <section className="bg-surface-container-low">
          <div className="container mx-auto px-4 py-14 md:py-16">
            <h1 className="text-[32px] font-medium leading-[40px] tracking-tight text-on-surface">
              Developer Tools Hub
            </h1>
            <p className="mt-3 max-w-xl text-[16px] leading-[24px] text-on-surface-variant">
              Free, fast, and private. All tools run entirely in your browser
              — no data ever leaves your machine.
            </p>
            <button
              onClick={openCommandPalette}
              className="mt-8 flex items-center gap-3 rounded-xl bg-surface-container-high px-4 py-3.5 text-[14px] leading-[20px] text-on-surface-variant shadow-elevation-1 transition-shadow duration-md-short ease-md-standard hover:shadow-elevation-2 w-full max-w-sm"
            >
              <Search className="h-[18px] w-[18px] shrink-0" />
              <span className="flex-1 text-left">Search tools...</span>
              <kbd className="rounded-sm bg-surface-container-highest px-2 py-0.5 text-[12px] leading-[16px] font-medium text-on-surface-variant">
                Cmd+K
              </kbd>
            </button>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10">
          {/* Favorites */}
          {favoriteTools.length > 0 && (
            <div className="mb-10">
              <h2 className="mb-4 text-[12px] font-medium uppercase tracking-wider text-on-surface-variant">
                Favorites
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {favoriteTools.map((tool) => (
                  <Link key={tool.id} href={`/${tool.slug}`}>
                    <ToolCard tool={tool} />
                  </Link>
                ))}
              </div>
              <div className="mt-8 border-t border-outline-variant" />
            </div>
          )}

          {/* All tools by category */}
          {grouped
            .filter((g) => g.items.length > 0)
            .map((group) => (
              <div key={group.category} className="mb-10">
                <h2 className="mb-4 text-[12px] font-medium uppercase tracking-wider text-on-surface-variant">
                  {group.label}
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((tool) => (
                    <Link key={tool.id} href={`/${tool.slug}`}>
                      <ToolCard tool={tool} />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
