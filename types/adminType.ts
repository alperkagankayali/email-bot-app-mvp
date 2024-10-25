import { ICampaign } from "./campaignType";
import { Types } from "mongoose";
export interface IAdmin {
  name: string;
  lastName: string;
  email: string;
  language: string;
  department: string;
  password: string;
  userType: "admin" | "superadmin";
  _id: Types.ObjectId;
  lisanceStartDate: Date;
  lisanceEndDate: Date;
  company: string;
}

export interface IUserAction {
  userId: IAdmin;
  campaingId: ICampaign;
  action: "not_opened" | "opened" | "clicked" | "data_entered";
  actionDate: Date;
}

export interface IUserTrainingAssignment {
  userId: IAdmin;
  educationId: string;
}

export interface IUserTrainingHistory {
  userId: IAdmin;
  educationId: string;
  status: "not_completed" | "in_progress" | "completed";
  created_at: Date;
}
