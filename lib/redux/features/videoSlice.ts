import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface VideoState {
  videoFile: File | null;
  videoUrl: string | null;
  duration: number;
  isLoading: boolean;
  currentTime: number;
  isPlaying: boolean;
  thumbnails: string[];
}

const initialState: VideoState = {
  videoFile: null,
  videoUrl: null,
  duration: 0,
  isLoading: false,
  currentTime: 0,
  isPlaying: false,
  thumbnails: [],
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setVideoFile: (state, action: PayloadAction<File | null>) => {
      state.videoFile = action.payload;
      if (state.videoFile) {
        state.videoUrl = URL.createObjectURL(state.videoFile);
      } else {
        state.videoUrl = null;
      }
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setThumbnails: (state, action: PayloadAction<string[]>) => {
      state.thumbnails = action.payload;
    },
  },
});

export const {
  setVideoFile,
  setDuration,
  setLoading,
  setCurrentTime,
  setPlaying,
  setThumbnails,
} = videoSlice.actions;

export default videoSlice.reducer;