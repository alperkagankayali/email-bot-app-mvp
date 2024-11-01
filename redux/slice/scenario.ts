"use client";
import {
  getDataEntries,
  getEmailTemplate,
  getLandingPage,
  getScenarioType,
} from "@/services/service/generalService";
import {
  IDataEntry,
  IEmailTemplate,
  ILandingPage,
  IScenarioType,
} from "@/types/scenarioType";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface ICounter {
  landingPageStatus: "loading" | "succeeded" | "failed" | "idle";
  emailTemplateStatus: "loading" | "succeeded" | "failed" | "idle";
  dataEntryStatus: "loading" | "succeeded" | "failed" | "idle";
  scenarioTypeStatus: "loading" | "succeeded" | "failed" | "idle";
  scenarioType: IScenarioType[] | null;
  landingPage: ILandingPage[] | null;
  emailTemplate: IEmailTemplate[] | null;
  dataEntries: IDataEntry[] | null;
}

const initialState: ICounter = {
  landingPage: null,
  emailTemplate: null,
  emailTemplateStatus: "idle",
  dataEntries: null,
  dataEntryStatus: "idle",
  landingPageStatus: "idle",
  scenarioType: null,
  scenarioTypeStatus: "idle",
};

const resourceSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchLandingPage.pending, (state) => {
        state.landingPageStatus = "loading";
      })
      .addCase(fetchLandingPage.fulfilled, (state, action) => {
        state.landingPageStatus = "succeeded";
        state.landingPage = action.payload;
      })
      .addCase(fetchLandingPage.rejected, (state) => {
        state.landingPageStatus = "failed";
      });
    builder
      .addCase(fetchEmailTemplate.pending, (state) => {
        state.emailTemplateStatus = "loading";
      })
      .addCase(fetchEmailTemplate.fulfilled, (state, action) => {
        state.emailTemplateStatus = "succeeded";
        state.emailTemplate = action.payload;
      })
      .addCase(fetchEmailTemplate.rejected, (state) => {
        state.emailTemplateStatus = "failed";
      });
    builder
      .addCase(fetchDataEntry.pending, (state) => {
        state.dataEntryStatus = "loading";
      })
      .addCase(fetchDataEntry.fulfilled, (state, action) => {
        state.dataEntryStatus = "succeeded";
        state.dataEntries = action.payload;
      })
      .addCase(fetchDataEntry.rejected, (state) => {
        state.dataEntryStatus = "failed";
      });
    builder
      .addCase(fetchScenarioType.pending, (state) => {
        state.scenarioTypeStatus = "loading";
      })
      .addCase(fetchScenarioType.fulfilled, (state, action) => {
        state.scenarioTypeStatus = "succeeded";
        state.scenarioType = action.payload;
      })
      .addCase(fetchScenarioType.rejected, (state) => {
        state.scenarioTypeStatus = "failed";
      });
  },
});

// const fetchScenario = createAsyncThunk("resource/get", async () => {
//   const response = await getResource(code);
//   return response?.data;
// });

export const fetchLandingPage = createAsyncThunk("/landing-page", async () => {
  const response = await getLandingPage("");
  return response?.data;
});
export const fetchEmailTemplate = createAsyncThunk(
  "/email-template",
  async () => {
    const response = await getEmailTemplate("");
    return response?.data;
  }
);
export const fetchDataEntry = createAsyncThunk("/data-entry", async () => {
  const response = await getDataEntries("");
  return response?.data;
});
export const fetchScenarioType = createAsyncThunk(
  "/scenario-type",
  async () => {
    const response = await getScenarioType();
    return response?.data;
  }
);
export const {} = resourceSlice.actions;

export default resourceSlice.reducer;
