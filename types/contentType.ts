import { IUser } from "./userType";

export interface IContent {
  contentType: "video" | "quiz" | "reading";
  contentUrl: string;
  order: number;
  author:IUser
  created_at:Date
}
