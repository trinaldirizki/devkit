"use client";

import { useState, useCallback } from "react";
import { Braces } from "lucide-react";
import { formatJson, jsonExamples, type JsonResult } from "@/lib/tools/json";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHeader } from "@/components/tools/tool-header";
import { EditorPanel } from "@/components/tools/editor-panel";
import { OutputPanel } from "@/components/tools/output-panel";
import { ActionButtons } from "@/components/tools/action-buttons";
import { LoadExampleButton } from "@/components/tools/load-example-button";
import { ErrorDisplay } from "@/components/tools/error-display";
import { OptionsBar } from "@/components/tools/options-bar";
import { CodeEditor } from "@/components/shared/code-editor";

export function JsonFormatterClient() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<JsonResult | null>(null);
  const [indent, setIndent] = useState(2);

  const handleFormat = useCallback(() => {
    if (!input.trim()) return;
    setResult(formatJson(input, indent));
  }, [input, indent]);

  const handleClear = useCallback(() => {
    setInput("");
    setResult(null);
  }, []);

  const output = result?.success ? result.formatted : "";

  return (
    <ToolLayout>
      <ToolHeader
        title="JSON Formatter"
        description="Format, validate, and minify JSON"
        icon={Braces}
      />

      <OptionsBar>
        <label className="flex items-center gap-2 text-[14px] leading-[20px] text-on-surface">
          Indent:
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="rounded-xs border border-outline bg-surface-container px-2.5 py-1.5 text-[14px] leading-[20px] text-on-surface outline-none transition-colors duration-md-short ease-md-standard focus:ring-1 focus:ring-ring"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={1}>Tab</option>
          </select>
        </label>
        <LoadExampleButton onClick={() => setInput(jsonExamples.nested)} />
      </OptionsBar>

      <div className="grid gap-4 lg:grid-cols-2">
        <EditorPanel label="Input" language="json">
          <CodeEditor
            value={input}
            onChange={setInput}
            language="json"
            placeholder="Paste your JSON here..."
            minHeight="320px"
          />
        </EditorPanel>

        <OutputPanel label="Output" value={output} language="json" />
      </div>

      {result && !result.success && (
        <ErrorDisplay message="Invalid JSON" details={result.error} />
      )}

      {result?.success && (
        <div className="text-[12px] leading-[16px] text-on-surface-variant">
          Formatted: {result.size} bytes | Minified: {result.minifiedSize} bytes
        </div>
      )}

      <ActionButtons
        onExecute={handleFormat}
        onClear={handleClear}
        executeLabel="Format"
      />
    </ToolLayout>
  );
}
