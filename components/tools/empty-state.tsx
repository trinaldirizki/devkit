import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-outline-variant py-12 text-center",
        className,
      )}
    >
      {Icon && <Icon className="h-8 w-8 text-on-surface-variant/30" />}
      <div>
        <p className="text-[16px] font-medium leading-[24px] text-on-surface-variant">
          {title}
        </p>
        {description && (
          <p className="mt-1 text-[14px] leading-[20px] text-on-surface-variant/70">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
