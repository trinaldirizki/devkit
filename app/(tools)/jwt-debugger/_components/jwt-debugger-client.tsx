"use client";

import { useState, useCallback } from "react";
import { KeyRound } from "lucide-react";
import { decodeJwt, jwtExamples, type JwtResult } from "@/lib/tools/jwt";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHeader } from "@/components/tools/tool-header";
import { EditorPanel } from "@/components/tools/editor-panel";
import { LoadExampleButton } from "@/components/tools/load-example-button";
import { ErrorDisplay } from "@/components/tools/error-display";
import { CopyButton } from "@/components/shared/copy-button";
import { CodeEditor } from "@/components/shared/code-editor";

export function JwtDebuggerClient() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<JwtResult | null>(null);

  const handleDecode = useCallback((value: string) => {
    setInput(value);
    if (!value.trim()) {
      setResult(null);
      return;
    }
    setResult(decodeJwt(value));
  }, []);

  return (
    <ToolLayout>
      <ToolHeader
        title="JWT Debugger"
        description="Decode and inspect JWT tokens"
        icon={KeyRound}
      />

      <div className="flex gap-2">
        <LoadExampleButton onClick={() => handleDecode(jwtExamples.basic)} />
      </div>

      <EditorPanel label="Encoded Token">
        <CodeEditor
          value={input}
          onChange={handleDecode}
          placeholder="Paste your JWT token here..."
          minHeight="96px"
        />
      </EditorPanel>

      {result && !result.success && (
        <ErrorDisplay message="Invalid JWT" details={result.error} />
      )}

      {result?.success && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-md bg-surface-container shadow-elevation-1 overflow-hidden">
            <div className="flex items-center justify-between bg-surface-container-high px-4 py-2.5">
              <span className="text-[14px] font-medium leading-[20px] text-on-surface-variant">Header</span>
              <CopyButton value={JSON.stringify(result.header, null, 2)} />
            </div>
            <pre className="overflow-auto p-4 font-mono text-[14px] leading-[20px] text-on-surface">
              {JSON.stringify(result.header, null, 2)}
            </pre>
          </div>

          <div className="rounded-md bg-surface-container shadow-elevation-1 overflow-hidden">
            <div className="flex items-center justify-between bg-surface-container-high px-4 py-2.5">
              <span className="text-[14px] font-medium leading-[20px] text-on-surface-variant">Payload</span>
              <CopyButton value={JSON.stringify(result.payload, null, 2)} />
            </div>
            <pre className="overflow-auto p-4 font-mono text-[14px] leading-[20px] text-on-surface">
              {JSON.stringify(result.payload, null, 2)}
            </pre>
          </div>

          <div className="rounded-md bg-surface-container shadow-elevation-1 overflow-hidden lg:col-span-2">
            <div className="bg-surface-container-high px-4 py-2.5 text-[14px] font-medium leading-[20px] text-on-surface-variant">
              Token Info
            </div>
            <div className="grid gap-2 p-4 text-[14px] leading-[20px] sm:grid-cols-3">
              <div>
                <span className="text-on-surface-variant">Expired: </span>
                <span
                  className={
                    result.isExpired
                      ? "font-medium text-destructive"
                      : "font-medium text-success"
                  }
                >
                  {result.isExpired ? "Yes" : "No"}
                </span>
              </div>
              {result.expiresAt && (
                <div>
                  <span className="text-on-surface-variant">Expires: </span>
                  <span className="text-on-surface">{result.expiresAt.toLocaleString()}</span>
                </div>
              )}
              {result.issuedAt && (
                <div>
                  <span className="text-on-surface-variant">Issued: </span>
                  <span className="text-on-surface">{result.issuedAt.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
