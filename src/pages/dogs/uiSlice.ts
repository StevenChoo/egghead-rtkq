import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

interface UIState {
  luckyDogId: string | null;
}

const initialState: UIState = {
  luckyDogId: null,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLuckyDog: (state, action: PayloadAction<string | null>) => {
      state.luckyDogId = action.payload;
    },
  },
});

export const { setLuckyDog } = uiSlice.actions;

// Selectors
export const selectLuckyDogId = (state: RootState) => state.ui.luckyDogId;

export default uiSlice.reducer;
