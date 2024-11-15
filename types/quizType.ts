import { IUser } from "./userType";

export interface IQuizType {
  title: string;
  description: string;
  videolink: string;
  author: IUser;
  created_at: Date;
  isDelete: boolean;
  type: "multiple" | "single";
  question: IQuestion;
}

export type IQuestion = {
  title: string;
  options: string[];
  answer: string | string[];
};
