import { ICourse } from "@/types/courseType";
import { Schema, Types, model, models } from "mongoose";

const courseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  description: { type: String },
  img: { type: String },
  author: { type: Types.ObjectId, ref: "User" },
  created_at: { type: Date, default: Date.now },
  isDelete: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
  videos: [{ type: Types.ObjectId, ref: "Video" }],
  article: [{ type: Types.ObjectId, ref: "Article" }],
  quiz: [{ type: Types.ObjectId, ref: "Quiz" }],
});

const Course = models.Course || model<ICourse>("Course", courseSchema);

export default Course;
