"use client";

import { useCallback } from "react";
import { useHistory, type HistoryEntry } from "@/lib/stores/history";

export function useToolHistory(toolId: string) {
  const { addEntry, getEntries, removeEntry, clearTool } = useHistory();

  const save = useCallback(
    (input: string, output: string) => addEntry(toolId, input, output),
    [toolId, addEntry],
  );

  const entries: HistoryEntry[] = getEntries(toolId);

  const remove = useCallback(
    (entryId: string) => removeEntry(toolId, entryId),
    [toolId, removeEntry],
  );

  const clear = useCallback(() => clearTool(toolId), [toolId, clearTool]);

  return { entries, save, remove, clear };
}
