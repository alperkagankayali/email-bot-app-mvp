import { IEmailTemplate } from "@/types/scenarioType";
import { Schema, Types, model, models } from "mongoose";

const newsSchema = new Schema<IEmailTemplate>({
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

const EmailTemplate = models.DataEntry || model<IEmailTemplate>("EmailTemplate", newsSchema);

export default EmailTemplate;