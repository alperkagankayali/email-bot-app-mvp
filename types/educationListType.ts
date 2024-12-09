import { ICompany } from "./companyType";
import { ICourse } from "./courseType";
import { IUser } from "./userType";
export interface IEducationList {
  author: IUser;
  created_at: Date;
  isPublished: boolean;
  isDelete: boolean;
  company: ICompany;
  authorType: "User" | "superadmin";
  _id: string;
  educations: ICourse[];
  languages: string[];
}
