import { IVideoType } from "@/types/videoType";
import { Schema, Types, model, models } from "mongoose";

const videoSchema = new Schema<IVideoType>({
  title: { type: String, required: true },
  description: { type: String },
  videolink: { type: String },
  author: { type: Types.ObjectId, ref: "User" },
  created_at: { type: Date, default: Date.now },
  isDelete: { type: Boolean, default: false },
  company: { type: Types.ObjectId, ref: "Company" },
});

const Video = models.Video || model<IVideoType>("Video", videoSchema);

export default Video;
