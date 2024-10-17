import { INews } from "@/types/newsType";
import { Schema, Types, model, models } from "mongoose";

const newsSchema = new Schema<INews>({
  headline: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  // Required: One reading material for each news
  readingMaterialUrl: { type: String, required: true },
  questionnaireType: {
    type: String,
    enum: ["action", "quiz"],
    required: true,
  },
  questionnaireUrl: { type: String, required: true },
  author: { type: Types.ObjectId, ref: "User" },
});

const News = models.News || model<INews>("News", newsSchema);

export default News;
