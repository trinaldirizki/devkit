"use client";

import { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { json } from "@codemirror/lang-json";
import { javascript } from "@codemirror/lang-javascript";
import { useTheme } from "next-themes";
import { usePreferences } from "@/lib/stores/preferences";
import { cn } from "@/lib/utils/cn";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: "json" | "javascript" | "text";
  readOnly?: boolean;
  placeholder?: string;
  minHeight?: string;
  className?: string;
}

export function CodeEditor({
  value,
  onChange,
  language = "text",
  readOnly = false,
  placeholder,
  minHeight = "200px",
  className,
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const { editorFontSize, wordWrap, lineNumbers } = usePreferences();

  const langExtension = useMemo(() => {
    if (language === "json") return [json()];
    if (language === "javascript") return [javascript()];
    return [];
  }, [language]);

  const customTheme = useMemo(
    () =>
      EditorView.theme({
        "&": {
          fontSize: `${editorFontSize}px`,
          fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
        },
        "&.cm-editor": { outline: "none" },
        "&.cm-focused": { outline: "none" },
        ".cm-scroller": { fontFamily: "inherit" },
        ".cm-cursor": { borderLeftColor: "hsl(var(--primary))" },
        ".cm-gutters": {
          background: "transparent",
          borderRight: "1px solid hsl(var(--outline-variant))",
          color: "hsl(var(--on-surface-variant))",
        },
        ".cm-activeLineGutter": { background: "transparent" },
        ".cm-selectionBackground, ::selection": {
          background: "hsl(var(--secondary-container)) !important",
        },
        "&.cm-focused .cm-selectionBackground": {
          background: "hsl(var(--secondary-container)) !important",
        },
        ".cm-line": { padding: "0 4px" },
        ".cm-content": { padding: "8px 0" },
        ".cm-activeLine": { background: "hsl(var(--surface-container-high))" },
      }),
    [editorFontSize],
  );

  const wrapExtension = useMemo(
    () => (wordWrap ? [EditorView.lineWrapping] : []),
    [wordWrap],
  );

  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      extensions={[...langExtension, customTheme, ...wrapExtension]}
      readOnly={readOnly}
      placeholder={placeholder}
      basicSetup={{
        lineNumbers,
        foldGutter: false,
        dropCursor: true,
        allowMultipleSelections: true,
        indentOnInput: true,
        bracketMatching: true,
        closeBrackets: true,
        autocompletion: language !== "text",
        highlightActiveLine: true,
        highlightSelectionMatches: true,
        tabSize: 2,
      }}
      minHeight={minHeight}
      className={cn(
        "w-full overflow-hidden [&_.cm-editor]:focus-within:ring-2 [&_.cm-editor]:focus-within:ring-ring [&_.cm-editor]:focus-within:ring-inset",
        className,
      )}
    />
  );
}
