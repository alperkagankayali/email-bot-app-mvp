import { ICampaign } from "@/types/campaignType";
import { Schema, model, Types, models } from "mongoose";

const campaignSchema = new Schema<ICampaign>({
  title: { type: String, required: true },
  description: { type: String },
  userList: [
    {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
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
  isActive: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  startDate: { type: Date},
  endDate: { type: Date },
  type: { type: String, enum: ["news", "education", "phishing"] },
  scenario: [{ type: Types.ObjectId, ref: "Scenario" }],
  news: { type: Types.ObjectId, ref: "News" },
  education: { type: Types.ObjectId, ref: "EducationList" },
});

const Campaign =
  models.Campaign || model<ICampaign>("Campaign", campaignSchema);

export default Campaign;
