"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface HistoryEntry {
  id: string;
  toolId: string;
  input: string;
  output: string;
  timestamp: number;
}

const MAX_ENTRIES_PER_TOOL = 20;

interface HistoryState {
  entries: Record<string, HistoryEntry[]>;

  addEntry: (toolId: string, input: string, output: string) => void;
  getEntries: (toolId: string) => HistoryEntry[];
  removeEntry: (toolId: string, entryId: string) => void;
  clearTool: (toolId: string) => void;
  clearAll: () => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useHistory = create<HistoryState>()(
  persist(
    (set, get) => ({
      entries: {},

      addEntry: (toolId, input, output) => {
        const entry: HistoryEntry = {
          id: generateId(),
          toolId,
          input,
          output,
          timestamp: Date.now(),
        };
        set((state) => {
          const existing = state.entries[toolId] ?? [];
          const updated = [entry, ...existing].slice(0, MAX_ENTRIES_PER_TOOL);
          return { entries: { ...state.entries, [toolId]: updated } };
        });
      },

      getEntries: (toolId) => get().entries[toolId] ?? [],

      removeEntry: (toolId, entryId) => {
        set((state) => {
          const existing = state.entries[toolId] ?? [];
          return {
            entries: {
              ...state.entries,
              [toolId]: existing.filter((e) => e.id !== entryId),
            },
          };
        });
      },

      clearTool: (toolId) => {
        set((state) => {
          const { [toolId]: _, ...rest } = state.entries;
          return { entries: rest };
        });
      },

      clearAll: () => set({ entries: {} }),
    }),
    {
      name: "devtools-history",
    },
  ),
);
