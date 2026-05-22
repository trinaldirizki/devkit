"use client";

import { Check, Copy } from "lucide-react";
import { useClipboard } from "@/lib/hooks/use-clipboard";
import { cn } from "@/lib/utils/cn";

interface CopyButtonProps {
  value: string;
  className?: string;
  label?: string;
}

export function CopyButton({ value, className, label }: CopyButtonProps) {
  const { copy, copied } = useClipboard();

  return (
    <button
      onClick={() => copy(value)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-outline px-3 py-1.5 text-[12px] leading-[16px] font-medium text-on-surface-variant transition-all duration-md-short ease-md-standard hover:bg-surface-container-highest active:scale-95",
        copied && "border-success/60 text-success",
        className,
      )}
      aria-label={label ?? "Copy to clipboard"}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {label && <span>{copied ? "Copied" : label}</span>}
      {!label && <span className="sr-only">Copy to clipboard</span>}
    </button>
  );
}
