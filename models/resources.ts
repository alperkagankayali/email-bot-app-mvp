import { Schema, Types, model, models } from "mongoose";
interface IResource {
  [key: string]: string; // Dinamik anahtar-değer çiftleri
}
const resourcesSchema = new Schema(
  {
    code: { type: String },
  },
  { strict: false }
);

const Resources =
  models.Resources || model<IResource>("Resources", resourcesSchema);

export default Resources;
