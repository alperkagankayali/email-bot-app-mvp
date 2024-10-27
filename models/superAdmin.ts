import { ISuperAdmin } from "@/types/superAdmingType";
import { Schema, model, models } from "mongoose";

const adminSchema = new Schema<ISuperAdmin>({
  nameSurname: { type: String, required: true },
  email: { type: String, required: true },
  language: { type: String },
  role: {
    type: String,
    enum: ["superadmin"],
    default: "superadmin",
    required: true,
  },
  password: { type: String },
  createdAt: { type: Date, default: Date.now() },
  isDelete: { type: Boolean, default: false },
});

const SuperAdmin = models.SuperAdmin || model<ISuperAdmin>("SuperAdmin", adminSchema, "superadmin");

export default SuperAdmin;
