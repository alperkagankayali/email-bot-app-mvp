import { ICourse } from "@/types/courseType";
import { Schema, Types, model, models } from "mongoose";

const courseSchema = new Schema<ICourse>({
    title: { type: String, required: true },
    description: { type: String },
    author: { type: Types.ObjectId, ref:"Admin" },
    created_at: { type: Date, default: Date.now },
    isPublished: { type: Boolean, default: false },
    contents: [{ type: Types.ObjectId, ref:"CourseContent" }],
});

const Course =
  models.Course || model<ICourse>("Course", courseSchema);

export default Course;
