import { languageCodeLists } from "@/constants";
import { ICourse } from "@/types/courseType";
import { Schema, Types, model, models } from "mongoose";

const courseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  description: { type: String },
  img: { type: String },
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
  created_at: { type: Date, default: Date.now },
  isDelete: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
  company: { type: Types.ObjectId, ref: "Company" },
  language: { type: String, enum: languageCodeLists, required: true },
  levelOfDifficulty: {
    type: String,
    enum: ["easy", "medium", "hard"], // İçerik türü
  },
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
