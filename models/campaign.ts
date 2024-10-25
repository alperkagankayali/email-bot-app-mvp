import { ICampaign } from "@/types/campaignType";
import { Schema, model, models } from "mongoose";

const campaignSchema = new Schema<ICampaign>({
  title: { type: String, required: true },
  description: { type: String },
  userList: [
    {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  ],
  scenario: { type: Schema.Types.ObjectId, ref: "Scenario", required: true },
  author: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
  created_at: { type: Date, default: Date.now },
});

const Campaign = models.Campaign || model<ICampaign>("Campaign", campaignSchema);

export default Campaign;
