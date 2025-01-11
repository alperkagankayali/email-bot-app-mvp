"use client";

import { getCampaign } from "@/services/service/campaignService";
import { ICampaign } from "@/types/campaignType";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface ICampaignSlice {
  campaign: ICampaign[];
  status: "loading" | "succeeded" | "failed" | "idle";
  totalItems: number;
}

const initialState: ICampaignSlice = {
  campaign: [],
  status: "idle",
  totalItems: 0,
};

const campaignSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCampaign.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCampaign.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.totalItems = action.payload.totalItems ?? 0;
        state.campaign = action.payload.data;
      })
      .addCase(fetchCampaign.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const fetchCampaign = createAsyncThunk(
  "/campaign",
  async (pagination: any) => {
    const response = await getCampaign(
      pagination.limit ?? 10,
      pagination.page ?? 1,
      "",
      pagination.filter
    );
    return response;
  }
);

export const {} = campaignSlice.actions;

export default campaignSlice.reducer;
