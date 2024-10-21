"use client";
import { getResource } from "@/services/service/generalService";
import { IUser } from "@/types/userType";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface ICounter {
  user: IUser | null;
  status: "loading" | "succeeded" | "failed" | "idle";
}

const initialState: ICounter = {
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "")?.user
      : null,
  status: "idle",
};

const resourceSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    userInfo: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetcResources.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetcResources.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetcResources.rejected, (state) => {
        state.status = "failed";
      });
  },
});

const fetcResources = createAsyncThunk("resource/get", async (code: string) => {
  const response = await getResource(code);
  return response?.data;
});

export const { userInfo } = resourceSlice.actions;

export default resourceSlice.reducer;
