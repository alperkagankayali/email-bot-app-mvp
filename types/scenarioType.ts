import { ISuperAdmin } from "./superAdmingType";
import { IUser } from "./userType";

export interface IScenario {
  title: string;
  img: string;
  dataEntry?: IDataEntry;
  emailTemplate?: IEmailTemplate;
  landingPage?: ILandingPage;
  isDelete?: boolean;
  author: IUser | ISuperAdmin;
  authorType: string;
  created_at: Date;
  scenarioType: IScenarioType;
  // description: string;
  // scenarioType: "data_entry" | "clickable_link";
  // emailUrl: string;
  // landingPageUrl: string;
  // dataEntryPageUrl: string;
  // author: IUser;
  // created_at: Date;
}

export interface IDataEntry {
  title: string;
  img: string;
  content: string;
  isDelete?: boolean;
  author: IUser | ISuperAdmin;
  created_at: Date;
  authorType: string;
}
export interface IEmailTemplate {
  title: string;
  img: string;
  content: string;
  isDelete?: boolean;
  author: IUser | ISuperAdmin;
  created_at: Date;
  authorType: string;
}
export interface ILandingPage {
  title: string;
  img: string;
  content: string;
  isDelete?: boolean;
  author: IUser | ISuperAdmin;
  created_at: Date;
  authorType: string;
}
export interface IScenarioType {
  title: string;
  description: string;
  isDelete?: boolean;
  author: IUser | ISuperAdmin;
  created_at: Date;
  authorType: string;
}
