import { ICompany } from "./companyType";
import { IEducationList } from "./educationListType";
import { ILanguage } from "./languageType";
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
  _id: string;
  education: IEducationList[];
  language: ILanguage;
}
export type ICreateScenarioType = {
  scenarioType: string;
  language: string;
  img: string;
  emailTemplate: string;
  landingPage: string;
  dataEntry: string;
  title: string;
};

export interface IDataEntry {
  title: string;
  img: string;
  content: string;
  isDelete?: boolean;
  author: IUser | ISuperAdmin;
  created_at: Date;
  authorType: string;
  company: ICompany;
  _id: string;
}
export interface IEmailTemplate {
  title: string;
  img: string;
  content: string;
  isDelete?: boolean;
  author: IUser | ISuperAdmin;
  created_at: Date;
  scenarioType: IScenarioType;
  authorType: string;
  company: ICompany;
  _id: string;
}
export interface ILandingPage {
  title: string;
  img: string;
  company: ICompany;
  content: string;
  isDelete?: boolean;
  author: IUser | ISuperAdmin;
  created_at: Date;
  authorType: string;
  _id?: string;
}
export interface IScenarioType {
  title: string;
  description: string;
  isDelete?: boolean;
  author: IUser | ISuperAdmin;
  created_at: Date;
  authorType: string;
  _id: string;
}
