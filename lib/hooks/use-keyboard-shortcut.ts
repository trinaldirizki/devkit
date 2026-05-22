"use client";

import { useEffect } from "react";

interface ShortcutOptions {
  key: string;
  mod?: boolean;
  shift?: boolean;
  handler: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcut({
  key,
  mod = false,
  shift = false,
  handler,
  enabled = true,
}: ShortcutOptions) {
  useEffect(() => {
    if (!enabled) return;

    function onKeyDown(e: KeyboardEvent) {
      const modPressed = e.metaKey || e.ctrlKey;
      if (mod && !modPressed) return;
      if (!mod && modPressed) return;
      if (shift && !e.shiftKey) return;
      if (!shift && e.shiftKey) return;
      if (e.key.toLowerCase() !== key.toLowerCase()) return;

      e.preventDefault();
      handler();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [key, mod, shift, handler, enabled]);
}
