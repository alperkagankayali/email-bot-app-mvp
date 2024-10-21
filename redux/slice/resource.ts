"use client";
import { getResource } from "@/services/service/generalService";
import { IResource } from "@/types/resourcesType";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface ICounter {
  resource: IResource;
  status: "loading" | "succeeded" | "failed" | "idle";
}

const initialState: ICounter = {
  resource: {
    pages: {
      Username: "Username",
      password: "Password",
    },
  },
  status: "idle",
};

const resourceSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    handleResourceChange: (state, action) => {
      state.resource = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetcResources.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetcResources.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.resource = action.payload;
      })
      .addCase(fetcResources.rejected, (state) => {
        state.status = "failed";
      });
  },
});

const fetcResources = createAsyncThunk(
  "resource/get",
  async (code: string) => {
    const response = await getResource(code);
    return !!response?.data ? response?.data : {};
  }
);

export const { handleResourceChange } = resourceSlice.actions;

export default resourceSlice.reducer;
