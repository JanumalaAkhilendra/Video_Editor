import { configureStore } from "@reduxjs/toolkit";
import videoReducer from "./features/videoSlice";
import timelineReducer from "./features/timelineSlice";
import audioReducer from "./features/audioSlice";
import subtitleReducer from "./features/subtitleSlice";
import imageReducer from "./features/imageSlice";
import uiReducer from "./features/uiSlice";

export const store = configureStore({
  reducer: {
    video: videoReducer,
    timeline: timelineReducer,
    audio: audioReducer,
    subtitle: subtitleReducer,
    image: imageReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;