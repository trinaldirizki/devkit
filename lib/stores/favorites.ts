"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  favoriteIds: string[];

  toggle: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      toggle: (toolId) => {
        set((state) => {
          const exists = state.favoriteIds.includes(toolId);
          return {
            favoriteIds: exists
              ? state.favoriteIds.filter((id) => id !== toolId)
              : [...state.favoriteIds, toolId],
          };
        });
      },

      isFavorite: (toolId) => get().favoriteIds.includes(toolId),
    }),
    {
      name: "devtools-favorites",
    },
  ),
);
