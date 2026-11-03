"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Settings } from "lucide-react";
import { usePreferences, type EditorFontSize } from "@/lib/stores/preferences";
import { cn } from "@/lib/utils/cn";
import { IS_DESKTOP } from "@/lib/desktop";

const fontSizes: EditorFontSize[] = [12, 14, 16, 18];
const indentSizes = [2, 4] as const;

export function SettingsDropdown() {
  const {
    editorFontSize,
    setEditorFontSize,
    indentSize,
    setIndentSize,
    wordWrap,
    setWordWrap,
    lineNumbers,
    setLineNumbers,
  } = usePreferences();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="rounded-full p-2.5 text-on-surface-variant transition-colors duration-md-short ease-md-standard hover:bg-surface-container-highest"
          aria-label="Editor settings"
        >
          <Settings className="h-[18px] w-[18px]" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-[200] min-w-[220px] rounded-xs bg-surface-container-high p-2 shadow-elevation-2 animate-fade-in"
        >
          <p className="mb-2 px-3 text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
            Editor Settings
          </p>

          {/* Font size */}
          <div className="mb-3 px-3">
            <p className="mb-1.5 text-[12px] leading-[16px] font-medium text-on-surface">Font size</p>
            <div className="flex gap-1">
              {fontSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setEditorFontSize(size)}
                  className={cn(
                    "flex-1 rounded-xs px-2 py-1.5 text-[12px] leading-[16px] font-medium transition-colors duration-md-short ease-md-standard",
                    editorFontSize === size
                      ? "bg-primary text-primary-foreground"
                      : "text-on-surface-variant hover:bg-surface-container-highest",
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Indent size */}
          <div className="mb-3 px-3">
            <p className="mb-1.5 text-[12px] leading-[16px] font-medium text-on-surface">Indent</p>
            <div className="flex gap-1">
              {indentSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setIndentSize(size)}
                  className={cn(
                    "flex-1 rounded-xs px-2 py-1.5 text-[12px] leading-[16px] font-medium transition-colors duration-md-short ease-md-standard",
                    indentSize === size
                      ? "bg-primary text-primary-foreground"
                      : "text-on-surface-variant hover:bg-surface-container-highest",
                  )}
                >
                  {size} spaces
                </button>
              ))}
            </div>
          </div>

          <div className="mx-2 border-t border-outline-variant" />
          <div className="pt-1">
            {/* Word wrap toggle */}
            <button
              onClick={() => setWordWrap(!wordWrap)}
              className="flex w-full items-center justify-between rounded-xs px-3 py-2 text-[14px] leading-[20px] transition-colors duration-md-short ease-md-standard hover:bg-surface-container-highest"
            >
              <span className="text-on-surface">Word wrap</span>
              <span
                className={cn(
                  "flex h-[18px] w-[18px] items-center justify-center border-2 text-[10px] font-bold transition-colors duration-md-short ease-md-standard",
                  // macOS uses circular checkboxes; web keeps squares.
                  IS_DESKTOP ? "rounded-full" : "rounded-xs",
                  wordWrap
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-outline",
                )}
              >
                {wordWrap ? "✓" : ""}
              </span>
            </button>

            {/* Line numbers toggle */}
            <button
              onClick={() => setLineNumbers(!lineNumbers)}
              className="flex w-full items-center justify-between rounded-xs px-3 py-2 text-[14px] leading-[20px] transition-colors duration-md-short ease-md-standard hover:bg-surface-container-highest"
            >
              <span className="text-on-surface">Line numbers</span>
              <span
                className={cn(
                  "flex h-[18px] w-[18px] items-center justify-center border-2 text-[10px] font-bold transition-colors duration-md-short ease-md-standard",
                  // macOS uses circular checkboxes; web keeps squares.
                  IS_DESKTOP ? "rounded-full" : "rounded-xs",
                  lineNumbers
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-outline",
                )}
              >
                {lineNumbers ? "✓" : ""}
              </span>
            </button>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
