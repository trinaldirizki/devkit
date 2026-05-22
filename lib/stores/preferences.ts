"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";
export type EditorFontSize = 12 | 14 | 16 | 18;

interface PreferencesState {
  theme: Theme;
  editorFontSize: EditorFontSize;
  indentSize: 2 | 4;
  wordWrap: boolean;
  lineNumbers: boolean;
  sidebarCollapsed: boolean;

  setTheme: (theme: Theme) => void;
  setEditorFontSize: (size: EditorFontSize) => void;
  setIndentSize: (size: 2 | 4) => void;
  setWordWrap: (wrap: boolean) => void;
  setLineNumbers: (show: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: "system",
      editorFontSize: 14,
      indentSize: 2,
      wordWrap: true,
      lineNumbers: true,
      sidebarCollapsed: false,

      setTheme: (theme) => set({ theme }),
      setEditorFontSize: (editorFontSize) => set({ editorFontSize }),
      setIndentSize: (indentSize) => set({ indentSize }),
      setWordWrap: (wordWrap) => set({ wordWrap }),
      setLineNumbers: (lineNumbers) => set({ lineNumbers }),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
    }),
    {
      name: "devtools-preferences",
    },
  ),
);
