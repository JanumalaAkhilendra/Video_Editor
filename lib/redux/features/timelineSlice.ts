import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";

export interface TimelineClip {
  id: string;
  startTime: number;
  endTime: number;
  type: "video" | "image" | "text";
  sourceId?: string;
  name: string;
}

export interface TimelineState {
  clips: TimelineClip[];
  selectedClipId: string | null;
  zoom: number;
  duration: number;
}

const initialState: TimelineState = {
  clips: [],
  selectedClipId: null,
  zoom: 1,
  duration: 0,
};

const timelineSlice = createSlice({
  name: "timeline",
  initialState,
  reducers: {
    addClip: (
      state,
      action: PayloadAction<Omit<TimelineClip, "id">>
    ) => {
      const newClip = {
        ...action.payload,
        id: nanoid(),
      };
      state.clips.push(newClip);
    },
    updateClip: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<TimelineClip> }>
    ) => {
      const clipIndex = state.clips.findIndex(
        (clip) => clip.id === action.payload.id
      );
      if (clipIndex !== -1) {
        state.clips[clipIndex] = {
          ...state.clips[clipIndex],
          ...action.payload.changes,
        };
      }
    },
    removeClip: (state, action: PayloadAction<string>) => {
      state.clips = state.clips.filter((clip) => clip.id !== action.payload);
      if (state.selectedClipId === action.payload) {
        state.selectedClipId = null;
      }
    },
    selectClip: (state, action: PayloadAction<string | null>) => {
      state.selectedClipId = action.payload;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    reorderClips: (state, action: PayloadAction<TimelineClip[]>) => {
      state.clips = action.payload;
    },
  },
});

export const {
  addClip,
  updateClip,
  removeClip,
  selectClip,
  setZoom,
  setDuration,
  reorderClips,
} = timelineSlice.actions;

export default timelineSlice.reducer;