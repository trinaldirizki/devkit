"use client";

import { useState, useCallback } from "react";
import { Fingerprint, RefreshCw } from "lucide-react";
import { generateUuidV4, generateBulkUuids, validateUuid, formatUuidCases } from "@/lib/tools/uuid";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHeader } from "@/components/tools/tool-header";
import { CopyButton } from "@/components/shared/copy-button";

export function UuidGeneratorClient() {
  const [uuids, setUuids] = useState<string[]>(() => [generateUuidV4()]);
  const [count, setCount] = useState(1);
  const [validateInput, setValidateInput] = useState("");

  const handleGenerate = useCallback(() => {
    setUuids(generateBulkUuids(count));
  }, [count]);

  const validation = validateInput.trim()
    ? validateUuid(validateInput)
    : null;

  return (
    <ToolLayout>
      <ToolHeader
        title="UUID Generator"
        description="Generate UUIDs (v4) individually or in bulk"
        icon={Fingerprint}
      />

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-[14px] leading-[20px] text-on-surface">
          Count:
          <input
            type="number"
            min={1}
            max={1000}
            value={count}
            onChange={(e) => setCount(Math.min(1000, Math.max(1, Number(e.target.value))))}
            className="w-20 rounded-xs border border-outline bg-surface-container px-2.5 py-1.5 text-[14px] leading-[20px] text-on-surface outline-none transition-colors duration-md-short ease-md-standard focus:border-primary focus:ring-1 focus:ring-ring"
          />
        </label>
        <button
          onClick={handleGenerate}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[14px] font-medium leading-[20px] text-primary-foreground shadow-elevation-1 transition-all duration-md-short ease-md-standard hover:shadow-elevation-2"
        >
          <RefreshCw className="h-4 w-4" />
          Generate
        </button>
        <CopyButton value={uuids.join("\n")} label="Copy All" />
      </div>

      <div className="rounded-md bg-surface-container shadow-elevation-1 overflow-hidden">
        <div className="max-h-80 divide-y divide-outline-variant overflow-auto">
          {uuids.map((uuid, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-2.5"
            >
              <code className="text-[14px] leading-[20px] font-mono text-on-surface">{uuid}</code>
              <CopyButton value={uuid} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="mb-2 text-[14px] font-medium leading-[20px] text-on-surface">Validate UUID</h2>
        <input
          value={validateInput}
          onChange={(e) => setValidateInput(e.target.value)}
          placeholder="Paste a UUID to validate..."
          className="w-full rounded-md border border-outline bg-surface-container px-3 py-2.5 font-mono text-[14px] leading-[20px] text-on-surface outline-none transition-colors duration-md-short ease-md-standard focus:border-primary focus:ring-1 focus:ring-ring"
        />
        {validation && (
          <div className="mt-2 rounded-md bg-surface-container p-4 shadow-elevation-1 text-[14px] leading-[20px]">
            <p>
              Valid:{" "}
              <span className={validation.isValid ? "font-medium text-success" : "font-medium text-destructive"}>
                {validation.isValid ? "Yes" : "No"}
              </span>
            </p>
            {validation.isValid && (
              <>
                <p className="text-on-surface">Version: {validation.version}</p>
                <p className="text-on-surface">Variant: {validation.variant}</p>
              </>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
