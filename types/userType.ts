import { ICampaign } from "./campaignType";

export interface IUser {
  name: string;
  lastName: string;
  email: string;
  language: string;
  department: string;
  userType: "admin" | "user" | "superadmin";
}

export interface IUserAction {
  userId: IUser;
  campaingId: ICampaign;
  action: "not_opened" | "opened" | "clicked" | "data_entered";
  actionDate: Date;
}


export interface IUserTrainingAssignment {
  userId: IUser,
  educationId: string,
}

export interface IUserTrainingHistory{
  userId: IUser,
  educationId: string,
  status: "not_completed" | "in_progress" | "completed"
  created_at:Date
}