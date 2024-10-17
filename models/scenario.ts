import { IScenario } from "@/types/scenarioType";
import { Schema, Types, model, models } from "mongoose";

const scenarioSchema = new Schema<IScenario>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  scenarioType: {
    type: String,
    enum: ["data_entry", "clickable_link"],
    required: true,
  },
  emailUrl: { type: String, required: true },
  landingPageUrl: { type: String, required: true },
  dataEntryPageUrl: { type: String },
  author: { type: Types.ObjectId, ref: "User" },
  created_at: { type: Date, default: Date.now() },
});

const Scenario =
  models.Scenario || model<IScenario>("Scenario", scenarioSchema);

export default Scenario;
