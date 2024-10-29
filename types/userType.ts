import { ICampaign } from "./campaignType";
import { Types } from "mongoose";
import { ICompany } from "./companyType";
import { ICourse } from "./courseType";
export interface IUser {
  nameSurname: string;
  email: string;
  language: string;
  department: string;
  password: string;
  company?: ICompany;
  role: "user" | "admin";
  _id?: Types.ObjectId;
  isDelete?: boolean;
  createdAt?: Date;
  course?: ICourse;
  author?: IUser;
}

export interface IUserAction {
  userId: IUser;
  campaingId: ICampaign;
  action: "not_opened" | "opened" | "clicked" | "data_entered";
  actionDate: Date;
}

export interface IUserTrainingAssignment {
  userId: IUser;
  educationId: string;
}

export interface IUserTrainingHistory {
  userId: IUser;
  educationId: string;
  status: "not_completed" | "in_progress" | "completed";
  created_at: Date;
}
