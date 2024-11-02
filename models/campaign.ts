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
  scenario: { type: Types.ObjectId, ref: "Scenario", required: true },
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
  created_at: { type: Date, default: Date.now },
});

const Campaign =
  models.Campaign || model<ICampaign>("Campaign", campaignSchema);

export default Campaign;
