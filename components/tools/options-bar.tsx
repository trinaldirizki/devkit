import { cn } from "@/lib/utils/cn";

interface OptionsBarProps {
  children: React.ReactNode;
  className?: string;
}

export function OptionsBar({ children, className }: OptionsBarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-md bg-surface-container-low px-4 py-2.5",
        className,
      )}
    >
      {children}
    </div>
  );
}
