import { IAuthorization } from "@/types/pagesType";
import { Schema, Types, model, models } from "mongoose";

const newsSchema = new Schema<IAuthorization>({
  page: { type: Types.ObjectId, ref: "Page" },
  created_at: { type: Date, default: Date.now },
  role: { type: String, enum: ["user", "admin"] },
  authorization: [
    {
      type: Types.ObjectId,
      ref: "User",
    },
  ],
  author: { type: Types.ObjectId, ref: "User" },
  isAuthorization: { type: Boolean, required: true },
});

const Authorization =
  models.Authorization ||
  model<IAuthorization>("Authorization", newsSchema, "authorization");

export default Authorization;
