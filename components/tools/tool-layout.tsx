import { cn } from "@/lib/utils/cn";

interface ToolLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function ToolLayout({ children, className }: ToolLayoutProps) {
  return (
    <div className={cn("flex flex-col gap-4 animate-content-in", className)}>
      {children}
    </div>
  );
}
