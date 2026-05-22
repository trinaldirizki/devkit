"use client";

import { useState, useMemo } from "react";
import { Clock } from "lucide-react";
import { parseCron, cronExamples, type CronResult } from "@/lib/tools/cron";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHeader } from "@/components/tools/tool-header";
import { ErrorDisplay } from "@/components/tools/error-display";

export function CronParserClient() {
  const [expression, setExpression] = useState("");

  const result: CronResult | null = useMemo(() => {
    if (!expression.trim()) return null;
    return parseCron(expression);
  }, [expression]);

  return (
    <ToolLayout>
      <ToolHeader
        title="Cron Expression Parser"
        description="Parse cron expressions and see the next scheduled run times"
        icon={Clock}
      />

      <div>
        <input
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="Enter cron expression (e.g. */5 * * * *)"
          className="w-full rounded-md border border-outline bg-surface-container px-4 py-3 font-mono text-[16px] leading-[24px] text-on-surface outline-none transition-colors duration-md-short ease-md-standard focus:border-primary focus:ring-1 focus:ring-ring"
          spellCheck={false}
        />
        <div className="mt-2.5 flex flex-wrap gap-2">
          {Object.entries(cronExamples).map(([label, expr]) => (
            <button
              key={label}
              onClick={() => setExpression(expr)}
              className="rounded-full border border-outline px-3 py-1.5 text-[12px] leading-[16px] font-mono text-on-surface-variant transition-colors duration-md-short ease-md-standard hover:bg-surface-container-highest"
            >
              {expr}
            </button>
          ))}
        </div>
      </div>

      {result && !result.success && <ErrorDisplay message={result.error} />}

      {result?.success && (
        <div className="space-y-4">
          <div className="rounded-md bg-surface-container p-4 shadow-elevation-1">
            <h3 className="mb-2 text-[14px] font-medium leading-[20px] text-on-surface">Description</h3>
            <p className="text-[14px] leading-[20px] text-on-surface-variant">{result.description}</p>
          </div>

          <div className="rounded-md bg-surface-container shadow-elevation-1 overflow-hidden">
            <div className="bg-surface-container-high px-4 py-2.5 text-[14px] font-medium leading-[20px] text-on-surface">
              Fields
            </div>
            <div className="divide-y divide-outline-variant">
              {result.fields.map((field) => (
                <div
                  key={field.name}
                  className="flex items-center justify-between px-4 py-2.5 text-[14px] leading-[20px]"
                >
                  <span className="font-medium text-on-surface">{field.name}</span>
                  <span className="font-mono text-on-surface">{field.value}</span>
                  <span className="text-on-surface-variant">
                    {field.description}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {result.nextRuns.length > 0 && (
            <div className="rounded-md bg-surface-container shadow-elevation-1 overflow-hidden">
              <div className="bg-surface-container-high px-4 py-2.5 text-[14px] font-medium leading-[20px] text-on-surface">
                Next {result.nextRuns.length} Runs
              </div>
              <div className="divide-y divide-outline-variant">
                {result.nextRuns.map((date, i) => (
                  <div key={i} className="px-4 py-2.5 text-[14px] leading-[20px] font-mono text-on-surface">
                    {date.toLocaleString()}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
