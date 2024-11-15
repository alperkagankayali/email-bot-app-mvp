import { IUser } from "./userType";

export interface IArticleType {
  title: string;
  description: string;
  content: string;
  author: IUser;
  created_at: Date;
  isDelete: boolean;
}
