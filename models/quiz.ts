import { IQuizType } from "@/types/quizType";
import { Schema, Types, model, models } from "mongoose";

const quizSchema = new Schema<IQuizType>({
  title: { type: String, required: true },
  description: { type: String },
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
  question: [
    {
      title: { type: String },
      options: [{ type: String }],
      answer: {
        type: [String], // Bu hem bir dizi hem de tek bir string kabul eder
        validate: {
          validator: function (value: any) {
            return typeof value === "string" || Array.isArray(value);
          },
          message: "Answer must be a string or an array of strings.",
        },
      },
      type: {
        type: String,
        enum: ["multiple", "single"],
        required: true,
      },
    },
  ],
  company: { type: Types.ObjectId, ref: "Company" },
  language: { type: Types.ObjectId, ref: "Languages" },
});

const Quiz = models.Quiz || model<IQuizType>("Quiz", quizSchema);

export default Quiz;
