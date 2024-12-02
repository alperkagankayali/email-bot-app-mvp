import { INewsBlog } from "@/types/newsType";
import { Schema, Types, model, models } from "mongoose";

const newsBlogSchema = new Schema<INewsBlog>({
  headline: { type: String, required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  featuredImageUrl: { type: String, required: true },
  category: { type: String, required: true },
  tags: { type: [String], default: [] },
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
  isPublished: { type: Boolean, default: false },
});

const News = models.News || model<INewsBlog>("News", newsBlogSchema);

export default News;
