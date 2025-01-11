import { IEducationList } from "./educationListType";
import { INewsBlog } from "./newsType";
import { IScenario, IScenarioType } from "./scenarioType";
import { ISuperAdmin } from "./superAdmingType";
import { IUser } from "./userType";

export interface ICampaign {
  title: string;
  description: string;
  userList: IUser[];
  scenario: IScenario[];
  author: IUser | ISuperAdmin;
  created_at: Date;
  authorType: "admin" | "superadmin";
  isDelete?: boolean;
  isActive?: boolean;
  startDate: Date;
  endDate: Date;
  type: "news" | "education" | "phishing";
  news: INewsBlog;
  education: IEducationList;
  _id: string;
  isEducation: boolean;
  scenarioType: IScenarioType;
  availableDate: number;
}
