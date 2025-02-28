import { IDataEntry } from "@/types/scenarioType";
import { Schema, Types, model, models } from "mongoose";

const dataEntrySchema = new Schema<IDataEntry>({
  title: { type: String, required: true },
  img: { type: String },
  content: { type: String, required: true },
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
  company: { type: Types.ObjectId, ref: "Company" },
});

const DataEntry =
  models.DataEntry || model<IDataEntry>("DataEntry", dataEntrySchema);

export default DataEntry;
