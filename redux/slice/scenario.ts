"use client";
import {
  getDataEntries,
  getEmailTemplate,
  getLandingPage,
  getScenario,
  getScenarioType,
} from "@/services/service/generalService";
import {
  IDataEntry,
  IEmailTemplate,
  ILandingPage,
  IScenario,
  IScenarioType,
} from "@/types/scenarioType";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { State } from "aws-sdk/clients/cloudwatchlogs";
interface ICounter {
  landingPageStatus: "loading" | "succeeded" | "failed" | "idle";
  emailTemplateStatus: "loading" | "succeeded" | "failed" | "idle";
  dataEntryStatus: "loading" | "succeeded" | "failed" | "idle";
  scenarioTypeStatus: "loading" | "succeeded" | "failed" | "idle";
  scenarioType: IScenarioType[] | null;
  landingPage: ILandingPage[] | null;
  emailTemplate: IEmailTemplate[] | null;
  dataEntries: IDataEntry[] | null;
  scenario: IScenario[] | null;
  status: "loading" | "succeeded" | "failed" | "idle";
  creteScenario: IScenario | null;
  emailTemplateTotalItem: number;
  scenarioTotalItem: number;
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
  scenario: null,
  status: "idle",
  creteScenario: null,
  emailTemplateTotalItem: 0,
  scenarioTotalItem: 0,
};

const resourceSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    handleChangeScenarioData: (state, action) => {
      state.creteScenario = action.payload;
    },
    handleChangeEmailData: (state, action) => {
      state.emailTemplate = action.payload;
    },
  },
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
        state.emailTemplateTotalItem = action.payload?.totalItems ?? 0;
        state.emailTemplate = action.payload.data;
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
    builder
      .addCase(fetchScenario.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchScenario.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.scenarioTotalItem = action.payload?.totalItems ?? 0;
        state.scenario = action.payload.data;
      })
      .addCase(fetchScenario.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const fetchScenario = createAsyncThunk(
  "/scenario",
  async (filter: any) => {
    const response = await getScenario(filter);
    return response;
  }
);

export const fetchLandingPage = createAsyncThunk("/landing-page", async () => {
  const response = await getLandingPage("");
  return response?.data;
});
export const fetchEmailTemplate = createAsyncThunk<any>(
  "/email-template",
  async () => {
    const response = await getEmailTemplate("");
    return response;
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
export const { handleChangeScenarioData, handleChangeEmailData } =
  resourceSlice.actions;

export default resourceSlice.reducer;
