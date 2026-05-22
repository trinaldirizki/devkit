import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ErrorDisplayProps {
  message: string;
  details?: string;
  className?: string;
}

export function ErrorDisplay({
  message,
  details,
  className,
}: ErrorDisplayProps) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "flex items-start gap-3 rounded-md bg-destructive-container p-4 text-[14px] leading-[20px] animate-content-in",
        className,
      )}
    >
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
      <div>
        <p className="font-medium text-destructive">{message}</p>
        {details && (
          <p className="mt-1 text-[12px] leading-[16px] text-destructive/80">
            {details}
          </p>
        )}
      </div>
    </div>
  );
}
