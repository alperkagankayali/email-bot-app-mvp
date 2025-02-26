import { IScenario } from "@/types/scenarioType";
import { Schema, Types, model, models } from "mongoose";

const scenarioSchema = new Schema<IScenario>({
  title: { type: String, required: true },
  img: { type: String, },
  scenarioType: {
    type: Types.ObjectId,
    ref: "ScenarioType",
    required: true,
  },
  dataEntry: {
    type: Types.ObjectId,
    ref: "DataEntry",
  },
  emailTemplate: {
    type: Types.ObjectId,
    required: true,
    ref: "EmailTemplate",
  },
  landingPage: {
    type: Types.ObjectId,
    ref: "LandingPage",
  },
  created_at: { type: Date, default: Date.now() },
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
  isDelete: { type: Boolean, default: false },
  education: [{ type: Types.ObjectId, ref: "EducationList" }],
  language: { type: Types.ObjectId, ref: "Languages" },
  company: { type: Types.ObjectId, ref: "Company" },
});

const Scenario =
  models.Scenario || model<IScenario>("Scenario", scenarioSchema);

export default Scenario;

// adına ve type dile göre filtrele yukarıda totalCount gözükecek (20-28-36 limit - pagination)
