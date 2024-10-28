import { ISuperAdmin } from "./superAdmingType";
import { Types } from "mongoose";
export interface ICompany {
  companyName: string;
  logo: string;
  emailDomainAddress: string[];
  isDelete?: boolean;
  lisanceStartDate: Date;
  lisanceEndDate: Date;
  createdAt?: Date;
  author?: ISuperAdmin;
  _id?: Types.ObjectId;
}
