import { IUser } from "./userType";

export interface INews {
  headline: string;
  created_at: Date;
  readingMaterialUrl: string;
  questionnaireType: "action" | "quiz";
  questionnaireUrl: string;
  author: IUser
}
