import { ILanguage } from "@/types/languageType";
import { Schema, model, models } from "mongoose";

const languageSchema = new Schema<ILanguage>({
  code: { type: String, required: true },
  name: { type: String, required: true },
  isActive:  { type: Boolean, default:false},
  created_at: { type: Date, default: Date.now },
});

const Languages = models.Languages || model<ILanguage>("Languages", languageSchema);

export default Languages;
