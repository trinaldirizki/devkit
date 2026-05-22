"use client";

import { useState, useCallback } from "react";
import { Link } from "lucide-react";
import { encodeUrl, decodeUrl, parseUrl, urlExamples } from "@/lib/tools/url";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHeader } from "@/components/tools/tool-header";
import { EditorPanel } from "@/components/tools/editor-panel";
import { OutputPanel } from "@/components/tools/output-panel";
import { ActionButtons } from "@/components/tools/action-buttons";
import { ErrorDisplay } from "@/components/tools/error-display";
import { LoadExampleButton } from "@/components/tools/load-example-button";
import { CodeEditor } from "@/components/shared/code-editor";

type Mode = "encode" | "decode";

export function UrlEncoderClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<Mode>("encode");

  const handleExecute = useCallback(() => {
    setError("");
    const result = mode === "encode" ? encodeUrl(input) : decodeUrl(input);
    if (result.success) {
      setOutput(result.output);
    } else {
      setOutput("");
      setError(result.error);
    }
  }, [input, mode]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setError("");
  }, []);

  const parsed = input.startsWith("http") ? parseUrl(input) : null;

  return (
    <ToolLayout>
      <ToolHeader
        title="URL Encoder/Decoder"
        description="Encode or decode URL components"
        icon={Link}
      />

      <div className="flex items-center gap-4">
        <div className="flex rounded-full border border-outline overflow-hidden">
          <button
            onClick={() => setMode("encode")}
            className={`px-5 py-2 text-[14px] font-medium leading-[20px] transition-colors duration-md-short ease-md-standard ${mode === "encode" ? "bg-secondary-container text-on-secondary-container" : "text-on-surface-variant hover:bg-surface-container-highest"}`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-5 py-2 text-[14px] font-medium leading-[20px] transition-colors duration-md-short ease-md-standard ${mode === "decode" ? "bg-secondary-container text-on-secondary-container" : "text-on-surface-variant hover:bg-surface-container-highest"}`}
          >
            Decode
          </button>
        </div>
        <LoadExampleButton
          onClick={() =>
            setInput(
              mode === "encode" ? urlExamples.encode : urlExamples.decode,
            )
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <EditorPanel label="Input">
          <CodeEditor
            value={input}
            onChange={setInput}
            placeholder={mode === "encode" ? "Enter text to encode..." : "Enter encoded URL to decode..."}
            minHeight="160px"
          />
        </EditorPanel>
        <OutputPanel label="Output" value={output} />
      </div>

      {error && <ErrorDisplay message={error} />}

      <ActionButtons
        onExecute={handleExecute}
        onClear={handleClear}
        executeLabel={mode === "encode" ? "Encode" : "Decode"}
      />

      {parsed && (
        <div className="rounded-md bg-surface-container p-4 shadow-elevation-1 text-[14px] leading-[20px]">
          <h3 className="mb-2 font-medium text-on-surface">Parsed URL</h3>
          <div className="grid gap-1.5 font-mono text-[12px] leading-[16px]">
            <div><span className="text-on-surface-variant">Protocol:</span> <span className="text-on-surface">{parsed.protocol}</span></div>
            <div><span className="text-on-surface-variant">Host:</span> <span className="text-on-surface">{parsed.host}</span></div>
            <div><span className="text-on-surface-variant">Path:</span> <span className="text-on-surface">{parsed.pathname}</span></div>
            {parsed.search && <div><span className="text-on-surface-variant">Search:</span> <span className="text-on-surface">{parsed.search}</span></div>}
            {parsed.hash && <div><span className="text-on-surface-variant">Hash:</span> <span className="text-on-surface">{parsed.hash}</span></div>}
            {parsed.params.length > 0 && (
              <div className="mt-1">
                <span className="text-on-surface-variant">Params:</span>
                {parsed.params.map(([k, v], i) => (
                  <div key={i} className="ml-4 text-on-surface">{k} = {v}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
