import { ICompany } from "@/types/companyType";
import { Schema, model, models } from "mongoose";

const companySchema = new Schema<ICompany>({
  companyName: { type: String, required: true },
  emailDomainAddress: [{ type: String, required: true }],
  logo: { type: String },
  lisanceEndDate: { type: Date, required: true },
  lisanceStartDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now() },
  isDelete: { type: Boolean, default: false },
  author: { type: Schema.Types.ObjectId, ref: "superadmin" },
});

const Company = models.Company || model<ICompany>("Company", companySchema);

export default Company;
