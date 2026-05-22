"use client";

import { useState, useCallback } from "react";
import { FileDiff } from "lucide-react";
import { computeLineDiff, type DiffResult } from "@/lib/tools/diff";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHeader } from "@/components/tools/tool-header";
import { EditorPanel } from "@/components/tools/editor-panel";
import { ActionButtons } from "@/components/tools/action-buttons";
import { CodeEditor } from "@/components/shared/code-editor";
import { cn } from "@/lib/utils/cn";

export function TextDiffClient() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [result, setResult] = useState<DiffResult | null>(null);

  const handleCompare = useCallback(() => {
    setResult(computeLineDiff(left, right));
  }, [left, right]);

  const handleClear = useCallback(() => {
    setLeft("");
    setRight("");
    setResult(null);
  }, []);

  return (
    <ToolLayout>
      <ToolHeader
        title="Text Diff"
        description="Compare two blocks of text and see differences"
        icon={FileDiff}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <EditorPanel label="Original">
          <CodeEditor
            value={left}
            onChange={setLeft}
            placeholder="Paste original text..."
            minHeight="240px"
          />
        </EditorPanel>
        <EditorPanel label="Modified">
          <CodeEditor
            value={right}
            onChange={setRight}
            placeholder="Paste modified text..."
            minHeight="240px"
          />
        </EditorPanel>
      </div>

      <ActionButtons
        onExecute={handleCompare}
        onClear={handleClear}
        executeLabel="Compare"
      />

      {result && (
        <>
          <div className="text-[12px] leading-[16px] text-on-surface-variant">
            +{result.stats.additions} additions, -{result.stats.deletions}{" "}
            deletions, {result.stats.unchanged} unchanged
          </div>
          <div className="rounded-md bg-surface-container shadow-elevation-1 overflow-auto">
            <pre className="p-4 text-[14px] leading-[20px] font-mono">
              {result.changes.map((change, i) => (
                <div
                  key={i}
                  className={cn(
                    "px-2",
                    change.type === "added" && "bg-green-500/15 text-green-700 dark:text-green-400",
                    change.type === "removed" && "bg-red-500/15 text-red-700 dark:text-red-400",
                  )}
                >
                  <span className="inline-block w-6 select-none text-on-surface-variant">
                    {change.type === "added" ? "+" : change.type === "removed" ? "-" : " "}
                  </span>
                  {change.value}
                </div>
              ))}
            </pre>
          </div>
        </>
      )}
    </ToolLayout>
  );
}
