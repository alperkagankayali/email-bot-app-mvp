import { IEmailTemplate } from "@/types/scenarioType";
import { Schema, Types, model, models } from "mongoose";

const emailTemplateSchema = new Schema<IEmailTemplate>({
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
  company: { type: Types.ObjectId, ref: "Company" },
});

const EmailTemplate = models.EmailTemplate || model<IEmailTemplate>("EmailTemplate", emailTemplateSchema);

export default EmailTemplate;
