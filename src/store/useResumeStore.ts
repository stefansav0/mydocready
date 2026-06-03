import { create } from "zustand";

import { ResumeElement } from "@/types/resume";

interface ResumeStore {
  elements: ResumeElement[];

  selectedId: string | null;

  bgColor: string;

  zoom: number;

  setElements: (
    elements: ResumeElement[]
  ) => void;

  addElement: (
    element: ResumeElement
  ) => void;

  updateElement: (
    id: string,
    updates: Partial<ResumeElement>
  ) => void;

  deleteElement: (
    id: string
  ) => void;

  setSelectedId: (
    id: string | null
  ) => void;

  setBgColor: (
    color: string
  ) => void;

  setZoom: (
    zoom: number
  ) => void;
}

export const useResumeStore =
  create<ResumeStore>((set) => ({
    elements: [],

    selectedId: null,

    bgColor: "#ffffff",

    zoom: 1,

    setElements: (elements) =>
      set({
        elements,
      }),

    addElement: (element) =>
      set((state) => ({
        elements: [
          ...state.elements,
          element,
        ],
      })),

    updateElement: (
      id,
      updates
    ) =>
      set((state) => ({
        elements:
          state.elements.map((el) =>
            el.id === id
              ? {
                  ...el,
                  ...updates,
                }
              : el
          ),
      })),

    deleteElement: (id) =>
      set((state) => ({
        elements:
          state.elements.filter(
            (el) => el.id !== id
          ),

        selectedId: null,
      })),

    setSelectedId: (
      selectedId
    ) =>
      set({
        selectedId,
      }),

    setBgColor: (
      bgColor
    ) =>
      set({
        bgColor,
      }),

    setZoom: (zoom) =>
      set({
        zoom,
      }),
  }));