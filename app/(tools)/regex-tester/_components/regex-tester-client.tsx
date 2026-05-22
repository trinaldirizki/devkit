"use client";

import { useState, useMemo } from "react";
import { Regex } from "lucide-react";
import { testRegex, regexExamples, type RegexTestResult } from "@/lib/tools/regex";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHeader } from "@/components/tools/tool-header";
import { EditorPanel } from "@/components/tools/editor-panel";
import { ErrorDisplay } from "@/components/tools/error-display";
import { LoadExampleButton } from "@/components/tools/load-example-button";
import { CodeEditor } from "@/components/shared/code-editor";
import { cn } from "@/lib/utils/cn";

export function RegexTesterClient() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");

  const result: RegexTestResult = useMemo(
    () => testRegex(pattern, flags, testString),
    [pattern, flags, testString],
  );

  return (
    <ToolLayout>
      <ToolHeader
        title="Regex Tester"
        description="Test regular expressions with real-time matching"
        icon={Regex}
      />

      <LoadExampleButton
        onClick={() => {
          setPattern(regexExamples.pattern);
          setFlags(regexExamples.flags);
          setTestString(regexExamples.testString);
        }}
      />

      <div className="flex items-center gap-2">
        <span className="text-on-surface-variant font-mono">/</span>
        <input
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="Enter regex pattern..."
          className="flex-1 rounded-xs border border-outline bg-surface-container px-3 py-2.5 font-mono text-[14px] leading-[20px] text-on-surface outline-none transition-colors duration-md-short ease-md-standard focus:border-primary focus:ring-1 focus:ring-ring"
          spellCheck={false}
        />
        <span className="text-on-surface-variant font-mono">/</span>
        <input
          value={flags}
          onChange={(e) => setFlags(e.target.value)}
          className="w-20 rounded-xs border border-outline bg-surface-container px-3 py-2.5 font-mono text-[14px] leading-[20px] text-on-surface outline-none transition-colors duration-md-short ease-md-standard focus:border-primary focus:ring-1 focus:ring-ring"
          placeholder="gi"
        />
      </div>

      <EditorPanel label="Test String">
        <CodeEditor
          value={testString}
          onChange={setTestString}
          placeholder="Enter text to test against..."
          minHeight="160px"
        />
      </EditorPanel>

      {!result.success && result.error && (
        <ErrorDisplay message={result.error} />
      )}

      {result.success && result.matches.length > 0 && (
        <div className="rounded-md bg-surface-container shadow-elevation-1 overflow-hidden">
          <div className="bg-surface-container-high px-4 py-2.5 text-[14px] font-medium leading-[20px] text-on-surface-variant">
            {result.totalMatches} match{result.totalMatches !== 1 ? "es" : ""}{" "}
            <span className="text-on-surface-variant/60">
              ({result.executionTimeMs.toFixed(2)}ms)
            </span>
          </div>
          <div className="divide-y divide-outline-variant">
            {result.matches.map((match, i) => (
              <div key={i} className="px-4 py-2.5 text-[14px] leading-[20px]">
                <div className="flex gap-4">
                  <span className="text-on-surface-variant">#{i + 1}</span>
                  <span className="font-mono font-medium text-on-surface">
                    &quot;{match.fullMatch}&quot;
                  </span>
                  <span className="text-on-surface-variant">
                    index {match.index}
                  </span>
                </div>
                {match.groups.length > 0 && (
                  <div className="mt-1.5 ml-8 flex flex-wrap gap-2">
                    {match.groups.map((g, gi) => (
                      <span
                        key={gi}
                        className="rounded-xs bg-secondary-container px-2 py-0.5 font-mono text-[12px] text-on-secondary-container"
                      >
                        ${gi + 1}: &quot;{g}&quot;
                      </span>
                    ))}
                  </div>
                )}
                {Object.keys(match.namedGroups).length > 0 && (
                  <div className="mt-1.5 ml-8 flex flex-wrap gap-2">
                    {Object.entries(match.namedGroups).map(([k, v]) => (
                      <span
                        key={k}
                        className="rounded-xs bg-primary-container px-2 py-0.5 font-mono text-[12px] text-on-primary-container"
                      >
                        {k}: &quot;{v}&quot;
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {result.success && result.matches.length === 0 && pattern && (
        <div className="py-8 text-center text-[14px] leading-[20px] text-on-surface-variant">
          No matches found.
        </div>
      )}
    </ToolLayout>
  );
}
