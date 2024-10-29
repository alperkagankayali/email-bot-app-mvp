import { ISuperAdmin } from "./superAdmingType";
import { IUser } from "./userType";

export type IPages = {
  pageName: string;
  url: string;
  isDelete: boolean;
  created_at: Date;
  author: ISuperAdmin;
};

export type IAuthorization = {
  page: IPages;
  role?: "user" | "admin";
  author?: IUser | ISuperAdmin;
  authorization?: IUser[];
  created_at: Date;
  isAuthorization:boolean
};
