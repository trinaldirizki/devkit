"use client";

import { useState, useEffect } from "react";
import { Hash } from "lucide-react";
import { computeAllHashes, md5, type HashResult } from "@/lib/tools/hash";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHeader } from "@/components/tools/tool-header";
import { EditorPanel } from "@/components/tools/editor-panel";
import { CopyButton } from "@/components/shared/copy-button";
import { CodeEditor } from "@/components/shared/code-editor";
import { useDebounce } from "@/lib/hooks/use-debounce";

export function HashGeneratorClient() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<HashResult[]>([]);
  const [md5Hash, setMd5Hash] = useState("");

  const debouncedInput = useDebounce(input, 200);

  useEffect(() => {
    if (!debouncedInput) {
      setHashes([]);
      setMd5Hash("");
      return;
    }
    setMd5Hash(md5(debouncedInput));
    computeAllHashes(debouncedInput).then(setHashes);
  }, [debouncedInput]);

  const allResults = md5Hash
    ? [{ algorithm: "MD5", hex: md5Hash, base64: "" }, ...hashes]
    : hashes;

  return (
    <ToolLayout>
      <ToolHeader
        title="Hash Generator"
        description="Generate MD5, SHA-1, SHA-256, and SHA-512 hashes"
        icon={Hash}
      />

      <EditorPanel label="Input Text">
        <CodeEditor
          value={input}
          onChange={setInput}
          placeholder="Enter text to hash..."
          minHeight="128px"
        />
      </EditorPanel>

      {allResults.length > 0 && (
        <div className="rounded-md bg-surface-container shadow-elevation-1 divide-y divide-outline-variant overflow-hidden">
          {allResults.map((h) => (
            <div key={h.algorithm} className="px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-medium leading-[20px] text-on-surface">{h.algorithm}</span>
                <CopyButton value={h.hex} />
              </div>
              <code className="mt-1 block break-all text-[12px] leading-[16px] text-on-surface-variant font-mono">
                {h.hex}
              </code>
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
