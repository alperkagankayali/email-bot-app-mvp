import { Schema, model, models } from "mongoose";

const resourcesSchema = new Schema({
  pages: {
    type: Map,
    of: Map, // Her sayfa, kendi içinde başka bir Map (alt alanlar) içerecek
    required: true,
  },
});

const Resources =
  models.Resources || model("Resources", resourcesSchema);

export default Resources;
