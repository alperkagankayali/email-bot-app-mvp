import { IScenario } from "./scenarioType";
import { ISuperAdmin } from "./superAdmingType";
import { IUser } from "./userType";

export interface ICampaign {
  title: string;
  description: string;
  userList: IUser[];
  scenario: IScenario;
  author: IUser | ISuperAdmin;
  created_at: Date;
  authorType: "admin" | "superadmin";
  isDelete?: boolean;
}
