"use client";
import { getAllCamponies } from "@/services/service/generalService";
import { ICompany } from "@/types/companyType";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface ICounter {
  companies: ICompany[];
  status: "loading" | "succeeded" | "failed" | "idle";
}

const initialState: ICounter = {
  companies: [],
  status: "idle",
};

const companiesSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const fetchCompanies = createAsyncThunk("/company", async () => {
  const response = await getAllCamponies();
  return response.data;
});

export const {} = companiesSlice.actions;

export default companiesSlice.reducer;
