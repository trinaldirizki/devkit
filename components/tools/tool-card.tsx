"use client";

import { Star } from "lucide-react";
import type { ToolDefinition } from "@/lib/config/tools";
import { useFavorites } from "@/lib/stores/favorites";
import { cn } from "@/lib/utils/cn";
import { IS_DESKTOP } from "@/lib/desktop";

interface ToolCardProps {
  tool: ToolDefinition;
  className?: string;
}

export function ToolCard({ tool, className }: ToolCardProps) {
  const Icon = tool.icon;
  const { toggle, isFavorite } = useFavorites();
  const favorited = isFavorite(tool.id);

  return (
    <div
      className={cn(
        "group relative rounded-md bg-surface-container shadow-elevation-1 transition-all duration-md-short ease-md-standard hover:shadow-elevation-2 hover:bg-surface-container-high",
        // Desktop (macOS): compact native density; web keeps the airier card.
        IS_DESKTOP ? "p-4" : "p-5",
        className,
      )}
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggle(tool.id);
        }}
        className={cn(
          "absolute right-3 top-3 rounded-full p-1.5 transition-all duration-md-short ease-md-standard",
          favorited
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100",
          "hover:bg-surface-container-highest",
        )}
        aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      >
        <Star
          className={cn(
            "h-4 w-4 transition-colors duration-md-short ease-md-standard",
            favorited
              ? "fill-warning text-warning"
              : "text-on-surface-variant hover:text-warning",
          )}
        />
      </button>

      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-lg bg-primary-container",
            IS_DESKTOP ? "h-9 w-9" : "h-10 w-10",
          )}
        >
          <Icon
            className={cn(
              "text-on-primary-container",
              IS_DESKTOP ? "h-[18px] w-[18px]" : "h-5 w-5",
            )}
          />
        </div>
        <div className="min-w-0">
          <h3
            className={cn(
              "font-medium text-on-surface",
              IS_DESKTOP
                ? "text-[14px] leading-[20px]"
                : "text-[16px] leading-[24px]",
            )}
          >
            {tool.name}
          </h3>
          <p
            className={cn(
              "mt-0.5 text-on-surface-variant",
              IS_DESKTOP
                ? "line-clamp-2 text-[12px] leading-[16px]"
                : "text-[14px] leading-[20px]",
            )}
          >
            {tool.description}
          </p>
        </div>
      </div>
    </div>
  );
}
