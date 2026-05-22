import { cn } from "@/lib/utils/cn";

interface KeyboardShortcutProps {
  keys: string[];
  className?: string;
}

export function KeyboardShortcutDisplay({
  keys,
  className,
}: KeyboardShortcutProps) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {keys.map((key, i) => (
        <kbd
          key={i}
          className="rounded-xs bg-surface-container-highest px-1.5 py-0.5 text-[11px] font-mono font-medium text-on-surface-variant"
        >
          {key}
        </kbd>
      ))}
    </span>
  );
}
