"use client";

import { Download } from "lucide-react";
import { downloadText } from "@/lib/utils/download";
import { cn } from "@/lib/utils/cn";

interface DownloadButtonProps {
  content: string;
  filename: string;
  mimeType?: string;
  className?: string;
}

export function DownloadButton({
  content,
  filename,
  mimeType,
  className,
}: DownloadButtonProps) {
  return (
    <button
      onClick={() => downloadText(content, filename, mimeType)}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-outline px-4 py-1.5 text-[14px] font-medium leading-[20px] text-on-surface transition-colors duration-md-short ease-md-standard hover:bg-surface-container-highest",
        className,
      )}
      aria-label={`Download as ${filename}`}
    >
      <Download className="h-4 w-4" />
      Download
    </button>
  );
}
