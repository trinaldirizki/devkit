"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import { Search, Star } from "lucide-react";
import { tools, categories, type ToolCategory } from "@/lib/config/tools";
import { useHistory } from "@/lib/stores/history";
import { useFavorites } from "@/lib/stores/favorites";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { entries } = useHistory();
  const { favoriteIds } = useFavorites();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const navigate = useCallback(
    (slug: string) => {
      setOpen(false);
      router.push(`/${slug}`);
    },
    [router],
  );

  // Recent tools: top 3 from history
  const recentToolIds = Object.entries(entries)
    .filter(([, toolEntries]) => toolEntries.length > 0)
    .sort(([, a], [, b]) => b[0].timestamp - a[0].timestamp)
    .slice(0, 3)
    .map(([toolId]) => toolId);
  const recentTools = recentToolIds
    .map((id) => tools.find((t) => t.id === id))
    .filter(Boolean) as typeof tools;

  const grouped = Object.entries(categories).map(([key, label]) => ({
    category: key as ToolCategory,
    label,
    items: tools.filter((t) => t.category === key),
  }));

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full bg-surface-container-high px-3.5 py-2 text-[14px] leading-[20px] text-on-surface-variant transition-colors duration-md-short ease-md-standard hover:bg-surface-container-highest"
        aria-label="Open command palette"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search tools...</span>
        <kbd className="hidden rounded-xs bg-surface-container-highest px-1.5 py-0.5 text-[11px] font-medium sm:inline-block">
          Cmd+K
        </kbd>
      </button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[100] bg-on-surface/40 backdrop-blur-sm" />
          <Dialog.Content
            className="fixed left-1/2 top-[20vh] z-[110] w-full max-w-xl -translate-x-1/2 rounded-xl bg-surface-container-high shadow-elevation-3 animate-command-palette-in focus:outline-none"
          >
            <Dialog.Title className="sr-only">Command palette</Dialog.Title>
            <Command label="Search tools" className="flex flex-col">
              <div className="flex items-center gap-3 px-4">
                <Search className="h-5 w-5 shrink-0 text-on-surface-variant" />
                <Command.Input
                  placeholder="Search tools..."
                  className="flex h-12 w-full bg-transparent py-3 text-[16px] leading-[24px] text-on-surface outline-none placeholder:text-on-surface-variant"
                  autoFocus
                />
              </div>

              <div className="mx-4 border-t border-outline-variant" />

              <Command.List className="max-h-[360px] overflow-y-auto p-2">
                <Command.Empty className="py-8 text-center text-[14px] leading-[20px] text-on-surface-variant">
                  No tools found.
                </Command.Empty>

                {/* Recent tools */}
                {recentTools.length > 0 && (
                  <Command.Group
                    heading={
                      <span className="px-3 text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
                        Recent
                      </span>
                    }
                    className="mb-1"
                  >
                    {recentTools.map((tool) => (
                      <ToolItem
                        key={tool.id}
                        tool={tool}
                        onSelect={navigate}
                        isFavorite={favoriteIds.includes(tool.id)}
                      />
                    ))}
                  </Command.Group>
                )}

                {/* Grouped tools */}
                {grouped
                  .filter((g) => g.items.length > 0)
                  .map((group) => (
                    <Command.Group
                      key={group.category}
                      heading={
                        <span className="px-3 text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
                          {group.label}
                        </span>
                      }
                      className="mb-1"
                    >
                      {group.items.map((tool) => (
                        <ToolItem
                          key={tool.id}
                          tool={tool}
                          onSelect={navigate}
                          isFavorite={favoriteIds.includes(tool.id)}
                        />
                      ))}
                    </Command.Group>
                  ))}
              </Command.List>

              <div className="flex items-center gap-4 border-t border-outline-variant px-4 py-2.5 text-[11px] text-on-surface-variant">
                <span><kbd className="rounded-xs bg-surface-container-highest px-1.5 py-0.5 font-medium">Enter</kbd> select</span>
                <span><kbd className="rounded-xs bg-surface-container-highest px-1.5 py-0.5 font-medium">Up/Down</kbd> navigate</span>
                <span><kbd className="rounded-xs bg-surface-container-highest px-1.5 py-0.5 font-medium">Esc</kbd> close</span>
              </div>
            </Command>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

interface ToolItemProps {
  tool: (typeof tools)[number];
  onSelect: (slug: string) => void;
  isFavorite: boolean;
}

function ToolItem({ tool, onSelect, isFavorite }: ToolItemProps) {
  const Icon = tool.icon;
  return (
    <Command.Item
      value={`${tool.name} ${tool.keywords.join(" ")}`}
      onSelect={() => onSelect(tool.slug)}
      className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-[14px] leading-[20px] text-on-surface transition-colors duration-md-short ease-md-standard hover:bg-surface-container-highest data-[selected=true]:bg-secondary-container data-[selected=true]:text-on-secondary-container"
    >
      <Icon className="h-[18px] w-[18px] shrink-0 text-primary" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-medium">{tool.name}</span>
          {isFavorite && (
            <Star className="h-3 w-3 fill-warning text-warning" />
          )}
        </div>
        <div className="truncate text-[12px] leading-[16px] text-on-surface-variant">
          {tool.description}
        </div>
      </div>
    </Command.Item>
  );
}
