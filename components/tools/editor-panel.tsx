"use client";

import { cn } from "@/lib/utils/cn";

interface EditorPanelProps {
  label: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
  language?: string;
}

export function EditorPanel({
  label,
  children,
  className,
  actions,
  language,
}: EditorPanelProps) {
  return (
    <div className={cn("flex flex-col rounded-md bg-surface-container shadow-elevation-1 overflow-hidden", className)}>
      <div className="flex items-center justify-between bg-surface-container-high px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-medium leading-[20px] text-on-surface-variant">
            {label}
          </span>
          {language && (
            <span className="rounded-xs bg-primary-container px-2 py-0.5 text-[11px] uppercase font-medium text-on-primary-container">
              {language}
            </span>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="flex-1 p-0">{children}</div>
    </div>
  );
}
