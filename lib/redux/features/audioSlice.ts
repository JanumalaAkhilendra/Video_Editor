import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";

export interface AudioTrack {
  id: string;
  name: string;
  file: File | null;
  url: string | null;
  startTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
}

export interface AudioState {
  tracks: AudioTrack[];
  selectedTrackId: string | null;
}

const initialState: AudioState = {
  tracks: [],
  selectedTrackId: null,
};

const audioSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    addAudioTrack: (
      state,
      action: PayloadAction<Omit<AudioTrack, "id" | "url">>
    ) => {
      const newTrack = {
        ...action.payload,
        id: nanoid(),
        url: action.payload.file ? URL.createObjectURL(action.payload.file) : null,
      };
      state.tracks.push(newTrack);
    },
    updateAudioTrack: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<AudioTrack> }>
    ) => {
      const trackIndex = state.tracks.findIndex(
        (track) => track.id === action.payload.id
      );
      if (trackIndex !== -1) {
        if (action.payload.changes.file) {
          action.payload.changes.url = URL.createObjectURL(action.payload.changes.file);
        }
        state.tracks[trackIndex] = {
          ...state.tracks[trackIndex],
          ...action.payload.changes,
        };
      }
    },
    removeAudioTrack: (state, action: PayloadAction<string>) => {
      state.tracks = state.tracks.filter((track) => track.id !== action.payload);
      if (state.selectedTrackId === action.payload) {
        state.selectedTrackId = null;
      }
    },
    selectAudioTrack: (state, action: PayloadAction<string | null>) => {
      state.selectedTrackId = action.payload;
    },
    setTrackVolume: (
      state,
      action: PayloadAction<{ id: string; volume: number }>
    ) => {
      const track = state.tracks.find((t) => t.id === action.payload.id);
      if (track) {
        track.volume = action.payload.volume;
      }
    },
    toggleMuteTrack: (state, action: PayloadAction<string>) => {
      const track = state.tracks.find((t) => t.id === action.payload);
      if (track) {
        track.isMuted = !track.isMuted;
      }
    },
  },
});

export const {
  addAudioTrack,
  updateAudioTrack,
  removeAudioTrack,
  selectAudioTrack,
  setTrackVolume,
  toggleMuteTrack,
} = audioSlice.actions;

export default audioSlice.reducer;