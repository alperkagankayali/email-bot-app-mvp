import { IUser } from "@/types/userType";
import { Schema, model, models } from "mongoose";

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  language: { type: String, required: true },
  department: { type: String },
  relationWithAdmin: {
    type: Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  userType: { type: String, default: "user" },
  password: { type: String },
});

const User = models.User || model<IUser>("User", userSchema);

export default User;
