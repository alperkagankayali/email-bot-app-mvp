import { IPages } from "@/types/pagesType";
import { Schema, Types, model, models } from "mongoose";

const newsSchema = new Schema<IPages>({
  pageName: { type: String,  },
  created_at: { type: Date, default: Date.now },
  url: { type: String, },
  isDelete: { type: Boolean, default:false },
  author: { type: Types.ObjectId, ref: "SuperAdmin" },
});

const Pages = models.Pages || model<Schema>("Pages", newsSchema);

export default Pages;