import { IAdmin } from "@/types/adminType";
import { Schema, model, models } from "mongoose";

const adminSchema = new Schema<IAdmin>({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  language: { type: String, required: true },
  department: { type: String },
  company: { type: String },
  userType: {
    type: String,
    enum: ["admin", "superadmin"],
    required: true,
  },
  password: { type: String },
  lisanceStartDate: { type: Date, default: Date.now() },
  lisanceEndDate: { type: Date },
});

const Admin = models.Admin || model<IAdmin>("Admin", adminSchema);

export default Admin;
