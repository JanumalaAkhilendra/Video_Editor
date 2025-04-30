import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";

export interface ImageOverlay {
  id: string;
  file: File | null;
  url: string | null;
  startTime: number;
  endTime: number;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  style: {
    opacity: number;
    rotation: number;
    borderWidth: number;
    borderColor: string;
    borderRadius: number;
  };
}

export interface ImageState {
  overlays: ImageOverlay[];
  selectedOverlayId: string | null;
}

const initialState: ImageState = {
  overlays: [],
  selectedOverlayId: null,
};

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    addImageOverlay: (
      state,
      action: PayloadAction<Omit<ImageOverlay, "id" | "url">>
    ) => {
      const newOverlay = {
        ...action.payload,
        id: nanoid(),
        url: action.payload.file ? URL.createObjectURL(action.payload.file) : null,
      };
      state.overlays.push(newOverlay);
    },
    updateImageOverlay: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<ImageOverlay> }>
    ) => {
      const overlayIndex = state.overlays.findIndex(
        (overlay) => overlay.id === action.payload.id
      );
      if (overlayIndex !== -1) {
        if (action.payload.changes.file) {
          action.payload.changes.url = URL.createObjectURL(action.payload.changes.file);
        }
        state.overlays[overlayIndex] = {
          ...state.overlays[overlayIndex],
          ...action.payload.changes,
        };
      }
    },
    removeImageOverlay: (state, action: PayloadAction<string>) => {
      state.overlays = state.overlays.filter(
        (overlay) => overlay.id !== action.payload
      );
      if (state.selectedOverlayId === action.payload) {
        state.selectedOverlayId = null;
      }
    },
    selectImageOverlay: (state, action: PayloadAction<string | null>) => {
      state.selectedOverlayId = action.payload;
    },
    updateImagePosition: (
      state,
      action: PayloadAction<{ id: string; position: { x: number; y: number } }>
    ) => {
      const overlay = state.overlays.find((o) => o.id === action.payload.id);
      if (overlay) {
        overlay.position = action.payload.position;
      }
    },
    updateImageSize: (
      state,
      action: PayloadAction<{ id: string; size: { width: number; height: number } }>
    ) => {
      const overlay = state.overlays.find((o) => o.id === action.payload.id);
      if (overlay) {
        overlay.size = action.payload.size;
      }
    },
  },
});

export const {
  addImageOverlay,
  updateImageOverlay,
  removeImageOverlay,
  selectImageOverlay,
  updateImagePosition,
  updateImageSize,
} = imageSlice.actions;

export default imageSlice.reducer;