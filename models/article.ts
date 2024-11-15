import { IArticleType } from "@/types/articleType";
import { Schema, Types, model, models } from "mongoose";

const articleSchema = new Schema<IArticleType>({
  title: { type: String, required: true },
  description: { type: String },
  content: { type: String },
  author: { type: Types.ObjectId, ref: "User" },
  created_at: { type: Date, default: Date.now },
  isDelete: { type: Boolean, default: false },
  company: { type: Types.ObjectId, ref: "Company" },

});

const Article = models.Article || model<IArticleType>("Article", articleSchema);

export default Article;
