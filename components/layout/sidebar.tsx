"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Tooltip from "@radix-ui/react-tooltip";
import { ChevronsLeft, ChevronsRight, Star } from "lucide-react";
import { tools, categories, type ToolCategory } from "@/lib/config/tools";
import { usePreferences } from "@/lib/stores/preferences";
import { useFavorites } from "@/lib/stores/favorites";
import { cn } from "@/lib/utils/cn";
import { IS_DESKTOP } from "@/lib/desktop";

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed } = usePreferences();
  const { favoriteIds } = useFavorites();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const grouped = Object.entries(categories).map(([key, label]) => ({
    category: key as ToolCategory,
    label,
    items: tools.filter((t) => t.category === key),
  }));

  const favoriteTools = mounted ? tools.filter((t) => favoriteIds.includes(t.id)) : [];

  return (
    <Tooltip.Provider delayDuration={300}>
      <aside
        className={cn(
          "hidden shrink-0 bg-surface-container-low transition-all duration-md-medium ease-md-standard md:flex md:flex-col",
          IS_DESKTOP &&
            "bg-surface/60 backdrop-blur-2xl border-r border-outline-variant/60",
          mounted && sidebarCollapsed ? "w-14" : "w-56",
        )}
      >
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2 pt-3">
          {/* Favorites section */}
          {favoriteTools.length > 0 && (
            <div className="mb-2">
              {!sidebarCollapsed && (
                <p className="mb-1.5 px-3 text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
                  Favorites
                </p>
              )}
              {favoriteTools.map((tool) => (
                <SidebarItem
                  key={tool.id}
                  tool={tool}
                  isActive={pathname === `/${tool.slug}`}
                  collapsed={sidebarCollapsed}
                />
              ))}
              {!sidebarCollapsed && (
                <div className="my-2 border-t border-outline-variant" />
              )}
            </div>
          )}

          {/* All tools by category */}
          {grouped
            .filter((g) => g.items.length > 0)
            .map((group) => (
              <div key={group.category} className="mb-2">
                {!sidebarCollapsed && (
                  <p className="mb-1.5 px-3 text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
                    {group.label}
                  </p>
                )}
                {group.items.map((tool) => (
                  <SidebarItem
                    key={tool.id}
                    tool={tool}
                    isActive={pathname === `/${tool.slug}`}
                    collapsed={sidebarCollapsed}
                  />
                ))}
              </div>
            ))}
        </nav>

        {/* Collapse toggle */}
        <div className="border-t border-outline-variant p-2">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={cn(
              "flex w-full items-center gap-2 rounded-full px-3 py-2.5 text-[14px] leading-[20px] text-on-surface-variant transition-colors duration-md-short ease-md-standard hover:bg-secondary-container hover:text-on-secondary-container",
              sidebarCollapsed && "justify-center px-2",
            )}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <ChevronsRight className="h-4 w-4 shrink-0" />
            ) : (
              <>
                <ChevronsLeft className="h-4 w-4 shrink-0" />
                <span className="text-[12px] leading-[16px] font-medium">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </Tooltip.Provider>
  );
}

interface SidebarItemProps {
  tool: (typeof tools)[number];
  isActive: boolean;
  collapsed: boolean;
}

function SidebarItem({ tool, isActive, collapsed }: SidebarItemProps) {
  const Icon = tool.icon;

  const link = (
    <Link
      href={`/${tool.slug}`}
      className={cn(
        "relative flex items-center gap-3 rounded-full px-3 py-2.5 text-[14px] leading-[20px] transition-colors duration-md-short ease-md-standard",
        isActive
          ? "bg-secondary-container font-medium text-on-secondary-container"
          : "text-on-surface-variant hover:bg-surface-container-highest",
        collapsed && "justify-center px-2",
      )}
    >
      <Icon
        className={cn(
          "h-[18px] w-[18px] shrink-0",
          isActive ? "text-on-secondary-container" : "text-on-surface-variant",
        )}
      />
      {!collapsed && <span className="truncate">{tool.name}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{link}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="right"
            sideOffset={8}
            className="z-[200] rounded-xs bg-inverse-surface px-3 py-1.5 text-[12px] leading-[16px] font-medium text-inverse-on-surface shadow-elevation-2"
          >
            {tool.name}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    );
  }

  return link;
}
