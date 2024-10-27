import { IUser } from "@/types/userType";
import { Schema, model, models } from "mongoose";

const userSchema = new Schema<IUser>({
  nameSurname: { type: String, required: true },
  email: { type: String, required: true },
  language: { type: String, required: true },
  department: { type: String },
  company: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  role: { type: String, required: true },
  password: { type: String },
  isDelete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now() },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

const User = models.User || model<IUser>("User", userSchema);

export default User;
