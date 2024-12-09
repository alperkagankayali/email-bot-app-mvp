import { IEducationList } from "@/types/educationListType";
import { Schema, Types, model, models } from "mongoose";

const educationListSchema = new Schema<IEducationList>({
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
  created_at: { type: Date, default: Date.now },
  isDelete: { type: Boolean, default: false },
  company: { type: Types.ObjectId, ref: "Company" },
  educations: [
    {
      type: Types.ObjectId,
      ref: "Course",
      required: true,
    },
  ],
  languages: { type: [String], required: true },
});

const EducationList =
  models.EducationList ||
  model<IEducationList>("EducationList", educationListSchema);

export default EducationList;
