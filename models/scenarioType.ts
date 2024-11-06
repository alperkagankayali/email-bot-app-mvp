import { IScenarioType } from "@/types/scenarioType";
import { Schema, Types, model, models } from "mongoose";

const scenarioTypeSchema = new Schema<IScenarioType>({
  title: { type: String },
  description: { type: String },
  created_at: { type: Date, default: Date.now },
  isDelete: { type: Boolean, default: false },
  authorType: {
    type: String,
    required: true,
    enum: ["User", "superadmin"],
  },
  author: {
    type: Types.ObjectId,
    required: true,
    refPath: "authorType", 
  },
});

const ScenarioType = models.ScenarioType || model<IScenarioType>("ScenarioType", scenarioTypeSchema);

export default ScenarioType;
