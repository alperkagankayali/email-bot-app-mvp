import { IResourceDb } from "@/types/resourcesType";
import { Schema, model, models } from "mongoose";

const resourcesSchema = new Schema<IResourceDb>({
  code: { type: String },
  key: { type: String },
  value: { type: String },
});

const Resources =
  models.Resources || model<IResourceDb>("Resources", resourcesSchema);

export default Resources;
