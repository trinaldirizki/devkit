"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { CopyButton } from "@/components/shared/copy-button";
import { CodeEditor } from "@/components/shared/code-editor";

interface OutputPanelProps {
  label: string;
  value: string;
  className?: string;
  actions?: React.ReactNode;
  language?: "json" | "javascript" | "text";
}

export function OutputPanel({
  label,
  value,
  className,
  actions,
  language,
}: OutputPanelProps) {
  const [flash, setFlash] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (value && value !== prevValue.current) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 400);
      prevValue.current = value;
      return () => clearTimeout(t);
    }
    prevValue.current = value;
  }, [value]);

  return (
    <div className={cn("flex flex-col rounded-md bg-surface-container shadow-elevation-1 overflow-hidden", className)}>
      <div
        className={cn(
          "flex items-center justify-between bg-surface-container-high px-4 py-2.5 transition-colors duration-md-short ease-md-standard",
          flash && "animate-output-flash",
        )}
      >
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
        <div className="flex items-center gap-2">
          {value && <CopyButton value={value} />}
          {actions}
        </div>
      </div>
      {language ? (
        <CodeEditor
          value={value}
          language={language}
          readOnly
          placeholder="Output will appear here..."
          minHeight="160px"
        />
      ) : (
        <pre className="flex-1 overflow-auto whitespace-pre-wrap p-4 font-mono text-[13px] text-on-surface">
          {value || <span className="text-on-surface-variant/50">Output will appear here...</span>}
        </pre>
      )}
    </div>
  );
}
