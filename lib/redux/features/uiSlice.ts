import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type EditMode = 'timeline' | 'audio' | 'text' | 'image' | 'export';

export interface UiState {
  activePanel: EditMode;
  isPreviewFullscreen: boolean;
  isRightPanelOpen: boolean;
  isProcessing: boolean;
  processingProgress: number;
  showTimeline: boolean;
}

const initialState: UiState = {
  activePanel: 'timeline',
  isPreviewFullscreen: false,
  isRightPanelOpen: true,
  isProcessing: false,
  processingProgress: 0,
  showTimeline: true,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setActivePanel: (state, action: PayloadAction<EditMode>) => {
      state.activePanel = action.payload;
    },
    togglePreviewFullscreen: (state) => {
      state.isPreviewFullscreen = !state.isPreviewFullscreen;
    },
    toggleRightPanel: (state) => {
      state.isRightPanelOpen = !state.isRightPanelOpen;
    },
    setIsProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
      if (!action.payload) {
        state.processingProgress = 0;
      }
    },
    setProcessingProgress: (state, action: PayloadAction<number>) => {
      state.processingProgress = action.payload;
    },
    toggleTimeline: (state) => {
      state.showTimeline = !state.showTimeline;
    },
  },
});

export const {
  setActivePanel,
  togglePreviewFullscreen,
  toggleRightPanel,
  setIsProcessing,
  setProcessingProgress,
  toggleTimeline,
} = uiSlice.actions;

export default uiSlice.reducer;