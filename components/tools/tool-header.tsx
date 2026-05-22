import type { LucideIcon } from "lucide-react";

interface ToolHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function ToolHeader({ title, description, icon: Icon }: ToolHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-container">
        <Icon className="h-5 w-5 text-on-primary-container" />
      </div>
      <div>
        <h1 className="text-[22px] font-medium leading-[28px] text-on-surface">
          {title}
        </h1>
        <p className="text-[14px] leading-[20px] text-on-surface-variant">
          {description}
        </p>
      </div>
    </div>
  );
}
