import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";

export interface SubtitleItem {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  position: {
    x: number;
    y: number;
  };
  style: {
    fontSize: number;
    fontFamily: string;
    color: string;
    backgroundColor: string;
    opacity: number;
    bold: boolean;
    italic: boolean;
    underline: boolean;
  };
}

export interface SubtitleState {
  subtitles: SubtitleItem[];
  selectedSubtitleId: string | null;
}

const initialState: SubtitleState = {
  subtitles: [],
  selectedSubtitleId: null,
};

const subtitleSlice = createSlice({
  name: "subtitle",
  initialState,
  reducers: {
    addSubtitle: (
      state,
      action: PayloadAction<Omit<SubtitleItem, "id">>
    ) => {
      const newSubtitle = {
        ...action.payload,
        id: nanoid(),
      };
      state.subtitles.push(newSubtitle);
    },
    updateSubtitle: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<SubtitleItem> }>
    ) => {
      const subtitleIndex = state.subtitles.findIndex(
        (subtitle) => subtitle.id === action.payload.id
      );
      if (subtitleIndex !== -1) {
        state.subtitles[subtitleIndex] = {
          ...state.subtitles[subtitleIndex],
          ...action.payload.changes,
        };
      }
    },
    removeSubtitle: (state, action: PayloadAction<string>) => {
      state.subtitles = state.subtitles.filter(
        (subtitle) => subtitle.id !== action.payload
      );
      if (state.selectedSubtitleId === action.payload) {
        state.selectedSubtitleId = null;
      }
    },
    selectSubtitle: (state, action: PayloadAction<string | null>) => {
      state.selectedSubtitleId = action.payload;
    },
  },
});

export const {
  addSubtitle,
  updateSubtitle,
  removeSubtitle,
  selectSubtitle,
} = subtitleSlice.actions;

export default subtitleSlice.reducer;