import { create } from "zustand";
import type { Mode } from "@/lib/graph";

type AtlasState = {
  mode: Mode;
  selectedId?: string;
  query: string;
  zoom: number;
  setMode: (mode: Mode) => void;
  setSelectedId: (id?: string) => void;
  setQuery: (query: string) => void;
  setZoom: (zoom: number) => void;
};

export const useAtlasStore = create<AtlasState>((set) => ({
  mode: "system",
  selectedId: undefined,
  query: "",
  zoom: 1,
  setMode: (mode) => set({ mode }),
  setSelectedId: (selectedId) => set({ selectedId }),
  setQuery: (query) => set({ query }),
  setZoom: (zoom) => set({ zoom })
}));
