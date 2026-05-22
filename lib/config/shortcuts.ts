export interface KeyboardShortcut {
  key: string;
  mod: boolean; // Ctrl on Windows/Linux, Cmd on Mac
  shift?: boolean;
  description: string;
  action: string;
}

export const globalShortcuts: KeyboardShortcut[] = [
  {
    key: "k",
    mod: true,
    description: "Open command palette",
    action: "command-palette",
  },
  {
    key: "/",
    mod: true,
    description: "Focus search",
    action: "focus-search",
  },
];

export const editorShortcuts: KeyboardShortcut[] = [
  {
    key: "Enter",
    mod: true,
    description: "Execute / Format",
    action: "execute",
  },
  {
    key: "s",
    mod: true,
    description: "Save to clipboard",
    action: "copy-output",
  },
  {
    key: "l",
    mod: true,
    shift: true,
    description: "Load example",
    action: "load-example",
  },
  {
    key: "Backspace",
    mod: true,
    shift: true,
    description: "Clear input",
    action: "clear",
  },
];

/** Map tool slugs to their specific navigation shortcut (Cmd/Ctrl + digit) */
export const toolNavigationShortcuts: Record<string, string> = {
  "json-formatter": "1",
  "jwt-debugger": "2",
  base64: "3",
  "text-diff": "4",
  "json-diff": "5",
  "regex-tester": "6",
  "uuid-generator": "7",
  "hash-generator": "8",
  "url-encoder": "9",
  "cron-parser": "0",
};

export function formatShortcut(shortcut: KeyboardShortcut): string {
  const isMac =
    typeof navigator !== "undefined" &&
    navigator.platform.toUpperCase().includes("MAC");
  const parts: string[] = [];
  if (shortcut.mod) parts.push(isMac ? "\u2318" : "Ctrl");
  if (shortcut.shift) parts.push(isMac ? "\u21E7" : "Shift");
  parts.push(shortcut.key);
  return parts.join(isMac ? "" : "+");
}
