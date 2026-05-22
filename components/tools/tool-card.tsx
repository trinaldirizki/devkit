"use client";

import { Star } from "lucide-react";
import type { ToolDefinition } from "@/lib/config/tools";
import { useFavorites } from "@/lib/stores/favorites";
import { cn } from "@/lib/utils/cn";

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
        "group relative rounded-md bg-surface-container p-5 shadow-elevation-1 transition-all duration-md-short ease-md-standard hover:shadow-elevation-2 hover:bg-surface-container-high",
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
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-container">
          <Icon className="h-5 w-5 text-on-primary-container" />
        </div>
        <div className="min-w-0">
          <h3 className="text-[16px] font-medium leading-[24px] text-on-surface">
            {tool.name}
          </h3>
          <p className="mt-0.5 text-[14px] leading-[20px] text-on-surface-variant">
            {tool.description}
          </p>
        </div>
      </div>
    </div>
  );
}
