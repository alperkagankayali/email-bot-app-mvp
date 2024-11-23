import { ICompany } from "./companyType";
import { IUser } from "./userType";

export interface IQuizType {
  title: string;
  description: string;
  author: IUser;
  created_at: Date;
  isDelete: boolean;
  question: IQuestion[];
  company: ICompany;
  _id: string;
}

export type IQuestion = {
  title: string;
  options: string[];
  answer: string[];
  type: "multiple" | "single";
};
