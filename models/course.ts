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
  company: { type: Types.ObjectId, ref: "Company" },
  contents: [
    {
      type: {
        type: String,
        enum: ["video", "quiz", "article"], // İçerik türü
        required: true,
      },
      refId: { type: Types.ObjectId, required: true, refPath: "contents.type" },
      order: { type: Number, required: true }, // Sıralama bilgisi
    },
  ],
});

const Course = models.Course || model<ICourse>("Course", courseSchema);

export default Course;
