"use client";
import { getAllCamponies } from "@/services/service/generalService";
import { ICompany } from "@/types/companyType";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface CompaniesState {
  companies: ICompany[];
  status: "loading" | "succeeded" | "failed" | "idle";
  error: string | null;
  lastFetch: number | null;
}

const initialState: CompaniesState = {
  companies: [],
  status: "idle",
  error: null,
  lastFetch: null
};

// Cache süresi (5 dakika)
const CACHE_DURATION = 5 * 60 * 1000;

export const fetchCompanies = createAsyncThunk(
  "companies/fetchCompanies",
  async (_, { getState }) => {
    const state = getState() as { companies: CompaniesState };
    const now = Date.now();

    // Cache kontrolü
    if (
      state.companies.lastFetch &&
      now - state.companies.lastFetch < CACHE_DURATION &&
      state.companies.companies.length > 0
    ) {
      return state.companies.companies;
    }

    const response = await getAllCamponies(10, 1);
    return response.data;
  },
  {
    condition: (_, { getState }) => {
      const { companies } = getState() as { companies: CompaniesState };
      // Eğer yükleme devam ediyorsa yeni istek yapma
      if (companies.status === "loading") {
        return false;
      }
      return true;
    }
  }
);

const companiesSlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    clearCompanies: (state) => {
      state.companies = [];
      state.status = "idle";
      state.error = null;
      state.lastFetch = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.companies = action.payload;
        state.lastFetch = Date.now();
        state.error = null;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Bir hata oluştu";
      });
  },
});

export const { clearCompanies } = companiesSlice.actions;

export default companiesSlice.reducer;
