import { ICompany } from "./companyType";
import { ILanguage } from "./languageType";
import { IUser } from "./userType";

export interface IArticleType {
  title: string;
  description: string;
  content: string;
  author: IUser;
  created_at: Date;
  isDelete: boolean;
  company: ICompany;
  authorType: "admin" | "superadmin";
  _id:string;
  language: ILanguage | string
}
