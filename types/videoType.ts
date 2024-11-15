import { IUser } from "./userType";

export interface IVideoType {
  title: string;
  description: string;
  videolink: string;
  author: IUser;
  created_at: Date;
  isDelete: boolean;
}
