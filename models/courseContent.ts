import { IContent } from "@/types/contentType";
import { Schema, Types, model, models } from "mongoose";

const courseContentSchema = new Schema<IContent>({
  contentType: {
    type: String,
    enum: ["video", "quiz", "reading"], // Allowed types
    required: true,
  },
  contentUrl: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  created_at: { type: Date, default: Date.now() },
  author: { type: Types.ObjectId, ref: "Admin" },
});

const CourseContent =
  models.CourseContent || model<IContent>("CourseContent", courseContentSchema);

export default CourseContent;
