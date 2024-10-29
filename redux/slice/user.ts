"use client";
import { IUserJWT } from "@/app/api/user/login/route";
import { getResource } from "@/services/service/generalService";
import { ISuperAdmin } from "@/types/superAdmingType";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface ICounter {
  user:  null | ISuperAdmin | IUserJWT;
  status: "loading" | "succeeded" | "failed" | "idle";
}

const initialState: ICounter = {
  user: typeof window !== "undefined" && JSON.parse(localStorage.getItem("user") || "{}")?.user,
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
