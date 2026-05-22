"use client";

import { useState, useCallback } from "react";
import { Binary } from "lucide-react";
import {
  encodeBase64,
  decodeBase64,
  base64Examples,
} from "@/lib/tools/base64";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHeader } from "@/components/tools/tool-header";
import { EditorPanel } from "@/components/tools/editor-panel";
import { OutputPanel } from "@/components/tools/output-panel";
import { ActionButtons } from "@/components/tools/action-buttons";
import { ErrorDisplay } from "@/components/tools/error-display";
import { LoadExampleButton } from "@/components/tools/load-example-button";
import { CodeEditor } from "@/components/shared/code-editor";

type Mode = "encode" | "decode";

export function Base64Client() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<Mode>("encode");

  const handleExecute = useCallback(() => {
    setError("");
    const result = mode === "encode" ? encodeBase64(input) : decodeBase64(input);
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

  return (
    <ToolLayout>
      <ToolHeader
        title="Base64 Encoder/Decoder"
        description="Encode text to Base64 or decode Base64 back to text"
        icon={Binary}
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
              mode === "encode" ? base64Examples.encode : base64Examples.decode,
            )
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <EditorPanel label={mode === "encode" ? "Text" : "Base64"}>
          <CodeEditor
            value={input}
            onChange={setInput}
            placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 to decode..."}
            minHeight="240px"
          />
        </EditorPanel>
        <OutputPanel
          label={mode === "encode" ? "Base64" : "Text"}
          value={output}
        />
      </div>

      {error && <ErrorDisplay message={error} />}

      <ActionButtons
        onExecute={handleExecute}
        onClear={handleClear}
        executeLabel={mode === "encode" ? "Encode" : "Decode"}
      />
    </ToolLayout>
  );
}
