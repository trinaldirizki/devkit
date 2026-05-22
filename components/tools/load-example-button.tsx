"use client";

import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface LoadExampleButtonProps {
  onClick: () => void;
  className?: string;
}

export function LoadExampleButton({
  onClick,
  className,
}: LoadExampleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-outline px-4 py-1.5 text-[14px] font-medium leading-[20px] text-on-surface transition-colors duration-md-short ease-md-standard hover:bg-surface-container-highest",
        className,
      )}
    >
      <BookOpen className="h-4 w-4" />
      Load Example
    </button>
  );
}
