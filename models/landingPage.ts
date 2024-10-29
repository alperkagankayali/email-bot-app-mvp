import { ILandingPage } from "@/types/scenarioType";
import { Schema, Types, model, models } from "mongoose";

const newsSchema = new Schema<ILandingPage>({
  title: { type: String },
  img: { type: String },
  content: { type: String },
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

const LandingPage = models.DataEntry || model<ILandingPage>("LandingPage", newsSchema);

export default LandingPage;
