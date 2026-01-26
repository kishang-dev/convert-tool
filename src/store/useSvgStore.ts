import { create } from "zustand";
import { svgApi } from "../services/api";

interface SvgState {
  file: File | null;
  uploading: boolean;
  svgUrl: string | null;
  originalPreview: string | null;
  error: string | null;
  result: any | null;

  setFile: (file: File | null) => void;
  convertImage: () => Promise<void>;
  reset: () => void;
}

export const useSvgStore = create<SvgState>((set, get) => ({
  file: null,
  uploading: false,
  svgUrl: null,
  originalPreview: null,
  error: null,
  result: null,

  setFile: (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        set({
          file,
          originalPreview: reader.result as string,
          svgUrl: null,
          error: null,
          result: null,
        });
      };
      reader.readAsDataURL(file);
    } else {
      set({
        file: null,
        originalPreview: null,
        svgUrl: null,
        error: null,
        result: null,
      });
    }
  },

  convertImage: async () => {
    const { file } = get();
    if (!file) return;

    set({ uploading: true, error: null });

    try {
      const data = await svgApi.uploadImage(file);
      set({
        uploading: false,
        svgUrl: svgApi.getSvgUrl(data.svgUrl),
        result: data,
      });
    } catch (err: any) {
      set({
        uploading: false,
        error: err.response?.data?.error || "Failed to convert image",
      });
    }
  },

  reset: () =>
    set({
      file: null,
      uploading: false,
      svgUrl: null,
      originalPreview: null,
      error: null,
      result: null,
    }),
}));
