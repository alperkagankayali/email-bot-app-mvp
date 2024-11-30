import { IVideoType } from "@/types/videoType";
import { Schema, Types, model, models } from "mongoose";

const videoSchema = new Schema<IVideoType>({
  title: { type: String, required: true },
  description: { type: String },
  videolink: { type: String },
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
  company: { type: Types.ObjectId, ref: "Company" },
});

const Video = models.Video || model<IVideoType>("Video", videoSchema);

export default Video;
