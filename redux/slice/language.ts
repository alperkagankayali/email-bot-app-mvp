"use client";
import { getLanguage } from "@/services/service/generalService";
import { ILanguage } from "@/types/languageType";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface ILanguageSlice {
  language: ILanguage[];
  status: "loading" | "succeeded" | "failed" | "idle";
}

const initialState: ILanguageSlice = {
  language: [],
  status: "idle",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchLanguage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLanguage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.language = action.payload;
      })
      .addCase(fetchLanguage.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const fetchLanguage = createAsyncThunk("language/get", async () => {
  const response = await getLanguage(10, 1, true);
  return response.data;
});

export const {} = languageSlice.actions;

export default languageSlice.reducer;
