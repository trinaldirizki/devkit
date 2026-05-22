"use client";

import { Eraser } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ActionButtonsProps {
  onExecute?: () => void;
  onClear?: () => void;
  executeLabel?: string;
  disabled?: boolean;
  className?: string;
}

export function ActionButtons({
  onExecute,
  onClear,
  executeLabel = "Format",
  disabled = false,
  className,
}: ActionButtonsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {onExecute && (
        <button
          onClick={onExecute}
          disabled={disabled}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[14px] font-medium leading-[20px] text-primary-foreground shadow-elevation-1 transition-all duration-md-short ease-md-standard hover:shadow-elevation-2 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:shadow-elevation-1 disabled:pointer-events-none disabled:opacity-50"
        >
          {executeLabel}
        </button>
      )}
      {onClear && (
        <button
          onClick={onClear}
          disabled={disabled}
          className="inline-flex items-center gap-2 rounded-full border border-outline px-5 py-2.5 text-[14px] font-medium leading-[20px] text-on-surface transition-all duration-md-short ease-md-standard hover:bg-surface-container-highest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          <Eraser className="h-4 w-4" />
          Clear
        </button>
      )}
    </div>
  );
}
