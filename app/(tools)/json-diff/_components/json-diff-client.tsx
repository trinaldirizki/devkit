"use client";

import { useState, useCallback } from "react";
import { FileJson2 } from "lucide-react";
import { computeJsonDiff, diffExamples, type JsonDiffNode } from "@/lib/tools/diff";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHeader } from "@/components/tools/tool-header";
import { EditorPanel } from "@/components/tools/editor-panel";
import { ActionButtons } from "@/components/tools/action-buttons";
import { ErrorDisplay } from "@/components/tools/error-display";
import { LoadExampleButton } from "@/components/tools/load-example-button";
import { CodeEditor } from "@/components/shared/code-editor";
import { cn } from "@/lib/utils/cn";

export function JsonDiffClient() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [nodes, setNodes] = useState<JsonDiffNode[]>([]);
  const [error, setError] = useState("");

  const handleCompare = useCallback(() => {
    setError("");
    try {
      const leftParsed = JSON.parse(left);
      const rightParsed = JSON.parse(right);
      setNodes(computeJsonDiff(leftParsed, rightParsed));
    } catch {
      setError("Both inputs must be valid JSON.");
      setNodes([]);
    }
  }, [left, right]);

  const handleClear = useCallback(() => {
    setLeft("");
    setRight("");
    setNodes([]);
    setError("");
  }, []);

  return (
    <ToolLayout>
      <ToolHeader
        title="JSON Diff"
        description="Compare two JSON objects and visualize structural differences"
        icon={FileJson2}
      />

      <LoadExampleButton
        onClick={() => {
          setLeft(diffExamples.left);
          setRight(diffExamples.right);
        }}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <EditorPanel label="Left JSON" language="json">
          <CodeEditor
            value={left}
            onChange={setLeft}
            language="json"
            placeholder="Paste JSON..."
            minHeight="240px"
          />
        </EditorPanel>
        <EditorPanel label="Right JSON" language="json">
          <CodeEditor
            value={right}
            onChange={setRight}
            language="json"
            placeholder="Paste JSON..."
            minHeight="240px"
          />
        </EditorPanel>
      </div>

      <ActionButtons
        onExecute={handleCompare}
        onClear={handleClear}
        executeLabel="Compare"
      />

      {error && <ErrorDisplay message={error} />}

      {nodes.length > 0 && (
        <div className="rounded-md bg-surface-container shadow-elevation-1 overflow-auto">
          <table className="w-full text-[14px] leading-[20px]">
            <thead>
              <tr className="bg-surface-container-high">
                <th className="px-4 py-2.5 text-left font-medium text-on-surface">Path</th>
                <th className="px-4 py-2.5 text-left font-medium text-on-surface">Status</th>
                <th className="px-4 py-2.5 text-left font-medium text-on-surface">Left</th>
                <th className="px-4 py-2.5 text-left font-medium text-on-surface">Right</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {nodes.map((node, i) => (
                <tr
                  key={i}
                  className={cn(
                    node.type === "added" && "bg-green-500/10",
                    node.type === "removed" && "bg-red-500/10",
                    node.type === "changed" && "bg-yellow-500/10",
                  )}
                >
                  <td className="px-4 py-2 font-mono text-[12px]">{node.path}</td>
                  <td className="px-4 py-2 capitalize">{node.type}</td>
                  <td className="px-4 py-2 font-mono text-[12px]">
                    {node.leftValue !== undefined
                      ? JSON.stringify(node.leftValue)
                      : ""}
                  </td>
                  <td className="px-4 py-2 font-mono text-[12px]">
                    {node.rightValue !== undefined
                      ? JSON.stringify(node.rightValue)
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ToolLayout>
  );
}
