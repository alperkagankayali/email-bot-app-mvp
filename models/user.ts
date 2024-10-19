import { IUser } from "@/types/userType";
import { Schema, model, models } from "mongoose";

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  language: { type: String, required: true },
  department: { type: String },
  userType: {
    type: String,
    enum: ["user", "admin", "superadmin"],
    required: true,
  },
  password:{ type: String },
});

const User = models.User || model<IUser>("User", userSchema);

export default User;

